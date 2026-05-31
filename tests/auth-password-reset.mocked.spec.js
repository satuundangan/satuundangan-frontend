import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

test.describe('Password reset flow (mocked)', () => {
  test('customer can request password reset from login modal', async ({ page }) => {
    let requestBody = null

    await page.route('**/api/template-design**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }),
    )
    await page.route('**/api/auth/forgot-password', async (route) => {
      requestBody = route.request().postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Jika email terdaftar, instruksi reset password akan dikirim.',
          resetUrl: 'http://localhost:5173/reset-password?token=dev-token',
        }),
      })
    })

    await page.goto(`${BASE_URL}/?login=true`)
    await page.getByRole('link', { name: 'Lupa password?' }).click()
    await page.getByPlaceholder('nama@email.com').fill('user@mail.com')
    await page.getByRole('button', { name: 'Kirim Link Reset' }).click()

    await expect(page.getByText('Development reset link:')).toBeVisible()
    await expect(page.getByRole('link', { name: /reset-password\?token=dev-token/ })).toBeVisible()
    expect(requestBody).toEqual({ email: 'user@mail.com' })
  })

  test('customer can reset password using token link', async ({ page }) => {
    let requestBody = null

    await page.route('**/api/auth/reset-password', async (route) => {
      requestBody = route.request().postDataJSON()
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Password berhasil direset. Silakan login kembali.' }),
      })
    })

    await page.goto(`${BASE_URL}/reset-password?token=dev-token`)
    await page.getByLabel('Password Baru').fill('newpass123')
    await page.getByLabel('Konfirmasi Password').fill('newpass123')
    await page.getByRole('button', { name: 'Simpan Password Baru' }).click()

    await expect(page).toHaveURL(/\/\?login=true/)
    expect(requestBody).toEqual({ token: 'dev-token', password: 'newpass123' })
  })
})
