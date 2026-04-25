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

export const getAffiliateDashboard = () => apiFetch('/affiliate/dashboard')

export const getAffiliateCommissions = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return apiFetch(`/affiliate/commissions${qs ? '?' + qs : ''}`)
}

export const submitWithdraw = (data) =>
  apiFetch('/affiliate/withdraw', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const getAffiliateWithdrawals = () => apiFetch('/affiliate/withdrawals')
