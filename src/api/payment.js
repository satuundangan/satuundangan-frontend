import { apiFetch } from './client'

export const createPayment = (data) =>
  apiFetch('/payment/create', {
    method: 'POST',
    body: JSON.stringify(data),
  })
