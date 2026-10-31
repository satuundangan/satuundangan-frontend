import { apiFetch } from './client'

function buildQuery(params = {}) {
  const entries = Object.entries(params).filter(
    ([_, val]) => val !== undefined && val !== null && val !== '',
  )
  const qs = new URLSearchParams(entries).toString()
  return qs ? `?${qs}` : ''
}

export const getAiCreditStats = () => apiFetch('/admin/ai/stats')

export const getAiCreditLogs = (params = {}) =>
  apiFetch(`/admin/ai/logs${buildQuery(params)}`)
