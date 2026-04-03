import { apiFetch } from './client'

export const createGuestMessage = (data) =>
  apiFetch('/guest-messages', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const getGuestMessagesByInvitationId = (invitationId) =>
  apiFetch(`/guest-messages/invitation/${invitationId}`)

export const deleteGuestMessage = (id) =>
  apiFetch(`/guest-messages/${id}`, {
    method: 'DELETE',
  })
