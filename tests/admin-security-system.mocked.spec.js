import { test, expect } from '@playwright/test'
import { mockAdminApi } from './fixtures/adminMocks.js'

test.describe('role-aware admin', () => {
  test('a finance admin sees only the menus their role allows and cannot open system pages', async ({ page }) => {
    await mockAdminApi(page, 'finance')
    await page.goto('/admin')
    const menu = page.getByRole('navigation', { name: 'Menu admin' }).first()
    await expect(menu.getByRole('link', { name: 'Pembayaran & Transaksi' })).toBeVisible()
    await expect(menu.getByRole('link', { name: 'Keamanan Akun' })).toBeVisible()
    await expect(menu.getByRole('link', { name: 'Users', exact: true })).toHaveCount(0)
    await expect(menu.getByRole('link', { name: 'Sistem & Audit' })).toHaveCount(0)
    await expect(menu.getByRole('link', { name: 'Social Studio (IG)' })).toHaveCount(0)
    await page.goto('/admin/system')
    await expect(page).toHaveURL(/\/admin$/)
    await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible()
    await expect(page.getByTestId('system-card')).toContainText('hanya tersedia untuk superadmin')
  })

  test('a superadmin sees every menu including system and security', async ({ page }) => {
    await mockAdminApi(page)
    await page.goto('/admin')
    const menu = page.getByRole('navigation', { name: 'Menu admin' }).first()
    for (const name of ['Users', 'Sistem & Audit', 'Keamanan Akun', 'Analytics & Funnel', 'Social Studio (IG)']) {
      await expect(menu.getByRole('link', { name, exact: true })).toBeVisible()
    }
  })
})

test.describe('system page', () => {
  test.beforeEach(async ({ page }) => mockAdminApi(page))

  test('tabs work with the keyboard and health shows what was actually checked', async ({ page }) => {
    await page.goto('/admin/system')
    const health = page.getByRole('tab', { name: 'Kesehatan' })
    await health.focus()
    await expect(page.getByTestId('health-list')).toContainText('Midtrans menolak server key (401)')
    await expect(page.getByTestId('health-list')).toContainText('cek: SELECT 1')
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('tab', { name: 'Mode perawatan' })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByTestId('maintenance-state')).toContainText('Normal')
    await page.keyboard.press('ArrowRight')
    await expect(page.getByTestId('audit-rows')).toContainText('users.update')
    await expect(page.getByTestId('audit-rows')).toContainText('req-1')
  })

  test('saving maintenance sends the flag with a reason and a UTC end time', async ({ page }) => {
    let sent = null
    await page.route('**/api/admin/maintenance', async (route) => {
      if (route.request().method() === 'PUT') {
        sent = route.request().postDataJSON()
        return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
      }
      return route.fallback()
    })
    await page.goto('/admin/system')
    await page.getByRole('tab', { name: 'Mode perawatan' }).click()
    await page.getByLabel('Aktifkan mode perawatan').check()
    await page.getByLabel('Alasan internal (wajib saat aktif)').fill('Migrasi database')
    await page.getByLabel('Perkiraan selesai (WIB, opsional)').fill('2099-10-30T08:00')
    await page.getByRole('button', { name: 'Simpan', exact: true }).click()
    await expect.poll(() => sent).toMatchObject({ enabled: true, reason: 'Migrasi database', until: '2099-10-30T01:00:00.000Z' })
  })
})

test.describe('account security', () => {
  test.beforeEach(async ({ page }) => mockAdminApi(page))

  test('lists sessions and revokes another session', async ({ page }) => {
    let deleted = null
    await page.route('**/api/auth/admin/sessions/**', (route) => {
      deleted = route.request().method() + ' ' + new URL(route.request().url()).pathname
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"revoked":1}' })
    })
    await page.goto('/admin/security')
    await expect(page.getByTestId('last-login')).toContainText('1.2.3.4')
    await expect(page.getByTestId('sessions')).toContainText('Sesi ini')
    await page.getByTestId('sessions').getByRole('button', { name: 'Cabut' }).click()
    await expect.poll(() => deleted).toBe('DELETE /api/auth/admin/sessions/old')
  })

  test('old TOTP setup link leads to the new security page', async ({ page }) => {
    await page.goto('/admin/totp/setup')
    await expect(page).toHaveURL(/\/admin\/security$/)
    await expect(page.getByRole('heading', { name: 'Keamanan Akun', exact: true })).toBeVisible()
  })
})

test.describe('keyboard and focus', () => {
  test.beforeEach(async ({ page }) => mockAdminApi(page))

  test('the skip link moves focus past the navigation', async ({ page }) => {
    await page.goto('/admin/security')
    await expect(page.getByRole('heading', { name: 'Keamanan Akun', exact: true })).toBeVisible()
    const skip = page.getByRole('link', { name: 'Lewati navigasi' })
    // A fresh page has focus on the document; the first Tab must land on the skip link.
    await page.evaluate(() => document.activeElement?.blur())
    await page.keyboard.press('Tab')
    await expect(skip).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#admin-main-content$/)
  })

  test('the mobile menu closes with Escape and returns focus to its button', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/admin')
    const trigger = page.getByRole('button', { name: 'Buka menu admin', exact: true })
    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('dialog', { name: 'Navigasi admin' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Navigasi admin' })).toHaveCount(0)
    await expect(trigger).toBeFocused()
  })

  test('a user form opened from the keyboard closes with Escape and focus returns to its opener', async ({ page }) => {
    await page.goto('/admin/users')
    const opener = page.getByRole('button', { name: /Tambah Pengguna/ }).first()
    await opener.focus()
    await page.keyboard.press('Enter')
    const dialogHeading = page.getByRole('heading', { name: 'Tambah Pengguna' })
    await expect(dialogHeading).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(dialogHeading).toHaveCount(0)
    await expect(opener).toBeFocused()
  })
})

test.describe('public maintenance notice', () => {
  test('shows on marketing pages while active and never on the admin panel', async ({ page }) => {
    await mockAdminApi(page)
    await page.route('**/api/public/status', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ maintenance: { active: true, message: 'Kami sedang perawatan singkat.', until: null, blocks: ['checkout'] } }) }),
    )
    await page.goto('/')
    await expect(page.getByTestId('maintenance-banner')).toContainText('Kami sedang perawatan singkat.')
    await page.goto('/admin')
    await expect(page.getByTestId('maintenance-banner')).toHaveCount(0)
  })
})
