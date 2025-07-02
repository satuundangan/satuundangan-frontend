import { apiFetch } from './client'

export const createInvitation = (data) =>
  apiFetch('/invitation', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const getInvitations = () => apiFetch('/invitation')

export const getInvitationById = (id) => apiFetch(`/invitation/${id}`)

export const updateInvitation = (id, data) =>
  apiFetch(`/invitation/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

export const deleteInvitation = (id) =>
  apiFetch(`/invitation/${id}`, {
    method: 'DELETE',
  })

export const getInvitationBySlug = (slug) => apiFetch(`/invitation/slug/${slug}`)

export const getInvitationCategories = () => apiFetch('/invitation/categories')
