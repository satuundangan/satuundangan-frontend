import { describe, expect, it } from 'vitest'
import { getInvitationPreviewUrl, getInvitationPublicUrl } from './invitationUrls'

const invitation = { slug: 'rina-budi', subdomain: 'Rina-Budi', isPublished: true }

describe('invitation public URLs', () => {
  it('uses the assigned custom subdomain on the production root domain', () => {
    expect(
      getInvitationPublicUrl(invitation, {
        hostname: 'satuundangan.id',
        origin: 'https://satuundangan.id',
      }),
    ).toBe('https://rina-budi.satuundangan.id')
  })

  it('keeps development invitations on the development host', () => {
    expect(
      getInvitationPublicUrl(invitation, {
        hostname: 'dev.satuundangan.id',
        origin: 'https://dev.satuundangan.id',
      }),
    ).toBe('https://dev.satuundangan.id/inv/rina-budi')
  })

  it('keeps local invitation links on the local app host', () => {
    expect(
      getInvitationPublicUrl(invitation, {
        hostname: 'localhost',
        origin: 'http://localhost:5173',
      }),
    ).toBe('http://localhost:5173/inv/rina-budi')
  })

  it('adds preview mode to the same public URL', () => {
    expect(
      getInvitationPreviewUrl(invitation, {
        hostname: 'satuundangan.id',
        origin: 'https://satuundangan.id',
      }),
    ).toBe('https://rina-budi.satuundangan.id/?preview=true')
  })

  it('falls back to the slug route for an invalid custom subdomain', () => {
    expect(
      getInvitationPublicUrl(
        { slug: 'rina-budi', subdomain: 'rina.budi', isPublished: true },
        { hostname: 'satuundangan.id', origin: 'https://satuundangan.id' },
      ),
    ).toBe('https://satuundangan.id/inv/rina-budi')
  })

  it('does not advertise a custom subdomain for an unpublished invitation', () => {
    expect(
      getInvitationPublicUrl(
        { ...invitation, isPublished: false },
        { hostname: 'satuundangan.id', origin: 'https://satuundangan.id' },
      ),
    ).toBe('https://satuundangan.id/inv/rina-budi')
  })
})
