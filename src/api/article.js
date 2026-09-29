import { apiFetch } from './client'

export const fetchArticles = (params = {}) => {
  const qs = new URLSearchParams()
  if (params.page) qs.append('page', params.page)
  if (params.limit) qs.append('limit', params.limit)
  if (params.q) qs.append('q', params.q)
  if (params.category) qs.append('category', params.category)
  return apiFetch(`/articles?${qs.toString()}`)
}

export const fetchArticleBySlug = (slug) => {
  return apiFetch(`/articles/${slug}`)
}
