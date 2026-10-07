import { chromium } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputDir = path.resolve(__dirname, '../public/assets/templates')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const targetTemplates = [
  'palembang-aesan-gede',
  'betawi-palang-pintu',
  'moroccan-marrakech-gold',
  'old-money-monogram',
]

async function run() {
  console.log(`Capturing desktop screenshots (1440x900) for: ${targetTemplates.join(', ')}...`)
  const browser = await chromium.launch({ headless: true })

  for (const slug of targetTemplates) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    })

    try {
      console.log(`[${slug}] Loading demo page...`)
      await page.goto(`http://localhost:5173/demo/${slug}`, {
        waitUntil: 'networkidle',
        timeout: 30000,
      }).catch(() => null)

      // Wait for fonts, SVG renders, and animations to settle
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(2000)

      const targetPath = path.join(outputDir, `${slug}.png`)
      await page.screenshot({ path: targetPath, type: 'png' })
      const stat = fs.statSync(targetPath)
      console.log(`✓ [${slug}] Saved -> ${(stat.size / 1024).toFixed(1)} KB`)
    } catch (err) {
      console.error(`✗ [${slug}] Failed:`, err.message)
    } finally {
      await page.close()
    }
  }

  await browser.close()
  console.log('All 4 template screenshots captured successfully!')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
