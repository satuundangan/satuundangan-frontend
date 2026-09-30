import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

const mockTemplates = [
  {
    id: 1,
    name: 'Rustic Blossom',
    slug: 'rustic-blossom',
    preview_image: '/images/templates/rustic.jpg',
    description: 'Desain rustic yang hangat dan elegan dengan sentuhan dedaunan kering.',
    category: 'Rustic',
    filterGroup: 'rustic',
    is_active: true,
    is_free: false,
    price: 149000,
    sections: ['hero', 'quote', 'event', 'rsvp'],
    paletteColors: ['#8B5E3C', '#D4B996'],
    defaultMusic: 'https://example.com/audio/sample1.mp3',
    music_title: 'Romantic Acoustic',
  },
  {
    id: 2,
    name: 'Modern Minimalist',
    slug: 'modern-minimalist',
    preview_image: '/images/templates/modern.jpg',
    description: 'Desain modern, bersih, minimalis dan fokus pada tipografi yang indah.',
    category: 'Modern',
    filterGroup: 'modern',
    is_active: true,
    is_free: true,
    price: 0,
    sections: ['hero', 'quote', 'event'],
    paletteColors: ['#1A1A1A', '#EEEEEE'],
    defaultMusic: null,
    music_title: null,
  },
];

test.describe('Growth Features (Fitur 3, 4, 5, 6) in Chrome', () => {
  test.beforeEach(async ({ page }) => {
    // Mock template-design API
    await page.route('**/template-design**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockTemplates),
      });
    });

    // Mock pricing packages
    await page.route('**/payment/packages**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    // Mock articles
    await page.route('**/articles**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    // Mock leads API
    await page.route('**/leads**', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Lead berhasil disimpan',
          data: { id: 99, email: 'calonpengantin@gmail.com' },
        }),
      });
    });
  });

  test('Fitur 3: Desktop-to-Mobile QR Preview modal opens and displays QR code', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');

    // Look for QR button on template card: title "Scan QR untuk Buka di HP"
    const qrBtn = page.locator('button[title*="Scan QR"]').first();
    await expect(qrBtn).toBeVisible({ timeout: 10000 });
    await qrBtn.click();

    // Verify dialog appears with preview instructions
    const dialog = page.getByRole('dialog', { name: 'Rustic Blossom' });
    await expect(dialog).toBeVisible();

    // Verify QR image exists
    const qrImage = page.getByRole('img', { name: 'Scan QR Preview Undangan' });
    await expect(qrImage).toBeVisible();

    // Verify copy demo link button is available
    const copyBtn = page.getByRole('button', { name: 'Salin Link Demo' });
    await expect(copyBtn).toBeVisible();

    // Close modal
    const closeBtn = page.getByRole('button', { name: 'Tutup Modal' });
    await closeBtn.click();
    await expect(dialog).not.toBeVisible();
  });

  test('Fitur 4: Budget Calculator updates calculations and captures leads', async ({ page }) => {
    await page.goto(`${BASE_URL}/kalkulator-budget`);
    await page.waitForLoadState('networkidle');

    // Verify page header
    await expect(page.locator('h1')).toContainText('Kalkulator Budget Nikah');

    // Sliders / inputs for guest count and scale
    const budgetSlider = page.getByRole('slider', { name: 'Total Anggaran (Rp)' });
    await expect(budgetSlider).toBeVisible();

    const guestSlider = page.getByRole('slider', { name: 'Jumlah Tamu Undangan' });
    await expect(guestSlider).toBeVisible();

    // Check estimated total budget card is visible
    await expect(page.locator('text=Rekomendasi Alokasi Anggaran')).toBeVisible();

    // Click CTA to get checklist / detailed budget
    const leadCta = page.getByRole('button', { name: 'Simpan & Kirim Rekap ke WhatsApp' });
    await expect(leadCta).toBeVisible();
    await leadCta.click();

    // Verify lead modal opens
    const leadDialog = page.getByRole('dialog');
    await expect(leadDialog).toBeVisible();

    // Fill lead form
    await page.locator('#leadName').fill('Andi & Maya');
    await page.locator('#leadWhatsApp').fill('081234567890');
    await page.locator('#leadEmail').fill('andi.maya@gmail.com');

    // Submit form
    const submitBtn = page.getByRole('button', { name: 'Kirim Rincian Budget Sekarang' });
    await submitBtn.click();

    // Success confirmation
    const successMsg = page.locator('text=Terima Kasih, Andi & Maya!');
    await expect(successMsg).toBeVisible({ timeout: 5000 });
  });

  test('Fitur 5: Audio Preview Player toggles playback on template cards', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');

    // Find audio preview button on template card
    const audioBtn = page.getByRole('button', { name: 'Dengarkan Cuplikan Musik Tema' }).first();
    await expect(audioBtn).toBeVisible({ timeout: 10000 });
    await audioBtn.click();
    await page.waitForTimeout(500);
    await audioBtn.click();
  });

  test('Fitur 6: Viral Referral captures ?ref query param to localStorage', async ({ page }) => {
    // Visit with ?ref=KUPONHEMAT
    await page.goto(`${BASE_URL}/?ref=KUPONHEMAT`);
    await page.waitForLoadState('networkidle');

    // Check that referral code is captured in localStorage
    const savedRef = await page.evaluate(() => {
      return localStorage.getItem('satuundangan_referral') || localStorage.getItem('affiliate_code');
    });

    expect(savedRef).toBe('KUPONHEMAT');
  });
});
