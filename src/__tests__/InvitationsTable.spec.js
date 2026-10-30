import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import InvitationsTable from '@/components/dashboard/InvitationsTable.vue'

vi.mock('vue-toastification', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}))

describe('InvitationsTable.vue (ADM-097)', () => {
  it('renders active status with package tier, expiry date, and receipt link for published invitations', () => {
    const mockInvitations = [
      {
        id: 1,
        title: 'Pernikahan Rina & Budi',
        slug: 'rina-budi',
        isPublished: true,
        package: 'premium',
        expiresAt: '2027-10-30T00:00:00Z',
        latestOrderId: 'INV-1-PAID',
        templateDesign: { name: 'Elegance Classic' },
      },
    ]

    const wrapper = mount(InvitationsTable, {
      props: { invitations: mockInvitations },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Pernikahan Rina & Budi')
    expect(wrapper.text()).toContain('PREMIUM · AKTIF')
    expect(wrapper.text()).toContain('Aktif s.d.')
    expect(wrapper.text()).toContain('2027')

    const links = wrapper.findAllComponents(RouterLinkStub)
    const receiptLink = links.find((l) => l.props().to.includes('INV-1-PAID'))
    expect(receiptLink).toBeDefined()
  })

  it('renders pending payment status and Lanjut Bayar button for unpaid invitation with pending order', () => {
    const mockInvitations = [
      {
        id: 2,
        title: 'Pernikahan Dimas & Sari',
        slug: 'dimas-sari',
        isPublished: false,
        package: 'basic',
        paymentStatus: 'pending',
        latestOrderId: 'INV-2-PENDING',
        templateDesign: { name: 'Minimalist' },
      },
    ]

    const wrapper = mount(InvitationsTable, {
      props: { invitations: mockInvitations },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).toContain('MENUNGGU PEMBAYARAN')
    expect(wrapper.text()).toContain('Lanjut Bayar')

    const links = wrapper.findAllComponents(RouterLinkStub)
    const payLink = links.find((l) => l.props().to.includes('INV-2-PENDING'))
    expect(payLink).toBeDefined()
  })

  it('renders Draft status and Publish button for unsaved/unpaid draft invitation', () => {
    const mockInvitations = [
      {
        id: 3,
        title: 'Draft Baru',
        slug: 'draft-baru',
        isPublished: false,
        package: 'basic',
        paymentStatus: 'unpaid',
        latestOrderId: null,
      },
    ]

    const wrapper = mount(InvitationsTable, {
      props: { invitations: mockInvitations },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).toContain('DRAFT (BELUM AKTIF)')
    expect(wrapper.text()).toContain('Publish')

    const links = wrapper.findAllComponents(RouterLinkStub)
    const publishLink = links.find((l) => l.props().to === '/checkout?slug=draft-baru')
    expect(publishLink).toBeDefined()
  })
})
