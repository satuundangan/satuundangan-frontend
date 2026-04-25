import { apiFetch } from './client'

export const registerAffiliate = (data) =>
  apiFetch('/affiliate/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const validateAffiliateCode = (code) =>
  apiFetch('/affiliate/validate', {
    method: 'POST',
    body: JSON.stringify({ code }),
  })

export const getAffiliateProfile = () => apiFetch('/affiliate/profile')
