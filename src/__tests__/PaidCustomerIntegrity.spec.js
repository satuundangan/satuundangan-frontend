import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { reactive, h } from 'vue'
import InvitationView from '@/views/InvitationView.vue'
import WatermarkBadge from '@/components/invitation/WatermarkBadge.vue'

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
  params: { slug: 'our-wedding' },
  query: {},
  name: 'invitation',
  fullPath: '/our-wedding',
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

// Mock template that captures rendered data and embeds WatermarkBadge
let capturedData = null
const MockLightModernTemplate = {
  name: 'LightModernTemplate',
  props: ['data'],
  setup(props) {
    capturedData = props.data
    return () =>
      h('div', { class: 'light-modern-template', id: 'app-invitation' }, [
        h('h1', { class: 'couple-title' }, `${props.data?.groomName} & ${props.data?.brideName}`),
        h('p', { class: 'quote-text' }, props.data?.quoteText),
        h('div', { class: 'akad-info' }, props.data?.akadLocation?.description),
        h('div', { class: 'resepsi-info' }, props.data?.resepsiLocation?.description),
        h('form', { class: 'rsvp-form' }, [
          h('input', { name: 'guestName', value: 'Budi Santoso' }),
          h('button', { type: 'submit', class: 'submit-rsvp-btn' }, 'Konfirmasi Kehadiran'),
        ]),
        h(WatermarkBadge, { variant: 'light' }),
      ])
  },
}

vi.mock('@/utils/templateRegistry', () => ({
  templateLoaders: {
    'light-modern': () => Promise.resolve(MockLightModernTemplate),
  },
  resolveTemplateKey: () => 'light-modern',
  normalizeTemplateKey: () => 'light-modern',
  FALLBACK_TEMPLATE_KEY: 'light-modern',
  DYNAMIC_THEME_KEY: 'dynamic-theme',
}))

describe('Zero-Risk Verification: Paid Customer Integrity (slug: our-wedding)', () => {
  // Real customer payload from production database: Nelson Pereira & Fransiska Tumbelaka
  const realOurWeddingPayload = {
    id: 34,
    title: 'JanuaryWedding',
    slug: 'our-wedding',
    subdomain: null,
    package: 'premium',
    template_slug: 'light-modern',
    price: 49000,
    show_branding: false,
    is_published: true,
    content: {
      templateDesignId: 2,
      templateName: null,
      templatePrice: 49000,
      coupleName: null,
      groomName: 'Nelson Pereira',
      brideName: 'Fransiska Tumbelaka',
      quoteSource: '2 Korintus 13:11',
      quoteType: 'preset',
      quoteText:
        'Sehati sepikirlah kamu, dan hiduplah dalam perdamaian; maka Allah sumber kasih dan damai sejahtera akan menyertai kamu.',
      religion: 'katolik',
      loveStory: [],
      musicChoice: 'https://cdn.satuundangan.id/1779017878467-KOMANG - RAIM LAODE LYRIC OFFICIAL.mp3',
      isCustomMusic: true,
      bridePhotoUrl: 'https://cdn.satuundangan.id/1793182965160-bride.webp',
      groomPhotoUrl: 'https://cdn.satuundangan.id/1793184740584-groom.webp',
      photoCoupleUrl: 'https://cdn.satuundangan.id/1793183913697-couple.webp',
      videoPrewedding: '',
      designSettings: {
        heroCopy: '',
        fontFamily: 'Cormorant Garamond',
        titleScale: 1,
        hideRundown: false,
        eventEndTime: '',
        backgroundUrl: '',
        backgroundType: 'image',
        eventStartTime: '',
      },
      dateTime: null,
      akadLocation: {
        mapUrl: 'https://share.google/GaieahOJ98H1gBgpb',
        dateTime: '2027-01-02T04:00:00.000Z',
        description: 'Gereja Katolik Santo Ambrosius',
      },
      resepsiLocation: {
        mapUrl: 'https://share.google/UkNrvnkx96ktNKgWF',
        dateTime: '2027-01-02T06:00:00.000Z',
        description: 'Hotel Sol Marina Serpong',
      },
      isSingleEvent: false,
      mergeEvents: false,
      floorPlanImageUrl: '',
      menu: {
        items: [],
        title: 'Menu Makanan',
      },
      galleryImages: [],
      giftDeliveryAddress: [],
      eWalletLink: [],
      bankAccounts: [
        {
          bankLogo: '',
          bankName: 'BCA',
          accountName: 'Fransiska Tumbelaka',
          accountNumber: '1350333530',
        },
      ],
      socialMedia: {},
      socialMediaBrides: { tiktok: '', youtube: '', instagram: '' },
      socialMediaGroom: { tiktok: '', youtube: '', instagram: '' },
      parents: { brideParents: '', groomParents: '' },
      turutMengundang: '',
      liveStreamingLink: '',
      dressCode: '',
      footerText: '',
      enableCover: true,
      enableGuestMessage: true,
      selectedSections: null,
      whatsappMessageTemplate: 'Dear *[GuestName],* ...',
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    capturedData = null
    authState.token = null
    authState.user = null
    routeState.params = { slug: 'our-wedding' }
    routeState.query = {}
    routeState.name = 'invitation'
    routeState.fullPath = '/our-wedding'
  })

  it('1. Public Guest View: renders our-wedding flawlessly without any paywall, draft lock, or watermark', async () => {
    mocks.getInvitationBySlug.mockResolvedValueOnce(realOurWeddingPayload)

    const wrapper = mount(InvitationView, {
      global: {
        stubs: {
          PrivateLockScreen: true,
        },
      },
    })

    await flushPromises()

    // Endpoint was called with the slug
    expect(mocks.getInvitationBySlug).toHaveBeenCalledWith('our-wedding')

    // 1. Paywall and draft lock MUST NOT exist
    expect(wrapper.find('[data-test="draft-notice-screen"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="owner-draft-banner"]').exists()).toBe(false)

    // 2. Template component rendered with couple data
    expect(wrapper.find('.couple-title').text()).toBe('Nelson Pereira & Fransiska Tumbelaka')
    expect(wrapper.find('.quote-text').text()).toContain('Sehati sepikirlah kamu')
    expect(wrapper.find('.akad-info').text()).toBe('Gereja Katolik Santo Ambrosius')
    expect(wrapper.find('.resepsi-info').text()).toBe('Hotel Sol Marina Serpong')

    // 3. Watermark MUST BE HIDDEN for premium package (show_branding: false)
    expect(wrapper.find('.watermark-footer-wrapper').exists()).toBe(false)

    // 4. Data passed to template preserves all custom fields
    expect(capturedData.groomName).toBe('Nelson Pereira')
    expect(capturedData.brideName).toBe('Fransiska Tumbelaka')
    expect(capturedData.bankAccounts[0].bankName).toBe('BCA')
    expect(capturedData.bankAccounts[0].accountNumber).toBe('1350333530')
    expect(capturedData.musicChoice).toContain('KOMANG')
    expect(capturedData.package).toBe('premium')
  })

  it('2. Form RSVP interaction is completely active and not intercepted by draft guard', async () => {
    mocks.getInvitationBySlug.mockResolvedValueOnce(realOurWeddingPayload)

    const wrapper = mount(InvitationView, {
      global: {
        stubs: {
          PrivateLockScreen: true,
        },
      },
    })

    await flushPromises()

    const rsvpForm = wrapper.find('.rsvp-form')
    expect(rsvpForm.exists()).toBe(true)

    // Trigger submit
    await rsvpForm.trigger('submit')

    // Draft interaction warning notice must NOT be triggered
    const draftNotice = document.querySelector('[data-test="draft-interaction-info"]')
    expect(draftNotice).toBeNull()
  })

  it('3. Owner View: when owner visits /our-wedding, no paywall or draft banner is shown', async () => {
    authState.token = 'mock-nelson-jwt-token'
    authState.user = { id: 34, email: 'nelson@example.com' }
    mocks.getMyInvitationBySlug.mockResolvedValueOnce(realOurWeddingPayload)

    const wrapper = mount(InvitationView, {
      global: {
        stubs: {
          PrivateLockScreen: true,
        },
      },
    })

    await flushPromises()

    expect(mocks.getMyInvitationBySlug).toHaveBeenCalledWith('our-wedding')

    // Owner draft banner must NOT be shown since it is already paid & published
    expect(wrapper.find('[data-test="owner-draft-banner"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="draft-notice-screen"]').exists()).toBe(false)
    expect(wrapper.find('.couple-title').text()).toBe('Nelson Pereira & Fransiska Tumbelaka')
    expect(wrapper.find('.watermark-footer-wrapper').exists()).toBe(false)
  })

  it('4. Contrasting Tiers: Paid Basic shows watermark, while Paid Eksklusif hides watermark', async () => {
    // Basic tier test
    mocks.getInvitationBySlug.mockResolvedValueOnce({
      ...realOurWeddingPayload,
      package: 'basic',
      show_branding: true,
    })

    const wrapperBasic = mount(InvitationView, {
      global: {
        stubs: { PrivateLockScreen: true },
      },
    })
    await flushPromises()

    // Paid basic has watermark, but NO paywall
    expect(wrapperBasic.find('.watermark-footer-wrapper').exists()).toBe(true)
    expect(wrapperBasic.find('[data-test="draft-notice-screen"]').exists()).toBe(false)
    expect(wrapperBasic.find('[data-test="owner-draft-banner"]').exists()).toBe(false)

    // Eksklusif tier test
    mocks.getInvitationBySlug.mockResolvedValueOnce({
      ...realOurWeddingPayload,
      package: 'eksklusif',
      show_branding: false,
    })

    const wrapperEksklusif = mount(InvitationView, {
      global: {
        stubs: { PrivateLockScreen: true },
      },
    })
    await flushPromises()

    // Paid eksklusif has NO watermark and NO paywall
    expect(wrapperEksklusif.find('.watermark-footer-wrapper').exists()).toBe(false)
    expect(wrapperEksklusif.find('[data-test="draft-notice-screen"]').exists()).toBe(false)
    expect(wrapperEksklusif.find('[data-test="owner-draft-banner"]').exists()).toBe(false)
  })
})
