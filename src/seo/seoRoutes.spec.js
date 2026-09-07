import { describe, it, expect } from 'vitest'
import {
  CANONICAL_ORIGIN,
  DEFAULT_OG_IMAGE,
  STATIC_ROUTE_SEO,
  shouldSkipSeo,
  normalizePath,
  resolveStaticSeo,
  blogSlugFrom,
  backendOriginFor,
  seoFromArticle,
  escapeHtml,
} from './seoRoutes'

describe('seoRoutes', () => {
  describe('shouldSkipSeo', () => {
    it('skips the API proxy path and its root', () => {
      expect(shouldSkipSeo('/api/health')).toBe(true)
      expect(shouldSkipSeo('/api')).toBe(true)
    })

    it('skips any path whose last segment has a file extension', () => {
      expect(shouldSkipSeo('/logo.svg')).toBe(true)
      expect(shouldSkipSeo('/assets/index-abc.js')).toBe(true)
      expect(shouldSkipSeo('/google4d46c3f545b67474.html')).toBe(true)
    })

    it('does not skip real SPA routes', () => {
      expect(shouldSkipSeo('/blog/foo')).toBe(false)
      expect(shouldSkipSeo('/')).toBe(false)
      expect(shouldSkipSeo('/terms')).toBe(false)
    })
  })

  describe('normalizePath', () => {
    it('strips a single trailing slash', () => {
      expect(normalizePath('/templates/')).toBe('/templates')
    })

    it('leaves the root path untouched', () => {
      expect(normalizePath('/')).toBe('/')
    })

    it('leaves paths with no trailing slash untouched', () => {
      expect(normalizePath('/templates')).toBe('/templates')
    })
  })

  describe('resolveStaticSeo', () => {
    it('resolves the homepage canonical', () => {
      expect(resolveStaticSeo('/').canonical).toBe('https://www.satuundangan.id/')
    })

    it('resolves /templates canonical', () => {
      expect(resolveStaticSeo('/templates').canonical).toBe('https://www.satuundangan.id/templates')
    })

    it('resolves /syarat-ketentuan to the /terms canonical', () => {
      expect(resolveStaticSeo('/syarat-ketentuan').canonical).toBe(
        'https://www.satuundangan.id/terms',
      )
    })

    it('resolves /kebijakan-privasi to the /privacy canonical', () => {
      expect(resolveStaticSeo('/kebijakan-privasi').canonical).toBe(
        'https://www.satuundangan.id/privacy',
      )
    })

    it('normalizes a trailing slash before lookup', () => {
      expect(resolveStaticSeo('/templates/')).toEqual(resolveStaticSeo('/templates'))
    })

    it('returns null for unknown/dynamic routes', () => {
      expect(resolveStaticSeo('/dashboard')).toBeNull()
      expect(resolveStaticSeo('/some-invitation-slug')).toBeNull()
    })

    it('covers every documented static route with a website ogType', () => {
      for (const path of Object.keys(STATIC_ROUTE_SEO)) {
        const seo = resolveStaticSeo(path)
        expect(seo).not.toBeNull()
        expect(seo.ogType).toBe('website')
        expect(seo.ogImage).toBe(DEFAULT_OG_IMAGE)
        expect(seo.canonical).toBe(seo.url)
        expect(seo.canonical.startsWith(CANONICAL_ORIGIN)).toBe(true)
      }
    })
  })

  describe('blogSlugFrom', () => {
    it('extracts the slug from /blog/:slug', () => {
      expect(blogSlugFrom('/blog/cara-bikin-undangan')).toBe('cara-bikin-undangan')
    })

    it('returns null for the blog list route', () => {
      expect(blogSlugFrom('/blog')).toBeNull()
    })

    it('returns null for a nested path under /blog', () => {
      expect(blogSlugFrom('/blog/a/b')).toBeNull()
    })
  })

  describe('backendOriginFor', () => {
    it('routes the dev hostname to the dev API', () => {
      expect(backendOriginFor('dev.satuundangan.id')).toBe('https://api-dev.satuundangan.id')
    })

    it('routes the production hostname to the production API', () => {
      expect(backendOriginFor('www.satuundangan.id')).toBe('https://api.satuundangan.id')
    })

    it('defaults every other hostname to the production API', () => {
      expect(backendOriginFor('localhost')).toBe('https://api.satuundangan.id')
    })
  })

  describe('seoFromArticle', () => {
    it('prefers metaTitle, metaDescription, ogImage and canonicalUrl over their fallbacks', () => {
      const article = {
        title: 'Judul Asli',
        metaTitle: 'Judul SEO',
        excerpt: 'Excerpt asli',
        metaDescription: 'Deskripsi SEO',
        coverImage: 'https://cdn.example.com/cover.jpg',
        ogImage: 'https://cdn.example.com/og.jpg',
        canonicalUrl: 'https://www.satuundangan.id/blog/custom-canonical',
      }

      const seo = seoFromArticle(article, '/blog/x')

      expect(seo.title).toBe('Judul SEO')
      expect(seo.description).toBe('Deskripsi SEO')
      expect(seo.ogImage).toBe('https://cdn.example.com/og.jpg')
      expect(seo.canonical).toBe('https://www.satuundangan.id/blog/custom-canonical')
    })

    it('falls back sensibly for an article with only a title', () => {
      const seo = seoFromArticle({ title: 'Cara Membuat Undangan Digital' }, '/blog/x')

      expect(seo.title).toBe('Cara Membuat Undangan Digital')
      expect(typeof seo.description).toBe('string')
      expect(seo.description.length).toBeGreaterThan(0)
      expect(seo.ogImage).toBe(DEFAULT_OG_IMAGE)
      expect(seo.ogType).toBe('article')
      expect(seo.canonical).toBe('https://www.satuundangan.id/blog/x')
      expect(seo.url).toBe('https://www.satuundangan.id/blog/x')
    })

    it('truncates a long description to 200 chars with a trailing ellipsis', () => {
      const longText = 'kata '.repeat(70).trim() // > 300 chars
      const seo = seoFromArticle({ title: 'Judul', metaDescription: longText }, '/blog/x')

      expect(seo.description.length).toBeLessThanOrEqual(200)
      expect(seo.description.endsWith('…')).toBe(true)
    })

    it('strips HTML tags found in excerpt', () => {
      const seo = seoFromArticle(
        { title: 'Judul', excerpt: '<p>Halo <b>dunia</b> undangan</p>' },
        '/blog/x',
      )

      expect(seo.description).toBe('Halo dunia undangan')
    })

    it('tolerates null, undefined and missing fields without throwing', () => {
      expect(() => seoFromArticle(null, '/blog/x')).not.toThrow()
      expect(() => seoFromArticle(undefined, '/blog/x')).not.toThrow()
      expect(() => seoFromArticle({}, '/blog/x')).not.toThrow()
    })
  })

  describe('escapeHtml', () => {
    it('escapes ampersand, quotes and angle brackets', () => {
      expect(escapeHtml('a&b"<c>')).toBe('a&amp;b&quot;&lt;c&gt;')
    })
  })
})
