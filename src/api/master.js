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

// Audio Tracks
export const fetchPublicAudio = () => apiFetch('/audio')
export const fetchAdminAudio = (params) => apiFetch(withParams('/admin/audio', params))
export const createAdminAudio = (payload) =>
  apiFetch('/admin/audio', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
export const deleteAdminAudio = (id) =>
  apiFetch(`/admin/audio/${id}`, {
    method: 'DELETE',
  })

// Bank/Payment Methods
export const fetchAdminBanks = (params) => apiFetch(withParams('/admin/banks', params))
export const createAdminBank = (payload) =>
  apiFetch('/admin/banks', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
export const updateAdminBank = (id, payload) =>
  apiFetch(`/admin/banks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
export const deleteAdminBank = (id) =>
  apiFetch(`/admin/banks/${id}`, {
    method: 'DELETE',
  })

// Public Master Data
export const getSections = () => apiFetch('/sections')

// Master Sections (Fitur Undangan)
export const fetchAdminSections = (params) => apiFetch(withParams('/admin/sections', params))
export const createAdminSection = (payload) =>
  apiFetch('/admin/sections', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
export const updateAdminSection = (id, payload) =>
  apiFetch(`/admin/sections/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
export const deleteAdminSection = (id) =>
  apiFetch(`/admin/sections/${id}`, {
    method: 'DELETE',
  })
