import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { reactive } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AdminPayments from '@/views/admin/AdminPayments.vue'

const api = vi.hoisted(() => ({
  payments: vi.fn(),
  stats: vi.fn(),
  queue: vi.fn(),
  export: vi.fn(),
  replace: vi.fn(),
}))
const routeState = reactive({ query: {} })
vi.mock('@/api/admin.js', () => ({
  fetchAdminPayments: api.payments,
  fetchAdminPaymentStats: api.stats,
  fetchAdminPaymentReconciliationQueue: api.queue,
  exportAdminPayments: api.export,
  fetchAdminPaymentDetail: vi.fn(),
  reconcileAdminPaymentPublish: vi.fn(),
  syncAdminPaymentGateway: vi.fn(),
}))
vi.mock('vue-router', async (original) => ({
  ...(await original()),
  useRoute: () => routeState,
  useRouter: () => ({ replace: api.replace }),
}))
vi.mock('vue-toastification', () => ({ useToast: () => ({ success: vi.fn(), error: vi.fn() }) }))
vi.mock('@/components/admin/AdminShell.vue', () => ({
  default: { name: 'AdminShell', template: '<div><slot name="actions" /><slot /></div>' },
}))
vi.mock('primevue/datatable', () => ({
  default: {
    name: 'DataTable',
    props: ['value'],
    emits: ['page'],
    template: '<div><slot /></div>',
  },
}))
vi.mock('primevue/column', () => ({ default: { template: '<div />' } }))

const queueItems = [
  {
    type: 'PENDING_AGING',
    title: 'Pending lama',
    description: 'Order A',
    createdAt: '2026-10-20T01:00:00Z',
  },
  {
    type: 'SUCCESS_NOT_PUBLISHED',
    title: 'Lunas belum terbit',
    description: 'Order B',
    createdAt: '2026-10-20T01:00:00Z',
  },
]
const render = () =>
  mount(AdminPayments, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
        Column: true,
        DataTable: {
          name: 'DataTable',
          props: ['value'],
          emits: ['page'],
          template: '<div><slot /></div>',
        },
      },
    },
  })

beforeEach(() => {
  vi.clearAllMocks()
  routeState.query = {}
  api.payments.mockResolvedValue({ data: [], total: 0 })
  api.stats.mockResolvedValue({ statusCounts: {}, netRevenue: 0 })
  api.queue.mockResolvedValue({ count: 2, items: queueItems })
  api.export.mockResolvedValue({ csv: 'id\n1', total: 1, filename: 'payments.csv' })
  api.replace.mockImplementation(async ({ query }) => {
    routeState.query = query
  })
  URL.createObjectURL = vi.fn().mockReturnValue('blob:csv')
  URL.revokeObjectURL = vi.fn()
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

describe('payment dashboard drilldowns', () => {
  it('loads and visibly preserves paid kind and date filters from a dashboard link', async () => {
    routeState.query = {
      status: 'success',
      purpose: 'invitation',
      kind: 'paid',
      startDate: '2026-10-20',
      endDate: '2026-10-20',
    }
    const wrapper = render()
    await flushPromises()
    expect(api.payments).toHaveBeenCalledWith(expect.objectContaining(routeState.query))
    expect(wrapper.get('select[aria-label="Jenis transaksi"]').element.value).toBe('paid')
    expect(wrapper.get('input[aria-label="Tanggal awal WIB"]').element.value).toBe('2026-10-20')
    expect(wrapper.text()).toContain('waktu pelunasan')
    wrapper.unmount()
  })

  it('carries date and kind filters through paging and CSV export', async () => {
    routeState.query = {
      status: 'success',
      purpose: 'ai_credits',
      kind: 'paid',
      startDate: '2026-10-20',
      endDate: '2026-10-21',
    }
    const wrapper = render()
    await flushPromises()
    wrapper.findComponent({ name: 'DataTable' }).vm.$emit('page', { page: 1 })
    await flushPromises()
    expect(api.payments).toHaveBeenLastCalledWith(
      expect.objectContaining({
        page: 2,
        kind: 'paid',
        purpose: 'ai_credits',
        startDate: '2026-10-20',
        endDate: '2026-10-21',
      }),
    )
    await wrapper
      .findAll('button')
      .find((button) => button.text().includes('Ekspor CSV'))
      .trigger('click')
    await flushPromises()
    expect(api.export).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: 'paid',
        purpose: 'ai_credits',
        startDate: '2026-10-20',
        endDate: '2026-10-21',
      }),
    )
    wrapper.unmount()
  })

  it('clears all transaction filters together', async () => {
    routeState.query = {
      kind: 'free',
      status: 'success',
      purpose: 'invitation',
      startDate: '2026-10-20',
      endDate: '2026-10-20',
      q: 'bride',
      page: '2',
    }
    const wrapper = render()
    await flushPromises()
    await wrapper
      .findAll('button')
      .find((button) => button.text().includes('Reset Filter'))
      .trigger('click')
    await flushPromises()
    expect(routeState.query).toEqual({})
    expect(api.payments).toHaveBeenLastCalledWith(
      expect.objectContaining({
        page: 1,
        kind: undefined,
        startDate: undefined,
        endDate: undefined,
      }),
    )
    wrapper.unmount()
  })

  it('opens the requested reconciliation tab/type and keeps the count explicitly scoped', async () => {
    routeState.query = { tab: 'reconciliation', type: 'PENDING_AGING' }
    const wrapper = render()
    await flushPromises()
    expect(wrapper.get('[data-testid="reconciliation-tab"]').isVisible()).toBe(true)
    expect(wrapper.get('[data-testid="transactions-tab"]').isVisible()).toBe(false)
    expect(wrapper.get('[data-testid="reconciliation-tab"]').text()).toContain('1 dari 2 hasil')
    expect(wrapper.get('[data-testid="reconciliation-tab"]').text()).toContain('Pending lama')
    expect(wrapper.get('[data-testid="reconciliation-tab"]').text()).not.toContain('Order B')
    await wrapper.get('select[aria-label="Jenis antrean rekonsiliasi"]').setValue('all')
    await flushPromises()
    expect(wrapper.get('[data-testid="reconciliation-tab"]').text()).toContain('Order B')
    expect(routeState.query.tab).toBe('reconciliation')
    wrapper.unmount()
  })

  it('honors a browser route change without a request loop', async () => {
    const wrapper = render()
    await flushPromises()
    routeState.query = {
      status: 'pending',
      kind: 'pending',
      startDate: '2026-10-20',
      endDate: '2026-10-20',
    }
    await flushPromises()
    expect(api.payments).toHaveBeenLastCalledWith(
      expect.objectContaining({ status: 'pending', kind: 'pending', startDate: '2026-10-20' }),
    )
    expect(api.payments).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })

  it('does not display an unavailable reconciliation source as an empty successful check', async () => {
    api.queue.mockRejectedValueOnce(new Error('Antrean tidak tersedia'))
    routeState.query = { tab: 'reconciliation' }
    const wrapper = render()
    await flushPromises()
    expect(wrapper.get('[data-testid="reconciliation-tab"]').text()).toContain(
      'Antrean tidak tersedia',
    )
    expect(wrapper.get('[data-testid="reconciliation-tab"]').text()).not.toContain(
      'Semua Transaksi Bersih',
    )
    expect(wrapper.text()).not.toContain('Semua tersinkron')
    wrapper.unmount()
  })
})
