import { apiFetch } from './client'

export const getGuestMessagesByInvitationId = (invitationId) =>
  apiFetch(`/guest-messages/invitation/${invitationId}`)
