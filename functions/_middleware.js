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
  seoFromArticle,
  shouldSkipSeo,
} from '../src/seo/seoRoutes.js'

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

  if (request.method !== 'GET' && request.method !== 'HEAD') return next()
  if (shouldSkipSeo(url.pathname)) return next()

  const response = await next()

  if (response.status !== 200) return response
  if (!(response.headers.get('content-type') || '').includes('text/html')) return response

  const slug = blogSlugFrom(url.pathname)
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
  } else {
    seo = resolveStaticSeo(url.pathname)
  }

  if (!seo) return response

  return rewrite(response, seo)
}
