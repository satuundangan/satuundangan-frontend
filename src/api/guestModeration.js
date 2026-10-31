import { apiFetch } from './client'

function buildQuery(params = {}) {
  const entries = Object.entries(params).filter(
    ([_, val]) => val !== undefined && val !== null && val !== '',
  )
  const qs = new URLSearchParams(entries).toString()
  return qs ? `?${qs}` : ''
}

export const getGuestDrilldown = (invitationId) =>
  apiFetch(`/guest-messages/drilldown/${invitationId}`)

export const getAdminGuestMessages = (params = {}) =>
  apiFetch(`/admin/guest-messages${buildQuery(params)}`)

export const moderateGuestMessage = (id, status) =>
  apiFetch(`/admin/guest-messages/${id}/moderate`, {
    method: 'PATCH',
    body: JSON.stringify(typeof status === 'object' && status !== null ? status : { status }),
  })

export const deleteAdminGuestMessage = (id) =>
  apiFetch(`/guest-messages/${id}`, {
    method: 'DELETE',
  })
