import { apiFetch } from './client'

export const createInvitation = (data) =>
  apiFetch('/invitation', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const getInvitations = () => apiFetch('/invitation')

export const getInvitationById = (id) => apiFetch(`/invitation/${id}`)

export const updateInvitation = (id, data) =>
  apiFetch(`/invitation/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

export const deleteInvitation = (id) =>
  apiFetch(`/invitation/${id}`, {
    method: 'DELETE',
  })

export const getInvitationBySlug = async (slug) => {
  // Check access with the API every time so a newly private invitation cannot
  // remain visible through a stale public invitation cached in localStorage.
  return apiFetch(`/invitation/slug/${slug}`)
}

export const getInvitationWithGuest = (slug, guestToken) =>
  apiFetch(`/invitation/slug/${slug}/guest/${guestToken}`)

export const getMyInvitationBySlug = (slug) => apiFetch(`/invitation/my/slug/${slug}`)

// Live availability check for custom subdomain at /create.
// Returns { available, normalized, reason? }
export const checkSubdomainAvailability = (value, excludeId) => {
  const params = new URLSearchParams({ value: value || '' })
  if (excludeId) params.set('excludeId', String(excludeId))
  return apiFetch(`/invitation/subdomain/check?${params.toString()}`)
}

// Public resolve by custom subdomain (host-based routing).
export const getInvitationBySubdomain = (subdomain) =>
  apiFetch(`/invitation/subdomain/${subdomain}`)

// Root domains where a subdomain is NOT a custom invitation (app itself).
const ROOT_HOSTS = ['satuundangan.id', 'www.satuundangan.id', 'dev.satuundangan.id', 'localhost']

// Parse current host → custom subdomain label, or null if on a root/app host.
// e.g. "rina-budi.satuundangan.id" → "rina-budi"
export const getCustomSubdomain = (host = window.location.hostname) => {
  const h = (host || '').toLowerCase().replace(/:\d+$/, '')
  if (ROOT_HOSTS.includes(h)) return null
  if (/^(\d+\.){3}\d+$/.test(h)) return null // bare IP
  for (const root of ['.satuundangan.id', '.localhost']) {
    // ".localhost" lets you test locally: rina-budi.localhost:5173
    if (h.endsWith(root)) {
      const label = h.slice(0, -root.length)
      if (!label || label === 'www') return null
      return label
    }
  }
  return null
}

export const getInvitationCategories = () => apiFetch('/invitation/categories')

export const getDashboardStats = () => apiFetch('/dashboard/stats')
