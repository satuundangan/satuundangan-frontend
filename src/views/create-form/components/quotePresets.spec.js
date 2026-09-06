import { describe, it, expect } from 'vitest'
import {
  RELIGIONS,
  RELIGION_IDS,
  DEFAULT_RELIGION,
  QUOTE_PRESETS,
  normalizeReligion,
  presetsFor,
  defaultQuoteFor,
  resolveQuoteForSave,
} from './quotePresets'

describe('quotePresets', () => {
  it('defaultQuoteFor returns the expected source per religion', () => {
    expect(defaultQuoteFor('kristen').source).toBe('1 Korintus 13:4-5')
    expect(defaultQuoteFor('islam').source).toBe('QS. Ar-Rum: 21')
  })

  it('every religion id returns a non-empty { text, source } default quote', () => {
    for (const id of RELIGION_IDS) {
      const quote = defaultQuoteFor(id)
      expect(quote.text).toBeTruthy()
      expect(quote.source).toBeTruthy()
    }
  })

  it('normalizeReligion falls back to DEFAULT_RELIGION for falsy/unknown values', () => {
    expect(normalizeReligion(null)).toBe('islam')
    expect(normalizeReligion('')).toBe('islam')
    expect(normalizeReligion(undefined)).toBe('islam')
    expect(normalizeReligion('nonsense')).toBe('islam')
    expect(normalizeReligion(DEFAULT_RELIGION)).toBe('islam')
  })

  it('normalizeReligion maps the legacy "bebas" value to "umum"', () => {
    expect(normalizeReligion('bebas')).toBe('umum')
  })

  it('normalizeReligion passes through a known religion unchanged', () => {
    expect(normalizeReligion('hindu')).toBe('hindu')
  })

  it('resolveQuoteForSave in default mode returns the religion first preset, ignoring quote/quoteSource', () => {
    const result = resolveQuoteForSave({
      quoteType: 'default',
      religion: 'hindu',
      quote: 'irrelevant',
      quoteSource: 'irrelevant',
    })
    expect(result).toEqual({
      quoteText: QUOTE_PRESETS.hindu[0].text,
      quoteSource: QUOTE_PRESETS.hindu[0].source,
    })
  })

  it('resolveQuoteForSave in default mode with religion: null falls back to islam (no crash, no relabel)', () => {
    const result = resolveQuoteForSave({ quoteType: 'default', religion: null })
    expect(result).toEqual({
      quoteText: QUOTE_PRESETS.islam[0].text,
      quoteSource: QUOTE_PRESETS.islam[0].source,
    })
  })

  it('resolveQuoteForSave in custom mode passes formData.quote/quoteSource straight through', () => {
    const result = resolveQuoteForSave({
      quoteType: 'custom',
      quote: 'x',
      quoteSource: 'y',
      religion: 'budha',
    })
    expect(result).toEqual({ quoteText: 'x', quoteSource: 'y' })
  })

  it('resolveQuoteForSave in preset mode passes formData.quote/quoteSource straight through', () => {
    const result = resolveQuoteForSave({ quoteType: 'preset', quote: 'p', quoteSource: 's' })
    expect(result).toEqual({ quoteText: 'p', quoteSource: 's' })
  })

  it('resolveQuoteForSave tolerates {} and undefined without throwing', () => {
    expect(() => resolveQuoteForSave({})).not.toThrow()
    expect(() => resolveQuoteForSave(undefined)).not.toThrow()
    expect(resolveQuoteForSave({})).toEqual({ quoteText: '', quoteSource: '' })
    expect(resolveQuoteForSave(undefined)).toEqual({ quoteText: '', quoteSource: '' })
  })

  it('RELIGIONS matches the original 6-category order', () => {
    expect(RELIGIONS.map((r) => r.id)).toEqual([
      'islam',
      'kristen',
      'katolik',
      'hindu',
      'budha',
      'umum',
    ])
  })

  it('QUOTE_PRESETS keeps the original preset counts per religion', () => {
    expect(QUOTE_PRESETS.islam).toHaveLength(3)
    expect(QUOTE_PRESETS.kristen).toHaveLength(3)
    expect(QUOTE_PRESETS.katolik).toHaveLength(3)
    expect(QUOTE_PRESETS.hindu).toHaveLength(3)
    expect(QUOTE_PRESETS.budha).toHaveLength(2)
    expect(QUOTE_PRESETS.umum).toHaveLength(3)
  })
})
