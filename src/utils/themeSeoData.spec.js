import { describe, it, expect } from 'vitest'
import {
  THEME_SEO_DATA,
  ALL_THEME_SLUGS,
  getAllThemes,
  getThemeBySlug,
  resolveThemeSeo,
  getMatchingTemplatesForTheme,
} from './themeSeoData.js'

describe('Programmatic SEO Theme Data Utility (themeSeoData.js)', () => {
  describe('Active Theme Slugs & Coverage', () => {
    it('defines a non-empty list of active theme slugs', () => {
      expect(Array.isArray(ALL_THEME_SLUGS)).toBe(true)
      expect(ALL_THEME_SLUGS.length).toBeGreaterThanOrEqual(10)
    })

    it('contains all major cultural and modern wedding intent clusters', () => {
      const requiredClusters = [
        'undangan-digital-adat-jawa',
        'undangan-digital-adat-sunda',
        'undangan-digital-adat-minang',
        'undangan-digital-adat-palembang',
        'undangan-digital-adat-betawi',
        'undangan-digital-adat-bali',
        'undangan-digital-adat-batak',
        'undangan-digital-islami',
        'undangan-digital-modern-minimalis',
        'undangan-digital-quiet-luxury',
      ]

      for (const slug of requiredClusters) {
        expect(ALL_THEME_SLUGS).toContain(slug)
        expect(THEME_SEO_DATA[slug]).toBeDefined()
      }
    })

    it('getAllThemes returns an array matching all slugs', () => {
      const all = getAllThemes()
      expect(all.length).toBe(ALL_THEME_SLUGS.length)
      expect(all.map((t) => t.slug)).toEqual(ALL_THEME_SLUGS)
    })
  })

  describe('Theme SEO Metadata Completeness', () => {
    it('verifies all active theme slugs have title, meta description, keywords, and FAQs defined', () => {
      for (const slug of ALL_THEME_SLUGS) {
        const theme = THEME_SEO_DATA[slug]
        expect(theme, `Theme entry for slug "${slug}" should exist`).toBeDefined()

        // 1. Title verification (both title and metaTitle should be defined and non-empty)
        const title = theme.title || theme.metaTitle
        expect(title, `Theme "${slug}" must have title or metaTitle`).toBeTruthy()
        expect(typeof title).toBe('string')
        expect(title.trim().length).toBeGreaterThan(10)

        // 2. Meta Description verification
        const desc = theme.metaDescription || theme.description
        expect(desc, `Theme "${slug}" must have metaDescription or description`).toBeTruthy()
        expect(typeof desc).toBe('string')
        expect(desc.trim().length).toBeGreaterThan(20)

        // 3. Keywords verification
        expect(Array.isArray(theme.keywords), `Theme "${slug}" keywords must be an array`).toBe(true)
        expect(theme.keywords.length, `Theme "${slug}" must have at least 1 keyword`).toBeGreaterThan(0)
        for (const kw of theme.keywords) {
          expect(typeof kw).toBe('string')
          expect(kw.trim().length).toBeGreaterThan(0)
        }

        // 4. FAQs verification
        expect(Array.isArray(theme.faqs), `Theme "${slug}" faqs must be an array`).toBe(true)
        expect(theme.faqs.length, `Theme "${slug}" must have at least 1 FAQ item`).toBeGreaterThan(0)
        for (const faq of theme.faqs) {
          const q = faq.question || faq.q
          const a = faq.answer || faq.a
          expect(q, `FAQ in theme "${slug}" must have question`).toBeTruthy()
          expect(a, `FAQ in theme "${slug}" must have answer`).toBeTruthy()
          expect(typeof q).toBe('string')
          expect(typeof a).toBe('string')
        }
      }
    })

    it('verifies headline (h1) and hero subtitle are defined for high-intent conversions', () => {
      for (const slug of ALL_THEME_SLUGS) {
        const theme = THEME_SEO_DATA[slug]
        expect(theme.h1).toBeTruthy()
        expect(theme.heroSubtitle).toBeTruthy()
        expect(theme.badge).toBeTruthy()
      }
    })
  })

  describe('Template Filter Mapping', () => {
    it('verifies template filter mapping returns non-empty matching templates for every theme', () => {
      for (const slug of ALL_THEME_SLUGS) {
        const matchingSlugs = getMatchingTemplatesForTheme(slug)
        expect(
          Array.isArray(matchingSlugs),
          `Matching templates for "${slug}" must be an array`,
        ).toBe(true)
        expect(
          matchingSlugs.length,
          `Matching templates for "${slug}" must not be empty`,
        ).toBeGreaterThan(0)

        // Each matched template slug must be a valid non-empty string
        for (const templateSlug of matchingSlugs) {
          expect(typeof templateSlug).toBe('string')
          expect(templateSlug.trim().length).toBeGreaterThan(0)
        }
      }
    })

    it('filters an existing collection of template objects against theme curated list', () => {
      const mockTemplates = [
        { name: 'Jawa Truntum', slug: 'jawa-truntum' },
        { name: 'Minang Suntiang Emas', slug: 'minang-suntiang-emas' },
        { name: 'Random Other Template', slug: 'random-other-template' },
        { name: 'Dark Elegant', slug: 'dark-elegant' },
      ]

      // For Adat Jawa (curated contains 'jawa-truntum' and 'dark-elegant')
      const jawaMatches = getMatchingTemplatesForTheme('undangan-digital-adat-jawa', mockTemplates)
      expect(jawaMatches.map((t) => t.slug)).toContain('jawa-truntum')
      expect(jawaMatches.map((t) => t.slug)).not.toContain('random-other-template')

      // For Adat Minang (curated contains 'minang-suntiang-emas')
      const minangMatches = getMatchingTemplatesForTheme('undangan-digital-adat-minang', mockTemplates)
      expect(minangMatches.map((t) => t.slug)).toContain('minang-suntiang-emas')
      expect(minangMatches.map((t) => t.slug)).not.toContain('jawa-truntum')
    })

    it('returns empty array when theme slug is unknown or not found', () => {
      expect(getMatchingTemplatesForTheme('non-existent-theme')).toEqual([])
      expect(getMatchingTemplatesForTheme(null)).toEqual([])
      expect(getMatchingTemplatesForTheme('')).toEqual([])
    })
  })

  describe('Theme Lookup & SEO Resolution Helper (resolveThemeSeo)', () => {
    it('resolves correct theme by slug (case-insensitive and trimmed)', () => {
      const theme = getThemeBySlug('  UNDANGAN-DIGITAL-ADAT-JAWA  ')
      expect(theme).not.toBeNull()
      expect(theme.slug).toBe('undangan-digital-adat-jawa')
      expect(theme.name).toBe('Adat Jawa')

      expect(getThemeBySlug('non-existent')).toBeNull()
      expect(getThemeBySlug(null)).toBeNull()
    })

    it('resolves full SEO metadata shape for canonical path /tema/:slug', () => {
      const seo = resolveThemeSeo('/tema/undangan-digital-adat-jawa')
      expect(seo).not.toBeNull()
      expect(seo.title).toContain('Adat Jawa')
      expect(seo.description).toContain('Jawa')
      expect(seo.canonical).toBe('https://www.satuundangan.id/tema/undangan-digital-adat-jawa')
      expect(seo.ogImage).toBeTruthy()
      expect(seo.ogType).toBe('website')
      expect(seo.url).toBe('https://www.satuundangan.id/tema/undangan-digital-adat-jawa')
    })

    it('returns null for non-matching or invalid paths', () => {
      expect(resolveThemeSeo('/tema')).toBeNull()
      expect(resolveThemeSeo('/tema/')).toBeNull()
      expect(resolveThemeSeo('/blog/article-slug')).toBeNull()
      expect(resolveThemeSeo('/tema/unknown-theme-slug-xyz')).toBeNull()
      expect(resolveThemeSeo(null)).toBeNull()
    })
  })
})
