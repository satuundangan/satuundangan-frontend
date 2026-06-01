import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

const mockUser = { id: 'admin-1', name: 'Admin User', email: 'admin@test.com', isAdmin: true }

async function setupAuth(page) {
  await page.route('**/user/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUser),
    })
  })
  
  const emptyRes = { success: true, data: [], total: 0 }
  const endpoints = [
    '**/admin/users**',
    '**/admin/invitations**',
    '**/admin/template-designs**',
    '**/admin/categories**',
    '**/admin/palette-colors**',
    '**/admin/sections**',
    '**/admin/audio**',
    '**/admin/banks**',
    '**/admin/promo-codes**'
  ]

  for (const endpoint of endpoints) {
    await page.route(endpoint, (route) => route.fulfill({ 
      status: 200, 
      contentType: 'application/json', 
      body: JSON.stringify(emptyRes) 
    }))
  }

  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-token-admin')
  })
}

test.describe('Admin Panel: Comprehensive Testing', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page)
  })

  test('should navigate through all admin sections and verify content', async ({ page }) => {
    await page.goto(`${BASE}/admin`)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 })
    console.log('✅ Dashboard reached')

    const sidebar = page.locator('aside')

    // 1. Users & Create User Modal
    await page.route('**/admin/users**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [{ id: 1, name: 'User One', email: 'user1@example.com', isAdmin: false }],
          total: 1
        }),
      })
    })
    await sidebar.locator('text=Users').click()
    await expect(page.getByRole('heading', { name: 'Pengguna' })).toBeVisible()
    await page.click('button:has-text("Tambah Pengguna")')
    await expect(page.getByRole('heading', { name: 'Tambah Pengguna' })).toBeVisible()
    await page.click('button:has-text("Batal")')
    console.log('✅ Users section verified')

    // 2. Invitations
    await page.route('**/admin/invitations**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [{ id: 101, title: 'Wedding of Alice', slug: 'wedding-alice' }],
          total: 1
        }),
      })
    })
    await sidebar.locator('text=Invitations').click()
    await expect(page.getByRole('heading', { name: 'Undangan' })).toBeVisible()
    await expect(page.locator('text=wedding-alice')).toBeVisible()
    console.log('✅ Invitations verified')

    // 3. Audio & Musik
    await page.route('**/admin/audio**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [{ id: 501, title: 'Romantic Song', category: 'romantic' }],
          total: 1
        }),
      })
    })
    await sidebar.locator('text=Audio & Musik').click()
    await expect(page.getByRole('heading', { name: 'Audio & Musik' })).toBeVisible()
    await expect(page.locator('text=Romantic Song')).toBeVisible()
    console.log('✅ Audio section verified')

    // 4. Bank & Pembayaran
    await page.route('**/admin/banks**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [{ id: 601, name: 'BCA', account_number: '12345678' }],
          total: 1
        }),
      })
    })
    await sidebar.locator('text=Bank & Pembayaran').click()
    await expect(page.getByRole('heading', { name: 'Bank & Pembayaran' })).toBeVisible()
    await expect(page.locator('text=BCA')).toBeVisible()
    console.log('✅ Bank section verified')

    // 5. Promo Code
    await page.route('**/admin/promo-codes**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [{ id: 401, code: 'PROMO100' }],
          total: 1
        }),
      })
    })
    await sidebar.locator('text=Promo Code').click()
    await expect(page.getByRole('heading', { name: 'Promo Code' })).toBeVisible()
    await page.click('button:has-text("Tambah Promo")')
    await expect(page.getByRole('heading', { name: 'Tambah Promo Code' })).toBeVisible()
    await page.click('button:has-text("Batal")')
    console.log('✅ Promo Code verified')

    // 6. Logout
    await page.click('button[title="Logout"]')
    await page.waitForURL(/.*login/)
    await expect(page.locator('text=Admin Login')).toBeVisible()
    console.log('✅ Logout verified')
  })
})
