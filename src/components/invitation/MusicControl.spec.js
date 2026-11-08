import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MusicControl from './MusicControl.vue'
import { ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

describe('MusicControl.vue (SAT-49)', () => {
  let originalAudio
  let mockAudioInstance
  let router

  beforeEach(async () => {
    mockAudioInstance = {
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      volume: 1,
      preload: 'auto',
      src: '',
      loop: false,
      currentTime: 0,
      onloadedmetadata: null,
      ontimeupdate: null,
    }

    originalAudio = global.Audio
    global.Audio = vi.fn(function () {
      return mockAudioInstance
    })

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div></div>' } },
        { path: '/demo/:templateSlug', name: 'demo', component: { template: '<div></div>' } },
      ],
    })
    await router.push('/')
    await router.isReady()
  })

  afterEach(() => {
    global.Audio = originalAudio
    vi.restoreAllMocks()
  })

  it('1. Initializes with comfortable volume (45%) and metadata preload in live mode', () => {
    const wrapper = mount(MusicControl, {
      props: {
        src: '/audio/test.mp3',
        isPreview: false,
      },
      global: {
        plugins: [router],
      },
    })

    expect(global.Audio).toHaveBeenCalled()
    expect(mockAudioInstance.src).toBe('/audio/test.mp3')
    expect(mockAudioInstance.loop).toBe(true)
    expect(mockAudioInstance.preload).toBe('metadata')
    expect(mockAudioInstance.volume).toBe(0.45)
  })

  it('2. Disables autoplay and sets preload="none" in preview mode (prop isPreview: true)', () => {
    const wrapper = mount(MusicControl, {
      props: {
        src: '/audio/test.mp3',
        isPreview: true,
      },
      global: {
        plugins: [router],
      },
    })

    // In preview mode, preload should be 'none' to avoid downloading full audio
    expect(mockAudioInstance.preload).toBe('none')
    // Play should NOT be called automatically
    expect(mockAudioInstance.play).not.toHaveBeenCalled()
    expect(wrapper.vm.isPreviewMode).toBe(true)
  })

  it('3. Respects injected isInvitationPreview context (from InvitationView preview/demo)', () => {
    const isPreviewRef = ref(true)
    const wrapper = mount(MusicControl, {
      props: {
        src: '/audio/test.mp3',
      },
      global: {
        plugins: [router],
        provide: {
          isInvitationPreview: isPreviewRef,
        },
      },
    })

    expect(wrapper.vm.isPreviewMode).toBe(true)
    expect(mockAudioInstance.preload).toBe('none')
    expect(mockAudioInstance.play).not.toHaveBeenCalled()
  })

  it('4. Automatically detects preview mode via route query (?preview=true)', async () => {
    await router.push('/?preview=true')
    const wrapper = mount(MusicControl, {
      props: {
        src: '/audio/test.mp3',
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.vm.isPreviewMode).toBe(true)
    expect(mockAudioInstance.preload).toBe('none')
    expect(mockAudioInstance.play).not.toHaveBeenCalled()
  })

  it('5. Automatically detects preview mode on demo route (/demo/sakura-blossom)', async () => {
    await router.push('/demo/sakura-blossom')
    const wrapper = mount(MusicControl, {
      props: {
        src: '/audio/test.mp3',
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.vm.isPreviewMode).toBe(true)
    expect(mockAudioInstance.preload).toBe('none')
    expect(mockAudioInstance.play).not.toHaveBeenCalled()
  })

  it('6. Plays audio only when user explicitly clicks the floating button', async () => {
    const wrapper = mount(MusicControl, {
      props: {
        src: '/audio/test.mp3',
        isPreview: true,
      },
      global: {
        plugins: [router],
      },
    })

    expect(mockAudioInstance.play).not.toHaveBeenCalled()

    const btn = wrapper.find('button')
    expect(btn.exists()).toBe(true)
    await btn.trigger('click')

    expect(mockAudioInstance.play).toHaveBeenCalledTimes(1)
    expect(mockAudioInstance.volume).toBe(0.45)
  })

  it('7. Toggles play and pause on repeated user clicks', async () => {
    const wrapper = mount(MusicControl, {
      props: {
        src: '/audio/test.mp3',
        isPreview: true,
      },
      global: {
        plugins: [router],
      },
    })

    const btn = wrapper.find('button')
    // First click: Play
    await btn.trigger('click')
    expect(mockAudioInstance.play).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.isPlaying).toBe(true)

    // Second click: Pause
    await btn.trigger('click')
    expect(mockAudioInstance.pause).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.isPlaying).toBe(false)
  })

  it('8. Sanitizes custom volume within [0, 1]', () => {
    const wrapper = mount(MusicControl, {
      props: {
        src: '/audio/test.mp3',
        volume: 0.35,
        isPreview: false,
      },
      global: {
        plugins: [router],
      },
    })

    expect(mockAudioInstance.volume).toBe(0.35)
  })

  it('9. Cleans up audio and pauses on component unmount', () => {
    const wrapper = mount(MusicControl, {
      props: {
        src: '/audio/test.mp3',
        isPreview: false,
      },
      global: {
        plugins: [router],
      },
    })

    wrapper.unmount()
    expect(mockAudioInstance.pause).toHaveBeenCalled()
  })
})
