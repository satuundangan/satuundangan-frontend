import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatCard from './StatCard.vue'
import { createRouter, createWebHistory } from 'vue-router'

describe('StatCard.vue (SAT-50)', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: { template: '<div>Home</div>' } },
      { path: '/invitations', component: { template: '<div>Invitations</div>' } },
      { path: '/guests', component: { template: '<div>Guests</div>' } },
      { path: '/guestbook', component: { template: '<div>Guestbook</div>' } },
    ],
  })

  it('1. Renders static non-clickable card when "to" is omitted', () => {
    const wrapper = mount(StatCard, {
      props: {
        label: 'Total Penjualan',
        value: 12,
        iconClass: 'fa-solid fa-chart-line',
        color: 'bg-indigo-50 text-indigo-600',
      },
    })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.classes()).toContain('cursor-default')
    expect(wrapper.text()).toContain('Total Penjualan')
    expect(wrapper.text()).toContain('12')
    // No chevron or "Lihat" indicator
    expect(wrapper.find('.fa-chevron-right').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Lihat')
  })

  it('2. Renders interactive router-link with pointer and chevron when "to" prop is passed', () => {
    const wrapper = mount(StatCard, {
      props: {
        label: 'Ucapan Masuk',
        value: 8,
        iconClass: 'fa-solid fa-comments',
        color: 'bg-amber-50 text-amber-600',
        to: '/guestbook',
      },
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/guestbook')
    expect(wrapper.classes()).toContain('cursor-pointer')
    expect(wrapper.find('.fa-chevron-right').exists()).toBe(true)
    expect(wrapper.text()).toContain('Lihat')
  })

  it('3. Renders quick links for all 4 primary dashboard statistics (SAT-50)', () => {
    const statCardsData = [
      { label: 'Total Undangan', value: 3, to: '/invitations' },
      { label: 'Tamu Terundang', value: 150, to: '/guests' },
      { label: 'Konfirmasi Hadir', value: 95, to: '/guests?filter=hadir' },
      { label: 'Ucapan Masuk', value: 42, to: '/guestbook' },
    ]

    for (const data of statCardsData) {
      const wrapper = mount(StatCard, {
        props: {
          label: data.label,
          value: data.value,
          to: data.to,
        },
        global: {
          plugins: [router],
        },
      })

      expect(wrapper.element.tagName).toBe('A')
      expect(wrapper.attributes('href')).toBe(data.to)
      expect(wrapper.text()).toContain(data.label)
      expect(wrapper.text()).toContain(String(data.value))
    }
  })
})
