import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AdminAnalytics from '@/views/admin/AdminAnalytics.vue'

const api = vi.hoisted(() => ({
  report: vi.fn(), funnel: vi.fn(), purchases: vi.fn(), attribution: vi.fn(), quality: vi.fn(), insights: vi.fn(),
  refresh: vi.fn(), add: vi.fn(), remove: vi.fn(), role: { value: 'superadmin' },
}))
vi.mock('@/api/adminAnalytics.js', () => ({
  fetchAnalyticsReport: api.report, fetchAnalyticsFunnel: api.funnel, fetchAnalyticsPurchases: api.purchases,
  fetchAnalyticsAttribution: api.attribution, fetchAnalyticsQuality: api.quality, fetchAnalyticsInsights: api.insights,
  refreshAnalyticsInsights: api.refresh, addAnalyticsAnnotation: api.add, removeAnalyticsAnnotation: api.remove,
}))
vi.mock('@/stores/auth', () => ({ useAuthStore: () => ({ adminRole: api.role.value, loadAdminAccess: vi.fn() }) }))
vi.mock('vue-toastification', () => ({ useToast: () => ({ success: vi.fn(), error: vi.fn() }) }))
vi.mock('@/components/admin/AdminShell.vue', () => ({ default: { template: '<div><slot /></div>' } }))

const stage = (key, label, count, a = null, b = null) => ({ key, label, count, rateFromPrevious: a, rateFromStart: b })
const funnelSide = (counts) => ({
  stages: [stage('draft_created', 'Undangan dibuat', counts[0], null, 100), stage('checkout_started', 'Masuk checkout', counts[1], 50, 50), stage('paid', 'Dibayar (terverifikasi)', counts[2], 50, 25), stage('published', 'Dipublikasikan', counts[3], 100, 25)],
  freeActivated: 1, dropoff: [], medianHours: { toCheckout: 2, toPaid: 12.5 },
})

beforeEach(() => {
  vi.clearAllMocks()
  api.role.value = 'superadmin'
  api.report.mockResolvedValue({ status: 'not_connected', missingConfiguration: ['GA4_PROPERTY_ID', 'GA4_PRIVATE_KEY'] })
  api.funnel.mockResolvedValue({
    backend: { all: funnelSide([8, 4, 2, 2]), mature: funnelSide([6, 3, 2, 2]), cohort: { size: 8, matureSize: 6, immatureSize: 2, maturityDays: 7, note: '2 undangan dibuat kurang dari 7 hari lalu dan masih bisa berubah.' } },
    upstreamGa4: { status: 'not_connected' },
    definitions: { denominator: 'Undangan yang dibuat pada periode (WIB).' },
  })
  api.purchases.mockResolvedValue({
    backend: { orders: 2, revenue: 200000 }, excluded: { free: 1, simulation: 1, pending: 0, failed: 0 }, dispatch: { sent: 1, failed: 0, skipped: 1, waiting: 0 },
    server: { measurementProtocol: 'not_configured', missing: ['GA4_MEASUREMENT_ID', 'GA4_API_SECRET'] }, ga4: { status: 'not_connected' },
    daily: [{ date: '2026-10-28', backendOrders: 2, backendRevenue: 200000, ga4Purchases: null, ga4Revenue: null, orderDifference: null, revenueDifference: null }],
    explanations: ['1 order tidak dikirim karena tidak ada GA client id.'], definition: 'Order dibayar = status success dari Midtrans dengan nominal > 0.',
  })
  api.attribution.mockResolvedValue({
    paidOrders: { total: 2, bySource: [{ label: 'instagram / social', orders: 1, revenue: 100000 }, { label: 'unknown', orders: 1, revenue: 100000 }] },
    ga4: { status: 'ready', warnings: ['Sebagian sesi berasal dari domain login/pembayaran'], sessionSource: [], firstUserSource: [], gatewayReferrals: [] },
    definitions: { gateways: 'Domain login dan gateway pembayaran tidak dianggap sumber akuisisi.' },
  })
  api.quality.mockResolvedValue({
    status: 'ready', checkedAt: '2026-10-29T03:00:00Z', expectedEventSchemaVersion: '2', trackingValidFrom: '2026-10-29',
    purchaseCoverage: { percent: 50, sent: 1, verified: 2 },
    alerts: [{ level: 'critical', code: 'duplicate_purchase', message: '2 transaction_id muncul lebih dari sekali di GA4.' }, { level: 'info', code: 'tracking_valid_from', message: 'Data sebelum 2026-10-29 memakai skema lama.' }],
  })
  api.insights.mockResolvedValue({
    note: 'Insight dihitung terjadwal.', generatedAt: '2026-10-29T02:15:00Z',
    items: [{ id: 1, title: 'Kanal instagram ramai tetapi jarang menghasilkan order berbayar', detail: '600 sesi dan 1 order.', hypothesis: 'Dugaan: audiens belum siap membeli. Perlu dicek, belum terbukti.', periodStart: '2026-10-01', periodEnd: '2026-10-29', link: '/admin?tab=analytics' }],
    annotations: [{ id: 5, date: '2026-10-20', kind: 'release', label: 'Rilis checkout baru' }],
  })
})

const mountView = () => mount(AdminAnalytics, { global: { stubs: { RouterLink: RouterLinkStub } } })

describe('admin analytics', () => {
  it('names the missing GA4 configuration instead of showing numbers', async () => {
    const wrapper = mountView()
    await flushPromises()
    expect(wrapper.get('[data-testid="ga4-not-connected"]').text()).toContain('GA4_PROPERTY_ID, GA4_PRIVATE_KEY')
  })

  it('shows the funnel with a maturity note and no fake GA4 stages when not connected', async () => {
    const wrapper = mountView()
    await flushPromises()
    expect(wrapper.get('[data-testid="cohort-note"]').text()).toContain('2 undangan')
    const rows = wrapper.findAll('#an-panel-funnel [data-stage="paid"]')
    expect(rows).toHaveLength(2)
    expect(rows[0].text()).toContain('Dibayar (terverifikasi)')
    expect(wrapper.get('#an-panel-funnel').text()).toContain('GA4 belum tersambung; tahap hulu tidak tersedia')
  })

  it('leaves GA4 purchase cells empty, explains the difference and flags missing server config', async () => {
    const wrapper = mountView()
    await flushPromises()
    const panel = wrapper.get('#an-panel-purchases')
    expect(panel.get('[data-testid="mp-not-configured"]').text()).toContain('GA4_API_SECRET')
    expect(panel.text()).toContain('—')
    expect(panel.text()).toContain('tidak ada GA client id')
    expect(panel.text()).toContain('gratis 1, simulasi 1')
  })

  it('keeps unknown as unknown and warns about gateway referrals', async () => {
    const wrapper = mountView()
    await flushPromises()
    const panel = wrapper.get('#an-panel-attribution')
    expect(panel.text()).toContain('unknown')
    expect(panel.get('[data-testid="gateway-warning"]').text()).toContain('domain login/pembayaran')
  })

  it('surfaces data-quality alerts by severity with coverage', async () => {
    const wrapper = mountView()
    await flushPromises()
    expect(wrapper.get('[data-testid="coverage"]').text()).toContain('50%')
    expect(wrapper.get('[data-testid="alerts"]').text()).toContain('critical')
    expect(wrapper.get('[data-testid="alerts"]').text()).toContain('2 transaction_id')
  })

  it('shows insights as hypotheses with period and a link, plus annotations', async () => {
    const wrapper = mountView()
    await flushPromises()
    const insight = wrapper.get('[data-testid="insights"]')
    expect(insight.text()).toContain('Dugaan')
    expect(insight.text()).toContain('2026-10-01')
    expect(wrapper.get('[data-testid="annotations"]').text()).toContain('Rilis checkout baru')
  })

  it('hides write controls from non-superadmins', async () => {
    api.role.value = 'finance'
    const wrapper = mountView()
    await flushPromises()
    expect(wrapper.text()).not.toContain('Hitung ulang')
    expect(wrapper.find('#n-label').exists()).toBe(false)
  })

  it('shows a persistent error with retry for one failing report without hiding the others', async () => {
    api.funnel.mockRejectedValueOnce(new Error('Funnel gagal'))
    const wrapper = mountView()
    await flushPromises()
    expect(wrapper.get('#an-panel-funnel [role="alert"]').text()).toContain('Funnel gagal')
    expect(wrapper.get('#an-panel-quality').text()).toContain('Cakupan purchase')
    await wrapper.get('#an-panel-funnel [role="alert"] button').trigger('click')
    await flushPromises()
    expect(wrapper.find('#an-panel-funnel [role="alert"]').exists()).toBe(false)
  })

  it('reloads every report with the chosen period', async () => {
    const wrapper = mountView()
    await flushPromises()
    await wrapper.get('select[name="period"]').setValue('30')
    await flushPromises()
    expect(api.funnel).toHaveBeenLastCalledWith({ days: 30 })
    expect(api.purchases).toHaveBeenLastCalledWith({ days: 30 })
  })
})
