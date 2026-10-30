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

export const fetchAnalyticsReport = (params) => apiFetch(withParams('/admin/analytics', params))
export const fetchAnalyticsFunnel = (params) =>
  apiFetch(withParams('/admin/analytics/funnel', params))
export const fetchAnalyticsPurchases = (params) =>
  apiFetch(withParams('/admin/analytics/purchases', params))
export const fetchAnalyticsAttribution = (params) =>
  apiFetch(withParams('/admin/analytics/attribution', params))
export const fetchAnalyticsQuality = () => apiFetch('/admin/analytics/quality')
export const fetchAnalyticsInsights = (params) =>
  apiFetch(withParams('/admin/analytics/insights', params))
export const refreshAnalyticsInsights = (params) =>
  apiFetch(withParams('/admin/analytics/insights/refresh', params), { method: 'POST' })
export const addAnalyticsAnnotation = (payload) =>
  apiFetch('/admin/analytics/annotations', { method: 'POST', body: JSON.stringify(payload) })
export const removeAnalyticsAnnotation = (id) =>
  apiFetch(`/admin/analytics/annotations/${id}`, { method: 'DELETE' })
