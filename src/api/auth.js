import { apiFetch } from './client'

export const login = (data) =>
  apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const register = (data) =>
  apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export async function getProfile(token) {
  return await apiFetch('/user/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  })
}
