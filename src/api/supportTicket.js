import { apiFetch } from './client'

function buildQuery(params = {}) {
  const entries = Object.entries(params).filter(
    ([_, val]) => val !== undefined && val !== null && val !== '',
  )
  const qs = new URLSearchParams(entries).toString()
  return qs ? `?${qs}` : ''
}

export const getSupportTickets = (params = {}) =>
  apiFetch(`/admin/support-tickets${buildQuery(params)}`)

export const getSupportTicketMetrics = () => apiFetch('/admin/support-tickets/metrics')

export const getSupportTicket = (id) => apiFetch(`/admin/support-tickets/${id}`)

export const updateSupportTicket = (id, data) =>
  apiFetch(`/admin/support-tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

export const createSupportTicket = (data) =>
  apiFetch('/support-tickets', {
    method: 'POST',
    body: JSON.stringify(data),
  })
