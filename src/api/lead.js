import { apiFetch } from './client'

export const submitLead = (data) =>
  apiFetch('/leads', {
    method: 'POST',
    body: JSON.stringify(data),
  })
