import { apiFetch } from './client'

export const createGuest = (data) =>
  apiFetch('/guests', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const getGuestsByInvitationId = (invitationId) =>
  apiFetch(`/guests/invitation/${invitationId}`)

export const updateGuest = (id, data) =>
  apiFetch(`/guests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

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

export const checkInGuest = (id) =>
  apiFetch(`/guests/${id}/check-in`, {
    method: 'POST',
  })

export const checkInGuestByToken = (token) =>
  apiFetch('/guests/check-in-token', {
    method: 'POST',
    body: JSON.stringify({ token }),
  })

export const getCheckInSummary = (invitationId) =>
  apiFetch(`/guests/invitation/${invitationId}/check-in-summary`)
