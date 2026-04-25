import { apiFetch } from './client'

export const getAdminResellers = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return apiFetch(`/admin/affiliate/resellers${qs ? '?' + qs : ''}`)
}

export const updateResellerStatus = (id, status) =>
  apiFetch(`/admin/affiliate/resellers/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  })

export const getAdminWithdrawals = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return apiFetch(`/admin/affiliate/withdrawals${qs ? '?' + qs : ''}`)
}

export const approveWithdrawal = (id, data) =>
  apiFetch(`/admin/affiliate/withdrawals/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const rejectWithdrawal = (id, data) =>
  apiFetch(`/admin/affiliate/withdrawals/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const getAdminTierConfigs = () => apiFetch('/admin/affiliate/tier-config')

export const updateTierConfig = (tier, data) =>
  apiFetch(`/admin/affiliate/tier-config/${tier}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

export const getAdminSystemConfig = () => apiFetch('/admin/affiliate/system-config')

export const updateAdminSystemConfig = (data) =>
  apiFetch('/admin/affiliate/system-config', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
