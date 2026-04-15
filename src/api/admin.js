import { apiFetch } from './client.js'

function withParams(path, params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.append(key, value)
  })
  const query = searchParams.toString()
  return query ? `${path}?${query}` : path
}

// Users
export const fetchAdminUsers = (params) => apiFetch(withParams('/admin/users', params))
export const createAdminUser = (payload) =>
  apiFetch('/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
export const updateAdminUser = (id, payload) =>
  apiFetch(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
export const deleteAdminUser = (id) =>
  apiFetch(`/admin/users/${id}`, {
    method: 'DELETE',
  })

// Invitations
export const fetchAdminInvitations = (params) => apiFetch(withParams('/admin/invitations', params))
export const deleteAdminInvitation = (id) =>
  apiFetch(`/admin/invitations/${id}`, {
    method: 'DELETE',
  })

// Guests
export const fetchAdminGuests = (params) => apiFetch(withParams('/admin/guests', params))

// Template Designs
export const fetchAdminTemplates = (params) => apiFetch(withParams('/admin/template-designs', params))
export const createAdminTemplate = (payload) =>
  apiFetch('/admin/template-designs', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
export const updateAdminTemplate = (id, payload) =>
  apiFetch(`/admin/template-designs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
export const deleteAdminTemplate = (id) =>
  apiFetch(`/admin/template-designs/${id}`, {
    method: 'DELETE',
  })

// Categories
export const fetchAdminCategories = (params) => apiFetch(withParams('/admin/categories', params))
export const createAdminCategory = (payload) =>
  apiFetch('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
export const updateAdminCategory = (id, payload) =>
  apiFetch(`/admin/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
export const deleteAdminCategory = (id) =>
  apiFetch(`/admin/categories/${id}`, {
    method: 'DELETE',
  })

// Promo Codes
export const fetchAdminPromoCodes = (params) => apiFetch(withParams('/promo/admin/list', params))
export const createAdminPromoCode = (payload) =>
  apiFetch('/promo/admin', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
export const updateAdminPromoCode = (id, payload) =>
  apiFetch(`/promo/admin/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
export const deleteAdminPromoCode = (id) =>
  apiFetch(`/promo/admin/${id}`, {
    method: 'DELETE',
  })

// Palette Colors
export const fetchAdminPalettes = (params) => apiFetch(withParams('/admin/palette-colors', params))
export const createAdminPalette = (payload) =>
  apiFetch('/admin/palette-colors', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
export const updateAdminPalette = (id, payload) =>
  apiFetch(`/admin/palette-colors/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
export const deleteAdminPalette = (id) =>
  apiFetch(`/admin/palette-colors/${id}`, {
    method: 'DELETE',
  })
