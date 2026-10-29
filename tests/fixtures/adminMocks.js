// Shared API mocks for admin pages that run entirely in the browser without a backend.
export const overview = {
  period: { startDate: '2026-10-23', endDate: '2026-10-29', previousStartDate: '2026-10-16', previousEndDate: '2026-10-22', includesToday: true, timezone: 'Asia/Jakarta', asOf: '2026-10-29T01:00:00Z' },
  totals: { users: 10, invitations: 9, guests: 80, templates: 3, activeResellers: 2, pendingWithdrawals: 0 },
  metrics: { revenue: 79000, paidOrders: 1, paidInvitations: 1, buyers: 1, freeActivations: 2, aiRevenue: 5000, aiOrders: 1, invitationsCreated: 3, averageOrderValue: 79000, pendingOrders: 1, unverifiedSuccesses: 0 },
  comparison: { revenue: { value: 79000, previous: 0, delta: 79000, percent: null } },
  trend: [{ date: '2026-10-23', dayLabel: '10-23', count: 3, revenue: 79000, paidOrders: 1 }],
  categories: [{ category: 'Modern', count: 3 }],
  sourceWarnings: [],
  sources: { visitors: 'not_connected', currentGatewayEnvironment: 'sandbox_or_unconfirmed' },
  definitions: { revenue: 'Penerimaan setelah diskon; biaya belum dikurangi.', history: 'Lingkungan transaksi lama belum tersimpan.' },
}

const funnelSide = (c) => ({
  stages: [
    { key: 'draft_created', label: 'Undangan dibuat', count: c[0], rateFromPrevious: null, rateFromStart: 100 },
    { key: 'checkout_started', label: 'Masuk checkout', count: c[1], rateFromPrevious: 50, rateFromStart: 50 },
    { key: 'paid', label: 'Dibayar (terverifikasi)', count: c[2], rateFromPrevious: 50, rateFromStart: 25 },
    { key: 'published', label: 'Dipublikasikan', count: c[3], rateFromPrevious: 100, rateFromStart: 25 },
  ],
  freeActivated: 1, dropoff: [], medianHours: { toCheckout: 2, toPaid: 12.5 },
})

export function adminBody(path, role = 'superadmin') {
  const empty = { data: [], total: 0 }
  const table = {
    '/user/me': { id: 999, name: 'Admin Test', email: 'admin@example.invalid', isAdmin: true, provider: 'local', emailVerifiedAt: '2026-10-01', isApproved: true },
    '/auth/admin/security': {
      adminRole: role,
      allowedResources: role === 'finance' ? ['dashboard', 'stats', 'payments', 'promo-codes', 'banks', 'invitations', 'analytics'] : [],
      totpEnabled: false, recoveryCodesRemaining: 0,
      lastLogin: { at: '2026-10-28T03:00:00Z', ip: '1.2.3.4', userAgent: 'Mozilla/5.0 (Macintosh) Chrome/120.0' },
      sessions: [
        { id: 'cur', current: true, ip: '1.1.1.1', userAgent: 'Chrome/120 Windows', createdAt: '2026-10-29T01:00:00Z', lastSeenAt: '2026-10-29T03:00:00Z' },
        { id: 'old', current: false, ip: '2.2.2.2', userAgent: 'Firefox/120 Linux', createdAt: '2026-10-27T01:00:00Z', lastSeenAt: '2026-10-28T03:00:00Z' },
      ],
    },
    '/admin/dashboard/overview': overview,
    '/admin/dashboard/actions': { count: 1, items: [{ key: 'a', title: 'Lunas Belum Terbit', priority: 1, priorityLabel: 'Tinggi', reason: 'Order A lunas tetapi Draft', ageHours: 5, amount: 99000, link: '/admin/payments?tab=reconciliation&type=SUCCESS_NOT_PUBLISHED', linkNote: null }], countsBySource: { transaksi: 1, undangan: 0, payout: 0 }, unavailableSources: [{ source: 'bantuan', reason: 'Fitur bantuan pelanggan belum ada.' }], note: 'Antrean dari pusat pembayaran.' },
    '/admin/analytics': { status: 'not_connected', missingConfiguration: ['GA4_PROPERTY_ID'] },
    '/admin/analytics/funnel': { backend: { all: funnelSide([8, 4, 2, 2]), mature: funnelSide([6, 3, 2, 2]), cohort: { size: 8, matureSize: 6, immatureSize: 2, maturityDays: 7, note: '2 undangan dibuat kurang dari 7 hari lalu.' } }, upstreamGa4: { status: 'not_connected' }, definitions: { denominator: 'Undangan yang dibuat pada periode (WIB).' } },
    '/admin/analytics/purchases': { backend: { orders: 2, revenue: 200000 }, excluded: { free: 1, simulation: 1, pending: 0, failed: 0 }, dispatch: { sent: 1, failed: 0, skipped: 1, waiting: 0 }, server: { measurementProtocol: 'not_configured', missing: ['GA4_MEASUREMENT_ID'] }, ga4: { status: 'not_connected' }, daily: [{ date: '2026-10-28', backendOrders: 2, backendRevenue: 200000, ga4Purchases: null, ga4Revenue: null, orderDifference: null, revenueDifference: null }], explanations: ['Selisih wajar di batas tengah malam.'], definition: 'Order dibayar = status success dari Midtrans.' },
    '/admin/analytics/attribution': { paidOrders: { total: 1, bySource: [{ label: 'unknown', orders: 1, revenue: 100000 }] }, ga4: { status: 'not_connected' }, definitions: { gateways: 'Gateway tidak dianggap sumber.' } },
    '/admin/analytics/quality': { status: 'not_connected', checkedAt: '2026-10-29T03:00:00Z', expectedEventSchemaVersion: '2', trackingValidFrom: '2026-10-29', purchaseCoverage: { percent: null, sent: 0, verified: 0 }, alerts: [{ level: 'info', code: 'ga4_not_connected', message: 'GA4 belum tersambung.' }] },
    '/admin/analytics/insights': { note: 'Belum ada insight.', generatedAt: null, items: [], annotations: [] },
    '/admin/health': { checkedAt: '2026-10-29T03:00:00Z', worst: 'error', services: [{ key: 'database', label: 'Database', required: true, status: 'available', message: 'Query uji berhasil (5 ms)', latencyMs: 5, checkedAt: '2026-10-29T03:00:00Z', method: 'SELECT 1' }, { key: 'payment', label: 'Payment gateway (Midtrans)', required: true, status: 'error', message: 'Midtrans menolak server key (401)', latencyMs: 90, checkedAt: '2026-10-29T03:00:00Z', method: 'GET status order uji' }] },
    '/admin/maintenance': { enabled: false, active: false, message: 'Sedang perawatan', reason: '', until: null, scope: 'Menonaktifkan pembelian baru.' },
    '/admin/audit-logs': { items: [{ id: 1, createdAt: '2026-10-29T03:00:00Z', actorEmail: 'a@x.id', actorRole: 'superadmin', action: 'users.update', entityType: 'users', entityId: '7', before: { name: 'A' }, after: { name: 'B' }, reason: null, result: 'success', statusCode: 200, requestId: 'req-1' }], total: 1, page: 1, totalPages: 1 },
    '/admin/payments/stats': { grossRevenue: 79000, netRevenue: 79000, discountTotal: 0, statusCounts: { success: 1, pending: 0, failed: 0, expired: 0 } },
    '/admin/articles/bot-status': { autoBlogEnabled: true, geminiConfigured: true, scheduleTime: '08:00 WIB', curatedKeywordsRemaining: 48, curatedKeywordsTotal: 100, historyAvailable: true, lastAttemptAt: null, lastSuccessAt: null, lastError: null, runState: 'unknown' },
    '/admin/articles': { items: [{ id: 1, title: 'Panduan Nikah', slug: 'panduan-nikah', content: '<p>Panduan</p>', status: 'draft', author: { name: 'Admin' } }], total: 1, statusCounts: { all: 1, draft: 1, published: 0 } },
    '/admin/logs/stats': { total: 0, errors: 0, warnings: 0 },
    '/admin/users': { data: [{ id: 7, name: 'Rani', email: 'rani@example.invalid', isAdmin: false, provider: 'local', emailVerifiedAt: '2026-10-01', createdAt: '2026-10-01T00:00:00Z' }, { id: 8, name: 'Sari', email: 'sari@example.invalid', isAdmin: true, adminRole: 'support', provider: 'local', createdAt: '2026-10-02T00:00:00Z' }], total: 2 },
  }
  return table[path] ?? empty
}

export async function mockAdminApi(page, role = 'superadmin') {
  await page.route('**/*', (route) => (['127.0.0.1', 'localhost'].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort()))
  await page.route('**/api/**', (route) => {
    const pathname = new URL(route.request().url()).pathname
    if (!pathname.startsWith('/api/')) return route.fallback()
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(adminBody(pathname.replace(/^\/api/, ''), role)) })
  })
  await page.addInitScript(() => localStorage.setItem('token', 'mock-admin'))
}
