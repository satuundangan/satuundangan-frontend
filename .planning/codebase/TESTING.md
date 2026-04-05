# Testing Patterns

**Analysis Date:** 2026-04-05

## Test Framework

**Runner:**
- Playwright 1.59.1
- Config: `playwright.config.js`
- Test directory: `tests/`

**Unit Testing (Minimal):**
- Vitest 4.1.0 (configured but minimal usage)
- Single unit test file: `src/__tests__/InvitationView.spec.js`

**Assertion Library:**
- Playwright: Built-in `expect()` from `@playwright/test`
- Vitest: Built-in `expect()` from `vitest`

**Run Commands:**
```bash
npm run test              # Run Playwright tests (no explicit command shown, uses playwright.config.js)
npx playwright test       # Run all Playwright tests
npx playwright test --headed  # Run tests with browser visible
npx vitest                # Run Vitest (unit tests)
npx vitest --ui           # Run Vitest with UI
```

## Test File Organization

**Location:**
- **E2E Tests:** `tests/` directory (Playwright) - co-located with project root
- **Unit Tests:** `src/__tests__/` directory (Vitest) - co-located with source

**Naming:**
- E2E: `{feature}.spec.js` (e.g., `golden-path.spec.js`, `promo-code.spec.js`, `comprehensive-flow.spec.js`)
- Unit: `{component}.spec.js` (e.g., `InvitationView.spec.js`)

**Structure:**
```
tests/
├── fixtures/
│   └── auth.setup.js          # Authentication setup (Playwright project: "setup")
├── golden-path.spec.js        # Full flow test
├── comprehensive-flow.spec.js # Detailed flow with mocks
├── promo-code.spec.js         # Promo code feature
├── midtrans-integration.spec.js
├── midtrans-payment.spec.js
└── login-debug.spec.js

src/__tests__/
└── InvitationView.spec.js     # Unit test for name decoding
```

## Test Structure

**E2E Suite Organization** (from `golden-path.spec.js`):
```javascript
import { test, expect } from '@playwright/test'

test.describe('Golden Path: Full Flow with Promo Code', () => {
  const email = 'playwright@test.com'
  const password = 'playwright123'
  const weddingTitle = 'Wedding of Putri and Pangeran ' + Date.now()

  test('should login, create, apply promo code, publish and verify guest access', 
    async ({ page, context }) => {
    test.setTimeout(240000)  // 4-minute timeout for long flows
    
    // Test steps...
  })
})
```

**Patterns:**

1. **Setup Phase:**
   - Page initialization
   - Mock route setup: `await page.route('**/endpoint', (route) => {...})`
   - Script injection: `await page.addInitScript(() => {...})`

2. **Navigation Phase:**
   - `await page.goto('http://localhost:5173/')`
   - Wait for selectors: `await page.waitForSelector(..., { state: 'visible', timeout: 15000 })`

3. **Interaction Phase:**
   - Fill inputs: `await page.fill('input[placeholder="..."]', value)`
   - Click buttons: `await page.click('button:has-text("...")', { force: true })`
   - Select files: `await page.setInputFiles('input#id', testImagePath)`
   - Scroll: `await saveBtn.scrollIntoViewIfNeeded()`

4. **Assertion Phase:**
   - URL checks: `await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 })`
   - Element visibility: `await expect(page.locator(...)).toBeVisible({ timeout: 10000 })`
   - Text content: `await expect(page.locator('...')).toHaveText('...')`

5. **Logging:**
   - Console logs for test milestones: `console.log('✅ Login Berhasil')`

**Example Flow from `golden-path.spec.js` (120-line test):**
```javascript
// ─────────────────────────────────────────────
// 1. LOGIN
// ─────────────────────────────────────────────
await page.goto('http://localhost:5173/')
await page.click('button:has-text("Masuk")', { force: true })
await page.fill('input[placeholder="nama@email.com"]', email)
await page.fill('input[placeholder="••••••••"]', password)
await page.click('button:has-text("Masuk Sekarang")', { force: true })
await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 })
console.log('✅ Login Berhasil')

// ─────────────────────────────────────────────
// 2. NAVIGATE TO CREATE
// ─────────────────────────────────────────────
await page.goto('http://localhost:5173/')
await page.click('button:has-text("Buat Undangan")', { force: true })

// ─────────────────────────────────────────────
// 3. PILIH TEMPLATE
// ─────────────────────────────────────────────
await page.waitForSelector('div:has-text("Pilih Template")', { state: 'visible', timeout: 15000 })
const darkElegantTpl = page.locator('div.bg-white').filter({ hasText: /Dark Elegant/i }).first()
await darkElegantTpl.click({ force: true })
console.log('✅ Template Terpilih')
await page.click('button:has-text("Lanjut")', { force: true })
```

## Mocking

**Framework:** Playwright built-in `page.route()` method

**Patterns:**

1. **Mock API Endpoint:**
```javascript
await page.route('**/promo/validate', (route) => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      success: true,
      data: {
        code: PROMO_CODE,
        discount_type: 'percentage',
        discount_value: 50,
      },
    }),
  })
})
```

2. **Mock Multiple Endpoints in Setup Function** (from `comprehensive-flow.spec.js`):
```javascript
async function setupMocks(pageOrContext) {
  // Auth Mocks
  await pageOrContext.route(`${API_BASE}/auth/login`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, token: 'mock-token', user: mockUser }),
    })
  })

  // Template Mocks
  await pageOrContext.route(`${API_BASE}/template-design`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [mockTemplate] }),
    })
  })
}
```

3. **Conditional Mock Logic:**
```javascript
await pageOrContext.route(`${API_BASE}/invitation`, (route) => {
  if (route.request().method() === 'POST') {
    route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(...) })
  } else {
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(...) })
  }
})
```

4. **Mock localStorage:**
```javascript
await page.addInitScript(() => {
  localStorage.setItem('token', 'mock-token-playwright')
})
```

5. **Mock Global Objects:**
```javascript
await page.addInitScript(() => {
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__ = { disabled: true }
})
```

**What to Mock:**
- External API endpoints (authentication, promo validation, payment)
- Data resources that would require actual backend (templates, invitations, users)
- Heavy or slow operations

**What NOT to Mock:**
- Internal page navigation (router)
- DOM interactions and CSS (let Playwright interact with real UI)
- localStorage (use `addInitScript` to seed it, not mock it)
- Component state (let Vue manage it)

## Fixtures and Factories

**Test Data:**

Mock objects defined at top of test files (from `promo-code.spec.js`):
```javascript
const mockUser = { id: 'user-1', name: 'Test User', email: 'test@test.com', isAdmin: true }

const mockInvitation = {
  id: 'mock-inv-001',
  title: 'Wedding of Test',
  slug: 'wedding-of-test',
  is_premium: true,
  price: 49000,
  template_slug: 'dark-elegant',
  content: { coupleName: 'Test & Test', photoCoupleUrl: null },
}

const mockPromos = [
  {
    id: 'promo-1',
    code: 'NIKAH50',
    discount_type: 'percentage',
    discount_value: 50,
    max_uses: 100,
    used_count: 12,
    valid_from: '2026-01-01T00:00:00.000Z',
    valid_until: '2026-12-31T23:59:59.000Z',
    is_active: true,
  },
  // ...
]
```

**Auth Fixture** (`tests/fixtures/auth.setup.js`):
- Handles initial authentication for test suite
- Uses **real credentials** (test account: `playwright@test.com` / `playwright123`)
- Saves storage state to `playwright/.auth/user.json`
- Acts as dependency for other tests via Playwright project config

```javascript
import { test as setup, expect } from '@playwright/test'

const authFile = path.join(process.cwd(), 'playwright/.auth/user.json')

setup('authenticate', async ({ page }) => {
  const email = 'playwright@test.com'
  const password = 'playwright123'

  await page.goto('http://localhost:5173/')
  await page.click('button:has-text("Masuk")', { force: true })
  await page.fill('input[placeholder="nama@email.com"]', email)
  await page.fill('input[placeholder="••••••••"]', password)
  await page.click('button:has-text("Masuk Sekarang")', { force: true })

  await expect(page).toHaveURL(/.*dashboard/)
  await page.context().storageState({ path: authFile })
})
```

**Location:**
- Fixtures: `tests/fixtures/`
- Mock data: Inline in test files (no separate factory files)
- Auth state: `playwright/.auth/user.json` (generated after first setup run)

## Coverage

**Requirements:** None enforced

**Tracking:** Not actively monitored
- No coverage configuration in `playwright.config.js` or `vitest` setup
- Tests are integration/E2E focused rather than coverage-driven

**View Coverage:**
```bash
# Not configured - would require additional setup
# For Playwright: manual inspection of test output
# For Vitest: npx vitest --coverage (requires @vitest/coverage-* package)
```

## Test Types

**E2E Tests** (Primary - Playwright):
- Scope: Full user workflows from login through checkout
- Approach: Real browser, real DOM, real-time interactions
- Files: `tests/golden-path.spec.js`, `tests/comprehensive-flow.spec.js`, `tests/promo-code.spec.js`
- Timeouts: 60000-240000ms (120-240 seconds per test)
- Retries: 0 (configured in `playwright.config.js`)
- Browser: Chromium via Desktop Chrome device profile
- Screenshots: Enabled on failure (`screenshot: 'on'`)
- Traces: Enabled on first retry (`trace: 'on-first-retry'`)

**Unit Tests** (Minimal - Vitest):
- Scope: Pure logic (e.g., name decoding in `InvitationView.spec.js`)
- Approach: Isolated function testing
- Files: `src/__tests__/InvitationView.spec.js` (only example)

**Integration Tests** (Partial - Playwright with real endpoints):
- Some tests hit real backend (golden path tests)
- Some tests mock APIs (promo code test with mocked endpoints)
- File uploads use real test images: `path.resolve('test_image.jpg')`

## Common Patterns

**Async Testing:**

All Playwright tests are async. Pattern:
```javascript
test('should do something', async ({ page, context }) => {
  // All interactions are awaited
  await page.goto('...')
  await page.fill('...')
  await page.click('...')
  await expect(page).toHaveURL(...)
})
```

Playwright fixtures provide `page` and `context` automatically. No manual browser management.

**Error Testing:**

No explicit error tests in codebase. Error handling is verified implicitly through flow tests (e.g., login with wrong credentials would fail assertion).

**Setup/Teardown:**

- **Test Setup:** `test.beforeEach()` for per-test setup
- **Suite Setup:** Playwright projects handle setup dependency (`tests/fixtures/auth.setup.js`)
- **Teardown:** Automatic (Playwright handles page cleanup)

Example from `promo-code.spec.js`:
```javascript
test.describe('Promo Code: Checkout Page', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000)

    await setupAuth(page)

    await page.route('**/invitation/slug/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: mockInvitation }),
      })
    })
  })
})
```

**Playwright Configuration** (`playwright.config.js`):
```javascript
export default defineConfig({
  testDir: './tests',
  timeout: 120000,          // 2 min per test
  retries: 0,               // No automatic retries
  reporter: 'list',         // Simple list output
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    screenshot: 'on',       // Capture screenshots on failure
    trace: 'on-first-retry', // Record trace on first retry
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.js/,
    },
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['setup'], // Runs auth.setup.js first
    },
  ],
})
```

**Selector Strategies:**

1. Text-based: `button:has-text("Masuk")`
2. Placeholder-based: `input[placeholder="nama@email.com"]`
3. Locator chains: `page.locator('div.bg-white').filter({ hasText: /Dark Elegant/i }).first()`
4. Data attributes: `div[data-field="brideName"]`
5. ID: `input#bridePhoto`

## Test Data Setup

**Real Test Account:**
- Email: `playwright@test.com`
- Password: `playwright123`
- Used in auth fixture to generate persistent session token
- Token saved to `playwright/.auth/user.json` for test reuse

**Dynamic Data Generation:**
- Timestamps: `'Wedding of Putri and Pangeran ' + Date.now()` - prevents duplicates
- Test image path: `path.resolve('test_image.jpg')` - assumes file exists in repo root

**No Database Fixtures:**
- Tests do not seed database directly
- Data is created through UI interactions
- Auth token persists between tests via storage state

---

*Testing analysis: 2026-04-05*
