import { test, expect } from '@playwright/test';

test.describe('Login Debugger', () => {
  const email = 'fauzan@gmail.com';
  const password = 'fauzan';

  test('should analyze login network request', async ({ page }) => {
    // Intercept login request
    page.on('request', request => {
        if (request.url().includes('/auth/login')) {
            console.log(`🌐 API REQUEST: ${request.method()} ${request.url()}`);
        }
    });

    page.on('response', async response => {
        if (response.url().includes('/auth/login')) {
            console.log(`📡 API RESPONSE: ${response.status()}`);
            try {
                const body = await response.json();
                console.log('📦 RESPONSE DATA:', JSON.stringify(body));
            } catch (e) {
                console.log('📦 RESPONSE IS NOT JSON');
            }
        }
    });

    await page.goto('http://localhost:5173/');
    await page.click('button:has-text("Masuk")');
    await page.fill('input[placeholder="nama@email.com"]', email);
    await page.fill('input[placeholder="••••••••"]', password);
    await page.click('button:has-text("Masuk Sekarang")');
    
    await page.waitForTimeout(5000); // Tunggu liat apa yang terjadi
  });
});
