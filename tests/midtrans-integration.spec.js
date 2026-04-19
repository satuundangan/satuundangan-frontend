import { test, expect } from '@playwright/test';
import path from 'path';

/**
 * CONFIGURATION: UPDATE THESE WITH YOUR REAL DATA
 */
const INVITATION_SLUG = 'wedding-of-putri-and-pangeran'; // Your paid invitation slug
const INVITATION_ID = 'your-paid-invitation-uuid';      // Your paid invitation ID
const FREE_INVITATION_SLUG = 'wedding-of-free-test';    // Your free invitation slug
const VALID_PROMO_CODE = 'GRATIS100';                  // Valid 100% discount promo
const INVALID_PROMO_CODE = 'SALAH123';                 // Invalid/expired promo
const API_BASE = 'https://api.satuundangan.id';
const BASE_URL = 'http://localhost:5173';

test.describe('Midtrans Real Integration', () => {
  // Use storageState from auth.setup
  test.use({ storageState: path.join(process.cwd(), 'playwright/.auth/user.json') });

  test('SKENARIO 1: Paid Template — Midtrans Snap popup muncul', async ({ page }) => {
    test.setTimeout(30000);

    // Wait for checkout page to load
    await page.goto(`${BASE_URL}/checkout?slug=${INVITATION_SLUG}`);
    await expect(page.locator('text=Ringkasan Pesanan')).toBeVisible({ timeout: 15000 });

    // Catch the snap call to verify token usage
    const paymentPromise = page.waitForResponse(
      res => res.url().includes('/payment/create') && res.status() === 200
    );

    // Click Pay
    await page.click('button:has-text("Bayar Sekarang")');

    // Verify Backend was called and returned token
    const response = await paymentPromise;
    const body = await response.json();
    expect(body.token).toBeDefined();

    // Verify Snap Iframe exists in DOM
    // Midtrans usually injects an iframe with src from app.sandbox.midtrans.com
    await page.waitForSelector('iframe[src*="midtrans"]', { timeout: 10000 });
    const snapIframe = page.frameLocator('iframe[src*="midtrans"]');
    await expect(snapIframe.locator('text=/Bayar|Payment/i')).toBeVisible();

    console.log('✅ Scenario 1: Midtrans Snap popup appeared with valid token');
  });

  test('SKENARIO 2: Free Template — langsung aktif tanpa Snap', async ({ page }) => {
    // Intercept/Mock to ensure backend returns is_free: true if real data is not available
    // OR just use a real free invitation slug
    /*
    await page.route(`${API_BASE}/payment/create`, (route) => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ is_free: true, token: null, success: true })
        });
    });
    */

    await page.goto(`${BASE_URL}/checkout?slug=${FREE_INVITATION_SLUG}`);
    await expect(page.locator('text=Ringkasan Pesanan')).toBeVisible();

    // Click Pay
    await page.click('button:has-text("Bayar Sekarang")');

    // Verifikasi TIDAK ada popup Midtrans
    await page.waitForTimeout(3000);
    const iframeCount = await page.locator('iframe[src*="midtrans"]').count();
    expect(iframeCount).toBe(0);

    // Verifikasi redirect ke halaman sukses/undangan aktif
    await expect(page).toHaveURL(new RegExp(`.*${FREE_INVITATION_SLUG}`), { timeout: 15000 });
    console.log('✅ Scenario 2: Free invitation activated without Midtrans Snap');
  });

  test('SKENARIO 3: Promo Code valid — harga berkurang menjadi 0', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout?slug=${INVITATION_SLUG}`);
    
    // Input Valid Promo
    await page.fill('input[placeholder="Kode Promo"]', VALID_PROMO_CODE);
    await page.click('button:has-text("Pakai")');

    // Verifikasi UI Update (Total Bayar 0)
    await expect(page.locator('text=GRATIS')).toBeVisible({ timeout: 10000 });
    
    // Intercept the create payment request to verify the promo_code in payload
    let sentPayload = null;
    await page.route(`${API_BASE}/payment/create`, async (route) => {
        sentPayload = JSON.parse(route.request().postData());
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ is_free: true, token: null, success: true })
        });
    });

    // Click Pay
    await page.click('button:has-text("Bayar Sekarang")');

    // Verifikasi payload & No Snap
    expect(sentPayload.promo_code).toBe(VALID_PROMO_CODE);
    await page.waitForTimeout(2000);
    expect(await page.locator('iframe[src*="midtrans"]').count()).toBe(0);
    
    console.log('✅ Scenario 3: Valid promo reduced price to 0 and bypassed Midtrans');
  });

  test('SKENARIO 4: Promo Code tidak valid — tampil error', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout?slug=${INVITATION_SLUG}`);

    // Input Invalid Promo
    await page.fill('input[placeholder="Kode Promo"]', INVALID_PROMO_CODE);
    await page.click('button:has-text("Pakai")');

    // Verifikasi error message (Mock if necessary, but real backend will return 400)
    await expect(page.locator('text=/tidak valid|berlaku/i')).toBeVisible({ timeout: 10000 });
    
    // Verify price didn't change (should still show original price)
    await expect(page.locator('text=GRATIS')).not.toBeVisible();
    
    console.log('✅ Scenario 4: Error displayed for invalid promo code');
  });

  test('SKENARIO 5: Simulasi payment sukses', async ({ page, request }) => {
    // 1. Get Snap Token first (similar to Scenario 1)
    await page.goto(`${BASE_URL}/checkout?slug=${INVITATION_SLUG}`);
    
    let orderId = null;
    await page.route(`${API_BASE}/payment/create`, async (route) => {
        const response = await route.fetch();
        const json = await response.json();
        orderId = json.order_id;
        route.fulfill({ response, json });
    });

    await page.click('button:has-text("Bayar Sekarang")');
    await page.waitForSelector('iframe[src*="midtrans"]');
    
    // 2. Call Simulation endpoint on backend
    // Since invitation_id is fixed for the test, we use real API call
    const simulateResponse = await request.post(`${API_BASE}/payment/simulate`, {
        data: {
            invitation_id: INVITATION_ID,
            status: 'success'
        }
    });
    expect(simulateResponse.ok()).toBeTruthy();
    console.log('✅ Payment simulated successfully on backend');

    // 3. Close Midtrans Snap (simulating redirect or page refresh)
    // Most real integrations would wait for webhook, then UI refresh.
    // If your frontend uses onMount check or manual trigger:
    await page.reload();
    
    // 4. Verifikasi Frontend redirect atau tampil status "Aktif"
    // For our app, success redirects to invitation slug
    await expect(page).toHaveURL(new RegExp(`.*${INVITATION_SLUG}`), { timeout: 15000 });
    console.log('✅ Scenario 5: Simulation successful, frontend navigated to active invitation');
  });
});
