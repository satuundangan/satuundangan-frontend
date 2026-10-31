import { apiFetch } from './client.js'

export const fetchArticleRevisions = (id) => apiFetch(`/admin/articles/${id}/revisions`)
export const fetchArticleRevision = (id, revisionId) =>
  apiFetch(`/admin/articles/${id}/revisions/${encodeURIComponent(revisionId)}`)
export const restoreArticleRevision = (id, revisionId, payload) =>
  apiFetch(`/admin/articles/${id}/revisions/${encodeURIComponent(revisionId)}/restore`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const fetchEditorialOverview = () => apiFetch('/admin/articles/editorial/overview')
export const fetchArticlePerformance = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ''),
  ).toString()
  return apiFetch(`/admin/articles/editorial/performance${query ? `?${query}` : ''}`)
}
export const checkArticleLinks = (id) =>
  apiFetch(`/admin/articles/${id}/check-links`, { method: 'POST' })
