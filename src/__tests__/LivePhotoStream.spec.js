import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { reactive } from 'vue'
import GuestPhotoUploadView from '@/views/GuestPhotoUploadView.vue'
import LiveScreenView from '@/views/LiveScreenView.vue'
import * as guestPhotosApi from '@/api/guestPhotos'

const mockRoute = reactive({ params: { slug: 'romeo-juliet' } })

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  RouterLink: {
    template: '<a><slot /></a>',
  },
}))

vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,mock'),
  },
}))

vi.mock('@/api/invitation', () => ({
  getLiveScreenFeed: vi.fn().mockResolvedValue({
    invitation: {
      id: 1,
      slug: 'romeo-juliet',
      title: 'The Wedding of Romeo & Juliet',
      groomName: 'Romeo',
      brideName: 'Juliet',
      galleryImages: [],
    },
    recentCheckIns: [],
    wishes: [],
  }),
}))

vi.mock('@/api/guestPhotos', () => ({
  getSnapPortalInfo: vi.fn(),
  uploadGuestPhoto: vi.fn(),
  getLiveGuestPhotos: vi.fn(),
  getOwnerGuestPhotos: vi.fn(),
  toggleGuestPhotoApproval: vi.fn(),
  deleteGuestPhoto: vi.fn(),
}))

describe('Live Photo Stream / Memory Wall (SAT-69)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRoute.params.slug = 'romeo-juliet'
  })

  it('renders GuestPhotoUploadView with couple info and existing approved photos', async () => {
    guestPhotosApi.getSnapPortalInfo.mockResolvedValueOnce({
      invitation: {
        id: 1,
        slug: 'romeo-juliet',
        title: 'The Wedding of Romeo & Juliet',
        coupleName: 'Romeo & Juliet',
      },
      photos: [
        {
          id: 'p1',
          imageUrl: 'https://cdn.example.com/1.webp',
          thumbnailUrl: 'https://cdn.example.com/1-thumb.webp',
          guestName: 'Budi',
          caption: 'Selamat menempuh hidup baru',
          isApproved: true,
        },
      ],
    })

    const wrapper = mount(GuestPhotoUploadView, {
      global: {
        stubs: {
          'router-link': { template: '<a><slot /></a>' },
        },
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Romeo & Juliet')
    expect(wrapper.text()).toContain('Budi')
    expect(wrapper.text()).toContain('Selamat menempuh hidup baru')
    expect(wrapper.text()).toContain('1 foto')
  })

  it('uploads a guest photo and prepends it to the Memory Wall grid immediately', async () => {
    guestPhotosApi.getSnapPortalInfo.mockResolvedValueOnce({
      invitation: {
        id: 1,
        slug: 'romeo-juliet',
        title: 'Romeo & Juliet',
        coupleName: 'Romeo & Juliet',
      },
      photos: [],
    })

    guestPhotosApi.uploadGuestPhoto.mockResolvedValueOnce({
      id: 'p-new',
      imageUrl: 'https://cdn.example.com/new.webp',
      thumbnailUrl: 'https://cdn.example.com/new-thumb.webp',
      guestName: 'Sinta',
      caption: 'Candid di pelaminan',
      isApproved: true,
    })

    global.URL.createObjectURL = vi.fn(() => 'blob:mock-preview')
    global.URL.revokeObjectURL = vi.fn()

    const wrapper = mount(GuestPhotoUploadView, {
      global: {
        stubs: {
          'router-link': { template: '<a><slot /></a>' },
        },
      },
    })
    await flushPromises()

    const file = new File(['mock-image-bytes'], 'candid.jpg', { type: 'image/jpeg' })
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [file], configurable: true })
    await input.trigger('change')

    await wrapper.find('#snap-guest-name').setValue('Sinta')
    await wrapper.find('#snap-caption').setValue('Candid di pelaminan')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(guestPhotosApi.uploadGuestPhoto).toHaveBeenCalledWith('romeo-juliet', {
      file,
      guestName: 'Sinta',
      caption: 'Candid di pelaminan',
    })
    expect(wrapper.text()).toContain('Sinta')
    expect(wrapper.text()).toContain('Candid di pelaminan')
    expect(wrapper.text()).toContain('Foto berhasil dikirim ke Memory Wall.')
  })

  it('integrates approved guest photos into LiveScreenView ambient slideshow with attribution', async () => {
    guestPhotosApi.getLiveGuestPhotos.mockResolvedValueOnce({
      photos: [
        {
          id: 'gp-1',
          imageUrl: 'https://cdn.example.com/guest-snap.webp',
          guestName: 'Andi & Rina',
          caption: 'Momen manis bersama pengantin',
        },
      ],
    })

    const wrapper = mount(LiveScreenView)
    await flushPromises()

    expect(guestPhotosApi.getLiveGuestPhotos).toHaveBeenCalledWith('romeo-juliet')
    const attribution = wrapper.find('[data-testid="guest-photo-attribution"]')
    expect(attribution.exists()).toBe(true)
    expect(attribution.text()).toContain('Andi & Rina')
    expect(attribution.text()).toContain('Momen manis bersama pengantin')
  })
})
