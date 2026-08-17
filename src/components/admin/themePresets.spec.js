import { describe, it, expect } from 'vitest'
import { THEME_SECTION_KEYS, normalizeThemeConfig } from '@/utils/themeConfig'
import { FONT_CATALOGUE, sanitizeHex, buildCopySources } from './themeBuilderOptions'
import { THEME_PRESETS } from './themePresets'

const HEX_RE = /^#[0-9a-f]{6}$/i
const COLOR_KEYS = ['primary', 'secondary', 'accent', 'background', 'surface', 'text', 'textMuted']

describe('THEME_PRESETS', () => {
  it('has exactly 6 entries, each { key, label, description, config }, keys unique and non-empty', () => {
    expect(THEME_PRESETS.length).toBe(6)
    const keys = new Set()
    for (const preset of THEME_PRESETS) {
      expect(typeof preset.key).toBe('string')
      expect(preset.key.length).toBeGreaterThan(0)
      expect(typeof preset.label).toBe('string')
      expect(preset.label.length).toBeGreaterThan(0)
      expect(typeof preset.description).toBe('string')
      expect(preset.description.length).toBeGreaterThan(0)
      expect(typeof preset.config).toBe('object')
      expect(preset.config).not.toBeNull()
      keys.add(preset.key)
    }
    expect(keys.size).toBe(6)
  })

  for (const preset of THEME_PRESETS) {
    describe(`preset: ${preset.key}`, () => {
      it('survives normalizeThemeConfig without throwing and round-trips idempotently', () => {
        let normalized
        expect(() => {
          normalized = normalizeThemeConfig(preset.config)
        }).not.toThrow()
        const twice = normalizeThemeConfig(normalized)
        expect(twice).toEqual(normalized)
      })

      it('has all 7 color keys, each a valid 6-digit hex', () => {
        for (const key of COLOR_KEYS) {
          expect(preset.config.colors).toHaveProperty(key)
          expect(preset.config.colors[key]).toMatch(HEX_RE)
        }
      })

      it('has a valid hex hero.overlayColor', () => {
        expect(preset.config.hero.overlayColor).toMatch(HEX_RE)
      })

      it('supplies all THEME_SECTION_KEYS with a color background and a valid hex value', () => {
        for (const key of THEME_SECTION_KEYS) {
          const entry = preset.config.sections[key]
          expect(entry, `preset "${preset.key}" missing section "${key}"`).toBeTruthy()
          expect(entry.background.type).toBe('color')
          expect(entry.background.value).toMatch(HEX_RE)
        }
      })

      it('contains no non-empty image URLs', () => {
        expect(preset.config.hero.backgroundImage).toBe('')
        expect(preset.config.ornaments.corner).toBe('')
        expect(preset.config.ornaments.divider).toBe('')
        expect(preset.config.ornaments.frame).toBe('')
        expect(preset.config.decor.patternUrl).toBe('')
        for (const key of THEME_SECTION_KEYS) {
          expect(preset.config.sections[key].background.url).toBeUndefined()
        }
      })

      it('uses font families that exist in the matching FONT_CATALOGUE role list', () => {
        for (const role of ['heading', 'script', 'body']) {
          const family = preset.config.fonts[role].family
          const catalogueFamilies = FONT_CATALOGUE[role].map((f) => f.family)
          expect(
            catalogueFamilies,
            `preset "${preset.key}" font role "${role}" family "${family}" not in catalogue`,
          ).toContain(family)
        }
      })

      it('has a valid hero.variant and opacity values within [0, 1]', () => {
        expect(['classic', 'full-photo', 'framed']).toContain(preset.config.hero.variant)
        expect(typeof preset.config.hero.overlayOpacity).toBe('number')
        expect(preset.config.hero.overlayOpacity).toBeGreaterThanOrEqual(0)
        expect(preset.config.hero.overlayOpacity).toBeLessThanOrEqual(1)
        expect(typeof preset.config.decor.patternOpacity).toBe('number')
        expect(preset.config.decor.patternOpacity).toBeGreaterThanOrEqual(0)
        expect(preset.config.decor.patternOpacity).toBeLessThanOrEqual(1)
      })
    })
  }
})

describe('sanitizeHex', () => {
  it('passes through an already-valid hex', () => {
    expect(sanitizeHex('#a1b2c3', '#000000')).toBe('#a1b2c3')
  })

  it('prepends a missing hash', () => {
    expect(sanitizeHex('A1B2C3', '#000000')).toBe('#A1B2C3')
  })

  it('expands a 3-digit shorthand', () => {
    expect(sanitizeHex('#abc', '#000000')).toBe('#aabbcc')
  })

  it('trims surrounding whitespace', () => {
    expect(sanitizeHex('  #a1b2c3  ', '#000000')).toBe('#a1b2c3')
  })

  it('falls back to previous for unsalvageable input', () => {
    expect(sanitizeHex('not-a-color', '#123456')).toBe('#123456')
  })

  it('falls back to previous for empty/null/undefined input', () => {
    expect(sanitizeHex('', '#123456')).toBe('#123456')
    expect(sanitizeHex(null, '#123456')).toBe('#123456')
    expect(sanitizeHex(undefined, '#123456')).toBe('#123456')
  })

  it('falls back to #000000 when previous itself is invalid or missing', () => {
    expect(sanitizeHex('not-a-color', 'garbage')).toBe('#000000')
    expect(sanitizeHex('not-a-color', undefined)).toBe('#000000')
    expect(sanitizeHex('not-a-color', null)).toBe('#000000')
  })
})

describe('buildCopySources', () => {
  const templates = [
    { id: '1', name: 'Alpha', componentKey: 'dynamic-theme', designConfig: { colors: {} } },
    { id: '2', name: '', slug: 'beta-slug', componentKey: 'dynamic-theme', designConfig: {} },
    { id: '3', name: 'Gamma', componentKey: 'royal-emerald', designConfig: { colors: {} } },
    { id: '4', name: 'Delta', componentKey: 'dynamic-theme', designConfig: null },
    { id: '5', name: 'Epsilon', componentKey: 'dynamic-theme', designConfig: 'not-an-object' },
    { id: '6', name: 'Zeta', componentKey: 'dynamic-theme', designConfig: ['not', 'an', 'obj'] },
    { id: '7', name: '', componentKey: 'dynamic-theme', designConfig: { colors: {} } },
  ]

  it('keeps only dynamic-theme rows with a plain-object designConfig', () => {
    const result = buildCopySources(templates, null)
    const ids = result.map((r) => r.id)
    expect(ids).toEqual(['1', '2', '7'])
  })

  it('excludes the row whose id === currentId', () => {
    const result = buildCopySources(templates, '1')
    expect(result.map((r) => r.id)).toEqual(['2', '7'])
  })

  it('maps to { id, name, designConfig }, name falling back to slug then (tanpa nama)', () => {
    const result = buildCopySources(templates, null)
    expect(result[0]).toEqual({ id: '1', name: 'Alpha', designConfig: { colors: {} } })
    expect(result[1]).toEqual({ id: '2', name: 'beta-slug', designConfig: {} })
    expect(result[2]).toEqual({ id: '7', name: '(tanpa nama)', designConfig: { colors: {} } })
  })

  it('returns [] for non-array or null input', () => {
    expect(buildCopySources(null, '1')).toEqual([])
    expect(buildCopySources(undefined, '1')).toEqual([])
    expect(buildCopySources({}, '1')).toEqual([])
    expect(buildCopySources('nope', '1')).toEqual([])
  })
})
