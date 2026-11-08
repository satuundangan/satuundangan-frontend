import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import LightModern from '@/templates/light-modern.vue'
import BotanicalWatercolor from '@/templates/botanical-watercolor.vue'
import RoyalGold from '@/templates/royal-gold.vue'
import DarkElegant from '@/templates/dark-elegant.vue'
import CelestialSparkle from '@/templates/celestial-sparkle.vue'

// Setup global IntersectionObserver mock for Node environment
global.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('Zero-Risk Verification: Live Active Invitations & Real Template Rendering', () => {
  // Real live customer data from production database: our-wedding
  const realOurWeddingContent = {
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
  }

  it('1. Live Active Customer "our-wedding" renders flawlessly on LightModern without runtime error', async () => {
    const wrapper = mount(LightModern, {
      props: {
        data: realOurWeddingContent,
      },
      global: {
        stubs: {
          MusicControl: true,
          FloatingLoveBird: true,
          WatermarkBadge: true,
        },
      },
    })

    // Open invitation
    const openBtn = wrapper.find('button')
    if (openBtn.exists()) {
      await openBtn.trigger('click')
      await flushPromises()
    }

    const html = wrapper.html()

    // Real customer names and quotes must be displayed
    expect(html).toContain('Nelson Pereira')
    expect(html).toContain('Fransiska Tumbelaka')
    expect(html).toContain('2 Korintus 13:11')
    expect(html).toContain('Gereja Katolik Santo Ambrosius')
    expect(html).toContain('Hotel Sol Marina Serpong')
    expect(html).toContain('1350333530')

    // AI Slop emojis MUST NOT be in the rendered output
    expect(html).not.toContain('🕊️')
    expect(html).not.toContain('💍')
    expect(html).not.toContain('🥂')

    // PrimeIcons are rendered
    expect(html).toContain('pi-heart')
    expect(html).toContain('pi-sparkles')
  })

  it('2. Botanical Watercolor template renders live data cleanly with PrimeIcons and zero emoji slop', async () => {
    const wrapper = mount(BotanicalWatercolor, {
      props: {
        data: realOurWeddingContent,
      },
      global: {
        stubs: {
          MusicControl: true,
          FloatingLoveBird: true,
          WatermarkBadge: true,
        },
      },
    })

    const openBtn = wrapper.find('button')
    if (openBtn.exists()) {
      await openBtn.trigger('click')
      await flushPromises()
    }

    const html = wrapper.html()
    expect(html).toContain('Nelson Pereira')
    expect(html).toContain('Fransiska Tumbelaka')
    expect(html).not.toContain('💍')
    expect(html).not.toContain('🥂')
    expect(html).toContain('pi-heart')
    expect(html).toContain('pi-sparkles')
  })

  it('3. Royal Gold template renders bank accounts with PrimeIcons building watermark, not emoji', async () => {
    const wrapper = mount(RoyalGold, {
      props: {
        data: realOurWeddingContent,
      },
      global: {
        stubs: {
          MusicControl: true,
          FloatingLoveBird: true,
          WatermarkBadge: true,
        },
      },
    })

    const openBtn = wrapper.find('button')
    if (openBtn.exists()) {
      await openBtn.trigger('click')
      await flushPromises()
    }

    const html = wrapper.html()
    expect(html).toContain('Fransiska Tumbelaka')
    expect(html).toContain('1350333530')
    expect(html).not.toContain('🏦')
    expect(html).toContain('pi-building')
  })

  it('4. Dark Elegant template renders without herb emoji and with PrimeIcons', async () => {
    const wrapper = mount(DarkElegant, {
      props: {
        data: realOurWeddingContent,
      },
      global: {
        stubs: {
          MusicControl: true,
          FloatingLoveBird: true,
          WatermarkBadge: true,
        },
      },
    })

    const openBtn = wrapper.find('button')
    if (openBtn.exists()) {
      await openBtn.trigger('click')
      await flushPromises()
    }

    const html = wrapper.html()
    expect(html).toContain('Nelson Pereira')
    expect(html).not.toContain('🌿')
    expect(html).not.toContain('💍')
    expect(html).not.toContain('🥂')
    expect(html).toContain('pi-heart')
    expect(html).toContain('pi-sparkles')
  })

  it('5. Celestial Sparkle template renders without star/sparkle emojis in background watermarks', async () => {
    const wrapper = mount(CelestialSparkle, {
      props: {
        data: realOurWeddingContent,
      },
      global: {
        stubs: {
          MusicControl: true,
          FloatingLoveBird: true,
          WatermarkBadge: true,
        },
      },
    })

    const openBtn = wrapper.find('button')
    if (openBtn.exists()) {
      await openBtn.trigger('click')
      await flushPromises()
    }

    const html = wrapper.html()
    expect(html).toContain('Nelson Pereira')
    expect(html).not.toContain('🌟')
    expect(html).toContain('pi-sparkles')
    expect(html).toContain('pi-star')
  })
})
