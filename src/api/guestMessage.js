import { apiFetch } from './client'

export const getGuestMessagesByInvitationId = (invitationId) =>
  apiFetch(`/guest-messages/invitation/${invitationId}`)

export const deleteGuestMessage = (id) =>
  apiFetch(`/guest-messages/${id}`, {
    method: 'DELETE',
  })
