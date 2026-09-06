import { describe, it, expect } from 'vitest'
import { reactive } from 'vue'
import { mount } from '@vue/test-utils'
import QuoteSection from './QuoteSection.vue'
import { RELIGIONS } from './quotePresets'

function mountWith(formDataOverrides = {}) {
  const formData = reactive({
    quoteType: 'default',
    quote: '',
    quoteSource: '',
    religion: '',
    ...formDataOverrides,
  })
  const wrapper = mount(QuoteSection, { props: { formData } })
  return { wrapper, formData }
}

describe('QuoteSection - default mode is religion-aware (QUOTE-01)', () => {
  it('renders the Kristen default quote and NOT the Ar-Rum verse when religion is kristen', () => {
    const { wrapper } = mountWith({ quoteType: 'default', religion: 'kristen' })
    expect(wrapper.text()).toContain('Kasih itu sabar')
    expect(wrapper.text()).not.toContain('Ar-Rum')
  })

  it('renders the islam default when religion is null, without writing formData.religion back', () => {
    const { wrapper, formData } = mountWith({ quoteType: 'default', religion: null })
    expect(wrapper.text()).toContain('Ar-Rum')
    expect(formData.religion).toBe(null)
  })

  it('renders all 6 religion chips in default mode', () => {
    const { wrapper } = mountWith({ quoteType: 'default' })
    for (const religion of RELIGIONS) {
      expect(wrapper.text()).toContain(religion.name)
    }
  })

  it('clicking the Kristen chip in default mode sets formData.religion and switches the preview', async () => {
    const { wrapper, formData } = mountWith({ quoteType: 'default', religion: 'islam' })
    const chip = wrapper.findAll('button').find((b) => b.text().includes('Kristen'))
    expect(chip).toBeTruthy()
    await chip.trigger('click')
    expect(formData.religion).toBe('kristen')
    expect(wrapper.text()).toContain('Kasih itu sabar')
  })

  it('mounting and clicking chips in default mode never writes formData.quote or formData.quoteSource', async () => {
    const { wrapper, formData } = mountWith({
      quoteType: 'default',
      religion: 'islam',
      quote: 'legacy quote text that must survive',
      quoteSource: 'legacy source',
    })
    const chip = wrapper.findAll('button').find((b) => b.text().includes('Kristen'))
    await chip.trigger('click')
    expect(formData.quote).toBe('legacy quote text that must survive')
    expect(formData.quoteSource).toBe('legacy source')
  })
})

describe('QuoteSection - preset mode still writes formData.quote/quoteSource (QUOTE-02)', () => {
  it('clicking a religion chip in preset mode writes formData.quote and formData.quoteSource', async () => {
    const { wrapper, formData } = mountWith({ quoteType: 'preset', religion: 'islam' })
    const chip = wrapper.findAll('button').find((b) => b.text().includes('Hindu'))
    expect(chip).toBeTruthy()
    await chip.trigger('click')
    expect(formData.quote).toBeTruthy()
    expect(formData.quoteSource).toBeTruthy()
    expect(formData.religion).toBe('hindu')
  })

  it('mounting preset mode with a saved quote one word off a preset does not relabel religion or overwrite quote', () => {
    const { formData } = mountWith({
      quoteType: 'preset',
      religion: 'kristen',
      quote: 'Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. (edited)',
      quoteSource: '1 Korintus 13:4-5',
    })
    expect(formData.quote).toBe(
      'Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. (edited)',
    )
    expect(formData.religion).toBe('kristen')
  })
})
