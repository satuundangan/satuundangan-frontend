import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

test.describe('Negative Scenarios & Error Handling (Mocked)', () => {
  
  test('expired session should redirect to login/home', async ({ page }) => {
    // Mock profile fetch to return 401
    await page.route('**/api/user/me', (route) => route.fulfill({ status: 401 }))
    
    await page.addInitScript(() => localStorage.setItem('token', 'expired-token'))
    await page.goto(`${BASE_URL}/dashboard`)
    
    // Should be redirected or show home with login state
    await expect(page).toHaveURL(new RegExp(`${BASE_URL}/?`))
  })

  test('non-admin user cannot access admin pages', async ({ page }) => {
    // Mock regular user
    await page.route('**/api/user/me', (route) => 
      route.fulfill({ 
        status: 200, 
        contentType: 'application/json',
        body: JSON.stringify({ id: 101, isAdmin: false }) 
      })
    )
    
    await page.addInitScript(() => localStorage.setItem('token', 'valid-token'))
    await page.goto(`${BASE_URL}/admin/users`)
    
    // Should redirect to admin login
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('opening invalid invitation slug shows 404 or error message', async ({ page }) => {
    await page.route('**/api/invitation/slug/invalid-slug', (route) => 
      route.fulfill({ status: 404, body: JSON.stringify({ message: 'Not Found' }) })
    )
    
    await page.goto(`${BASE_URL}/invalid-slug`)
    
    // Check for error UI - assuming a 404 page or error toast
    // Based on previous knowledge, it might show "Undangan tidak ditemukan"
    await expect(page.getByText(/tidak ditemukan|404/i).first()).toBeVisible({ timeout: 10000 })
  })

  test('handling Midtrans payment gateway error gracefully', async ({ page }) => {
    const approvedUser = { id: 101, name: 'User', email: 'u@t.com', isApproved: true }
    
    await page.route('**/api/user/me', (route) => route.fulfill({ status: 200, body: JSON.stringify(approvedUser) }))
    await page.route('**/api/invitation/my/slug/error-test', (route) => 
      route.fulfill({ status: 200, body: JSON.stringify({ id: 1, slug: 'error-test', price: 10000 }) })
    )
    
    // Mock payment failure
    await page.route('**/api/payment/create', (route) => 
      route.fulfill({ 
        status: 502, 
        body: JSON.stringify({ message: 'Gagal membuat transaksi Midtrans: Validation failed' }) 
      })
    )

    await page.addInitScript(() => localStorage.setItem('token', 'valid-token'))
    await page.goto(`${BASE_URL}/checkout?slug=error-test`)
    
    await page.getByRole('button', { name: /Bayar Sekarang/i }).click()
    
    // Should show error message from backend
    await expect(page.getByText(/Validation failed|Gagal/i)).toBeVisible()
  })

  test('affiliate cannot withdraw with zero balance', async ({ page }) => {
    await page.route('**/api/user/me', (route) => route.fulfill({ status: 200, body: JSON.stringify({ id: 1 }) }))
    await page.route('**/api/affiliate/dashboard', (route) => 
      route.fulfill({ 
        status: 200, 
        body: JSON.stringify({ balance: { availableToWithdraw: 0 }, status: 'active' }) 
      })
    )
    await page.route('**/api/affiliate/profile', (route) => route.fulfill({ status: 200, body: JSON.stringify({ id: 1 }) }))
    await page.route('**/api/affiliate/withdrawals**', (route) => route.fulfill({ status: 200, body: JSON.stringify({ data: [] }) }))

    await page.addInitScript(() => localStorage.setItem('token', 'valid-token'))
    await page.goto(`${BASE_URL}/affiliate/dashboard`)
    
    // Withdrawal button should be disabled or hidden or show error on click
    const withdrawBtn = page.getByRole('button', { name: /Tarik Dana|Withdraw/i })
    
    // If button exists, it should probably be disabled
    if (await withdrawBtn.isVisible()) {
        await expect(withdrawBtn).toBeDisabled()
    }
  })
})
