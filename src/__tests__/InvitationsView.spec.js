import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import InvitationsView from '@/views/dashboard/InvitationsView.vue'
import * as invitationApi from '@/api/invitation'

vi.mock('vue-toastification', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/composables/useDashboardSidebar', () => ({
  useDashboardSidebar: () => ({
    isSidebarOpen: { value: false },
    toggleSidebar: vi.fn(),
    closeSidebar: vi.fn(),
  }),
}))

const mockInvitationsData = [
  {
    id: 1,
    title: 'Pernikahan Rama & Shinta',
    slug: 'rama-shinta',
    groomName: 'Rama',
    brideName: 'Shinta',
    isPublished: true,
    package: 'pro',
    templateDesign: { name: 'Royal Garden', thumbnailUrl: 'https://cdn.example.com/thumb1.webp' },
  },
  {
    id: 2,
    title: 'The Wedding of Romeo & Juliet',
    slug: 'romeo-juliet',
    groomName: 'Romeo',
    brideName: 'Juliet',
    isPublished: false,
    paymentStatus: 'pending',
    latestOrderId: 'ORDER-22',
    package: 'premium',
    templateDesign: { name: 'Elegance Classic' },
  },
  {
    id: 3,
    title: 'Draft Syukuran',
    slug: 'draft-syukuran',
    groomName: 'Ali',
    brideName: 'Fatimah',
    isPublished: false,
    paymentStatus: 'unpaid',
    package: 'basic',
    templateDesign: { name: 'Minimalist' },
  },
]

describe('InvitationsView.vue UX Polish', () => {
  beforeEach(() => {
    vi.spyOn(invitationApi, 'getInvitations').mockResolvedValue(mockInvitationsData)
  })

  it('renders quick stat summary row with correct counts', async () => {
    const wrapper = mount(InvitationsView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
          Sidebar: { template: '<div class="sidebar-stub"></div>' },
          Topbar: { template: '<div class="topbar-stub"></div>' },
          BottomNav: { template: '<div class="bottomnav-stub"></div>' },
        },
      },
    })

    // Wait for fetchInvitations on mounted
    await new Promise((r) => setTimeout(r, 10))
    await wrapper.vm.$nextTick()

    const text = wrapper.text()
    expect(text).toContain('Total Undangan')
    expect(text).toContain('Undangan Aktif')
    expect(text).toContain('Menunggu Pembayaran / Draf')

    // 3 total, 1 active, 2 pending/draft
    expect(text).toContain('3')
    expect(text).toContain('1')
    expect(text).toContain('2')
  })

  it('filters invitations when typing into search input', async () => {
    const wrapper = mount(InvitationsView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
          Sidebar: { template: '<div class="sidebar-stub"></div>' },
          Topbar: { template: '<div class="topbar-stub"></div>' },
          BottomNav: { template: '<div class="bottomnav-stub"></div>' },
        },
      },
    })

    await new Promise((r) => setTimeout(r, 10))
    await wrapper.vm.$nextTick()

    const searchInput = wrapper.find('input[placeholder*="Cari judul"]')
    expect(searchInput.exists()).toBe(true)

    // Search by title "Romeo"
    await searchInput.setValue('Romeo')
    expect(wrapper.vm.filteredInvitations.length).toBe(1)
    expect(wrapper.vm.filteredInvitations[0].slug).toBe('romeo-juliet')

    // Search by slug "rama"
    await searchInput.setValue('rama-shinta')
    expect(wrapper.vm.filteredInvitations.length).toBe(1)
    expect(wrapper.vm.filteredInvitations[0].title).toBe('Pernikahan Rama & Shinta')

    // Search not found
    await searchInput.setValue('nonexistent-query-xyz')
    expect(wrapper.vm.filteredInvitations.length).toBe(0)
    expect(wrapper.text()).toContain('Tidak ada hasil yang cocok')

    // Clear search
    await wrapper.find('button[title="Reset pencarian"]').trigger('click')
    expect(wrapper.vm.filteredInvitations.length).toBe(3)
  })
})
