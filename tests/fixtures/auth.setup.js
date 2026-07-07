import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(process.cwd(), 'playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Use real login credentials
  const email = 'playwright@test.com'; 
  const password = 'playwright123';

  await page.goto('http://localhost:5173/');
  await page.click('button:has-text("Masuk")', { force: true });
  await page.fill('input[placeholder="nama@email.com"]', email);
  await page.fill('input[placeholder="••••••••"]', password);

  // Wait for the Cloudflare Turnstile widget to finish loading and auto-verify
  // (sandbox site key always-passes, but still needs the api.js round trip)
  // before submitting — otherwise the form guard blocks submission because
  // turnstileToken is still empty.
  await page.waitForFunction(() => {
    const input = document.querySelector('input[name="cf-turnstile-response"]')
    return !!input && input.value.length > 0
  });

  await page.click('button:has-text("Masuk Sekarang")', { force: true });

  // After login, the router either lands on /legal-consent (account has never
  // agreed to ToS/Privacy) or goes straight to /dashboard (already approved).
  // Don't assume either path — wait for whichever one actually happens.
  await page.waitForURL(/\/(legal-consent|dashboard)/, { timeout: 30000 });

  if (/\/legal-consent/.test(page.url())) {
    await page.check('#tos');
    await page.check('#privacy');
    await page.click('button:has-text("Setuju & Lanjut ke Dashboard")');
    await page.waitForURL(/.*dashboard/, { timeout: 30000 });
  }

  await expect(page).toHaveURL(/.*dashboard/);

  // Save storage state to a file
  await page.context().storageState({ path: authFile });
});
