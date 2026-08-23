import { describe, it, expect } from 'vitest'
import {
  THEME_DEFAULTS,
  THEME_SECTION_KEYS,
  COUPLE_PHOTO_FALLBACKS,
  normalizeThemeConfig,
  themeCssVars,
  googleFontsUrl,
  sectionStyle,
  resolveCouplePhoto,
} from './themeConfig'

describe('normalizeThemeConfig', () => {
  it('returns a deep clone of THEME_DEFAULTS (plus seeded sections) for nullish/garbage input', () => {
    for (const bad of [null, undefined, '', '{bad json', 42]) {
      const result = normalizeThemeConfig(bad)
      expect(result).toBeTruthy()
      expect(result.colors).toEqual(THEME_DEFAULTS.colors)
      expect(result.fonts).toEqual(THEME_DEFAULTS.fonts)
      expect(result.hero.variant).toBe('classic')
      for (const key of THEME_SECTION_KEYS) {
        expect(result.sections[key]).toBeTruthy()
      }
    }
  })

  it('parses a JSON string and deep-merges, keeping sibling defaults intact', () => {
    const result = normalizeThemeConfig('{"colors":{"primary":"#e11d48"}}')
    expect(result.colors.primary).toBe('#e11d48')
    expect(result.colors.background).toBe(THEME_DEFAULTS.colors.background)
  })

  it('keeps a custom section entry AND every default section key', () => {
    const result = normalizeThemeConfig({
      sections: { couple: { background: { type: 'image', url: 'x.png' } } },
    })
    expect(result.sections.couple.background.type).toBe('image')
    expect(result.sections.couple.background.url).toBe('x.png')
    for (const key of THEME_SECTION_KEYS) {
      expect(result.sections[key]).toBeTruthy()
    }
  })

  it('falls back to classic for an unknown hero.variant', () => {
    expect(normalizeThemeConfig({ hero: { variant: 'nonsense' } }).hero.variant).toBe('classic')
  })

  it('never throws and never returns null/undefined', () => {
    for (const bad of [null, undefined, '', '{bad json', 42, [], () => {}]) {
      expect(() => normalizeThemeConfig(bad)).not.toThrow()
      expect(normalizeThemeConfig(bad)).not.toBeNull()
      expect(normalizeThemeConfig(bad)).not.toBeUndefined()
    }
  })

  it('defaults couple.photoFallback to "hide" for nullish input', () => {
    expect(normalizeThemeConfig(null).couple.photoFallback).toBe('hide')
  })

  it('keeps an explicit valid couple.photoFallback value', () => {
    expect(
      normalizeThemeConfig({ couple: { photoFallback: 'ornament' } }).couple.photoFallback,
    ).toBe('ornament')
  })

  it('falls back to "hide" for an unknown couple.photoFallback value', () => {
    for (const bad of ['banana', 42, '', null]) {
      expect(normalizeThemeConfig({ couple: { photoFallback: bad } }).couple.photoFallback).toBe(
        'hide',
      )
    }
  })

  it('does not throw and resolves to "hide" when couple itself is malformed', () => {
    for (const bad of [null, 'garbage', []]) {
      expect(() => normalizeThemeConfig({ couple: bad })).not.toThrow()
      expect(normalizeThemeConfig({ couple: bad }).couple.photoFallback).toBe('hide')
    }
  })
})

describe('resolveCouplePhoto', () => {
  it('returns mode "photo" with the trimmed src when photoUrl is non-empty', () => {
    const result = resolveCouplePhoto(normalizeThemeConfig(null), '  https://x/y.jpg  ')
    expect(result).toEqual({ mode: 'photo', src: 'https://x/y.jpg', patternUrl: '' })
  })

  it('treats a whitespace-only photoUrl as empty', () => {
    const result = resolveCouplePhoto(normalizeThemeConfig(null), '   ')
    expect(result.mode).not.toBe('photo')
  })

  it('resolves to mode "hide" when photo is empty and fallback is "hide"', () => {
    const cfg = normalizeThemeConfig({ couple: { photoFallback: 'hide' } })
    expect(resolveCouplePhoto(cfg, '')).toEqual({ mode: 'hide', src: '', patternUrl: '' })
  })

  it('resolves to mode "ornament" when photo is empty, fallback is "ornament" and patternUrl is set', () => {
    const cfg = normalizeThemeConfig({
      couple: { photoFallback: 'ornament' },
      decor: { patternUrl: 'https://cdn.test/p.png' },
    })
    expect(resolveCouplePhoto(cfg, '')).toEqual({
      mode: 'ornament',
      src: '',
      patternUrl: 'https://cdn.test/p.png',
    })
  })

  it('degrades to mode "hide" when fallback is "ornament" but patternUrl is empty', () => {
    const cfg = normalizeThemeConfig({ couple: { photoFallback: 'ornament' } })
    expect(resolveCouplePhoto(cfg, '')).toEqual({ mode: 'hide', src: '', patternUrl: '' })
  })

  it('accepts a raw (un-normalized) config object without throwing', () => {
    expect(() => resolveCouplePhoto({ couple: { photoFallback: 'ornament' } }, '')).not.toThrow()
  })

  it('accepts a JSON string config without throwing', () => {
    expect(() => resolveCouplePhoto('{"couple":{"photoFallback":"ornament"}}', '')).not.toThrow()
  })

  it('COUPLE_PHOTO_FALLBACKS contains exactly hide and ornament', () => {
    expect(COUPLE_PHOTO_FALLBACKS).toEqual(['hide', 'ornament'])
  })
})

describe('themeCssVars', () => {
  it('returns a flat object of --dt- prefixed keys', () => {
    const vars = themeCssVars(normalizeThemeConfig(null))
    expect(Object.keys(vars).every((k) => k.startsWith('--dt-'))).toBe(true)
    expect(vars).toHaveProperty('--dt-color-primary')
    expect(vars).toHaveProperty('--dt-font-heading')
    expect(vars).toHaveProperty('--dt-radius')
  })

  it('accepts a raw config too (normalizes internally)', () => {
    const vars = themeCssVars('{"colors":{"primary":"#111111"}}')
    expect(vars['--dt-color-primary']).toBe('#111111')
  })
})

describe('googleFontsUrl', () => {
  it('returns one fonts.googleapis.com URL with display=swap', () => {
    const url = googleFontsUrl(normalizeThemeConfig(null))
    expect(url).toMatch(/^https:\/\/fonts\.googleapis\.com\/css2\?/)
    expect(url).toContain('&display=swap')
  })

  it('de-duplicates repeated families and URL-encodes spaces as +', () => {
    const cfg = normalizeThemeConfig({
      fonts: {
        heading: { family: 'Great Vibes', weights: [400], fallback: 'cursive' },
        script: { family: 'Great Vibes', weights: [400], fallback: 'cursive' },
        body: { family: 'Cormorant Garamond', weights: [400], fallback: 'serif' },
      },
    })
    const url = googleFontsUrl(cfg)
    const matches = url.match(/family=Great\+Vibes/g)
    expect(matches).toHaveLength(1)
    expect(url).toContain('family=Cormorant+Garamond')
  })

  it('returns null when every configured family is generic/system', () => {
    const cfg = normalizeThemeConfig({
      fonts: {
        heading: { family: 'serif', weights: [400], fallback: 'serif' },
        script: { family: 'sans-serif', weights: [400], fallback: 'sans-serif' },
        body: { family: 'Arial', weights: [400], fallback: 'sans-serif' },
      },
    })
    expect(googleFontsUrl(cfg)).toBeNull()
  })
})

describe('sectionStyle', () => {
  it('returns backgroundColor for type: color', () => {
    const cfg = normalizeThemeConfig({
      sections: { couple: { background: { type: 'color', value: '#abcdef' } } },
    })
    expect(sectionStyle(cfg, 'couple')).toEqual({ backgroundColor: '#abcdef' })
  })

  it('returns a linear-gradient backgroundImage for type: gradient', () => {
    const cfg = normalizeThemeConfig({
      sections: {
        event: { background: { type: 'gradient', from: '#fff', to: '#000' } },
      },
    })
    const style = sectionStyle(cfg, 'event')
    expect(style.backgroundImage).toContain('linear-gradient(')
    expect(style.backgroundImage).toContain('#fff')
    expect(style.backgroundImage).toContain('#000')
  })

  it('returns a url(...) backgroundImage + cover backgroundSize for type: image', () => {
    const cfg = normalizeThemeConfig({
      sections: { gallery: { background: { type: 'image', url: 'https://x/y.png' } } },
    })
    const style = sectionStyle(cfg, 'gallery')
    expect(style.backgroundImage).toBe('url("https://x/y.png")')
    expect(style.backgroundSize).toBe('cover')
  })

  it('returns the default surface background for an unknown section key', () => {
    const cfg = normalizeThemeConfig(null)
    expect(sectionStyle(cfg, 'not-a-real-key')).toEqual({
      backgroundColor: THEME_DEFAULTS.colors.surface,
    })
  })
})
