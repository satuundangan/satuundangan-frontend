import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ThemeBuilder from './ThemeBuilder.vue'
import {
  HEADING_FONTS,
  SCRIPT_FONTS,
  BODY_FONTS,
  HERO_VARIANTS,
  BACKGROUND_TYPES,
  SECTION_LABELS,
  applyBackgroundType,
  buildPreviewMessage,
  designConfigForPayload,
} from './themeBuilderOptions'
import { THEME_SECTION_KEYS, THEME_DEFAULTS, normalizeThemeConfig } from '@/utils/themeConfig'

vi.mock('@/api/file.js', () => ({
  uploadFileApi: vi.fn().mockResolvedValue({ fileUrl: 'https://cdn.test/x.webp' }),
}))
vi.mock('vue-toastification', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}))

describe('themeBuilderOptions font catalogues', () => {
  it('has at least 12 entries per role, shaped { family, weights, fallback }', () => {
    for (const list of [HEADING_FONTS, SCRIPT_FONTS, BODY_FONTS]) {
      expect(list.length).toBeGreaterThanOrEqual(12)
      for (const entry of list) {
        expect(typeof entry.family).toBe('string')
        expect(Array.isArray(entry.weights)).toBe(true)
        expect(entry.weights.length).toBeGreaterThan(0)
        expect(typeof entry.fallback).toBe('string')
      }
    }
  })

  it('uses the correct fallback per role', () => {
    expect(HEADING_FONTS.every((f) => f.fallback === 'serif')).toBe(true)
    expect(SCRIPT_FONTS.every((f) => f.fallback === 'cursive')).toBe(true)
    expect(BODY_FONTS.every((f) => f.fallback === 'sans-serif')).toBe(true)
  })
})

describe('HERO_VARIANTS / BACKGROUND_TYPES / SECTION_LABELS', () => {
  it('HERO_VARIANTS matches the 3 schema values', () => {
    expect(HERO_VARIANTS.map((v) => v.value)).toEqual(['classic', 'full-photo', 'framed'])
  })

  it('BACKGROUND_TYPES matches color/gradient/image', () => {
    expect(BACKGROUND_TYPES).toEqual(['color', 'gradient', 'image'])
  })

  it('has a human label for every THEME_SECTION_KEYS entry', () => {
    for (const key of THEME_SECTION_KEYS) {
      expect(typeof SECTION_LABELS[key]).toBe('string')
      expect(SECTION_LABELS[key].length).toBeGreaterThan(0)
    }
  })
})

describe('applyBackgroundType', () => {
  it('switches to gradient with from/to/direction defaults, preserving existing values', () => {
    const section = {
      background: { type: 'color', value: '#123456' },
      ornamentTop: 'top.png',
      ornamentBottom: 'bottom.png',
    }
    const result = applyBackgroundType(section, 'gradient')
    expect(result.background).toEqual({
      type: 'gradient',
      from: '#ffffff',
      to: '#ffffff',
      direction: '180deg',
    })
    expect(result.ornamentTop).toBe('top.png')
    expect(result.ornamentBottom).toBe('bottom.png')
  })

  it('preserves already-set gradient values when re-applying gradient', () => {
    const section = {
      background: { type: 'gradient', from: '#111111', to: '#222222', direction: '90deg' },
    }
    const result = applyBackgroundType(section, 'gradient')
    expect(result.background).toEqual({
      type: 'gradient',
      from: '#111111',
      to: '#222222',
      direction: '90deg',
    })
  })

  it('switches to image yielding { type: image, url }', () => {
    const section = { background: { type: 'color', value: '#ffffff' } }
    const result = applyBackgroundType(section, 'image')
    expect(result.background).toEqual({ type: 'image', url: '' })
  })

  it('switches to color yielding { type: color, value }', () => {
    const section = { background: { type: 'image', url: 'x.png' } }
    const result = applyBackgroundType(section, 'color')
    expect(result.background).toEqual({ type: 'color', value: '#ffffff' })
  })
})

describe('ThemeBuilder.vue', () => {
  it('renders 7 color inputs seeded from THEME_DEFAULTS when modelValue is null', () => {
    const wrapper = mount(ThemeBuilder, { props: { modelValue: null } })
    const colorInputs = wrapper.get('[data-testid="colors-group"]').findAll('input[type="color"]')
    expect(colorInputs.length).toBe(7)
    expect(wrapper.get('[data-testid="color-primary-hex"]').element.value).toBe(
      THEME_DEFAULTS.colors.primary,
    )
  })

  it('emits update:modelValue with the changed color and all other top-level keys intact', async () => {
    const wrapper = mount(ThemeBuilder, { props: { modelValue: null } })
    const primaryHex = wrapper.get('[data-testid="color-primary-hex"]')
    await primaryHex.setValue('#ff0000')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const payload = emitted[emitted.length - 1][0]
    expect(payload.colors.primary).toBe('#ff0000')
    expect(payload).toHaveProperty('fonts')
    expect(payload).toHaveProperty('hero')
    expect(payload).toHaveProperty('sections')
    expect(payload).toHaveProperty('ornaments')
    expect(payload).toHaveProperty('decor')
    expect(payload).toHaveProperty('version')
  })

  it('shows gradient inputs and hides the flat color input when switching a section to gradient', async () => {
    const wrapper = mount(ThemeBuilder, { props: { modelValue: null } })
    const select = wrapper.get('[data-testid="section-bg-type-couple"]')
    await select.setValue('gradient')

    expect(wrapper.find('[data-testid="section-bg-gradient-couple"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="section-bg-color-couple"]').exists()).toBe(false)

    await select.setValue('image')
    expect(wrapper.find('[data-testid="section-bg-gradient-couple"]').exists()).toBe(false)
  })

  it('shows the saved value and keeps defaults for the other keys with a partial modelValue', () => {
    const wrapper = mount(ThemeBuilder, {
      props: { modelValue: { colors: { primary: '#7a1620' } } },
    })
    expect(wrapper.get('[data-testid="color-primary-hex"]').element.value).toBe('#7a1620')
    const secondaryHex = wrapper.get('[data-testid="colors-group"]').findAll('input[type="text"]')[1]
    expect(secondaryHex.element.value).toBe(THEME_DEFAULTS.colors.secondary)
  })
})

describe('buildPreviewMessage', () => {
  const config = normalizeThemeConfig({ colors: { primary: '#7a1620' } })

  it('returns a LIVE_PREVIEW_UPDATE message', () => {
    const msg = buildPreviewMessage(config)
    expect(msg.type).toBe('LIVE_PREVIEW_UPDATE')
    expect(msg.data).toBeTruthy()
  })

  it('sets template_slug to dynamic-theme and designConfig to the passed config', () => {
    const msg = buildPreviewMessage(config)
    expect(msg.data.template_slug).toBe('dynamic-theme')
    expect(msg.data.designConfig).toEqual(config)
  })

  it('forces every THEME_SECTION_KEYS entry into selectedSections', () => {
    const msg = buildPreviewMessage(config)
    for (const key of THEME_SECTION_KEYS) {
      expect(msg.data.selectedSections).toContain(key)
    }
  })

  it('is JSON-clonable', () => {
    const msg = buildPreviewMessage(config)
    expect(JSON.parse(JSON.stringify(msg))).toEqual(msg)
  })

  it('keeps musicChoice falsy so the builder preview stays silent', () => {
    const msg = buildPreviewMessage(config)
    expect(msg.data.musicChoice).toBeFalsy()
  })
})

describe('designConfigForPayload', () => {
  it('returns the config object (deep-equal, not a string) for dynamic-theme', () => {
    const config = { colors: { primary: '#7a1620' } }
    expect(designConfigForPayload('dynamic-theme', config)).toEqual(config)
    expect(typeof designConfigForPayload('dynamic-theme', config)).toBe('object')
  })

  it('returns null for a non-dynamic-theme componentKey', () => {
    expect(designConfigForPayload('royal-emerald', { colors: {} })).toBeNull()
  })

  it('returns null for dynamic-theme with null/undefined config', () => {
    expect(designConfigForPayload('dynamic-theme', null)).toBeNull()
    expect(designConfigForPayload('dynamic-theme', undefined)).toBeNull()
  })

  it('returns null for an empty componentKey', () => {
    expect(designConfigForPayload('', { colors: {} })).toBeNull()
  })
})
