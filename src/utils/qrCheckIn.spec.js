import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  extractQrToken,
  processGuestCheckIn,
  calculateCheckInStats,
  filterReceptionGuests,
  formatCheckInTime,
} from './qrCheckIn'

describe('Fitur #2: QR Code Check-in & Buku Tamu Meja Resepsi - QA Suite', () => {
  describe('1. Token & URL Extraction Matrix', () => {
    it('verifies parsing of raw token: "abc123token"', () => {
      const rawToken = 'abc123token'
      const extracted = extractQrToken(rawToken)
      expect(extracted).toBe('abc123token')
    })

    it('verifies parsing of raw token with surrounding whitespaces', () => {
      const rawToken = '   abc123token   \n'
      const extracted = extractQrToken(rawToken)
      expect(extracted).toBe('abc123token')
    })

    it('verifies parsing of full invitation URL: "https://satuundangan.id/inv/romeo-juliet/abc123token"', () => {
      const url = 'https://satuundangan.id/inv/romeo-juliet/abc123token'
      const extracted = extractQrToken(url)
      expect(extracted).toBe('abc123token')
    })

    it('verifies parsing of URL with query params: "https://satuundangan.id/inv/romeo-juliet/abc123token?e=dGVzdA%3D%3D"', () => {
      const urlWithQuery =
        'https://satuundangan.id/inv/romeo-juliet/abc123token?e=dGVzdA%3D%3D'
      const extracted = extractQrToken(urlWithQuery)
      expect(extracted).toBe('abc123token')
    })

    it('verifies parsing of URL with multiple query params and hash fragment', () => {
      const url =
        'https://satuundangan.id/inv/romeo-juliet/abc123token?source=qr&utm_campaign=wedding#reception'
      const extracted = extractQrToken(url)
      expect(extracted).toBe('abc123token')
    })

    it('verifies parsing of single-segment invitation URL: "https://satuundangan.id/inv/abc123token"', () => {
      const url = 'https://satuundangan.id/inv/abc123token'
      const extracted = extractQrToken(url)
      expect(extracted).toBe('abc123token')
    })

    it('verifies parsing of generic URL ending with token', () => {
      const url = 'https://example.com/tickets/abc123token'
      const extracted = extractQrToken(url)
      expect(extracted).toBe('abc123token')
    })

    it('verifies parsing of JSON payload: \'{"type":"checkin","token":"abc123token"}\'', () => {
      const jsonPayload = '{"type":"checkin","token":"abc123token"}'
      const extracted = extractQrToken(jsonPayload)
      expect(extracted).toBe('abc123token')
    })

    it('verifies parsing of JSON payload with accessToken property', () => {
      const jsonPayload = '{"event":"wedding","accessToken":"abc123token"}'
      const extracted = extractQrToken(jsonPayload)
      expect(extracted).toBe('abc123token')
    })

    it('verifies parsing of JSON payload with code property', () => {
      const jsonPayload = '{"code":"abc123token"}'
      const extracted = extractQrToken(jsonPayload)
      expect(extracted).toBe('abc123token')
    })

    it('verifies parsing of direct JS object payloads', () => {
      expect(extractQrToken({ token: 'abc123token' })).toBe('abc123token')
      expect(extractQrToken({ accessToken: 'xyz456token' })).toBe('xyz456token')
      expect(extractQrToken({ code: 'code789' })).toBe('code789')
    })

    it('handles empty, null, undefined, and non-string invalid inputs safely', () => {
      expect(extractQrToken('')).toBe('')
      expect(extractQrToken(null)).toBe('')
      expect(extractQrToken(undefined)).toBe('')
      expect(extractQrToken(12345)).toBe('12345')
      expect(extractQrToken('   ')).toBe('')
    })

    it('handles malformed JSON strings without throwing errors', () => {
      const malformedJson = '{invalid-json-content'
      expect(extractQrToken(malformedJson)).toBe('{invalid-json-content')
    })
  })

  describe('2. Check-in State & Idempotency Verification', () => {
    it('first check-in sets checkedInAt timestamp and returns alreadyCheckedIn: false', () => {
      const mockGuest = {
        id: 1,
        name: 'Budi Santoso',
        phoneNumber: '08123456789',
        group: 'VIP',
        checkedInAt: null,
      }

      const checkInTime = new Date('2026-09-29T19:30:00.000Z')
      const result = processGuestCheckIn(mockGuest, checkInTime)

      expect(result.success).toBe(true)
      expect(result.alreadyCheckedIn).toBe(false)
      expect(result.check_in_time).toEqual(checkInTime)
      expect(result.message).toBe('Tamu Budi Santoso berhasil Check-in')
      expect(mockGuest.checkedInAt).toEqual(checkInTime)
    })

    it('subsequent check-in does NOT mutate original timestamp and returns alreadyCheckedIn: true', () => {
      const originalTimestamp = new Date('2026-09-29T19:30:00.000Z')
      const mockGuest = {
        id: 2,
        name: 'Siti Aminah',
        phoneNumber: '08987654321',
        group: 'Keluarga',
        checkedInAt: originalTimestamp,
      }

      const subsequentAttemptTime = new Date('2026-09-29T20:15:00.000Z')
      const result = processGuestCheckIn(mockGuest, subsequentAttemptTime)

      expect(result.success).toBe(true)
      expect(result.alreadyCheckedIn).toBe(true)
      expect(result.message).toBe('Tamu sudah pernah check-in sebelumnya')
      // Original timestamp MUST NOT be altered
      expect(result.check_in_time).toEqual(originalTimestamp)
      expect(mockGuest.checkedInAt).toEqual(originalTimestamp)
      expect(mockGuest.checkedInAt).not.toEqual(subsequentAttemptTime)
    })

    it('handles falsy or invalid guest objects safely', () => {
      const resultNull = processGuestCheckIn(null)
      expect(resultNull.success).toBe(false)
      expect(resultNull.alreadyCheckedIn).toBe(false)
      expect(resultNull.message).toContain('tidak ditemukan')

      const resultUndefined = processGuestCheckIn(undefined)
      expect(resultUndefined.success).toBe(false)
    })
  })

  describe('3. Statistics Calculation Accuracy', () => {
    it('calculates total guests, checked-in count, and percentage accurately for partial attendance', () => {
      const mockGuests = [
        { id: 1, name: 'Tamu A', checkedInAt: new Date('2026-09-29T10:00:00Z') },
        { id: 2, name: 'Tamu B', checkedInAt: null },
        { id: 3, name: 'Tamu C', checkedInAt: new Date('2026-09-29T10:30:00Z') },
        { id: 4, name: 'Tamu D', checkedInAt: null },
      ]

      const stats = calculateCheckInStats(mockGuests)

      expect(stats.totalGuests).toBe(4)
      expect(stats.totalCheckedIn).toBe(2)
      expect(stats.totalPending).toBe(2)
      expect(stats.percentage).toBe(50) // 2 / 4 = 50%
      expect(stats.recentCheckIns).toHaveLength(2)
      // Most recent first: Tamu C (10:30) before Tamu A (10:00)
      expect(stats.recentCheckIns[0].name).toBe('Tamu C')
      expect(stats.recentCheckIns[1].name).toBe('Tamu A')
    })

    it('handles rounding to 2 decimal places for fractional percentages (e.g. 1 out of 3 = 33.33%)', () => {
      const mockGuests = [
        { id: 1, name: 'Tamu 1', checkedInAt: new Date() },
        { id: 2, name: 'Tamu 2', checkedInAt: null },
        { id: 3, name: 'Tamu 3', checkedInAt: null },
      ]

      const stats = calculateCheckInStats(mockGuests)

      expect(stats.totalGuests).toBe(3)
      expect(stats.totalCheckedIn).toBe(1)
      expect(stats.percentage).toBe(33.33)
    })

    it('handles 100% check-in rate correctly', () => {
      const mockGuests = [
        { id: 1, name: 'Tamu 1', checkedInAt: new Date('2026-09-29T11:00:00Z') },
        { id: 2, name: 'Tamu 2', checkedInAt: new Date('2026-09-29T11:05:00Z') },
      ]

      const stats = calculateCheckInStats(mockGuests)

      expect(stats.totalGuests).toBe(2)
      expect(stats.totalCheckedIn).toBe(2)
      expect(stats.totalPending).toBe(0)
      expect(stats.percentage).toBe(100)
    })

    it('handles 0 guests safely without division by zero errors or NaN', () => {
      const statsEmpty = calculateCheckInStats([])
      expect(statsEmpty.totalGuests).toBe(0)
      expect(statsEmpty.totalCheckedIn).toBe(0)
      expect(statsEmpty.percentage).toBe(0)
      expect(statsEmpty.recentCheckIns).toEqual([])

      const statsNull = calculateCheckInStats(null)
      expect(statsNull.percentage).toBe(0)
    })
  })

  describe('4. Reception Guest Filtering & Formatting', () => {
    const guestList = [
      {
        id: 1,
        name: 'Andi Pratama',
        phoneNumber: '08123456789',
        group: 'VIP',
        checkedInAt: '2026-09-29T12:00:00Z',
      },
      {
        id: 2,
        name: 'Budi Santoso',
        phoneNumber: '08555666777',
        group: 'Teman Kantor',
        checkedInAt: null,
      },
      {
        id: 3,
        name: 'Citra Dewi',
        phoneNumber: '08777888999',
        group: 'Keluarga',
        checkedInAt: '2026-09-29T12:30:00Z',
      },
    ]

    it('filters guests by search keyword across name, phone, or group', () => {
      const byName = filterReceptionGuests(guestList, { searchQuery: 'andi' })
      expect(byName).toHaveLength(1)
      expect(byName[0].name).toBe('Andi Pratama')

      const byPhone = filterReceptionGuests(guestList, { searchQuery: '08555' })
      expect(byPhone).toHaveLength(1)
      expect(byPhone[0].name).toBe('Budi Santoso')

      const byGroup = filterReceptionGuests(guestList, { searchQuery: 'keluarga' })
      expect(byGroup).toHaveLength(1)
      expect(byGroup[0].name).toBe('Citra Dewi')
    })

    it('filters guests by check-in status (checked_in vs pending)', () => {
      const checkedInOnly = filterReceptionGuests(guestList, {
        statusFilter: 'checked_in',
      })
      expect(checkedInOnly).toHaveLength(2)
      expect(checkedInOnly.every((g) => Boolean(g.checkedInAt))).toBe(true)

      const pendingOnly = filterReceptionGuests(guestList, {
        statusFilter: 'pending',
      })
      expect(pendingOnly).toHaveLength(1)
      expect(pendingOnly[0].name).toBe('Budi Santoso')
    })

    it('formats check-in timestamp into readable Indonesian datetime string', () => {
      const sampleIso = '2026-09-29T14:30:00.000Z'
      const formatted = formatCheckInTime(sampleIso)
      expect(formatted).toContain('2026')
      expect(formatted).toContain('WIB')

      expect(formatCheckInTime(null)).toBe('-')
      expect(formatCheckInTime('')).toBe('-')
      expect(formatCheckInTime('invalid-date')).toBe('-')
    })
  })
})
