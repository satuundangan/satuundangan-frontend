import { chromium } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputDir = path.resolve(__dirname, '../public/assets/templates')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// 23 actual theme templates (exclude dynamic-theme which is generic builder engine)
const templates = [
  'azure-shores',
  'batak-ragi-hotang',
  'botanical-watercolor',
  'celestial-sparkle',
  'cyberpunk-neon',
  'dark-elegant',
  'dayak-ngaju-benang-bintik',
  'editorial-magazine',
  'jawa-truntum',
  'kimi-no-na-wa',
  'light-modern',
  'meowly-married',
  'minimalist-terra',
  'modern-noir',
  'naruto',
  'one-piece',
  'pixel-quest',
  'retro-nostalgia',
  'royal-emerald',
  'royal-gold',
  'sakura-blossom',
  'strawberry-matcha',
  'sunda-sabilulungan',
]

async function run() {
  console.log(`Starting automated screenshot capture for ${templates.length} templates...`)
  const browser = await chromium.launch({ headless: true })

  for (const slug of templates) {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    })

    try {
      console.log(`[${slug}] Loading demo page...`)
      await page.goto(`http://localhost:5174/demo/${slug}`, {
        waitUntil: 'networkidle',
        timeout: 30000,
      }).catch(() => null)

      // Wait for fonts and images
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(1500)

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
  console.log('All screenshots captured successfully!')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
