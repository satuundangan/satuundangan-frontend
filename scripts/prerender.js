/**
 * Prerender script for SEO
 * Renders the landing page to static HTML so Google can index content without JS.
 *
 * Usage: npm run prerender
 * Run after: npm run build
 */

import { chromium } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import { writeFileSync, readFileSync, readFile } from 'node:fs'
import http from 'node:http'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')

async function prerender() {
  console.log('Starting prerender server...')

  // Serve the built dist folder using a clean, static http server to prevent Vite dev script injection
  const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0]
    if (urlPath === '/') urlPath = '/index.html'
    const filePath = path.join(distDir, urlPath)
    
    // Prevent directory traversal
    if (!filePath.startsWith(distDir)) {
      res.statusCode = 403
      res.end('Forbidden')
      return
    }
    
    readFile(filePath, (err, data) => {
      if (err) {
        // SPA Routing fallback to index.html
        readFile(path.join(distDir, 'index.html'), (errHtml, htmlData) => {
          if (errHtml) {
            res.statusCode = 404
            res.end('Not Found')
          } else {
            res.setHeader('Content-Type', 'text/html')
            res.end(htmlData)
          }
        })
        return
      }
      
      const ext = path.extname(filePath).toLowerCase()
      let contentType = 'text/plain'
      if (ext === '.html') contentType = 'text/html'
      else if (ext === '.js') contentType = 'application/javascript'
      else if (ext === '.css') contentType = 'text/css'
      else if (ext === '.png') contentType = 'image/png'
      else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
      else if (ext === '.svg') contentType = 'image/svg+xml'
      else if (ext === '.json') contentType = 'application/json'
      
      res.setHeader('Content-Type', contentType)
      res.end(data)
    })
  })

  await new Promise((resolve) => server.listen(4174, resolve))

  const browser = await chromium.launch()
  const page = await browser.newPage()

  console.log('Rendering / ...')
  await page.goto('http://localhost:4174/', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {
    // networkidle may timeout if API calls never resolve — that's fine
  })
  await page.waitForTimeout(3000)

  // Extract rendered #app HTML content from Playwright
  const renderedAppHtml = await page.$eval('#app', (el) => el.innerHTML).catch(() => '')

  // Read original Vite-generated index.html before Playwright DOM mutations
  const originalHtml = readFileSync(path.join(distDir, 'index.html'), 'utf-8')

  // Inject rendered HTML into original index.html without modifying head scripts or asset hashes
  if (renderedAppHtml) {
    const finalHtml = originalHtml.replace(
      /<div id="app">[\s\S]*?<\/div>/,
      `<div id="app">${renderedAppHtml}</div>`
    )
    writeFileSync(path.join(distDir, 'index.html'), finalHtml)
    console.log(`Saved dist/index.html with prerendered #app content (${Math.round(finalHtml.length / 1024)}KB)`)
  } else {
    console.log('Prerender skipped injecting #app content (empty HTML)')
  }

  await browser.close()
  await new Promise((resolve) => server.close(resolve))
  console.log('Prerender complete.')
}

prerender().catch((err) => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
