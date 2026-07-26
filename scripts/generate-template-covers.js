/**
 * Automated template cover generator
 * Screenshots every published template's /demo/:slug page and encodes a uniform
 * 1080x1350 WEBP cover, replacing the manual OS-screenshot covers on the homepage catalog.
 *
 * Usage:
 *   npm run generate-covers                 # dry-run against DEV, writes to .cover-output/
 *   npm run generate-covers:apply           # write-run against DEV: login, upload, PATCH
 *   node scripts/generate-template-covers.js --dry-run --slug=royal-emerald
 *   node scripts/generate-template-covers.js --yes --prod --base-url=... --api-url=...
 *
 * Flags:
 *   --dry-run          capture + encode + save to disk only, no network write, no credentials needed
 *   --yes              required to run the write path (login -> upload -> PATCH); confirmation gate
 *   --slug=<slug>      restrict to a single template
 *   --base-url=<url>   frontend origin serving /demo/:slug (default https://dev.satuundangan.id)
 *   --api-url=<url>    backend origin serving the REST API (default https://api-dev.satuundangan.id)
 *   --prod             required in addition to --yes/--dry-run when either resolved host is not
 *                       an allowlisted dev host
 *   --help             print this usage and exit 0
 *
 * Env vars (write path only):
 *   COVER_ADMIN_EMAIL, COVER_ADMIN_PASSWORD  admin account used to login before upload + PATCH
 */

import { chromium } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputDir = path.resolve(__dirname, '../.cover-output')

const DEV_HOSTS = ['dev.satuundangan.id', 'api-dev.satuundangan.id', 'localhost', '127.0.0.1']
const MAX_BYTES = 300 * 1024
const WEBP_QUALITIES = [0.85, 0.8, 0.75, 0.7, 0.65]

function printHelp() {
  console.log(`
Automated template cover generator

Usage:
  node scripts/generate-template-covers.js --dry-run [--slug=<slug>]
  node scripts/generate-template-covers.js --yes [--prod] [--slug=<slug>]

Flags:
  --dry-run          capture + encode + save to disk only, no network write, no credentials needed
  --yes              required to run the write path (login -> upload -> PATCH)
  --slug=<slug>      restrict to a single template
  --base-url=<url>   frontend origin (default https://dev.satuundangan.id)
  --api-url=<url>    backend origin (default https://api-dev.satuundangan.id)
  --prod             required alongside --yes/--dry-run when targeting a non-dev host
  --help             print this usage and exit 0

Env vars (write path only): COVER_ADMIN_EMAIL, COVER_ADMIN_PASSWORD
`)
}

function parseArgs(argv) {
  const args = {
    dryRun: false,
    yes: false,
    prod: false,
    help: false,
    slug: null,
    baseUrl: 'https://dev.satuundangan.id',
    apiUrl: 'https://api-dev.satuundangan.id',
  }
  for (const raw of argv) {
    if (raw === '--dry-run') args.dryRun = true
    else if (raw === '--yes') args.yes = true
    else if (raw === '--prod') args.prod = true
    else if (raw === '--help') args.help = true
    else if (raw.startsWith('--slug=')) args.slug = raw.slice('--slug='.length)
    else if (raw.startsWith('--base-url=')) args.baseUrl = raw.slice('--base-url='.length)
    else if (raw.startsWith('--api-url=')) args.apiUrl = raw.slice('--api-url='.length)
  }
  args.baseUrl = args.baseUrl.replace(/\/+$/, '')
  args.apiUrl = args.apiUrl.replace(/\/+$/, '')
  return args
}

function assertNotProd(args) {
  const hosts = [args.baseUrl, args.apiUrl].map((u) => new URL(u).hostname)
  const offending = hosts.filter((h) => !DEV_HOSTS.includes(h))
  if (offending.length > 0 && !args.prod) {
    console.error(
      `Refusing to run: host(s) ${offending.join(', ')} are not in the dev allowlist ` +
        `(${DEV_HOSTS.join(', ')}). Pass --prod to target a non-dev host explicitly.`,
    )
    process.exit(1)
  }
}

async function fetchTemplates(apiUrl, slugFilter) {
  const res = await fetch(`${apiUrl}/template-design`)
  if (!res.ok) throw new Error(`GET /template-design failed: ${res.status}`)
  const templates = await res.json()
  if (!slugFilter) return templates
  const match = templates.filter((t) => t.slug === slugFilter)
  if (match.length === 0) {
    throw new Error(`No template found with slug "${slugFilter}"`)
  }
  return match
}

async function probeBeforeKb(thumbnailUrl) {
  if (!thumbnailUrl) return null
  try {
    const res = await fetch(thumbnailUrl, { method: 'HEAD' })
    const len = res.headers.get('content-length')
    return len ? Number(len) : null
  } catch {
    return null
  }
}

async function captureScreenshot(browser, baseUrl, slug) {
  const page = await browser.newPage({
    viewport: { width: 432, height: 540 },
    deviceScaleFactor: 2.5,
  })
  try {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page
      .goto(`${baseUrl}/demo/${slug}`, { waitUntil: 'networkidle', timeout: 30000 })
      .catch(() => {
        // networkidle may timeout if API calls never resolve — that's fine, proceed anyway
      })
    await page.evaluate(() => document.fonts.ready)
    await page.evaluate(() =>
      Promise.all(
        Array.from(document.images)
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise((resolve) => {
                img.onload = resolve
                img.onerror = resolve
              }),
          ),
      ),
    )
    await page.waitForTimeout(2000)
    return await page.screenshot({ type: 'png' })
  } finally {
    await page.close()
  }
}

async function pngBufferToWebp(browser, pngBuffer) {
  const page = await browser.newPage()
  try {
    const b64 = pngBuffer.toString('base64')
    const result = await page.evaluate(
      async ({ base64, qualities, maxBytes }) => {
        const img = new Image()
        img.src = `data:image/png;base64,${base64}`
        await img.decode()
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)

        function dataUrlBytes(dataUrl) {
          const commaIdx = dataUrl.indexOf(',')
          const payload = dataUrl.slice(commaIdx + 1)
          const padding = payload.endsWith('==') ? 2 : payload.endsWith('=') ? 1 : 0
          return Math.floor((payload.length * 3) / 4) - padding
        }

        let best = null
        for (const q of qualities) {
          const dataUrl = canvas.toDataURL('image/webp', q)
          const bytes = dataUrlBytes(dataUrl)
          const candidate = { dataUrl, bytes, quality: q }
          if (!best) best = candidate
          if (bytes <= maxBytes) {
            best = candidate
            break
          }
          best = candidate
        }
        return {
          dataUrl: best.dataUrl,
          bytes: best.bytes,
          quality: best.quality,
          width: canvas.width,
          height: canvas.height,
        }
      },
      { base64: b64, qualities: WEBP_QUALITIES, maxBytes: MAX_BYTES },
    )
    const commaIdx = result.dataUrl.indexOf(',')
    const base64Payload = result.dataUrl.slice(commaIdx + 1)
    return {
      base64: base64Payload,
      bytes: result.bytes,
      quality: result.quality,
      width: result.width,
      height: result.height,
      underBudget: result.bytes <= MAX_BYTES,
    }
  } finally {
    await page.close()
  }
}

function saveDryRun(slug, base64) {
  mkdirSync(outputDir, { recursive: true })
  const filePath = path.join(outputDir, `${slug}.webp`)
  writeFileSync(filePath, Buffer.from(base64, 'base64'))
  return filePath
}

// Write path — login once, then per-template upload + PATCH. NOT executed by --dry-run.
async function login(apiUrl) {
  const email = process.env.COVER_ADMIN_EMAIL
  const password = process.env.COVER_ADMIN_PASSWORD
  if (!email || !password) {
    console.error(
      'Missing credentials: set COVER_ADMIN_EMAIL and COVER_ADMIN_PASSWORD env vars before ' +
        'running the write path.',
    )
    process.exit(1)
  }
  const res = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const body = await res.json()
  if (!res.ok || !body.access_token) {
    throw new Error(`Login failed: ${JSON.stringify(Object.keys(body))}`)
  }
  console.log(`login ok (token length ${body.access_token.length})`)
  return body.access_token
}

// upload.service.ts:56 prefixes the R2 key with `${Date.now()}-${file.originalname}`, so the
// final key is `1777...-{slug}-cover.webp` rather than a stable `templates/{slug}-cover.webp`.
// A deterministic key is not reachable through this endpoint without a backend change.
async function uploadCover(apiUrl, token, slug, buffer) {
  const fd = new FormData()
  fd.append('file', new Blob([buffer], { type: 'image/webp' }), `${slug}-cover.webp`)
  const res = await fetch(`${apiUrl}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  })
  const body = await res.json()
  if (!res.ok || !body.fileUrl) {
    throw new Error(`Upload failed for ${slug}: ${JSON.stringify(body)}`)
  }
  return body.fileUrl
}

async function patchThumbnail(apiUrl, token, id, thumbnailUrl) {
  const res = await fetch(`${apiUrl}/admin/template-designs/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ thumbnailUrl }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PATCH failed for template ${id}: ${res.status} ${text}`)
  }
}

function printTable(results) {
  const header = ['slug', 'WxH', 'quality', 'KB', 'before KB', 'delta']
  const rows = results.map((r) => [
    r.slug,
    `${r.width}x${r.height}`,
    r.quality.toFixed(2),
    String(Math.round(r.bytes / 1024)),
    r.beforeBytes == null ? '?' : String(Math.round(r.beforeBytes / 1024)),
    r.beforeBytes == null ? '?' : String(Math.round((r.beforeBytes - r.bytes) / 1024)),
  ])
  const widths = header.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)))
  const fmt = (cols) => cols.map((c, i) => c.padEnd(widths[i])).join(' | ')
  console.log(fmt(header))
  console.log(widths.map((w) => '-'.repeat(w)).join('-|-'))
  for (const row of rows) console.log(fmt(row))
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args.help) {
    printHelp()
    process.exit(0)
  }

  assertNotProd(args)

  if (!args.dryRun && !args.yes) {
    printHelp()
    console.error('Pass --dry-run to preview or --yes to write changes.')
    process.exit(1)
  }
  const writeMode = args.yes && !args.dryRun

  let token = null
  if (writeMode) {
    console.log(`Write mode: base-url=${args.baseUrl} api-url=${args.apiUrl} prod=${args.prod}`)
    token = await login(args.apiUrl)
  }

  const templates = await fetchTemplates(args.apiUrl, args.slug)
  console.log(`Fetched ${templates.length} template(s).`)
  if (writeMode) {
    console.log(`Write mode active for ${templates.length} template(s), proceeding...`)
  }

  const browser = await chromium.launch()
  const results = []
  const failures = []

  try {
    for (const template of templates) {
      const { slug, id, thumbnailUrl } = template
      try {
        const beforeBytes = await probeBeforeKb(thumbnailUrl)
        const pngBuffer = await captureScreenshot(browser, args.baseUrl, slug)
        const encoded = await pngBufferToWebp(browser, pngBuffer)
        const buffer = Buffer.from(encoded.base64, 'base64')

        if (writeMode) {
          const fileUrl = await uploadCover(args.apiUrl, token, slug, buffer)
          await patchThumbnail(args.apiUrl, token, id, fileUrl)
        } else {
          saveDryRun(slug, encoded.base64)
        }

        results.push({
          slug,
          width: encoded.width,
          height: encoded.height,
          quality: encoded.quality,
          bytes: encoded.bytes,
          beforeBytes,
          underBudget: encoded.underBudget,
        })
        console.log(
          `ok: ${slug} (${encoded.width}x${encoded.height}, ${Math.round(encoded.bytes / 1024)}KB)`,
        )
      } catch (err) {
        failures.push({ slug, error: err.message })
        console.error(`failed: ${slug}: ${err.message}`)
      }
    }
  } finally {
    await browser.close()
  }

  console.log('')
  printTable(results)

  const totalBefore = results.reduce((sum, r) => sum + (r.beforeBytes ?? 0), 0)
  const totalAfter = results.reduce((sum, r) => sum + r.bytes, 0)
  console.log('')
  console.log(
    `Total: ${Math.round(totalBefore / 1024)} KB -> ${Math.round(totalAfter / 1024)} KB ` +
      `(${results.length} covers)`,
  )
  if (!writeMode) {
    console.log(`Dry-run output: ${outputDir}`)
  }

  if (failures.length > 0) {
    console.log('')
    console.log('Failures:')
    for (const f of failures) console.log(`  ${f.slug}: ${f.error}`)
  }

  process.exit(failures.length ? 1 : 0)
}

main().catch((err) => {
  console.error('generate-template-covers failed:', err)
  process.exit(1)
})
