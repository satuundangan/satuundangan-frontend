import { describe, it, expect } from 'vitest'
import {
  templateComponentKeys,
  normalizeTemplateKey,
  resolveTemplateKey,
  FALLBACK_TEMPLATE_KEY,
} from './templateRegistry'

const fakeRegistry = {
  'royal-gold': () => {},
  'royal-emerald': () => {},
  'one-piece': () => {},
  'dark-elegant': () => {},
}

describe('templateRegistry', () => {
  it('templateComponentKeys includes all 31 SFCs in src/templates/', () => {
    expect(templateComponentKeys).toHaveLength(31)
    expect(templateComponentKeys).toContain('dark-elegant')
    expect(templateComponentKeys).toContain('old-money-monogram')
    expect(templateComponentKeys).toContain('one-piece')
    expect(templateComponentKeys).toContain('naruto')
    expect(templateComponentKeys).toContain('dynamic-theme')
    expect(templateComponentKeys).toContain('bali-payas-agung')
    expect(templateComponentKeys).toContain('batak-ragi-hotang')
    expect(templateComponentKeys).toContain('betawi-palang-pintu')
    expect(templateComponentKeys).toContain('bugis-saoraja')
    expect(templateComponentKeys).toContain('jawa-truntum')
    expect(templateComponentKeys).toContain('sunda-sabilulungan')
    expect(templateComponentKeys).toContain('dayak-ngaju-benang-bintik')
    expect(templateComponentKeys).toContain('minang-suntiang-emas')
    expect(templateComponentKeys).toContain('palembang-aesan-gede')
    expect(templateComponentKeys).toContain('strawberry-matcha')
    expect(templateComponentKeys).toContain('moroccan-marrakech-gold')
  })

  it('normalizeTemplateKey trims, lowercases, and dash-joins whitespace', () => {
    expect(normalizeTemplateKey('  Royal Emerald ')).toBe('royal-emerald')
  })

  it('resolveTemplateKey returns a direct slug hit', () => {
    expect(resolveTemplateKey('royal-gold', null, fakeRegistry)).toBe('royal-gold')
  })

  it('resolveTemplateKey falls back to componentKey when the slug is unknown', () => {
    expect(resolveTemplateKey('promo-lebaran-2026', 'royal-emerald', fakeRegistry)).toBe(
      'royal-emerald',
    )
  })

  it('resolveTemplateKey falls back to dark-elegant when neither slug nor componentKey match', () => {
    expect(resolveTemplateKey('promo-lebaran-2026', 'does-not-exist', fakeRegistry)).toBe(
      FALLBACK_TEMPLATE_KEY,
    )
  })

  it('resolveTemplateKey never lets componentKey override an SFC named after the slug', () => {
    expect(resolveTemplateKey('royal-gold', 'one-piece', fakeRegistry)).toBe('royal-gold')
  })
})
