import { test, expect } from '@playwright/test'

const BASE = 'http://127.0.0.1:5173'

const mockUser = { id: 'user-1', name: 'Test User', email: 'test@test.com', isAdmin: true }

const mockInvitation = {
  id: 'mock-inv-001',
  title: 'Wedding of Test',
  slug: 'wedding-of-test',
  is_premium: true,
  price: 49000,
  template_slug: 'dark-elegant',
  content: { coupleName: 'Test & Test', photoCoupleUrl: null },
}

const mockPromos = [
  {
    id: 'promo-1',
    code: 'NIKAH50',
    discount_type: 'percentage',
    discount_value: 50,
    max_uses: 100,
    used_count: 12,
    valid_from: '2026-01-01T00:00:00.000Z',
    valid_until: '2026-12-31T23:59:59.000Z',
    is_active: true,
  },
  {
    id: 'promo-2',
    code: 'DISKON20K',
    discount_type: 'fixed',
    discount_value: 20000,
    max_uses: null,
    used_count: 5,
    valid_from: null,
    valid_until: null,
    is_active: false,
  },
]

// Sets mock token in localStorage and mocks /user/me so auth guard passes
async function setupAuth(page) {
  await page.route('**/user/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUser),
    })
  })
  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-token-playwright')
  })
}

test.describe('Promo Code: Checkout Page', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000)

    await setupAuth(page)

    await page.route('**/invitation/slug/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: mockInvitation }),
      })
    })
  })

  test('should show promo code input on checkout page', async ({ page }) => {
    await page.goto(`${BASE}/checkout?slug=${mockInvitation.slug}`)

    await expect(page.locator('input[placeholder="Kode Promo"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('button:has-text("Pakai")')).toBeVisible()
    console.log('✅ Promo code input section visible')
  })

  test('should apply valid promo code and show discount', async ({ page }) => {
    await page.route('**/promo/validate', (route) => {
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
      })
    })

    await page.goto(`${BASE}/checkout?slug=${mockInvitation.slug}`)
    await expect(page.locator('input[placeholder="Kode Promo"]')).toBeVisible({ timeout: 10000 })

    await page.fill('input[placeholder="Kode Promo"]', 'NIKAH50')
    await page.click('button:has-text("Pakai")')

    // Badge hijau applied promo
    await expect(page.locator('.bg-green-50.border-green-200')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('.bg-green-50.border-green-200')).toContainText('NIKAH50')
    console.log('✅ Applied promo badge visible')

    // Discount row muncul
    await expect(page.locator('text=Diskon')).toBeVisible()
    console.log('✅ Discount row visible')

    // Harga akhir berubah ke 24.500
    const totalArea = page.locator('text=Total Bayar').locator('../..')
    await expect(totalArea).toContainText('24.500', { timeout: 5000 })
    console.log('✅ Final price updated to discounted amount')
  })

  test('should show error for invalid promo code', async ({ page }) => {
    await page.route('**/promo/validate', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Kode promo tidak valid atau sudah tidak berlaku',
        }),
      })
    })

    await page.goto(`${BASE}/checkout?slug=${mockInvitation.slug}`)
    await expect(page.locator('input[placeholder="Kode Promo"]')).toBeVisible({ timeout: 10000 })

    await page.fill('input[placeholder="Kode Promo"]', 'INVALID123')
    await page.click('button:has-text("Pakai")')

    await expect(page.locator('text=Kode promo tidak valid atau sudah tidak berlaku')).toBeVisible({ timeout: 5000 })
    console.log('✅ Error message shown for invalid code')

    // Applied badge tidak muncul
    await expect(page.locator('.bg-green-50.border-green-200')).not.toBeVisible()
    console.log('✅ Applied badge NOT shown for invalid code')
  })

  test('should remove applied promo when clicking Hapus', async ({ page }) => {
    await page.route('**/promo/validate', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            code: 'DISKON20',
            discount_type: 'fixed',
            discount_value: 20000,
            original_price: 49000,
            discount_amount: 20000,
            final_price: 29000,
          },
        }),
      })
    })

    await page.goto(`${BASE}/checkout?slug=${mockInvitation.slug}`)
    await expect(page.locator('input[placeholder="Kode Promo"]')).toBeVisible({ timeout: 10000 })

    // Apply promo
    await page.fill('input[placeholder="Kode Promo"]', 'DISKON20')
    await page.click('button:has-text("Pakai")')
    await expect(page.locator('.bg-green-50.border-green-200')).toBeVisible({ timeout: 5000 })

    // Hapus promo
    await page.click('button:has-text("Hapus")')

    // Input harus muncul kembali
    await expect(page.locator('input[placeholder="Kode Promo"]')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('.bg-green-50.border-green-200')).not.toBeVisible()
    console.log('✅ Promo removed, input restored')
  })

  test('should show GRATIS when final_price is 0', async ({ page }) => {
    await page.route('**/promo/validate', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            code: 'FREE100',
            discount_type: 'percentage',
            discount_value: 100,
            original_price: 49000,
            discount_amount: 49000,
            final_price: 0,
          },
        }),
      })
    })

    await page.goto(`${BASE}/checkout?slug=${mockInvitation.slug}`)
    await expect(page.locator('input[placeholder="Kode Promo"]')).toBeVisible({ timeout: 10000 })

    await page.fill('input[placeholder="Kode Promo"]', 'FREE100')
    await page.click('button:has-text("Pakai")')

    await expect(page.locator('text=GRATIS')).toBeVisible({ timeout: 5000 })
    console.log('✅ GRATIS label shown when final_price is 0')
  })

  test('should send promo_code in payment request', async ({ page }) => {
    await page.route('**/promo/validate', (route) => {
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
      })
    })

    let paymentPayload = null
    await page.route('**/payment/create', (route) => {
      paymentPayload = JSON.parse(route.request().postData() || '{}')
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'mock-snap-token' }),
      })
    })

    await page.goto(`${BASE}/checkout?slug=${mockInvitation.slug}`)
    await expect(page.locator('input[placeholder="Kode Promo"]')).toBeVisible({ timeout: 10000 })

    await page.fill('input[placeholder="Kode Promo"]', 'NIKAH50')
    await page.click('button:has-text("Pakai")')
    await expect(page.locator('.bg-green-50.border-green-200')).toBeVisible({ timeout: 5000 })

    await page.click('button:has-text("Bayar Sekarang")', { force: true })
    await page.waitForTimeout(2000)

    expect(paymentPayload).not.toBeNull()
    expect(paymentPayload.promo_code).toBe('NIKAH50')
    expect(paymentPayload.invitation_id).toBe(mockInvitation.id)
    console.log('✅ promo_code correctly sent in POST /payment/create')
  })
})

test.describe('Promo Code: Admin Management', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000)

    await setupAuth(page)

    await page.route('https://api.satuundangan.id/admin/promo-codes**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: mockPromos, total: mockPromos.length }),
      })
    })
  })

  test('should show promo codes table in admin', async ({ page }) => {
    await page.goto(`${BASE}/admin/promo-codes`)

    await expect(page.locator('text=NIKAH50')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=DISKON20K')).toBeVisible()
    console.log('✅ Promo codes table rendered with data')
  })

  test('should show correct discount type badges', async ({ page }) => {
    await page.goto(`${BASE}/admin/promo-codes`)

    await expect(page.locator('text=Persentase').first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Fixed').first()).toBeVisible()
    console.log('✅ Discount type badges displayed correctly')
  })

  test('should show usage count and max_uses correctly', async ({ page }) => {
    await page.goto(`${BASE}/admin/promo-codes`)

    // NIKAH50: 12 / 100, DISKON20K: 5 / ∞
    await expect(page.locator('text=12 / 100')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=5 / ∞')).toBeVisible()
    console.log('✅ Usage counts displayed correctly')
  })

  test('should show active/inactive status toggles', async ({ page }) => {
    await page.goto(`${BASE}/admin/promo-codes`)

    await expect(page.locator('button:has-text("Aktif")').first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('button:has-text("Nonaktif")').first()).toBeVisible()
    console.log('✅ Status toggles rendered')
  })

  test('should open create form on Tambah Promo click', async ({ page }) => {
    await page.goto(`${BASE}/admin/promo-codes`)

    await page.click('button:has-text("Tambah Promo")', { force: true })

    await expect(page.locator('text=Tambah Promo Code')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('input[placeholder="Contoh: NIKAH50"]')).toBeVisible()
    await expect(page.locator('select').first()).toBeVisible()
    console.log('✅ Create form modal opened')
  })

  test('should open edit form with pre-filled data and code disabled', async ({ page }) => {
    await page.goto(`${BASE}/admin/promo-codes`)

    await expect(page.locator('text=NIKAH50')).toBeVisible({ timeout: 10000 })
    await page.locator('tr').filter({ hasText: 'NIKAH50' }).locator('button:has-text("Edit")').click()

    await expect(page.locator('text=Edit Promo Code')).toBeVisible({ timeout: 5000 })
    const codeInput = page.locator('input[placeholder="Contoh: NIKAH50"]')
    await expect(codeInput).toBeDisabled()
    await expect(codeInput).toHaveValue('NIKAH50')
    console.log('✅ Edit form opens with data pre-filled and code field disabled')
  })

  test('should send uppercase code in create payload', async ({ page }) => {
    let createPayload = null
    await page.route('https://api.satuundangan.id/admin/promo-codes', (route) => {
      if (route.request().method() === 'POST') {
        createPayload = JSON.parse(route.request().postData() || '{}')
        route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ success: true }) })
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: mockPromos, total: mockPromos.length }),
        })
      }
    })

    await page.goto(`${BASE}/admin/promo-codes`)
    await page.click('button:has-text("Tambah Promo")', { force: true })
    await expect(page.locator('text=Tambah Promo Code')).toBeVisible({ timeout: 5000 })

    await page.fill('input[placeholder="Contoh: NIKAH50"]', 'testpromo')
    await page.selectOption('select', 'fixed')
    await page.fill('input[placeholder="50"]', '15000')
    await page.click('button:has-text("Simpan")', { force: true })

    await page.waitForTimeout(2000)

    expect(createPayload).not.toBeNull()
    expect(createPayload.code).toBe('TESTPROMO') // harus uppercase
    expect(createPayload.discount_type).toBe('fixed')
    expect(createPayload.discount_value).toBe(15000)
    console.log('✅ Create payload correct, code is uppercased to TESTPROMO')
  })

  test('should show Promo Code nav item in admin sidebar', async ({ page }) => {
    await page.goto(`${BASE}/admin`)

    await expect(page.locator('a:has-text("Promo Code")')).toBeVisible({ timeout: 10000 })
    console.log('✅ Promo Code nav item in admin sidebar')
  })
})
