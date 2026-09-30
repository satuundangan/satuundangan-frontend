import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BudgetCalculatorView from '@/views/BudgetCalculatorView.vue'

vi.mock('@/api/lead', () => ({
  submitLead: vi.fn().mockResolvedValue({ success: true }),
}))

describe('BudgetCalculatorView Component', () => {
  it('renders budget calculator with initial default budget', () => {
    const wrapper = mount(BudgetCalculatorView, {
      global: {
        stubs: {
          'router-link': true,
        },
      },
    })

    expect(wrapper.text()).toContain('Kalkulator Budget Nikah & Wedding Checklist')
    expect(wrapper.text()).toContain('Total Anggaran')
    expect(wrapper.text()).toContain('Rekomendasi Alokasi Anggaran')
    expect(wrapper.text()).toContain('Katering & Gedung / Venue')
    expect(wrapper.text()).toContain('Undangan Digital & Souvenir')
  })

  it('switches between calculator and checklist tabs', async () => {
    const wrapper = mount(BudgetCalculatorView, {
      global: {
        stubs: {
          'router-link': true,
        },
      },
    })

    const buttons = wrapper.findAll('button')
    const checklistBtn = buttons.find((b) => b.text().includes('Checklist Persiapan'))
    expect(checklistBtn).toBeDefined()

    await checklistBtn.trigger('click')
    expect(wrapper.text()).toContain('Checklist Persiapan Pernikahan')
    expect(wrapper.text()).toContain('H-12 s/d H-9 Bulan')
  })
})
