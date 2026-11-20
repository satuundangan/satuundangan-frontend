import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import SidebarDashboard from './SidebarDashboard.vue'

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    user: { name: 'Muhammad Fauzan', email: 'fauzan@satuundangan.com' },
    logout: vi.fn(),
  }),
}))

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn().mockResolvedValue({ isConfirmed: false }),
  },
}))

describe('SidebarDashboard.vue', () => {
  let router
  let originalInnerWidth

  beforeEach(async () => {
    originalInnerWidth = window.innerWidth
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/dashboard', component: { template: '<div>Dashboard</div>' } },
        { path: '/invitations', component: { template: '<div>Invitations</div>' } },
        { path: '/planner', component: { template: '<div>Planner</div>' } },
        { path: '/guests', component: { template: '<div>Guests</div>' } },
        { path: '/guestbook', component: { template: '<div>Guestbook</div>' } },
        { path: '/templates', component: { template: '<div>Templates</div>' } },
        { path: '/settings', component: { template: '<div>Settings</div>' } },
      ],
    })
    router.push('/dashboard')
    await router.isReady()
  })

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    })
  })

  function setWindowWidth(width) {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    })
  }

  function createWrapper(props = {}) {
    return mount(SidebarDashboard, {
      props: {
        isOpen: true,
        ...props,
      },
      global: {
        plugins: [router],
      },
    })
  }

  it('1. Does NOT emit "close" when navigating on desktop (width >= 768px)', async () => {
    setWindowWidth(1024)
    const wrapper = createWrapper({ isOpen: true })

    const navLinks = wrapper.findAll('nav a')
    expect(navLinks.length).toBeGreaterThan(0)

    // Click primary menu item (e.g. Undangan Saya)
    await navLinks[1].trigger('click')

    expect(wrapper.emitted('close')).toBeFalsy()

    // Click secondary menu item (Pengaturan Akun)
    const settingsLink = navLinks[navLinks.length - 1]
    await settingsLink.trigger('click')

    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('2. Emits "close" when navigating on mobile (width < 768px)', async () => {
    setWindowWidth(375)
    const wrapper = createWrapper({ isOpen: true })

    const navLinks = wrapper.findAll('nav a')
    expect(navLinks.length).toBeGreaterThan(0)

    // Click primary menu item
    await navLinks[1].trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close').length).toBe(1)

    // Click secondary menu item
    const settingsLink = navLinks[navLinks.length - 1]
    await settingsLink.trigger('click')

    expect(wrapper.emitted('close').length).toBe(2)
  })

  it('3. Emits "close" when mobile backdrop overlay is clicked', async () => {
    setWindowWidth(375)
    const wrapper = createWrapper({ isOpen: true })

    // Find backdrop overlay
    const backdrop = wrapper.find('.fixed.inset-0')
    expect(backdrop.exists()).toBe(true)

    await backdrop.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close').length).toBe(1)
  })

  it('4. Emits "close" when mobile X close button is clicked', async () => {
    setWindowWidth(375)
    const wrapper = createWrapper({ isOpen: true })

    // Find the mobile close button with fa-xmark
    const closeBtn = wrapper.find('button.md\\:hidden')
    expect(closeBtn.exists()).toBe(true)
    expect(closeBtn.find('.fa-xmark').exists()).toBe(true)

    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close').length).toBe(1)
  })

  it('5. Renders proper open / closed classes based on isOpen prop', async () => {
    const openWrapper = createWrapper({ isOpen: true })
    const asideOpen = openWrapper.find('aside')
    expect(asideOpen.classes()).toContain('translate-x-0')
    expect(openWrapper.find('.fixed.inset-0').exists()).toBe(true)

    const closedWrapper = createWrapper({ isOpen: false })
    const asideClosed = closedWrapper.find('aside')
    expect(asideClosed.classes()).toContain('-translate-x-full')
    expect(closedWrapper.find('.fixed.inset-0').exists()).toBe(false)
  })

  it('6. Displays user profile information correctly', () => {
    const wrapper = createWrapper({ isOpen: true })

    expect(wrapper.text()).toContain('Muhammad Fauzan')
    expect(wrapper.text()).toContain('fauzan@satuundangan.com')
    expect(wrapper.text()).toContain('M') // User initial
  })
})
