import { describe, it, expect } from 'vitest'
import {
  DINO_DATA,
  DINO_MAP,
  PASARAN_DATA,
  PASARAN_MAP,
  MODULO_8_NAMES,
  PRIMBON_CATEGORIES,
  calculateWetonNeptu,
  getModulo8Category,
  calculateWetonFromDate,
  calculateWetonPair,
  computeHash,
  calculateLoveScore,
  ZODIAC_SIGNS,
  getZodiacFromDate,
  getZodiacById,
  calculateZodiacPair,
} from './loveCalculator.js'

describe('Love & Weton Calculator Utility (loveCalculator.js)', () => {
  describe('Weton Neptu Calculation Logic (Day + Pasaran Math)', () => {
    it('verifies standard neptu values for all 7 days (Saptawara)', () => {
      expect(DINO_MAP['minggu']).toBe(5)
      expect(DINO_MAP['sunday']).toBe(5)
      expect(DINO_MAP['senin']).toBe(4)
      expect(DINO_MAP['monday']).toBe(4)
      expect(DINO_MAP['selasa']).toBe(3)
      expect(DINO_MAP['tuesday']).toBe(3)
      expect(DINO_MAP['rabu']).toBe(7)
      expect(DINO_MAP['wednesday']).toBe(7)
      expect(DINO_MAP['kamis']).toBe(8)
      expect(DINO_MAP['thursday']).toBe(8)
      expect(DINO_MAP['jumat']).toBe(6)
      expect(DINO_MAP['friday']).toBe(6)
      expect(DINO_MAP['sabtu']).toBe(9)
      expect(DINO_MAP['saturday']).toBe(9)
    })

    it('verifies standard neptu values for all 5 pasarans (Pancawara)', () => {
      expect(PASARAN_MAP['legi']).toBe(5)
      expect(PASARAN_MAP['pahing']).toBe(9)
      expect(PASARAN_MAP['pon']).toBe(7)
      expect(PASARAN_MAP['wage']).toBe(4)
      expect(PASARAN_MAP['kliwon']).toBe(8)
    })

    it('correctly calculates Day + Pasaran math (Sunday + Legi -> 5 + 5 = 10)', () => {
      // Minggu / Sunday = 5, Legi = 5 -> 10
      expect(calculateWetonNeptu('Minggu', 'Legi')).toBe(10)
      expect(calculateWetonNeptu('Sunday', 'Legi')).toBe(10)
    })

    it('correctly calculates other canonical weton combinations', () => {
      // Senin (4) + Pahing (9) = 13
      expect(calculateWetonNeptu('Senin', 'Pahing')).toBe(13)
      expect(calculateWetonNeptu('Monday', 'Pahing')).toBe(13)

      // Jumat (6) + Kliwon (8) = 14
      expect(calculateWetonNeptu('Jumat', 'Kliwon')).toBe(14)
      expect(calculateWetonNeptu('Friday', 'Kliwon')).toBe(14)

      // Selasa (3) + Wage (4) = 7
      expect(calculateWetonNeptu('Selasa', 'Wage')).toBe(7)

      // Rabu (7) + Pon (7) = 14
      expect(calculateWetonNeptu('Rabu', 'Pon')).toBe(14)

      // Kamis (8) + Kliwon (8) = 16
      expect(calculateWetonNeptu('Kamis', 'Kliwon')).toBe(16)

      // Sabtu (9) + Pahing (9) = 18 (highest possible single weton)
      expect(calculateWetonNeptu('Sabtu', 'Pahing')).toBe(18)

      // Selasa (3) + Wage (4) = 7 (lowest possible single weton)
      expect(calculateWetonNeptu('Selasa', 'Wage')).toBe(7)
    })

    it('handles casing and trimmed whitespace gracefully', () => {
      expect(calculateWetonNeptu('  minggu  ', '  LEGI  ')).toBe(10)
      expect(calculateWetonNeptu('JUMAT', 'kliwon')).toBe(14)
    })

    it('throws error on invalid day or pasaran names', () => {
      expect(() => calculateWetonNeptu('InvalidDay', 'Legi')).toThrowError(/Invalid Day/)
      expect(() => calculateWetonNeptu('Minggu', 'InvalidPasaran')).toThrowError(/Invalid Day/)
    })
  })

  describe('Modulo 8 Primbon Categorization Logic', () => {
    it('accurately maps all 8 categories (1..7 and 0/8)', () => {
      expect(MODULO_8_NAMES[1]).toBe('Pegat')
      expect(MODULO_8_NAMES[2]).toBe('Ratu')
      expect(MODULO_8_NAMES[3]).toBe('Jodoh')
      expect(MODULO_8_NAMES[4]).toBe('Topo')
      expect(MODULO_8_NAMES[5]).toBe('Tinari')
      expect(MODULO_8_NAMES[6]).toBe('Padu')
      expect(MODULO_8_NAMES[7]).toBe('Sujanan')
      expect(MODULO_8_NAMES[0]).toBe('Pesthi')
      expect(MODULO_8_NAMES[8]).toBe('Pesthi')
    })

    it('categorizes modulo 8 for each remainder 1..7 and 0', () => {
      // 1: Pegat (e.g. 25 % 8 = 1, 9 % 8 = 1, 17 % 8 = 1)
      expect(getModulo8Category(25).name).toBe('Pegat')
      expect(getModulo8Category(25).remainder).toBe(1)
      expect(getModulo8Category(9).name).toBe('Pegat')

      // 2: Ratu (e.g. 26 % 8 = 2, 18 % 8 = 2)
      expect(getModulo8Category(26).name).toBe('Ratu')
      expect(getModulo8Category(26).remainder).toBe(2)

      // 3: Jodoh (e.g. 27 % 8 = 3, 19 % 8 = 3, 35 % 8 = 3)
      expect(getModulo8Category(27).name).toBe('Jodoh')
      expect(getModulo8Category(27).remainder).toBe(3)

      // 4: Topo (e.g. 28 % 8 = 4, 20 % 8 = 4)
      expect(getModulo8Category(28).name).toBe('Topo')
      expect(getModulo8Category(28).remainder).toBe(4)

      // 5: Tinari (e.g. 29 % 8 = 5, 21 % 8 = 5)
      expect(getModulo8Category(29).name).toBe('Tinari')
      expect(getModulo8Category(29).remainder).toBe(5)

      // 6: Padu (e.g. 30 % 8 = 6, 22 % 8 = 6)
      expect(getModulo8Category(30).name).toBe('Padu')
      expect(getModulo8Category(30).remainder).toBe(6)

      // 7: Sujanan (e.g. 31 % 8 = 7, 23 % 8 = 7)
      expect(getModulo8Category(31).name).toBe('Sujanan')
      expect(getModulo8Category(31).remainder).toBe(7)

      // 0: Pesthi (e.g. 24 % 8 = 0, 32 % 8 = 0, 16 % 8 = 0)
      expect(getModulo8Category(24).name).toBe('Pesthi')
      expect(getModulo8Category(24).remainder).toBe(0)
      expect(getModulo8Category(32).name).toBe('Pesthi')
      expect(getModulo8Category(32).remainder).toBe(0)
    })

    it('provides rich modern wisdom and positive narrative for all categories', () => {
      for (let r = 1; r <= 8; r++) {
        const cat = PRIMBON_CATEGORIES[r]
        expect(cat).toBeDefined()
        expect(cat.name).toBeTruthy()
        expect(cat.title).toBeTruthy()
        expect(cat.traditionalMeaning).toBeTruthy()
        expect(cat.modernWisdom).toBeTruthy()
        expect(cat.keyTakeaway).toBeTruthy()
        expect(cat.score).toBeGreaterThanOrEqual(70)
        expect(cat.score).toBeLessThanOrEqual(100)
      }
      // Remainder 0 should alias to Pesthi (category 8)
      expect(PRIMBON_CATEGORIES[0]).toEqual(PRIMBON_CATEGORIES[8])
    })

    it('correctly calculates real couple weton combinations', () => {
      // Couple A: Groom is Senin Pahing (13), Bride is Jumat Kliwon (14)
      // Total = 13 + 14 = 27
      // 27 % 8 = 3 -> Jodoh
      const coupleA = getModulo8Category(13 + 14)
      expect(coupleA.remainder).toBe(3)
      expect(coupleA.name).toBe('Jodoh')

      // Couple B: Groom is Minggu Pon (12), Bride is Selasa Wage (7)
      // Total = 12 + 7 = 19
      // 19 % 8 = 3 -> Jodoh
      const coupleB = getModulo8Category(12 + 7)
      expect(coupleB.remainder).toBe(3)
      expect(coupleB.name).toBe('Jodoh')

      // Couple C: Groom is Sabtu Pon (16), Bride is Sabtu Pon (16)
      // Total = 16 + 16 = 32
      // 32 % 8 = 0 -> Pesthi
      const coupleC = getModulo8Category(16 + 16)
      expect(coupleC.remainder).toBe(0)
      expect(coupleC.name).toBe('Pesthi')
    })
  })

  describe('Gregorian Date to Javanese Weton Conversion', () => {
    it('correctly resolves anchor date 2024-01-01 as Senin Pahing', () => {
      const weton = calculateWetonFromDate('2024-01-01')
      expect(weton).not.toBeNull()
      expect(weton.dino.name).toBe('Senin')
      expect(weton.pasaran.name).toBe('Pahing')
      expect(weton.wetonName).toBe('Senin Pahing')
      expect(weton.neptu).toBe(13) // 4 + 9
    })

    it('correctly resolves consecutive dates from anchor', () => {
      // 2024-01-02 -> Selasa Pon (3 + 7 = 10)
      const d2 = calculateWetonFromDate('2024-01-02')
      expect(d2.wetonName).toBe('Selasa Pon')
      expect(d2.neptu).toBe(10)

      // 2024-01-03 -> Rabu Wage (7 + 4 = 11)
      const d3 = calculateWetonFromDate('2024-01-03')
      expect(d3.wetonName).toBe('Rabu Wage')
      expect(d3.neptu).toBe(11)

      // 2024-01-04 -> Kamis Kliwon (8 + 8 = 16)
      const d4 = calculateWetonFromDate('2024-01-04')
      expect(d4.wetonName).toBe('Kamis Kliwon')
      expect(d4.neptu).toBe(16)

      // 2024-01-05 -> Jumat Legi (6 + 5 = 11)
      const d5 = calculateWetonFromDate('2024-01-05')
      expect(d5.wetonName).toBe('Jumat Legi')
      expect(d5.neptu).toBe(11)

      // 2024-01-06 -> Sabtu Pahing (9 + 9 = 18)
      const d6 = calculateWetonFromDate('2024-01-06')
      expect(d6.wetonName).toBe('Sabtu Pahing')
      expect(d6.neptu).toBe(18)
    })

    it('correctly resolves dates before anchor (e.g. 2023-12-31 as Minggu Legi)', () => {
      const dPrev = calculateWetonFromDate('2023-12-31')
      expect(dPrev.wetonName).toBe('Minggu Legi')
      expect(dPrev.neptu).toBe(10) // 5 + 5
    })

    it('handles null, undefined, or invalid date string inputs gracefully', () => {
      expect(calculateWetonFromDate(null)).toBeNull()
      expect(calculateWetonFromDate('')).toBeNull()
      expect(calculateWetonFromDate('invalid-date')).toBeNull()
    })

    it('calculates full pair calculation via calculateWetonPair', () => {
      const result = calculateWetonPair('2024-01-01', '2024-01-02', 'Budi', 'Ani')
      expect(result).not.toBeNull()
      expect(result.groomName).toBe('Budi')
      expect(result.brideName).toBe('Ani')
      expect(result.groom.wetonName).toBe('Senin Pahing')
      expect(result.bride.wetonName).toBe('Selasa Pon')
      expect(result.totalNeptu).toBe(23) // 13 + 10 = 23
      expect(result.remainder).toBe(7) // 23 % 8 = 7 -> Sujanan
      expect(result.categoryName).toBe('Sujanan')
    })
  })

  describe('Deterministic Name Match Chemistry Calculation', () => {
    it('produces consistent deterministic score for the exact same pair', () => {
      const score1 = calculateLoveScore('Rian Aditya', 'Citra Lestari')
      const score2 = calculateLoveScore('Rian Aditya', 'Citra Lestari')
      const score3 = calculateLoveScore('Rian Aditya', 'Citra Lestari')

      expect(score1.score).toBe(score2.score)
      expect(score2.score).toBe(score3.score)
      expect(score1.title).toBe(score2.title)
      expect(score1.subScores).toEqual(score2.subScores)
    })

    it('is symmetric: order of names does not alter the score', () => {
      const forward = calculateLoveScore('Ardi Setiawan', 'Nadia Putri')
      const reverse = calculateLoveScore('Nadia Putri', 'Ardi Setiawan')

      expect(forward.score).toBe(reverse.score)
      expect(forward.title).toBe(reverse.title)
      expect(forward.subScores).toEqual(reverse.subScores)
    })

    it('is case-insensitive and trims extraneous whitespaces', () => {
      const normal = calculateLoveScore('Romeo', 'Juliet')
      const upper = calculateLoveScore('  ROMEO  ', '   juliet   ')
      const mixed = calculateLoveScore('RoMeO', 'JuLiEt')

      expect(normal.score).toBe(upper.score)
      expect(normal.score).toBe(mixed.score)
    })

    it('strictly satisfies score bounds between 1% and 100%', () => {
      const testPairs = [
        ['Andi', 'Budi'],
        ['Ahmad', 'Fatimah'],
        ['Dian', 'Eko'],
        ['Gita', 'Hadi'],
        ['Indra', 'Joko'],
        ['Kartika', 'Lukman'],
        ['Mega', 'Nanda'],
        ['Oscar', 'Putri'],
        ['Qori', 'Rizky'],
        ['Siti', 'Taufik'],
        ['Umar', 'Vina'],
        ['Wahyu', 'Xenia'],
        ['Yoga', 'Zahra'],
      ]

      for (const [p1, p2] of testPairs) {
        const result = calculateLoveScore(p1, p2)
        expect(result.score).toBeGreaterThanOrEqual(1)
        expect(result.score).toBeLessThanOrEqual(100)
        expect(result.subScores.comm).toBeGreaterThanOrEqual(1)
        expect(result.subScores.comm).toBeLessThanOrEqual(100)
        expect(result.subScores.romance).toBeGreaterThanOrEqual(1)
        expect(result.subScores.romance).toBeLessThanOrEqual(100)
        expect(result.subScores.teamwork).toBeGreaterThanOrEqual(1)
        expect(result.subScores.teamwork).toBeLessThanOrEqual(100)
        expect(result.title).toBeTruthy()
        expect(result.tagline).toBeTruthy()
      }
    })

    it('returns score 0 and safe fallbacks for empty inputs', () => {
      expect(calculateLoveScore('', '').score).toBe(0)
      expect(calculateLoveScore('Budi', '').score).toBe(0)
      expect(calculateLoveScore('', 'Ani').score).toBe(0)
      expect(calculateLoveScore(null, undefined).score).toBe(0)
    })

    it('generates polynomial hash deterministically', () => {
      const hash1 = computeHash('satuundangan')
      const hash2 = computeHash('satuundangan')
      expect(hash1).toBe(hash2)
      expect(typeof hash1).toBe('number')
      expect(hash1).toBeGreaterThan(0)
    })
  })

  describe('Zodiac & Astrology Compatibility Logic', () => {
    it('accurately identifies zodiac signs from dates', () => {
      // Aries (21 Mar - 19 Apr)
      expect(getZodiacFromDate('1998-03-25').name).toBe('Aries')
      expect(getZodiacFromDate('1998-04-10').name).toBe('Aries')

      // Taurus (20 Apr - 20 Mei)
      expect(getZodiacFromDate('1995-05-05').name).toBe('Taurus')

      // Leo (23 Jul - 22 Agu)
      expect(getZodiacFromDate('1996-08-15').name).toBe('Leo')

      // Scorpio (23 Okt - 21 Nov)
      expect(getZodiacFromDate('1997-11-05').name).toBe('Scorpio')

      // Capricorn (22 Des - 19 Jan)
      expect(getZodiacFromDate('1999-12-25').name).toBe('Capricorn')
      expect(getZodiacFromDate('2000-01-10').name).toBe('Capricorn')

      // Pisces (19 Feb - 20 Mar)
      expect(getZodiacFromDate('2001-03-05').name).toBe('Pisces')
    })

    it('calculates zodiac compatibility between elements', () => {
      // Aries (Api) + Gemini (Udara)
      const res1 = calculateZodiacPair('aries', 'gemini', 'Rian', 'Sarah')
      expect(res1.score).toBeGreaterThanOrEqual(90)
      expect(res1.elementTitle).toContain('Api & Udara')
      expect(res1.zodiac1.name).toBe('Aries')
      expect(res1.zodiac2.name).toBe('Gemini')

      // Taurus (Tanah) + Cancer (Air)
      const res2 = calculateZodiacPair('taurus', 'cancer')
      expect(res2.score).toBeGreaterThanOrEqual(90)
      expect(res2.elementTitle).toContain('Tanah & Air')

      // Same Element: Leo (Api) + Aries (Api)
      const res3 = calculateZodiacPair('leo', 'aries')
      expect(res3.score).toBeGreaterThanOrEqual(90)
      expect(res3.elementTitle).toContain('Harmoni Satu Elemen')
    })
  })
})

