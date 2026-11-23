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

    // Advance 5s poll timer (SAT-73 default 5000ms)
    await vi.advanceTimersByTimeAsync(5000)
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

  it('3b. Menampilkan baris "Powered by satuundangan.id" di ticker (NAD-114)', async () => {
    const wrapper = mount(LiveScreenView, {
      props: { slug: 'romeo-juliet' },
    })

    await flushPromises()

    const poweredBy = wrapper.find('[data-testid="powered-by"]')
    expect(poweredBy.exists()).toBe(true)
    expect(poweredBy.text()).toContain('Powered by')
    expect(poweredBy.text()).toContain('satuundangan.id')

    wrapper.unmount()
  })

  it('3c. Badge Hadir hanya muncul untuk tamu hadir, bukan tidak_hadir (NAD-114)', async () => {
    invitationApi.getLiveScreenFeed.mockResolvedValue({
      ...mockFeedData,
      wishes: [
        {
          id: 'wish-2',
          senderName: 'Budi',
          message: 'Mohon maaf tidak bisa hadir',
          rsvpStatus: 'tidak_hadir',
        },
      ],
    })

    const wrapper = mount(LiveScreenView, {
      props: { slug: 'romeo-juliet' },
    })

    await flushPromises()

    const wishMessage = wrapper.find('[data-testid="wish-message"]')
    expect(wishMessage.text()).toContain('Budi')
    expect(wishMessage.find('span.uppercase').exists()).toBe(false)

    wrapper.unmount()

    // Sebaliknya: rsvpStatus 'hadir' tetap menampilkan badge
    invitationApi.getLiveScreenFeed.mockResolvedValue({
      ...mockFeedData,
      wishes: [{ id: 'wish-3', senderName: 'Sari', message: 'Sampai jumpa!', rsvpStatus: 'hadir' }],
    })
    const attending = mount(LiveScreenView, { props: { slug: 'romeo-juliet' } })
    await flushPromises()
    const badge = attending.find('[data-testid="wish-message"] span.uppercase')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('Hadir')
    attending.unmount()
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

  it('5. Menangani response 304 Not Modified dengan conditional ETag tanpa merusak state yang ada (SAT-73)', async () => {
    invitationApi.getLiveScreenFeed.mockResolvedValueOnce({
      ...mockFeedData,
      etag: '"v1-etag-12345"',
    })

    const wrapper = mount(LiveScreenView, {
      props: { slug: 'romeo-juliet' },
    })

    await flushPromises()

    expect(wrapper.find('[data-testid="couple-names"]').text()).toContain('Romeo & Juliet')
    expect(wrapper.find('[data-testid="sync-status"]').text()).toContain('Live Sync Terhubung')

    // Initial mount call passed etag: null
    expect(invitationApi.getLiveScreenFeed).toHaveBeenLastCalledWith('romeo-juliet', { etag: null })

    // Next poll returns 304 Not Modified
    invitationApi.getLiveScreenFeed.mockResolvedValueOnce({
      notModified: true,
      status: 304,
    })

    // Advance 5s poll timer
    await vi.advanceTimersByTimeAsync(5000)
    await flushPromises()

    // Verify next request included the If-None-Match ETag
    expect(invitationApi.getLiveScreenFeed).toHaveBeenLastCalledWith('romeo-juliet', { etag: '"v1-etag-12345"' })

    // Verify state was preserved and syncStatus remains connected
    expect(wrapper.find('[data-testid="couple-names"]').text()).toContain('Romeo & Juliet')
    expect(wrapper.find('[data-testid="venue-info"]').text()).toContain('Grand Ballroom Hotel Mulia')
    expect(wrapper.find('[data-testid="sync-status"]').text()).toContain('Live Sync Terhubung')

    wrapper.unmount()
  })

  it('6. Adaptive backoff: memperlambat interval polling ke 8s saat idle (>= 10x 304) dan kembali ke 5s saat data baru diterima (SAT-73)', async () => {
    invitationApi.getLiveScreenFeed.mockResolvedValueOnce({
      ...mockFeedData,
      etag: '"initial-tag"',
    })

    const wrapper = mount(LiveScreenView, {
      props: { slug: 'romeo-juliet' },
    })
    await flushPromises()

    // Subsequent polls return 304 Not Modified
    invitationApi.getLiveScreenFeed.mockResolvedValue({
      notModified: true,
      status: 304,
    })

    // Advance 9 polls (9 x 5000ms) -> idleCount reaches 9, polling interval remains 5s
    for (let i = 0; i < 9; i++) {
      await vi.advanceTimersByTimeAsync(5000)
      await flushPromises()
    }
    const callsAfter9 = invitationApi.getLiveScreenFeed.mock.calls.length

    // 10th poll -> idleCount reaches 10, triggers adjustPollingInterval to 8000ms
    await vi.advanceTimersByTimeAsync(5000)
    await flushPromises()
    expect(invitationApi.getLiveScreenFeed.mock.calls.length).toBe(callsAfter9 + 1)

    // Verify polling now waits 8000ms instead of 5000ms
    const callsAfter10 = invitationApi.getLiveScreenFeed.mock.calls.length
    await vi.advanceTimersByTimeAsync(5000)
    await flushPromises()
    // Should NOT have fired at 5000ms because interval is now 8000ms
    expect(invitationApi.getLiveScreenFeed.mock.calls.length).toBe(callsAfter10)

    // Advance remaining 3000ms (total 8000ms) -> poll fires
    await vi.advanceTimersByTimeAsync(3000)
    await flushPromises()
    expect(invitationApi.getLiveScreenFeed.mock.calls.length).toBe(callsAfter10 + 1)

    // Now return full new data -> idleCount should reset to 0 and polling return to 5000ms
    invitationApi.getLiveScreenFeed.mockResolvedValueOnce({
      ...mockFeedData,
      etag: '"updated-tag"',
    })
    // Advance 8000ms to trigger next poll
    await vi.advanceTimersByTimeAsync(8000)
    await flushPromises()

    // Next poll should now fire at 5000ms
    const callsAfterReset = invitationApi.getLiveScreenFeed.mock.calls.length
    await vi.advanceTimersByTimeAsync(5000)
    await flushPromises()
    expect(invitationApi.getLiveScreenFeed.mock.calls.length).toBe(callsAfterReset + 1)

    wrapper.unmount()
  })

  it('7. Pilihan tema proyektor: toggle dropdown, ubah ke tema Cerah (light) dan simpan ke localStorage', async () => {
    const setItemSpy = vi.spyOn(window.localStorage, 'setItem')
    const wrapper = mount(LiveScreenView, {
      props: { slug: 'romeo-juliet' },
    })
    await flushPromises()

    // 1. Tombol tema awal muncul dengan default Gelap
    const btnTheme = wrapper.find('[data-testid="btn-toggle-theme"]')
    expect(btnTheme.exists()).toBe(true)
    expect(btnTheme.text()).toContain('Gelap')

    // Dropdown initially closed
    expect(wrapper.find('[data-testid="theme-dropdown-menu"]').exists()).toBe(false)

    // 2. Klik tombol tema untuk membuka dropdown menu
    await btnTheme.trigger('click')
    const dropdown = wrapper.find('[data-testid="theme-dropdown-menu"]')
    expect(dropdown.exists()).toBe(true)

    // Option cerah exists
    const optionLight = wrapper.find('[data-testid="theme-option-light"]')
    expect(optionLight.exists()).toBe(true)
    expect(optionLight.text()).toContain('Cerah Anggun')

    // 3. Klik pilihan Cerah Anggun
    await optionLight.trigger('click')
    await flushPromises()

    // Dropdown harus otomatis tertutup
    expect(wrapper.find('[data-testid="theme-dropdown-menu"]').exists()).toBe(false)

    // Label tombol berubah jadi Cerah
    expect(wrapper.find('[data-testid="btn-toggle-theme"]').text()).toContain('Cerah')

    // Class container berubah menjadi tema cerah (bg-[#faf7f2])
    const container = wrapper.find('[data-testid="live-screen-container"]')
    expect(container.classes()).toContain('bg-[#faf7f2]')

    // LocalStorage harus dipanggil untuk menyimpan preferensi tema
    expect(setItemSpy).toHaveBeenCalledWith('live_screen_theme_romeo-juliet', 'light')

    setItemSpy.mockRestore()
    wrapper.unmount()
  })

  it('8. Memuat preferensi tema yang tersimpan dari localStorage saat halaman dibuka', async () => {
    const getItemSpy = vi.spyOn(window.localStorage, 'getItem').mockImplementation((key) => {
      if (key === 'live_screen_theme_romeo-juliet') return 'light'
      return null
    })

    const wrapper = mount(LiveScreenView, {
      props: { slug: 'romeo-juliet' },
    })
    await flushPromises()

    // Container langsung aktif dengan styling cerah
    const container = wrapper.find('[data-testid="live-screen-container"]')
    expect(container.classes()).toContain('bg-[#faf7f2]')
    expect(wrapper.find('[data-testid="btn-toggle-theme"]').text()).toContain('Cerah')

    getItemSpy.mockRestore()
    wrapper.unmount()
  })
})
