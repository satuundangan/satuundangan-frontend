import { apiFetch } from './client'

export const createGuestMessage = (data, legacyPayload) => {
  const payload = legacyPayload
    ? { ...legacyPayload, invitationId: Number(data) }
    : { ...data }

  // Older invitation designs still submit the original RSVP field names.
  payload.guestName ??= payload.name
  payload.rsvpStatus ??= payload.attendance
  delete payload.name
  delete payload.attendance

  if (payload.rsvpStatus && payload.rsvpStatus !== 'hadir') {
    payload.totalGuests = 0
  } else {
    const totalGuests = Number(payload.totalGuests ?? 1)
    if (Number.isInteger(totalGuests) && totalGuests >= 0) {
      payload.totalGuests = totalGuests
    }
  }

  // Personal invitation links carry the guest's access token in the path.
  // Attach it once here so every design keeps the dashboard RSVP in sync.
  if (!payload.guestId && !payload.guestSlug && typeof window !== 'undefined') {
    const match = window.location.pathname.match(/^\/inv\/[^/]+\/([^/]+)\/?$/)
    if (match) {
      try {
        payload.guestSlug = decodeURIComponent(match[1])
      } catch {
        // A malformed path remains an unlinked public RSVP.
      }
    }
  }

  if (typeof payload.songRequest === 'string') {
    const cleanSong = payload.songRequest.trim().slice(0, 180)
    if (cleanSong) payload.songRequest = cleanSong
    else delete payload.songRequest
  }

  return apiFetch('/guest-messages', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Invitation pages: published wishes only, no login needed.
export const getGuestMessagesByInvitationId = (invitationId) =>
  apiFetch(`/guest-messages/public/${invitationId}`)

// Dashboard: owner/admin view with full records (needs login).
export const getOwnerGuestMessagesByInvitationId = (invitationId) =>
  apiFetch(`/guest-messages/invitation/${invitationId}`)

// Dashboard: aggregated guest song requests for Band / DJ playlist (SAT-70).
export const getSongRequestsByInvitationId = (invitationId) =>
  apiFetch(`/guest-messages/song-requests/${invitationId}`)

export const deleteGuestMessage = (id) =>
  apiFetch(`/guest-messages/${id}`, {
    method: 'DELETE',
  })
