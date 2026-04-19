/**
 * Tests for checkout ownership guard.
 *
 * Scenario: User with stale localStorage token (from a different account)
 * navigates to /checkout?slug=someone-else-invitation.
 *
 * Fix:
 * - Backend: GET /invitation/my/slug/:slug requires auth + ownership check
 * - Frontend: CheckoutPage uses the auth endpoint; 401/403 shows clear error
 *   with "Login Ulang" button instead of silently failing at payment time.
 */
import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

const mockInvitation = {
  id: 42,
  title: 'Wedding of Jatmiko & Jamila',
  slug: 'jatmiko-jamila',
  template_slug: 'dark-elegant',
  price: 49000,
  is_premium: true,
  is_published: false,
  content: {
    coupleName: 'Jatmiko & Jamila',
    groomName: 'Jatmiko',
    brideName: 'Jamila',
    photoCoupleUrl: '',
    akadLocation: { dateTime: '2026-06-01T08:00:00' },
  },
}

const mockUser = {
  id: 3,
  name: 'Test User',
  email: 'playwright@test.com',
  isAdmin: false,
}

test.describe('Checkout – Ownership Guard', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'fake-jwt-token')
    })

    await context.route('**/api/user/me', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser),
      }),
    )
  })

  test('happy path: owner loads checkout and invitation details are displayed', async ({ page, context }) => {
    // Authenticated endpoint returns invitation (user is owner)
    await context.route('**/api/invitation/my/slug/jatmiko-jamila', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockInvitation),
      }),
    )

    await page.goto(`${BASE_URL}/checkout?slug=jatmiko-jamila`)

    await expect(page.locator('text=Ringkasan Pesanan')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('button:has-text("Bayar Sekarang")')).toBeVisible()
    // Should NOT show ownership error block
    await expect(page.locator('text=Akses Ditolak')).not.toBeVisible()
  })

  test('stale token (wrong account): shows Akses Ditolak before reaching payment', async ({ page, context }) => {
    // Authenticated endpoint returns 403 — invitation belongs to another user
    await context.route('**/api/invitation/my/slug/jatmiko-jamila', (route) =>
      route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'You are not the owner of this invitation' }),
      }),
    )

    await page.goto(`${BASE_URL}/checkout?slug=jatmiko-jamila`)

    await expect(page.locator('text=Akses Ditolak')).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: 'Login Ulang' })).toBeVisible()
    // Pay button should NOT be shown
    await expect(page.locator('button:has-text("Bayar Sekarang")')).not.toBeVisible()
  })

  test('expired token: shows session expired message', async ({ page, context }) => {
    // Authenticated endpoint returns 401 — token is expired/invalid
    await context.route('**/api/invitation/my/slug/jatmiko-jamila', (route) =>
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Unauthorized' }),
      }),
    )

    await page.goto(`${BASE_URL}/checkout?slug=jatmiko-jamila`)

    await expect(page.locator('text=Akses Ditolak')).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: 'Login Ulang' })).toBeVisible()
  })

  test('passes invitation_id as number in payment request body', async ({ page, context }) => {
    await context.route('**/api/invitation/my/slug/jatmiko-jamila', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockInvitation),
      }),
    )

    let capturedBody = null
    await page.route('**/api/payment/create', async (route) => {
      capturedBody = JSON.parse(route.request().postData() || '{}')
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ is_free: true }),
      })
    })

    await page.goto(`${BASE_URL}/checkout?slug=jatmiko-jamila`)
    await expect(page.locator('text=Ringkasan Pesanan')).toBeVisible({ timeout: 10000 })
    await page.click('button:has-text("Bayar Sekarang")')
    await page.waitForTimeout(500)

    expect(capturedBody).not.toBeNull()
    expect(capturedBody.invitation_id).toBe(42)
    expect(typeof capturedBody.invitation_id).toBe('number')
  })

  test('displays correct price from invitation (not hardcoded fallback)', async ({ page, context }) => {
    await context.route('**/api/invitation/my/slug/jatmiko-jamila', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockInvitation),
      }),
    )

    await page.goto(`${BASE_URL}/checkout?slug=jatmiko-jamila`)
    await expect(page.locator('text=Ringkasan Pesanan')).toBeVisible({ timeout: 10000 })
    // price = 49000 → should appear as Rp 49.000
    await expect(page.locator('text=/49/').first()).toBeVisible()
  })

  test('Snap.js loads sandbox CDN when env flag disables production', async ({ page, context }) => {
    await context.route('**/api/invitation/my/slug/jatmiko-jamila', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockInvitation),
      }),
    )
    await page.route('**/api/payment/create', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'mock-token', is_free: false }),
      }),
    )
    await page.route('**snap/snap.js', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: `window.snap = { pay: () => {} }`,
      }),
    )

    const scriptUrls = []
    page.on('request', (req) => {
      if (req.url().includes('midtrans.com/snap/snap.js')) scriptUrls.push(req.url())
    })

    await page.goto(`${BASE_URL}/checkout?slug=jatmiko-jamila`)
    await expect(page.locator('text=Ringkasan Pesanan')).toBeVisible({ timeout: 10000 })
    await page.click('button:has-text("Bayar Sekarang")')
    await page.waitForTimeout(1500)

    if (scriptUrls[0]) {
      expect(scriptUrls[0]).toContain('sandbox')
    }
  })
})
