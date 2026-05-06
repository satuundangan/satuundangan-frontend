import { test, expect } from '@playwright/test'

const invitationSlug = process.env.PROD_INVITATION_SLUG || 'putra-putri'
const apiBaseURL = process.env.PROD_API_BASE_URL || 'https://api.satuundangan.id'
const openInvitationButton = /Buka Undangan|Step Into Our Dream|Open Invitation/i

test.describe('Production readonly smoke', () => {
  test('home page loads core landing content', async ({ page, baseURL }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' })

    expect(response?.ok()).toBe(true)
    await expect(page).toHaveURL(new RegExp(`^${baseURL?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`))
    await expect(page.getByRole('navigation')).toBeVisible()
    await expect(page.getByRole('button', { name: /Masuk/i }).first()).toBeVisible()
    await expect(page.getByText(/Bagikan Kabar Bahagiamu/i)).toBeVisible()
  })

  test('public invitation API returns an active invitation', async ({ request }) => {
    const response = await request.get(`${apiBaseURL}/invitation/slug/${invitationSlug}`)

    expect(response.ok()).toBe(true)
    const body = await response.json()
    const invitation = body.data || body
    expect(invitation.slug).toBe(invitationSlug)
    expect(invitation.is_published ?? invitation.isPublished).toBeTruthy()
  })

  test('guest can open public invitation without submitting RSVP', async ({ page }) => {
    const response = await page.goto(`/${invitationSlug}?to=Playwright%20Smoke`, {
      waitUntil: 'domcontentloaded',
    })

    expect(response?.ok()).toBe(true)
    await expect(page.getByRole('button', { name: openInvitationButton }).first()).toBeVisible({ timeout: 20000 })
    await page.getByRole('button', { name: openInvitationButton }).first().click({ force: true })
    await expect(page.getByText(/Playwright Smoke|Tamu Undangan/i).first()).toBeVisible({ timeout: 20000 })
    await expect(page.getByText(/Undangan tidak ditemukan|belum dipublikasikan/i)).not.toBeVisible()
  })

  test('legal pages are reachable', async ({ page }) => {
    await page.goto('/terms', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText(/Syarat|Ketentuan/i).first()).toBeVisible({ timeout: 15000 })

    await page.goto('/privacy', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText(/Privasi|Kebijakan/i).first()).toBeVisible({ timeout: 15000 })
  })

  test('admin login page is reachable without authenticating', async ({ page }) => {
    const response = await page.goto('/admin/login', { waitUntil: 'domcontentloaded' })

    expect(response?.ok()).toBe(true)
    await expect(page.getByText('Admin Login')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })
})
