import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AudioPreviewButton from '@/components/audio/AudioPreviewButton.vue'

describe('AudioPreviewButton Component', () => {
  it('renders initial state with Play text', () => {
    const wrapper = mount(AudioPreviewButton, {
      props: {
        audioUrl: '/audio/wedding-romantic-aisle.mp3',
        templateName: 'Royal Gold',
      },
    })

    expect(wrapper.text()).toContain('Cuplikan Musik')
    expect(wrapper.find('.fa-play').exists()).toBe(true)
  })

  it('renders compact mode with concise label', () => {
    const wrapper = mount(AudioPreviewButton, {
      props: {
        audioUrl: '/audio/wedding-romantic-aisle.mp3',
        compact: true,
      },
    })

    expect(wrapper.text()).toContain('Musik')
  })
})
