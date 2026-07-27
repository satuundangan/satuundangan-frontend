import { describe, it, expect, afterEach } from 'vitest'
import { applyThemeFonts, removeThemeFonts, THEME_FONTS_LINK_ATTR } from './themeFonts'
import { normalizeThemeConfig, googleFontsUrl } from './themeConfig'

function links() {
  return document.head.querySelectorAll(`link[${THEME_FONTS_LINK_ATTR}]`)
}

afterEach(() => {
  removeThemeFonts()
})

describe('applyThemeFonts', () => {
  it('creates exactly one link whose href matches googleFontsUrl(config)', () => {
    const config = normalizeThemeConfig(null)
    applyThemeFonts(config)
    expect(links().length).toBe(1)
    expect(links()[0].href).toBe(googleFontsUrl(config))
  })

  it('updates the existing link href instead of appending a second one', () => {
    const first = normalizeThemeConfig({
      fonts: { heading: { family: 'Cormorant Garamond', weights: [400], fallback: 'serif' } },
    })
    applyThemeFonts(first)
    const second = normalizeThemeConfig({
      fonts: { heading: { family: 'Playfair Display', weights: [400], fallback: 'serif' } },
    })
    applyThemeFonts(second)

    expect(links().length).toBe(1)
    expect(links()[0].href).toBe(googleFontsUrl(second))
    expect(links()[0].href).not.toBe(googleFontsUrl(first))
  })

  it('does not create/keep a link when every family is generic, and does not throw', () => {
    const genericConfig = normalizeThemeConfig({
      fonts: {
        heading: { family: 'serif', weights: [400], fallback: 'serif' },
        script: { family: 'cursive', weights: [400], fallback: 'cursive' },
        body: { family: 'sans-serif', weights: [400], fallback: 'sans-serif' },
      },
    })
    expect(() => applyThemeFonts(genericConfig)).not.toThrow()
    expect(links().length).toBe(0)
  })
})

describe('removeThemeFonts', () => {
  it('leaves zero matching links and calling it twice does not throw', () => {
    applyThemeFonts(normalizeThemeConfig(null))
    expect(links().length).toBe(1)
    removeThemeFonts()
    expect(links().length).toBe(0)
    expect(() => removeThemeFonts()).not.toThrow()
  })
})
