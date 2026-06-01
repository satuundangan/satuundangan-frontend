import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

test.describe('Email verification flow (mocked)', () => {
  test('customer can see verification link after registration', async ({ page }) => {
    let requestBody = null

    // Mock template-design for home page
    await page.route('**/api/template-design**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }),
    )

    // Mock registration API
    await page.route('**/api/auth/register', async (route) => {
      requestBody = route.request().postDataJSON()
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Akun berhasil dibuat. Silakan cek email untuk verifikasi.',
          verificationUrl: 'http://localhost:5173/verify-email?token=dev-verify-token',
        }),
      })
    })

    await page.goto(`${BASE_URL}/?register=true`)
    
    await page.getByPlaceholder('John Doe').fill('Test User')
    await page.getByPlaceholder('nama@email.com').fill('test@mail.com')
    await page.locator('input[type="password"]').fill('password123')
    
    // Check Terms agreement if exists (based on code analysis it exists in AuthModal)
    const termsCheckbox = page.locator('input[type="checkbox"]')
    if (await termsCheckbox.isVisible()) {
      await termsCheckbox.check()
    }

    await page.getByRole('button', { name: 'Daftar Gratis' }).click()

    // Verify development link is visible
    await expect(page.getByText('Development verification link:')).toBeVisible()
    await expect(page.locator('a:has-text("dev-verify-token")')).toBeVisible()
    
    expect(requestBody.name).toBe('Test User')
    expect(requestBody.email).toBe('test@mail.com')
  })

  test('customer can verify email using token link (redirect flow)', async ({ page }) => {
    // Set mock token to pass requiresAuth guard
    await page.addInitScript(() => {
      window.localStorage.setItem('token', 'mock-token')
    })

    // Mock profile fetch for auth.init() and settings page
    await page.route('**/api/user/me', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 1,
          name: 'Test User',
          email: 'test@mail.com',
          emailVerifiedAt: new Date().toISOString(),
          isApproved: true
        }),
      }),
    )

    // Simulate clicking the verification link which would normally come from an email
    // The backend redirects to /dashboard/settings?email_verified=success
    await page.goto(`${BASE_URL}/settings?email_verified=success`)

    // Verify success toast and URL cleanup
    await expect(page.getByText('Email berhasil diverifikasi')).toBeVisible()
    await expect(page).toHaveURL(/.*settings/)
    await expect(page.url()).not.toContain('email_verified=success')

    // Verify UI shows verified status
    await expect(page.getByText('Terverifikasi')).toBeVisible()
  })
})
