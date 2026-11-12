import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import JourneyChecklistWidget from './JourneyChecklistWidget.vue'

describe('JourneyChecklistWidget.vue (SAT-62)', () => {
  let router

  beforeEach(() => {
    localStorage.clear()
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/templates', component: { template: '<div>Templates</div>' } },
        { path: '/invitation/:id/edit', component: { template: '<div>Edit</div>' } },
        { path: '/guests', component: { template: '<div>Guests</div>' } },
      ],
    })
  })

  it('1. Renders empty initial state (0/4 completed, 0% progress)', () => {
    const wrapper = mount(JourneyChecklistWidget, {
      props: {
        invitations: [],
        stats: { guests: 0, total: 0 },
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Panduan Persiapan Undangan')
    expect(wrapper.text()).toContain('0/4 Selesai')
    expect(wrapper.text()).toContain('0%')
    expect(wrapper.text()).toContain('Yuk mulai perjalanan pernikahan impianmu')

    // 4 step titles should be visible
    expect(wrapper.text()).toContain('Pilih Desain')
    expect(wrapper.text()).toContain('Data Mempelai')
    expect(wrapper.text()).toContain('Daftar Tamu')
    expect(wrapper.text()).toContain('Sebar Undangan')

    // Step 1 should be current (highlighted)
    expect(wrapper.text()).toContain('Langkah 1')
  })

  it('2. Calculates 25% progress when invitation is created (Step 1 complete)', () => {
    const wrapper = mount(JourneyChecklistWidget, {
      props: {
        invitations: [
          {
            id: 'inv-123',
            title: 'Undangan Romeo & Juliet',
            templateName: 'Royal Luxury',
            groomName: '',
            brideName: '',
            isPublished: false,
          },
        ],
        stats: { guests: 0 },
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('1/4 Selesai')
    expect(wrapper.text()).toContain('25%')
    expect(wrapper.text()).toContain('Desain sudah dipilih! Lanjutkan pengisian informasi kedua mempelai.')
    expect(wrapper.text()).toContain('Undangan Romeo & Juliet')
  })

  it('3. Calculates 50% progress when groom and bride names are provided (Step 2 complete)', () => {
    const wrapper = mount(JourneyChecklistWidget, {
      props: {
        invitations: [
          {
            id: 'inv-123',
            title: 'Undangan Romeo & Juliet',
            groomName: 'Romeo Montague',
            brideName: 'Juliet Capulet',
            isPublished: false,
          },
        ],
        stats: { guests: 0 },
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('2/4 Selesai')
    expect(wrapper.text()).toContain('50%')
    expect(wrapper.text()).toContain('Bagus sekali! Lengkapi detail kedua mempelai')
    expect(wrapper.text()).toContain('Romeo Montague & Juliet Capulet')
  })

  it('4. Calculates 75% progress when guest count > 0 (Step 3 complete)', () => {
    const wrapper = mount(JourneyChecklistWidget, {
      props: {
        invitations: [
          {
            id: 'inv-123',
            groomName: 'Romeo',
            brideName: 'Juliet',
            isPublished: false,
          },
        ],
        stats: { guests: 120 },
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('3/4 Selesai')
    expect(wrapper.text()).toContain('75%')
    expect(wrapper.text()).toContain('Hampir selesai! Tambahkan daftar tamu terdekat')
    expect(wrapper.text()).toContain('120 tamu telah didaftarkan')
  })

  it('5. Calculates 100% progress when published and auto-collapses on mount', async () => {
    const wrapper = mount(JourneyChecklistWidget, {
      props: {
        invitations: [
          {
            id: 'inv-123',
            groomName: 'Romeo',
            brideName: 'Juliet',
            isPublished: true,
          },
        ],
        stats: { guests: 120 },
      },
      global: {
        plugins: [router],
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('4/4 Selesai')
    expect(wrapper.text()).toContain('100%')
    expect(wrapper.text()).toContain('Luar biasa! Undangan digitalmu siap disebarkan')

    // At 100% with no saved preference, it defaults to collapsed
    const stepCardsContainer = wrapper.find('[data-test="steps-grid"]')
    expect(stepCardsContainer.attributes('style') || '').toContain('display: none')
  })

  it('6. Supports toggling collapse and persists state in localStorage', async () => {
    const wrapper = mount(JourneyChecklistWidget, {
      props: {
        invitations: [
          {
            id: 'inv-123',
            groomName: 'Romeo',
            brideName: 'Juliet',
            isPublished: false,
          },
        ],
        stats: { guests: 0 },
      },
      global: {
        plugins: [router],
      },
    })
    await wrapper.vm.$nextTick()

    // Initially expanded (progress < 100%)
    const stepCardsContainer = wrapper.find('[data-test="steps-grid"]')
    expect(stepCardsContainer.attributes('style') || '').not.toContain('display: none')

    // Click collapse toggle
    const toggleBtn = wrapper.find('[data-test="collapse-btn"]')
    expect(toggleBtn.exists()).toBe(true)
    await toggleBtn.trigger('click')
    await wrapper.vm.$nextTick()

    // Now collapsed
    expect(stepCardsContainer.attributes('style') || '').toContain('display: none')
    expect(localStorage.getItem('satuundangan_journey_collapsed')).toBe('true')

    // Click again to expand
    await toggleBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(stepCardsContainer.attributes('style') || '').not.toContain('display: none')
    expect(localStorage.getItem('satuundangan_journey_collapsed')).toBe('false')
  })

  it('7. Honors saved collapsed preference from localStorage', async () => {
    localStorage.setItem('satuundangan_journey_collapsed', 'true')

    const wrapper = mount(JourneyChecklistWidget, {
      props: {
        invitations: [],
        stats: { guests: 0 },
      },
      global: {
        plugins: [router],
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-test="steps-grid"]').attributes('style') || '').toContain('display: none')
  })
})
