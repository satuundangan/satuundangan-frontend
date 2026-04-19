import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

test.describe('Create Form stale draft recovery', () => {
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
    await context.route('**/api/admin/audio/public**', (route) =>
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

    await page.goto(`${BASE_URL}/create/form`)
    await expect(page.getByRole('button', { name: /Preview Undangan|Preview Perubahan/ })).toBeVisible({
      timeout: 10000,
    })
    await page.getByRole('button', { name: /Preview Undangan|Preview Perubahan/ }).click()

    await expect(page).toHaveURL(/\/preview\?slug=putra-putri/, { timeout: 10000 })
    expect(updateCalled).toBe(true)
    expect(createCalled).toBe(true)
  })
})
