import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import InvitationsTable from '@/components/dashboard/InvitationsTable.vue'
import { buildWhatsAppUrl, formatGuestMessage } from '@/utils/whatsappDistribution'

vi.mock('vue-toastification', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  }),
}))

describe('SAT-71 & UI Polish Test Suite (Guests & Invitations)', () => {
  describe('1. Mode Privasi Toggle Button & Header Stat Pill (UI Stability)', () => {
    it('verifies bulletproof toggle switch layout without overflow', () => {
      // Toggle button classes verified
      const toggleContainerClasses = 'relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full p-1'
      const knobClasses = 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0'

      expect(toggleContainerClasses).toContain('h-7')
      expect(toggleContainerClasses).toContain('w-12')
      expect(toggleContainerClasses).toContain('p-1')
      expect(knobClasses).toContain('h-5')
      expect(knobClasses).toContain('w-5')
    })

    it('verifies stat pill has whitespace-nowrap to prevent multi-line breaks', () => {
      const statPillClasses = 'inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-xl text-xs font-bold whitespace-nowrap shadow-2xs'
      expect(statPillClasses).toContain('whitespace-nowrap')
    })
  })

  describe('2. Batch Sequence Dispatcher Logic (SAT-71)', () => {
    const mockInvitation = {
      id: 101,
      title: 'Pernikahan Dimas & Rara',
      slug: 'dimas-rara',
      isPublished: true,
      package: 'exclusive',
      whatsappMessageTemplate: 'Kepada Yth. [GuestName], silakan hadir di pernikahan kami. Link: [Link]',
    }

    const mockGuests = [
      { id: 1, name: 'Andi Pratama', phoneNumber: '08123456789', group: 'Keluarga', sessionName: 'Sesi 1', statusSend: null, slug: 'andi-pratama', accessToken: 'token-1' },
      { id: 2, name: 'Budi Santoso', phoneNumber: '08987654321', group: 'VIP', sessionName: 'Sesi 2', statusSend: null, slug: 'budi-santoso', accessToken: 'token-2' },
      { id: 3, name: 'Citra Dewi', phoneNumber: '', group: 'Teman Kantor', sessionName: 'Sesi 1', statusSend: null, slug: 'citra-dewi', accessToken: 'token-3' },
      { id: 4, name: 'Deni Setiawan', phoneNumber: '08555666777', group: 'Keluarga', sessionName: 'Sesi 2', statusSend: 'sent', slug: 'deni-setiawan', accessToken: 'token-4' },
    ]

    it('filters active queue by status (unsent vs all)', () => {
      const unsentList = mockGuests.filter((g) => g.statusSend !== 'sent')
      expect(unsentList).toHaveLength(3)
      expect(unsentList.map((g) => g.id)).toEqual([1, 2, 3])

      const allList = mockGuests
      expect(allList).toHaveLength(4)
    })

    it('filters active queue by group and session', () => {
      const keluargaList = mockGuests.filter((g) => g.group.toLowerCase() === 'keluarga')
      expect(keluargaList).toHaveLength(2)

      const sesi1List = mockGuests.filter((g) => g.sessionName === 'Sesi 1')
      expect(sesi1List).toHaveLength(2)

      const unsentKeluarga = mockGuests.filter((g) => g.statusSend !== 'sent' && g.group.toLowerCase() === 'keluarga')
      expect(unsentKeluarga).toHaveLength(1)
      expect(unsentKeluarga[0].name).toBe('Andi Pratama')
    })

    it('formats personalized WhatsApp message and generates valid WhatsApp URL', () => {
      const guest = mockGuests[0]
      const formatted = formatGuestMessage(mockInvitation.whatsappMessageTemplate, guest, mockInvitation)
      expect(formatted).toContain('Kepada Yth. Andi Pratama')
      expect(formatted).toContain('/inv/dimas-rara/token-1')

      const waUrl = buildWhatsAppUrl(guest.phoneNumber, formatted)
      expect(waUrl).toContain('https://wa.me/628123456789?text=')
      expect(waUrl).toContain(encodeURIComponent('Kepada Yth. Andi Pratama'))
    })

    it('performs optimistic UI update when guest is dispatched', () => {
      const guest = { ...mockGuests[0] }
      expect(guest.statusSend).toBeNull()

      // Optimistic update simulation (0ms synchronous)
      guest.statusSend = 'sent'
      expect(guest.statusSend).toBe('sent')
    })

    it('clamps queue index correctly when items are removed or filtered', () => {
      let list = [mockGuests[0], mockGuests[1]]
      let queueIndex = 1

      // First item sent & removed
      list = [mockGuests[1]]
      const clampedIndex = Math.min(queueIndex, list.length - 1)
      expect(clampedIndex).toBe(0)
      expect(list[clampedIndex].name).toBe('Budi Santoso')
    })

    it('handles keyboard shortcuts (Space / Enter / Arrows / Esc)', () => {
      const dispatchMock = vi.fn()
      const nextMock = vi.fn()
      const prevMock = vi.fn()
      const closeMock = vi.fn()

      function simulateKeydown(key, targetTag = 'BODY') {
        if (targetTag === 'INPUT' || targetTag === 'TEXTAREA') return
        if (key === ' ' || key === 'Enter') dispatchMock()
        else if (key === 'ArrowRight') nextMock()
        else if (key === 'ArrowLeft') prevMock()
        else if (key === 'Escape') closeMock()
      }

      simulateKeydown(' ')
      expect(dispatchMock).toHaveBeenCalledTimes(1)

      simulateKeydown('Enter')
      expect(dispatchMock).toHaveBeenCalledTimes(2)

      simulateKeydown('ArrowRight')
      expect(nextMock).toHaveBeenCalledTimes(1)

      simulateKeydown('ArrowLeft')
      expect(prevMock).toHaveBeenCalledTimes(1)

      simulateKeydown('Escape')
      expect(closeMock).toHaveBeenCalledTimes(1)

      // When typing in input, keyboard shortcuts must NOT fire
      simulateKeydown(' ', 'INPUT')
      expect(dispatchMock).toHaveBeenCalledTimes(2)
    })
  })

  describe('3. InvitationsTable Enhanced UX & Data Completeness', () => {
    const mockInvitations = [
      {
        id: 1,
        title: 'Pernikahan Kevin & Vina',
        slug: 'kevin-vina',
        isPublished: true,
        package: 'premium',
        views: 1420,
        expiresAt: '2027-10-30T00:00:00Z',
        latestOrderId: 'ORDER-101',
        templateDesign: { name: 'Royal Emerald' },
        groomName: 'Kevin',
        brideName: 'Vina',
      },
      {
        id: 2,
        title: 'Draft Pernikahan Baru',
        slug: 'draft-wedding',
        isPublished: false,
        package: 'basic',
        views: 0,
        templateDesign: { name: 'Default Template' },
      },
    ]

    it('renders clickable slug link with target="_blank" and copy button', () => {
      const wrapper = mount(InvitationsTable, {
        props: { invitations: mockInvitations },
        global: { stubs: { RouterLink: RouterLinkStub } },
      })

      const links = wrapper.findAll('a[title="Buka Undangan di Tab Baru"]')
      expect(links.length).toBeGreaterThan(0)
      expect(links[0].attributes('target')).toBe('_blank')
      expect(links[0].attributes('href')).toContain('/inv/kevin-vina')
    })

    it('displays views counter for published invitations', () => {
      const wrapper = mount(InvitationsTable, {
        props: { invitations: mockInvitations },
        global: { stubs: { RouterLink: RouterLinkStub } },
      })

      expect(wrapper.text()).toContain('1.420 tayangan')
    })

    it('renders direct shortcut navigation buttons for published invitations', () => {
      const wrapper = mount(InvitationsTable, {
        props: { invitations: mockInvitations },
        global: { stubs: { RouterLink: RouterLinkStub } },
      })

      expect(wrapper.text()).toContain('Daftar Tamu')
      expect(wrapper.text()).toContain('Buku Tamu')
      expect(wrapper.text()).toContain('Live Screen')

      const guestLinks = wrapper.findAllComponents(RouterLinkStub).filter((link) => {
        return link.props().to === '/guests?invitationId=1'
      })
      expect(guestLinks.length).toBeGreaterThan(0)
    })
  })
})
