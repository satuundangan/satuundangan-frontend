import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import AdminShell from './AdminShell.vue'
import Swal from 'sweetalert2'

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({ user: { name: 'Admin', email: 'admin@example.com' }, logout: vi.fn() }),
}))
vi.mock('sweetalert2', () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: false }) },
}))

const wrappers = []
const mediaListeners = new Set()

async function renderShell(path = '/admin/invitations/42/edit', props = {}, slots = {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }],
  })
  await router.push(path)
  await router.isReady()
  const wrapper = mount(AdminShell, {
    attachTo: document.body,
    props: { title: 'Edit Undangan', showSearch: true, ...props },
    slots,
    global: { plugins: [router] },
  })
  wrappers.push(wrapper)
  return { wrapper, router }
}

async function openMenu(wrapper) {
  const trigger = wrapper.get('button[aria-controls="admin-mobile-navigation"]')
  trigger.element.focus()
  await trigger.trigger('click')
  await flushPromises()
  return trigger
}

beforeEach(() => {
  localStorage.clear()
  mediaListeners.clear()
  document.body.style.overflow = ''
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: false,
      addEventListener: (_type, callback) => mediaListeners.add(callback),
      removeEventListener: (_type, callback) => mediaListeners.delete(callback),
    })),
  )
})

afterEach(() => {
  wrappers.splice(0).forEach((wrapper) => wrapper.unmount())
  document.body.innerHTML = ''
  document.body.style.overflow = ''
  vi.unstubAllGlobals()
})

describe('AdminShell navigation', () => {
  it('makes page actions such as payment export reachable in the header', async () => {
    const { wrapper } = await renderShell(
      '/admin/payments',
      {},
      { actions: '<button>Ekspor CSV</button>' },
    )
    expect(wrapper.get('header').text()).toContain('Ekspor CSV')
  })

  it('hides what a restricted role cannot use but keeps pages every admin needs', async () => {
    const { filterNavigationGroups } = await import('@/utils/adminAccess')
    const { adminNavigationGroups } = await import('./AdminSidebar.vue')
    const labels = (access) =>
      filterNavigationGroups(adminNavigationGroups, access).flatMap((group) => group.items.map((item) => item.label))
    const content = labels({ adminRole: 'content', allowedResources: ['dashboard', 'articles', 'audio', 'template-designs', 'categories', 'sections', 'analytics'] })
    expect(content).toEqual(expect.arrayContaining(['Dashboard', 'Artikel & Blog', 'Keamanan Akun']))
    expect(content).not.toContain('Pembayaran & Transaksi')
    expect(content).not.toContain('Sistem & Audit')
    expect(content).not.toContain('Social Studio (IG)')
    expect(labels({ adminRole: 'superadmin', allowedResources: [] })).toHaveLength(22)
    // access that could not be loaded hides nothing; the server still enforces
    expect(labels(null)).toHaveLength(22)
  })

  it('opens all existing navigation on mobile independently of desktop collapse', async () => {
    localStorage.setItem('admin_sidebar_collapsed', 'true')
    const { wrapper } = await renderShell()
    const trigger = await openMenu(wrapper)
    const dialog = wrapper.get('[role="dialog"]')

    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(dialog.attributes('aria-modal')).toBe('true')
    expect(document.body.style.overflow).toBe('hidden')
    for (const label of [
      'Operasional',
      'Growth',
      'Konten',
      'Sistem',
      'Pembayaran & Transaksi',
      'Master Bank & E-wallet',
      'WhatsApp Bot',
      'Social Studio (IG)',
      'Activity & Error Logs',
      'Analytics & Funnel',
      'Sistem & Audit',
      'Keamanan Akun',
    ]) {
      expect(dialog.text()).toContain(label)
    }
    expect(dialog.findAll('nav[aria-label="Menu admin"] a')).toHaveLength(22)
    expect(localStorage.getItem('admin_sidebar_collapsed')).toBe('true')
  })

  it('contains keyboard focus and restores it and body scroll after Escape', async () => {
    document.body.style.overflow = 'auto'
    const { wrapper } = await renderShell()
    const trigger = await openMenu(wrapper)
    const dialog = wrapper.get('[role="dialog"]')
    const focusable = [...dialog.element.querySelectorAll('a[href], button:not([disabled])')]
    const first = focusable[0]
    const last = focusable.at(-1)

    expect(document.activeElement).toBe(first)
    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }),
    )
    expect(document.activeElement).toBe(last)
    last.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
    )
    expect(document.activeElement).toBe(first)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await flushPromises()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(document.activeElement).toBe(trigger.element)
    expect(document.body.style.overflow).toBe('auto')
  })

  it('closes from backdrop, navigation, and a transition to desktop width', async () => {
    const { wrapper, router } = await renderShell()
    await openMenu(wrapper)
    await wrapper.get('[data-testid="admin-navigation-backdrop"]').trigger('click')
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)

    await openMenu(wrapper)
    await router.push('/admin/articles/9/edit')
    await flushPromises()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)

    await openMenu(wrapper)
    mediaListeners.forEach((listener) => listener({ matches: true }))
    await flushPromises()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(document.activeElement).toBe(
      wrapper.get('nav[aria-label="Menu admin"] a[href="/admin/articles"]').element,
    )
  })

  it('marks nested article and invitation routes under the correct parent', async () => {
    const { wrapper, router } = await renderShell()
    expect(
      wrapper
        .get('nav[aria-label="Menu admin"] a[href="/admin/invitations"]')
        .attributes('aria-current'),
    ).toBe('page')
    expect(
      wrapper.get('nav[aria-label="Menu admin"] a[href="/admin"]').attributes('aria-current'),
    ).toBeUndefined()
    expect(wrapper.get('nav[aria-label="Breadcrumb"]').text()).toContain('Invitations')
    expect(wrapper.get('nav[aria-label="Breadcrumb"]').text()).toContain('Edit Undangan')

    await router.push('/admin/articles/9/edit')
    await wrapper.setProps({ title: 'Edit Artikel' })
    expect(
      wrapper
        .get('nav[aria-label="Menu admin"] a[href="/admin/articles"]')
        .attributes('aria-current'),
    ).toBe('page')
    expect(
      wrapper
        .get('nav[aria-label="Menu admin"] a[href="/admin/invitations"]')
        .attributes('aria-current'),
    ).toBeUndefined()
    expect(wrapper.get('nav[aria-label="Breadcrumb"]').text()).toContain('Edit Artikel')
  })

  it('releases focus listeners and restores scroll when unmounted while open', async () => {
    document.body.style.overflow = 'scroll'
    const { wrapper } = await renderShell()
    await openMenu(wrapper)
    wrapper.unmount()
    wrappers.splice(wrappers.indexOf(wrapper), 1)
    expect(document.body.style.overflow).toBe('scroll')
    expect(mediaListeners.size).toBe(0)
    const outside = document.createElement('button')
    document.body.append(outside)
    outside.focus()
    expect(document.activeElement).toBe(outside)
  })

  it('releases the drawer before a logout confirmation can manage focus', async () => {
    const { wrapper } = await renderShell()
    await openMenu(wrapper)
    await wrapper.get('[role="dialog"] button[aria-label="Keluar dari admin"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
    expect(document.body.style.overflow).toBe('')
    expect(Swal.fire).toHaveBeenCalled()
  })
})
