import { test, expect } from '@playwright/test';

test('simple goto', async ({ page }) => {
  await page.goto('http://[::1]:5173/', { timeout: 60000 });
  await expect(page).toHaveTitle(/Satu Undangan/);
});
