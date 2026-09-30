import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WatermarkBadge from '@/components/invitation/WatermarkBadge.vue'

describe('WatermarkBadge Component', () => {
  it('renders correctly with default dark variant', () => {
    const wrapper = mount(WatermarkBadge)
    expect(wrapper.text()).toContain('Tertarik undangan seperti ini?')
    expect(wrapper.text()).toContain('SatuUndangan.id')
    expect(wrapper.text()).toContain('Dibuat dengan cinta menggunakan')
    expect(wrapper.text()).toContain('Diskon & Komisi')

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('href')).toContain('https://satuundangan.id/')
    expect(link.attributes('href')).toContain('utm_source=invitation_watermark')
  })

  it('renders with light variant classes', () => {
    const wrapper = mount(WatermarkBadge, {
      props: { variant: 'light' }
    })
    expect(wrapper.find('.watermark-card').classes()).toContain('bg-slate-900/90')
  })

  it('renders with gold variant classes', () => {
    const wrapper = mount(WatermarkBadge, {
      props: { variant: 'gold' }
    })
    expect(wrapper.find('.watermark-card').classes()).toContain('bg-[#080f24]/95')
  })

  it('renders with neon variant classes', () => {
    const wrapper = mount(WatermarkBadge, {
      props: { variant: 'neon' }
    })
    expect(wrapper.find('.watermark-card').classes()).toContain('bg-[#0a0f1d]/95')
  })

  it('appends referral code when provided in props', () => {
    const wrapper = mount(WatermarkBadge, {
      props: { referralCode: 'partner123' }
    })
    const href = wrapper.find('a').attributes('href')
    expect(href).toContain('ref=partner123')
  })
})
