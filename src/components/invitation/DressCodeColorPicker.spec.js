import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DressCodeColorPicker from './DressCodeColorPicker.vue'
import { DRESS_CODE_PRESETS } from '@/utils/dressCodePresets'

describe('DressCodeColorPicker.vue (SAT-63)', () => {
  it('1. Renders initial state with 0 selected colors', () => {
    const wrapper = mount(DressCodeColorPicker, {
      props: {
        modelValue: []
      }
    })

    expect(wrapper.text()).toContain('Palet Warna Dress Code')
    expect(wrapper.text()).toContain('0/6 Warna')
    expect(wrapper.text()).toContain('Pilih dari Palet Rekomendasi')
  })

  it('2. Clicking a preset emits update:modelValue with preset colors', async () => {
    const wrapper = mount(DressCodeColorPicker, {
      props: {
        modelValue: []
      }
    })

    const sagePresetBtn = wrapper.findAll('button').find(b => b.text().includes('Sage & Terracotta'))
    expect(sagePresetBtn).toBeDefined()
    await sagePresetBtn.trigger('click')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toEqual(DRESS_CODE_PRESETS[0].colors)
  })

  it('3. Adds valid custom HEX color code', async () => {
    const wrapper = mount(DressCodeColorPicker, {
      props: {
        modelValue: ['#8A9A5B']
      }
    })

    const hexInput = wrapper.find('input[type="text"]')
    await hexInput.setValue('DDA15E')

    const addBtn = wrapper.findAll('button').find(b => b.text().includes('Tambah'))
    expect(addBtn.attributes('disabled')).toBeUndefined()
    await addBtn.trigger('click')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toEqual(['#8A9A5B', '#DDA15E'])
  })

  it('4. Removes a selected color when click x button', async () => {
    const wrapper = mount(DressCodeColorPicker, {
      props: {
        modelValue: ['#8A9A5B', '#DDA15E', '#BC6C25']
      }
    })

    const removeBtns = wrapper.findAll('button[aria-label^="Hapus #"]')
    expect(removeBtns.length).toBe(3)

    // Remove the first color (#8A9A5B)
    await removeBtns[0].trigger('click')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toEqual(['#DDA15E', '#BC6C25'])
  })

  it('5. Clears all colors when clicking "Hapus Semua"', async () => {
    const wrapper = mount(DressCodeColorPicker, {
      props: {
        modelValue: ['#8A9A5B', '#DDA15E']
      }
    })

    const clearBtn = wrapper.findAll('button').find(b => b.text().includes('Hapus Semua'))
    expect(clearBtn).toBeDefined()
    await clearBtn.trigger('click')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toEqual([])
  })
})
