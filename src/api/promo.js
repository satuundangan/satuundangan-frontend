import { apiFetch } from './client'

export const validatePromoCode = (code, invitation_id) =>
  apiFetch('/promo/validate', {
    method: 'POST',
    body: JSON.stringify({ code, invitation_id }),
  })

// --- Admin CRUD ---

export const getAdminPromoCodes = (page = 1, limit = 20, q = '') =>
  apiFetch(`/promo/admin/list?page=${page}&limit=${limit}&q=${q}`)

export const createPromoCode = (data) =>
  apiFetch('/promo/admin', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const updatePromoCode = (id, data) =>
  apiFetch(`/promo/admin/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

export const deletePromoCode = (id) =>
  apiFetch(`/promo/admin/${id}`, {
    method: 'DELETE',
  })
