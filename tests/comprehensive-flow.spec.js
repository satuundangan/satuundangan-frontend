import { test, expect } from '@playwright/test';
import path from 'path';

const BASE_URL = 'http://localhost:5173';
const API_BASE = 'https://api.satuundangan.id';

const mockUser = { id: 'user-1', name: 'Test User', email: 'test@test.com', isAdmin: true };

const mockTemplate = {
  id: 'tpl-1',
  name: 'Dark Elegant',
  description: 'Desain elegan dengan nuansa gelap.',
  previewUrl: '/assets/template1.png',
  category: 'Modern',
  tags: ['premium', 'elegant'],
  paletteColor: ['#1a1a1a', '#c5a059', '#ffffff']
};

const mockInvitation = {
  id: 'mock-inv-001',
  title: 'Wedding of Putri and Pangeran',
  slug: 'wedding-of-putri-and-pangeran',
  is_premium: true,
  is_published: true,
  price: 49000,
  template_slug: 'dark-elegant',
  content: { brideName: 'Putri Salju', groomName: 'Pangeran Tampan', coupleName: 'Putri & Pangeran', photoCoupleUrl: null },
};

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
  {
    id: 'promo-2',
    code: 'DISKON20K',
    discount_type: 'fixed',
    discount_value: 20000,
    max_uses: null,
    used_count: 5,
    valid_from: null,
    valid_until: null,
    is_active: false,
  },
];

// Utility to setup common mocks
async function setupMocks(pageOrContext) {
  // Auth Mocks
  await pageOrContext.route('**/auth/login', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, token: 'mock-token', user: mockUser }),
    });
  });

  await pageOrContext.route('**/user/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUser),
    });
  });

  // Template Mocks
  await pageOrContext.route('**/template-design', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [mockTemplate] }),
    });
  });

  await pageOrContext.route('**/categories', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [{ label: 'Modern', name: 'Modern' }] }),
    });
  });

  // Invitation Mocks
  await pageOrContext.route(url => url.pathname === '/api/invitation' || url.pathname === '/invitation', (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: mockInvitation }),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [mockInvitation] }),
      });
    }
  });

  await pageOrContext.route('**/invitation/slug/**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: mockInvitation }),
    });
  });

  // Payment Mocks
  await pageOrContext.route('**/payment/create', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, token: 'mock-snap-token' }),
    });
  });

  // Guest Mocks
  await pageOrContext.route('**/guest**', (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: { id: 'guest-1', name: 'Tamu Final', slug: 'tamu-final' } }),
      });
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [{ id: 'guest-1', name: 'Tamu Final', invitation_id: mockInvitation.id }] }),
      });
    }
  });

  // Guest Message Mocks (Guestbook)
  await pageOrContext.route('**/guest-messages**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [{ id: 'msg-1', guestName: 'Tamu Final', message: 'Selamat dari Robot QA!', rsvpStatus: 'hadir', createdAt: new Date().toISOString() }] }),
      });
  });
  
  // Master Sections Mocks
  await pageOrContext.route('**/sections', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { key: 'quote', label: 'Quote Ayat / Mutiara' },
        { key: 'photoCouple', label: 'Foto Utama Pasangan' },
        { key: 'loveStory', label: 'Love Story (Cerita Cinta)' },
        { key: 'music', label: 'Musik Latar' },
        { key: 'map', label: 'Peta Lokasi (Google Maps)' },
        { key: 'rsvp', label: 'Konfirmasi Kehadiran (RSVP)' },
        { key: 'wishes', label: 'Kolom Ucapan & Doa' }
      ]),
    });
  });

  // File Upload Mock
  await pageOrContext.route('**/upload', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ fileUrl: 'https://api.satuundangan.id/uploads/mock-image.jpg' }),
    });
  });

  // Dashboard Stats
  await pageOrContext.route('**/dashboard/stats', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: { total_invitations: 1, total_guests: 1, total_messages: 1 } }),
    });
  });
}

test.describe('Comprehensive Golden Path: Full Flow with Promo Code', () => {
  const testImagePath = path.resolve('test_image.jpg');
  const PROMO_CODE = 'NIKAH50';

  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page, context }) => {
    await setupMocks(context);
    await page.addInitScript(() => {
      window.__VUE_DEVTOOLS_GLOBAL_HOOK__ = { disabled: true };
    });
  });

  test('should complete the entire user journey including promo code and RSVP', async ({ page, context }) => {
    test.setTimeout(240000);

    // Mock promo/validate specifically for this test
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
            original_price: 49000,
            discount_amount: 24500,
            final_price: 24500,
          },
        }),
      });
    });

    // 1. LOGIN
    await page.goto(BASE_URL);
    await page.click('button:has-text("Masuk")', { force: true });
    await page.fill('input[placeholder="nama@email.com"]', 'playwright@test.com');
    await page.fill('input[placeholder="••••••••"]', 'playwright123');
    await page.click('button:has-text("Masuk Sekarang")', { force: true });
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
    console.log('✅ Login Berhasil');

    // 2. NAVIGATE TO CREATE
    await page.goto(BASE_URL);
    await page.click('button:has-text("Buat Undangan")', { force: true });

    // 3. PILIH TEMPLATE (di HomeView)
    await page.waitForSelector('div:has-text("Pilih Template")', { state: 'visible', timeout: 15000 });
    
    // Wait for the specific template to appear in the modal grid
    const templateInModal = page.locator('.fixed .grid').locator('text=Dark Elegant');
    await expect(templateInModal).toBeVisible({ timeout: 15000 });
    
    // Target template card inside the modal (it has the "group" class)
    const darkElegantTpl = page.locator('.fixed div.group').filter({ hasText: /Dark Elegant/i }).first();
    await darkElegantTpl.click({ force: true });
    
    // Verify selection (Terpilih text should appear)
    await expect(page.locator('.fixed').getByText('Terpilih', { exact: true })).toBeVisible({ timeout: 5000 });
    console.log('✅ Template Terpilih');
    
    const lanjutBtn = page.locator('button:has-text("Lanjut")');
    await expect(lanjutBtn).not.toBeDisabled();
    await lanjutBtn.click({ force: true });

    // 4. PILIH FITUR (CreateDesign)
    await expect(page).toHaveURL(/.*create/, { timeout: 15000 });
    await page.waitForSelector('label.group', { timeout: 15000 });
    
    // Ensure photoCouple is selected (it's often selected by default)
    const photoCoupleLabel = page.locator('label.group').filter({ hasText: /Foto Utama Pasangan/i });
    const isChecked = await photoCoupleLabel.locator('input[type="checkbox"]').isChecked();
    if (!isChecked) {
      await photoCoupleLabel.click({ force: true });
    }
    
    await page.click('button:has-text("Lanjut Isi Data")', { force: true });

    // 5. ISI FORM (CreateForm)
    await expect(page).toHaveURL(/.*create\/form/, { timeout: 15000 });
    console.log('✅ Masuk ke Form');

    await page.fill('div[data-field="brideName"] input', 'Putri Salju');
    await page.setInputFiles('input#bridePhoto', testImagePath);
    await page.fill('div[data-field="groomName"] input', 'Pangeran Tampan');
    await page.setInputFiles('input#groomPhoto', testImagePath);
    await page.fill('div[data-field="title"] input', mockInvitation.title);
    await page.click('text=Satu Lokasi / Waktu', { force: true });
    await page.fill('input[type="datetime-local"]', '2026-12-31T19:00');
    await page.fill('div[data-field="map"] input', 'https://maps.app.goo.gl/example');
    await page.setInputFiles('div[data-field="photoCouple"] input[type="file"]', testImagePath);

    const saveBtn = page.locator('button:has-text("Preview Undangan")');
    await saveBtn.scrollIntoViewIfNeeded();
    await saveBtn.click({ force: true });

    // 6. PREVIEW
    await expect(page).toHaveURL(/.*preview/, { timeout: 60000 });
    console.log('✅ Masuk ke Preview');

    const publishBtn = page.locator('button').filter({ hasText: /Lanjut Pembayaran|Simpan Perubahan/ });
    await publishBtn.waitFor({ state: 'visible', timeout: 20000 });
    await publishBtn.click({ force: true });
    console.log('✅ Click Lanjut Pembayaran');

    // 7. CHECKOUT — integrasi promo code
    await expect(page).toHaveURL(/.*checkout/, { timeout: 20000 });
    console.log('✅ Masuk ke Checkout');

    await page.waitForSelector('text=Ringkasan Pesanan', { timeout: 15000 });

    const promoInput = page.locator('input[placeholder="Kode Promo"]');
    await expect(promoInput).toBeVisible({ timeout: 10000 });
    await promoInput.fill(PROMO_CODE);
    await page.click('button:has-text("Pakai")', { force: true });

    await expect(page.locator('.bg-green-50.border-green-200')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.bg-green-50.border-green-200')).toContainText(PROMO_CODE);
    await expect(page.locator('text=Diskon')).toBeVisible();
    console.log(`✅ Promo Code ${PROMO_CODE} berhasil diaplikasikan`);

    const totalArea = page.locator('text=Total Bayar').locator('../..');
    await expect(totalArea).toContainText('24.500', { timeout: 5000 });
    console.log('✅ Harga final sudah didiskon');

    // Gunakan simulasi bayar (Dev Only)
    const simulateBtn = page.locator('button:has-text("Simulasi Bayar Berhasil")');
    await simulateBtn.waitFor({ state: 'visible', timeout: 10000 });
    page.on('dialog', dialog => dialog.accept());
    await simulateBtn.click({ force: true });
    console.log('✅ Simulasi Pembayaran Berhasil');

    // 8. TAMBAH TAMU & SHARE LINK
    await page.waitForTimeout(2000);
    await page.goto(`${BASE_URL}/guests`);

    const invSelect = page.locator('select').first();
    await invSelect.waitFor({ state: 'visible', timeout: 15000 });
    // In our mock, the title matches
    await invSelect.selectOption({ label: mockInvitation.title });

    await page.click('button:has-text("Tambah Tamu")', { force: true });
    await page.fill('input[placeholder*="Budi"]', 'Tamu Final');
    await page.click('button:has-text("Simpan")', { force: true });
    console.log('✅ Tamu ditambahkan');

    // Mocking the share link because we don't have a real backend to generate it
    const invitationUrl = `${BASE_URL}/wedding-of-putri-and-pangeran?to=Tamu+Final`;

    // 9. RSVP DARI SISI TAMU
    const guestPage = await context.newPage();
    guestPage.on('dialog', dialog => dialog.accept());
    await guestPage.goto(invitationUrl);

    await expect(guestPage.locator('text=Tamu Final')).toBeVisible({ timeout: 30000 });
    console.log('✅ Nama Tamu visible di halaman undangan');

    await guestPage.click('button:has-text("Buka Undangan")', { force: true });
    console.log('✅ Undangan Dibuka');

    // Wait for animation and scroll to RSVP
    await guestPage.waitForTimeout(2000);
    const rsvpSection = guestPage.locator('section#rsvp');
    await rsvpSection.scrollIntoViewIfNeeded();
    await expect(rsvpSection).toBeVisible();

    const rsvpNameInput = guestPage.locator('input[placeholder*="Nama"]').first();
    if (await rsvpNameInput.isVisible({ timeout: 10000 })) {
      await rsvpNameInput.fill('Tamu Final');
      
      // Select attendance
      const hadirOption = rsvpSection.locator('label').filter({ hasText: /Hadir/i }).first();
      await hadirOption.click({ force: true });
      
      await guestPage.locator('textarea').fill('Selamat dari Robot QA! Promo code works!');
      
      // Mocking guest message POST
      await guestPage.route(`${API_BASE}/guest-messages`, (route) => {
          route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ success: true }) });
      });
      
      console.log('✅ RSVP Form Filled, clicking Kirim');
      
      const sendBtn = guestPage.locator('button:has-text("Kirim")');
      await sendBtn.scrollIntoViewIfNeeded();
      await sendBtn.click({ force: true });
      
      // Wait for the success toast or form reset (simpler: wait for either)
      await expect(guestPage.getByText(/Terima kasih|terkirim|berhasil/i)).toBeVisible({ timeout: 15000 });
      console.log('✅ RSVP Berhasil dikirim');
    }

    // 10. VERIFIKASI DI GUESTBOOK
    await page.bringToFront();
    await page.goto(`${BASE_URL}/guestbook`);
    const guestbookSelect = page.locator('select').first();
    await guestbookSelect.waitFor({ state: 'visible', timeout: 10000 });
    await expect(page.locator('text=Tamu Final')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Selamat dari Robot QA!')).toBeVisible();

    console.log('🎉 COMPREHENSIVE GOLDEN PATH COMPLETE!');
  });
});

test.describe('Promo Code: Specific Scenarios', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupMocks(context);
    // Set token in localStorage to bypass login
    await page.addInitScript(() => {
        localStorage.setItem('token', 'mock-token-playwright');
    });
  });

  test('should show error for invalid promo code', async ({ page }) => {
    await page.route(`${API_BASE}/promo/validate`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Kode promo tidak valid atau sudah tidak berlaku',
        }),
      });
    });

    await page.goto(`${BASE_URL}/checkout?slug=${mockInvitation.slug}`);
    await expect(page.locator('input[placeholder="Kode Promo"]')).toBeVisible({ timeout: 10000 });

    await page.fill('input[placeholder="Kode Promo"]', 'INVALID123');
    await page.click('button:has-text("Pakai")');

    await expect(page.locator('text=Kode promo tidak valid atau sudah tidak berlaku')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.bg-green-50.border-green-200')).not.toBeVisible();
    console.log('✅ Error message shown for invalid code');
  });

  test('should remove applied promo when clicking Hapus', async ({ page }) => {
    await page.route(`${API_BASE}/promo/validate`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            code: 'DISKON20',
            discount_type: 'fixed',
            discount_value: 20000,
            original_price: 49000,
            discount_amount: 20000,
            final_price: 29000,
          },
        }),
      });
    });

    await page.goto(`${BASE_URL}/checkout?slug=${mockInvitation.slug}`);
    await page.fill('input[placeholder="Kode Promo"]', 'DISKON20');
    await page.click('button:has-text("Pakai")');
    await expect(page.locator('.bg-green-50.border-green-200')).toBeVisible({ timeout: 5000 });

    await page.click('button:has-text("Hapus")');
    await expect(page.locator('input[placeholder="Kode Promo"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.bg-green-50.border-green-200')).not.toBeVisible();
    console.log('✅ Promo removed, input restored');
  });
});

test.describe('Promo Code: Admin Management', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupMocks(context);
    await page.addInitScript(() => {
        localStorage.setItem('token', 'mock-token-playwright');
    });
    
    await context.route(`${API_BASE}/admin/promo-codes**`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: mockPromos, total: mockPromos.length }),
      });
    });
  });

  test('should show promo codes table in admin', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/promo-codes`);
    await expect(page.locator('text=NIKAH50')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=DISKON20K')).toBeVisible();
    console.log('✅ Promo codes table rendered with data');
  });

  test('should open create form and send uppercase code', async ({ page }) => {
    let createPayload = null;
    await page.route(`${API_BASE}/admin/promo-codes`, (route) => {
      if (route.request().method() === 'POST') {
        createPayload = JSON.parse(route.request().postData() || '{}');
        route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ success: true }) });
      }
    });

    await page.goto(`${BASE_URL}/admin/promo-codes`);
    await page.click('button:has-text("Tambah Promo")', { force: true });
    await page.fill('input[placeholder="Contoh: NIKAH50"]', 'testpromo');
    await page.selectOption('select', 'fixed');
    await page.fill('input[placeholder="50"]', '15000');
    await page.click('button:has-text("Simpan")', { force: true });

    await page.waitForTimeout(1000);
    expect(createPayload?.code).toBe('TESTPROMO');
    console.log('✅ Create payload correct, code is uppercased');
  });
});
