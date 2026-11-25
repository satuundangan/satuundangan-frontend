import { apiFetch } from './client'

/**
 * Public: Ambil info portal snap & galeri foto tamu yang disetujui
 */
export const getSnapPortalInfo = (slug) =>
  apiFetch(`/guest-photos/public/slug/${encodeURIComponent(slug)}`)

/**
 * Public: Ambil feed foto tamu untuk Live Screen / Proyektor
 */
export const getLiveGuestPhotos = (slug) =>
  apiFetch(`/guest-photos/live-feed/${encodeURIComponent(slug)}`)

/**
 * Public: Unggah foto candid tamu ke Memory Wall
 * @param {string} slug
 * @param {{ file: File, guestName?: string, caption?: string }} payload
 */
export const uploadGuestPhoto = (slug, { file, guestName, caption }) => {
  const formData = new FormData()
  formData.append('file', file)
  if (guestName?.trim()) formData.append('guestName', guestName.trim())
  if (caption?.trim()) formData.append('caption', caption.trim())

  return apiFetch(`/guest-photos/${encodeURIComponent(slug)}/upload`, {
    method: 'POST',
    body: formData,
  })
}

/**
 * Owner (JWT): Ambil semua foto tamu untuk moderasi di dashboard
 */
export const getOwnerGuestPhotos = (invitationId) =>
  apiFetch(`/guest-photos/invitation/${invitationId}`)

/**
 * Owner (JWT): Ubah status tampil/sembunyi foto di proyektor
 */
export const toggleGuestPhotoApproval = (id, isApproved) =>
  apiFetch(`/guest-photos/${id}/approve`, {
    method: 'PATCH',
    body: JSON.stringify({ isApproved }),
  })

/**
 * Owner (JWT): Hapus foto tamu secara permanen
 */
export const deleteGuestPhoto = (id) =>
  apiFetch(`/guest-photos/${id}`, {
    method: 'DELETE',
  })
