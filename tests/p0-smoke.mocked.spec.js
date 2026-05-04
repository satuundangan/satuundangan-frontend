import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

const approvedUser = {
  id: 101,
  name: 'Playwright User',
  email: 'playwright@test.com',
  isAdmin: false,
  isApproved: true,
}

const adminUser = {
  id: 1,
  name: 'Admin User',
  email: 'admin@test.com',
  isAdmin: true,
  isApproved: true,
}

const publicInvitationResponse = {
  id: 42,
  title: 'Pernikahan Adam & Hawa',
  slug: 'public-smoke',
  template_slug: 'dark-elegant',
  is_premium: true,
  is_published: true,
  content: {
    title: 'Pernikahan Adam & Hawa',
    slug: 'public-smoke',
    coupleName: 'Adam & Hawa',
    groomName: 'Adam Syahreza',
    brideName: 'Hawa Safira',
    guestName: 'Tamu Undangan',
    quoteText:
      'Dan di antara tanda-tanda-Nya ialah Dia menciptakan pasangan-pasangan untukmu.',
    quoteSource: 'QS. Ar-Rum: 21',
    photoCoupleUrl:
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop',
    bridePhotoUrl:
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    groomPhotoUrl:
      'https://images.unsplash.com/photo-1550005810-350a69771e23?q=80&w=1200&auto=format&fit=crop',
    dateTime: '2026-12-12T09:00:00.000Z',
    akadLocation: {
      mapUrl: 'https://maps.app.goo.gl/example',
      description: 'Masjid Agung',
      dateTime: '2026-12-12T08:00:00.000Z',
    },
    resepsiLocation: {
      mapUrl: 'https://maps.app.goo.gl/example',
      description: 'Ballroom Utama',
      dateTime: '2026-12-12T11:00:00.000Z',
    },
    parents: {
      brideParents: 'Bpk. Ahmad Safira & Ibu Siti Aminah',
      groomParents: 'Bpk. Yusuf Syahreza & Ibu Fatimah',
    },
    enableCover: true,
    enableGuestMessage: true,
    healthProtocol: false,
    selectedSections: ['hero', 'quote', 'couple', 'event', 'rsvp'],
  },
}

const checkoutInvitation = {
  id: 77,
  title: 'Checkout Gratis',
  slug: 'free-smoke',
  template_slug: 'dark-elegant',
  price: 0,
  is_premium: false,
  is_published: false,
  content: {
    coupleName: 'Putri & Pangeran',
    groomName: 'Pangeran',
    brideName: 'Putri',
    photoCoupleUrl: '',
    akadLocation: {
      dateTime: '2026-06-01T08:00:00',
    },
  },
}

function setToken(page, token = 'mock-token') {
  return page.addInitScript((value) => {
    localStorage.setItem('token', value)
  }, token)
}

async function mockCurrentUser(page, user) {
  await page.route('**/api/user/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(user),
    }),
  )
}

async function mockDashboardApis(page, invitations = []) {
  await page.route('**/api/invitation', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: invitations }),
    }),
  )

  await page.route('**/api/dashboard/stats', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          total_invitations: invitations.length,
          total_guests: 0,
          total_responses: 0,
        },
      }),
    }),
  )
}

async function mockAdminApis(page) {
  await page.route('**/api/admin/users**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [{ id: 1, name: 'User 1' }], total: 7 }),
    }),
  )
  await page.route('**/api/admin/invitations**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [{ id: 11, title: 'Wedding Smoke', slug: 'wedding-smoke', user: { name: 'Owner 1' } }],
        total: 12,
      }),
    }),
  )
  await page.route('**/api/admin/guests**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [], total: 21 }),
    }),
  )
  await page.route('**/api/admin/template-designs**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [], total: 9 }),
    }),
  )
}

async function mockPublicInvitationApis(page, invitation = publicInvitationResponse) {
  await page.route('**/api/invitation/slug/public-smoke', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(invitation),
    }),
  )
  await page.route('**/api/guest-messages**', (route) => {
    if (route.request().method() === 'POST') {
      return route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Message created successfully',
          data: {
            id: 1,
            guestName: 'Guest Smoke',
            message: 'Selamat ya',
          },
        }),
      })
    }

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [] }),
    })
  })
}

test.describe('P0 smoke suite (mocked)', () => {
  test('customer can login and reach dashboard', async ({ page }) => {
    await page.route('**/api/template-design**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] }),
      }),
    )
    await page.route('**/api/categories**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      }),
    )
    await page.route('**/api/auth/login', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ access_token: 'mock-token' }),
      }),
    )
    await mockCurrentUser(page, approvedUser)
    await mockDashboardApis(page, [])

    await page.goto(`${BASE_URL}/`)
    await page.getByRole('button', { name: /Masuk/i }).click({ force: true })
    await page.getByPlaceholder('nama@email.com').fill('playwright@test.com')
    await page.locator('input[type="password"]').fill('playwright123')
    await page.getByRole('button', { name: 'Masuk Sekarang' }).click({ force: true })

    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.getByText('Mulai Perjalananmu')).toBeVisible()
  })

  test('non-admin is redirected to admin login', async ({ page }) => {
    await setToken(page)
    await mockCurrentUser(page, approvedUser)

    await page.goto(`${BASE_URL}/admin`)

    await expect(page).toHaveURL(/\/admin\/login/)
    await expect(page.getByText('Admin Login')).toBeVisible()
  })

  test('admin can open admin dashboard', async ({ page }) => {
    await setToken(page)
    await mockCurrentUser(page, adminUser)
    await mockAdminApis(page)

    await page.goto(`${BASE_URL}/admin`)

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
    await expect(page.getByText('Total Pengguna')).toBeVisible()
    await expect(page.getByText('wedding-smoke')).toBeVisible()
  })

  test('guest can open public invitation and send RSVP', async ({ page }) => {
    await mockPublicInvitationApis(page)

    await page.goto(`${BASE_URL}/public-smoke?to=Guest%20Smoke`)

    await expect(page.getByText('Buka Undangan').first()).toBeVisible({ timeout: 15000 })
    await page.getByText('Buka Undangan').first().click({ force: true })

    await expect(page.getByRole('heading', { name: /Adam Syahreza & Hawa Safira/ })).toBeVisible({
      timeout: 15000,
    })
    await page.locator('#rsvp').scrollIntoViewIfNeeded()
    await page.getByPlaceholder(/Nama/i).first().fill('Guest Smoke')
    await page.locator('#rsvp input[type="radio"][value="hadir"]').evaluate((radio) => {
      radio.checked = true
      radio.dispatchEvent(new Event('change', { bubbles: true }))
    })
    await page.locator('textarea').first().fill('Selamat ya')
    const rsvpRequest = page.waitForRequest(
      (request) => request.method() === 'POST' && request.url().includes('/guest-messages'),
    )
    await page.locator('#rsvp form').evaluate((form) => form.requestSubmit())
    await rsvpRequest

    await expect(page.getByText(/berhasil|terkirim/i)).toBeVisible({ timeout: 15000 })
  })

  test('customer can complete free checkout and land on published invitation page', async ({ page }) => {
    await setToken(page)
    await mockCurrentUser(page, approvedUser)
    await page.route('**/api/invitation/my/slug/free-smoke', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(checkoutInvitation),
      }),
    )
    await page.route('**/api/payment/create', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ is_free: true }),
      }),
    )
    await page.route('**/api/invitation/slug/free-smoke', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...publicInvitationResponse,
          slug: 'free-smoke',
          title: 'Checkout Gratis',
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

    await page.goto(`${BASE_URL}/checkout?slug=free-smoke`)

    await expect(page.getByText('Ringkasan Pesanan')).toBeVisible({ timeout: 15000 })
    await page.getByRole('button', { name: 'Bayar Sekarang' }).click({ force: true })

    await expect(page).toHaveURL(/\/free-smoke$/)
    await expect(page.getByText('Buka Undangan').first()).toBeVisible({ timeout: 15000 })
  })

  test.skip('registered affiliate can see affiliate code', async ({ page }) => {
    await setToken(page)
    await mockCurrentUser(page, approvedUser)
    await page.route(/.*affiliate\/profile.*/, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          affiliateCode: 'AFFP0SMOKE',
          status: 'active',
          tier: 'bronze',
        }),
      }),
    )

    await page.goto(`${BASE_URL}/affiliate/register`)

    await expect(page.getByText('Kode Afiliasi Anda')).toBeVisible({ timeout: 15000 })
    await expect(page.getByText('AFFP0SMOKE')).toBeVisible()
  })
})
