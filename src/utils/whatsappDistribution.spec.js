import { describe, it, expect } from 'vitest'
import {
  PRESET_TEMPLATES,
  normalizePhoneNumber,
  buildWhatsAppUrl,
  getCoupleDisplayName,
  getGuestUrl,
  formatGuestMessage,
  filterGuests,
  computeGuestStats,
  getNextQueueIndex,
  getPrevQueueIndex,
} from './whatsappDistribution'

describe('WhatsApp Distribution & Guest Blast QA Suite', () => {
  describe('1. Phone Number Normalization & WhatsApp URL Formatting', () => {
    it('normalizes local leading zero format: 08123456789 -> 628123456789', () => {
      const raw = '08123456789'
      const normalized = normalizePhoneNumber(raw)
      expect(normalized).toBe('628123456789')

      const url = buildWhatsAppUrl(raw, 'Halo Tamu')
      expect(url).toBe('https://wa.me/628123456789?text=Halo%20Tamu')
    })

    it('normalizes plus prefix international format: +628123456789 -> 628123456789', () => {
      const raw = '+628123456789'
      const normalized = normalizePhoneNumber(raw)
      expect(normalized).toBe('628123456789')

      const url = buildWhatsAppUrl(raw, 'Undangan Pernikahan')
      expect(url).toBe('https://wa.me/628123456789?text=Undangan%20Pernikahan')
    })

    it('preserves clean international prefix: 628123456789 -> 628123456789', () => {
      const raw = '628123456789'
      const normalized = normalizePhoneNumber(raw)
      expect(normalized).toBe('628123456789')

      const url = buildWhatsAppUrl(raw, 'Terima kasih')
      expect(url).toBe('https://wa.me/628123456789?text=Terima%20kasih')
    })

    it('sanitizes dashes, spaces, and brackets: 0812-3456-789 -> 628123456789', () => {
      const raw = '0812-3456-789'
      const normalized = normalizePhoneNumber(raw)
      expect(normalized).toBe('628123456789')

      const url = buildWhatsAppUrl(raw, 'Cek Undangan')
      expect(url).toBe('https://wa.me/628123456789?text=Cek%20Undangan')
    })

    it('handles formatted numbers with country code, spaces, and dashes: +62 (812) 3456-789', () => {
      const raw = '+62 (812) 3456-789'
      const normalized = normalizePhoneNumber(raw)
      expect(normalized).toBe('628123456789')

      const url = buildWhatsAppUrl(raw, 'Spesial')
      expect(url).toBe('https://wa.me/628123456789?text=Spesial')
    })

    it('gracefully handles empty, null, or non-numeric phone values', () => {
      expect(normalizePhoneNumber('')).toBe('')
      expect(normalizePhoneNumber(null)).toBe('')
      expect(normalizePhoneNumber(undefined)).toBe('')
      expect(normalizePhoneNumber('no-phone')).toBe('')

      // URL without phone targets wa.me generic share endpoint
      expect(buildWhatsAppUrl('', 'Pesan')).toBe('https://wa.me/?text=Pesan')
      expect(buildWhatsAppUrl(null, 'Pesan')).toBe('https://wa.me/?text=Pesan')
    })
  })

  describe('2. WhatsApp Message Template Placeholders & Encoding', () => {
    const mockInvitation = {
      title: 'Pernikahan Romeo & Juliet',
      slug: 'romeo-juliet',
      groomName: 'Romeo Montague',
      brideName: 'Juliet Capulet',
      coupleName: 'Romeo & Juliet',
      encryptedGuestName: false,
      whatsappMessageTemplate: 'Kepada [GuestName], hadir ya di pernikahan [CoupleName] ([GroomName] & [BrideName]) di link: [Link]',
    }

    const mockGuest = {
      id: 101,
      name: 'Budi Santoso, S.Kom',
      accessToken: 'token-abc-123',
      phoneNumber: '08123456789',
    }

    it('replaces all placeholders [GuestName], [CoupleName], [GroomName], [BrideName], [Link]', () => {
      const formatted = formatGuestMessage(
        mockInvitation.whatsappMessageTemplate,
        mockGuest,
        mockInvitation,
        'https://satuundangan.id',
      )

      expect(formatted).toContain('Kepada Budi Santoso, S.Kom')
      expect(formatted).toContain('pernikahan Romeo & Juliet')
      expect(formatted).toContain('Romeo Montague & Juliet Capulet')
      expect(formatted).toContain('https://satuundangan.id/inv/romeo-juliet/token-abc-123')
      expect(formatted).not.toContain('[GuestName]')
      expect(formatted).not.toContain('[CoupleName]')
      expect(formatted).not.toContain('[GroomName]')
      expect(formatted).not.toContain('[BrideName]')
      expect(formatted).not.toContain('[Link]')
    })

    it('replaces multiple instances of identical placeholders within a template', () => {
      const template = 'Hai [GuestName]! Mohon doa dari [GuestName]. Link: [Link] atau buka lagi [Link]'
      const formatted = formatGuestMessage(template, mockGuest, mockInvitation, 'https://satuundangan.id')

      expect(formatted).toBe(
        'Hai Budi Santoso, S.Kom! Mohon doa dari Budi Santoso, S.Kom. Link: https://satuundangan.id/inv/romeo-juliet/token-abc-123 atau buka lagi https://satuundangan.id/inv/romeo-juliet/token-abc-123',
      )
    })

    it('encodes special characters, emoji, and newlines safely with encodeURIComponent in WhatsApp URL', () => {
      const messageWithEmojis = `Assalamu'alaikum 💍✨\nSelamat datang di hari bahagia kami!\nCinta & Doa Restu ❤️\nLink: https://satuundangan.id/inv/test?ref=wa#rsvp`
      const url = buildWhatsAppUrl('08123456789', messageWithEmojis)

      expect(url).toContain('https://wa.me/628123456789?text=')
      // Ensure emojis and special symbols are properly URI encoded
      expect(url).toContain(encodeURIComponent('💍✨'))
      expect(url).toContain(encodeURIComponent('❤️'))
      expect(url).toContain(encodeURIComponent('&'))
      expect(url).toContain(encodeURIComponent('\n'))
      expect(url).not.toContain(' ') // Spaces must be %20 encoded
    })

    it('appends encrypted guest name parameter (?e=...) when encryptedGuestName is active', () => {
      const secureInvitation = {
        ...mockInvitation,
        encryptedGuestName: true,
      }

      const guestUrl = getGuestUrl(mockGuest, secureInvitation, 'https://satuundangan.id')
      expect(guestUrl).toContain('https://satuundangan.id/inv/romeo-juliet/token-abc-123?e=')

      const urlObj = new URL(guestUrl)
      const eParam = urlObj.searchParams.get('e')
      expect(eParam).toBeTruthy()
      // Decoded base64 should match guest name
      const decoded = Buffer.from(eParam, 'base64').toString('utf-8')
      expect(decoded).toBe('Budi Santoso, S.Kom')
    })

    it('provides reliable fallbacks when invitation fields are missing or empty', () => {
      const bareInvitation = {
        slug: 'undangan-bare',
      }
      expect(getCoupleDisplayName(bareInvitation)).toBe('Mempelai')

      const formatted = formatGuestMessage(
        'Halo [GuestName], dari [CoupleName]. Pria: [GroomName], Wanita: [BrideName]',
        null,
        bareInvitation,
      )
      expect(formatted).toBe('Halo Nama Tamu, dari Mempelai. Pria: Mempelai Pria, Wanita: Mempelai Wanita')
    })

    it('verifies all 4 built-in preset templates contain standard valid placeholders', () => {
      expect(PRESET_TEMPLATES).toHaveLength(4)
      for (const preset of PRESET_TEMPLATES) {
        expect(preset.content).toContain('[GuestName]')
        expect(preset.content).toContain('[CoupleName]')
        expect(preset.content).toContain('[Link]')
      }
    })
  })

  describe('3. Guest State Management, Filtering & Queue Runner', () => {
    const mockGuestList = [
      { id: 1, name: 'Ahmad Dahlan', phoneNumber: '0811111111', group: 'Keluarga', statusSend: 'sent', rsvpStatus: 'hadir' },
      { id: 2, name: 'Bambang Soediro', phoneNumber: '0822222222', group: 'Teman', statusSend: null, rsvpStatus: 'belum' },
      { id: 3, name: 'Citra Kirana', phoneNumber: '0833333333', group: 'VIP', statusSend: 'unsent', rsvpStatus: 'tidak' },
      { id: 4, name: 'Dewi Lestari', phoneNumber: '0844444444', group: 'Teman', statusSend: 'sent', rsvpStatus: 'hadir' },
      { id: 5, name: 'Eko Prasetyo', phoneNumber: '0855555555', group: 'Keluarga', statusSend: undefined, rsvpStatus: 'belum' },
    ]

    describe('Filtering Subsets', () => {
      it('returns all guests when status filter is "all"', () => {
        const result = filterGuests(mockGuestList, { status: 'all' })
        expect(result).toHaveLength(5)
      })

      it('returns only unsent guests when status filter is "unsent"', () => {
        const result = filterGuests(mockGuestList, { status: 'unsent' })
        expect(result).toHaveLength(3) // Bambang (null), Citra ('unsent'), Eko (undefined)
        expect(result.map((g) => g.id)).toEqual([2, 3, 5])
      })

      it('returns only sent guests when status filter is "sent"', () => {
        const result = filterGuests(mockGuestList, { status: 'sent' })
        expect(result).toHaveLength(2) // Ahmad, Dewi
        expect(result.map((g) => g.id)).toEqual([1, 4])
      })

      it('filters by category group combined with status', () => {
        const result = filterGuests(mockGuestList, { status: 'unsent', group: 'Keluarga' })
        expect(result).toHaveLength(1)
        expect(result[0].name).toBe('Eko Prasetyo')
      })

      it('filters by search keyword matching name, phone, or group', () => {
        const byName = filterGuests(mockGuestList, { search: 'Citra' })
        expect(byName).toHaveLength(1)
        expect(byName[0].id).toBe(3)

        const byPhone = filterGuests(mockGuestList, { search: '084444' })
        expect(byPhone).toHaveLength(1)
        expect(byPhone[0].id).toBe(4)

        const byGroup = filterGuests(mockGuestList, { search: 'VIP' })
        expect(byGroup).toHaveLength(1)
        expect(byGroup[0].id).toBe(3)
      })
    })

    describe('Statistics Computation', () => {
      it('correctly calculates total, sent, unsent, and completion percentage', () => {
        const stats = computeGuestStats(mockGuestList)
        expect(stats.total).toBe(5)
        expect(stats.sent).toBe(2)
        expect(stats.unsent).toBe(3)
        expect(stats.percentage).toBe(40) // 2 / 5 = 40%
      })

      it('handles empty list without dividing by zero', () => {
        const stats = computeGuestStats([])
        expect(stats.total).toBe(0)
        expect(stats.sent).toBe(0)
        expect(stats.unsent).toBe(0)
        expect(stats.percentage).toBe(0)
      })
    })

    describe('Immediate UI State Update (Optimistic Update)', () => {
      it('mutating statusSend from unsent to "sent" immediately reflects in filtered views and stats', () => {
        // Deep copy fixtures for mutation testing
        const reactiveList = JSON.parse(JSON.stringify(mockGuestList))

        // Initial stats
        let stats = computeGuestStats(reactiveList)
        expect(stats.sent).toBe(2)
        expect(stats.unsent).toBe(3)

        // Find guest Bambang (id: 2) and simulate marking as sent
        const targetGuest = reactiveList.find((g) => g.id === 2)
        expect(targetGuest.statusSend).toBeNull()

        // Apply state mutation
        targetGuest.statusSend = 'sent'

        // Immediate recalculation
        stats = computeGuestStats(reactiveList)
        expect(stats.sent).toBe(3)
        expect(stats.unsent).toBe(2)
        expect(stats.percentage).toBe(60)

        // Filtered views update immediately
        const unsent = filterGuests(reactiveList, { status: 'unsent' })
        expect(unsent.map((g) => g.id)).not.toContain(2)

        const sent = filterGuests(reactiveList, { status: 'sent' })
        expect(sent.map((g) => g.id)).toContain(2)
      })
    })

    describe('Queue Runner Advancement Logic', () => {
      it('advances next and previous correctly with index bounds', () => {
        const queueLength = 3 // e.g. guests 2, 3, 5

        let index = 0
        index = getNextQueueIndex(index, queueLength)
        expect(index).toBe(1)

        index = getNextQueueIndex(index, queueLength)
        expect(index).toBe(2)

        // At end of queue, clamp to max index (length - 1)
        index = getNextQueueIndex(index, queueLength)
        expect(index).toBe(2)

        // Previous
        index = getPrevQueueIndex(index)
        expect(index).toBe(1)

        index = getPrevQueueIndex(index)
        expect(index).toBe(0)

        // At start of queue, clamp to 0
        index = getPrevQueueIndex(index)
        expect(index).toBe(0)
      })

      it('simulates queue runner progression as guests are sent one-by-one', () => {
        const queue = [
          { id: 10, name: 'Guest 1', statusSend: null },
          { id: 20, name: 'Guest 2', statusSend: null },
          { id: 30, name: 'Guest 3', statusSend: null },
        ]

        let queueIndex = 0

        // Step 1: Send Guest 1
        const unsent1 = queue.filter((g) => g.statusSend !== 'sent')
        expect(unsent1[queueIndex].name).toBe('Guest 1')
        unsent1[queueIndex].statusSend = 'sent'

        // Step 2: Unsent queue shrinks, next guest shifts into queueIndex 0
        const unsent2 = queue.filter((g) => g.statusSend !== 'sent')
        expect(unsent2).toHaveLength(2)
        expect(unsent2[queueIndex].name).toBe('Guest 2')
        unsent2[queueIndex].statusSend = 'sent'

        // Step 3: Last guest
        const unsent3 = queue.filter((g) => g.statusSend !== 'sent')
        expect(unsent3).toHaveLength(1)
        expect(unsent3[queueIndex].name).toBe('Guest 3')
        unsent3[queueIndex].statusSend = 'sent'

        // Step 4: All sent
        const unsentFinal = queue.filter((g) => g.statusSend !== 'sent')
        expect(unsentFinal).toHaveLength(0)
      })
    })
  })
})
