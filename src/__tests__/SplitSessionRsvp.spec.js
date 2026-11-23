import { describe, it, expect } from 'vitest'
import { formatGuestMessage } from '@/utils/whatsappDistribution'
import { guestExportColumns, formatGuestExportRow, toCsv } from '@/utils/csvExport'

describe('SAT-67: Split Sesi Undangan & Multi-Event RSVP Test Suite', () => {
  describe('1. WhatsApp Message Formatting with {sesi} & {session} Placeholders', () => {
    const mockInvitation = {
      title: 'Pernikahan Budi & Ani',
      slug: 'budi-ani',
      coupleName: 'Budi & Ani',
      groomName: 'Budi',
      brideName: 'Ani',
    }

    it('replaces {sesi} placeholder with guest.sessionName', () => {
      const guest = {
        name: 'dr. Farhan Akbar',
        sessionName: 'Akad Nikah (08:00 - 10:00 WIB)',
        tableNumber: 'Meja VIP 1',
      }
      const template = 'Yth. [GuestName], Anda diundang pada {sesi}. No Meja: [TableNumber]'
      const result = formatGuestMessage(template, guest, mockInvitation)

      expect(result).toContain('Yth. dr. Farhan Akbar')
      expect(result).toContain('Anda diundang pada Akad Nikah (08:00 - 10:00 WIB)')
      expect(result).toContain('No Meja: Meja VIP 1')
      expect(result).not.toContain('{sesi}')
    })

    it('replaces {session} placeholder with case-insensitive matching', () => {
      const guest = {
        name: 'Siti Aminah',
        sessionName: 'Resepsi Sesi 2',
      }
      const template = 'Halo [GuestName]! Mohon hadir di sesi {SESSION} atau {session} atau {Sesi}.'
      const result = formatGuestMessage(template, guest, mockInvitation)

      expect(result).toBe('Halo Siti Aminah! Mohon hadir di sesi Resepsi Sesi 2 atau Resepsi Sesi 2 atau Resepsi Sesi 2.')
      expect(result).not.toContain('{SESSION}')
      expect(result).not.toContain('{session}')
      expect(result).not.toContain('{Sesi}')
    })

    it('supports bracket format [Sesi] and [Session] as aliases', () => {
      const guest = {
        name: 'Bambang Tri',
        sessionName: 'Akad & Resepsi 1',
      }
      const template = 'Undangan [GuestName] untuk [Sesi] / [Session]'
      const result = formatGuestMessage(template, guest, mockInvitation)

      expect(result).toBe('Undangan Bambang Tri untuk Akad & Resepsi 1 / Akad & Resepsi 1')
    })

    it('falls back to guest.session if guest.sessionName is not present', () => {
      const guest = {
        name: 'Rahmat Hidayat',
        session: 'Resepsi Sesi 1',
      }
      const template = 'Jadwal Anda: {sesi}'
      const result = formatGuestMessage(template, guest, mockInvitation)

      expect(result).toBe('Jadwal Anda: Resepsi Sesi 1')
    })

    it('falls back to empty string when guest has no session or guest is missing', () => {
      const guest = {
        name: 'Tamu Tanpa Sesi',
      }
      const template = 'Sesi: {sesi}'
      const result1 = formatGuestMessage(template, guest, mockInvitation)
      expect(result1).toBe('Sesi: ')

      const result2 = formatGuestMessage(template, null, mockInvitation)
      expect(result2).toBe('Sesi: ')
    })
  })

  describe('2. Guest Session Allocation, Filtering & Export Logic', () => {
    const mockGuestList = [
      { id: 1, name: 'Ahmad Faiz', sessionName: 'Akad Nikah', group: 'Keluarga', statusSend: 'sent' },
      { id: 2, name: 'Bella Chandra', sessionName: 'Resepsi Sesi 1', group: 'Teman', statusSend: 'unsent' },
      { id: 3, name: 'Citra Kirana', sessionName: 'Resepsi Sesi 2', group: 'VIP', statusSend: 'sent' },
      { id: 4, name: 'Dimas Seto', sessionName: 'Resepsi Sesi 1', group: 'Teman', statusSend: 'sent' },
      { id: 5, name: 'Eka Prasetya', sessionName: '', group: 'Umum', statusSend: 'unsent' },
    ]

    function extractUniqueSessions(guests) {
      const set = new Set()
      guests.forEach((g) => {
        const s = g.sessionName || g.session
        if (s && s.trim()) set.add(s.trim())
      })
      return Array.from(set)
    }

    function filterGuestsBySession(guests, sessionFilter) {
      if (!sessionFilter || !sessionFilter.trim()) return guests
      return guests.filter((g) => {
        const s = g.sessionName || g.session || ''
        return s.toLowerCase().trim() === sessionFilter.toLowerCase().trim()
      })
    }

    it('extracts unique sessions dynamically from guest list', () => {
      const sessions = extractUniqueSessions(mockGuestList)
      expect(sessions).toEqual(['Akad Nikah', 'Resepsi Sesi 1', 'Resepsi Sesi 2'])
      expect(sessions).toHaveLength(3)
    })

    it('filters guests correctly by chosen session', () => {
      // 1. All sessions
      const all = filterGuestsBySession(mockGuestList, '')
      expect(all).toHaveLength(5)

      // 2. Akad Nikah only
      const akadOnly = filterGuestsBySession(mockGuestList, 'Akad Nikah')
      expect(akadOnly).toHaveLength(1)
      expect(akadOnly[0].name).toBe('Ahmad Faiz')

      // 3. Resepsi Sesi 1 only
      const sesi1 = filterGuestsBySession(mockGuestList, 'Resepsi Sesi 1')
      expect(sesi1).toHaveLength(2)
      expect(sesi1.map((g) => g.name)).toEqual(['Bella Chandra', 'Dimas Seto'])

      // 4. Case-insensitive session filter
      const sesi2 = filterGuestsBySession(mockGuestList, 'resepsi sesi 2')
      expect(sesi2).toHaveLength(1)
      expect(sesi2[0].name).toBe('Citra Kirana')
    })

    it('exports guest session column in CSV & Excel format', () => {
      const guest = {
        name: 'Zaskia Adya',
        phoneNumber: '081299998888',
        group: 'VIP',
        sessionName: 'Akad & Resepsi 1',
        tableNumber: 'Meja VVIP',
        statusSend: 'sent',
        rsvpStatus: 'hadir',
        souvenirGiven: true,
        physicalGiftNotes: 'Kado Emas Antam',
      }

      const row = formatGuestExportRow(guest, 0)
      expect(row['Nama Tamu']).toBe('Zaskia Adya')
      expect(row['Sesi']).toBe('Akad & Resepsi 1')
      expect(row['No. Meja']).toBe('Meja VVIP')

      const csv = toCsv(guestExportColumns, [guest])
      expect(csv).toContain('Sesi')
      expect(csv).toContain('Akad & Resepsi 1')
    })
  })

  describe('3. Reception Scanner Session Mismatch Detection Logic', () => {
    function checkSessionMismatch(activeSession, guestSession) {
      if (!activeSession || !activeSession.trim()) return false
      const gSess = (guestSession || '').trim().toLowerCase()
      const actSess = activeSession.trim().toLowerCase()
      return gSess !== actSess
    }

    function buildScanResult(activeSession, guest, type = 'new') {
      const guestSession = guest.sessionName || guest.session || ''
      const sessionMismatch = checkSessionMismatch(activeSession, guestSession)
      return {
        type,
        guestId: guest.id,
        guestName: guest.name,
        group: guest.group || 'Umum',
        sessionName: guestSession,
        sessionMismatch,
        warningMessage: sessionMismatch
          ? `⚠️ Peringatan Sesi Berbeda: Tamu ini terdaftar pada ${guestSession || 'Sesi Lain'}`
          : null,
      }
    }

    it('returns mismatch = false when active session is not set (Semua Sesi)', () => {
      const guest = { id: 101, name: 'Budi Handoko', sessionName: 'Resepsi Sesi 1' }
      const result = buildScanResult('', guest)

      expect(result.sessionMismatch).toBe(false)
      expect(result.warningMessage).toBeNull()
      expect(result.sessionName).toBe('Resepsi Sesi 1')
    })

    it('returns mismatch = false when active session exactly matches guest session', () => {
      const guest = { id: 102, name: 'Dewi Sandra', sessionName: 'Akad Nikah' }
      const result = buildScanResult('Akad Nikah', guest)

      expect(result.sessionMismatch).toBe(false)
      expect(result.warningMessage).toBeNull()
      expect(result.sessionName).toBe('Akad Nikah')
    })

    it('returns mismatch = false with case and whitespace insensitivity', () => {
      const guest = { id: 103, name: 'Irfan Hakim', sessionName: '  Resepsi Sesi 2  ' }
      const result = buildScanResult('resepsi sesi 2', guest)

      expect(result.sessionMismatch).toBe(false)
      expect(result.warningMessage).toBeNull()
    })

    it('returns mismatch = true and produces warning banner when session differs', () => {
      const guest = { id: 104, name: 'Raffi Ahmad', sessionName: 'Resepsi Sesi 2' }
      // Active event session in reception scanner is Akad Nikah
      const activeSession = 'Akad Nikah'
      const result = buildScanResult(activeSession, guest)

      expect(result.sessionMismatch).toBe(true)
      expect(result.sessionName).toBe('Resepsi Sesi 2')
      expect(result.warningMessage).toBe('⚠️ Peringatan Sesi Berbeda: Tamu ini terdaftar pada Resepsi Sesi 2')
    })

    it('detects mismatch when guest has no assigned session while active session is enforced', () => {
      const guest = { id: 105, name: 'Nagita Slavina', sessionName: '' }
      const activeSession = 'Resepsi Sesi 1'
      const result = buildScanResult(activeSession, guest)

      expect(result.sessionMismatch).toBe(true)
      expect(result.warningMessage).toBe('⚠️ Peringatan Sesi Berbeda: Tamu ini terdaftar pada Sesi Lain')
    })
  })
})
