import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createGuestMessage } from './guestMessage'

describe('createGuestMessage', () => {
  let fetchMock

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ created: true }),
    })
    vi.stubGlobal('fetch', fetchMock)
    localStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  async function requestPayload() {
    expect(fetchMock).toHaveBeenCalledOnce()
    return JSON.parse(fetchMock.mock.calls[0][1].body)
  }

  it('normalizes legacy field names and clears attendees for declined RSVPs', async () => {
    await createGuestMessage(42, {
      name: 'Alya',
      attendance: 'tidak',
      message: 'Terima kasih atas undangannya',
      totalGuests: 3,
    })

    expect(await requestPayload()).toEqual({
      invitationId: 42,
      guestName: 'Alya',
      rsvpStatus: 'tidak',
      message: 'Terima kasih atas undangannya',
      totalGuests: 0,
    })
  })

  it('preserves canonical payload fields and attending headcount', async () => {
    await createGuestMessage({
      invitationId: 17,
      guestName: 'Bima',
      rsvpStatus: 'hadir',
      message: 'Sampai bertemu',
      totalGuests: 2,
    })

    expect(await requestPayload()).toEqual({
      invitationId: 17,
      guestName: 'Bima',
      rsvpStatus: 'hadir',
      message: 'Sampai bertemu',
      totalGuests: 2,
    })
  })

  it('attaches the personal guest token from the invitation URL', async () => {
    window.history.replaceState({}, '', '/inv/acara/tamu-rahasia')

    await createGuestMessage({
      invitationId: 17,
      guestName: 'Dina',
      rsvpStatus: 'hadir',
      message: 'Hadir',
      totalGuests: 1,
    })

    expect(await requestPayload()).toMatchObject({ guestSlug: 'tamu-rahasia' })
  })
})
