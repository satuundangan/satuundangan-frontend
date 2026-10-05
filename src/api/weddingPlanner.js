import { apiFetch } from './client'

export const getWeddingPlanner = () => apiFetch('/wedding-planner')

export const unlockWeddingPlanner = (data) =>
  apiFetch('/wedding-planner/unlock', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const updateWeddingPlanner = (data) =>
  apiFetch('/wedding-planner', {
    method: 'PUT',
    body: JSON.stringify(data),
  })

export const resetWeddingPlanner = () =>
  apiFetch('/wedding-planner/reset', {
    method: 'POST',
  })
