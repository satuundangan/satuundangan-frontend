/**
 * Generates public/og-image.jpg — the 1200x630 social preview card that index.html and
 * src/seo/seoRoutes.js (DEFAULT_OG_IMAGE) have always pointed at but that never existed.
 *
 * Usage: npm run generate-og
 *
 * Brand tokens are copied from src/assets/main.css @theme; the Google Fonts link mirrors
 * index.html. The logo is inlined as a data URI so the render never depends on the dev server.
 */

import { chromium } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const WIDTH = 1200
const HEIGHT = 630

const COLORS = {
  ivory: '#fffaf3',
  mocha: '#a47148',
  textDark: '#2f2f2f',
  gold: '#c89f68',
}

function logoDataUri() {
  const buf = readFileSync(path.join(root, 'src/assets/logo_satuundangan.png'))
  return `data:image/png;base64,${buf.toString('base64')}`
}

function html() {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Montserrat:wght@300;400;600&display=swap"
      rel="stylesheet"
    />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }

      body {
        width: ${WIDTH}px;
        height: ${HEIGHT}px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Montserrat', sans-serif;
        background: ${COLORS.ivory};
        background-image:
          radial-gradient(circle at 50% 12%, rgba(200, 159, 104, 0.16), transparent 62%),
          radial-gradient(circle at 8% 96%, rgba(164, 113, 72, 0.1), transparent 55%),
          radial-gradient(circle at 94% 88%, rgba(164, 113, 72, 0.1), transparent 55%);
      }

      /* Double hairline frame — the inner rule carries the brand gold, the outer one fades it. */
      .frame {
        position: absolute;
        inset: 26px;
        border: 1px solid rgba(200, 159, 104, 0.35);
      }
      .frame::after {
        content: '';
        position: absolute;
        inset: 9px;
        border: 1px solid rgba(200, 159, 104, 0.18);
      }

      .card {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 0 96px;
      }

      /* The logo PNG ships on a white square; multiply drops that ground onto the ivory bg.
         Its outermost pixel row is a hair off-white, which multiply renders as a visible seam —
         so the mark is scaled up inside a clipping box to push those edges out of frame. */
      .logo-clip {
        width: 236px;
        height: 236px;
        overflow: hidden;
        margin-bottom: 2px;
      }
      .logo {
        width: 100%;
        height: 100%;
        object-fit: contain;
        transform: scale(1.06);
        mix-blend-mode: multiply;
      }

      h1 {
        font-size: 58px;
        font-weight: 600;
        letter-spacing: -0.5px;
        color: ${COLORS.mocha};
        line-height: 1.14;
      }

      .rule {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        margin: 26px 0 22px;
      }
      .rule span {
        display: block;
        width: 108px;
        height: 1px;
        background: linear-gradient(to right, transparent, ${COLORS.gold}, transparent);
      }
      .rule i {
        display: block;
        width: 7px;
        height: 7px;
        transform: rotate(45deg);
        background: ${COLORS.gold};
      }

      .subline {
        font-size: 27px;
        font-weight: 300;
        color: ${COLORS.textDark};
        line-height: 1.45;
      }
      .subline em {
        font-family: 'Alex Brush', cursive;
        font-style: normal;
        font-size: 38px;
        color: ${COLORS.mocha};
        line-height: 1;
      }

      .domain {
        margin-top: 34px;
        font-size: 22px;
        font-weight: 600;
        letter-spacing: 4.5px;
        text-transform: uppercase;
        color: ${COLORS.gold};
      }
    </style>
  </head>
  <body>
    <div class="frame"></div>
    <div class="card">
      <div class="logo-clip"><img class="logo" src="${logoDataUri()}" alt="" /></div>
      <h1>Undangan Pernikahan Digital</h1>
      <div class="rule"><span></span><i></i><span></span></div>
      <p class="subline">
        Desain <em>eksklusif</em>, sebar undangan lewat satu link.
      </p>
      <p class="domain">satuundangan.id</p>
    </div>
  </body>
</html>`
}

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } })

  await page.setContent(html(), { waitUntil: 'networkidle' })
  // setContent resolves before webfonts paint; without this the card renders in the fallback face.
  await page.evaluate(() => document.fonts.ready)

  const buffer = await page.screenshot({ type: 'jpeg', quality: 90 })
  await browser.close()

  const out = path.join(root, 'public/og-image.jpg')
  writeFileSync(out, buffer)
  console.log(`Wrote ${out} (${WIDTH}x${HEIGHT}, ${(buffer.length / 1024).toFixed(1)} KB)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
