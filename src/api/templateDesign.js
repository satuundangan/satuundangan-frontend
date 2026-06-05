import { apiFetch } from './client'

export const createTemplateDesign = (data) =>
  apiFetch('/template-design', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const getTemplateDesigns = () => apiFetch('/template-design')

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
