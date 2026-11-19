import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import GalleryInvitation from '@/components/invitation/GalleryInvitation.vue'

describe('GalleryInvitation.vue', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('renders grid with derived thumbnail for webp image URLs', () => {
    const wrapper = mount(GalleryInvitation, {
      props: {
        items: [
          { src: 'https://cdn.example.com/invitations/photo1.webp', alt: 'Photo 1' }
        ]
      }
    })

    const img = wrapper.find('.thumbnail-image')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://cdn.example.com/invitations/photo1-thumb.webp')
    expect(img.attributes('loading')).toBe('lazy')
    expect(img.attributes('decoding')).toBe('async')
  })

  it('prioritizes explicit thumbnailUrl when provided', () => {
    const wrapper = mount(GalleryInvitation, {
      props: {
        items: [
          {
            src: 'https://cdn.example.com/invitations/photo1.webp',
            thumbnailUrl: 'https://cdn.example.com/custom-thumb.webp',
            alt: 'Custom'
          }
        ]
      }
    })

    const img = wrapper.find('.thumbnail-image')
    expect(img.attributes('src')).toBe('https://cdn.example.com/custom-thumb.webp')
  })

  it('supports images prop for backward compatibility', () => {
    const wrapper = mount(GalleryInvitation, {
      props: {
        images: [
          { src: 'https://cdn.example.com/img1.webp' },
          { src: 'https://cdn.example.com/img2.jpg' }
        ]
      }
    })

    const images = wrapper.findAll('.thumbnail-image')
    expect(images.length).toBe(2)
    expect(images[0].attributes('src')).toBe('https://cdn.example.com/img1-thumb.webp')
    expect(images[1].attributes('src')).toBe('https://cdn.example.com/img2.jpg')
  })

  it('falls back to fullSrc on thumbnail load error', async () => {
    const item = { src: 'https://cdn.example.com/legacy-photo.webp' }
    const wrapper = mount(GalleryInvitation, {
      props: {
        items: [item]
      }
    })

    const img = wrapper.find('.thumbnail-image')
    expect(img.attributes('src')).toBe('https://cdn.example.com/legacy-photo-thumb.webp')

    // Simulate error event via handler
    const mockTarget = {
      src: 'https://cdn.example.com/legacy-photo-thumb.webp',
      dataset: {}
    }
    wrapper.vm.handleThumbError({ target: mockTarget }, item)

    expect(mockTarget.src).toBe('https://cdn.example.com/legacy-photo.webp')
    expect(mockTarget.dataset.fallbackApplied).toBe('true')
  })

  it('opens lightbox and shows full resolution image on click', async () => {
    const wrapper = mount(GalleryInvitation, {
      props: {
        items: [
          {
            src: 'https://cdn.example.com/photo-full.webp',
            fileUrl: 'https://cdn.example.com/photo-full.webp',
            thumbnailUrl: 'https://cdn.example.com/photo-thumb.webp',
            caption: 'Our Wedding Day'
          }
        ]
      },
      attachTo: document.body
    })

    expect(wrapper.vm.lightboxVisible).toBe(false)

    // Click grid item
    await wrapper.find('.grid-item').trigger('click')
    expect(wrapper.vm.lightboxVisible).toBe(true)

    // Lightbox image should use full resolution
    const lightboxImg = document.body.querySelector('.lightbox-image')
    expect(lightboxImg).not.toBeNull()
    expect(lightboxImg.getAttribute('src')).toBe('https://cdn.example.com/photo-full.webp')

    wrapper.unmount()
  })
})
