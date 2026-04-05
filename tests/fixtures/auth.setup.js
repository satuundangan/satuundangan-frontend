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
  await page.click('button:has-text("Masuk Sekarang")', { force: true });

  await expect(page).toHaveURL(/.*dashboard/);

  // Save storage state to a file
  await page.context().storageState({ path: authFile });
});
