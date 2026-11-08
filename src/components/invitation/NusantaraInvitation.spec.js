import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import NusantaraInvitation from './NusantaraInvitation.vue'

vi.mock('vue-toastification', () => ({
  useToast: () => ({ error: vi.fn(), info: vi.fn(), success: vi.fn() }),
}))

vi.mock('@/api/guestMessage', () => ({ createGuestMessage: vi.fn() }))

const invitation = {
  id: 12,
  groomName: 'Raka Pratama',
  brideName: 'Nadia Puspita',
  guestName: 'Keluarga Budi',
  quoteText: 'Dengan penuh syukur kami mengundang Anda.',
  parents: { groomParents: 'Dedi dan Rina', brideParents: 'Asep dan Mira' },
  akadLocation: {
    dateTime: '2027-06-12T08:00:00+07:00',
    description: 'Gedung Pakuan, Bandung',
    mapUrl: 'https://maps.example/akad',
  },
  resepsiLocation: {
    dateTime: '2027-06-12T11:00:00+07:00',
    description: 'Gedung Pakuan, Bandung',
  },
  loveStory: [{ date: '2021', title: 'Pertemuan', description: 'Kami bertemu di Bandung.' }],
  galleryImages: ['https://images.example/pasangan.jpg'],
  bankAccounts: [{ bankName: 'BCA', accountNumber: '1234567890', accountName: 'Raka' }],
  selectedSections: ['couple', 'event', 'love-story', 'gallery', 'gift', 'rsvp'],
}

describe('NusantaraInvitation', () => {
  it.each([
    ['sunda', 'nusantara--sunda'],
    ['jawa', 'nusantara--jawa'],
    ['batak', 'nusantara--batak'],
    ['dayak-ngaju', 'nusantara--dayak-ngaju'],
  ])('renders invitation data with the %s visual theme', async (themeKey, themeClass) => {
    const wrapper = mount(NusantaraInvitation, {
      props: { data: invitation, themeKey },
      global: { stubs: { GalleryInvitation: true, MusicControl: true } },
    })

    expect(wrapper.classes()).toContain(themeClass)
    expect(wrapper.text()).toContain('Raka Pratama')
    expect(wrapper.text()).toContain('Nadia Puspita')
    expect(wrapper.text()).toContain('Keluarga Budi')

    await wrapper.get('.nu-button--cover').trigger('click')

    expect(wrapper.text()).toContain('Dedi dan Rina')
    expect(wrapper.text()).toContain('Asep dan Mira')
    expect(wrapper.text()).toContain('Gedung Pakuan, Bandung')
    expect(wrapper.text()).toContain('Pertemuan')
    expect(wrapper.find('.nu-gallery-section').exists()).toBe(true)
    expect(wrapper.text()).toContain('1234567890')
    expect(wrapper.find('#nu-rsvp').exists()).toBe(true)

    wrapper.unmount()
  })

  it('hides sections disabled in the invitation payload', async () => {
    const wrapper = mount(NusantaraInvitation, {
      props: {
        themeKey: 'jawa',
        data: { ...invitation, selectedSections: ['couple', 'rsvp'] },
      },
      global: { stubs: { GalleryInvitation: true, MusicControl: true } },
    })

    await wrapper.get('.nu-button--cover').trigger('click')

    expect(wrapper.find('#nu-couple').exists()).toBe(true)
    expect(wrapper.find('#nu-events').exists()).toBe(false)
    expect(wrapper.find('#nu-gallery').exists()).toBe(false)

    wrapper.unmount()
  })
})
