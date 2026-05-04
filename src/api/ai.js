import { apiFetch } from './client'

export function getNovaCredits() {
  return apiFetch('/ai/credits')
}

export function chatWithNova(messages, currentData = {}) {
  return apiFetch('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ messages, currentData }),
  })
}

export function purchaseNovaCredits(packageId) {
  return apiFetch('/ai/credits/purchase', {
    method: 'POST',
    body: JSON.stringify({ packageId }),
  })
}
