import { apiFetch } from './client.js'

const post = (path, body) =>
  apiFetch(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) })

function withParams(path, params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.append(key, value)
  })
  const query = searchParams.toString()
  return query ? `${path}?${query}` : path
}

// Own account: role, TOTP status, last login and active sessions
export const fetchAdminSecurity = () => apiFetch('/auth/admin/security')
export const setupAdminTotp = () => apiFetch('/auth/admin/totp/setup')
export const activateAdminTotp = (code) => post('/auth/admin/totp/activate', { code })
export const disableAdminTotp = (proof) => post('/auth/admin/totp/disable', proof)
export const regenerateRecoveryCodes = (proof) => post('/auth/admin/totp/recovery-codes', proof)
export const revokeAdminSession = (id) =>
  apiFetch(`/auth/admin/sessions/${encodeURIComponent(id)}`, { method: 'DELETE' })
export const revokeOtherAdminSessions = () => post('/auth/admin/sessions/revoke-others')

// System controls (superadmin)
export const fetchAdminHealthReport = (refresh = false) =>
  apiFetch(withParams('/admin/health', { refresh: refresh ? '1' : undefined }))
export const fetchMaintenance = () => apiFetch('/admin/maintenance')
export const updateMaintenance = (payload) =>
  apiFetch('/admin/maintenance', { method: 'PUT', body: JSON.stringify(payload) })
export const fetchAdminAuditLogs = (params) => apiFetch(withParams('/admin/audit-logs', params))
export const updateAdminRole = (userId, adminRole, reason) =>
  apiFetch(`/admin/users/${userId}/admin-role`, {
    method: 'PATCH',
    body: JSON.stringify({ adminRole }),
    headers: reason ? { 'x-admin-reason': reason } : undefined,
  })

// Public: lets the storefront show a maintenance notice without authentication
export const fetchPublicStatus = () => apiFetch('/public/status')
