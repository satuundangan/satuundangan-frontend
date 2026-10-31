import { test, expect } from '@playwright/test'

const overview = {
  period: {
    startDate: '2026-10-23',
    endDate: '2026-10-29',
    previousStartDate: '2026-10-16',
    previousEndDate: '2026-10-22',
    includesToday: true,
    timezone: 'Asia/Jakarta',
    asOf: '2026-10-29T01:00:00Z',
  },
  totals: {
    users: 10,
    invitations: 9,
    guests: 80,
    templates: 3,
    activeResellers: 2,
    pendingWithdrawals: 0,
  },
  metrics: {
    revenue: 79000,
    paidOrders: 1,
    paidInvitations: 1,
    buyers: 1,
    freeActivations: 2,
    aiRevenue: 5000,
    aiOrders: 1,
    invitationsCreated: 3,
    averageOrderValue: 79000,
    pendingOrders: 1,
    unverifiedSuccesses: 0,
  },
  comparison: { revenue: { value: 79000, previous: 0, delta: 79000, percent: null } },
  trend: [{ date: '2026-10-23', dayLabel: '10-23', count: 3, revenue: 79000, paidOrders: 1 }],
  categories: [{ category: 'Modern', count: 3 }],
  sourceWarnings: [],
  sources: { visitors: 'not_connected', currentGatewayEnvironment: 'sandbox_or_unconfirmed' },
  definitions: {
    revenue: 'Penerimaan setelah diskon; biaya belum dikurangi.',
    history: 'Lingkungan transaksi lama belum tersimpan.',
  },
}

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => console.log('Admin browser error:', error.message))
  page.on('console', (message) => { if (message.type() === 'error') console.log('Admin console error:', message.text()) })
  await page.route('**/*', (route) =>
    ['127.0.0.1', 'localhost'].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort(),
  )
  await page.route('**/api/**', (route) => {
    const pathname = new URL(route.request().url()).pathname
    if (!pathname.startsWith('/api/')) return route.fallback()
    const path = pathname.replace(/^\/api/, '')
    let body = { data: [], total: 0 }
    if (path === '/user/me')
      body = {
        id: 999,
        name: 'Admin Test',
        email: 'admin@example.invalid',
        isAdmin: true,
        provider: 'local',
        emailVerifiedAt: '2026-10-01',
        isApproved: true,
      }
    if (path === '/admin/dashboard/overview') body = overview
    if (path === '/auth/admin/security')
      body = { adminRole: 'superadmin', allowedResources: [], totpEnabled: false, recoveryCodesRemaining: 0, lastLogin: null, sessions: [] }
    if (path === '/admin/dashboard/actions')
      body = { count: 0, items: [], countsBySource: { transaksi: 0, undangan: 0, payout: 0 }, unavailableSources: [{ source: 'bantuan', reason: 'Fitur bantuan pelanggan belum ada.' }], note: 'Antrean dari pusat pembayaran.' }
    if (path === '/admin/analytics')
      body = { status: 'not_connected', missingConfiguration: ['GA4_PROPERTY_ID'] }
    if (path === '/admin/health')
      body = { checkedAt: '2026-10-29T03:00:00Z', worst: 'available', services: [{ key: 'database', label: 'Database', status: 'available' }] }
    if (path === '/admin/maintenance') body = { enabled: false, active: false, message: 'm', reason: '', until: null, scope: 's' }
    if (path === '/admin/payments/stats')
      body = {
        grossRevenue: 79000,
        netRevenue: 79000,
        discountTotal: 0,
        statusCounts: { success: 1, pending: 0, failed: 0, expired: 0 },
      }
    if (path === '/admin/articles')
      body = {
        items: [
          {
            id: 1,
            title: 'Panduan Nikah',
            slug: 'panduan-nikah',
            content: '<p>Panduan</p>',
            status: 'draft',
            author: { name: 'Admin' },
          },
        ],
        total: 21,
        statusCounts: { all: 40, draft: 21, published: 19 },
      }
    if (path === '/admin/articles/bot-status')
      body = {
        autoBlogEnabled: true,
        geminiConfigured: true,
        scheduleTime: '08:00 WIB',
        curatedKeywordsRemaining: 48,
        curatedKeywordsTotal: 100,
        historyAvailable: true,
        lastAttemptAt: null,
        lastSuccessAt: null,
        lastError: null,
        runState: 'unknown',
      }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body),
    })
  })
  await page.addInitScript(() => localStorage.setItem('token', 'mock-admin-growth'))
})

test('dashboard drilldown retains paid kind and the period on payments', async ({ page }) => {
  await page.goto('/admin')
  await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible()
  await expect(page.getByTestId('business-metrics')).toContainText('Penerimaan undangan')
  await expect(page.getByTestId('ga4-card')).toContainText('GA4 belum tersambung ke panel admin')
  await page.getByRole('link', { name: 'Lihat transaksi sumber' }).first().click()
  await expect(page).toHaveURL(/kind=paid/)
  await expect(page).toHaveURL(/startDate=2026-10-23/)
  await expect(
    page.getByRole('heading', { name: 'Pembayaran & Transaksi', exact: true }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Ekspor CSV', exact: true })).toBeVisible()
  await expect(page.locator('input[type="date"]').first()).toHaveValue('2026-10-23')
})

test('mobile admin menu stays usable and closes when navigating', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/admin')
  const trigger = page.getByRole('button', { name: 'Buka menu admin', exact: true })
  await expect(trigger).toBeVisible()
  await trigger.click()
  const drawer = page.getByRole('dialog', { name: 'Navigasi admin' })
  await expect(drawer).toBeVisible()
  await expect(drawer.getByRole('link', { name: 'Master Bank & E-wallet' })).toBeVisible()
  await drawer.getByRole('link', { name: 'Artikel & Blog', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Artikel & Blog', exact: true })).toBeVisible()
  await expect(drawer).toHaveCount(0)
  await expect(page.getByRole('button', { name: /^Published/ })).toContainText('19')
  await expect(page.getByText('48 dari 100', { exact: false })).toBeVisible()
  await expect(page.getByRole('columnheader', { name: 'Kelengkapan SEO' })).toBeVisible()
  await page.screenshot({
    path: '/private/tmp/satuundangan-admin-growth-mobile.png',
    fullPage: true,
  })
})

test('financial failure shows retry and no fabricated zero cards', async ({ page }) => {
  await page.route('**/api/admin/dashboard/overview**', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Sumber pembayaran belum tersedia' }),
    }),
  )
  await page.goto('/admin')
  await expect(page.getByRole('alert')).toContainText('Sumber pembayaran belum tersedia')
  await expect(page.getByTestId('business-metrics')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Coba lagi', exact: true })).toBeVisible()
})
