import { describe, it, expect } from 'vitest'
import {
  ALL_ID,
  MIN_GROUP_SIZE,
  buildStyleFilters,
  buildPackageFilters,
  filterTemplates,
  resolveFilterId,
} from './templateFilters'

// Golden fixture — mirrors the 16 real dev templates (name/slug/filterGroup from
// the curated map). NOTE: Retro Nostalgia's category is Exclusive here (not
// Premium) so the package tier counts land on the intended Basic 2 / Premium 8 /
// Exclusive 6 split used throughout this spec; verify the real category against
// the dev DB in Task 4 before writing the SQL.
const FIXTURE = [
  { name: 'Azure Shores', slug: 'azure-shores', category: 'Exclusive', filterGroup: 'Romantis & Dreamy' },
  { name: 'Botanical Watercolor', slug: 'botanical-watercolor', category: 'Premium', filterGroup: 'Romantis & Dreamy' },
  { name: 'Celestial Sparkle', slug: 'celestial-sparkle', category: 'Exclusive', filterGroup: 'Romantis & Dreamy' },
  { name: 'Cyberpunk Neon', slug: 'cyberpunk-neon', category: 'Exclusive', filterGroup: 'Bold & Unik' },
  { name: 'Dark Elegant', slug: 'dark-elegant', category: 'Basic', filterGroup: 'Elegan & Mewah' },
  { name: 'Kimi no Na wa', slug: 'kimi-no-na-wa', category: 'Premium', filterGroup: 'Anime & Pop Culture' },
  { name: 'Light Modern', slug: 'light-modern', category: 'Basic', filterGroup: 'Minimalis & Modern' },
  { name: 'Minimalist Sand & Terra', slug: 'minimalist-sand-terra', category: 'Premium', filterGroup: 'Minimalis & Modern' },
  { name: 'Modern Noir', slug: 'modern-noir', category: 'Exclusive', filterGroup: 'Bold & Unik' },
  { name: 'Naruto', slug: 'naruto', category: 'Premium', filterGroup: 'Anime & Pop Culture' },
  { name: 'One Piece', slug: 'one-piece', category: 'Premium', filterGroup: 'Anime & Pop Culture' },
  { name: 'Retro Nostalgia', slug: 'retro-nostalgia', category: 'Exclusive', filterGroup: 'Bold & Unik' },
  { name: 'Royal Emerald', slug: 'royal-emerald', category: 'Premium', filterGroup: 'Elegan & Mewah' },
  { name: 'Royal Gold Heritage', slug: 'royal-gold-heritage', category: 'Premium', filterGroup: 'Elegan & Mewah' },
  { name: 'Sakura Blossom', slug: 'sakura-blossom', category: 'Premium', filterGroup: 'Romantis & Dreamy' },
  { name: 'The Editorial Story', slug: 'the-editorial-story', category: 'Exclusive', filterGroup: 'Elegan & Mewah' },
]

describe('templateFilters', () => {
  describe('buildStyleFilters', () => {
    it('returns only the "Semua" entry for an empty list', () => {
      expect(buildStyleFilters([])).toEqual([
        { id: ALL_ID, name: 'Semua', count: 0, label: 'Semua (0)' },
      ])
    })

    it('guards against null/undefined templates', () => {
      expect(buildStyleFilters(null)).toEqual([
        { id: ALL_ID, name: 'Semua', count: 0, label: 'Semua (0)' },
      ])
      expect(buildStyleFilters(undefined)).toEqual([
        { id: ALL_ID, name: 'Semua', count: 0, label: 'Semua (0)' },
      ])
    })

    it('produces exactly 5 chips for the golden 16-template fixture', () => {
      const result = buildStyleFilters(FIXTURE)
      expect(result.map((c) => c.id)).toEqual([
        ALL_ID,
        'Elegan & Mewah',
        'Romantis & Dreamy',
        'Anime & Pop Culture',
        'Bold & Unik',
      ])
    })

    it('computes correct counts', () => {
      const result = buildStyleFilters(FIXTURE)
      const byId = Object.fromEntries(result.map((c) => [c.id, c.count]))
      expect(byId[ALL_ID]).toBe(16)
      expect(byId['Elegan & Mewah']).toBe(4)
      expect(byId['Romantis & Dreamy']).toBe(4)
      expect(byId['Anime & Pop Culture']).toBe(3)
      expect(byId['Bold & Unik']).toBe(3)
    })

    it('sets label to `${name} (${count})` for every entry, including Semua', () => {
      const result = buildStyleFilters(FIXTURE)
      for (const entry of result) {
        expect(entry.label).toBe(`${entry.name} (${entry.count})`)
      }
    })

    it('excludes groups below MIN_GROUP_SIZE from chips, but still counts them in Semua', () => {
      const result = buildStyleFilters(FIXTURE)
      const ids = result.map((c) => c.id)
      expect(ids).not.toContain('Minimalis & Modern')
      const all = result.find((c) => c.id === ALL_ID)
      expect(all.count).toBe(16)
      const chipTotal = result
        .filter((c) => c.id !== ALL_ID)
        .reduce((sum, c) => sum + c.count, 0)
      expect(chipTotal).toBe(14)
    })

    it('excludes templates with null/undefined/empty filterGroup and still counts them in Semua', () => {
      const fixture = [
        { name: 'A', slug: 'a', category: 'Basic', filterGroup: 'Group X' },
        { name: 'B', slug: 'b', category: 'Basic', filterGroup: 'Group X' },
        { name: 'C', slug: 'c', category: 'Basic', filterGroup: 'Group X' },
        { name: 'D', slug: 'd', category: 'Basic', filterGroup: null },
        { name: 'E', slug: 'e', category: 'Basic', filterGroup: undefined },
        { name: 'F', slug: 'f', category: 'Basic', filterGroup: '' },
      ]
      const result = buildStyleFilters(fixture, MIN_GROUP_SIZE)
      expect(result).toEqual([
        { id: ALL_ID, name: 'Semua', count: 6, label: 'Semua (6)' },
        { id: 'Group X', name: 'Group X', count: 3, label: 'Group X (3)' },
      ])
    })

    it('orders by count descending, then name ascending on ties', () => {
      const result = buildStyleFilters(FIXTURE)
      const chipIds = result.filter((c) => c.id !== ALL_ID).map((c) => c.id)
      // Two ties: Elegan & Mewah / Romantis & Dreamy at 4, Anime & Pop Culture /
      // Bold & Unik at 3 — both broken alphabetically
      expect(chipIds).toEqual([
        'Elegan & Mewah',
        'Romantis & Dreamy',
        'Anime & Pop Culture',
        'Bold & Unik',
      ])
      expect('Elegan & Mewah'.localeCompare('Romantis & Dreamy', 'id')).toBeLessThan(0)
      expect('Anime & Pop Culture'.localeCompare('Bold & Unik', 'id')).toBeLessThan(0)
    })
  })

  describe('buildPackageFilters', () => {
    it('returns Semua Paket + tiers in fixed order (not alphabetical) with correct counts', () => {
      const result = buildPackageFilters(FIXTURE)
      expect(result.map((c) => c.id)).toEqual([ALL_ID, 'Basic', 'Premium', 'Exclusive'])
      const byId = Object.fromEntries(result.map((c) => [c.id, c.count]))
      expect(byId[ALL_ID]).toBe(16)
      expect(byId.Basic).toBe(2)
      expect(byId.Premium).toBe(8)
      expect(byId.Exclusive).toBe(6)
      const all = result.find((c) => c.id === ALL_ID)
      expect(all.label).toBe('Semua Paket (16)')
    })

    it('sorts unknown tier values after known ones, alphabetically', () => {
      const fixture = [
        { name: 'P1', slug: 'p1', category: 'Premium', filterGroup: null },
        { name: 'B1', slug: 'b1', category: 'Basic', filterGroup: null },
        { name: 'E1', slug: 'e1', category: 'Exclusive', filterGroup: null },
        { name: 'Z1', slug: 'z1', category: 'Zeta', filterGroup: null },
        { name: 'A1', slug: 'a1', category: 'Alpha', filterGroup: null },
      ]
      const result = buildPackageFilters(fixture)
      expect(result.map((c) => c.id)).toEqual([ALL_ID, 'Basic', 'Premium', 'Exclusive', 'Alpha', 'Zeta'])
    })

    it('has no minimum threshold, unlike buildStyleFilters', () => {
      const fixture = [{ name: 'Solo', slug: 'solo', category: 'Basic', filterGroup: null }]
      const result = buildPackageFilters(fixture)
      expect(result.map((c) => c.id)).toEqual([ALL_ID, 'Basic'])
    })
  })

  describe('filterTemplates', () => {
    it('returns all templates when both filters are "all"', () => {
      expect(filterTemplates(FIXTURE, 'all', 'all')).toHaveLength(16)
    })

    it('filters by style only', () => {
      expect(filterTemplates(FIXTURE, 'Anime & Pop Culture', 'all')).toHaveLength(3)
    })

    it('filters by package only', () => {
      expect(filterTemplates(FIXTURE, 'all', 'Premium')).toHaveLength(8)
    })

    it('applies AND semantics across style + package', () => {
      const result = filterTemplates(FIXTURE, 'Anime & Pop Culture', 'Premium')
      expect(result).toHaveLength(3)
      expect(result.map((t) => t.slug).sort()).toEqual(
        ['kimi-no-na-wa', 'naruto', 'one-piece'].sort(),
      )
    })

    it('proves AND (not OR) semantics with a narrowing combination', () => {
      const result = filterTemplates(FIXTURE, 'Elegan & Mewah', 'Basic')
      expect(result).toHaveLength(1)
      expect(result[0].slug).toBe('dark-elegant')
    })

    it('matches case-insensitively and trims whitespace on both sides', () => {
      const result = filterTemplates(FIXTURE, ' anime & pop culture ', 'PREMIUM')
      expect(result).toHaveLength(3)
    })

    it('guards against null/undefined templates', () => {
      expect(filterTemplates(null, 'all', 'all')).toEqual([])
      expect(filterTemplates(undefined, 'all', 'all')).toEqual([])
    })
  })

  describe('resolveFilterId', () => {
    it('returns the matching option id', () => {
      const options = buildStyleFilters(FIXTURE)
      expect(resolveFilterId('Bold & Unik', options)).toBe('Bold & Unik')
    })

    it('falls back to "all" for a stale/below-threshold value', () => {
      const options = buildStyleFilters(FIXTURE)
      expect(resolveFilterId('Minimalis & Modern', options)).toBe(ALL_ID)
    })

    it('falls back to "all" for undefined or empty candidate', () => {
      const options = buildStyleFilters(FIXTURE)
      expect(resolveFilterId(undefined, options)).toBe(ALL_ID)
      expect(resolveFilterId('', options)).toBe(ALL_ID)
    })

    it('matches case-insensitively and trims whitespace', () => {
      const options = buildStyleFilters(FIXTURE)
      expect(resolveFilterId('  bold & unik  ', options)).toBe('Bold & Unik')
    })
  })
})
