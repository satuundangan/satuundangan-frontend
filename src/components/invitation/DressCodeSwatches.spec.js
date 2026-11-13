import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DressCodeSwatches from './DressCodeSwatches.vue'

describe('DressCodeSwatches.vue (SAT-63)', () => {
  it('1. Renders nothing when colors array is empty or undefined', () => {
    const wrapper = mount(DressCodeSwatches, {
      props: {
        colors: []
      }
    })
    expect(wrapper.find('[data-test="dress-code-swatches"]').exists()).toBe(false)
  })

  it('2. Renders swatches when colors prop has valid hex codes', () => {
    const testColors = ['#8A9A5B', '#DDA15E', '#BC6C25']
    const wrapper = mount(DressCodeSwatches, {
      props: {
        colors: testColors,
        labelText: 'Nuansa Warna Tamu'
      }
    })

    expect(wrapper.find('[data-test="dress-code-swatches"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Nuansa Warna Tamu')

    const swatches = wrapper.findAll('[data-test="swatch-circle"]')
    expect(swatches.length).toBe(3)
    expect(swatches[0].attributes('style')).toContain('background-color: rgb(138, 154, 91)') // #8A9A5B
  })

  it('3. Extracts colors from data.designSettings.dressCodeColors if colors prop is empty', () => {
    const wrapper = mount(DressCodeSwatches, {
      props: {
        data: {
          designSettings: {
            dressCodeColors: ['#046A38', '#D4AF37']
          }
        }
      }
    })

    expect(wrapper.find('[data-test="dress-code-swatches"]').exists()).toBe(true)
    const swatches = wrapper.findAll('[data-test="swatch-circle"]')
    expect(swatches.length).toBe(2)
  })

  it('4. Filters out invalid hex colors safely', () => {
    const wrapper = mount(DressCodeSwatches, {
      props: {
        colors: ['#fff', 'invalid-color', '#000000', 'not-a-color']
      }
    })

    const swatches = wrapper.findAll('[data-test="swatch-circle"]')
    expect(swatches.length).toBe(2) // Only #fff and #000000 are valid
  })

  it('5. Hides label when showLabel is false', () => {
    const wrapper = mount(DressCodeSwatches, {
      props: {
        colors: ['#8A9A5B'],
        showLabel: false
      }
    })

    expect(wrapper.find('[data-test="dress-code-swatches"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Nuansa Warna Busana')
  })

  it('6. Applies size classes correctly', () => {
    const wrapperSm = mount(DressCodeSwatches, {
      props: { colors: ['#8A9A5B'], size: 'sm' }
    })
    expect(wrapperSm.find('[data-test="swatch-circle"]').classes()).toContain('w-6')

    const wrapperLg = mount(DressCodeSwatches, {
      props: { colors: ['#8A9A5B'], size: 'lg' }
    })
    expect(wrapperLg.find('[data-test="swatch-circle"]').classes()).toContain('w-10')
  })
})
