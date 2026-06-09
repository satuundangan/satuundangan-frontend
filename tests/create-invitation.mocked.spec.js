import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

const approvedUser = {
  id: 101,
  name: 'Playwright User',
  email: 'playwright@test.com',
  isAdmin: false,
  isApproved: true,
  emailVerifiedAt: '2026-06-06T00:00:00.000Z',
}

const mockTemplate = {
  id: 1,
  name: 'Template 1',
  slug: 'template-1',
  price: 0,
  isPremium: false,
  thumbnailUrl: 'https://via.placeholder.com/150',
  sections: [
    {
      id: 1,
      is_enabled: true,
      order: 0,
      section: {
        id: 'sec-1',
        label: 'Quote',
        key: 'quote',
        is_active: true
      }
    },
    {
      id: 2,
      is_enabled: true,
      order: 1,
      section: {
        id: 'sec-2',
        label: 'Foto Utama',
        key: 'photoCouple',
        is_active: true
      }
    }
  ],
}

test.describe('Create Invitation Flow (Mocked)', () => {
  test('customer can fill creation form in Studio Editor and submit', async ({ page }) => {
    page.on('console', (msg) => {
      console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`)
    })
    page.on('pageerror', (err) => {
      console.error(`[BROWSER ERROR] ${err.stack || err.message}`)
    })

    // Mock APIs
    await page.route('**/api/user/me', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(approvedUser),
      }),
    )

    await page.route('**/api/template-design**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [mockTemplate] }),
      }),
    )

    await page.route('**/api/categories**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ key: 'gratis', label: 'Gratis' }]),
      }),
    )

    await page.route('**/api/invitation', (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 99, slug: 'test-invitation' }),
        })
      }
      return route.fulfill({ status: 200, body: JSON.stringify({ data: [] }) })
    })

    await page.route('**/api/invitation/my/slug/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 99, slug: 'test-invitation' }),
      }),
    )

    await page.route('**/api/upload', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ fileUrl: 'https://via.placeholder.com/100' }),
      }),
    )

    // Setup LocalStorage
    await page.addInitScript((tpl) => {
      localStorage.setItem('token', 'mock-token')
      localStorage.setItem('selectedTemplate', JSON.stringify(tpl))
    }, mockTemplate)

    // Go to Studio Editor
    await page.goto(`${BASE_URL}/create`)
    await expect(page.getByText('Studio Editor')).toBeVisible({ timeout: 15000 })

    // Tab 1: Fitur (Active by default)
    // Switch to Tab 2: Mempelai
    await page.getByRole('button', { name: /Mempelai/i }).click()

    // Fill Title / Slug
    await page.getByPlaceholder('Contoh: The Wedding of Putri & Pangeran').fill('Wedding of Adam & Eve')

    // Fill Mempelai Details
    await page.getByPlaceholder('Putri Diana').fill('Eve')
    await page.getByPlaceholder('Bpk. ... & Ibu ...').first().fill('Bpk. A & Ibu B')
    await page.getByPlaceholder('Pangeran Charles').fill('Adam')
    await page.getByPlaceholder('Bpk. ... & Ibu ...').last().fill('Bpk. C & Ibu D')

    // Upload Mempelai photos (Bride and Groom) and confirm crop
    const brideFakeImage = {
      name: 'bride.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-image-data'),
    }
    const groomFakeImage = {
      name: 'groom.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-image-data'),
    }
    await page.locator('input[id="bridePhoto"]').setInputFiles(brideFakeImage)
    await page.getByRole('button', { name: 'Simpan & Gunakan' }).click()
    await page.waitForTimeout(500)

    await page.locator('input[id="groomPhoto"]').setInputFiles(groomFakeImage)
    await page.getByRole('button', { name: 'Simpan & Gunakan' }).click()
    await page.waitForTimeout(500)

    // Switch to Tab 3: Acara
    await page.getByRole('button', { name: /Acara/i }).click()

    // Fill Acara details
    await page.getByText('Satu Lokasi').click()
    await page.locator('input[type="datetime-local"]').first().fill('2026-12-12T09:00')
    await page.getByPlaceholder(/https:\/\/maps.app.goo.gl/i).fill('https://maps.app.goo.gl/abc')

    // Switch to Tab 4: Media
    await page.getByRole('button', { name: /Media/i }).click()

    // Upload Cover Photo and confirm crop
    const coupleFakeImage = {
      name: 'couple.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-image-data'),
    }
    await page.locator('input[id="couplePhoto"]').setInputFiles(coupleFakeImage)
    await page.getByRole('button', { name: 'Simpan & Gunakan' }).click()
    await page.waitForTimeout(500)

    // Submit / Save
    const createRequest = page.waitForRequest(
      (r) => r.url().includes('/api/invitation') && r.method() === 'POST',
    )
    await page.getByRole('button', { name: /Simpan & Preview/i }).click()
    await createRequest

    // Expect to be redirected to preview page
    await expect(page).toHaveURL(/\/preview\?slug=test-invitation/)

    // Click 'Lanjut Pembayaran' or 'Simpan Perubahan' to go to checkout page
    await page.locator('button:has-text("Lanjut Pembayaran"), button:has-text("Simpan Perubahan")').click()

    // Expect to be redirected to checkout page
    await expect(page).toHaveURL(/\/checkout\?slug=test-invitation/)
  })
})
