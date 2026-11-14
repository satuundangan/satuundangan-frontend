import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import QrisGiftCard from './QrisGiftCard.vue'

describe('QrisGiftCard.vue (SAT-66)', () => {
  beforeEach(() => {
    // Clear DOM before each test
    document.body.innerHTML = ''
  })

  it('1. Renders nothing when qrisUrl and data.qrisImageUrl are empty', () => {
    const wrapper = mount(QrisGiftCard, {
      props: {
        qrisUrl: ''
      }
    })
    expect(wrapper.find('[data-test="qris-gift-card"]').exists()).toBe(false)
  })

  it('2. Renders trigger button when qrisUrl prop is provided', () => {
    const testUrl = 'https://cdn.satuundangan.id/uploads/qris-test.webp'
    const wrapper = mount(QrisGiftCard, {
      props: {
        qrisUrl: testUrl,
        buttonText: 'Scan Amplop QRIS'
      }
    })

    expect(wrapper.find('[data-test="qris-gift-card"]').exists()).toBe(true)
    const btn = wrapper.find('[data-test="open-qris-modal-btn"]')
    expect(btn.exists()).toBe(true)
    expect(btn.text()).toContain('Scan Amplop QRIS')
  })

  it('3. Extracts qrisUrl from data.designSettings.qrisImageUrl if qrisUrl prop is empty', () => {
    const wrapper = mount(QrisGiftCard, {
      props: {
        data: {
          designSettings: {
            qrisImageUrl: 'https://cdn.satuundangan.id/uploads/qris-ds.webp'
          }
        }
      }
    })

    expect(wrapper.find('[data-test="qris-gift-card"]').exists()).toBe(true)
  })

  it('4. Opens modal on button click, displaying the high-res QRIS image and couple names', async () => {
    const testUrl = 'https://cdn.satuundangan.id/uploads/qris-highres.webp'
    const wrapper = mount(QrisGiftCard, {
      props: {
        qrisUrl: testUrl,
        groomName: 'Dimas',
        brideName: 'Rina',
        accountName: 'Dimas Setiawan'
      },
      attachTo: document.body
    })

    const openBtn = wrapper.find('[data-test="open-qris-modal-btn"]')
    await openBtn.trigger('click')

    // Modal is teleported to body
    const modalContent = document.body.querySelector('[data-test="qris-modal-content"]')
    expect(modalContent).not.toBeNull()
    expect(modalContent.textContent).toContain('Dimas & Rina')
    expect(modalContent.textContent).toContain('Dimas Setiawan')

    const qrisImg = document.body.querySelector('[data-test="qris-image"]')
    expect(qrisImg).not.toBeNull()
    expect(qrisImg.getAttribute('src')).toBe(testUrl)

    wrapper.unmount()
  })

  it('5. Closes modal when clicking the close button', async () => {
    const wrapper = mount(QrisGiftCard, {
      props: {
        qrisUrl: 'https://cdn.satuundangan.id/uploads/qris-close.webp'
      },
      attachTo: document.body
    })

    await wrapper.find('[data-test="open-qris-modal-btn"]').trigger('click')
    expect(document.body.querySelector('[data-test="qris-modal-content"]')).not.toBeNull()

    const closeBtn = document.body.querySelector('[data-test="close-qris-modal-btn"]')
    closeBtn.click()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isOpen).toBe(false)
    wrapper.unmount()
  })

  it('6. Closes modal on Escape key press', async () => {
    const wrapper = mount(QrisGiftCard, {
      props: {
        qrisUrl: 'https://cdn.satuundangan.id/uploads/qris-esc.webp'
      },
      attachTo: document.body
    })

    await wrapper.find('[data-test="open-qris-modal-btn"]').trigger('click')
    expect(wrapper.vm.isOpen).toBe(true)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isOpen).toBe(false)
    wrapper.unmount()
  })

  it('7. Triggers download helper when download button is clicked', async () => {
    const wrapper = mount(QrisGiftCard, {
      props: {
        qrisUrl: 'https://cdn.satuundangan.id/uploads/qris-dl.webp',
        groomName: 'Rian',
        brideName: 'Siti'
      },
      attachTo: document.body
    })

    await wrapper.find('[data-test="open-qris-modal-btn"]').trigger('click')
    const dlBtn = document.body.querySelector('[data-test="download-qris-btn"]')
    expect(dlBtn).not.toBeNull()

    // Mock document.createElement('a').click
    const clickSpy = vi.fn()
    const origCreate = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const el = origCreate(tagName)
      if (tagName === 'a') {
        el.click = clickSpy
      }
      return el
    })

    dlBtn.click()
    expect(clickSpy).toHaveBeenCalled()

    vi.restoreAllMocks()
    wrapper.unmount()
  })
})
