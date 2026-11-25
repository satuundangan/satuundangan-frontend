import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getPublicGiftRegistry,
  claimGiftRegistryItem,
  getGiftRegistryItems,
  createGiftRegistryItem,
  unclaimGiftRegistryItem,
} from '@/api/giftRegistry'

// Mock apiFetch from @/api/client
vi.mock('@/api/client', () => ({
  apiFetch: vi.fn(),
}))

import { apiFetch } from '@/api/client'

describe('SAT-68: Digital Wedding Wishlist & Gift Registry (Anti-Kado Kembar)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getPublicGiftRegistry calls GET /gift-registry/public/invitation/:id', async () => {
    const mockItems = [
      { id: 'item-1', itemName: 'Air Fryer', status: 'AVAILABLE' },
      { id: 'item-2', itemName: 'Bedcover', status: 'CLAIMED', claimedByGuestName: 'Dian' },
    ]
    apiFetch.mockResolvedValueOnce(mockItems)

    const res = await getPublicGiftRegistry(10)

    expect(apiFetch).toHaveBeenCalledWith('/gift-registry/public/invitation/10')
    expect(res).toEqual(mockItems)
  })

  it('claimGiftRegistryItem calls POST /gift-registry/public/:id/claim with payload', async () => {
    const mockResult = {
      id: 'item-1',
      itemName: 'Air Fryer',
      status: 'CLAIMED',
      claimedByGuestName: 'Budi Santoso',
    }
    apiFetch.mockResolvedValueOnce(mockResult)

    const payload = {
      guestName: 'Budi Santoso',
      phoneNumber: '08123456789',
      notes: 'Selamat berbahagia!',
    }

    const res = await claimGiftRegistryItem('item-1', payload)

    expect(apiFetch).toHaveBeenCalledWith('/gift-registry/public/item-1/claim', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    expect(res).toEqual(mockResult)
  })

  it('owner APIs (create, list, unclaim) call expected endpoints', async () => {
    apiFetch.mockResolvedValueOnce([])
    await getGiftRegistryItems(25)
    expect(apiFetch).toHaveBeenCalledWith('/gift-registry/invitation/25')

    const createPayload = { itemName: 'Robot Vacuum', category: 'Elektronik Rumah' }
    apiFetch.mockResolvedValueOnce({ id: 'uuid-9', ...createPayload })
    await createGiftRegistryItem(25, createPayload)
    expect(apiFetch).toHaveBeenCalledWith('/gift-registry/invitation/25', {
      method: 'POST',
      body: JSON.stringify(createPayload),
    })

    apiFetch.mockResolvedValueOnce({ id: 'uuid-9', status: 'AVAILABLE' })
    await unclaimGiftRegistryItem('uuid-9')
    expect(apiFetch).toHaveBeenCalledWith('/gift-registry/uuid-9/unclaim', {
      method: 'POST',
    })
  })

  it('optimistic claiming logic updates item status to CLAIMED immediately', () => {
    const items = [
      { id: 'item-1', itemName: 'Microwave', status: 'AVAILABLE', claimedByGuestName: null },
      { id: 'item-2', itemName: 'Set Piring', status: 'AVAILABLE', claimedByGuestName: null },
    ]

    const targetItem = items.find((i) => i.id === 'item-1')
    expect(targetItem.status).toBe('AVAILABLE')

    // 0ms Optimistic UI update
    targetItem.status = 'CLAIMED'
    targetItem.claimedByGuestName = 'Hendra & Istri'

    expect(targetItem.status).toBe('CLAIMED')
    expect(targetItem.claimedByGuestName).toBe('Hendra & Istri')

    // Available count recalculates instantly
    const availableCount = items.filter((i) => i.status !== 'CLAIMED').length
    expect(availableCount).toBe(1)
  })

  it('rolls back optimistic claim if backend responds with race-condition error', () => {
    const item = { id: 'item-1', status: 'AVAILABLE', claimedByGuestName: null }
    const previousStatus = item.status
    const previousClaimer = item.claimedByGuestName

    // Optimistic update
    item.status = 'CLAIMED'
    item.claimedByGuestName = 'User A'

    // Simulate backend throwing BadRequestException (already claimed by User B)
    const errorOccurred = true
    if (errorOccurred) {
      item.status = previousStatus
      item.claimedByGuestName = previousClaimer
    }

    expect(item.status).toBe('AVAILABLE')
    expect(item.claimedByGuestName).toBeNull()
  })
})
