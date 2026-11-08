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
export const fetchAdminUserStats = () => apiFetch('/admin/users/stats')
export const fetchAdminCustomerDetail = (id) =>
  apiFetch(`/admin/users/${encodeURIComponent(id)}/customer`)
export const confirmAdminWeddingCompletion = (userId, invitationId, reason) =>
  apiFetch(
    `/admin/users/${encodeURIComponent(userId)}/invitations/${encodeURIComponent(invitationId)}/event-completion`,
    {
      method: 'POST',
      body: JSON.stringify({ reason }),
      headers: { 'x-admin-reason': reason },
    },
  )
export const createAdminUser = (payload) =>
  apiFetch('/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
export const updateAdminUser = (id, payload, reason) =>
  apiFetch(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: reason ? { 'x-admin-reason': reason } : undefined,
  })
export const deleteAdminUser = (id, reason) =>
  apiFetch(`/admin/users/${id}`, {
    method: 'DELETE',
    headers: reason ? { 'x-admin-reason': reason } : undefined,
  })
export const verifyAdminUserEmail = (id, reason) =>
  apiFetch(`/admin/users/${id}/verify-email`, {
    method: 'POST',
    headers: reason ? { 'x-admin-reason': reason } : undefined,
  })

// Invitations
export const fetchAdminInvitations = (params) => apiFetch(withParams('/admin/invitations', params))
export const fetchAdminInvitation = (id) => apiFetch(`/admin/invitations/${id}`)
export const fetchAdminInvitationDetail = (id) => apiFetch(`/admin/invitations/${id}/detail`)
export const updateAdminInvitation = (id, payload) =>
  apiFetch(`/admin/invitations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
export const deleteAdminInvitation = (id) =>
  apiFetch(`/admin/invitations/${id}`, {
    method: 'DELETE',
  })

// Payments & Transactions (PKG-02: ADM-009 s/d ADM-015)
export const fetchAdminPayments = (params) => apiFetch(withParams('/admin/payments', params))
export const fetchAdminPaymentStats = () => apiFetch('/admin/payments/stats')
export const fetchAdminPaymentReconciliationQueue = () =>
  apiFetch('/admin/payments/reconciliation-queue')
export const fetchAdminPaymentDetail = (id) => apiFetch(`/admin/payments/${id}`)
export const reconcileAdminPaymentPublish = (id, reason) =>
  apiFetch(`/admin/payments/${id}/reconcile-publish`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  })
export const syncAdminPaymentGateway = (id) =>
  apiFetch(`/admin/payments/${id}/sync-gateway`, {
    method: 'POST',
  })
export const exportAdminPayments = (params) =>
  apiFetch(withParams('/admin/payments/export', params))

// Guests
export const fetchAdminGuests = (params) => apiFetch(withParams('/admin/guests', params))

// Template Designs
export const fetchAdminTemplates = (params) =>
  apiFetch(withParams('/admin/template-designs', params))
export const fetchAdminTemplateMetrics = (params) =>
  apiFetch(withParams('/admin/template-designs/metrics', params))
export const fetchAdminTemplateRevisions = (id) =>
  apiFetch(`/admin/template-designs/${id}/revisions`)
export const rollbackAdminTemplateRevision = (id, revisionId) =>
  apiFetch(`/admin/template-designs/${id}/revisions/${revisionId}/rollback`, {
    method: 'POST',
  })
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
export const fetchAdminPromoCodeDetail = (id) => apiFetch(`/promo/admin/${id}`)
export const fetchAdminPromoSummary = () => apiFetch('/promo/admin/summary')
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

// Articles
export const fetchAdminArticles = (params) => apiFetch(withParams('/admin/articles', params))
export const fetchAdminArticle = (id) => apiFetch(`/admin/articles/${id}`)
export const createAdminArticle = (payload) =>
  apiFetch('/admin/articles', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
export const updateAdminArticle = (id, payload) =>
  apiFetch(`/admin/articles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
export const deleteAdminArticle = (id) =>
  apiFetch(`/admin/articles/${id}`, {
    method: 'DELETE',
  })
export const autoGenerateAdminArticle = (payload = {}) =>
  apiFetch('/admin/articles/auto-generate', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
export const fetchAdminArticleBotStatus = () => apiFetch('/admin/articles/bot-status')

export const fetchAdminHealth = () => apiFetch('/admin/health')
export const fetchAdminStats = () => apiFetch('/admin/stats')
export const fetchAdminDashboardOverview = (params) =>
  apiFetch(withParams('/admin/dashboard/overview', params))
export const fetchAdminActionQueue = () => apiFetch('/admin/dashboard/actions')

// Activity & Error Logs
export const fetchAdminLogs = (params) => apiFetch(withParams('/admin/logs', params))
export const fetchAdminLogStats = () => apiFetch('/admin/logs/stats')
export const clearAdminLogs = () =>
  apiFetch('/admin/logs', {
    method: 'DELETE',
  })
