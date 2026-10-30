import { test, expect } from '@playwright/test'
import { createRequire } from 'node:module'
import { mockAdminApi } from './fixtures/adminMocks.js'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')

const PAGES = [
  ['/admin', 'Dashboard'],
  ['/admin/users', 'Pengguna'],
  ['/admin/invitations', 'Undangan'],
  ['/admin/payments', 'Pembayaran & Transaksi'],
  ['/admin/templates', 'Template Desain'],
  ['/admin/categories', 'Kategori'],
  ['/admin/sections', 'Master Fitur (Sections)'],
  ['/admin/audio', null],
  ['/admin/banks', 'Master Bank & E-wallet'],
  ['/admin/promo-codes', null],
  ['/admin/articles', 'Artikel & Blog'],
  ['/admin/analytics', 'Analytics & Funnel'],
  ['/admin/system', 'Sistem & Audit'],
  ['/admin/security', 'Keamanan Akun'],
  ['/admin/logs', null],
]

async function audit(page) {
  await page.addScriptTag({ path: axePath })
  return page.evaluate(async () => {
    // The Vue DevTools button only exists in the dev server, never in production.
    const result = await window.axe.run({ exclude: [['.vue-devtools__anchor-btn'], ['#vue-devtools-anchor']] }, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    })
    return result.violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 4).map((n) => n.target.join(' ') + ' :: ' + n.html.slice(0, 120)) }))
  })
}

test.describe('runtime accessibility audit (axe, WCAG 2.1 A/AA)', () => {
  test.beforeEach(async ({ page }) => {
    await mockAdminApi(page)
  })

  for (const [path, heading] of PAGES) {
    test(`no serious or critical violations on ${path}`, async ({ page }) => {
      await page.goto(path)
      if (heading) await expect(page.getByRole('heading', { name: heading, exact: true }).first()).toBeVisible()
      await page.waitForLoadState('networkidle')
      const violations = await audit(page)
      expect(violations, JSON.stringify(violations, null, 2)).toEqual([])
    })
  }
})
