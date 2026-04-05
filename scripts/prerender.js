/**
 * Prerender script for SEO
 * Renders the landing page to static HTML so Google can index content without JS.
 *
 * Usage: npm run prerender
 * Run after: npm run build
 */

import { chromium } from '@playwright/test'
import { createServer } from 'vite'
import { fileURLToPath } from 'node:url'
import { writeFileSync } from 'node:fs'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')

async function prerender() {
  console.log('Starting prerender server...')

  // Serve the built dist folder
  const server = await createServer({
    root: distDir,
    server: { port: 4174 },
    appType: 'spa',
  })
  await server.listen()

  const browser = await chromium.launch()
  const page = await browser.newPage()

  console.log('Rendering / ...')
  await page.goto('http://localhost:4174/', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {
    // networkidle may timeout if API calls never resolve — that's fine
  })
  await page.waitForTimeout(3000)

  const html = await page.content()
  writeFileSync(path.join(distDir, 'index.html'), html)
  console.log(`Saved dist/index.html (${Math.round(html.length / 1024)}KB)`)

  await browser.close()
  await server.close()
  console.log('Prerender complete.')
}

prerender().catch((err) => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
