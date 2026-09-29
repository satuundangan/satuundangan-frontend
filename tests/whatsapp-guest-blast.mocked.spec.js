import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

const mockUser = {
  id: 101,
  name: 'Playwright Bride',
  email: 'bride@satuundangan.test',
  isAdmin: false,
  isApproved: true,
  emailVerifiedAt: '2026-06-06T00:00:00.000Z',
}

const mockInvitation = {
  id: 12,
  title: 'Pernikahan Romeo & Juliet',
  slug: 'romeo-juliet',
  coupleName: 'Romeo & Juliet',
  groomName: 'Romeo',
  brideName: 'Juliet',
  isPublished: true,
  is_published: true,
  package: 'premium',
  whatsappMessageTemplate: 'Halo [GuestName], kami mengundangmu ke pernikahan [CoupleName]. Detail: [Link]',
}

const initialGuests = [
  {
    id: 1,
    name: 'Budi Santoso',
    phoneNumber: '08123456789',
    group: 'Keluarga',
    statusSend: 'sent',
    rsvpStatus: 'hadir',
    accessToken: 'token-budi-1',
    invitationId: 12,
  },
  {
    id: 2,
    name: 'Ani Wijaya',
    phoneNumber: '081388889999',
    group: 'Teman',
    statusSend: null,
    rsvpStatus: 'belum',
    accessToken: 'token-ani-2',
    invitationId: 12,
  },
  {
    id: 3,
    name: 'Citra Kirana',
    phoneNumber: '+628159999111',
    group: 'VIP',
    statusSend: 'unsent',
    rsvpStatus: 'belum',
    accessToken: 'token-citra-3',
    invitationId: 12,
  },
]

async function setupMocks(page, currentGuests) {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-qa-token')
  })

  // Clean API-only request interceptor that ignores source files and static assets
  await page.route('**/*', (route) => {
    const url = route.request().url()
    const method = route.request().method()

    // Pass through all Vite module scripts, Vue SFCs, and styles
    if (
      url.endsWith('.js') ||
      url.endsWith('.vue') ||
      url.endsWith('.css') ||
      url.includes('.vue?') ||
      url.includes('/@') ||
      url.includes('node_modules')
    ) {
      return route.fallback()
    }

    // User profile
    if (url.includes('/user/me')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser),
      })
    }

    // Guests list by invitation (must be checked BEFORE /invitation)
    if (url.includes('/guests/invitation')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: currentGuests }),
      })
    }

    // Invitations list
    if (url.includes('/invitation')) {
      if (method === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [mockInvitation] }),
        })
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    }

    // PATCH guest status
    if (url.match(/\/guests\/\d+/)) {
      if (method === 'PATCH') {
        const guestId = parseInt(url.split('/').pop(), 10)
        const patchData = JSON.parse(route.request().postData() || '{}')
        const target = currentGuests.find((g) => g.id === guestId)
        if (target) {
          Object.assign(target, patchData)
        }
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, data: target }),
        })
      }
    }

    return route.fallback()
  })
}

test.describe('WhatsApp Guest Blast & Link Distribution E2E Journey', () => {
  test('verifies state management, filtering, queue assistant and template preview', async ({ page }) => {
    const guests = JSON.parse(JSON.stringify(initialGuests))
    await setupMocks(page, guests)

    await page.goto(`${BASE_URL}/guests`)

    // Wait for guests table to be visible
    await expect(page.getByText('Manajemen Tamu')).toBeVisible()
    await expect(page.getByText('Budi Santoso').first()).toBeVisible()
    await expect(page.getByText('Ani Wijaya').first()).toBeVisible()
    await expect(page.getByText('Citra Kirana').first()).toBeVisible()

    // 1. Verify Counters
    // Total: 3, Sent: 1 (Budi), Unsent: 2 (Ani, Citra)
    await expect(page.getByText('1 sudah terkirim')).toBeVisible()
    await expect(page.getByText('2 belum terkirim')).toBeVisible()

    // 2. Status Filtering
    // Filter "Belum Terkirim"
    await page.getByRole('button', { name: /Belum Terkirim/i }).first().click()
    await expect(page.getByText('Ani Wijaya').first()).toBeVisible()
    await expect(page.getByText('Citra Kirana').first()).toBeVisible()
    await expect(page.locator('table').getByText('Budi Santoso')).not.toBeVisible()

    // Filter "Sudah Terkirim"
    await page.getByRole('button', { name: /Sudah Terkirim/i }).first().click()
    await expect(page.getByText('Budi Santoso').first()).toBeVisible()
    await expect(page.locator('table').getByText('Ani Wijaya')).not.toBeVisible()
    await expect(page.locator('table').getByText('Citra Kirana')).not.toBeVisible()

    // Back to "Semua"
    await page.getByRole('button', { name: /^Semua/i }).first().click()
    await expect(page.getByText('Budi Santoso').first()).toBeVisible()
    await expect(page.getByText('Ani Wijaya').first()).toBeVisible()

    // 3. Status Toggle (Optimistic Update)
    const aniRow = page.locator('tbody tr', { hasText: 'Ani Wijaya' })
    const toggleAniBtn = aniRow.locator('button', { hasText: 'Belum Terkirim' })
    await toggleAniBtn.click()

    // Ani is now sent! Sent counter should update to 2, unsent to 1
    await expect(page.getByText('2 sudah terkirim')).toBeVisible()
    await expect(page.getByText('1 belum terkirim')).toBeVisible()

    // 4. Open Queue Runner (Asisten Sebar WhatsApp)
    const startBlastBtn = page.getByRole('button', { name: /Mulai Sebar WhatsApp/i })
    await startBlastBtn.click()

    // Queue Modal should open
    await expect(page.getByRole('heading', { name: 'Asisten Sebar WhatsApp' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Citra Kirana' })).toBeVisible()

    // Check placeholder replacements in WhatsApp message bubble
    const previewBubble = page.locator('.whitespace-pre-wrap')
    await expect(previewBubble).toContainText('Halo Citra Kirana')
    await expect(previewBubble).toContainText('Romeo & Juliet')
    await expect(previewBubble).toContainText('/inv/romeo-juliet/token-citra-3')

    // Click "Tandai Saja"
    await page.getByRole('button', { name: /Tandai Saja/i }).click()

    // Queue reaches 100% complete state
    await expect(page.getByText('Semua Undangan Terkirim! 🎉')).toBeVisible()
    await page.getByRole('button', { name: /Selesai & Tutup/i }).click()

    // 5. Verify Template Modal
    await page.getByRole('button', { name: /Template Pesan/i }).click()
    await expect(page.getByText('Formal Islami')).toBeVisible()
    await expect(page.getByText('Nasional & Santai')).toBeVisible()
    await expect(page.getByText('Adat & Sopan')).toBeVisible()
    await expect(page.getByText('Singkat / Ringkas')).toBeVisible()

    // Click "Nasional & Santai" preset
    await page.locator('button', { hasText: 'Nasional & Santai' }).click()
    // Verify template preview reflects the preset
    await expect(page.getByText('Dengan penuh sukacita dan rasa bahagia')).toBeVisible()
    await page.getByRole('button', { name: 'Batal' }).click()

    // 6. Verify Salin Link Modal
    await page.getByTitle('Salin Daftar Link Seluruh Tamu').click()
    await expect(page.getByText('Salin Daftar Link Undangan')).toBeVisible()
    await expect(page.locator('textarea')).toBeVisible()
    await page.getByRole('button', { name: 'Tutup' }).click()
  })
})
