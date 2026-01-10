import { apiFetch } from './client'

export const createGuest = (data) =>
  apiFetch('/guests', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const getGuestsByInvitationId = (invitationId) =>
  apiFetch(`/guests/invitation/${invitationId}`)

export const deleteGuest = (id) =>
  apiFetch(`/guests/${id}`, {
    method: 'DELETE',
  })

export const importGuests = (formData) =>
  apiFetch('/guests/import', {
    method: 'POST',
    body: formData, // FormData will be handled correctly by client helper if configured, or we might need custom handling
  })

export const getGuestShareLink = (id) =>
  apiFetch(`/guests/${id}/share`)
