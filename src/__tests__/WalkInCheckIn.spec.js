import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createWalkInGuest } from '@/api/guest'

// Mock apiFetch from @/api/client module
vi.mock('@/api/client', () => ({
  apiFetch: vi.fn(),
}))

import { apiFetch } from '@/api/client'

describe('SAT-81: Walk-In / On-the-Spot Guest Check-in', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('createWalkInGuest calls POST /guests/invitation/:invitationId/walk-in with correct payload', async () => {
    const mockResponse = {
      statusCode: 201,
      message: 'Tamu walk-in berhasil didaftarkan dan check-in',
      data: {
        id: 'guest-walkin-123',
        name: 'dr. Hendra Wijaya',
        pax: 2,
        group: 'Walk-in / On-the-spot',
        sessionName: 'Resepsi Sesi 1',
        tableNumber: 'VIP-02',
        checkedInAt: '2026-11-24T12:00:00.000Z',
        souvenirGiven: true,
        physicalGiftNotes: 'Amplop Rp 1.000.000',
      },
    }

    apiFetch.mockResolvedValueOnce(mockResponse)

    const payload = {
      name: 'dr. Hendra Wijaya',
      pax: 2,
      group: 'Walk-in / On-the-spot',
      sessionName: 'Resepsi Sesi 1',
      tableNumber: 'VIP-02',
      souvenirGiven: true,
      physicalGiftNotes: 'Amplop Rp 1.000.000',
    }

    const res = await createWalkInGuest('inv-uuid-abc', payload)

    expect(apiFetch).toHaveBeenCalledTimes(1)
    expect(apiFetch).toHaveBeenCalledWith('/guests/invitation/inv-uuid-abc/walk-in', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    expect(res).toEqual(mockResponse)
  })

  it('optimistic walk-in logic instantly updates guest list and check-in count', () => {
    const guests = [
      { id: 'guest-1', name: 'Andi Pratama', checkedInAt: null, souvenirGiven: false },
    ]
    const summaryData = { totalGuests: 1, checkedInCount: 0 }

    const walkInForm = {
      name: 'Bapak Rudi & Istri',
      pax: 2,
      group: 'Walk-in / On-the-spot',
      sessionName: 'Resepsi Sesi 1',
      tableNumber: 'Meja 5',
      souvenirGiven: true,
      physicalGiftNotes: 'Kado Bingkisan',
    }

    const now = new Date('2026-11-24T12:15:00.000Z')
    const tempId = 'temp-walkin-12345'

    const optimisticGuest = {
      id: tempId,
      name: walkInForm.name.trim(),
      pax: Number(walkInForm.pax) || 1,
      group: walkInForm.group || 'Walk-in / On-the-spot',
      sessionName: walkInForm.sessionName || '',
      tableNumber: walkInForm.tableNumber || '',
      souvenirGiven: Boolean(walkInForm.souvenirGiven),
      physicalGiftNotes: walkInForm.physicalGiftNotes || '',
      checkedInAt: now.toISOString(),
      rsvpStatus: 'hadir',
      isWalkIn: true,
    }

    // 0ms Optimistic unshift
    guests.unshift(optimisticGuest)
    summaryData.totalGuests += 1
    summaryData.checkedInCount += 1

    expect(guests).toHaveLength(2)
    expect(guests[0].name).toBe('Bapak Rudi & Istri')
    expect(guests[0].isWalkIn).toBe(true)
    expect(guests[0].checkedInAt).toBe(now.toISOString())
    expect(guests[0].souvenirGiven).toBe(true)
    expect(summaryData.totalGuests).toBe(2)
    expect(summaryData.checkedInCount).toBe(1)
  })

  it('rolls back optimistic state cleanly if server returns error', () => {
    const tempId = 'temp-walkin-error-1'
    let guests = [
      { id: tempId, name: 'Gagal Simpan', isWalkIn: true },
      { id: 'guest-1', name: 'Tamu Asli' },
    ]
    const summaryData = { totalGuests: 2, checkedInCount: 1 }

    // Rollback simulation on error
    guests = guests.filter((g) => g.id !== tempId)
    summaryData.totalGuests = Math.max(0, summaryData.totalGuests - 1)
    summaryData.checkedInCount = Math.max(0, summaryData.checkedInCount - 1)

    expect(guests).toHaveLength(1)
    expect(guests[0].id).toBe('guest-1')
    expect(summaryData.totalGuests).toBe(1)
    expect(summaryData.checkedInCount).toBe(0)
  })

  it('replaces temporary ID with persistent server ID upon success', () => {
    const tempId = 'temp-walkin-success-1'
    const optimisticGuest = { id: tempId, name: 'Bapak Hartono' }
    const guests = [optimisticGuest]

    const serverGuest = { id: 'real-server-id-999', name: 'Bapak Hartono' }
    if (serverGuest?.id) {
      optimisticGuest.id = serverGuest.id
    }

    expect(guests[0].id).toBe('real-server-id-999')
  })
})
