const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto('http://localhost:5174/demo/dayak-ngaju-benang-bintik', { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1000)

  // 1. Cover Gate screenshot (default)
  await page.screenshot({ path: 'public/assets/templates/dayak-ngaju-benang-bintik.png', type: 'png' })
  console.log('Saved cover screenshot to public/assets/templates/dayak-ngaju-benang-bintik.png')

  // 2. Click Buka Undangan to test opened content
  const btn = page.locator('button', { hasText: 'Buka Undangan' })
  if (await btn.count()) {
    await btn.click()
    await page.waitForTimeout(1200)
    await page.screenshot({ path: 'dayak-opened-preview.png', type: 'png' })
    console.log('Saved opened content to dayak-opened-preview.png')
  }

  // 3. Mobile Cover screenshot
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true })
  await mobilePage.goto('http://localhost:5174/demo/dayak-ngaju-benang-bintik', { waitUntil: 'networkidle' })
  await mobilePage.evaluate(() => document.fonts.ready)
  await mobilePage.waitForTimeout(1000)
  await mobilePage.screenshot({ path: 'dayak-mobile-cover.png', type: 'png' })
  console.log('Saved dayak-mobile-cover.png')

  await browser.close()
})()
