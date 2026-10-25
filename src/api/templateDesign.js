import { apiFetch } from './client'

function withParams(path, params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.append(key, value)
  })
  const query = searchParams.toString()
  return query ? `${path}?${query}` : path
}

export const createTemplateDesign = (data) =>
  apiFetch('/template-design', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const getTemplateDesigns = (params) =>
  params ? apiFetch(withParams('/template-design', params)) : apiFetch('/template-design')

export const getTemplateDesignById = (id) => apiFetch(`/template-design/${id}`)

export const getTemplateDesignBySlug = (slug) => apiFetch(`/template-design/slug/${slug}`)

export const updateTemplateDesign = (id, data) =>
  apiFetch(`/template-design/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

export const deleteTemplateDesign = (id) =>
  apiFetch(`/template-design/${id}`, {
    method: 'DELETE',
  })
