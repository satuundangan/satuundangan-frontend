import { test, expect } from '@playwright/test'

const apiBaseURL = process.env.PROD_API_BASE_URL || 'https://api.satuundangan.id'
const openInvitationButton = /Buka Undangan|Step Into Our Dream|Open Invitation/i

function getRunId() {
  return new Date().toISOString().replace(/\D/g, '').slice(0, 14)
}

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  }
}

function invitationPayload(runId, templateDesignId) {
  const title = `PW PROD ${runId}`
  const slug = `pw-prod-${runId}`
  const eventDate = '2026-12-31T10:00:00.000Z'
  const mapUrl = 'https://maps.app.goo.gl/playwright-smoke'
  const photo = 'https://cdn.satuundangan.id/1776234592133-DDOS.png'

  return {
    title,
    slug,
    coupleName: `Playwright ${runId}`,
    groomName: 'Playwright Groom',
    brideName: 'Playwright Bride',
    isPublished: true,
    quoteSource: 'QS. Ar-Rum: 21',
    quoteType: 'default',
    quoteText: 'Production smoke test invitation.',
    loveStory: [],
    musicChoice: 'default',
    isCustomMusic: false,
    bridePhotoUrl: photo,
    groomPhotoUrl: photo,
    photoCoupleUrl: photo,
    dateTime: eventDate,
    akadLocation: {
      mapUrl,
      description: 'Production Smoke Venue',
      dateTime: eventDate,
    },
    resepsiLocation: {
      mapUrl,
      description: 'Production Smoke Venue',
      dateTime: eventDate,
    },
    isSingleEvent: true,
    mergeEvents: true,
    encryptedGuestName: true,
    floorPlanImageUrl: '',
    menu: { title: 'Menu Makanan', items: [] },
    galleryImages: [],
    giftDeliveryAddress: '',
    bankAccounts: [],
    socialMedia: {},
    socialMediaBrides: {},
    socialMediaGroom: {},
    parents: {
      brideParents: 'PW Bride Parent',
      groomParents: 'PW Groom Parent',
    },
    turutMengundang: '',
    liveStreamingLink: '',
    footerText: 'Created by Playwright production write smoke.',
    enableCover: true,
    healthProtocol: false,
    selectedSections: ['hero', 'couple', 'event', 'rsvp'],
    enableGuestMessage: true,
    templateDesignId,
    whatsappMessageTemplate: 'Halo [GuestName], ini undangan test kami: [Link]',
  }
}

test.describe('Production write smoke', () => {
  test('creates customer, invitation, guest, and RSVP in production', async ({ page, request }, testInfo) => {
    const runId = getRunId()
    const email = `playwright+prod-${runId}@satuundangan.id`
    const password = `PwProd${runId}!`

    const registerResponse = await request.post(`${apiBaseURL}/auth/register`, {
      data: {
        name: `PW PROD ${runId}`,
        email,
        password,
        agreedToTerms: true,
      },
    })
    expect(registerResponse.ok()).toBe(true)

    const registerBody = await registerResponse.json()
    const token = registerBody.access_token || registerBody.token || registerBody.data?.access_token
    expect(token, JSON.stringify(registerBody)).toBeTruthy()

    const templatesResponse = await request.get(`${apiBaseURL}/template-design`)
    expect(templatesResponse.ok()).toBe(true)
    const templates = await templatesResponse.json()
    const darkElegant = templates.find((template) => template.slug === 'dark-elegant')
    expect(darkElegant?.id).toBeTruthy()

    const createInvitationResponse = await request.post(`${apiBaseURL}/invitation`, {
      headers: authHeaders(token),
      data: invitationPayload(runId, darkElegant.id),
    })
    expect(createInvitationResponse.ok()).toBe(true)

    const invitation = await createInvitationResponse.json()
    const invitationId = invitation.id || invitation.data?.id
    const invitationSlug = invitation.slug || invitation.data?.slug
    expect(invitationId).toBeTruthy()
    expect(invitationSlug).toContain(`pw-prod-${runId}`)

    const publishResponse = await request.patch(`${apiBaseURL}/invitation/${invitationId}`, {
      headers: authHeaders(token),
      data: { isPublished: true, is_published: true },
    })
    expect(publishResponse.ok()).toBe(true)

    const createGuestResponse = await request.post(`${apiBaseURL}/guests`, {
      headers: authHeaders(token),
      data: {
        name: `PW Guest ${runId}`,
        phoneNumber: '081234567890',
        group: 'Playwright',
        invitationId,
      },
    })
    expect(createGuestResponse.ok()).toBe(true)
    const guest = await createGuestResponse.json()
    const guestId = guest.id || guest.data?.id
    const guestSlug = guest.slug || guest.data?.slug
    expect(guestId).toBeTruthy()

    const shareResponse = await request.get(`${apiBaseURL}/guests/${guestId}/share`, {
      headers: authHeaders(token),
    })
    expect(shareResponse.ok()).toBe(true)
    const share = await shareResponse.json()
    expect(JSON.stringify(share)).toContain(invitationSlug)

    const messageResponse = await request.post(`${apiBaseURL}/guest-messages`, {
      data: {
        invitationId,
        guestId,
        guestSlug,
        guestName: `PW Guest ${runId}`,
        message: `RSVP production smoke ${runId}`,
        rsvpStatus: 'hadir',
        totalGuests: 2,
      },
    })
    expect(messageResponse.ok()).toBe(true)

    const publicApiResponse = await request.get(`${apiBaseURL}/invitation/slug/${invitationSlug}`)
    expect(publicApiResponse.ok()).toBe(true)
    const publicInvitation = await publicApiResponse.json()
    expect(publicInvitation.is_published ?? publicInvitation.isPublished).toBeTruthy()

    const messagesResponse = await request.get(`${apiBaseURL}/guest-messages/invitation/${invitationId}`)
    expect(messagesResponse.ok()).toBe(true)
    const messagesBody = await messagesResponse.json()
    expect(JSON.stringify(messagesBody)).toContain(`RSVP production smoke ${runId}`)

    await page.goto(`/${invitationSlug}?to=PW%20Guest%20${runId}`, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('button', { name: openInvitationButton }).first()).toBeVisible({
      timeout: 20000,
    })
    await page.getByRole('button', { name: openInvitationButton }).first().click({ force: true })
    await expect(page.getByText(/Playwright Groom|Playwright Bride|PW Guest/i).first()).toBeVisible({
      timeout: 20000,
    })

    const summary = [
      `email=${email}`,
      `invitationId=${invitationId}`,
      `slug=${invitationSlug}`,
      `guestId=${guestId}`,
      `guestSlug=${guestSlug || '(none)'}`,
      `url=${testInfo.project.use.baseURL}/${invitationSlug}`,
    ].join('\n')
    console.log(summary)
    await testInfo.attach('production-write-created-data.txt', {
      body: summary,
      contentType: 'text/plain',
    })
  })
})
