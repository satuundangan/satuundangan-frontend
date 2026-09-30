import { describe, it, expect } from 'vitest'
import {
  DEFAULT_WPM,
  stripHtml,
  countWords,
  calculateReadingTime,
  formatReadingTime,
  getReadingTimeStats,
  parseTableOfContents,
  extractHeadings,
  filterArticles,
  searchAndFilterArticles,
  getArticleCover,
} from './blogUtils'

describe('blogUtils', () => {
  // ==========================================
  // 1. Reading Time Estimation Helper
  // ==========================================
  describe('Reading Time Estimation', () => {
    const generateWords = (count) => Array.from({ length: count }, (_, i) => `word${i + 1}`).join(' ')

    describe('calculateReadingTime', () => {
      it('calculates reading time based on default 200 WPM formula', () => {
        // 100 words -> Math.ceil(100 / 200) = 1 min
        expect(calculateReadingTime(generateWords(100))).toBe(1)

        // Exactly 200 words -> Math.ceil(200 / 200) = 1 min
        expect(calculateReadingTime(generateWords(200))).toBe(1)

        // 201 words -> Math.ceil(201 / 200) = 2 min
        expect(calculateReadingTime(generateWords(201))).toBe(2)

        // 400 words -> 2 min
        expect(calculateReadingTime(generateWords(400))).toBe(2)

        // 401 words -> 3 min
        expect(calculateReadingTime(generateWords(401))).toBe(3)

        // 1000 words -> 5 min
        expect(calculateReadingTime(generateWords(1000))).toBe(5)
      })

      it('supports custom wordsPerMinute parameter', () => {
        const words = generateWords(300)
        // 300 words @ 100 wpm = 3 min
        expect(calculateReadingTime(words, 100)).toBe(3)
        // 300 words @ 300 wpm = 1 min
        expect(calculateReadingTime(words, 300)).toBe(1)
        // 300 words @ 600 wpm = 1 min
        expect(calculateReadingTime(words, 600)).toBe(1)
      })

      it('strips HTML tags and script/style contents before counting words', () => {
        const html = `
          <article>
            <style>body { color: red; }</style>
            <h1>Judul Artikel</h1>
            <p>Ini adalah paragraf pertama dengan <strong>teks tebal</strong> dan <em>miring</em>.</p>
            <script>console.log("ignore me");</script>
          </article>
        `
        // Should only count: Judul, Artikel, Ini, adalah, paragraf, pertama, dengan, teks, tebal, dan, miring. (11 words)
        const count = countWords(html)
        expect(count).toBe(11)
        expect(calculateReadingTime(html)).toBe(1)
      })

      it('handles empty string, whitespace, null, and undefined gracefully without crashing', () => {
        expect(calculateReadingTime('')).toBe(0)
        expect(calculateReadingTime('   \n\t  ')).toBe(0)
        expect(calculateReadingTime(null)).toBe(0)
        expect(calculateReadingTime(undefined)).toBe(0)
      })

      it('handles invalid / non-string data types gracefully', () => {
        expect(calculateReadingTime(12345)).toBe(0)
        expect(calculateReadingTime(true)).toBe(0)
        expect(calculateReadingTime({})).toBe(0)
        expect(calculateReadingTime([])).toBe(0)
      })

      it('handles negative or invalid WPM values by falling back to DEFAULT_WPM', () => {
        const text = generateWords(300)
        expect(calculateReadingTime(text, -50)).toBe(Math.ceil(300 / DEFAULT_WPM))
        expect(calculateReadingTime(text, 0)).toBe(Math.ceil(300 / DEFAULT_WPM))
        expect(calculateReadingTime(text, 'invalid')).toBe(Math.ceil(300 / DEFAULT_WPM))
      })
    })

    describe('stripHtml & countWords', () => {
      it('decodes HTML entities and removes tags', () => {
        const html = '<p>Tips &amp; Trik &quot;Pernikahan&quot; &#39;Modern&#39; &lt;2026&gt; &nbsp;</p>'
        const clean = stripHtml(html)
        expect(clean).toBe('Tips & Trik "Pernikahan" \'Modern\' <2026>')
      })

      it('handles null and undefined safely in stripHtml and countWords', () => {
        expect(stripHtml(null)).toBe('')
        expect(stripHtml(undefined)).toBe('')
        expect(countWords(null)).toBe(0)
        expect(countWords(undefined)).toBe(0)
      })
    })

    describe('formatReadingTime & getReadingTimeStats', () => {
      it('formats reading time labels properly in Indonesian', () => {
        expect(formatReadingTime(0)).toBe('Kurang dari 1 menit baca')
        expect(formatReadingTime(1)).toBe('1 menit baca')
        expect(formatReadingTime(5)).toBe('5 menit baca')
      })

      it('returns comprehensive reading stats object', () => {
        const content = generateWords(250)
        const stats = getReadingTimeStats(content)
        expect(stats).toEqual({
          minutes: 2,
          words: 250,
          text: '2 menit baca',
        })
      })

      it('returns 0 stats for null content', () => {
        const stats = getReadingTimeStats(null)
        expect(stats).toEqual({
          minutes: 0,
          words: 0,
          text: 'Kurang dari 1 menit baca',
        })
      })
    })
  })

  // ==========================================
  // 2. Table of Contents Parser Helper
  // ==========================================
  describe('Table of Contents Parser', () => {
    it('extracts <h2> and <h3> tags correctly with tag, level, clean text, and slugs', () => {
      const html = `
        <h1>Judul Utama (Should be ignored)</h1>
        <p>Pengantar artikel...</p>
        <h2>Persiapan Awal Pernikahan</h2>
        <p>Penjelasan persiapan awal.</p>
        <h3>Menentukan Anggaran</h3>
        <p>Rincian anggaran.</p>
        <h3>Memilih Venue</h3>
        <p>Daftar venue rekomendasi.</p>
        <h4>Sub-detail venue (Should be ignored)</h4>
        <h2>Konsep & Tema Undangan Digital</h2>
        <p>Penutup artikel.</p>
      `

      const toc = parseTableOfContents(html)

      expect(toc).toHaveLength(4)
      expect(toc).toEqual([
        {
          id: 'persiapan-awal-pernikahan',
          slug: 'persiapan-awal-pernikahan',
          text: 'Persiapan Awal Pernikahan',
          level: 2,
          tag: 'h2',
        },
        {
          id: 'menentukan-anggaran',
          slug: 'menentukan-anggaran',
          text: 'Menentukan Anggaran',
          level: 3,
          tag: 'h3',
        },
        {
          id: 'memilih-venue',
          slug: 'memilih-venue',
          text: 'Memilih Venue',
          level: 3,
          tag: 'h3',
        },
        {
          id: 'konsep-and-tema-undangan-digital',
          slug: 'konsep-and-tema-undangan-digital',
          text: 'Konsep & Tema Undangan Digital',
          level: 2,
          tag: 'h2',
        },
      ])
    })

    it('extracts nested markup inside headings cleanly', () => {
      const html = `
        <h2>Tips <strong>Hemat</strong> &amp; <em>Elegan</em> untuk <code>Resepsi</code></h2>
      `
      const toc = parseTableOfContents(html)
      expect(toc).toHaveLength(1)
      expect(toc[0].text).toBe('Tips Hemat & Elegan untuk Resepsi')
      expect(toc[0].slug).toBe('tips-hemat-and-elegan-untuk-resepsi')
    })

    it('guarantees unique slug IDs when duplicate headings exist', () => {
      const html = `
        <h2>Rincian Acara</h2>
        <p>Akad...</p>
        <h2>Rincian Acara</h2>
        <p>Resepsi...</p>
        <h2>Rincian Acara</h2>
        <p>After party...</p>
      `
      const toc = parseTableOfContents(html)

      expect(toc).toHaveLength(3)
      expect(toc[0].slug).toBe('rincian-acara')
      expect(toc[1].slug).toBe('rincian-acara-1')
      expect(toc[2].slug).toBe('rincian-acara-2')
    })

    it('respects pre-existing id attributes on heading tags', () => {
      const html = `
        <h2 id="custom-rundown-id" class="heading-style">Rundown Acara</h2>
        <h3 id="custom-rundown-id">Rundown Acara (Duplicate ID)</h3>
      `
      const toc = parseTableOfContents(html)

      expect(toc).toHaveLength(2)
      expect(toc[0].slug).toBe('custom-rundown-id')
      expect(toc[0].id).toBe('custom-rundown-id')
      expect(toc[1].slug).toBe('custom-rundown-id-1')
    })

    it('handles articles with no headings without crashing and returns empty array', () => {
      const noHeadingsHtml = `
        <p>Hanya paragraf biasa tanpa heading 2 atau 3.</p>
        <div>Konten tambahan dalam container div.</div>
        <ul>
          <li>Poin 1</li>
          <li>Poin 2</li>
        </ul>
      `
      expect(parseTableOfContents(noHeadingsHtml)).toEqual([])
    })

    it('handles empty, null, or non-string inputs gracefully', () => {
      expect(parseTableOfContents('')).toEqual([])
      expect(parseTableOfContents('   ')).toEqual([])
      expect(parseTableOfContents(null)).toEqual([])
      expect(parseTableOfContents(undefined)).toEqual([])
      expect(parseTableOfContents(12345)).toEqual([])
      expect(parseTableOfContents({ html: '<h2>test</h2>' })).toEqual([])
    })

    it('skips empty heading tags with whitespace only', () => {
      const html = `
        <h2></h2>
        <h3>   </h3>
        <h2>Valid Heading</h2>
      `
      const toc = parseTableOfContents(html)
      expect(toc).toHaveLength(1)
      expect(toc[0].text).toBe('Valid Heading')
    })

    it('provides extractHeadings alias for backward compatibility', () => {
      expect(extractHeadings).toBe(parseTableOfContents)
    })
  })

  // ==========================================
  // 3. Search & Filter Logic
  // ==========================================
  describe('Search & Filter Logic', () => {
    const SAMPLE_ARTICLES = [
      {
        id: 1,
        title: '10 Tips Memilih Tema Undangan Pernikahan Mewah',
        slug: '10-tips-memilih-tema-undangan-mewah',
        excerpt: 'Panduan lengkap memilih gaya visual undangan digital yang elegan.',
        category: 'Tips & Panduan',
        status: 'published',
      },
      {
        id: 2,
        title: 'Tren Undangan Digital Modern 2026',
        slug: 'tren-undangan-digital-modern-2026',
        excerpt: 'Koleksi fitur terbaru: live streaming, QR check-in, dan e-wallet gift.',
        category: 'Inspirasi',
        status: 'published',
      },
      {
        id: 3,
        title: 'Cara Mengatur Anggaran Pernikahan Agar Tidak Boncos',
        slug: 'cara-mengatur-anggaran-pernikahan',
        excerpt: 'Strategi praktis alokasi dana resepsi, katering, dan undangan.',
        category: 'Keuangan',
        status: 'published',
      },
      {
        id: 4,
        title: 'Daftar Vendor Musik Resepsi Pernikahan Terbaik',
        slug: 'daftar-vendor-musik-resepsi',
        excerpt: 'Rekomendasi band akustik dan ensemble string untuk pesta romantis.',
        category: { name: 'Inspirasi', slug: 'inspirasi' }, // Nested category object
        status: 'published',
      },
      {
        id: 5,
        title: 'Checklist Persiapan Pernikahan H-30',
        slug: 'checklist-persiapan-h30',
        content: '<p>Hal krusial yang wajib diperiksa satu bulan menjelang hari H pernikahan.</p>',
        excerpt: '', // Empty excerpt, fallback to content
        category: 'Tips & Panduan',
        status: 'published',
      },
    ]

    it('returns all articles when search and category are empty', () => {
      const results = filterArticles(SAMPLE_ARTICLES)
      expect(results).toHaveLength(5)
    })

    it('filters articles matching title (case-insensitive & trimmed)', () => {
      const results = filterArticles(SAMPLE_ARTICLES, { search: '  anggaran  ' })
      expect(results).toHaveLength(1)
      expect(results[0].id).toBe(3)
    })

    it('filters articles matching excerpt (case-insensitive)', () => {
      const results = filterArticles(SAMPLE_ARTICLES, { search: 'QR check-in' })
      expect(results).toHaveLength(1)
      expect(results[0].id).toBe(2)
    })

    it('falls back to article content if excerpt is empty', () => {
      const results = filterArticles(SAMPLE_ARTICLES, { search: 'menjelang hari H' })
      expect(results).toHaveLength(1)
      expect(results[0].id).toBe(5)
    })

    it('filters by category string subset', () => {
      const results = filterArticles(SAMPLE_ARTICLES, { category: 'Keuangan' })
      expect(results).toHaveLength(1)
      expect(results[0].id).toBe(3)
    })

    it('handles nested category object matching', () => {
      const results = filterArticles(SAMPLE_ARTICLES, { category: 'Inspirasi' })
      expect(results).toHaveLength(2)
      expect(results.map((a) => a.id)).toEqual([2, 4])
    })

    it('ignores category filter when category is "all" or "semua" (case-insensitive)', () => {
      expect(filterArticles(SAMPLE_ARTICLES, { category: 'all' })).toHaveLength(5)
      expect(filterArticles(SAMPLE_ARTICLES, { category: 'ALL' })).toHaveLength(5)
      expect(filterArticles(SAMPLE_ARTICLES, { category: 'semua' })).toHaveLength(5)
      expect(filterArticles(SAMPLE_ARTICLES, { category: 'Semua' })).toHaveLength(5)
    })

    it('combines search keyword and category filter correctly', () => {
      // Both category 'Tips & Panduan' and search 'undangan'
      const results = filterArticles(SAMPLE_ARTICLES, {
        category: 'Tips & Panduan',
        search: 'undangan',
      })
      expect(results).toHaveLength(1)
      expect(results[0].id).toBe(1)
    })

    it('returns empty array when search query matches nothing', () => {
      const results = filterArticles(SAMPLE_ARTICLES, { search: 'nonexistent keyword xyz 123' })
      expect(results).toHaveLength(0)
    })

    it('returns empty array when category matches nothing', () => {
      const results = filterArticles(SAMPLE_ARTICLES, { category: 'Unmatched Category' })
      expect(results).toHaveLength(0)
    })

    it('handles null, undefined, or empty article list safely without crashing', () => {
      expect(filterArticles(null)).toEqual([])
      expect(filterArticles(undefined)).toEqual([])
      expect(filterArticles([])).toEqual([])
      expect(filterArticles('not an array')).toEqual([])
    })

    it('handles malformed article objects in list without crashing', () => {
      const malformedList = [
        null,
        undefined,
        {},
        { title: null, excerpt: null, category: null },
        { title: 'Valid Article', excerpt: 'Valid excerpt', category: 'Tips' },
      ]

      const results = filterArticles(malformedList, { search: 'Valid' })
      expect(results).toHaveLength(1)
      expect(results[0].title).toBe('Valid Article')
    })

    it('does not mutate the original articles array', () => {
      const copy = [...SAMPLE_ARTICLES]
      filterArticles(SAMPLE_ARTICLES, { search: 'Tren', category: 'Inspirasi' })
      expect(SAMPLE_ARTICLES).toEqual(copy)
    })

    it('provides searchAndFilterArticles alias', () => {
      expect(searchAndFilterArticles).toBe(filterArticles)
    })
  })

  // ==========================================
  // 4. Contextual Cover Image Selection
  // ==========================================
  describe('Contextual Cover Image Selection (getArticleCover)', () => {
    it('returns custom non-generic cover image as is', () => {
      const customArticle = {
        title: 'Custom Title',
        coverImage: 'https://images.unsplash.com/photo-custom-valid-cover?w=1200',
      }
      expect(getArticleCover(customArticle)).toBe('https://images.unsplash.com/photo-custom-valid-cover?w=1200')
    })

    it('replaces generic placeholder with contextual Christian/Bible image', () => {
      const article = {
        title: 'Contoh Kata Mutiara Undangan Pernikahan Kristen & Ayat Alkitab',
        coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      }
      const cover = getArticleCover(article)
      expect(cover).toContain('photo-1561345806-a2a89814df7a')
    })

    it('replaces generic placeholder with contextual Quran image', () => {
      const article = {
        title: 'Ayat Alquran untuk Undangan Pernikahan Ar Rum 21 Arab Latin',
        coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      }
      const cover = getArticleCover(article)
      expect(cover).toContain('photo-1665306376180-3349308d5a38')
    })

    it('replaces generic placeholder with contextual Islamic henna image', () => {
      const article = {
        title: 'Teks Undangan Pernikahan Islami Sesuai Sunnah Walimatul Ursy',
        coverImage: null,
      }
      const cover = getArticleCover(article)
      expect(cover).toContain('photo-1653137790376-8f7f92afe14e')
    })

    it('replaces generic placeholder with contextual calligraphy invitation image', () => {
      const article = {
        title: 'Contoh Penulisan Turut Mengundang pada Undangan Pernikahan',
        coverImage: '',
      }
      const cover = getArticleCover(article)
      expect(cover).toContain('photo-1647470224844-054e5023ebf9')
    })

    it('handles null/undefined gracefully with fallback', () => {
      expect(getArticleCover(null)).toContain('https://images.unsplash.com/')
      expect(getArticleCover(undefined, 'https://fallback.com/img.jpg')).toBe('https://fallback.com/img.jpg')
    })
  })
})
