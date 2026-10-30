import { apiFetch } from './client'

function buildQuery(params = {}) {
  const entries = Object.entries(params).filter(
    ([_, val]) => val !== undefined && val !== null && val !== '',
  )
  const qs = new URLSearchParams(entries).toString()
  return qs ? `?${qs}` : ''
}

export const getLeads = (params = {}) => apiFetch(`/admin/leads${buildQuery(params)}`)

export const getLead = (id) => apiFetch(`/admin/leads/${id}`)

export const updateLead = (id, data) =>
  apiFetch(`/admin/leads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

export const deleteLead = (id) =>
  apiFetch(`/admin/leads/${id}`, {
    method: 'DELETE',
  })

export const createPublicLead = (data) =>
  apiFetch('/leads', {
    method: 'POST',
    body: JSON.stringify(data),
  })
