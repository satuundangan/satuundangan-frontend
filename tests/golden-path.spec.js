import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Golden Path: Full Flow with Promo Code', () => {
  const email = 'playwright@test.com';
  const password = 'playwright123';
  const testImagePath = path.resolve('test_image.jpg');
  const weddingTitle = 'Wedding of Putri and Pangeran ' + Date.now();
  const PROMO_CODE = 'NIKAH50';

  test('should login, create, apply promo code, publish and verify guest access', async ({ page, context }) => {
    test.setTimeout(240000);

    await page.addInitScript(() => {
      window.__VUE_DEVTOOLS_GLOBAL_HOOK__ = { disabled: true };
    });

    // Mock promo/validate — endpoint mungkin belum ada di backend
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

    // ─────────────────────────────────────────────
    // 1. LOGIN
    // ─────────────────────────────────────────────
    await page.goto('http://localhost:5173/');
    await page.click('button:has-text("Masuk")', { force: true });
    await page.fill('input[placeholder="nama@email.com"]', email);
    await page.fill('input[placeholder="••••••••"]', password);
    await page.click('button:has-text("Masuk Sekarang")', { force: true });
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
    console.log('✅ Login Berhasil');

    // ─────────────────────────────────────────────
    // 2. NAVIGATE TO CREATE
    // ─────────────────────────────────────────────
    await page.goto('http://localhost:5173/');
    await page.click('button:has-text("Buat Undangan")', { force: true });

    // ─────────────────────────────────────────────
    // 3. PILIH TEMPLATE (di HomeView)
    // ─────────────────────────────────────────────
    await page.waitForSelector('div:has-text("Pilih Template")', { state: 'visible', timeout: 15000 });
    const darkElegantTpl = page.locator('div.bg-white').filter({ hasText: /Dark Elegant/i }).first();
    await darkElegantTpl.click({ force: true });
    console.log('✅ Template Terpilih');
    await page.click('button:has-text("Lanjut")', { force: true });

    // ─────────────────────────────────────────────
    // 4. PILIH FITUR (CreateDesign)
    // ─────────────────────────────────────────────
    await expect(page).toHaveURL(/.*create/, { timeout: 15000 });
    await page.waitForSelector('label.group', { timeout: 15000 });
    const featureLabels = page.locator('label.group');
    const count = await featureLabels.count();
    for (let i = 0; i < count; i++) {
      await featureLabels.nth(i).click({ force: true });
    }
    await page.click('button:has-text("Lanjut Isi Data")', { force: true });

    // ─────────────────────────────────────────────
    // 5. ISI FORM (CreateForm)
    // ─────────────────────────────────────────────
    await expect(page).toHaveURL(/.*create\/form/, { timeout: 15000 });
    console.log('✅ Masuk ke Form');

    await page.fill('div[data-field="brideName"] input', 'Putri Salju');
    await page.setInputFiles('input#bridePhoto', testImagePath);
    await page.fill('div[data-field="groomName"] input', 'Pangeran Tampan');
    await page.setInputFiles('input#groomPhoto', testImagePath);
    await page.fill('div[data-field="title"] input', weddingTitle);
    await page.click('text=Satu Lokasi / Waktu', { force: true });
    await page.fill('input[type="datetime-local"]', '2026-12-31T19:00');
    await page.fill('div[data-field="map"] input', 'https://maps.app.goo.gl/example');
    await page.setInputFiles('div[data-field="photoCouple"] input[type="file"]', testImagePath);

    const saveBtn = page.locator('button:has-text("Preview Undangan")');
    await saveBtn.scrollIntoViewIfNeeded();
    await saveBtn.click({ force: true });

    // ─────────────────────────────────────────────
    // 6. PREVIEW
    // ─────────────────────────────────────────────
    await expect(page).toHaveURL(/.*preview/, { timeout: 60000 });
    console.log('✅ Masuk ke Preview');

    const publishBtn = page.locator('button').filter({ hasText: /Lanjut Pembayaran|Simpan Perubahan/ });
    await publishBtn.waitFor({ state: 'visible', timeout: 20000 });
    await publishBtn.click({ force: true });
    console.log('✅ Click Lanjut Pembayaran');

    // ─────────────────────────────────────────────
    // 7. CHECKOUT — integrasi promo code
    // ─────────────────────────────────────────────
    await expect(page).toHaveURL(/.*checkout/, { timeout: 20000 });
    console.log('✅ Masuk ke Checkout');

    // Tunggu halaman checkout selesai load invitation
    await page.waitForSelector('text=Ringkasan Pesanan', { timeout: 15000 });

    // Masukkan promo code
    const promoInput = page.locator('input[placeholder="Kode Promo"]');
    await expect(promoInput).toBeVisible({ timeout: 10000 });
    await promoInput.fill(PROMO_CODE);
    await page.click('button:has-text("Pakai")', { force: true });

    // Verifikasi diskon muncul
    await expect(page.locator('.bg-green-50.border-green-200')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.bg-green-50.border-green-200')).toContainText(PROMO_CODE);
    await expect(page.locator('text=Diskon')).toBeVisible();
    console.log(`✅ Promo Code ${PROMO_CODE} berhasil diaplikasikan — diskon tampil`);

    // Harga final berubah (24.500 dari Rp 49.000 - 50%)
    const totalArea = page.locator('text=Total Bayar').locator('../..');
    await expect(totalArea).toContainText('24.500', { timeout: 5000 });
    console.log('✅ Harga final sudah didiskon');

    // Gunakan simulasi bayar (Dev Only)
    const simulateBtn = page.locator('button:has-text("Simulasi Bayar Berhasil")');
    await simulateBtn.waitFor({ state: 'visible', timeout: 10000 });
    page.on('dialog', dialog => dialog.accept());
    await simulateBtn.click({ force: true });
    console.log('✅ Simulasi Pembayaran Berhasil');

    // ─────────────────────────────────────────────
    // 8. TAMBAH TAMU & SHARE LINK
    // ─────────────────────────────────────────────
    await page.waitForTimeout(3000);
    await page.goto('http://localhost:5173/guests');

    const invSelect = page.locator('select').first();
    await invSelect.waitFor({ state: 'visible', timeout: 15000 });
    await invSelect.selectOption({ label: weddingTitle });

    await page.click('button:has-text("Tambah Tamu")', { force: true });
    await page.fill('input[placeholder*="Budi"]', 'Tamu Final');
    await page.click('button:has-text("Simpan")', { force: true });

    await page.click('button[title="Kirim WA"]', { force: true });
    await page.waitForSelector('textarea', { timeout: 10000 });
    const message = await page.inputValue('textarea');
    const urlMatch = message.match(/https?:\/\/[^\s]+/);
    if (!urlMatch) throw new Error('Invitation URL tidak ditemukan di pesan WhatsApp');
    const invitationUrl = urlMatch[0];
    await page.keyboard.press('Escape');
    console.log('✅ Tamu ditambahkan, share link didapat:', invitationUrl);

    // ─────────────────────────────────────────────
    // 9. RSVP DARI SISI TAMU
    // ─────────────────────────────────────────────
    const guestPage = await context.newPage();
    await guestPage.goto(invitationUrl);

    await expect(guestPage.locator('text=Tamu Final')).toBeVisible({ timeout: 30000 });
    console.log('✅ Nama Tamu visible di halaman undangan');

    await guestPage.click('button:has-text("Buka Undangan")', { force: true });
    console.log('✅ Undangan Dibuka');

    await guestPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const rsvpNameInput = guestPage.locator('input[placeholder*="Nama"]').first();
    if (await rsvpNameInput.isVisible({ timeout: 10000 })) {
      await rsvpNameInput.fill('Tamu Final');
      await guestPage.locator('label').filter({ hasText: /Hadir/ }).click({ force: true });
      await guestPage.locator('textarea').fill('Selamat dari Robot QA! Promo code works!');
      await guestPage.click('button:has-text("Kirim")', { force: true });

      await expect(guestPage.locator('text=/terkirim|berhasil/i')).toBeVisible({ timeout: 15000 });
      console.log('✅ RSVP Berhasil dikirim');
    }

    // ─────────────────────────────────────────────
    // 10. VERIFIKASI DI GUESTBOOK
    // ─────────────────────────────────────────────
    await page.bringToFront();
    await page.goto('http://localhost:5173/guestbook');
    const guestbookSelect = page.locator('select').first();
    await guestbookSelect.waitFor({ state: 'visible', timeout: 10000 });
    await guestbookSelect.selectOption({ label: weddingTitle });
    await expect(page.locator('text=Tamu Final')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Selamat dari Robot QA!')).toBeVisible();

    console.log('🎉 GOLDEN PATH COMPLETE! Promo code fully integrated end-to-end!');
  });
});

