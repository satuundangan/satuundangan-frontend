import { describe, it, expect } from 'vitest'
import {
  getGuestUrl,
  buildWhatsAppUrl,
  normalizePhoneNumber,
  formatGuestMessage,
  extractQrToken,
  classifyInvitationError,
  isValidAccessToken,
} from './privateInvitation'

describe('Private Invitation & Access Token Suite', () => {
  const mockPrivateInvitation = {
    id: 1,
    title: 'The Wedding of Romeo & Juliet',
    slug: 'romeo-juliet',
    coupleName: 'Romeo & Juliet',
    groomName: 'Romeo',
    brideName: 'Juliet',
    isGuestPublic: false,
    isPublished: true,
  }

  const mockGuestWithToken = {
    id: 101,
    name: 'Budi Santoso, S.Kom',
    degree: 'S.Kom',
    phoneNumber: '081234567890',
    slug: 'budi-santoso',
    accessToken: 'V1StGXR8_Z5jdHi6B-myT_uK', // 24-byte base64url (32 chars)
    group: 'VIP',
    rsvpStatus: 'belum',
  }

  describe('1. Guest URL Generation with getGuestUrl', () => {
    it('generates secure private URL using guest accessToken', () => {
      const url = getGuestUrl(
        mockGuestWithToken,
        mockPrivateInvitation,
        'https://satuundangan.id',
      )

      expect(url).toBe(
        'https://satuundangan.id/inv/romeo-juliet/V1StGXR8_Z5jdHi6B-myT_uK',
      )
    })

    it('appends base64 encrypted guest name if encryptedGuestName is true', () => {
      const secureInvitation = {
        ...mockPrivateInvitation,
        encryptedGuestName: true,
      }

      const url = getGuestUrl(
        mockGuestWithToken,
        secureInvitation,
        'https://satuundangan.id',
      )

      expect(url).toContain('/inv/romeo-juliet/V1StGXR8_Z5jdHi6B-myT_uK?e=')
      // Extract query param and decode
      const queryParam = url.split('?e=')[1]
      const decodedParam = decodeURIComponent(queryParam)
      const decodedName = Buffer.from(decodedParam, 'base64').toString('utf-8')
      expect(decodedName).toBe('Budi Santoso, S.Kom')
    })

    it('falls back to guest slug if accessToken is missing (legacy compatibility)', () => {
      const legacyGuest = {
        id: 102,
        name: 'Siti Rahma',
        slug: 'siti-rahma',
        accessToken: null,
      }

      const url = getGuestUrl(
        legacyGuest,
        mockPrivateInvitation,
        'https://satuundangan.id',
      )

      expect(url).toBe('https://satuundangan.id/inv/romeo-juliet/siti-rahma')
    })

    it('returns empty string if guest or invitation is null/undefined', () => {
      expect(getGuestUrl(null, mockPrivateInvitation)).toBe('')
      expect(getGuestUrl(mockGuestWithToken, null)).toBe('')
      expect(getGuestUrl(null, null)).toBe('')
    })

    it('strips trailing slashes from custom baseUrl', () => {
      const url = getGuestUrl(
        mockGuestWithToken,
        mockPrivateInvitation,
        'https://custom.wedding.id///',
      )

      expect(url).toBe(
        'https://custom.wedding.id/inv/romeo-juliet/V1StGXR8_Z5jdHi6B-myT_uK',
      )
    })
  })

  describe('2. Phone Number Normalization & WhatsApp Deeplink Generation', () => {
    it('normalizes local Indonesian mobile format (08xxx -> 628xxx)', () => {
      expect(normalizePhoneNumber('081234567890')).toBe('6281234567890')
      expect(normalizePhoneNumber('0899-1234-5678')).toBe('6289912345678')
      expect(normalizePhoneNumber('0857 1122 3344')).toBe('6285711223344')
    })

    it('normalizes international formats (+62xxx and 62xxx)', () => {
      expect(normalizePhoneNumber('+6281234567890')).toBe('6281234567890')
      expect(normalizePhoneNumber('6281234567890')).toBe('6281234567890')
      expect(normalizePhoneNumber('+62 812-3456-7890')).toBe('6281234567890')
    })

    it('returns empty string on null, undefined, or non-numeric inputs', () => {
      expect(normalizePhoneNumber(null)).toBe('')
      expect(normalizePhoneNumber(undefined)).toBe('')
      expect(normalizePhoneNumber('')).toBe('')
      expect(normalizePhoneNumber('abc-def')).toBe('')
    })

    it('builds valid WhatsApp URL with encoded message', () => {
      const waUrl = buildWhatsAppUrl('081234567890', 'Halo Budi!')
      expect(waUrl).toBe('https://wa.me/6281234567890?text=Halo%20Budi!')
    })

    it('formats guest message with template and embeds private token link', () => {
      const customTemplate =
        'Yth. [GuestName], silakan buka undangan pernikahan [CoupleName] di [Link]'

      const formatted = formatGuestMessage(
        customTemplate,
        mockGuestWithToken,
        mockPrivateInvitation,
        'https://satuundangan.id',
      )

      expect(formatted).toBe(
        'Yth. Budi Santoso, S.Kom, silakan buka undangan pernikahan Romeo & Juliet di https://satuundangan.id/inv/romeo-juliet/V1StGXR8_Z5jdHi6B-myT_uK',
      )
    })
  })

  describe('3. Token Extraction from Scans, URLs, and Payloads', () => {
    const expectedToken = 'V1StGXR8_Z5jdHi6B-myT_uK'

    it('extracts token from raw token string', () => {
      expect(extractQrToken(expectedToken)).toBe(expectedToken)
      expect(extractQrToken(`  ${expectedToken}  `)).toBe(expectedToken)
    })

    it('extracts token from full invitation URL (/inv/:slug/:token)', () => {
      const url = `https://satuundangan.id/inv/romeo-juliet/${expectedToken}`
      expect(extractQrToken(url)).toBe(expectedToken)
    })

    it('extracts token from invitation URL with query params (?e=...)', () => {
      const url = `https://satuundangan.id/inv/romeo-juliet/${expectedToken}?e=QnVkaSBTYW50b3Nv`
      expect(extractQrToken(url)).toBe(expectedToken)
    })

    it('extracts token from invitation URL with complex query params and hash fragment', () => {
      const url = `https://satuundangan.id/inv/romeo-juliet/${expectedToken}?source=qr&utm_campaign=wedding#reception`
      expect(extractQrToken(url)).toBe(expectedToken)
    })

    it('extracts token from single-segment URL path', () => {
      const url = `https://satuundangan.id/inv/${expectedToken}`
      expect(extractQrToken(url)).toBe(expectedToken)
    })

    it('extracts token from JSON string payload', () => {
      const payload1 = JSON.stringify({ token: expectedToken })
      const payload2 = JSON.stringify({ accessToken: expectedToken })
      const payload3 = JSON.stringify({ code: expectedToken })

      expect(extractQrToken(payload1)).toBe(expectedToken)
      expect(extractQrToken(payload2)).toBe(expectedToken)
      expect(extractQrToken(payload3)).toBe(expectedToken)
    })

    it('extracts token from object payload', () => {
      expect(extractQrToken({ token: expectedToken })).toBe(expectedToken)
      expect(extractQrToken({ accessToken: expectedToken })).toBe(expectedToken)
      expect(extractQrToken({ code: expectedToken })).toBe(expectedToken)
    })

    it('returns empty string on empty or falsy inputs', () => {
      expect(extractQrToken('')).toBe('')
      expect(extractQrToken('   ')).toBe('')
      expect(extractQrToken(null)).toBe('')
      expect(extractQrToken(undefined)).toBe('')
    })
  })

  describe('4. Error Status Detection & Invitation Access Gating', () => {
    it('detects 403 Forbidden with Indonesian message as PRIVATE_RESTRICTED lock', () => {
      const err = {
        status: 403,
        message:
          'Undangan ini privat. Gunakan link undangan khusus dari pemilik.',
      }

      const classification = classifyInvitationError(err)

      expect(classification.type).toBe('PRIVATE_RESTRICTED')
      expect(classification.isPrivateLock).toBe(true)
      expect(classification.status).toBe(403)
      expect(classification.message).toContain('privat')
    })

    it('detects Axios response formatted 403 private error', () => {
      const axiosErr = {
        response: {
          status: 403,
          data: {
            statusCode: 403,
            message:
              'Undangan ini privat. Gunakan link undangan khusus dari pemilik.',
          },
        },
      }

      const classification = classifyInvitationError(axiosErr)

      expect(classification.type).toBe('PRIVATE_RESTRICTED')
      expect(classification.isPrivateLock).toBe(true)
      expect(classification.status).toBe(403)
    })

    it('detects 403 Forbidden as UNPUBLISHED when message indicates unpublished', () => {
      const err = {
        status: 403,
        message: 'Undangan belum dipublikasikan',
      }

      const classification = classifyInvitationError(err)

      expect(classification.type).toBe('UNPUBLISHED')
      expect(classification.isPrivateLock).toBe(false)
      expect(classification.status).toBe(403)
      expect(classification.message).toBe('Undangan belum dipublikasikan')
    })

    it('detects 404 Not Found error', () => {
      const err = {
        status: 404,
        message: 'Guest not found',
      }

      const classification = classifyInvitationError(err)

      expect(classification.type).toBe('NOT_FOUND')
      expect(classification.isPrivateLock).toBe(false)
      expect(classification.status).toBe(404)
    })

    it('handles unexpected 500 server or network error gracefully', () => {
      const err = new Error('Network Error')

      const classification = classifyInvitationError(err)

      expect(classification.type).toBe('UNKNOWN_ERROR')
      expect(classification.isPrivateLock).toBe(false)
      expect(classification.message).toBe('Network Error')
    })
  })

  describe('5. Access Token Cryptographic Format Validation', () => {
    it('validates 24-byte base64url tokens (typically 32 chars without padding)', () => {
      expect(isValidAccessToken('V1StGXR8_Z5jdHi6B-myT_uK90AbCdEf')).toBe(true)
      expect(isValidAccessToken('aB9_xY12-34_token_example_123456')).toBe(true)
    })

    it('rejects tokens that are too short, empty, or contain invalid URL characters', () => {
      expect(isValidAccessToken('')).toBe(false)
      expect(isValidAccessToken('short')).toBe(false) // < 16 chars
      expect(isValidAccessToken(null)).toBe(false)
      expect(isValidAccessToken(undefined)).toBe(false)
      expect(isValidAccessToken('invalid token with spaces')).toBe(false)
      expect(isValidAccessToken('token+with/standard+base64=')).toBe(false) // contains +, /, =
    })
  })
})
