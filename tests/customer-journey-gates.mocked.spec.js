import { test, expect } from '@playwright/test'

const baseUrl = process.env.E2E_BASE_URL || 'http://localhost:5173'

test('checkout remembers the draft package through email verification', async ({ page }) => {
  let verified = false

  await page.addInitScript(() => localStorage.setItem('token', 'mock-token'))
  await page.route('**/api/user/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        name: 'Test Customer',
        email: 'customer@example.test',
        isApproved: true,
        emailVerifiedAt: verified ? '2026-10-26T00:00:00.000Z' : null,
      }),
    }),
  )
  await page.route('**/api/payment/packages', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'basic', label: 'Basic', price: 49000 },
        { id: 'premium', label: 'Premium', price: 79000 },
      ]),
    }),
  )
  await page.route('**/api/invitation/my/slug/test-undangan', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 42,
        slug: 'test-undangan',
        package: 'basic',
        template_slug: 'dark-elegant',
        isPublished: false,
        content: {},
      }),
    }),
  )

  await page.goto(`${baseUrl}/checkout?slug=test-undangan`)
  await expect(page.getByText('Basic Invitation')).toBeVisible()
  await page.getByRole('button', { name: 'Bayar Sekarang' }).click()

  await expect(page).toHaveURL(/\/settings$/)
  await expect(page.getByText('Lanjutkan pembayaran undangan')).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('pendingCheckoutPath'))).toBe(
    '/checkout?slug=test-undangan&package=basic',
  )

  verified = true
  await page.getByRole('button', { name: 'Saya Sudah Verifikasi' }).click()
  await page.getByRole('button', { name: 'Lanjutkan Pembayaran' }).click()
  await expect(page).toHaveURL(/\/checkout\?slug=test-undangan&package=basic$/)
  await expect(page.getByText('Basic Invitation')).toBeVisible()
})

test('Google login callback resumes the selected invitation checkout', async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem('redirect_after_login', '/checkout?slug=test-undangan&package=basic'),
  )
  await page.route('**/api/user/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        name: 'Google Customer',
        email: 'google@example.test',
        provider: 'google',
        isApproved: true,
        emailVerifiedAt: null,
      }),
    }),
  )
  await page.route('**/api/payment/packages', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: 'basic', label: 'Basic', price: 49000 }]),
    }),
  )
  await page.route('**/api/invitation/my/slug/test-undangan', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 42, slug: 'test-undangan', package: 'basic', isPublished: false, content: {} }),
    }),
  )

  await page.goto(`${baseUrl}/auth/callback?token=mock-google-token`)
  await expect(page).toHaveURL(/\/checkout\?slug=test-undangan&package=basic$/)
  await expect(page.getByText('Basic Invitation')).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('token'))).toBe('mock-google-token')
})

test('checkout never presents a missing package price as free', async ({ page }) => {
  let packageAvailable = false
  await page.addInitScript(() => localStorage.setItem('token', 'mock-token'))
  await page.route('**/api/user/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 1, name: 'Test Customer', isApproved: true, emailVerifiedAt: '2026-10-26T00:00:00.000Z' }),
    }),
  )
  await page.route('**/api/payment/packages', (route) =>
    route.fulfill({
      status: packageAvailable ? 200 : 503,
      contentType: 'application/json',
      body: JSON.stringify(packageAvailable ? [{ id: 'basic', label: 'Basic', price: 49000 }] : { message: 'Unavailable' }),
    }),
  )
  await page.route('**/api/invitation/my/slug/test-undangan', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 42, slug: 'test-undangan', package: 'basic', isPublished: false, content: {} }),
    }),
  )

  await page.goto(`${baseUrl}/checkout?slug=test-undangan`)
  await expect(page.getByText('Paket dan harga belum dapat dimuat.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Bayar Sekarang' })).toBeDisabled()
  await expect(page.getByText('GRATIS', { exact: true })).toHaveCount(0)

  packageAvailable = true
  await page.getByRole('button', { name: 'Coba Lagi' }).click()
  await expect(page.getByText('Basic Invitation')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Bayar Sekarang' })).toBeEnabled()
})

test('Midtrans success waits for backend confirmation before showing share action', async ({ page }) => {
  await page.route('**/api/payment/status/order-1', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'pending', invitationSlug: 'test-undangan' }),
    }),
  )

  await page.goto(`${baseUrl}/payment/finish?order_id=order-1&transaction_status=settlement`)
  await expect(page.getByRole('heading', { name: 'Pembayaran Diproses' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Tambah Tamu & Bagikan' })).toHaveCount(0)
})

test('confirmed payment leads to guest management for the paid invitation', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('token', 'mock-token'))
  await page.route('**/api/user/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        name: 'Test Customer',
        email: 'customer@example.test',
        isApproved: true,
        emailVerifiedAt: '2026-10-26T00:00:00.000Z',
      }),
    }),
  )
  await page.route('**/api/payment/status/order-2', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'success', invitationSlug: 'test-undangan' }),
    }),
  )
  await page.route('**/api/invitation', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, title: 'Undangan Lain', slug: 'undangan-lain', isPublished: true, package: 'basic' },
        { id: 42, title: 'Undangan Dibayar', slug: 'test-undangan', isPublished: true, package: 'basic' },
      ]),
    }),
  )
  await page.route('**/api/guests/invitation/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  )

  await page.goto(`${baseUrl}/payment/finish?order_id=order-2`)
  await page.getByRole('button', { name: 'Tambah Tamu & Bagikan' }).click()
  await expect(page).toHaveURL(/\/guests\?slug=test-undangan$/)
  await expect(page.getByRole('combobox').first()).toHaveValue('42')
})

test('preview edits the invitation identified by its slug', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('token', 'mock-token'))
  await page.route('**/api/user/me', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 1, name: 'Test Customer', isApproved: true }),
    }),
  )
  await page.route('**/api/invitation/my/slug/test-undangan', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 42, slug: 'test-undangan', isPublished: false, content: {} }),
    }),
  )

  await page.goto(`${baseUrl}/preview?slug=test-undangan`)
  await page.getByRole('button', { name: 'Edit Data' }).click()
  await expect(page).toHaveURL(/\/invitation\/42\/edit$/)
})
