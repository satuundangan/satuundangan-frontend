/**
 * QR Code Check-in & Reception Desk Utilities for SatuUndangan
 * Handles:
 * - Token & URL extraction from QR scans (raw token, full URLs, query params, JSON payloads)
 * - Guest check-in state management and idempotency guarantees
 * - Reception check-in statistics calculation
 * - Guest filtering and search for reception desk
 */

/**
 * Extracts a guest access token from various raw QR scan inputs:
 * 1. Raw token string: 'abc123token'
 * 2. Full invitation URL: 'https://satuundangan.id/inv/romeo-juliet/abc123token'
 * 3. URL with query parameters: 'https://satuundangan.id/inv/romeo-juliet/abc123token?e=dGVzdA%3D%3D'
 * 4. URL with hash fragment: 'https://satuundangan.id/inv/romeo-juliet/abc123token#details'
 * 5. JSON string payload: '{"type":"checkin","token":"abc123token"}'
 * 6. Object payload: { token: 'abc123token' } or { accessToken: 'abc123token' }
 *
 * @param {any} raw - Raw scan output
 * @returns {string} Clean token or empty string if invalid
 */
export function extractQrToken(raw) {
  if (!raw) return ''

  let input = raw

  // Handle object payload
  if (typeof input === 'object' && input !== null) {
    input = input.token || input.accessToken || input.code || ''
  }

  if (typeof input !== 'string') {
    input = String(input)
  }

  input = input.trim()
  if (!input) return ''

  // Handle JSON string payload
  if (input.startsWith('{') && input.endsWith('}')) {
    try {
      const parsed = JSON.parse(input)
      if (parsed && typeof parsed === 'object') {
        const candidate = parsed.token || parsed.accessToken || parsed.code
        if (candidate && typeof candidate === 'string') {
          input = candidate.trim()
        }
      }
    } catch {
      // Not valid JSON, continue with original input
    }
  }

  // Strip query parameters and hash fragments
  input = input.split('?')[0].split('#')[0].trim()

  // Handle SatuUndangan invitation URL format: .../inv/:slug/:token
  if (input.includes('/inv/')) {
    const afterInv = input.split('/inv/')[1] || ''
    const parts = afterInv.split('/').filter(Boolean)
    if (parts.length >= 2) {
      return parts[1]
    } else if (parts.length === 1) {
      return parts[0]
    }
  }

  // Handle generic http/https URL ending with token
  if (input.startsWith('http://') || input.startsWith('https://')) {
    try {
      const parsedUrl = new URL(input)
      const pathParts = parsedUrl.pathname.split('/').filter(Boolean)
      if (pathParts.length > 0) {
        return pathParts[pathParts.length - 1]
      }
    } catch {
      const parts = input.split('/').filter(Boolean)
      if (parts.length > 0) {
        return parts[parts.length - 1]
      }
    }
  }

  return input
}

/**
 * Processes guest check-in with strict idempotency:
 * - If guest is not yet checked in: records timestamp and returns alreadyCheckedIn: false
 * - If guest was previously checked in: preserves original timestamp and returns alreadyCheckedIn: true
 *
 * @param {object} guest - Guest record
 * @param {Date|string} [timestamp=new Date()] - Check-in timestamp to record if first check-in
 * @returns {object} Result object with success, alreadyCheckedIn, check_in_time, message, and guest
 */
export function processGuestCheckIn(guest, timestamp = new Date()) {
  if (!guest || typeof guest !== 'object') {
    return {
      success: false,
      alreadyCheckedIn: false,
      message: 'Data tamu tidak ditemukan',
      check_in_time: null,
      guest: null,
    }
  }

  // Idempotency: Tamu sudah pernah check-in sebelumnya
  if (guest.checkedInAt) {
    return {
      success: true,
      alreadyCheckedIn: true,
      message: 'Tamu sudah pernah check-in sebelumnya',
      check_in_time: guest.checkedInAt,
      guest: { ...guest },
    }
  }

  // First-time check-in: catat waktu check-in tanpa mengubah field lain
  const checkInDate = timestamp instanceof Date ? timestamp : new Date(timestamp)
  guest.checkedInAt = checkInDate

  return {
    success: true,
    alreadyCheckedIn: false,
    message: `Tamu ${guest.name || ''} berhasil Check-in`.trim(),
    check_in_time: checkInDate,
    guest: { ...guest, checkedInAt: checkInDate },
  }
}

/**
 * Calculates reception desk check-in statistics:
 * - totalGuests: Total invited guests
 * - totalCheckedIn: Total guests who have checked in
 * - totalPending: Total guests not yet checked in
 * - percentage: Check-in attendance percentage rounded to 2 decimals
 * - recentCheckIns: List of checked-in guests sorted descending by checkedInAt
 *
 * @param {Array<object>} guests - Array of guest objects
 * @returns {object} Statistics summary
 */
export function calculateCheckInStats(guests = []) {
  if (!Array.isArray(guests) || guests.length === 0) {
    return {
      totalGuests: 0,
      totalCheckedIn: 0,
      totalPending: 0,
      percentage: 0,
      recentCheckIns: [],
    }
  }

  const totalGuests = guests.length
  const checkedInList = guests.filter((g) => Boolean(g && g.checkedInAt))
  const totalCheckedIn = checkedInList.length
  const totalPending = Math.max(0, totalGuests - totalCheckedIn)

  const percentage =
    totalGuests > 0
      ? Math.round((totalCheckedIn / totalGuests) * 10000) / 100
      : 0

  // Sort recent check-ins descending
  const recentCheckIns = [...checkedInList].sort((a, b) => {
    const timeA = new Date(a.checkedInAt).getTime() || 0
    const timeB = new Date(b.checkedInAt).getTime() || 0
    return timeB - timeA
  })

  return {
    totalGuests,
    totalCheckedIn,
    totalPending,
    percentage,
    recentCheckIns,
  }
}

/**
 * Filters reception guests list by search query and check-in status
 *
 * @param {Array<object>} guests - Array of guest objects
 * @param {object} options
 * @param {string} [options.searchQuery=''] - Search term (name, phone, group, slug)
 * @param {'all'|'checked_in'|'pending'} [options.statusFilter='all'] - Filter status
 * @returns {Array<object>} Filtered guests
 */
export function filterReceptionGuests(guests = [], { searchQuery = '', statusFilter = 'all' } = {}) {
  if (!Array.isArray(guests)) return []

  const query = (searchQuery || '').trim().toLowerCase()

  return guests.filter((g) => {
    if (!g) return false

    // Status filter
    if (statusFilter === 'checked_in' && !g.checkedInAt) return false
    if (statusFilter === 'pending' && g.checkedInAt) return false

    // Search query filter
    if (query) {
      const name = (g.name || '').toLowerCase()
      const phone = (g.phoneNumber || '').toLowerCase()
      const group = (g.group || '').toLowerCase()
      const degree = (g.degree || '').toLowerCase()
      const slug = (g.slug || '').toLowerCase()

      const matches =
        name.includes(query) ||
        phone.includes(query) ||
        group.includes(query) ||
        degree.includes(query) ||
        slug.includes(query)

      if (!matches) return false
    }

    return true
  })
}

/**
 * Formats check-in timestamp into readable Indonesian format
 * e.g., "29 Sep 2026, 21:50 WIB"
 *
 * @param {Date|string|number} timestamp
 * @returns {string} Formatted date string
 */
export function formatCheckInTime(timestamp) {
  if (!timestamp) return '-'
  try {
    const date = new Date(timestamp)
    if (isNaN(date.getTime())) return '-'

    const dateStr = date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    const timeStr = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    return `${dateStr}, ${timeStr} WIB`
  } catch {
    return '-'
  }
}
