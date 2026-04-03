import { apiFetch } from './client'

export const validatePromoCode = (code, invitation_id) =>
  apiFetch('/promo/validate', {
    method: 'POST',
    body: JSON.stringify({ code, invitation_id }),
  })
