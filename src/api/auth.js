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

export const forgotPassword = (data) =>
  apiFetch('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const resetPassword = (data) =>
  apiFetch('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const resendVerification = () =>
  apiFetch('/auth/resend-verification', {
    method: 'POST',
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

export const recordConsent = (data) =>
  apiFetch('/consent/record', {
    method: 'POST',
    body: JSON.stringify(data),
  })
