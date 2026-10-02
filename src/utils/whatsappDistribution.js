/**
 * WhatsApp Distribution & Guest Blast Utilities for SatuUndangan
 */

export const PRESET_TEMPLATES = [
  {
    id: 'formal-islami',
    title: 'Formal Islami',
    desc: "Assalamu'alaikum, Yth. [GuestName]...",
    content: `Assalamu'alaikum Wr. Wb.

Yth. *[GuestName]*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

*[CoupleName]*

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu kepada kami.

Detail Undangan & Konfirmasi Kehadiran:
[Link]

Atas perhatian dan doa restunya, kami ucapkan terima kasih.

Wassalamu'alaikum Wr. Wb.

Kami yang berbahagia,
*[CoupleName]*`,
  },
  {
    id: 'nasional-santai',
    title: 'Nasional & Santai',
    desc: 'Halo [GuestName], dengan sukacita...',
    content: `Halo [GuestName]!

Dengan penuh sukacita dan rasa bahagia, kami ingin berbagi momen spesial pernikahan kami:

*[CoupleName]*

Kami sangat berharap kehadiran dan doa restumu di hari bahagia kami.

Untuk info lengkap jadwal, lokasi, dan konfirmasi kehadiran, silakan buka tautan undangan kami berikut:
[Link]

Sampai jumpa di hari bahagia kami!

Salam hangat,
*[CoupleName]*`,
  },
  {
    id: 'adat-sopan',
    title: 'Adat & Sopan',
    desc: 'Kepada Yth. Bapak/Ibu/Saudara/i [GuestName]...',
    content: `Kepada Yth.
Bapak/Ibu/Saudara/i *[GuestName]*

Salam sejahtera bagi kita semua.

Dengan kerendahan hati dan rasa syukur yang mendalam, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk berkenan hadir dan memberikan restu pada resepsi pernikahan kami:

*[CoupleName]*

Informasi lengkap mengenai jadwal dan lokasi acara dapat diakses melalui undangan digital berikut:
[Link]

Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan suatu kehormatan dan kebahagiaan tersendiri bagi kami sekeluarga.

Hormat kami,
*[CoupleName]*`,
  },
  {
    id: 'singkat-ringkas',
    title: 'Singkat / Ringkas',
    desc: 'Salam hangat [GuestName]...',
    content: `Salam hangat [GuestName],

Kami mengundang Anda untuk hadir dan memberikan doa restu di hari bahagia pernikahan kami:

*[CoupleName]*

Lihat detail acara dan konfirmasi kehadiran Anda di tautan berikut:
[Link]

Terima kasih atas perhatian dan doa restunya!

*[CoupleName]*`,
  },
]

/**
 * Normalizes phone numbers to WhatsApp international MSISDN format (62...)
 * Handles:
 * - '08123456789' -> '628123456789'
 * - '+628123456789' -> '628123456789'
 * - '628123456789' -> '628123456789'
 * - '0812-3456-789' -> '628123456789'
 * - ' +62 812 3456 789 ' -> '628123456789'
 */
export function normalizePhoneNumber(rawPhone) {
  if (!rawPhone) return ''
  const digitsOnly = String(rawPhone).replace(/[^0-9]/g, '')
  if (!digitsOnly) return ''

  if (digitsOnly.startsWith('0')) {
    return `62${digitsOnly.slice(1)}`
  }
  // Excel drops the leading 0 of 08xx numbers, leaving 8xx
  if (digitsOnly.startsWith('8')) {
    return `62${digitsOnly}`
  }
  return digitsOnly
}

/**
 * Builds valid https://wa.me/ URL with URI-encoded text
 */
export function buildWhatsAppUrl(phone, message = '') {
  const waNumber = normalizePhoneNumber(phone)
  const encodedText = encodeURIComponent(message || '')
  if (waNumber) {
    return `https://wa.me/${waNumber}?text=${encodedText}`
  }
  return `https://wa.me/?text=${encodedText}`
}

/**
 * Resolves couple display name
 */
export function getCoupleDisplayName(invitation) {
  if (!invitation) return 'Mempelai'
  if (invitation.coupleName && invitation.coupleName.trim()) {
    return invitation.coupleName.trim()
  }
  const groom = invitation.groomName?.trim() || ''
  const bride = invitation.brideName?.trim() || ''
  if (groom && bride) return `${groom} & ${bride}`
  return invitation.title || 'Mempelai'
}

/**
 * Encodes string to base64 safely across browser and node environments
 */
export function encodeBase64Safe(str) {
  if (!str) return ''
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'utf-8').toString('base64')
  }
  if (typeof btoa !== 'undefined') {
    return btoa(unescape(encodeURIComponent(str)))
  }
  return ''
}

/**
 * Builds target invitation link for a specific guest
 */
export function getGuestUrl(guest, invitation, baseUrl) {
  if (!invitation || !guest) return ''
  const origin =
    baseUrl ||
    (typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://satuundangan.id')

  const token = guest.accessToken || guest.slug || guest.id
  let url = `${origin.replace(/\/$/, '')}/inv/${invitation.slug}/${token}`

  if (invitation.encryptedGuestName && guest.name) {
    const b64 = encodeBase64Safe(guest.name)
    if (b64) {
      url += `?e=${encodeURIComponent(b64)}`
    }
  }

  return url
}

/**
 * Replaces placeholders [GuestName], [CoupleName], [GroomName], [BrideName], [Link]
 */
export function formatGuestMessage(rawTemplate, guest, invitation, baseUrl) {
  const template =
    rawTemplate || invitation?.whatsappMessageTemplate || PRESET_TEMPLATES[0].content
  const coupleName = getCoupleDisplayName(invitation)
  const groomName = invitation?.groomName || 'Mempelai Pria'
  const brideName = invitation?.brideName || 'Mempelai Wanita'
  const guestName = guest?.name || 'Nama Tamu'
  const guestLink = guest
    ? getGuestUrl(guest, invitation, baseUrl)
    : `https://satuundangan.id/inv/${invitation?.slug || 'undangan'}/sample`

  return template
    .replace(/\[GuestName\]/g, guestName)
    .replace(/\[CoupleName\]/g, coupleName)
    .replace(/\[GroomName\]/g, groomName)
    .replace(/\[BrideName\]/g, brideName)
    .replace(/\[Link\]/g, guestLink)
}

/**
 * Filters guest list by status ('all' | 'unsent' | 'sent'), category group, and search query
 */
export function filterGuests(guests, { status = 'all', group = '', search = '' } = {}) {
  if (!Array.isArray(guests)) return []

  let list = guests

  // Status Filter
  if (status === 'unsent') {
    list = list.filter((g) => g.statusSend !== 'sent')
  } else if (status === 'sent') {
    list = list.filter((g) => g.statusSend === 'sent')
  }

  // Category Filter
  if (group) {
    const grpLower = group.toLowerCase().trim()
    list = list.filter((g) => (g.group || '').toLowerCase().trim() === grpLower)
  }

  // Search Filter
  if (search) {
    const q = search.toLowerCase().trim()
    list = list.filter((g) => {
      const matchName = (g.name || '').toLowerCase().includes(q)
      const matchPhone = (g.phoneNumber || '').toLowerCase().includes(q)
      const matchGroup = (g.group || '').toLowerCase().includes(q)
      return matchName || matchPhone || matchGroup
    })
  }

  return list
}

/**
 * Computes statistics for guest list distribution
 */
export function computeGuestStats(guests) {
  const list = Array.isArray(guests) ? guests : []
  const total = list.length
  const sent = list.filter((g) => g.statusSend === 'sent').length
  const unsent = list.filter((g) => g.statusSend !== 'sent').length
  const percentage = total === 0 ? 0 : Math.round((sent / total) * 100)

  return { total, sent, unsent, percentage }
}

/**
 * Helper to get next queue index bounded safely
 */
export function getNextQueueIndex(currentIndex, length) {
  if (length <= 0) return 0
  return Math.min(currentIndex + 1, length - 1)
}

/**
 * Helper to get previous queue index bounded safely
 */
export function getPrevQueueIndex(currentIndex) {
  return Math.max(currentIndex - 1, 0)
}
