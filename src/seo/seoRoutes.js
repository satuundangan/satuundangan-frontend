// Pure SEO route-resolution helpers.
//
// No Vue, no DOM, no Workers-runtime dependency — this module is imported both by the Vitest
// suite (as plain ESM) and by `functions/_middleware.js` / `functions/sitemap.xml.js` (bundled by
// the Cloudflare Pages Functions esbuild step via a relative import out of `functions/`). Nothing
// in the Vue app imports this module, so it never ships in the client bundle.

export const CANONICAL_ORIGIN = 'https://www.satuundangan.id'

// Referenced as the default og:image everywhere in this module. The asset itself does not exist
// yet under satuundangan-frontend/public/ — see the SEO plan follow-up note. Keeping the same
// value `index.html` already shipped rather than inventing a new one here.
export const DEFAULT_OG_IMAGE = 'https://www.satuundangan.id/og-image.jpg'

// Static, non-blog public routes. `canonicalPath` is the route the SPA actually renders for that
// key — the two `redirect` entries (`/syarat-ketentuan`, `/kebijakan-privasi`) canonical to their
// redirect target so Google stops treating them as duplicates of the homepage.
export const STATIC_ROUTE_SEO = {
  '/': {
    title: 'Satu Undangan - Buat Undangan Digital Pernikahan',
    description:
      'Buat undangan pernikahan digital impianmu dengan fitur premium, desain eksklusif, dan harga terjangkau. Sebar undangan lebih mudah dengan Satu Undangan.',
    canonicalPath: '/',
    ogType: 'website',
  },
  '/blog': {
    title: 'Blog & Artikel Undangan Digital - Satu Undangan',
    description:
      'Kumpulan tips, inspirasi, dan panduan lengkap seputar undangan pernikahan digital, mulai dari pemilihan tema dan desain hingga cara menyebarkannya ke tamu.',
    canonicalPath: '/blog',
    ogType: 'website',
  },
  '/templates': {
    title: 'Katalog Template Undangan Digital - Satu Undangan',
    description:
      'Jelajahi puluhan desain template undangan pernikahan digital eksklusif, dari gaya minimalis hingga mewah, siap dipakai untuk hari bahagiamu.',
    canonicalPath: '/templates',
    ogType: 'website',
  },
  '/create': {
    title: 'Buat Undangan Digital Pernikahan - Satu Undangan',
    description:
      'Mulai buat undangan pernikahan digitalmu sendiri hanya dalam hitungan menit. Pilih template, isi data acara, lalu sebarkan ke tamu dengan mudah.',
    canonicalPath: '/create',
    ogType: 'website',
  },
  '/tentang-kami': {
    title: 'Tentang Kami - Satu Undangan',
    description:
      'Kenali lebih dekat Satu Undangan, platform undangan pernikahan digital yang membantu ribuan pasangan menyebarkan kabar bahagia dengan mudah dan elegan.',
    canonicalPath: '/tentang-kami',
    ogType: 'website',
  },
  '/terms': {
    title: 'Syarat & Ketentuan - Satu Undangan',
    description:
      'Baca syarat dan ketentuan penggunaan layanan Satu Undangan sebelum membuat, mempublikasikan, dan membagikan undangan pernikahan digitalmu.',
    canonicalPath: '/terms',
    ogType: 'website',
  },
  '/syarat-ketentuan': {
    title: 'Syarat & Ketentuan - Satu Undangan',
    description:
      'Halaman syarat dan ketentuan Satu Undangan kini berada di /terms. Baca ketentuan lengkap penggunaan layanan undangan pernikahan digital kami di sana.',
    canonicalPath: '/terms',
    ogType: 'website',
  },
  '/privacy': {
    title: 'Kebijakan Privasi - Satu Undangan',
    description:
      'Pelajari bagaimana Satu Undangan mengumpulkan, menggunakan, dan melindungi data pribadimu saat membuat undangan pernikahan digital di platform kami.',
    canonicalPath: '/privacy',
    ogType: 'website',
  },
  '/kebijakan-privasi': {
    title: 'Kebijakan Privasi - Satu Undangan',
    description:
      'Halaman kebijakan privasi Satu Undangan kini berada di /privacy. Pelajari cara kami mengumpulkan dan melindungi data pribadi penggunanya di sana.',
    canonicalPath: '/privacy',
    ogType: 'website',
  },
}

const HTML_TAG_RE = /<[^>]*>/g
const MAX_DESCRIPTION_LENGTH = 200

/** Strip a single trailing slash, except for the root path. */
export function normalizePath(pathname) {
  if (!pathname) return '/'
  if (pathname === '/') return '/'
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

/** True when the raw HTML response for this path should never be touched by the middleware. */
export function shouldSkipSeo(pathname) {
  if (!pathname) return false
  if (pathname === '/api' || pathname.startsWith('/api/')) return true
  const segments = pathname.split('/')
  const lastSegment = segments[segments.length - 1]
  return lastSegment.includes('.')
}

/** Resolve SEO for one of the nine known static routes, or `null` for anything else. */
export function resolveStaticSeo(pathname) {
  const key = normalizePath(pathname)
  const entry = STATIC_ROUTE_SEO[key]
  if (!entry) return null

  const canonical = CANONICAL_ORIGIN + entry.canonicalPath
  return {
    title: entry.title,
    description: entry.description,
    canonical,
    ogImage: DEFAULT_OG_IMAGE,
    ogType: entry.ogType,
    url: canonical,
  }
}

/** Extract the slug from exactly `/blog/<one-segment>`; `null` for anything else. */
export function blogSlugFrom(pathname) {
  const key = normalizePath(pathname)
  const match = key.match(/^\/blog\/([^/]+)$/)
  return match ? match[1] : null
}

/** Same host -> backend-origin mapping already proven in functions/api/[[path]].js. */
export function backendOriginFor(hostname) {
  return hostname === 'dev.satuundangan.id'
    ? 'https://api-dev.satuundangan.id'
    : 'https://api.satuundangan.id'
}

/** Escape `& < > " '` — used only for the canonical `<link>` appended as raw HTML. */
export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function stripHtml(value) {
  if (!value) return ''
  return String(value).replace(HTML_TAG_RE, '')
}

function truncateDescription(text, maxLength = MAX_DESCRIPTION_LENGTH) {
  if (!text) return ''
  const trimmed = String(text).trim()
  if (trimmed.length <= maxLength) return trimmed

  const limit = maxLength - 1 // leave room for the trailing ellipsis character
  const sliced = trimmed.slice(0, limit)
  const lastSpace = sliced.lastIndexOf(' ')
  const base = lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced
  return base.trimEnd() + '…'
}

/** Map an Article entity to the same SEO shape `resolveStaticSeo` returns. Never throws. */
export function seoFromArticle(article, pathname) {
  const safeArticle = article || {}
  const normalizedPath = normalizePath(pathname)
  const derivedCanonical = CANONICAL_ORIGIN + normalizedPath
  const blogDefaults = STATIC_ROUTE_SEO['/blog']

  const title = safeArticle.metaTitle || safeArticle.title || blogDefaults.title
  const rawDescription =
    safeArticle.metaDescription || stripHtml(safeArticle.excerpt) || blogDefaults.description
  const description = truncateDescription(rawDescription)
  const ogImage = safeArticle.ogImage || safeArticle.coverImage || DEFAULT_OG_IMAGE
  const canonical = safeArticle.canonicalUrl || derivedCanonical

  return {
    title,
    description,
    canonical,
    ogImage,
    ogType: 'article',
    url: derivedCanonical,
  }
}
