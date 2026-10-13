// Root Cloudflare Pages middleware — wraps EVERY request, including `functions/api/*` and every
// static asset served from `dist/`. The short-circuits below (non-GET/HEAD, `shouldSkipSeo`,
// non-200 responses, non-HTML content-type, unresolved SEO) are load-bearing: regressing any of
// them either breaks the `/api/*` proxy or corrupts a non-HTML response.
//
// `/:slug` public invitation pages are deliberately NOT matched — `resolveStaticSeo` and
// `blogSlugFrom` both return falsy for them, so step 8 below returns the untransformed response.
//
// This middleware supersedes the prerender step for SEO purposes; the `postbuild` guard that
// skips prerendering under `CF_PAGES`/`CI` stays untouched on purpose.
import {
  CANONICAL_ORIGIN,
  backendOriginFor,
  blogSlugFrom,
  escapeHtml,
  resolveStaticSeo,
  resolveThemeSeo,
  seoFromArticle,
  shouldSkipSeo,
  themeSlugFrom,
} from '../src/seo/seoRoutes.js'

const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy':
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self' https://api.satuundangan.id https://*.midtrans.com https://*.veritrans.co.id; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com https://app.midtrans.com https://app.sandbox.midtrans.com https://*.cloudfront.net https://*.midtrans.com https://*.veritrans.co.id https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://unpkg.com https://*.cloudfront.net; font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: blob: https:; media-src 'self' data: blob: https:; connect-src 'self' https://api.satuundangan.id https://api-js.mixpanel.com https://*.mixpanel.com https://*.google-analytics.com https://challenges.cloudflare.com https://*.cloudflare.com https://*.midtrans.com https://*.veritrans.co.id https://*.cloudfront.net https://nominatim.openstreetmap.org; frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://maps.google.com https://www.google.com https://challenges.cloudflare.com https://*.midtrans.com https://*.veritrans.co.id; worker-src 'self' blob:; manifest-src 'self'; upgrade-insecure-requests",
  'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy':
    'camera=(self), microphone=(), geolocation=(), payment=(self "https://app.midtrans.com" "https://app.sandbox.midtrans.com")',
}

function addSecurityHeaders(response) {
  const headers = new Headers(response.headers)
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(name, value)
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

async function fetchArticle(url, slug) {
  try {
    const res = await fetch(
      `${backendOriginFor(url.hostname)}/articles/${encodeURIComponent(slug)}`,
      {
        headers: { accept: 'application/json' },
        signal: AbortSignal.timeout(2500),
      },
    )
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

function rewrite(response, seo) {
  return new HTMLRewriter()
    .on('title', {
      element: (el) => el.setInnerContent(seo.title),
    })
    .on('meta[name="description"]', {
      element: (el) => el.setAttribute('content', seo.description),
    })
    .on('meta[property="og:title"]', {
      element: (el) => el.setAttribute('content', seo.title),
    })
    .on('meta[property="og:description"]', {
      element: (el) => el.setAttribute('content', seo.description),
    })
    .on('meta[property="og:image"]', {
      element: (el) => el.setAttribute('content', seo.ogImage),
    })
    .on('meta[property="og:url"]', {
      element: (el) => el.setAttribute('content', seo.url),
    })
    .on('meta[property="og:type"]', {
      element: (el) => el.setAttribute('content', seo.ogType),
    })
    .on('meta[property="twitter:title"]', {
      element: (el) => el.setAttribute('content', seo.title),
    })
    .on('meta[name="twitter:title"]', {
      element: (el) => el.setAttribute('content', seo.title),
    })
    .on('meta[property="twitter:description"]', {
      element: (el) => el.setAttribute('content', seo.description),
    })
    .on('meta[name="twitter:description"]', {
      element: (el) => el.setAttribute('content', seo.description),
    })
    .on('meta[property="twitter:image"]', {
      element: (el) => el.setAttribute('content', seo.ogImage),
    })
    .on('meta[name="twitter:image"]', {
      element: (el) => el.setAttribute('content', seo.ogImage),
    })
    .on('meta[property="twitter:url"]', {
      element: (el) => el.setAttribute('content', seo.url),
    })
    .on('meta[name="twitter:url"]', {
      element: (el) => el.setAttribute('content', seo.url),
    })
    .on('head', {
      element: (el) =>
        el.append(`<link rel="canonical" href="${escapeHtml(seo.canonical)}">`, { html: true }),
    })
    .transform(response)
}

export async function onRequest(context) {
  const { request, next } = context
  const url = new URL(request.url)

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return addSecurityHeaders(await next())
  }
  if (shouldSkipSeo(url.pathname)) return addSecurityHeaders(await next())

  const response = await next()

  if (response.status !== 200) return addSecurityHeaders(response)
  if (!(response.headers.get('content-type') || '').includes('text/html')) {
    return addSecurityHeaders(response)
  }

  const slug = blogSlugFrom(url.pathname)
  const themeSlug = themeSlugFrom(url.pathname)
  let seo
  if (slug) {
    const article = await fetchArticle(url, slug)
    if (article) {
      seo = seoFromArticle(article, url.pathname)
    } else {
      seo = resolveStaticSeo('/blog')
      seo = {
        ...seo,
        canonical: CANONICAL_ORIGIN + url.pathname,
        url: CANONICAL_ORIGIN + url.pathname,
      }
    }
  } else if (themeSlug) {
    seo = resolveThemeSeo(url.pathname)
  } else {
    seo = resolveStaticSeo(url.pathname)
  }

  if (!seo) return addSecurityHeaders(response)

  return addSecurityHeaders(rewrite(response, seo))
}
