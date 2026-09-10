import { test, expect } from '@playwright/test'

const apiBaseURL = process.env.PROD_API_BASE_URL || 'https://api.satuundangan.id'

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
    giftDeliveryAddress: [],
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
  test('registers, logs in, creates an invitation, and verifies the publish gate', async ({ request }, testInfo) => {
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

    const loginResponse = await request.post(`${apiBaseURL}/auth/login`, {
      data: { email, password },
    })
    expect(loginResponse.ok()).toBe(true)
    const loginBody = await loginResponse.json()
    const loginToken = loginBody.access_token || loginBody.token || loginBody.data?.access_token
    expect(loginToken, JSON.stringify(loginBody)).toBeTruthy()

    const profileResponse = await request.get(`${apiBaseURL}/auth/me`, {
      headers: authHeaders(loginToken),
    })
    expect(profileResponse.ok()).toBe(true)
    const profile = await profileResponse.json()
    expect(JSON.stringify(profile)).toContain(email)

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
      headers: authHeaders(loginToken),
      data: { isPublished: true, is_published: true },
    })
    expect(publishResponse.status()).toBe(403)
    const publishBody = await publishResponse.json()
    expect(JSON.stringify(publishBody)).toContain('Verifikasi email')

    const summary = [
      `email=${email}`,
      `invitationId=${invitationId}`,
      `slug=${invitationSlug}`,
      `publishStatus=${publishResponse.status()}`,
    ].join('\n')
    console.log(summary)
    await testInfo.attach('production-write-created-data.txt', {
      body: summary,
      contentType: 'text/plain',
    })
  })
})
