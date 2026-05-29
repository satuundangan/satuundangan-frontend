import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

test.describe('Create Form stale draft recovery', () => {
  test('edit mode uses the invitation template instead of stale selectedTemplate', async ({ page, context }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'fake-jwt-token')
      localStorage.setItem(
        'selectedTemplate',
        JSON.stringify({ id: 1, name: 'Dark Elegant', slug: 'dark-elegant', isPremium: false }),
      )
      localStorage.setItem('selectedSections', JSON.stringify(['cover']))
    })

    await context.route('**/api/user/me', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 1, name: 'Tester', email: 'tester@example.com', isApproved: true }),
      }),
    )
    await context.route('**/api/admin/audio/public**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }),
    )
    await context.route('**/api/invitation/42', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 42,
          title: 'Edit Wedding',
          slug: 'edit-wedding',
          templateDesignId: 2,
          templateDesign: {
            id: 2,
            name: 'Light Modern',
            slug: 'light-modern',
            isPremium: true,
          },
          selectedSections: ['cover', 'music', 'footer'],
          brideName: 'Putri',
          groomName: 'Putra',
          bridePhotoUrl: 'https://example.com/bride.jpg',
          groomPhotoUrl: 'https://example.com/groom.jpg',
          photoCoupleUrl: 'https://example.com/couple.jpg',
          parents: {
            brideParents: 'Bpk. Bride & Ibu Bride',
            groomParents: 'Bpk. Groom & Ibu Groom',
          },
          isSingleEvent: true,
          akadLocation: {
            dateTime: '2026-06-01T08:00:00.000Z',
            mapUrl: 'https://maps.app.goo.gl/example',
            description: 'Gedung',
          },
          resepsiLocation: {
            dateTime: '2026-06-01T08:00:00.000Z',
            mapUrl: 'https://maps.app.goo.gl/example',
            description: 'Gedung',
          },
        }),
      }),
    )

    await page.goto(`${BASE_URL}/invitation/42/edit`)

    await expect(page.locator('iframe[src*="templateId=light-modern"]').first()).toBeVisible({
      timeout: 10000,
    })
  })

  test('falls back to create when local draft edit id no longer exists', async ({ page, context }) => {
    let updateCalled = false
    let createCalled = false

    await page.addInitScript(() => {
      localStorage.setItem('token', 'fake-jwt-token')
      localStorage.setItem('editInvitationId', '7')
      localStorage.setItem(
        'selectedTemplate',
        JSON.stringify({ id: 1, name: 'Dark Elegant', isPremium: false }),
      )
      localStorage.setItem('selectedSections', JSON.stringify(['cover', 'quote', 'event']))
      localStorage.setItem(
        'finalPayload',
        JSON.stringify({
          title: 'Draft Lama',
          brideName: 'Putri',
          groomName: 'Putra',
          bridePhotoUrl: 'https://example.com/bride.jpg',
          groomPhotoUrl: 'https://example.com/groom.jpg',
          photoCoupleUrl: 'https://example.com/couple.jpg',
          mergeEvents: true,
          dateTime: '2026-05-21T15:29',
          akadLocation: {
            mapUrl: 'https://maps.app.goo.gl/example',
            description: '',
            dateTime: '2026-05-21T15:29',
          },
          resepsiLocation: {
            mapUrl: 'https://maps.app.goo.gl/example',
            description: '',
            dateTime: '2026-05-21T15:29',
          },
          selectedSections: ['cover', 'quote', 'event'],
        }),
      )
    })

    await context.route('**/api/user/me', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 1, name: 'Tester', email: 'tester@example.com' }),
      }),
    )
    await context.route('**/api/audio', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }),
    )
    await context.route('**/api/admin/audio/public**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }),
    )
    await context.route('**/api/template-design**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [{ id: 1, name: 'Dark Elegant', slug: 'dark-elegant', isPremium: false }] }),
      }),
    )
    await context.route('**/api/categories**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }),
    )
    await context.route('**/api/upload**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ fileUrl: 'https://example.com/upload.jpg' }),
      }),
    )
    await context.route('**/api/invitation/7', (route) => {
      updateCalled = true
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invitation not found' }),
      })
    })
    await context.route('**/api/invitation', (route) => {
      if (route.request().method() === 'POST') {
        createCalled = true
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 99, slug: 'putra-putri' }),
        })
      }
      return route.continue()
    })
    await context.route('**/api/invitation/my/slug/putra-putri', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 99,
          title: 'Putra Putri',
          slug: 'putra-putri',
          template_slug: 'dark-elegant',
          is_published: false,
          content: {
            coupleName: 'Putra & Putri',
            groomName: 'Putra',
            brideName: 'Putri',
            akadLocation: { dateTime: '2026-05-21T15:29:00.000Z' },
          },
        }),
      }),
    )

    await page.goto(`${BASE_URL}/create/form`)
    await expect(page.getByRole('button', { name: /Preview Undangan|Preview Perubahan|Lanjut Preview/ })).toBeVisible({
      timeout: 10000,
    })

    const imageFile = {
      name: 'photo.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
        'base64',
      ),
    }

    await page.getByPlaceholder('Putri Diana').fill('Putri')
    await page.getByPlaceholder('Pangeran Charles').fill('Putra')
    await page.getByPlaceholder(/The Wedding/).fill('Putra Putri')
    await page.locator('#bridePhoto').setInputFiles(imageFile)
    await page.locator('#groomPhoto').setInputFiles(imageFile)
    await page.locator('input[type="file"]').nth(2).setInputFiles(imageFile)
    await page.getByText('Satu Lokasi').click()
    await page.locator('input[type="datetime-local"]').fill('2026-05-21T15:29')
    await page.getByPlaceholder('https://maps.app.goo.gl/...').fill('https://maps.app.goo.gl/example')

    await page.getByRole('button', { name: /Preview Undangan|Preview Perubahan|Lanjut Preview/ }).click()

    await expect(page).toHaveURL(/\/preview\?slug=putra-putri/, { timeout: 10000 })
    expect(updateCalled).toBe(true)
    expect(createCalled).toBe(true)
  })
})
