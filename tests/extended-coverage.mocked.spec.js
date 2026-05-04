import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

const approvedUser = {
  id: 10,
  name: 'Customer Tester',
  email: 'customer@test.com',
  isAdmin: false,
  isApproved: true,
}

const pendingUser = {
  ...approvedUser,
  isApproved: false,
}

const adminUser = {
  id: 1,
  name: 'Admin Tester',
  email: 'admin@test.com',
  isAdmin: true,
  isApproved: true,
}

const draftInvitation = {
  id: 901,
  title: 'Draft Invitation',
  slug: 'private-draft',
  template_slug: 'dark-elegant',
  is_premium: false,
  is_published: false,
  content: {
    coupleName: 'Draft Couple',
    groomName: 'Draft Groom',
    brideName: 'Draft Bride',
    dateTime: '2026-12-12T09:00:00.000Z',
    akadLocation: {
      mapUrl: 'https://maps.app.goo.gl/example',
      description: 'Gedung Serbaguna',
      dateTime: '2026-12-12T09:00:00.000Z',
    },
    selectedSections: ['hero', 'event'],
  },
}

function setToken(page) {
  return page.addInitScript(() => {
    localStorage.setItem('token', 'mock-token')
  })
}

async function mockCurrentUser(page, user) {
  const fulfillUser = (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(user),
    })

  await page.route('**/api/user/me', fulfillUser)
  await page.route('**/user/me', fulfillUser)
}

async function mockDashboardApis(page) {
  await page.route('**/api/invitation', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [] }),
    }),
  )
  await page.route('**/api/dashboard/stats', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          total_invitations: 0,
          total_guests: 0,
          total_responses: 0,
        },
      }),
    }),
  )
}

test.describe('Access and account flows (mocked)', () => {
  test('protected customer route redirects anonymous user to login modal', async ({ page }) => {
    const fulfillUnauthorized = (route) =>
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Unauthorized' }),
      })

    await page.route('**/api/user/me', fulfillUnauthorized)
    await page.route('**/user/me', fulfillUnauthorized)
    await page.route('**/api/template-design**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: [] }) }),
    )
    await page.route('**/api/categories**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }),
    )

    await page.goto(`${BASE_URL}/settings`)

    await expect(page).toHaveURL(/\/\?login=true&redirect=\/settings/)
    await expect(page.getByRole('button', { name: 'Masuk Sekarang' })).toBeVisible({ timeout: 10000 })
  })

  test('unapproved customer must record legal consent before dashboard access', async ({ page }) => {
    await setToken(page)
    await mockDashboardApis(page)

    let consentRecorded = false
    const fulfillConsentUser = (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(consentRecorded ? approvedUser : pendingUser),
      })
    await page.route('**/api/user/me', fulfillConsentUser)
    await page.route('**/user/me', fulfillConsentUser)
    await page.route('**/api/consent/record', (route) => {
      consentRecorded = true
      return route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })

    await page.goto(`${BASE_URL}/dashboard`)

    await expect(page).toHaveURL(/\/legal-consent/)
    await expect(page.getByRole('button', { name: 'Setuju & Lanjut ke Dashboard' })).toBeDisabled()
    await page.locator('#tos').check()
    await page.locator('#privacy').check()
    await page.getByRole('button', { name: 'Setuju & Lanjut ke Dashboard' }).click()

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 })
    await expect(page.getByText('Mulai Perjalananmu')).toBeVisible()
    expect(consentRecorded).toBe(true)
  })

  test('customer settings validates profile and password forms', async ({ page }) => {
    await setToken(page)
    await mockCurrentUser(page, approvedUser)

    await page.goto(`${BASE_URL}/settings`)

    await expect(page.getByText('Pengaturan Akun')).toBeVisible()
    const nameInput = page.getByPlaceholder('Nama lengkap kamu')
    await expect(nameInput).toHaveValue('Customer Tester')
    await nameInput.fill('')
    await page.getByRole('button', { name: 'Simpan Perubahan' }).click()
    await expect(page.getByText('Nama tidak boleh kosong')).toBeVisible({ timeout: 10000 })

    await page.getByPlaceholder('Minimal 6 karakter').fill('abc')
    await page.getByRole('button', { name: 'Ganti Password' }).click()
    await expect(page.getByText('Password minimal 6 karakter')).toBeVisible({ timeout: 10000 })

    await page.getByPlaceholder('Minimal 6 karakter').fill('password1')
    await page.getByPlaceholder('Ulangi password baru').fill('password2')
    await page.getByRole('button', { name: 'Ganti Password' }).click()
    await expect(page.getByText('Konfirmasi password tidak cocok')).toBeVisible({ timeout: 10000 })
  })
})

test.describe('Admin master-data flows (mocked)', () => {
  test.beforeEach(async ({ page }) => {
    await setToken(page)
    await mockCurrentUser(page, adminUser)
  })

  test('admin can create, edit, and delete users', async ({ page }) => {
    const users = [
      { id: 1, name: 'Existing User', email: 'existing@test.com', isAdmin: false },
    ]
    const calls = []

    await page.route('**/api/admin/users**', (route) => {
      const request = route.request()
      const method = request.method()
      calls.push({ method, url: request.url(), body: request.postDataJSON?.() })

      if (method === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: users, total: users.length }),
        })
      }

      if (method === 'POST') {
        const body = request.postDataJSON()
        users.push({ id: 2, ...body })
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 2, ...body }),
        })
      }

      if (method === 'PATCH') {
        const body = request.postDataJSON()
        Object.assign(users[0], body)
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(users[0]),
        })
      }

      if (method === 'DELETE') {
        users.splice(0, 1)
        return route.fulfill({ status: 204 })
      }

      return route.fallback()
    })

    await page.goto(`${BASE_URL}/admin/users`)

    await expect(page.getByText('Existing User')).toBeVisible()
    await page.getByRole('button', { name: 'Tambah Pengguna' }).click()
    const createModal = page.locator('.fixed.inset-0')
    await expect(createModal.getByRole('heading', { name: 'Tambah Pengguna' })).toBeVisible()
    await createModal.locator('input[type="text"]').fill('New User')
    await createModal.locator('input[type="email"]').fill('new@test.com')
    await createModal.locator('input[type="password"]').fill('secret123')
    await createModal.getByRole('button', { name: 'Simpan' }).click()
    await expect(page.getByText('New User')).toBeVisible({ timeout: 10000 })

    await page.getByRole('row', { name: /Existing User/ }).getByRole('button', { name: 'Edit' }).click()
    const editModal = page.locator('.fixed.inset-0')
    await expect(editModal.getByRole('heading', { name: 'Edit Pengguna' })).toBeVisible()
    await editModal.locator('input[type="text"]').fill('Existing Updated')
    await editModal.getByRole('button', { name: 'Simpan' }).click()
    await expect(page.getByText('Existing Updated')).toBeVisible({ timeout: 10000 })

    await page.getByRole('row', { name: /Existing Updated/ }).getByRole('button', { name: 'Hapus' }).click()
    await page.getByRole('button', { name: 'Ya, hapus' }).click()
    await expect(page.getByText('Existing Updated')).not.toBeVisible({ timeout: 10000 })

    expect(calls.some((call) => call.method === 'POST' && call.body?.email === 'new@test.com')).toBe(true)
    expect(calls.some((call) => call.method === 'PATCH' && call.body?.name === 'Existing Updated')).toBe(true)
    expect(calls.some((call) => call.method === 'DELETE')).toBe(true)
  })

  test('admin can create and edit template categories', async ({ page }) => {
    const categories = [{ id: 1, name: 'Elegant', color: '#111111' }]
    const calls = []

    await page.route('**/api/admin/categories**', (route) => {
      const request = route.request()
      const method = request.method()
      calls.push({ method, body: method === 'GET' ? null : request.postDataJSON?.() })

      if (method === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: categories, total: categories.length }),
        })
      }

      if (method === 'POST') {
        const body = request.postDataJSON()
        categories.push({ id: 2, ...body })
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 2, ...body }),
        })
      }

      if (method === 'PATCH') {
        const body = request.postDataJSON()
        Object.assign(categories[0], body)
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(categories[0]),
        })
      }

      return route.fallback()
    })

    await page.goto(`${BASE_URL}/admin/categories`)

    await expect(page.getByText('Elegant')).toBeVisible()
    await page.getByRole('button', { name: 'Tambah Kategori' }).click()
    const createModal = page.locator('.fixed.inset-0')
    await expect(createModal.getByRole('heading', { name: 'Tambah Kategori' })).toBeVisible()
    await createModal.locator('input[type="text"]').first().fill('Minimalis')
    await createModal.locator('input[type="text"]').last().fill('#222222')
    await createModal.getByRole('button', { name: 'Simpan' }).click()
    await expect(page.getByText('Minimalis')).toBeVisible({ timeout: 10000 })

    await page.getByRole('row', { name: /Elegant/ }).getByRole('button', { name: 'Edit' }).click()
    const editModal = page.locator('.fixed.inset-0')
    await expect(editModal.getByRole('heading', { name: 'Edit Kategori' })).toBeVisible()
    await editModal.locator('input[type="text"]').first().fill('Elegant Gold')
    await editModal.locator('input[type="text"]').last().fill('#d4af37')
    await editModal.getByRole('button', { name: 'Simpan' }).click()

    await expect(page.getByText('Elegant Gold')).toBeVisible({ timeout: 10000 })
    expect(calls.some((call) => call.method === 'POST' && call.body?.name === 'Minimalis')).toBe(true)
    expect(calls.some((call) => call.method === 'PATCH' && call.body?.color === '#d4af37')).toBe(true)
  })
})

test.describe('Public invitation states (mocked)', () => {
  test('guest cannot open unpublished invitation without preview mode', async ({ page }) => {
    await page.route('**/api/invitation/slug/private-draft', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(draftInvitation),
      }),
    )

    await page.goto(`${BASE_URL}/private-draft`)

    await expect(page.getByText('Undangan ini belum dipublikasikan atau sudah tidak aktif.')).toBeVisible({
      timeout: 10000,
    })
  })

  test('customer preview can open unpublished invitation and continue to checkout', async ({ page }) => {
    await setToken(page)
    await mockCurrentUser(page, approvedUser)
    await page.route('**/api/invitation/my/slug/private-draft', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(draftInvitation),
      }),
    )

    await page.goto(`${BASE_URL}/private-draft?preview=true`)

    await expect(page.getByRole('button', { name: /Publikasikan Sekarang/i })).toBeVisible({
      timeout: 15000,
    })
    await page.getByRole('button', { name: /Publikasikan Sekarang/i }).click()
    await expect(page).toHaveURL(/\/checkout\?slug=private-draft/)
  })
})
