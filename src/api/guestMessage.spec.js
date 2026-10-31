import { beforeEach, describe, expect, it, vi } from 'vitest'

const { apiFetch } = vi.hoisted(() => ({ apiFetch: vi.fn() }))
vi.mock('./client', () => ({ apiFetch }))

import { createGuestMessage } from './guestMessage'

describe('createGuestMessage legacy payload normalization', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.history.replaceState({}, '', '/')
  })

  it('maps legacy fields and sends zero guests for a non-attending response', async () => {
    await createGuestMessage({
      invitationId: 10,
      name: 'Tamu Contoh',
      message: 'Terima kasih atas undangannya.',
      attendance: 'tidak',
      totalGuests: 1,
    })

    expect(apiFetch).toHaveBeenCalledWith(
      '/guest-messages',
      expect.objectContaining({ method: 'POST' }),
    )
    expect(JSON.parse(apiFetch.mock.calls[0][1].body)).toEqual({
      invitationId: 10,
      guestName: 'Tamu Contoh',
      message: 'Terima kasih atas undangannya.',
      rsvpStatus: 'tidak',
      totalGuests: 0,
    })
  })

  it('preserves canonical fields and extracts the personal guest token from the route', async () => {
    window.history.replaceState({}, '', '/inv/romeo-juliet/private-token')

    await createGuestMessage({
      invitationId: 10,
      guestName: 'Tamu Contoh',
      message: 'Saya hadir.',
      rsvpStatus: 'hadir',
      totalGuests: '2',
    })

    expect(apiFetch).toHaveBeenCalledWith(
      '/guest-messages',
      expect.objectContaining({ method: 'POST' }),
    )
    expect(JSON.parse(apiFetch.mock.calls[0][1].body)).toEqual({
      invitationId: 10,
      guestName: 'Tamu Contoh',
      message: 'Saya hadir.',
      rsvpStatus: 'hadir',
      totalGuests: 2,
      guestSlug: 'private-token',
    })
  })
})
