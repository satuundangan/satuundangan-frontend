import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Golden Path: Full Flow with Publication', () => {
  const email = 'fauzan@gmail.com';
  const password = 'fauzan';
  const testImagePath = path.resolve('test_image.jpg');
  const weddingTitle = 'Wedding of Putri and Pangeran ' + Date.now();

  test('should login, create, publish and verify guest access', async ({ page, context }) => {
    test.setTimeout(180000);

    await page.addInitScript(() => {
        window.__VUE_DEVTOOLS_GLOBAL_HOOK__ = { disabled: true };
    });

    // 1. LOGIN
    await page.goto('http://127.0.0.1:5173/');
    await page.click('button:has-text("Masuk")', { force: true });
    await page.fill('input[placeholder="nama@email.com"]', email);
    await page.fill('input[placeholder="••••••••"]', password);
    await page.click('button:has-text("Masuk Sekarang")', { force: true });
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
    console.log('✅ Login Berhasil');

    // 2. CREATE
    await page.goto('http://127.0.0.1:5173/');
    await page.click('button:has-text("Buat Undangan")', { force: true });
    
    // 3. TEMPLATE
    await page.waitForSelector('div:has-text("Pilih Template")', { state: 'visible' });
    const darkElegantTpl = page.locator('div.bg-white').filter({ hasText: /Dark Elegant/i }).first();
    await darkElegantTpl.click({ force: true });
    console.log('✅ Template Terpilih');
    await page.click('button:has-text("Lanjut")', { force: true });

    // 4. FEATURES
    await expect(page).toHaveURL(/.*create/);
    await page.waitForSelector('label.group');
    const featureLabels = page.locator('label.group');
    const count = await featureLabels.count();
    for (let i = 0; i < count; i++) {
        await featureLabels.nth(i).click({ force: true });
    }
    await page.click('button:has-text("Lanjut Isi Data")', { force: true });

    // 5. FORM
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

    // 6. PREVIEW
    await expect(page).toHaveURL(/.*preview/, { timeout: 60000 });
    console.log('✅ Masuk ke Preview');
    
    const publishBtn = page.locator('button').filter({ hasText: /Lanjut Pembayaran|Simpan Perubahan/ });
    await publishBtn.waitFor({ state: 'visible', timeout: 20000 });
    await publishBtn.click({ force: true });
    console.log('✅ Click Publish/Checkout');

    // 7. CHECKOUT
    await expect(page).toHaveURL(/.*checkout/, { timeout: 20000 });
    console.log('✅ Masuk ke Checkout');
    
    const simulateBtn = page.locator('button:has-text("Simulasi Bayar Berhasil")');
    await simulateBtn.waitFor({ state: 'visible', timeout: 10000 });
    page.on('dialog', dialog => dialog.accept());
    await simulateBtn.click({ force: true });
    console.log('✅ Simulasi Berhasil');

    // 8. VERIFY & GUEST
    await page.waitForTimeout(3000);
    await page.goto('http://127.0.0.1:5173/guests');
    const invSelect = page.locator('select').first();
    await invSelect.waitFor({ state: 'visible' });
    await invSelect.selectOption({ label: weddingTitle });
    
    await page.click('button:has-text("Tambah Tamu")', { force: true });
    await page.fill('input[placeholder*="Budi"]', 'Tamu Final');
    await page.click('button:has-text("Simpan")', { force: true });
    
    await page.click('button[title="Kirim WA"]', { force: true });
    await page.waitForSelector('textarea');
    const message = await page.inputValue('textarea');
    const invitationUrl = message.match(/https?:\/\/[^\s]+/)[0].replace('localhost', '127.0.0.1');
    await page.keyboard.press('Escape');

    // 9. RSVP (GUEST SIDE)
    const guestPage = await context.newPage();
    await guestPage.goto(invitationUrl);
    
    // Welcome screen: Wait for guest name and click "Buka Undangan"
    await expect(guestPage.locator('text=Tamu Final')).toBeVisible({ timeout: 30000 });
    console.log('✅ Guest Name visible on Welcome Screen');
    
    await guestPage.click('button:has-text("Buka Undangan")', { force: true });
    console.log('✅ Invitation Opened');

    await guestPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const rsvpNameInput = guestPage.locator('input[placeholder*="Nama"]').first();
    if (await rsvpNameInput.isVisible()) {
        await rsvpNameInput.fill('Tamu Final');
        await guestPage.locator('label').filter({ hasText: /Hadir/ }).click({ force: true });
        await guestPage.locator('textarea').fill('Robot QA Sukses Besar!');
        await guestPage.click('button:has-text("Kirim")', { force: true });
        
        // Wait for success toast (using regex for flexibility)
        await expect(guestPage.locator('text=/terkirim|berhasil/i')).toBeVisible({ timeout: 15000 });
        console.log('✅ RSVP Success Message visible');
    }

    // 10. VERIFY IN GUESTBOOK
    await page.bringToFront();
    await page.goto('http://127.0.0.1:5173/guestbook');
    const guestbookSelect = page.locator('select').first();
    await guestbookSelect.selectOption({ label: weddingTitle });
    await expect(page.locator('text=Tamu Final')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Robot QA Sukses Besar!')).toBeVisible();
    
    console.log('🎉 MISSION ACCOMPLISHED! ALL SYSTEMS GO!');
  });
});
