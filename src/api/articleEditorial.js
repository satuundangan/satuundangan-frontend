import { apiFetch } from './client.js'

export const fetchArticleRevisions = (id) => apiFetch(`/admin/articles/${id}/revisions`)
export const fetchArticleRevision = (id, revisionId) =>
  apiFetch(`/admin/articles/${id}/revisions/${encodeURIComponent(revisionId)}`)
export const restoreArticleRevision = (id, revisionId, payload) =>
  apiFetch(`/admin/articles/${id}/revisions/${encodeURIComponent(revisionId)}/restore`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
