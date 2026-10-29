import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'

const api = vi.hoisted(() => ({
  overview: vi.fn(),
  invitations: vi.fn(),
  queue: vi.fn(),
  health: vi.fn(),
  maintenance: vi.fn(),
  ga4: vi.fn(),
  replace: vi.fn(),
  role: { value: 'superadmin' },
}))
vi.mock('@/api/admin.js', () => ({
  fetchAdminDashboardOverview: api.overview,
  fetchAdminInvitations: api.invitations,
  fetchAdminActionQueue: api.queue,
  fetchAdminUsers: vi.fn().mockResolvedValue({ total: 0 }),
  fetchAdminGuests: vi.fn().mockResolvedValue({ total: 0 }),
  fetchAdminTemplates: vi.fn().mockResolvedValue({ total: 0 }),
  fetchAdminStats: vi.fn().mockResolvedValue({}),
}))
vi.mock('@/api/adminAnalytics.js', () => ({ fetchAnalyticsReport: api.ga4 }))
vi.mock('@/api/adminSecurity.js', () => ({
  fetchAdminHealthReport: api.health,
  fetchMaintenance: api.maintenance,
}))
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({ adminRole: api.role.value, loadAdminAccess: vi.fn() }),
}))
vi.mock('@/api/adminAffiliate.js', () => ({
  getAdminResellers: vi.fn().mockResolvedValue({}),
  getAdminWithdrawals: vi.fn().mockResolvedValue({}),
}))
vi.mock('vue-toastification', () => ({ useToast: () => ({ success: vi.fn(), error: vi.fn() }) }))
vi.mock('vue-router', async (importOriginal) => ({
  ...(await importOriginal()),
  useRoute: () => ({ query: {} }),
  useRouter: () => ({
    replace: api.replace,
    push: vi.fn(),
    resolve: (to) => ({ href: to.path + '?' + new URLSearchParams(to.query).toString() }),
  }),
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
  api.queue.mockResolvedValue({
    count: 0,
    items: [],
    countsBySource: { transaksi: 0, undangan: 0, payout: 0 },
    unavailableSources: [{ source: 'bantuan', reason: 'Fitur bantuan pelanggan belum ada.' }],
    note: 'Antrean mengambil data dari pusat pembayaran.',
  })
  api.health.mockResolvedValue({
    worst: 'error',
    services: [
      { key: 'database', label: 'Database', status: 'available' },
      { key: 'payment', label: 'Payment gateway (Midtrans)', status: 'error' },
    ],
  })
  api.maintenance.mockResolvedValue({ active: false })
  api.ga4.mockResolvedValue({ status: 'not_connected' })
  api.role.value = 'superadmin'
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
    expect(wrapper.text()).toContain('GA4 belum tersambung ke panel admin')
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

  it('shows the action queue with reason, age, priority and links, and names unavailable sources', async () => {
    api.queue.mockResolvedValueOnce({
      count: 2,
      countsBySource: { transaksi: 1, undangan: 0, payout: 1 },
      unavailableSources: [{ source: 'bantuan', reason: 'Fitur bantuan pelanggan belum ada.' }],
      note: 'Antrean mengambil data dari pusat pembayaran.',
      items: [
        { key: 'a', title: 'Lunas Belum Terbit', priority: 1, priorityLabel: 'Tinggi', reason: 'Order A lunas tetapi Draft', ageHours: 5, amount: 99000, link: '/admin/payments?tab=reconciliation&type=SUCCESS_NOT_PUBLISHED', linkNote: null },
        { key: 'b', title: '2 permintaan penarikan', priority: 2, priorityLabel: 'Sedang', reason: 'Belum diproses', ageHours: 80, amount: 150000, link: null, linkNote: 'Halaman payout belum aktif' },
      ],
    })
    const wrapper = mountDashboard()
    await flushPromises()
    const queue = wrapper.get('[data-testid="action-queue"]')
    expect(queue.text()).toContain('Lunas Belum Terbit')
    expect(queue.text()).toContain('Tinggi')
    expect(queue.text()).toContain('Order A lunas tetapi Draft')
    expect(queue.text()).toContain('Umur 5 jam')
    expect(queue.text()).toContain('Umur 3 hari')
    expect(queue.text()).toContain('Halaman payout belum aktif')
    expect(queue.text()).toContain('Belum tersedia (bantuan)')
    const link = queue.findAllComponents(RouterLinkStub).find((item) => item.props('to').includes('SUCCESS_NOT_PUBLISHED'))
    expect(link).toBeTruthy()
  })

  it('opens every KPI, chart point and category on the same period and definition', async () => {
    const wrapper = mountDashboard()
    await flushPromises()
    const targets = wrapper.findAllComponents(RouterLinkStub).map((item) => item.props('to'))
    const created = targets.find((to) => typeof to === 'object' && to.path === '/admin/invitations' && !to.query.category && to.query.startDate === '2026-10-23' && to.query.endDate === '2026-10-29')
    expect(created).toBeTruthy()
    expect(targets).toContainEqual(expect.objectContaining({ path: '/admin/payments', query: expect.objectContaining({ kind: 'paid', startDate: '2026-10-23', endDate: '2026-10-29' }) }))
    expect(targets).toContainEqual(expect.objectContaining({ path: '/admin/invitations', query: { category: 'Modern', startDate: '2026-10-23', endDate: '2026-10-29' } }))
    expect(targets).toContainEqual(expect.objectContaining({ path: '/admin/invitations', query: { startDate: '2026-10-23', endDate: '2026-10-23' } }))
    expect(targets).toContain('/admin/users')
    expect(wrapper.find('a[aria-label*="2026-10-23"]').exists()).toBe(true)
  })

  it('shows GA4 numbers only when connected, otherwise says so instead of zero', async () => {
    api.ga4.mockResolvedValueOnce({
      status: 'ready',
      generatedAt: '2026-10-29T01:00:00Z',
      scope: { name: 'Halaman marketing pada domain utama' },
      reports: { summary: { current: { activeUsers: 120, sessions: 150, engagementRate: 0.512 } } },
    })
    const wrapper = mountDashboard()
    await flushPromises()
    const card = wrapper.get('[data-testid="ga4-card"]')
    expect(card.text()).toContain('120')
    expect(card.text()).toContain('51.2%')
    expect(card.text()).not.toContain('belum tersambung')
  })

  it('reports a restricted role instead of a fake empty GA4 card', async () => {
    api.ga4.mockRejectedValueOnce(Object.assign(new Error('Forbidden'), { status: 403 }))
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.get('[data-testid="ga4-card"]').text()).toContain('Role Anda tidak memiliki akses')
  })

  it('shows real service status and maintenance to a superadmin only', async () => {
    const wrapper = mountDashboard()
    await flushPromises()
    const card = wrapper.get('[data-testid="system-card"]')
    expect(card.text()).toContain('Tersedia')
    expect(card.text()).toContain('Error')
    expect(card.get('[data-testid="maintenance-status"]').text()).toContain('normal')

    api.role.value = 'finance'
    api.health.mockClear()
    const restricted = mountDashboard()
    await flushPromises()
    expect(restricted.get('[data-testid="system-card"]').text()).toContain('hanya tersedia untuk superadmin')
    expect(api.health).not.toHaveBeenCalled()
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
