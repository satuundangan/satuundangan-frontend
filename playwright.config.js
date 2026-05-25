import { defineConfig, devices } from '@playwright/test'
import path from 'path'

export const STORAGE_STATE = path.join(process.cwd(), 'playwright/.auth/user.json')
const baseURL = process.env.E2E_BASE_URL || 'http://localhost:5173'
const shouldStartLocalServer = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/.test(baseURL)

export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL,
    headless: true,
    screenshot: 'on',
    trace: 'on-first-retry',
  },
  webServer: shouldStartLocalServer ? {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  } : undefined,
  projects: [
    // Setup project
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
      dependencies: ['setup'],
    },
    // Project for tests that mock all API calls and don't need real auth
    {
      name: 'mocked',
      testMatch: /.*\.mocked\.spec\.js/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'production-readonly',
      testMatch: /.*\.production\.spec\.js/,
      retries: 1,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'production-write',
      testMatch: /production-write\.production\.spec\.js/,
      retries: 1,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
