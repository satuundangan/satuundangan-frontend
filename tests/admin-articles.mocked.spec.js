import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

const mockUser = { id: 'admin-1', name: 'Admin User', email: 'admin@test.com', isAdmin: true }

const mockArticles = {
  items: [
    {
      id: 1,
      title: 'Tips Memilih Undangan Digital',
      slug: 'tips-memilih-undangan-digital',
      status: 'published',
      excerpt: 'Panduan lengkap memilih undangan digital untuk pernikahan Anda',
      coverImage: null,
      metaTitle: 'Tips Memilih Undangan Digital Terbaik',
      metaDescription: 'Panduan lengkap memilih undangan digital untuk pernikahan modern',
      focusKeyword: 'undangan digital',
      ogImage: null,
      canonicalUrl: null,
      publishedAt: '2026-01-15T10:00:00Z',
      createdAt: '2026-01-15T09:00:00Z',
      author: { name: 'Admin User' },
    },
    {
      id: 2,
      title: 'Tren Undangan 2026',
      slug: 'tren-undangan-2026',
      status: 'draft',
      excerpt: '',
      coverImage: null,
      metaTitle: '',
      metaDescription: '',
      focusKeyword: '',
      ogImage: null,
      canonicalUrl: null,
      publishedAt: null,
      createdAt: '2026-01-20T09:00:00Z',
      author: { name: 'Admin User' },
    },
  ],
  total: 2,
  page: 1,
  limit: 20,
  totalPages: 1,
}

async function setupAuth(page) {
  await page.route('**/user/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUser),
    })
  })

  // Mock common admin endpoints using /api/ prefix to avoid intercepting page navigations
  const emptyRes = { success: true, data: [], total: 0 }
  const commonEndpoints = [
    '**/api/admin/users**',
    '**/api/admin/invitations**',
    '**/api/admin/template-designs**',
    '**/api/admin/categories**',
    '**/api/admin/palette-colors**',
    '**/api/admin/sections**',
    '**/api/admin/audio**',
    '**/api/admin/banks**',
    '**/api/admin/promo-codes**',
    '**/api/admin/stats**',
    '**/api/admin/health**',
    '**/api/admin/guests**',
  ]
  for (const endpoint of commonEndpoints) {
    await page.route(endpoint, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(emptyRes),
      }),
    )
  }

  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-token-admin')
  })
}

test.describe('Admin Articles: Article Management Feature', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page)
  })

  test('should navigate to articles page from sidebar and show article list', async ({ page }) => {
    // Mock articles API endpoint (use /api/ prefix to avoid intercepting page navigation)
    await page.route('**/api/admin/articles**', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockArticles),
        })
      }
    })

    await page.goto(`${BASE}/admin`)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 })

    // Click on "Artikel & Blog" in sidebar
    const sidebar = page.locator('aside')
    await sidebar.locator('text=Artikel & Blog').click()

    // Verify article list page
    await expect(page.getByRole('heading', { name: 'Artikel & Blog' })).toBeVisible()
    await expect(page.locator('text=Tips Memilih Undangan Digital')).toBeVisible()
    await expect(page.locator('text=Tren Undangan 2026')).toBeVisible()

    // Verify status badges
    await expect(page.locator('text=Published').first()).toBeVisible()
    await expect(page.locator('text=Draft').first()).toBeVisible()

    console.log('✅ Article list page works')
  })

  test('should open article editor with Tiptap and SEO panel', async ({ page }) => {
    // Navigate to create page directly — no API mock needed for the create page
    await page.goto(`${BASE}/admin/articles/create`)

    // Verify editor page loaded
    await expect(page.getByRole('heading', { name: 'Tulis Artikel Baru' })).toBeVisible({
      timeout: 15000,
    })

    // Verify title input
    const titleInput = page.locator('input[placeholder="Judul Artikel..."]')
    await expect(titleInput).toBeVisible()

    // Type a title and verify slug auto-generation
    await titleInput.fill('Cara Membuat Undangan Digital yang Menarik')
    const slugInput = page.locator('input[placeholder="url-slug-otomatis"]')
    await expect(slugInput).toHaveValue('cara-membuat-undangan-digital-yang-menarik')

    // Verify Tiptap editor is loaded
    await expect(page.locator('.tiptap')).toBeVisible()

    // Verify toolbar buttons are present
    await expect(page.locator('button[title="Bold"]')).toBeVisible()
    await expect(page.locator('button[title="Italic"]')).toBeVisible()
    await expect(page.locator('button[title="Underline"]')).toBeVisible()
    await expect(page.locator('button[title="Bullet List"]')).toBeVisible()

    // Verify heading buttons
    await expect(page.locator('button[title="Heading 2"]')).toBeVisible()
    await expect(page.locator('button[title="Heading 3"]')).toBeVisible()

    console.log('✅ Article editor with Tiptap loads correctly')
  })

  test('should show SEO panel with checklist and Google preview', async ({ page }) => {
    await page.goto(`${BASE}/admin/articles/create`)

    await expect(page.getByRole('heading', { name: 'Tulis Artikel Baru' })).toBeVisible({
      timeout: 15000,
    })

    // Verify SEO Settings panel
    await expect(page.locator('text=SEO Settings')).toBeVisible()

    // Verify SEO checklist items
    await expect(page.locator('text=Focus keyword diisi')).toBeVisible()
    await expect(page.locator('text=Meta title diisi')).toBeVisible()
    await expect(page.locator('text=Meta description diisi')).toBeVisible()

    // Verify SEO input fields
    const focusKeyword = page.locator('input[placeholder="Kata kunci utama..."]')
    await expect(focusKeyword).toBeVisible()
    await focusKeyword.fill('undangan digital')

    const metaTitle = page.locator('input[placeholder="Judul untuk mesin pencari..."]')
    await expect(metaTitle).toBeVisible()
    await metaTitle.fill('Tips Undangan Digital Terbaik 2026')

    const metaDesc = page.locator('textarea[placeholder="Deskripsi untuk mesin pencari..."]')
    await expect(metaDesc).toBeVisible()
    await metaDesc.fill(
      'Panduan lengkap tips memilih undangan digital terbaik untuk pernikahan modern di tahun 2026. Temukan desain dan fitur yang tepat.',
    )

    // Verify Google Preview shows the filled data
    await expect(page.locator('text=Preview Google')).toBeVisible()
    await expect(page.locator('text=Tips Undangan Digital Terbaik 2026')).toBeVisible()

    // Verify OG Image field
    await expect(page.locator('text=OG Image URL')).toBeVisible()
    await expect(page.locator('text=Ukuran rekomendasi: 1200x630px')).toBeVisible()

    // Verify Canonical URL field
    await expect(page.locator('text=Canonical URL')).toBeVisible()

    console.log('✅ SEO panel with checklist and Google preview works')
  })

  test('should have publish and draft save buttons', async ({ page }) => {
    await page.goto(`${BASE}/admin/articles/create`)

    await expect(page.getByRole('heading', { name: 'Tulis Artikel Baru' })).toBeVisible({
      timeout: 15000,
    })

    // Verify publish section heading (use exact role matching to avoid ambiguity)
    await expect(page.getByRole('heading', { name: 'Publikasi' })).toBeVisible()

    // Verify status selector
    const statusSelect = page.locator('select')
    await expect(statusSelect).toBeVisible()

    // Verify save buttons
    await expect(page.getByRole('button', { name: 'Simpan Draft' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Publikasikan' })).toBeVisible()

    // Verify cover image section
    await expect(page.getByRole('heading', { name: 'Cover Image' })).toBeVisible()

    console.log('✅ Publish controls work correctly')
  })

  test('should load existing article for editing', async ({ page }) => {
    const existingArticle = mockArticles.items[0]

    await page.route('**/api/admin/articles/1', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ...existingArticle,
            content: '<p>Ini adalah konten artikel yang sudah ada.</p>',
          }),
        })
      }
    })

    await page.goto(`${BASE}/admin/articles/1/edit`)

    await expect(page.getByRole('heading', { name: 'Edit Artikel' })).toBeVisible({
      timeout: 15000,
    })

    // Verify title is loaded
    const titleInput = page.locator('input[placeholder="Judul Artikel..."]')
    await expect(titleInput).toHaveValue('Tips Memilih Undangan Digital')

    // Verify slug is loaded
    const slugInput = page.locator('input[placeholder="url-slug-otomatis"]')
    await expect(slugInput).toHaveValue('tips-memilih-undangan-digital')

    // Verify content is loaded in Tiptap
    await expect(page.locator('.tiptap')).toContainText('Ini adalah konten artikel yang sudah ada')

    // Verify SEO fields are loaded
    const focusKeyword = page.locator('input[placeholder="Kata kunci utama..."]')
    await expect(focusKeyword).toHaveValue('undangan digital')

    const metaTitle = page.locator('input[placeholder="Judul untuk mesin pencari..."]')
    await expect(metaTitle).toHaveValue('Tips Memilih Undangan Digital Terbaik')

    console.log('✅ Edit mode loads existing article correctly')
  })

  test('should delete an article with confirmation', async ({ page }) => {
    // Mock articles API endpoint — use same glob pattern as existing admin tests
    // Safe to use without /api/ because we navigate via sidebar (client-side, no page request)
    await page.route('**/admin/articles**', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockArticles),
        })
      } else if (route.request().method() === 'DELETE') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        })
      } else {
        route.continue()
      }
    })

    // Navigate via admin dashboard then sidebar to avoid page navigation interception
    await page.goto(`${BASE}/admin`)
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 })

    const sidebar = page.locator('aside')
    await sidebar.locator('text=Artikel & Blog').click()

    await expect(page.getByRole('heading', { name: 'Artikel & Blog' })).toBeVisible()
    await expect(page.locator('text=Tips Memilih Undangan Digital')).toBeVisible()

    // Click delete button on first article
    const deleteBtn = page.locator('button[title="Hapus"]').first()
    await deleteBtn.click()

    // Verify SweetAlert confirmation dialog
    await expect(page.locator('.swal2-popup')).toBeVisible()
    await expect(page.locator('text=Hapus Artikel?')).toBeVisible()

    // Click confirm
    await page.locator('.swal2-confirm').click()

    // Wait for success message
    await expect(page.locator('text=Terhapus!')).toBeVisible()

    console.log('✅ Article deletion with confirmation works')
  })
})
