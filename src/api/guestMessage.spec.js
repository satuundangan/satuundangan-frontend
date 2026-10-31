import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiFetch } from './client'
import { createGuestMessage } from './guestMessage'

vi.mock('./client', () => ({ apiFetch: vi.fn() }))

describe('createGuestMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.history.replaceState({}, '', '/')
  })

  it('translates legacy template fields and links a personal RSVP to its guest', () => {
    window.history.replaceState({}, '', '/inv/nadia-arga/demo-guest-token')

    createGuestMessage(501, {
      name: 'Budi Santoso',
      attendance: 'hadir',
      message: 'Selamat berbahagia!',
      totalGuests: 2,
    })

    expect(apiFetch).toHaveBeenCalledWith('/guest-messages', {
      method: 'POST',
      body: expect.any(String),
    })
    expect(JSON.parse(apiFetch.mock.calls[0][1].body)).toEqual({
      invitationId: 501,
      message: 'Selamat berbahagia!',
      totalGuests: 2,
      guestName: 'Budi Santoso',
      rsvpStatus: 'hadir',
      guestSlug: 'demo-guest-token',
    })
  })

  it('preserves canonical fields and clears the party size when absent', () => {
    createGuestMessage({
      invitationId: 501,
      guestName: 'Sari',
      rsvpStatus: 'tidak',
      message: 'Maaf belum bisa hadir.',
      totalGuests: 3,
    })

    const request = apiFetch.mock.calls[0][1]
    expect(JSON.parse(request.body)).toEqual({
      invitationId: 501,
      guestName: 'Sari',
      rsvpStatus: 'tidak',
      message: 'Maaf belum bisa hadir.',
      totalGuests: 0,
    })
  })
})
