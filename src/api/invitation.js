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

export const getInvitationCategories = () => apiFetch('/invitation/categories')

export const getDashboardStats = () => apiFetch('/dashboard/stats')
