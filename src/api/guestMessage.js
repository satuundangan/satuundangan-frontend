import { apiFetch } from './client'

export const createGuestMessage = (data, legacyPayload) => {
  const payload = legacyPayload
    ? { ...legacyPayload, invitationId: Number(data) }
    : { ...data }

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

  return apiFetch('/guest-messages', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export const getGuestMessagesByInvitationId = (invitationId) =>
  apiFetch(`/guest-messages/invitation/${invitationId}`)

export const deleteGuestMessage = (id) =>
  apiFetch(`/guest-messages/${id}`, {
    method: 'DELETE',
  })
