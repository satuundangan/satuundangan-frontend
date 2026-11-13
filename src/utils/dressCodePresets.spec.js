import { describe, it, expect } from 'vitest'
import {
  DRESS_CODE_PRESETS,
  MAX_DRESS_CODE_COLORS,
  isValidHex,
  normalizeHex,
  getContrastBorder,
  getSwatchShadow
} from './dressCodePresets'

describe('dressCodePresets.js (SAT-63)', () => {
  it('1. Provides at least 6 curated wedding presets with valid hex colors', () => {
    expect(DRESS_CODE_PRESETS.length).toBeGreaterThanOrEqual(6)

    DRESS_CODE_PRESETS.forEach(preset => {
      expect(preset.id).toBeTruthy()
      expect(preset.name).toBeTruthy()
      expect(preset.colors.length).toBeGreaterThanOrEqual(4)
      preset.colors.forEach(hex => {
        expect(isValidHex(hex)).toBe(true)
      })
    })
  })

  it('2. Correctly validates hex color formats', () => {
    expect(isValidHex('#fff')).toBe(true)
    expect(isValidHex('#FFFFFF')).toBe(true)
    expect(isValidHex('#8A9A5B')).toBe(true)
    expect(isValidHex('#123456')).toBe(true)

    expect(isValidHex('')).toBe(false)
    expect(isValidHex('rgb(255,255,255)')).toBe(false)
    expect(isValidHex('#12345')).toBe(false) // 5 chars
    expect(isValidHex('#1234567')).toBe(false) // 7 chars
    expect(isValidHex('#GGGGGG')).toBe(false) // Non-hex
    expect(isValidHex(null)).toBe(false)
    expect(isValidHex(undefined)).toBe(false)
  })

  it('3. Normalizes hex strings by adding # and expanding 3-char shorthand', () => {
    expect(normalizeHex('fff')).toBe('#FFFFFF')
    expect(normalizeHex('#fff')).toBe('#FFFFFF')
    expect(normalizeHex('8a9a5b')).toBe('#8A9A5B')
    expect(normalizeHex('#8a9a5b')).toBe('#8A9A5B')
    expect(normalizeHex('invalid')).toBeNull()
  })

  it('4. Provides adaptive borders for contrast', () => {
    // Pure white should have dark subtle border
    const whiteBorder = getContrastBorder('#ffffff')
    expect(whiteBorder).toContain('rgba(0, 0, 0')

    // Pure black should have light subtle border
    const blackBorder = getContrastBorder('#000000')
    expect(blackBorder).toContain('rgba(255, 255, 255')

    // Mid-range color
    const sageBorder = getContrastBorder('#8A9A5B')
    expect(sageBorder).toBeTruthy()
  })

  it('5. Computes swatch shadow', () => {
    const shadow = getSwatchShadow('#8A9A5B')
    expect(shadow).toContain('0 2px 6px')
    expect(shadow).toContain('#8A9A5B33')
  })
})
