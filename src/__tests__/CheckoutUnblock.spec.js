import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { reactive, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CheckoutPage from '@/views/CheckoutPage.vue'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
  getMyInvitationBySlug: vi.fn(),
  updateInvitation: vi.fn(),
  createPayment: vi.fn(),
  getPackages: vi.fn(),
  validatePromoCode: vi.fn(),
  resendVerification: vi.fn(),
  trackAction: vi.fn(),
  checkoutContext: vi.fn(),
}))

const routeState = reactive({
  query: { slug: 'test-undangan' },
  name: 'checkout',
})

const authState = reactive({
  user: {
    id: 1,
    name: 'Customer Test',
    email: 'customer@example.com',
    emailVerifiedAt: null,
    provider: 'local',
  },
  logout: vi.fn(),
})

vi.mock('vue-router', async (original) => ({
  ...(await original()),
  useRoute: () => routeState,
  useRouter: () => ({
    push: mocks.push,
    resolve: (to) => ({ fullPath: `/checkout?slug=${to.query?.slug}&package=${to.query?.package}` }),
  }),
}))

vi.mock('vue-toastification', () => ({
  useToast: () => mocks.toast,
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => authState,
}))

vi.mock('@/api/invitation', () => ({
  getMyInvitationBySlug: mocks.getMyInvitationBySlug,
  updateInvitation: mocks.updateInvitation,
}))

vi.mock('@/api/payment', () => ({
  createPayment: mocks.createPayment,
  getPackages: mocks.getPackages,
}))

vi.mock('@/api/promo', () => ({
  validatePromoCode: mocks.validatePromoCode,
}))

vi.mock('@/api/auth', () => ({
  resendVerification: mocks.resendVerification,
}))

vi.mock('@/api/analytics', () => ({
  analytics: {
    trackAction: mocks.trackAction,
    checkoutContext: mocks.checkoutContext,
  },
}))

describe('CheckoutUnblock.spec.js (SAT-43)', () => {
  const mockPackages = [
    { id: 'basic', label: 'Basic', price: 49000 },
    { id: 'premium', label: 'Premium', price: 79000 },
  ]

  const mockInvitation = {
    id: 42,
    slug: 'test-undangan',
    title: 'The Wedding of Romeo & Juliet',
    package: 'basic',
    template_slug: 'dark-elegant',
    isPublished: false,
    content: {
      coupleName: 'Romeo & Juliet',
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    routeState.query = { slug: 'test-undangan' }

    authState.user = {
      id: 1,
      name: 'Customer Test',
      email: 'customer@example.com',
      emailVerifiedAt: null, // Unverified
      provider: 'local',
    }

    mocks.getPackages.mockResolvedValue(mockPackages)
    mocks.getMyInvitationBySlug.mockResolvedValue(mockInvitation)
    mocks.checkoutContext.mockResolvedValue({})
    mocks.createPayment.mockResolvedValue({
      token: 'snap-token-123',
      order_id: 'order-123',
    })
    mocks.updateInvitation.mockResolvedValue({ id: 42, isPublished: true })
    mocks.resendVerification.mockResolvedValue({
      success: true,
      message: 'Link verifikasi email berhasil dikirim!',
    })
  })

  it('displays soft warning notice with user email and resend button when user is unverified', async () => {
    const wrapper = mount(CheckoutPage, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Email kamu belum diverifikasi. Bukti pembayaran akan dikirim ke')
    expect(wrapper.text()).toContain('customer@example.com')
    expect(wrapper.text()).toContain('Kirim Ulang Verifikasi')
  })

  it('calls resendVerification API when Kirim Ulang Verifikasi button is clicked without leaving checkout', async () => {
    const wrapper = mount(CheckoutPage, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    await flushPromises()

    const resendBtn = wrapper.findAll('button').find((b) => b.text().includes('Kirim Ulang Verifikasi'))
    expect(resendBtn).toBeDefined()

    await resendBtn.trigger('click')
    await flushPromises()

    expect(mocks.resendVerification).toHaveBeenCalled()
    expect(mocks.toast.success).toHaveBeenCalledWith('Link verifikasi email berhasil dikirim!')
    expect(mocks.push).not.toHaveBeenCalledWith({ name: 'Settings' })
  })

  it('does NOT display soft warning notice when user email is already verified', async () => {
    authState.user.emailVerifiedAt = '2026-11-01T10:00:00.000Z'

    const wrapper = mount(CheckoutPage, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    await flushPromises()

    expect(wrapper.text()).not.toContain('Email kamu belum diverifikasi')
    expect(wrapper.text()).not.toContain('Kirim Ulang Verifikasi')
  })

  it('does NOT display soft warning notice when user logged in with Google', async () => {
    authState.user.provider = 'google'
    authState.user.emailVerifiedAt = null

    const wrapper = mount(CheckoutPage, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    await flushPromises()

    expect(wrapper.text()).not.toContain('Email kamu belum diverifikasi')
  })

  it('unblocks checkout: handleCheckout proceeds to createPayment for unverified users without redirecting to /settings', async () => {
    // Snap window mock
    window.snap = {
      pay: vi.fn(),
    }

    const wrapper = mount(CheckoutPage, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    await flushPromises()

    const checkoutBtn = wrapper.findAll('button').find((b) => b.text().includes('Bayar Sekarang'))
    expect(checkoutBtn).toBeDefined()

    await checkoutBtn.trigger('click')
    await flushPromises()

    // Must NOT redirect to settings
    expect(mocks.push).not.toHaveBeenCalledWith({ name: 'Settings' })
    expect(mocks.toast.warning).not.toHaveBeenCalledWith(
      expect.stringContaining('Verifikasi email dulu'),
    )

    // Must call createPayment with invitation id
    expect(mocks.createPayment).toHaveBeenCalledWith(
      expect.objectContaining({
        invitation_id: 42,
        package: 'basic',
      }),
    )

    // snap.pay should be called with token
    expect(window.snap.pay).toHaveBeenCalledWith('snap-token-123', expect.any(Object))
  })

  it('unblocks simulation: simulatePaymentSuccess allows unverified user to simulate payment successfully', async () => {
    const wrapper = mount(CheckoutPage, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    await flushPromises()

    await wrapper.vm.simulatePaymentSuccess()
    await flushPromises()

    expect(mocks.updateInvitation).toHaveBeenCalledWith(42, {
      isPublished: true,
      is_published: true,
      package: 'basic',
    })
    expect(mocks.toast.success).toHaveBeenCalledWith(
      'Simulasi pembayaran berhasil! Undangan Anda kini aktif.',
    )
    expect(mocks.push).toHaveBeenCalledWith('/invitations')
    expect(mocks.push).not.toHaveBeenCalledWith({ name: 'Settings' })
  })
})
