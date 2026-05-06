import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

const user = {
  id: 101,
  name: 'Playwright User',
  email: 'playwright@test.com',
  isAdmin: false,
  isApproved: true,
}

const invitation = {
  id: 1,
  title: 'Core Flow Wedding',
  slug: 'core-flow-wedding',
  isPublished: true,
  is_published: true,
}

const checkoutInvitation = {
  id: 88,
  title: 'Paid Smoke',
  slug: 'paid-smoke',
  template_slug: 'dark-elegant',
  price: 49000,
  is_premium: true,
  is_published: false,
  content: {
    coupleName: 'Paid Couple',
    groomName: 'Paid Groom',
    brideName: 'Paid Bride',
    akadLocation: { dateTime: '2026-06-01T08:00:00' },
  },
}

async function setupAuth(page) {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-token')
  })

  await page.route('**/api/user/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(user),
    }),
  )
}

async function mockInvitations(page) {
  await page.route('**/api/invitation', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [invitation] }),
    }),
  )
}

test.describe('Core flows (mocked)', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page)
  })

  test('customer can add guest and open share message', async ({ page }) => {
    await mockInvitations(page)
    const guests = [
      {
        id: 10,
        name: 'Tamu Lama',
        group: 'VIP',
        phoneNumber: '081111111111',
        rsvpStatus: 'hadir',
      },
    ]

    await page.route('**/api/guests/invitation/1', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: guests }),
      }),
    )
    await page.route('**/api/guests', (route) => {
      if (route.request().method() !== 'POST') return route.fallback()
      guests.push({
        id: 11,
        name: 'Tamu Baru',
        group: 'Keluarga',
        phoneNumber: '08123456789',
        rsvpStatus: null,
      })
      return route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })
    await page.route(/.*\/api\/guests\/\d+\/share.*/, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Halo Tamu Lama, buka undangan: http://localhost:5173/inv/core-flow-wedding/tamu-lama',
        }),
      }),
    )

    await page.goto(`${BASE_URL}/guests`)

    await expect(page.getByText('Manajemen Tamu')).toBeVisible()
    await expect(page.getByText('Tamu Lama').first()).toBeVisible()
    await page.getByRole('button', { name: /Tambah Tamu/i }).click()
    await page.getByPlaceholder('Misal: Budi Santoso').fill('Tamu Baru')
    await page.getByPlaceholder('08123456789').fill('08123456789')
    await page.getByRole('button', { name: 'Simpan Tamu' }).click()

    await expect(page.getByText('Tamu Baru').first()).toBeVisible({ timeout: 10000 })
    await page.getByTitle('Kirim WA').first().click()
    await expect(page.locator('textarea').last()).toHaveValue(/Halo Tamu Lama/, { timeout: 10000 })
  })

  test('customer can view guestbook messages', async ({ page }) => {
    await mockInvitations(page)
    await page.route('**/api/guest-messages/invitation/1', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 1,
              guestName: 'Tamu RSVP',
              message: 'Selamat menempuh hidup baru',
              rsvpStatus: 'hadir',
              createdAt: '2026-05-01T10:00:00.000Z',
            },
          ],
        }),
      }),
    )

    await page.goto(`${BASE_URL}/guestbook`)

    await expect(page.getByText('Daftar Ucapan')).toBeVisible()
    await expect(page.getByText('Tamu RSVP')).toBeVisible()
    await expect(page.getByText('Selamat menempuh hidup baru')).toBeVisible()
  })

  test('checkout applies promo and affiliate code before payment request', async ({ page }) => {
    await page.route('**/api/invitation/my/slug/paid-smoke', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(checkoutInvitation),
      }),
    )
    await page.route('**/api/promo/validate', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            code: 'NIKAH50',
            discount_type: 'percentage',
            discount_value: 50,
            original_price: 49000,
            discount_amount: 24500,
            final_price: 24500,
          },
        }),
      }),
    )
    await page.route('**/api/affiliate/validate', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ valid: true }),
      }),
    )
    await page.route('**/api/invitation/slug/paid-smoke', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...checkoutInvitation,
          is_published: true,
        }),
      }),
    )
    await page.route('**/api/guest-messages/invitation/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [] }),
      }),
    )

    let paymentBody = null
    await page.route('**/api/payment/create', (route) => {
      paymentBody = JSON.parse(route.request().postData() || '{}')
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ is_free: true }),
      })
    })

    await page.goto(`${BASE_URL}/checkout?slug=paid-smoke&ref=AFFCODE`)

    await expect(page.getByText('Ringkasan Pesanan')).toBeVisible({ timeout: 15000 })
    await page.getByPlaceholder('Kode Promo').fill('NIKAH50')
    await page.getByRole('button', { name: 'Pakai' }).first().click()
    await expect(page.getByText('NIKAH50')).toBeVisible()
    await page.getByRole('button', { name: 'Pakai' }).first().click()
    await expect(page.getByText('AFFCODE')).toBeVisible()
    await page.getByRole('button', { name: 'Bayar Sekarang' }).click()

    expect(paymentBody).toEqual({
      invitation_id: 88,
      promo_code: 'NIKAH50',
      affiliate_code: 'AFFCODE',
    })
  })

  test('payment finish page renders backend-confirmed success', async ({ page }) => {
    await page.route('**/api/payment/status/INV-CORE-1', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          orderId: 'INV-CORE-1',
          status: 'success',
          invitationSlug: 'core-flow-wedding',
        }),
      }),
    )

    await page.goto(`${BASE_URL}/payment/finish?order_id=INV-CORE-1&transaction_status=settlement&status_code=200`)

    await expect(page.getByText('Pembayaran Berhasil')).toBeVisible({ timeout: 15000 })
    await expect(page.getByText('success (terkonfirmasi)')).toBeVisible()
    await expect(page.getByRole('button', { name: /Lihat Undangan/i })).toBeVisible()
  })
})
