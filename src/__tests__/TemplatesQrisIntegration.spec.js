import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RoyalGold from '@/templates/royal-gold.vue'
import DarkElegant from '@/templates/dark-elegant.vue'
import LightModern from '@/templates/light-modern.vue'
import RetroNostalgia from '@/templates/retro-nostalgia.vue'
import DynamicTheme from '@/templates/dynamic-theme.vue'
import Naruto from '@/templates/naruto.vue'
import PixelQuest from '@/templates/pixel-quest.vue'
import ModernNoir from '@/templates/modern-noir.vue'
import BaliPayasAgung from '@/templates/bali-payas-agung.vue'
import PurrfectMatch from '@/templates/purrfect-match.vue'
import NusantaraInvitation from '@/components/invitation/NusantaraInvitation.vue'

// Mock IntersectionObserver
global.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock Canvas 2D context for particle systems in jsdom
if (typeof HTMLCanvasElement !== 'undefined') {
  const dummyCtx = new Proxy({}, {
    get: (target, prop) => {
      if (prop === 'measureText') return () => ({ width: 0 })
      return () => ({ addColorStop: () => {} })
    }
  })
  HTMLCanvasElement.prototype.getContext = () => dummyCtx
}

describe('SAT-66: QRIS Gift Card Integration Across Templates', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  const baseData = {
    groomName: 'Romeo',
    brideName: 'Juliet',
    bankAccounts: [],
    eWalletLink: [],
    giftDeliveryAddress: [],
    enableCover: false,
    selectedSections: ['gift', 'couple', 'event']
  }

  const commonStubs = {
    MusicControl: true,
    FloatingLoveBird: true,
    WatermarkBadge: true,
    GalleryInvitation: true,
    DressCodeSwatches: true
  }

  async function openInvite(wrapper) {
    const btn = wrapper.find('button')
    if (btn.exists()) {
      await btn.trigger('click')
      await flushPromises()
    }
  }

  it('1. Royal Gold: shows gift section and QRIS trigger button when ONLY qrisImageUrl is provided', async () => {
    const wrapper = mount(RoyalGold, {
      props: {
        data: {
          ...baseData,
          qrisImageUrl: 'https://cdn.satuundangan.id/uploads/qris-royal-gold.png'
        }
      },
      global: { stubs: commonStubs }
    })

    await openInvite(wrapper)

    const giftSection = wrapper.find('#gift')
    expect(giftSection.exists()).toBe(true)

    const qrisCard = wrapper.findComponent({ name: 'QrisGiftCard' })
    expect(qrisCard.exists()).toBe(true)
    expect(qrisCard.props('variant')).toBe('gold')
    expect(qrisCard.find('[data-test="open-qris-modal-btn"]').exists()).toBe(true)
  })

  it('2. Dark Elegant: shows gift section and QRIS trigger button with dark variant', async () => {
    const wrapper = mount(DarkElegant, {
      props: {
        data: {
          ...baseData,
          giftSettings: {
            qrisImageUrl: 'https://cdn.satuundangan.id/uploads/qris-dark.png'
          }
        }
      },
      global: { stubs: commonStubs }
    })

    await openInvite(wrapper)

    const giftSection = wrapper.find('#gift')
    expect(giftSection.exists()).toBe(true)

    const qrisCard = wrapper.findComponent({ name: 'QrisGiftCard' })
    expect(qrisCard.exists()).toBe(true)
    expect(qrisCard.props('variant')).toBe('dark')
    expect(qrisCard.find('[data-test="open-qris-modal-btn"]').exists()).toBe(true)
  })

  it('3. Light Modern: shows gift section and QRIS trigger button with light variant', async () => {
    const wrapper = mount(LightModern, {
      props: {
        data: {
          ...baseData,
          designSettings: {
            qrisImageUrl: 'https://cdn.satuundangan.id/uploads/qris-light.png'
          }
        }
      },
      global: { stubs: commonStubs }
    })

    await openInvite(wrapper)

    const giftSection = wrapper.find('#gift')
    expect(giftSection.exists()).toBe(true)

    const qrisCard = wrapper.findComponent({ name: 'QrisGiftCard' })
    expect(qrisCard.exists()).toBe(true)
    expect(qrisCard.props('variant')).toBe('light')
  })

  it('4. Retro Nostalgia: shows gift section and QRIS trigger button with retro variant', async () => {
    const wrapper = mount(RetroNostalgia, {
      props: {
        data: {
          ...baseData,
          qrisImageUrl: 'https://cdn.satuundangan.id/uploads/qris-retro.png'
        }
      },
      global: { stubs: commonStubs }
    })

    await openInvite(wrapper)

    const giftSection = wrapper.find('#gift')
    expect(giftSection.exists()).toBe(true)

    const qrisCard = wrapper.findComponent({ name: 'QrisGiftCard' })
    expect(qrisCard.exists()).toBe(true)
    expect(qrisCard.props('variant')).toBe('retro')
  })

  it('5. Dynamic Theme: renders QrisGiftCard in gift section', async () => {
    const wrapper = mount(DynamicTheme, {
      props: {
        data: {
          ...baseData,
          qrisImageUrl: 'https://cdn.satuundangan.id/uploads/qris-dynamic.png'
        }
      },
      global: { stubs: commonStubs }
    })

    await openInvite(wrapper)

    const giftSection = wrapper.find('#gift')
    expect(giftSection.exists()).toBe(true)

    const qrisCard = wrapper.findComponent({ name: 'QrisGiftCard' })
    expect(qrisCard.exists()).toBe(true)
  })

  it('6. NusantaraInvitation: hasGiftDetails computes true with QRIS and renders QrisGiftCard in #nu-gifts', async () => {
    const wrapper = mount(NusantaraInvitation, {
      props: {
        data: {
          ...baseData,
          qrisImageUrl: 'https://cdn.satuundangan.id/uploads/qris-nusantara.png'
        },
        themeKey: 'sunda'
      },
      global: { stubs: commonStubs }
    })

    await openInvite(wrapper)

    const giftSection = wrapper.find('#nu-gifts')
    expect(giftSection.exists()).toBe(true)

    const qrisCard = wrapper.findComponent({ name: 'QrisGiftCard' })
    expect(qrisCard.exists()).toBe(true)
    expect(qrisCard.props('variant')).toBe('gold')
  })

  it('7. When QRIS and bank accounts are empty, QrisGiftCard does not render trigger button', () => {
    const wrapper = mount(RoyalGold, {
      props: {
        data: {
          ...baseData,
          qrisImageUrl: ''
        }
      },
      global: { stubs: commonStubs }
    })

    // In RoyalGold, section v-if is false when both bank accounts and QRIS are empty
    expect(wrapper.find('#gift').exists()).toBe(false)
  })

  it('8. Naruto: renders QrisGiftCard with default variant', async () => {
    const wrapper = mount(Naruto, {
      props: {
        data: {
          ...baseData,
          qrisImageUrl: 'https://cdn.satuundangan.id/uploads/qris-naruto.png'
        }
      },
      global: { stubs: commonStubs }
    })
    await openInvite(wrapper)

    const qrisCard = wrapper.findComponent({ name: 'QrisGiftCard' })
    expect(qrisCard.exists()).toBe(true)
    expect(qrisCard.props('variant')).toBe('default')
  })

  it('9. Pixel Quest: renders QrisGiftCard with retro variant', async () => {
    const wrapper = mount(PixelQuest, {
      props: {
        data: {
          ...baseData,
          qrisImageUrl: 'https://cdn.satuundangan.id/uploads/qris-pixel.png'
        }
      },
      global: { stubs: commonStubs }
    })
    await openInvite(wrapper)

    const qrisCard = wrapper.findComponent({ name: 'QrisGiftCard' })
    expect(qrisCard.exists()).toBe(true)
    expect(qrisCard.props('variant')).toBe('retro')
  })

  it('10. Modern Noir: renders section #gift and QrisGiftCard with dark variant', async () => {
    const wrapper = mount(ModernNoir, {
      props: {
        data: {
          ...baseData,
          qrisImageUrl: 'https://cdn.satuundangan.id/uploads/qris-noir.png'
        }
      },
      global: { stubs: commonStubs }
    })
    await openInvite(wrapper)

    const giftSection = wrapper.find('#gift')
    expect(giftSection.exists()).toBe(true)

    const qrisCard = wrapper.findComponent({ name: 'QrisGiftCard' })
    expect(qrisCard.exists()).toBe(true)
    expect(qrisCard.props('variant')).toBe('dark')
  })

  it('11. Bali Payas Agung: renders QrisGiftCard with gold variant', async () => {
    const wrapper = mount(BaliPayasAgung, {
      props: {
        data: {
          ...baseData,
          qrisImageUrl: 'https://cdn.satuundangan.id/uploads/qris-bali.png'
        }
      },
      global: { stubs: commonStubs }
    })
    await openInvite(wrapper)

    const qrisCard = wrapper.findComponent({ name: 'QrisGiftCard' })
    expect(qrisCard.exists()).toBe(true)
    expect(qrisCard.props('variant')).toBe('gold')
  })

  it('12. Purrfect Match: renders QrisGiftCard with default variant', async () => {
    const wrapper = mount(PurrfectMatch, {
      props: {
        data: {
          ...baseData,
          qrisImageUrl: 'https://cdn.satuundangan.id/uploads/qris-cat.png'
        }
      },
      global: { stubs: commonStubs }
    })
    await openInvite(wrapper)

    const qrisCard = wrapper.findComponent({ name: 'QrisGiftCard' })
    expect(qrisCard.exists()).toBe(true)
    expect(qrisCard.props('variant')).toBe('default')
  })

  it('13. Modal opens and displays couple names and QRIS image when button clicked', async () => {
    const testUrl = 'https://cdn.satuundangan.id/uploads/qris-modal-verify.png'
    const wrapper = mount(RoyalGold, {
      props: {
        data: {
          ...baseData,
          groomName: 'Rama',
          brideName: 'Shinta',
          qrisImageUrl: testUrl
        }
      },
      attachTo: document.body,
      global: { stubs: commonStubs }
    })
    await openInvite(wrapper)

    const btn = wrapper.find('[data-test="open-qris-modal-btn"]')
    expect(btn.exists()).toBe(true)
    await btn.trigger('click')

    const modalContent = document.body.querySelector('[data-test="qris-modal-content"]')
    expect(modalContent).not.toBeNull()
    expect(modalContent.textContent).toContain('Rama & Shinta')
    const img = document.body.querySelector('[data-test="qris-image"]')
    expect(img).not.toBeNull()
    expect(img.getAttribute('src')).toBe(testUrl)

    wrapper.unmount()
  })
})
