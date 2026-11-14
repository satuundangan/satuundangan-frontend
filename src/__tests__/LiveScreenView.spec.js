import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import LiveScreenView from '@/views/LiveScreenView.vue'
import * as invitationApi from '@/api/invitation'
import QRCode from 'qrcode'

vi.mock('@/api/invitation', () => ({
  getLiveScreenFeed: vi.fn(),
}))

vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,mockqrcode'),
  },
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { slug: 'romeo-juliet' },
  }),
}))

describe('LiveScreenView.vue (SAT-64)', () => {
  const mockFeedData = {
    invitation: {
      coupleName: 'Romeo & Juliet',
      groomName: 'Romeo',
      brideName: 'Juliet',
      eventDate: '2026-12-12',
      venueName: 'Grand Ballroom Hotel Mulia, Jakarta',
      galleryImages: [
        'https://example.com/slide1.jpg',
        'https://example.com/slide2.jpg',
      ],
    },
    recentCheckIns: [],
    wishes: [
      {
        id: 'wish-1',
        senderName: 'Andi Pratama',
        message: 'Selamat menempuh hidup baru, samawa selalu!',
        attendance: 'ATTENDING',
      },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    invitationApi.getLiveScreenFeed.mockResolvedValue(mockFeedData)

    // Mock document.documentElement.requestFullscreen
    document.documentElement.requestFullscreen = vi.fn().mockResolvedValue(undefined)
    document.exitFullscreen = vi.fn().mockResolvedValue(undefined)

    // Mock Web Audio API using class constructor
    class MockAudioContext {
      constructor() {
        this.state = 'running'
        this.currentTime = 0
      }
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
    window.AudioContext = MockAudioContext
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('1. Render awal dengan data pengantin & slideshow ambient', async () => {
    const wrapper = mount(LiveScreenView, {
      props: { slug: 'romeo-juliet' },
    })

    await flushPromises()

    // Assert couple name
    const coupleNames = wrapper.find('[data-testid="couple-names"]')
    expect(coupleNames.exists()).toBe(true)
    expect(coupleNames.text()).toContain('Romeo & Juliet')

    // Assert venue display
    const venueInfo = wrapper.find('[data-testid="venue-info"]')
    expect(venueInfo.exists()).toBe(true)
    expect(venueInfo.text()).toContain('Grand Ballroom Hotel Mulia')

    // Assert ambient slideshow container
    const slideshow = wrapper.find('[data-testid="ambient-slideshow"]')
    expect(slideshow.exists()).toBe(true)

    // Assert operator toolbar exists
    const toolbar = wrapper.find('[data-testid="operator-toolbar"]')
    expect(toolbar.exists()).toBe(true)

    // Assert sync status
    const syncStatus = wrapper.find('[data-testid="sync-status"]')
    expect(syncStatus.text()).toContain('Live Sync Terhubung')

    wrapper.unmount()
  })

  it('2. Antrean sambutan muncul ketika data recentCheckIns baru diterima', async () => {
    const wrapper = mount(LiveScreenView, {
      props: { slug: 'romeo-juliet' },
    })

    await flushPromises()

    // Initially no greeting popup
    expect(wrapper.find('[data-testid="greeting-modal"]').exists()).toBe(false)

    // Mock new check-in feed arriving on subsequent poll
    const newGuest = {
      id: 'guest-101',
      name: 'Bapak Hendra Kusuma & Keluarga',
      degree: 'S.Kom., M.T.',
      group: 'VIP Utama',
      pax: 2,
      checkedInAt: '2026-11-14T10:15:00.000Z',
      customGreeting: 'Selamat berbahagia untuk kedua mempelai.',
    }

    invitationApi.getLiveScreenFeed.mockResolvedValueOnce({
      ...mockFeedData,
      recentCheckIns: [newGuest],
    })

    // Advance 3.5s poll timer
    await vi.advanceTimersByTimeAsync(3500)
    await flushPromises()

    // Pop-up sambutan should appear
    const greetingModal = wrapper.find('[data-testid="greeting-modal"]')
    expect(greetingModal.exists()).toBe(true)

    // Check guest info inside modal
    expect(wrapper.find('[data-testid="greeting-guest-name"]').text()).toBe('Bapak Hendra Kusuma & Keluarga')
    expect(wrapper.find('[data-testid="greeting-guest-degree"]').text()).toBe('S.Kom., M.T.')
    expect(wrapper.find('[data-testid="greeting-guest-group"]').text()).toContain('VIP Utama')

    // Advance 7 seconds (duration of greeting) -> auto dismiss back to ambient
    await vi.advanceTimersByTimeAsync(7000)
    await flushPromises()

    expect(wrapper.find('[data-testid="greeting-modal"]').exists()).toBe(false)

    wrapper.unmount()
  })

  it('3. Ticker ucapan & doa restu ter-render dengan pesan tamu', async () => {
    const wrapper = mount(LiveScreenView, {
      props: { slug: 'romeo-juliet' },
    })

    await flushPromises()

    const ticker = wrapper.find('[data-testid="wishes-ticker"]')
    expect(ticker.exists()).toBe(true)
    expect(ticker.text()).toContain('Doa & Ucapan Tamu')

    const wishMessage = wrapper.find('[data-testid="wish-message"]')
    expect(wishMessage.exists()).toBe(true)
    expect(wishMessage.text()).toContain('Andi Pratama')
    expect(wishMessage.text()).toContain('Selamat menempuh hidup baru')

    wrapper.unmount()
  })

  it('4. Toggle fullscreen dan audio kontrol berfungsi', async () => {
    const wrapper = mount(LiveScreenView, {
      props: { slug: 'romeo-juliet' },
    })

    await flushPromises()

    // Audio Chime Toggle: Initial state is ON
    const btnAudio = wrapper.find('[data-testid="btn-toggle-audio"]')
    expect(btnAudio.exists()).toBe(true)
    expect(btnAudio.text()).toContain('Suara: ON')

    // Click to toggle OFF
    await btnAudio.trigger('click')
    expect(btnAudio.text()).toContain('Suara: OFF')

    // Click to toggle back ON
    await btnAudio.trigger('click')
    expect(btnAudio.text()).toContain('Suara: ON')

    // Fullscreen Toggle
    const btnFullscreen = wrapper.find('[data-testid="btn-toggle-fullscreen"]')
    expect(btnFullscreen.exists()).toBe(true)
    expect(btnFullscreen.text()).toContain('Layar Penuh')

    await btnFullscreen.trigger('click')
    expect(document.documentElement.requestFullscreen).toHaveBeenCalled()

    // Test Simulation Button: Click triggers test greeting popup
    const btnTest = wrapper.find('[data-testid="btn-test-greeting"]')
    expect(btnTest.exists()).toBe(true)

    await btnTest.trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="greeting-modal"]').exists()).toBe(true)

    wrapper.unmount()
  })
})
