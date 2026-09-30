import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MobileQrModal from '@/components/modal/MobileQrModal.vue'

vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,mockqr'),
  },
}))

describe('MobileQrModal Component', () => {
  it('does not render when modelValue is false', () => {
    const wrapper = mount(MobileQrModal, {
      props: {
        modelValue: false,
        template: { name: 'Kimi No Na Wa', slug: 'kimi-no-na-wa' },
      },
    })
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('renders correctly when modelValue is true', async () => {
    const wrapper = mount(MobileQrModal, {
      props: {
        modelValue: true,
        template: { name: 'Kimi No Na Wa', slug: 'kimi-no-na-wa' },
      },
    })

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Kimi No Na Wa')
    expect(wrapper.text()).toContain('Preview Langsung di HP')
    expect(wrapper.text()).toContain('satuundangan.id/demo/kimi-no-na-wa')
  })

  it('emits update:modelValue when close button is clicked', async () => {
    const wrapper = mount(MobileQrModal, {
      props: {
        modelValue: true,
        template: { name: 'Naruto Wedding', slug: 'naruto' },
      },
    })

    const closeBtn = wrapper.find('button[aria-label="Tutup Modal"]')
    await closeBtn.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([false])
  })
})
