// Proxies /sitemap.xml to the backend's dynamic sitemap (undangan-online-api-nestjs's
// GET /sitemap.xml). `satuundangan-frontend/public/sitemap.xml` was deleted alongside this file so
// the old stale static asset can never shadow this route again.
import { backendOriginFor } from '../src/seo/seoRoutes.js'

const FALLBACK_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.satuundangan.id/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.satuundangan.id/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.satuundangan.id/templates</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.satuundangan.id/create</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://www.satuundangan.id/tentang-kami</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://www.satuundangan.id/terms</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://www.satuundangan.id/privacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`

const RESPONSE_HEADERS = {
  'content-type': 'application/xml; charset=utf-8',
  'cache-control': 'public, max-age=3600',
}

export async function onRequest(context) {
  const url = new URL(context.request.url)
  const origin = backendOriginFor(url.hostname)

  try {
    const res = await fetch(`${origin}/sitemap.xml`, {
      headers: { accept: 'application/xml' },
      signal: AbortSignal.timeout(5000),
    })
    if (res.ok) {
      return new Response(res.body, { status: 200, headers: RESPONSE_HEADERS })
    }
  } catch {
    // fall through to the static fallback below
  }

  return new Response(FALLBACK_SITEMAP, { status: 200, headers: RESPONSE_HEADERS })
}
