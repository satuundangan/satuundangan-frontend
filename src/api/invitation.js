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
  const CACHE_KEY = `inv_cache_${slug}`
  const CACHE_TTL = 5 * 60 * 1000 // 5 menit

  // 1. Ambil dari cache (LocalStorage) jika ada
  const cached = localStorage.getItem(CACHE_KEY)
  if (cached) {
    const { data, timestamp } = JSON.parse(cached)
    const isStale = Date.now() - timestamp > CACHE_TTL

    // Jika belum stale (basi), langsung return
    if (!isStale) return data

    // Jika stale, kita return data lama TAPI tetap fetch data baru di background (SWR)
    // Ini membuat UI terasa instan bagi tamu
    apiFetch(`/invitation/slug/${slug}`).then((freshData) => {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: freshData, timestamp: Date.now() }))
    }).catch(console.error)

    return data
  }

  // 2. Jika tidak ada cache, fetch normal dan simpan ke cache
  const data = await apiFetch(`/invitation/slug/${slug}`)
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }))
  return data
}

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
