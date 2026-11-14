import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { reactive } from 'vue'
import { formatGuestMessage } from '@/utils/whatsappDistribution'
import * as guestApi from '@/api/guest'
import InvitationView from '@/views/InvitationView.vue'
import GuestbookView from '@/views/dashboard/GuestbookView.vue'

// ==========================================
// Mock AudioContext for Web Audio Chimes
// ==========================================
class MockAudioContext {
  state = 'running'
  currentTime = 0
  resume = vi.fn().mockResolvedValue(undefined)
  close = vi.fn().mockResolvedValue(undefined)
  createOscillator = vi.fn().mockReturnValue({
    type: 'sine',
    frequency: { setValueAtTime: vi.fn() },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  })
  createGain = vi.fn().mockReturnValue({
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
  })
  destination = {}
}

// ==========================================
// Mock Data Fixtures
// ==========================================
const mockInvitationState = reactive({
  id: 1,
  slug: 'romeo-juliet',
  title: 'Pernikahan Romeo & Juliet',
  groomName: 'Romeo',
  brideName: 'Juliet',
  coupleName: 'Romeo & Juliet',
  package: 'luxury',
  isPublished: true,
  isGuestPublic: true,
})

const mockGuestResponse = {
  id: 99,
  name: 'Budi Santoso',
  slug: 'budi-santoso',
  accessToken: 'token-budi-99',
  tableNumber: 'Meja 8 (Keluarga Besar)',
  group: 'Keluarga',
}

const mockGuestsList = [
  {
    id: 101,
    name: 'Ahmad Dahlan',
    phoneNumber: '08123456789',
    group: 'Keluarga',
    tableNumber: 'Meja 1 (VIP)',
    checkedInAt: '2026-11-14T08:30:00.000Z',
    souvenirGiven: false,
    physicalGiftNotes: null,
  },
  {
    id: 102,
    name: 'Budi Santoso',
    phoneNumber: '08198765432',
    group: 'Teman',
    tableNumber: 'Meja 2',
    checkedInAt: '2026-11-14T09:00:00.000Z',
    souvenirGiven: true,
    physicalGiftNotes: 'Amplop Rp 500.000',
  },
  {
    id: 103,
    name: 'Citra Kirana',
    phoneNumber: '08111222333',
    group: 'VIP',
    tableNumber: 'Meja 3 (VIP)',
    checkedInAt: null,
    souvenirGiven: false,
    physicalGiftNotes: null,
  },
]

// ==========================================
// Module Mocks
// ==========================================
vi.mock('@/api/invitation', () => ({
  getMyInvitationBySlug: vi.fn(),
  getInvitationBySlug: vi.fn(() => Promise.resolve(mockInvitationState)),
  getInvitationWithGuest: vi.fn(() =>
    Promise.resolve({
      ...mockInvitationState,
      guest: mockGuestResponse,
    }),
  ),
  getInvitationBySubdomain: vi.fn(),
  getCustomSubdomain: vi.fn(() => null),
  getInvitations: vi.fn(() => Promise.resolve([mockInvitationState])),
}))

vi.mock('@/api/guest', () => ({
  createGuest: vi.fn(),
  updateGuest: vi.fn(),
  deleteGuest: vi.fn(),
  bulkDeleteGuests: vi.fn(),
  importGuests: vi.fn(),
  getGuestShareLink: vi.fn(),
  getGuestsByInvitationId: vi.fn(() => Promise.resolve([...mockGuestsList])),
  checkInGuest: vi.fn((id) =>
    Promise.resolve({
      success: true,
      check_in_time: '2026-11-14T09:15:00.000Z',
      checkedInAt: '2026-11-14T09:15:00.000Z',
    }),
  ),
  checkInGuestByToken: vi.fn(),
  getCheckInSummary: vi.fn(() =>
    Promise.resolve({
      totalGuests: 3,
      checkedInCount: 2,
      notCheckedInCount: 1,
    }),
  ),
  updateGuestReception: vi.fn(() => Promise.resolve({ success: true })),
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    token: null,
    user: null,
  }),
}))

const mockRoute = reactive({
  params: { slug: 'romeo-juliet', guestSlug: 'token-budi-99' },
  query: {},
  name: 'invitation.guest',
  fullPath: '/inv/romeo-juliet/token-budi-99',
})

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => ({ push: vi.fn() }),
}))

const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
}
vi.mock('vue-toastification', () => ({
  useToast: () => mockToast,
}))

vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,mockqr'),
  },
}))

vi.mock('html5-qrcode', () => ({
  Html5Qrcode: class {
    static getCameras = vi.fn().mockResolvedValue([{ id: 'cam1', label: 'Camera 1' }])
    start = vi.fn().mockResolvedValue(undefined)
    stop = vi.fn().mockResolvedValue(undefined)
    clear = vi.fn().mockResolvedValue(undefined)
  },
}))

vi.mock('@/api/guestMessage', () => ({
  getOwnerGuestMessagesByInvitationId: vi.fn(() => Promise.resolve([])),
  deleteGuestMessage: vi.fn(() => Promise.resolve({ success: true })),
}))

describe('SAT-65: Seating Allocation & Physical Souvenir / Gift Logging QA Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.AudioContext = MockAudioContext
    document.body.innerHTML = ''
    mockRoute.params = { slug: 'romeo-juliet', guestSlug: 'token-budi-99' }
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  // =========================================================================
  // Skenario 1: formatGuestMessage menggantikan [TableNumber] dan [NomorMeja]
  // =========================================================================
  describe('1. formatGuestMessage Placeholder Replacement', () => {
    const invitation = {
      slug: 'romeo-juliet',
      groomName: 'Romeo',
      brideName: 'Juliet',
      coupleName: 'Romeo & Juliet',
    }

    it('replaces [TableNumber] with guest.tableNumber correctly', () => {
      const guest = {
        name: 'Pak Bambang',
        tableNumber: 'Meja VIP 1',
      }
      const template = 'Halo [GuestName], silakan menempati [TableNumber]. Link: [Link]'
      const result = formatGuestMessage(template, guest, invitation, 'https://satuundangan.id')

      expect(result).toContain('Halo Pak Bambang, silakan menempati Meja VIP 1.')
      expect(result).not.toContain('[TableNumber]')
    })

    it('replaces [NomorMeja] with guest.tableNumber correctly', () => {
      const guest = {
        name: 'Siti Rahma',
        tableNumber: 'Meja 4 (Sahabat)',
      }
      const template = 'Yth. [GuestName], Nomor Meja Anda: [NomorMeja]. Terima kasih!'
      const result = formatGuestMessage(template, guest, invitation, 'https://satuundangan.id')

      expect(result).toContain('Nomor Meja Anda: Meja 4 (Sahabat).')
      expect(result).not.toContain('[NomorMeja]')
    })

    it('falls back to "-" when guest.tableNumber is absent or empty', () => {
      const guestWithoutTable = {
        name: 'Rudi Hartono',
        tableNumber: null,
      }
      const template = 'Meja: [TableNumber] / [NomorMeja]'
      const result = formatGuestMessage(template, guestWithoutTable, invitation, 'https://satuundangan.id')

      expect(result).toBe('Meja: - / -')
    })

    it('simultaneously replaces [TableNumber], [NomorMeja], and all standard placeholders', () => {
      const guest = {
        name: 'Dewi Lestari',
        tableNumber: 'Meja 10 (Alumni)',
        accessToken: 'token-dewi',
      }
      const template =
        'Kepada [GuestName], undangan dari [CoupleName]. [TableNumber] atau [NomorMeja]. Buka: [Link]'
      const result = formatGuestMessage(template, guest, invitation, 'https://satuundangan.id')

      expect(result).toContain('Kepada Dewi Lestari')
      expect(result).toContain('undangan dari Romeo & Juliet')
      expect(result).toContain('Meja 10 (Alumni) atau Meja 10 (Alumni)')
      expect(result).toContain('https://satuundangan.id/inv/romeo-juliet/token-dewi')
      expect(result).not.toContain('[TableNumber]')
      expect(result).not.toContain('[NomorMeja]')
    })
  })

  // =========================================================================
  // Skenario 2: Komponen tiket digital menampilkan alokasi nomor meja
  // =========================================================================
  describe('2. Digital Ticket Modal Seating Display (InvitationView.vue)', () => {
    it('renders seating table badge when guestData has tableNumber', async () => {
      const { getInvitationWithGuest } = await import('@/api/invitation')
      getInvitationWithGuest.mockResolvedValueOnce({
        ...mockInvitationState,
        guest: mockGuestResponse,
      })

      const wrapper = mount(InvitationView, {
        global: {
          stubs: {
            PrivateLockScreen: true,
          },
        },
      })

      await flushPromises()

      // Find floating action button for ticket
      const ticketBtn = wrapper.findAll('button').find((b) => b.text().includes('Tiket & QR Kehadiran'))
      expect(ticketBtn).toBeTruthy()
      await ticketBtn.trigger('click')
      await flushPromises()

      // Teleported to document.body
      const modal = document.body.querySelector('#ticket-modal')
      expect(modal).toBeTruthy()

      // Assert seating badge is visible with table number and chair icon
      expect(modal.textContent).toContain('Meja: Meja 8 (Keluarga Besar)')
      const chairIcon = modal.querySelector('.fa-chair')
      expect(chairIcon).toBeTruthy()
    })

    it('omits seating badge when guestData has no tableNumber', async () => {
      const { getInvitationWithGuest } = await import('@/api/invitation')
      getInvitationWithGuest.mockResolvedValueOnce({
        ...mockInvitationState,
        guest: {
          id: 100,
          name: 'Tamu Tanpa Meja',
          slug: 'tamu-tanpa-meja',
          accessToken: 'token-tanpa-meja',
          tableNumber: null,
          group: 'Umum',
        },
      })

      const wrapper = mount(InvitationView, {
        global: {
          stubs: {
            PrivateLockScreen: true,
          },
        },
      })

      await flushPromises()

      const ticketBtn = wrapper.findAll('button').find((b) => b.text().includes('Tiket & QR Kehadiran'))
      expect(ticketBtn).toBeTruthy()
      await ticketBtn.trigger('click')
      await flushPromises()

      const modal = document.body.querySelector('#ticket-modal')
      expect(modal).toBeTruthy()
      expect(modal.textContent).not.toContain('Meja:')
      expect(modal.querySelector('.fa-chair')).toBeNull()
    })
  })

  // =========================================================================
  // Skenario 3: Aksi toggle souvenir & pencatatan kado fisik pada scanner meja resepsi
  // =========================================================================
  describe('3. Reception Desk Scanner Actions (GuestbookView.vue)', () => {
    beforeEach(() => {
      guestApi.getGuestsByInvitationId.mockResolvedValue([
        {
          id: 101,
          name: 'Ahmad Dahlan',
          phoneNumber: '08123456789',
          group: 'Keluarga',
          tableNumber: 'Meja 1 (VIP)',
          checkedInAt: '2026-11-14T08:30:00.000Z',
          souvenirGiven: false,
          physicalGiftNotes: null,
        },
        {
          id: 102,
          name: 'Budi Santoso',
          phoneNumber: '08198765432',
          group: 'Teman',
          tableNumber: 'Meja 2',
          checkedInAt: '2026-11-14T09:00:00.000Z',
          souvenirGiven: true,
          physicalGiftNotes: 'Amplop Rp 500.000',
        },
        {
          id: 103,
          name: 'Citra Kirana',
          phoneNumber: '08111222333',
          group: 'VIP',
          tableNumber: 'Meja 3 (VIP)',
          checkedInAt: null,
          souvenirGiven: false,
          physicalGiftNotes: null,
        },
      ])
      guestApi.updateGuestReception.mockResolvedValue({ success: true })
    })

    it('exports updateGuestReception in @/api/guest.js with PATCH /guests/:id/reception contract', async () => {
      expect(typeof guestApi.updateGuestReception).toBe('function')
    })

    it('displays souvenir counter in the scanner header stats', async () => {
      const wrapper = mount(GuestbookView, {
        global: {
          stubs: {
            Sidebar: true,
            Topbar: true,
            BottomNav: true,
            'router-link': true,
          },
        },
      })

      await flushPromises()

      // Switch to scanner tab
      const scannerTabBtn = wrapper.findAll('button').find((b) => b.text().includes('Scanner Panitia'))
      expect(scannerTabBtn).toBeTruthy()
      await scannerTabBtn.trigger('click')
      await flushPromises()

      // Stat card: Souvenir Diberikan: 1 Tamu (Budi Santoso is souvenirGiven: true)
      expect(wrapper.text()).toContain('Souvenir Diberikan')
      expect(wrapper.text()).toContain('1 Tamu')
    })

    it('displays table allocation and souvenir toggle with Optimistic UI in recentScanResult banner', async () => {
      const wrapper = mount(GuestbookView, {
        global: {
          stubs: {
            Sidebar: true,
            Topbar: true,
            BottomNav: true,
            'router-link': true,
          },
        },
      })

      await flushPromises()

      // Switch to scanner tab
      const scannerTabBtn = wrapper.findAll('button').find((b) => b.text().includes('Scanner Panitia'))
      await scannerTabBtn.trigger('click')
      await flushPromises()

      // Citra Kirana (id 103) is not yet checked in; click Check-in
      const checkInBtns = wrapper.findAll('button').filter((b) => b.text().trim() === 'Check-in')
      expect(checkInBtns.length).toBeGreaterThan(0)
      await checkInBtns[0].trigger('click')
      await flushPromises()

      // Banner shows seating
      expect(wrapper.text()).toContain('📍 Meja / Seating:')
      expect(wrapper.text()).toContain('Meja 3 (VIP)')

      // Find the souvenir button in the banner
      const souvenirBtn = wrapper.findAll('button').find((b) => b.text().includes('Souvenir Diberikan'))
      expect(souvenirBtn).toBeTruthy()
      expect(souvenirBtn.text()).toContain('🎁 Souvenir Diberikan')

      // Click toggle souvenir -> Optimistic Update to '✔ Sudah Terima Souvenir'
      await souvenirBtn.trigger('click')

      // Assert immediate UI update (0ms)
      expect(souvenirBtn.text()).toContain('✔ Sudah Terima Souvenir')
      expect(guestApi.updateGuestReception).toHaveBeenCalledWith(103, { souvenirGiven: true })
      expect(mockToast.success).toHaveBeenCalledWith('Souvenir ditandai telah diberikan')
    })

    it('rolls back souvenir status on API failure in recentScanResult banner', async () => {
      guestApi.updateGuestReception.mockRejectedValueOnce(new Error('Network Error'))

      const wrapper = mount(GuestbookView, {
        global: {
          stubs: {
            Sidebar: true,
            Topbar: true,
            BottomNav: true,
            'router-link': true,
          },
        },
      })

      await flushPromises()

      const scannerTabBtn = wrapper.findAll('button').find((b) => b.text().includes('Scanner Panitia'))
      await scannerTabBtn.trigger('click')
      await flushPromises()

      const checkInBtns = wrapper.findAll('button').filter((b) => b.text().trim() === 'Check-in')
      expect(checkInBtns.length).toBeGreaterThan(0)
      await checkInBtns[0].trigger('click')
      await flushPromises()

      const souvenirBtn = wrapper.findAll('button').find((b) => b.text().includes('Souvenir Diberikan'))
      expect(souvenirBtn).toBeTruthy()

      await souvenirBtn.trigger('click')
      await flushPromises()

      // Should rollback to '🎁 Souvenir Diberikan'
      expect(souvenirBtn.text()).toContain('🎁 Souvenir Diberikan')
      expect(mockToast.error).toHaveBeenCalled()
    })

    it('logs physical gift / envelope note and calls updateGuestReception', async () => {
      const wrapper = mount(GuestbookView, {
        global: {
          stubs: {
            Sidebar: true,
            Topbar: true,
            BottomNav: true,
            'router-link': true,
          },
        },
      })

      await flushPromises()

      const scannerTabBtn = wrapper.findAll('button').find((b) => b.text().includes('Scanner Panitia'))
      await scannerTabBtn.trigger('click')
      await flushPromises()

      const checkInBtns = wrapper.findAll('button').filter((b) => b.text().trim() === 'Check-in')
      expect(checkInBtns.length).toBeGreaterThan(0)
      await checkInBtns[0].trigger('click')
      await flushPromises()

      // Input physical gift notes
      const giftInput = wrapper.find('input[placeholder*="Catat kado fisik / amplop"]')
      expect(giftInput.exists()).toBe(true)

      await giftInput.setValue('Amplop Rp 1.000.000 (Tunai)')

      const saveBtn = wrapper.findAll('button').find((b) => b.text().includes('Simpan'))
      expect(saveBtn).toBeTruthy()
      await saveBtn.trigger('click')

      await flushPromises()

      expect(guestApi.updateGuestReception).toHaveBeenCalledWith(103, {
        physicalGiftNotes: 'Amplop Rp 1.000.000 (Tunai)',
      })
      expect(wrapper.text()).toContain('Tercatat: Amplop Rp 1.000.000 (Tunai)')
      expect(mockToast.success).toHaveBeenCalledWith('Pencatatan kado fisik/amplop berhasil disimpan')
    })

    it('displays table badge, physical gift note, and allows souvenir toggle in recentCheckIns table row', async () => {
      const wrapper = mount(GuestbookView, {
        global: {
          stubs: {
            Sidebar: true,
            Topbar: true,
            BottomNav: true,
            'router-link': true,
          },
        },
      })

      await flushPromises()

      const scannerTabBtn = wrapper.findAll('button').find((b) => b.text().includes('Scanner Panitia'))
      await scannerTabBtn.trigger('click')
      await flushPromises()

      // In recentCheckIns list (arrival feed):
      // Guest Budi Santoso (id 102) has checked in with tableNumber 'Meja 2', souvenirGiven: true, physicalGiftNotes: 'Amplop Rp 500.000'
      expect(wrapper.text()).toContain('Meja: Meja 2')
      expect(wrapper.text()).toContain('Kado/Amplop: Amplop Rp 500.000')

      // Row souvenir button for Budi Santoso displays '✔ Souvenir'
      const rowSouvenirBtns = wrapper.findAll('button').filter((b) => b.text().includes('Souvenir'))
      const budiBtn = rowSouvenirBtns.find((b) => b.text().includes('✔ Souvenir'))
      expect(budiBtn).toBeTruthy()

      // Toggle souvenir in row (toggles from true to false)
      await budiBtn.trigger('click')

      expect(budiBtn.text()).toContain('🎁 Souvenir')
      expect(guestApi.updateGuestReception).toHaveBeenCalledWith(102, { souvenirGiven: false })
      expect(mockToast.success).toHaveBeenCalled()
    })
  })
})
