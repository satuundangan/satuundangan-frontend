import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'

const api = vi.hoisted(() => ({
  overview: vi.fn(),
  invitations: vi.fn(),
  queue: vi.fn(),
  health: vi.fn(),
  replace: vi.fn(),
}))
vi.mock('@/api/admin.js', () => ({
  fetchAdminDashboardOverview: api.overview,
  fetchAdminInvitations: api.invitations,
  fetchAdminPaymentReconciliationQueue: api.queue,
  fetchAdminHealth: api.health,
  fetchAdminUsers: vi.fn().mockResolvedValue({ total: 0 }),
  fetchAdminGuests: vi.fn().mockResolvedValue({ total: 0 }),
  fetchAdminTemplates: vi.fn().mockResolvedValue({ total: 0 }),
  fetchAdminStats: vi.fn().mockResolvedValue({}),
}))
vi.mock('@/api/adminAffiliate.js', () => ({
  getAdminResellers: vi.fn().mockResolvedValue({}),
  getAdminWithdrawals: vi.fn().mockResolvedValue({}),
}))
vi.mock('vue-toastification', () => ({ useToast: () => ({ success: vi.fn(), error: vi.fn() }) }))
vi.mock('vue-router', async (importOriginal) => ({
  ...(await importOriginal()),
  useRoute: () => ({ query: {} }),
  useRouter: () => ({ replace: api.replace }),
}))
vi.mock('@/components/admin/AdminShell.vue', () => ({
  default: { template: '<div><slot /></div>' },
}))

function overview() {
  return {
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
      revenue: 'Penerimaan undangan setelah diskon.',
      history: 'Lingkungan transaksi lama belum tersimpan.',
    },
  }
}

const mountDashboard = () =>
  mount(AdminDashboard, {
    global: { stubs: { RouterLink: RouterLinkStub, DataTable: true, Column: true } },
  })

beforeEach(() => {
  vi.clearAllMocks()
  api.overview.mockResolvedValue(overview())
  api.invitations.mockResolvedValue({ data: [], total: 0 })
  api.queue.mockResolvedValue({ count: 0, items: [], countsByType: {} })
  api.health.mockResolvedValue({
    database: { status: 'healthy', msg: 'Terhubung' },
    storage: { status: 'configured', msg: 'Konfigurasi tersedia' },
  })
  api.replace.mockResolvedValue(undefined)
})

describe('business dashboard', () => {
  it('shows separate money/free/AI units and an explicit unconnected visitor state', async () => {
    const wrapper = mountDashboard()
    await flushPromises()
    expect(api.overview).toHaveBeenCalledWith({ days: 7 })
    expect(wrapper.text()).toContain('Penerimaan undangan')
    expect(wrapper.text()).toContain('Aktivasi gratis')
    expect(wrapper.text()).toContain('Penerimaan kredit AI')
    expect(wrapper.text()).toContain('Undangan dibuat')
    expect(wrapper.text()).toContain('GA4 belum terhubung ke panel admin')
    expect(wrapper.text()).not.toContain('Infinity')
  })

  it('shows a persistent source failure and retries instead of reporting false zeros', async () => {
    api.overview.mockRejectedValueOnce(new Error('Data pembayaran gagal dimuat'))
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.get('[role="alert"]').text()).toContain('Data pembayaran gagal dimuat')
    expect(wrapper.find('[data-testid="business-metrics"]').exists()).toBe(false)
    await wrapper
      .findAll('button')
      .find((button) => button.text().includes('Coba lagi'))
      .trigger('click')
    await flushPromises()
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="business-metrics"]').exists()).toBe(true)
  })

  it('reloads when period changes and preserves query parameters', async () => {
    const wrapper = mountDashboard()
    await flushPromises()
    await wrapper.get('select[name="period"]').setValue('30')
    await flushPromises()
    expect(api.overview).toHaveBeenLastCalledWith({ days: 30 })
    expect(api.replace).toHaveBeenCalledWith({ query: { days: '30' } })
  })

  it('distinguishes queue failure from an empty queue and snapshot unknown from zero', async () => {
    api.queue.mockRejectedValueOnce(new Error('Antrean tidak tersedia'))
    api.overview.mockResolvedValueOnce({
      ...overview(),
      totals: { ...overview().totals, guests: null },
      sourceWarnings: ['guests'],
    })
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.text()).toContain('Antrean tidak tersedia')
    expect(wrapper.text()).toContain('Belum tersedia')
    expect(wrapper.text()).not.toContain('Semua transaksi sudah sesuai')
  })

  it('keeps the latest selected period when an earlier request finishes last', async () => {
    let finishOld
    api.overview.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishOld = resolve
        }),
    )
    const wrapper = mountDashboard()
    await flushPromises()
    await wrapper.get('select[name="period"]').setValue('30')
    await flushPromises()
    finishOld({ ...overview(), metrics: { ...overview().metrics, revenue: 999999 } })
    await flushPromises()
    expect(wrapper.text()).not.toContain('999.999')
    expect(wrapper.text()).toContain('79.000')
  })
})
