/**
 * Private Invitation & Access Token Utilities for SatuUndangan
 * Helpers for token verification, guest URL building, and error classification.
 */

import { getGuestUrl, buildWhatsAppUrl, normalizePhoneNumber, formatGuestMessage } from './whatsappDistribution'
import { extractQrToken } from './qrCheckIn'

/**
 * Classifies API error responses when accessing digital invitations
 * Distinguishes 403 Private Lock vs 403 Unpublished vs 404 Not Found vs other errors.
 *
 * @param {object|Error} err - Error object from fetch or Axios
 * @returns {object} { type: string, isPrivateLock: boolean, message: string, status: number|null }
 */
export function classifyInvitationError(err) {
  const status = err?.response?.status || err?.status || null
  const serverMsg = err?.response?.data?.message || err?.message || ''
  const lowerMsg = String(serverMsg).toLowerCase()

  if (status === 403) {
    if (lowerMsg.includes('privat') || lowerMsg.includes('khusus')) {
      return {
        type: 'PRIVATE_RESTRICTED',
        isPrivateLock: true,
        status: 403,
        message: serverMsg || 'Undangan ini privat. Gunakan link undangan khusus dari pemilik.',
      }
    }
    if (lowerMsg.includes('belum dipublikasikan') || lowerMsg.includes('tidak aktif')) {
      return {
        type: 'UNPUBLISHED',
        isPrivateLock: false,
        status: 403,
        message: serverMsg || 'Undangan belum dipublikasikan',
      }
    }
    return {
      type: 'FORBIDDEN',
      isPrivateLock: false,
      status: 403,
      message: serverMsg,
    }
  }

  if (status === 404) {
    return {
      type: 'NOT_FOUND',
      isPrivateLock: false,
      status: 404,
      message: serverMsg || 'Undangan atau tamu tidak ditemukan',
    }
  }

  return {
    type: 'UNKNOWN_ERROR',
    isPrivateLock: false,
    status: status || 500,
    message: serverMsg || 'Terjadi kesalahan saat memuat undangan',
  }
}

/**
 * Validates whether an access token matches expected 24-byte base64url format
 * @param {string} token
 * @returns {boolean}
 */
export function isValidAccessToken(token) {
  if (!token || typeof token !== 'string') return false
  const trimmed = token.trim()
  // 24 random bytes in base64url is 32 characters, allowing safe 16-64 chars base64url
  return /^[A-Za-z0-9_-]{16,64}$/.test(trimmed)
}

export {
  getGuestUrl,
  buildWhatsAppUrl,
  normalizePhoneNumber,
  formatGuestMessage,
  extractQrToken,
}
