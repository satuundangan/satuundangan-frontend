import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

const mockResellerProfile = {
  id: 1,
  affiliateCode: 'RESELLER123',
  tier: 'bronze',
  status: 'active',
  bankName: 'BCA',
  bankAccountNumber: '1234567890',
  bankAccountName: 'John Doe',
  totalSales: 5,
  user: { name: 'John Doe' }
};

const mockDashboard = {
  affiliateCode: 'RESELLER123',
  status: 'active',
  balance: {
    pending: 50000,
    cleared: 150000,
    withdrawn: 0,
    availableToWithdraw: 150000,
  },
  tier: {
    current: 'bronze',
    totalSales: 5,
    nextTier: 'silver',
    salesNeededForNextTier: 5,
    nextTierMinSales: 10,
  },
};

const mockCommissions = {
  data: [
    {
      id: 1,
      buyerName: 'Budi Pembeli',
      grossAmount: 150000,
      commissionRate: 0.1,
      commissionAmount: 15000,
      tier: 'bronze',
      status: 'cleared',
      createdAt: new Date().toISOString(),
    }
  ],
  total: 1,
  page: 1,
  limit: 10,
};

const mockWithdrawals = {
  data: [
    {
      id: 1,
      requestedAmount: 50000,
      status: 'pending',
      createdAt: new Date().toISOString(),
      adminNote: null,
      affiliateProfile: mockResellerProfile
    }
  ]
};

async function setupAffiliateMocks(page) {
  // Auth Mock
  await page.route('**/user/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 1, name: 'John Doe', email: 'john@test.com', isAdmin: true }),
    });
  });

  // Profile Mock
  await page.route('**/api/affiliate/profile', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockResellerProfile),
    });
  });

  // Dashboard Mock
  await page.route('**/api/affiliate/dashboard', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockDashboard),
    });
  });

  // Commissions Mock
  await page.route('**/api/affiliate/commissions**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockCommissions),
    });
  });

  // Withdrawals Mock
  await page.route('**/api/affiliate/withdrawals**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockWithdrawals),
    });
  });

  // Admin Resellers Mock
  await page.route('**/api/admin/affiliate/resellers**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [mockResellerProfile], total: 1 }),
    });
  });

  // Admin Withdraw Queue Mock
  await page.route('**/api/admin/affiliate/withdrawals**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: mockWithdrawals.data, total: 1 }),
    });
  });
}

test.describe('Affiliate System Flow', () => {
  test.beforeEach(async ({ page }) => {
    await setupAffiliateMocks(page);
    await page.addInitScript(() => {
      localStorage.setItem('token', 'mock-token-playwright');
    });
  });

  test('should navigate to affiliate dashboard and show correct stats', async ({ page }) => {
    await page.goto(`${BASE_URL}/affiliate/dashboard`, { waitUntil: 'networkidle' });
    
    // Check balance stats using more robust text matching
    await expect(page.getByText('Tersedia (Cleared)', { exact: false })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Rp 150.000').first()).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'Tertunda (Pending)' })).toBeVisible();
    await expect(page.getByText('Rp 50.000').first()).toBeVisible();

    // Check tier info
    await expect(page.getByText('Status Tier: Bronze')).toBeVisible();
    await expect(page.getByText('5 / 10 Penjualan')).toBeVisible();

    // Check commission history
    await expect(page.getByText('Budi Pembeli')).toBeVisible();
    await expect(page.getByText('Siap Cair').first()).toBeVisible();

    console.log('✅ Affiliate Dashboard verifikasi berhasil');
  });

  test('should handle withdrawal request submission', async ({ page }) => {
    await page.goto(`${BASE_URL}/affiliate/dashboard`, { waitUntil: 'networkidle' });

    // In our mock, there is already a pending withdrawal
    await expect(page.getByText(/Anda memiliki permintaan penarikan yang sedang diproses/)).toBeVisible({ timeout: 10000 });
    
    // Check history
    await expect(page.getByRole('cell', { name: 'Rp 50.000' }).first()).toBeVisible();
    await expect(page.getByText('Diproses').first()).toBeVisible();

    console.log('✅ Withdrawal status verifikasi berhasil');
  });

  test('should pre-fill affiliate code from URL in checkout', async ({ page }) => {
    // Mock invitation lookup for checkout
    await page.route('**/api/invitation/my/slug/test-inv', (route) => {
        console.log('[MOCK]: Intercepted invitation lookup');
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true, data: { id: 1, title: 'Test Invitation', slug: 'test-inv', price: 49000 } }),
        });
    });

    // Visit checkout with ref param
    await page.goto(`${BASE_URL}/checkout?slug=test-inv&ref=RESELLER123`, { waitUntil: 'networkidle' });

    // Check if affiliate code is pre-filled
    const codeInput = page.locator('input[placeholder*="Kode Afiliasi"]');
    await expect(codeInput).toHaveValue('RESELLER123', { timeout: 10000 });
    
    console.log('✅ Affiliate code auto-populated dari URL');
  });
});

test.describe('Admin Affiliate Management', () => {
  test.beforeEach(async ({ page }) => {
    await setupAffiliateMocks(page);
    await page.addInitScript(() => {
      localStorage.setItem('token', 'mock-token-playwright');
    });
  });

  test('should show reseller list in admin panel', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/affiliate/resellers`);
    await expect(page.getByText('Manajemen Reseller')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('RESELLER123')).toBeVisible();
    console.log('✅ Admin Reseller list verifikasi berhasil');
  });

  test('should show withdrawal queue in admin panel', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/affiliate/withdrawals`, { waitUntil: 'networkidle' });
    await expect(page.getByText('Antrean Penarikan Dana')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('John Doe').first()).toBeVisible();
    await expect(page.getByText('Rp 50.000')).toBeVisible();
    await expect(page.getByText('Setujui')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Tolak', exact: true })).toBeVisible();
    console.log('✅ Admin Withdrawal queue verifikasi berhasil');
  });
});
