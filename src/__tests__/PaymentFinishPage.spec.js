import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { reactive } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PaymentFinishPage from '@/views/PaymentFinishPage.vue'

const api = vi.hoisted(() => ({
  getPaymentStatus: vi.fn(),
  push: vi.fn(),
}))

const routeState = reactive({
  query: {},
  name: 'payment-finish',
})

vi.mock('@/api/payment', () => ({
  getPaymentStatus: api.getPaymentStatus,
}))

vi.mock('vue-router', async (original) => ({
  ...(await original()),
  useRoute: () => routeState,
  useRouter: () => ({ push: api.push }),
}))

describe('PaymentFinishPage.vue (ADM-096)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    routeState.query = {}
    routeState.name = 'payment-finish'
  })

  it('renders official receipt when payment is confirmed success by backend', async () => {
    routeState.query = { order_id: 'INV-100-TEST', transaction_status: 'settlement' }
    api.getPaymentStatus.mockResolvedValueOnce({
      orderId: 'INV-100-TEST',
      status: 'settlement',
      invitationSlug: 'test-couple',
      amount: 79000,
      package: 'premium',
      paymentMethod: 'qris',
      customerName: 'Budi Handoko',
      customerEmail: 'budi@example.com',
      settlementTime: '2026-10-30T10:00:00Z',
    })

    const wrapper = mount(PaymentFinishPage, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Pembayaran Berhasil')
    expect(wrapper.find('#official-receipt').exists()).toBe(true)
    expect(wrapper.text()).toContain('INV-100-TEST')
    expect(wrapper.text()).toContain('Budi Handoko')
    expect(wrapper.text()).toContain('budi@example.com')
    expect(wrapper.text()).toContain('Premium')
    expect(wrapper.text()).toContain('QRIS')
    expect(wrapper.text()).toMatch(/Rp[\s\u00a0]79\.000/)
    expect(wrapper.text()).toContain('Lunas Terverifikasi')
    expect(wrapper.text()).toContain('Cetak / Simpan Bukti Bayar')
  })

  it('routes a confirmed payment to its invitation, guest list, or dashboard', async () => {
    routeState.query = { order_id: 'INV-103-PAID', transaction_status: 'settlement' }
    api.getPaymentStatus.mockResolvedValueOnce({
      orderId: 'INV-103-PAID',
      status: 'settlement',
      invitationSlug: 'test-couple',
    })

    const wrapper = mount(PaymentFinishPage, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    await flushPromises()

    const invitationButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Lihat Undangan Aktif'))
    const guestsButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Kelola Tamu & Bagikan'))
    const dashboardButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Ke Dashboard'))

    expect(invitationButton).toBeTruthy()
    expect(guestsButton).toBeTruthy()
    expect(dashboardButton).toBeTruthy()

    await invitationButton.trigger('click')
    expect(api.push).toHaveBeenLastCalledWith('/test-couple')

    await guestsButton.trigger('click')
    expect(api.push).toHaveBeenLastCalledWith({
      path: '/guests',
      query: { slug: 'test-couple' },
    })

    await dashboardButton.trigger('click')
    expect(api.push).toHaveBeenLastCalledWith('/dashboard')
  })

  it('shows retry guidance when the backend confirms a failed payment', async () => {
    routeState.name = 'payment-error'
    routeState.query = { order_id: 'INV-104-FAILED' }
    api.getPaymentStatus.mockResolvedValueOnce({
      orderId: 'INV-104-FAILED',
      status: 'failure',
      invitationSlug: 'test-couple',
    })

    const wrapper = mount(PaymentFinishPage, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Pembayaran Tidak Berhasil')
    expect(wrapper.text()).toContain('Ulangi Pembayaran')
    expect(wrapper.text()).not.toContain('Lunas Terverifikasi')
  })

  it('renders polite pending state with WhatsApp support CTA when transaction is pending', async () => {
    routeState.query = { order_id: 'INV-101-PENDING', transaction_status: 'pending' }
    api.getPaymentStatus.mockResolvedValueOnce({
      orderId: 'INV-101-PENDING',
      status: 'pending',
      amount: 49000,
      package: 'basic',
      redirectUrl: 'https://app.midtrans.com/snap/pay',
    })

    const wrapper = mount(PaymentFinishPage, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Menunggu Pembayaran')
    expect(wrapper.text()).toContain('Lanjutkan Pembayaran')
    expect(wrapper.text()).toContain('Butuh Bantuan? Hubungi WhatsApp Support')
    expect(wrapper.text()).toContain('INV-101-PENDING')
    // Jargon-free copy
    expect(wrapper.text()).not.toContain('webhook')
    expect(wrapper.text()).not.toContain('Status Midtrans')
  })

  it('differentiates API connection failure from transaction pending', async () => {
    routeState.query = { order_id: 'INV-102-ERR' }
    api.getPaymentStatus.mockRejectedValue(new Error('Network Error'))

    const wrapper = mount(PaymentFinishPage, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Koneksi verifikasi terkendala')
  })
})
