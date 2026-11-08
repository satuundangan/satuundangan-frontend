import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { reactive, h } from 'vue'
import { PACKAGE_FEATURES, featuresFor } from '@/config/packageFeatures'
import WatermarkBadge from '@/components/invitation/WatermarkBadge.vue'
import InvitationView from '@/views/InvitationView.vue'

const mocks = vi.hoisted(() => ({
  getMyInvitationBySlug: vi.fn(),
  getInvitationBySlug: vi.fn(),
  getInvitationWithGuest: vi.fn(),
  getInvitationBySubdomain: vi.fn(),
  getCustomSubdomain: vi.fn(() => null),
  push: vi.fn(),
}))

const authState = reactive({
  token: null,
  user: null,
})

const routeState = reactive({
  params: { slug: 'test-couple' },
  query: {},
  name: 'invitation',
  fullPath: '/test-couple',
})

vi.mock('@/api/invitation', () => ({
  getMyInvitationBySlug: mocks.getMyInvitationBySlug,
  getInvitationBySlug: mocks.getInvitationBySlug,
  getInvitationWithGuest: mocks.getInvitationWithGuest,
  getInvitationBySubdomain: mocks.getInvitationBySubdomain,
  getCustomSubdomain: mocks.getCustomSubdomain,
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => authState,
}))

vi.mock('vue-router', async (original) => ({
  ...(await original()),
  useRoute: () => routeState,
  useRouter: () => ({ push: mocks.push }),
}))

const MockTemplate = {
  name: 'DarkElegantMock',
  props: ['data'],
  render() {
    return h('div', { class: 'mock-template' }, [
      h('form', { class: 'mock-rsvp-form' }, [
        h('input', { name: 'name', value: 'Budi' }),
        h('button', { type: 'submit', class: 'rsvp-submit-btn' }, 'Kirim RSVP'),
      ]),
    ])
  },
}

vi.mock('@/utils/templateRegistry', () => ({
  templateLoaders: {
    'dark-elegant': () => Promise.resolve(MockTemplate),
  },
  resolveTemplateKey: () => 'dark-elegant',
  normalizeTemplateKey: () => 'dark-elegant',
  FALLBACK_TEMPLATE_KEY: 'dark-elegant',
  DYNAMIC_THEME_KEY: 'dynamic-theme',
}))

describe('SAT-42: Proteksi Undangan Belum Bayar, Watermark & Paywall Enforcement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authState.token = null
    authState.user = null
    routeState.params = { slug: 'test-couple' }
    routeState.query = {}
    routeState.name = 'invitation'
    routeState.fullPath = '/test-couple'
  })

  describe('1. Package Tier & Watermark Configuration Sync', () => {
    it('verifies Basic tier has watermark: true (branding enabled)', () => {
      expect(PACKAGE_FEATURES.basic.watermark).toBe(true)
      expect(featuresFor('basic').watermark).toBe(true)
    })

    it('verifies Premium and Eksklusif tiers have watermark: false (branding free)', () => {
      expect(PACKAGE_FEATURES.premium.watermark).toBe(false)
      expect(featuresFor('premium').watermark).toBe(false)
      expect(PACKAGE_FEATURES.eksklusif.watermark).toBe(false)
      expect(featuresFor('eksklusif').watermark).toBe(false)
    })
  })

  describe('2. WatermarkBadge Branding Injection', () => {
    it('displays watermark by default when no showBranding is provided', () => {
      const wrapper = mount(WatermarkBadge)
      expect(wrapper.find('.watermark-footer-wrapper').exists()).toBe(true)
    })

    it('hides watermark when showBranding is injected as false', () => {
      const wrapper = mount(WatermarkBadge, {
        global: {
          provide: {
            showBranding: false,
          },
        },
      })
      expect(wrapper.find('.watermark-footer-wrapper').exists()).toBe(false)
    })

    it('shows watermark when showBranding is injected as true', () => {
      const wrapper = mount(WatermarkBadge, {
        global: {
          provide: {
            showBranding: true,
          },
        },
      })
      expect(wrapper.find('.watermark-footer-wrapper').exists()).toBe(true)
    })

    it('forceShow overrides injected showBranding false', () => {
      const wrapper = mount(WatermarkBadge, {
        props: { forceShow: true },
        global: {
          provide: {
            showBranding: false,
          },
        },
      })
      expect(wrapper.find('.watermark-footer-wrapper').exists()).toBe(true)
    })
  })

  describe('3. Public / Guest Unpublished Invitation Protection (403 Forbidden)', () => {
    it('displays luxurious draft notice screen when anonymous guest visits unpublished invitation', async () => {
      const error = new Error('Undangan belum dipublikasikan')
      error.status = 403
      mocks.getInvitationBySlug.mockRejectedValueOnce(error)

      const wrapper = mount(InvitationView, {
        global: {
          stubs: {
            PrivateLockScreen: true,
          },
        },
      })

      await flushPromises()

      const draftScreen = wrapper.find('[data-test="draft-notice-screen"]')
      expect(draftScreen.exists()).toBe(true)
      expect(wrapper.text()).toContain('Status: Tahap Penyusunan (Draft)')
      expect(wrapper.text()).toContain('Undangan Sedang Disiapkan oleh Calon Pengantin')
      expect(wrapper.text()).toContain('Calon mempelai sedang melengkapi rincian acara dan momen bahagia mereka.')

      const backHomeBtn = wrapper.find('[data-test="draft-back-home-btn"]')
      expect(backHomeBtn.exists()).toBe(true)
      expect(backHomeBtn.attributes('href')).toBe('/')

      const createOwnBtn = wrapper.find('[data-test="draft-create-own-btn"]')
      expect(createOwnBtn.exists()).toBe(true)
      expect(createOwnBtn.attributes('href')).toBe('/templates')

      const loginOwnerBtn = wrapper.find('[data-test="draft-login-owner-btn"]')
      expect(loginOwnerBtn.exists()).toBe(true)
      expect(loginOwnerBtn.attributes('href')).toContain('/login?redirect=')
    })
  })

  describe('4. Owner Preview Mode & Paywall Banner', () => {
    it('identifies owner preview and renders paywall banner for unpublished draft', async () => {
      authState.token = 'valid-owner-jwt-token'
      routeState.name = 'invitation' // Accessing /:slug as owner
      routeState.params = { slug: 'my-draft-wedding' }

      mocks.getMyInvitationBySlug.mockResolvedValueOnce({
        id: 99,
        title: 'Draft Pernikahan Kita',
        slug: 'my-draft-wedding',
        template_slug: 'dark-elegant',
        is_published: false,
        show_branding: true,
        content: {},
      })

      const wrapper = mount(InvitationView, {
        global: {
          stubs: {
            PrivateLockScreen: true,
          },
        },
      })

      await flushPromises()

      expect(mocks.getMyInvitationBySlug).toHaveBeenCalledWith('my-draft-wedding')

      const paywallBanner = wrapper.find('[data-test="owner-draft-banner"]')
      expect(paywallBanner.exists()).toBe(true)
      expect(paywallBanner.text()).toContain('Mode Preview Pemilik (Draft)')
      expect(paywallBanner.text()).toContain(
        'Undangan ini masih berstatus DRAFT dan BELUM BISA diakses oleh tamu undangan.'
      )

      const activateBtn = wrapper.find('[data-test="activate-invitation-btn"]')
      expect(activateBtn.exists()).toBe(true)
      expect(activateBtn.text()).toContain('Aktifkan Undangan Sekarang (Bayar)')

      await activateBtn.trigger('click')
      expect(mocks.push).toHaveBeenCalledWith('/checkout?slug=my-draft-wedding')
    })

    it('blocks RSVP / ucapan submission during draft preview and displays informative notice', async () => {
      authState.token = 'valid-owner-jwt-token'
      routeState.params = { slug: 'my-draft-wedding' }

      mocks.getMyInvitationBySlug.mockResolvedValueOnce({
        id: 99,
        title: 'Draft Pernikahan Kita',
        slug: 'my-draft-wedding',
        template_slug: 'dark-elegant',
        is_published: false,
        show_branding: true,
        content: {},
      })

      const wrapper = mount(InvitationView, {
        global: {
          stubs: {
            PrivateLockScreen: true,
          },
        },
      })

      await flushPromises()

      // Submit form inside template
      const form = wrapper.find('.mock-rsvp-form')
      expect(form.exists()).toBe(true)
      await form.trigger('submit')

      // Should display notice that interaction is disabled (teleported to body)
      const notice = document.querySelector('[data-test="draft-interaction-info"]')
      expect(notice).not.toBeNull()
      expect(notice.textContent).toContain('Form dinonaktifkan dalam mode pratinjau draft')
    })

    it('does not display owner draft banner when invitation is already published', async () => {
      authState.token = 'valid-owner-jwt-token'
      routeState.params = { slug: 'published-wedding' }

      mocks.getMyInvitationBySlug.mockResolvedValueOnce({
        id: 100,
        title: 'Pernikahan Resmi',
        slug: 'published-wedding',
        template_slug: 'dark-elegant',
        is_published: true,
        show_branding: false,
        content: {},
      })

      const wrapper = mount(InvitationView, {
        global: {
          stubs: {
            PrivateLockScreen: true,
          },
        },
      })

      await flushPromises()

      const paywallBanner = wrapper.find('[data-test="owner-draft-banner"]')
      expect(paywallBanner.exists()).toBe(false)
    })
  })
})
