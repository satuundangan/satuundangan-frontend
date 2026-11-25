import { apiFetch } from './client'

/**
 * Public (Tamu Undangan): Ambil daftar kado impian berdasarkan ID undangan
 */
export const getPublicGiftRegistry = (invitationId) =>
  apiFetch(`/gift-registry/public/invitation/${invitationId}`)

/**
 * Public (Tamu Undangan): Ambil daftar kado impian berdasarkan slug undangan
 */
export const getPublicGiftRegistryBySlug = (slug) =>
  apiFetch(`/gift-registry/public/slug/${encodeURIComponent(slug)}`)

/**
 * Public (Tamu Undangan): Klaim kado impian (Anti-Kado Kembar)
 */
export const claimGiftRegistryItem = (id, data) =>
  apiFetch(`/gift-registry/public/${id}/claim`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

/**
 * Owner (Pengantin): Ambil daftar kado impian di dashboard / studio
 */
export const getGiftRegistryItems = (invitationId) =>
  apiFetch(`/gift-registry/invitation/${invitationId}`)

/**
 * Owner (Pengantin): Tambah item wishlist kado baru
 */
export const createGiftRegistryItem = (invitationId, data) =>
  apiFetch(`/gift-registry/invitation/${invitationId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

/**
 * Owner (Pengantin): Update info kado impian
 */
export const updateGiftRegistryItem = (id, data) =>
  apiFetch(`/gift-registry/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

/**
 * Owner (Pengantin): Hapus item kado impian
 */
export const deleteGiftRegistryItem = (id) =>
  apiFetch(`/gift-registry/${id}`, {
    method: 'DELETE',
  })

/**
 * Owner (Pengantin): Reset / batalkan status klaim agar kado bisa dipilih tamu lain
 */
export const unclaimGiftRegistryItem = (id) =>
  apiFetch(`/gift-registry/${id}/unclaim`, {
    method: 'POST',
  })
