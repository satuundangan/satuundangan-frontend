import { mount, flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AdminPromoCodes from '@/views/admin/AdminPromoCodes.vue'

const mockApi = vi.hoisted(() => ({
  fetchCodes: vi.fn(),
  fetchDetail: vi.fn(),
  fetchSummary: vi.fn(),
  createCode: vi.fn(),
  updateCode: vi.fn(),
  deleteCode: vi.fn(),
}))

vi.mock('@/api/admin.js', () => ({
  fetchAdminPromoCodes: mockApi.fetchCodes,
  fetchAdminPromoCodeDetail: mockApi.fetchDetail,
  fetchAdminPromoSummary: mockApi.fetchSummary,
  createAdminPromoCode: mockApi.createCode,
  updateAdminPromoCode: mockApi.updateCode,
  deleteAdminPromoCode: mockApi.deleteCode,
}))

vi.mock('vue-toastification', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}))

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn().mockResolvedValue({ isConfirmed: true }),
  },
}))

describe('AdminPromoCodes.vue (SAT-32)', () => {
  const dummyPromoList = {
    total: 2,
    page: 1,
    limit: 20,
    data: [
      {
        id: 1,
        code: 'NIKAH50',
        discount_type: 'percentage',
        discount_value: 50,
        max_uses: 100,
        used_count: 10,
        redemptions_count: 8,
        pending_reservations_count: 2,
        total_discount_amount: 400000,
        total_gross_revenue: 400000,
        is_active: true,
        is_exit_intent_active: true,
        exit_intent_text: 'Diskon 50% untuk pendaftaran hari ini!',
        valid_from: '2026-01-01T00:00:00.000Z',
        valid_until: '2026-12-31T23:59:59.000Z',
        computed_status: 'active',
      },
      {
        id: 2,
        code: 'HEMAT10K',
        discount_type: 'fixed',
        discount_value: 10000,
        max_uses: 10,
        used_count: 10,
        redemptions_count: 10,
        pending_reservations_count: 0,
        total_discount_amount: 100000,
        total_gross_revenue: 900000,
        is_active: true,
        is_exit_intent_active: false,
        exit_intent_text: null,
        valid_from: '2026-01-01T00:00:00.000Z',
        valid_until: '2026-02-01T00:00:00.000Z',
        computed_status: 'exhausted',
      },
    ],
  }

  const dummySummary = {
    success: true,
    data: {
      total_promos: 2,
      total_active_promos: 1,
      total_redemptions: 18,
      total_pending_reservations: 2,
      total_discount_amount: 500000,
      total_gross_revenue: 1300000,
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockApi.fetchCodes.mockResolvedValue(dummyPromoList)
    mockApi.fetchSummary.mockResolvedValue(dummySummary)
  })

  it('renders summary KPI cards and promo table with status badges', async () => {
    const wrapper = mount(AdminPromoCodes, {
      global: {
        stubs: {
          AdminShell: { template: '<div><slot /><slot name="action" /></div>' },
          AdminTableStatus: true,
          DataTable: {
            props: ['items'],
            template: `
              <div class="data-table-stub">
                <div v-for="item in items" :key="item.id" class="table-row">
                  <slot name="cell(code)" :item="item" />
                  <slot name="cell(discount)" :item="item" />
                  <slot name="cell(usage)" :item="item" />
                  <slot name="cell(performance)" :item="item" />
                  <slot name="cell(validity)" :item="item" />
                  <slot name="cell(status)" :item="item" />
                  <slot name="cell(actions)" :item="item" />
                </div>
              </div>
            `,
          },
        },
      },
    })

    await flushPromises()

    // Assert summary KPI numbers
    expect(wrapper.text()).toContain('18') // Total redemptions
    expect(wrapper.text()).toContain('NIKAH50')
    expect(wrapper.text()).toContain('HEMAT10K')
    expect(wrapper.text()).toContain('Exit Intent')
    expect(wrapper.text()).toContain('8 lunas')
    expect(wrapper.text()).toContain('2 checkout pending')
  })

  it('filters by status tab when clicked', async () => {
    const wrapper = mount(AdminPromoCodes, {
      global: {
        stubs: {
          AdminShell: { template: '<div><slot /></div>' },
          AdminTableStatus: true,
          DataTable: true,
        },
      },
    })

    await flushPromises()

    // Find tab buttons
    const tabs = wrapper.findAll('button')
    const expiredTab = tabs.find((b) => b.text().includes('Kedaluwarsa'))
    expect(expiredTab).toBeTruthy()

    await expiredTab.trigger('click')
    await flushPromises()

    expect(mockApi.fetchCodes).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'expired',
      }),
    )
  })

  it('opens detail drawer and displays customer redemptions list', async () => {
    mockApi.fetchDetail.mockResolvedValue({
      success: true,
      data: {
        ...dummyPromoList.data[0],
        orders: [
          {
            id: 101,
            order_id: 'ORD-PROMO-001',
            customer_name: 'Budi Santoso',
            customer_email: 'budi@example.com',
            amount: 50000,
            discount_amount: 50000,
            package: 'premium',
            status: 'settlement',
            created_at: '2026-10-20T10:00:00.000Z',
          },
        ],
      },
    })

    const wrapper = mount(AdminPromoCodes, {
      global: {
        stubs: {
          AdminShell: { template: '<div><slot /></div>' },
          AdminTableStatus: true,
          DataTable: {
            props: ['items'],
            template: `
              <div>
                <div v-for="item in items" :key="item.id">
                  <slot name="cell(actions)" :item="item" />
                </div>
              </div>
            `,
          },
        },
      },
    })

    await flushPromises()

    const detailBtn = wrapper.find('button[title*="Lihat riwayat transaksi"]')
    expect(detailBtn.exists()).toBe(true)

    await detailBtn.trigger('click')
    await flushPromises()

    expect(mockApi.fetchDetail).toHaveBeenCalledWith(1)
    expect(wrapper.text()).toContain('ORD-PROMO-001')
    expect(wrapper.text()).toContain('Budi Santoso')
  })

  it('preserves exit intent settings when opening edit modal (ADM-057)', async () => {
    const wrapper = mount(AdminPromoCodes, {
      global: {
        stubs: {
          AdminShell: { template: '<div><slot /></div>' },
          AdminTableStatus: true,
          DataTable: {
            props: ['items'],
            template: `
              <div>
                <div v-for="item in items" :key="item.id">
                  <slot name="cell(actions)" :item="item" />
                </div>
              </div>
            `,
          },
        },
      },
    })

    await flushPromises()

    // Click Edit button for first item (NIKAH50 which has exit intent enabled)
    const editBtns = wrapper.findAll('button').filter((b) => b.text() === 'Edit')
    expect(editBtns.length).toBeGreaterThan(0)
    await editBtns[0].trigger('click')
    await flushPromises()

    // Assert form has exit intent values preserved
    const exitIntentCheckbox = wrapper.find('#is_exit_intent')
    expect(exitIntentCheckbox.exists()).toBe(true)
    expect(exitIntentCheckbox.element.checked).toBe(true)

    const textarea = wrapper.find('textarea')
    expect(textarea.element.value).toBe('Diskon 50% untuk pendaftaran hari ini!')

    // Assert live preview contains the text
    expect(wrapper.text()).toContain('Live Preview Modal Exit-Intent Pengunjung')
    expect(wrapper.text()).toContain('Diskon 50% untuk pendaftaran hari ini!')
  })
})
