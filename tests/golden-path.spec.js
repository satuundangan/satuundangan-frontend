import { test, expect } from '@playwright/test';

test.describe('Golden Path: Full User Journey (Existing Account)', () => {
  const email = 'fauzan@gmail.com';
  const password = 'fauzan';

  test('should login and complete the full journey', async ({ page, context }) => {
    // 1. LOGIN
    await page.goto('http://localhost:5173/');
    await page.click('button:has-text("Masuk")');
    await page.fill('input[placeholder="nama@email.com"]', email);
    await page.fill('input[placeholder="••••••••"]', password);
    await page.click('button:has-text("Masuk Sekarang")');
    
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    console.log('✅ Login Berhasil!');

    // 2. CREATE: PICK TEMPLATE
    await page.goto('http://localhost:5173/templates');
    await page.waitForSelector('.grid');
    await page.locator('.grid >> div').first().click();
    await page.click('button:has-text("Lanjut")');
    
    await expect(page).toHaveURL(/.*create/);
    console.log('✅ Masuk Halaman Create');
    
    // Isi Form Dasar
    await page.locator('input').first().fill('Wedding Fauzan & Istri');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.click('button:has-text("Simpan")');
    await page.waitForTimeout(2000); 

    // 3. GUEST & SHARE LINK
    await page.goto('http://localhost:5173/guests');
    await page.waitForSelector('button:has-text("Tambah Tamu")');
    await page.click('button:has-text("Tambah Tamu")');
    await page.fill('input[placeholder*="Budi"]', 'Budi & Istri');
    await page.click('button:has-text("Simpan")');
    await expect(page.locator('text=Budi & Istri')).toBeVisible();
    
    // Ambil Link WA
    await page.click('button[title="Kirim WA"]');
    await page.waitForSelector('textarea');
    const message = await page.inputValue('textarea');
    const urlMatch = message.match(/https?:\/\/[^\s]+/);
    const invitationUrl = urlMatch ? urlMatch[0] : null;
    expect(invitationUrl).not.toBeNull();
    console.log('✅ Link Undangan:', invitationUrl);
    await page.keyboard.press('Escape');

    // 4. RSVP (GUEST SIDE)
    const guestPage = await context.newPage();
    await guestPage.goto(invitationUrl);
    await expect(guestPage.locator('text=Budi & Istri')).toBeVisible();
    await guestPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    const rsvpName = guestPage.locator('input[placeholder*="Nama"]').first();
    if (await rsvpName.isVisible()) {
        await rsvpName.fill('Budi & Istri');
        await guestPage.locator('select').selectOption('hadir');
        await guestPage.locator('textarea').fill('Selamat Bang Fauzan! Samawa!');
        await guestPage.click('button:has-text("Kirim")');
        await guestPage.waitForTimeout(2000);
    }

    // 5. VERIFY IN OWNER DASHBOARD
    await page.bringToFront();
    await page.goto('http://localhost:5173/guestbook');
    await expect(page.locator('text=Budi & Istri')).toBeVisible();
    console.log('✅ Ucapan Muncul di Dashboard!');

    // 6. LOGOUT
    await page.click('button:has-text("Logout")');
    await page.click('button:has-text("Ya, Logout")');
    await expect(page).toHaveURL('http://localhost:5173/');
    console.log('🎉 GOLDEN PATH PASSED 100%!');
  });
});
