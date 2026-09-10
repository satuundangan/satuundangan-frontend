import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DynamicTheme from './dynamic-theme.vue'
import { THEME_PRESETS } from '@/components/admin/themePresets'

vi.mock('vue-toastification', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}))
vi.mock('@/api/guestMessage', () => ({ createGuestMessage: vi.fn() }))

function makeData(overrides = {}) {
  return {
    id: 0,
    groomName: 'Budi',
    brideName: 'Siti',
    parents: { groomParents: 'Bpk A & Ibu B', brideParents: 'Bpk C & Ibu D' },
    selectedSections: ['couple'],
    designConfig: {},
    ...overrides,
  }
}

function coupleSection(wrapper) {
  return wrapper.get('#couple')
}

describe('dynamic-theme.vue couple section', () => {
  it('HIDE (default config, no photos): no img with empty/absent src, plain blocks render with text tokens', () => {
    const wrapper = mount(DynamicTheme, { props: { data: makeData() } })
    const section = coupleSection(wrapper)

    expect(section.findAll('img[data-testid^="couple-photo-"]').length).toBe(0)

    for (const img of section.findAll('img')) {
      const src = img.attributes('src')
      expect(src, 'no <img> in the couple section may have an empty/absent src').toBeTruthy()
      expect(src.trim().length).toBeGreaterThan(0)
    }

    const plainGroom = section.get('[data-testid="couple-plain-groom"]')
    const plainBride = section.get('[data-testid="couple-plain-bride"]')
    expect(plainGroom.text()).toContain('Budi')
    expect(plainGroom.text()).toContain('Bpk A & Ibu B')
    expect(plainBride.text()).toContain('Siti')
    expect(plainBride.text()).toContain('Bpk C & Ibu D')

    const groomName = plainGroom.find('h3')
    const groomParents = plainGroom.find('p')
    expect(groomName.attributes('style')).toContain('var(--dt-color-text)')
    expect(groomName.attributes('style')).not.toContain('var(--dt-color-surface)')
    expect(groomParents.attributes('style')).toContain('var(--dt-color-text-muted)')
  })

  it('ORNAMENT: no photos, photoFallback ornament + non-empty patternUrl renders tiled pattern box', () => {
    const wrapper = mount(DynamicTheme, {
      props: {
        data: makeData({
          designConfig: {
            couple: { photoFallback: 'ornament' },
            decor: { patternUrl: 'https://cdn.test/p.png' },
          },
        }),
      },
    })
    const section = coupleSection(wrapper)

    const ornamentGroom = section.get('[data-testid="couple-ornament-groom"]')
    const ornamentBride = section.get('[data-testid="couple-ornament-bride"]')
    expect(ornamentGroom.attributes('style')).toContain('background-repeat: repeat')
    expect(ornamentGroom.attributes('style')).toContain('cdn.test/p.png')
    expect(ornamentBride.attributes('style')).toContain('background-repeat: repeat')
    expect(ornamentBride.attributes('style')).toContain('cdn.test/p.png')

    expect(section.findAll('img[data-testid^="couple-photo-"]').length).toBe(0)
    expect(section.text()).toContain('Budi')
    expect(section.text()).toContain('Siti')
  })

  it('ORNAMENT + empty patternUrl degrades to plain (hide)', () => {
    const wrapper = mount(DynamicTheme, {
      props: {
        data: makeData({
          designConfig: {
            couple: { photoFallback: 'ornament' },
            decor: { patternUrl: '' },
          },
        }),
      },
    })
    const section = coupleSection(wrapper)

    expect(section.find('[data-testid="couple-ornament-groom"]').exists()).toBe(false)
    expect(section.find('[data-testid="couple-ornament-bride"]').exists()).toBe(false)
    expect(section.find('[data-testid="couple-plain-groom"]').exists()).toBe(true)
    expect(section.find('[data-testid="couple-plain-bride"]').exists()).toBe(true)
  })

  it('MIXED: groomPhotoUrl set, no bride/shared photo -> one photo + one plain (independent resolution)', () => {
    const wrapper = mount(DynamicTheme, {
      props: {
        data: makeData({ groomPhotoUrl: 'https://cdn.test/g.jpg' }),
      },
    })
    const section = coupleSection(wrapper)

    const groomPhoto = section.get('[data-testid="couple-photo-groom"]')
    expect(groomPhoto.attributes('src')).toBe('https://cdn.test/g.jpg')
    expect(section.find('[data-testid="couple-photo-bride"]').exists()).toBe(false)
    expect(section.find('[data-testid="couple-plain-bride"]').exists()).toBe(true)
  })

  it('shared photoCoupleUrl with neither per-person url resolves both as photos', () => {
    const wrapper = mount(DynamicTheme, {
      props: {
        data: makeData({ photoCoupleUrl: 'https://cdn.test/shared.jpg' }),
      },
    })
    const section = coupleSection(wrapper)

    const groomPhoto = section.get('[data-testid="couple-photo-groom"]')
    const bridePhoto = section.get('[data-testid="couple-photo-bride"]')
    expect(groomPhoto.attributes('src')).toBe('https://cdn.test/shared.jpg')
    expect(bridePhoto.attributes('src')).toBe('https://cdn.test/shared.jpg')
  })
})

describe('dynamic-theme.vue hero ink', () => {
  function findPreset(key) {
    return THEME_PRESETS.find((p) => p.key === key)
  }

  it('islami-emas (light backdrop) gate eyebrow reads dark ink and sits on a cream scrim', () => {
    const wrapper = mount(DynamicTheme, {
      props: {
        data: makeData({
          designConfig: findPreset('islami-emas').config,
          resepsiLocation: { dateTime: '2027-01-01T10:00:00.000Z' },
        }),
      },
    })

    const eyebrow = wrapper.findAll('p').find((p) => p.text() === 'The Wedding Of')
    expect(eyebrow.attributes('style')).toContain('var(--dt-color-text-muted)')

    const gateScrim = wrapper.get('[data-dt-scrim="gate"]')
    expect(gateScrim.attributes('style')).toContain('rgba(250, 246, 236')
  })

  it('islami-emas (light backdrop) classic hero renders dark ink, no heavy drop-shadow, muted countdown label', async () => {
    const wrapper = mount(DynamicTheme, {
      props: {
        data: makeData({
          designConfig: findPreset('islami-emas').config,
          resepsiLocation: { dateTime: '2027-01-01T10:00:00.000Z' },
        }),
      },
    })

    await wrapper.get('button').trigger('click')

    const h1 = wrapper.get('#hero h1')
    expect(h1.attributes('style')).toContain('var(--dt-color-text)')
    expect(h1.classes()).not.toContain('drop-shadow-2xl')

    const dateP = wrapper.get('#hero p.text-base')
    expect(dateP.attributes('style')).toContain('var(--dt-color-text)')

    const countdownLabel = wrapper.get('#hero .text-\\[8px\\]')
    expect(countdownLabel.attributes('style')).toContain('var(--dt-color-text-muted)')

    expect(wrapper.find('[data-dt-scrim="hero"]').exists()).toBe(true)
  })

  it('midnight-elegant (dark backdrop, full-photo) preserves the existing light-ink + drop-shadow look', async () => {
    const wrapper = mount(DynamicTheme, {
      props: {
        data: makeData({
          designConfig: findPreset('midnight-elegant').config,
          resepsiLocation: { dateTime: '2027-01-01T10:00:00.000Z' },
        }),
      },
    })

    await wrapper.get('button').trigger('click')

    const h1 = wrapper.get('#hero h1')
    expect(h1.attributes('style')).toContain('var(--dt-color-surface)')
    expect(h1.classes()).toContain('drop-shadow-lg')

    const eyebrow = wrapper.findAll('#hero p').find((p) => p.text() === 'We Are Getting Married')
    expect(eyebrow.attributes('style')).toContain('var(--dt-color-accent)')
  })
})

describe('dynamic-theme.vue compatibility and navigation', () => {
  it('normalizes legacy string wallet and gift-address payloads into one card each', () => {
    const wrapper = mount(DynamicTheme, {
      props: {
        data: makeData({
          selectedSections: ['gift'],
          eWalletLink: '08123456789 (OVO)',
          giftDeliveryAddress: 'Jl. Melati No. 123',
        }),
      },
    })

    const sections = wrapper.findAll('section')
    const walletSection = sections.find((section) => section.text().includes('QRIS & E-Wallet'))
    const addressSection = sections.find((section) => section.text().includes('Kirim Kado'))

    expect(walletSection).toBeTruthy()
    expect(walletSection.findAll('button')).toHaveLength(1)
    expect(walletSection.text()).toContain('08123456789 (OVO)')
    expect(addressSection).toBeTruthy()
    expect(addressSection.text()).toContain('Jl. Melati No. 123')
  })

  it('accepts selected section objects from API responses', () => {
    const wrapper = mount(DynamicTheme, {
      props: {
        data: makeData({
          selectedSections: [{ key: 'couple', is_enabled: true }],
        }),
      },
    })

    expect(wrapper.find('#couple').exists()).toBe(true)
    expect(wrapper.find('#event').exists()).toBe(false)
  })

  it('adds the Royal Emerald-style section navigation after opening', async () => {
    const wrapper = mount(DynamicTheme, {
      props: { data: makeData({ selectedSections: ['couple', 'event'] }) },
    })

    await wrapper.get('button').trigger('click')

    const nav = wrapper.get('nav[aria-label="Navigasi undangan"]')
    expect(nav.text()).toContain('Home')
    expect(nav.text()).toContain('Couple')
    expect(nav.text()).toContain('Event')
  })

  it('applies the readable compatibility palette to legacy Islami Emas config', () => {
    const wrapper = mount(DynamicTheme, {
      props: {
        data: makeData({
          template_slug: 'islami-emas',
          designConfig: { colors: { primary: '#BD9B2D' } },
        }),
      },
    })

    expect(wrapper.attributes('style')).toContain('--dt-color-primary: #8A6A22')
  })
})
