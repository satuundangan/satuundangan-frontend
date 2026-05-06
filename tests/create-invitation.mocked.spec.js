import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

const approvedUser = {
  id: 101,
  name: 'Playwright User',
  email: 'playwright@test.com',
  isAdmin: false,
  isApproved: true,
}

const mockTemplate = {
  id: 1,
  name: 'Template 1',
  slug: 'template-1',
  price: 0,
  isPremium: false,
  thumbnailUrl: 'https://via.placeholder.com/150',
  sections: [
    { key: 'quote', is_enabled: true, label: 'Quote' },
    { key: 'photoCouple', is_enabled: true, label: 'Foto Utama' },
  ],
}

test.describe('Create Invitation Flow (Mocked)', () => {
  test('customer can select design and fill creation form', async ({ page }) => {
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

    // Go to Step 1 (CreateDesign)
    await page.goto(`${BASE_URL}/create`)
    await expect(page.getByText('Langkah 1/2')).toBeVisible({ timeout: 15000 })
    await page.getByRole('button', { name: /Lanjut Lengkapi Data/i }).click()

    // Step 2 (CreateForm)
    await expect(page).toHaveURL(/\/create\/form/)
    await expect(page.getByText('Langkah 2/2')).toBeVisible()

    // Fill form
    await page.getByPlaceholder(/Putri Diana/i).fill('Eve')
    await page.getByPlaceholder(/Pangeran Charles/i).fill('Adam')
    await page.getByPlaceholder(/Contoh: The Wedding/i).fill('Wedding of Adam & Eve')

    // Click "Satu Lokasi"
    await page.getByText('Satu Lokasi').click()
    await page.locator('input[type="datetime-local"]').first().fill('2026-12-12T09:00')
    await page.getByPlaceholder(/https:\/\/maps.app.goo.gl/i).fill('https://maps.app.goo.gl/abc')

    // Mock file inputs (simulate base64 preview)
    // In real test we should use setInputFiles, but here we just need validation to pass
    // and since validation checks formData.bridePhoto which is set on change...
    await page.locator('input[id="bridePhoto"]').setInputFiles({
      name: 'bride.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-image-data'),
    })
    await page.locator('input[id="groomPhoto"]').setInputFiles({
      name: 'groom.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-image-data'),
    })
    await page.locator('input[type="file"]').nth(2).setInputFiles({
      name: 'couple.png',
      mimeType: 'image/png',
      buffer: Buffer.from('fake-image-data'),
    })

    // Submit
    const createRequest = page.waitForRequest(
      (r) => r.url().includes('/api/invitation') && r.method() === 'POST',
    )
    await page.getByRole('button', { name: /Lanjut Preview/i }).click()
    await createRequest

    await expect(page).toHaveURL(/\/preview\?slug=test-invitation/)
  })
})
