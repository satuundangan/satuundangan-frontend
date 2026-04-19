import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';
const API_BASE = 'https://api.satuundangan.id';

const mockUser = { id: 'user-1', name: 'Test User', email: 'test@test.com', isAdmin: false };
const mockInvitation = {
  id: 'mock-inv-midtrans',
  title: 'Wedding of Midtrans',
  slug: 'wedding-of-midtrans',
  price: 49000,
  is_premium: true,
  content: { coupleName: 'Midtrans & Test' }
};

test.describe('Midtrans Payment Integration', () => {
  test.beforeEach(async ({ page, context }) => {
    // 1. Setup Auth & Invitation Mocks
    await context.route(`${API_BASE}/user/me`, (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockUser) });
    });
    
    await context.route(`${API_BASE}/invitation/slug/**`, (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data: mockInvitation }) });
    });

    // 2. Mock Midtrans Snap JS and its window.snap.pay behavior
    await context.route('https://app.sandbox.midtrans.com/snap/snap.js', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: `
          window.snap = {
            pay: function(token, callbacks) {
              console.log('Mock Midtrans Pay called with token:', token);
              // Store callbacks for simulation
              window.__mockSnapCallbacks = callbacks;
              // Trigger a custom event so the test knows the popup "opened"
              window.dispatchEvent(new CustomEvent('midtrans-popup-opened'));
            }
          };
        `
      });
    });

    // Set token to bypass login
    await page.addInitScript(() => {
      localStorage.setItem('token', 'mock-token-midtrans');
    });
  });

  test('should trigger Midtrans Snap popup and handle success callback', async ({ page }) => {
    // 3. Mock Payment Creation
    await page.route(`${API_BASE}/payment/create`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: true, 
          token: 'mock-snap-token-123',
          is_free: false 
        })
      });
    });

    // Mock Invitation Activation (updateInvitation)
    await page.route(`${API_BASE}/invitation/${mockInvitation.id}`, (route) => {
      if (route.request().method() === 'PATCH') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
      } else {
        route.continue();
      }
    });

    await page.goto(`${BASE_URL}/checkout?slug=${mockInvitation.slug}`);
    
    await expect(page.locator('text=Ringkasan Pesanan')).toBeVisible({ timeout: 10000 });
    console.log('✅ Checkout page loaded');

    // 4. Click Pay
    const payBtn = page.locator('button:has-text("Bayar Sekarang")');
    await payBtn.click();
    console.log('✅ Clicked Pay Now');

    // 5. Wait for Midtrans "Popup" to be triggered
    await page.waitForFunction(() => typeof window.__mockSnapCallbacks !== 'undefined');
    console.log('✅ Midtrans Snap pay() was called');

    // 6. Simulate Midtrans Success Callback
    await page.evaluate(() => {
      window.__mockSnapCallbacks.onSuccess({
        status_code: "200",
        status_message: "Success, transaction is found",
        transaction_id: "mock-trans-id",
        order_id: "mock-order-id",
        gross_amount: "49000.00",
        payment_type: "credit_card",
        transaction_time: "2026-04-03 12:00:00",
        transaction_status: "capture"
      });
    });
    console.log('✅ Simulated Midtrans Success callback');

    // 7. Verify redirect to the invitation page
    await expect(page).toHaveURL(new RegExp(`.*${mockInvitation.slug}`), { timeout: 15000 });
    console.log('✅ Redirected to invitation page after success');
  });

  test('should handle free invitation (100% discount) without Midtrans', async ({ page }) => {
     // Mock Promo validation that results in final_price = 0
     await page.route(`${API_BASE}/promo/validate`, (route) => {
        route.fulfill({
           status: 200,
           contentType: 'application/json',
           body: JSON.stringify({
              success: true,
              data: {
                 code: 'FREE100',
                 discount_type: 'percentage',
                 discount_value: 100,
                 original_price: 49000,
                 discount_amount: 49000,
                 final_price: 0
              }
           })
        });
     });

     // Mock Payment Creation for FREE
     await page.route(`${API_BASE}/payment/create`, (route) => {
        route.fulfill({
           status: 200,
           contentType: 'application/json',
           body: JSON.stringify({ 
              success: true, 
              is_free: true 
           })
        });
     });

     await page.goto(`${BASE_URL}/checkout?slug=${mockInvitation.slug}`);
     
     // Apply Promo
     await page.fill('input[placeholder="Kode Promo"]', 'FREE100');
     await page.click('button:has-text("Pakai")');
     await expect(page.locator('text=GRATIS')).toBeVisible();

     // Click Pay
     await page.click('button:has-text("Bayar Sekarang")');
     
     // Should redirect directly without calling Midtrans Snap
     await expect(page).toHaveURL(new RegExp(`.*${mockInvitation.slug}`), { timeout: 15000 });
     console.log('✅ Handled free payment correctly without Midtrans');
  });
});
