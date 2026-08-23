import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import DynamicTheme from './dynamic-theme.vue'

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
