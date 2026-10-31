import { mount, flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AdminLeadsSupport, {
  maskPhoneNumber,
  maskEmailAddress,
  isUrgentWedding,
} from '@/views/admin/AdminLeadsSupport.vue'

const leadApi = vi.hoisted(() => ({
  getLeads: vi.fn(),
  getLead: vi.fn(),
  updateLead: vi.fn(),
  deleteLead: vi.fn(),
  createPublicLead: vi.fn(),
}))

const ticketApi = vi.hoisted(() => ({
  getSupportTickets: vi.fn(),
  getSupportTicketMetrics: vi.fn(),
  getSupportTicket: vi.fn(),
  updateSupportTicket: vi.fn(),
  createSupportTicket: vi.fn(),
}))

const guestApi = vi.hoisted(() => ({
  getGuestDrilldown: vi.fn(),
  getAdminGuestMessages: vi.fn(),
  moderateGuestMessage: vi.fn(),
  deleteAdminGuestMessage: vi.fn(),
}))

const aiApi = vi.hoisted(() => ({
  getAiCreditStats: vi.fn(),
  getAiCreditLogs: vi.fn(),
}))

vi.mock('@/api/lead.js', () => leadApi)
vi.mock('@/api/supportTicket.js', () => ticketApi)
vi.mock('@/api/guestModeration.js', () => guestApi)
vi.mock('@/api/aiCredits.js', () => aiApi)

vi.mock('vue-toastification', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }),
}))

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn().mockResolvedValue({ isConfirmed: true }),
  },
}))

describe('AdminLeadsSupport.vue (SAT-35)', () => {
  const dummyLeads = [
    {
      id: 1,
      name: 'Rina & Budi',
      phone: '08123456789',
      email: 'fauzan14072004@gmail.com',
      weddingDate: '2026-11-03',
      budget: 25000000,
      guestCount: 300,
      source: 'budget_calculator',
      stage: 'new',
      ownerPic: 'Sarah CS',
      dueDate: '2026-11-01',
      notes: [{ author: 'System', text: 'Lead baru.', createdAt: '2026-10-30T10:00:00.000Z' }],
    },
    {
      id: 2,
      name: 'Kevin & Jessica',
      phone: '08561122334',
      email: 'kevin.j@yahoo.com',
      weddingDate: '2026-12-12',
      budget: 45000000,
      guestCount: 500,
      source: 'custom_theme',
      stage: 'qualified',
      ownerPic: 'Budi Sales',
      dueDate: '2026-11-05',
      notes: [],
    },
  ]

  const dummyTickets = [
    {
      id: 1,
      ticketNumber: 'TKT-1082',
      subject: 'Revisi Nama Orang Tua di Undangan',
      category: 'invitation',
      priority: 'urgent',
      status: 'open',
      customerName: 'Rina Kartika',
      customerEmail: 'rina.k@gmail.com',
      customerPhone: '08123456789',
      weddingDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
      assignedPic: 'Fauzan CS',
      messages: [{ sender: 'Rina Kartika', text: 'Typo nama orang tua', isStaff: false, createdAt: '2026-10-30T10:00:00Z' }],
    },
  ]

  const dummyTicketMetrics = {
    avgFirstResponseMinutes: 12,
    avgResolutionHours: 3.5,
    backlogCount: 2,
    urgentCount: 1,
  }

  const dummyGuestDrilldown = {
    totalGuests: 250,
    sentInvitations: 210,
    openedInvitations: 185,
    attendingRsvp: 145,
    totalPax: 290,
    guestbookCount: 68,
  }

  const dummyGuestMessages = [
    {
      id: 1,
      senderName: 'Tante Mirna & Om Joko',
      message: 'Selamat menempuh hidup baru!',
      rsvpStatus: 'attending',
      pax: 2,
      status: 'published',
      createdAt: '2026-10-30T09:00:00Z',
    },
    {
      id: 2,
      senderName: 'Spam Bot',
      message: 'Dapatkan pinjaman online cepat',
      rsvpStatus: 'not_attending',
      pax: 0,
      status: 'flagged_spam',
      createdAt: '2026-10-30T08:00:00Z',
    },
  ]

  const dummyAiStats = {
    totalPurchased: 5000,
    totalUsed: 3650,
    balance: 1350,
    totalRequests: 2450,
    failedRequests: 18,
    estimatedCostIdr: 128500,
  }

  const dummyAiLogs = [
    {
      id: 1,
      userId: 42,
      userName: 'Rina Kartika',
      action: 'deduct',
      feature: 'Nova Assistant - Wedding Theme Generator',
      creditDelta: -1,
      balanceAfter: 19,
      model: 'deepseek-chat',
      promptTokens: 350,
      completionTokens: 180,
      totalTokens: 530,
      estimatedCostIdr: 45,
      status: 'success',
      createdAt: '2026-10-30T11:20:00Z',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    leadApi.getLeads.mockResolvedValue(dummyLeads)
    ticketApi.getSupportTickets.mockResolvedValue(dummyTickets)
    ticketApi.getSupportTicketMetrics.mockResolvedValue(dummyTicketMetrics)
    guestApi.getGuestDrilldown.mockResolvedValue(dummyGuestDrilldown)
    guestApi.getAdminGuestMessages.mockResolvedValue(dummyGuestMessages)
    aiApi.getAiCreditStats.mockResolvedValue(dummyAiStats)
    aiApi.getAiCreditLogs.mockResolvedValue(dummyAiLogs)
  })

  const mountComponent = () => {
    return mount(AdminLeadsSupport, {
      global: {
        stubs: {
          AdminShell: {
            template: '<div class="admin-shell-stub"><slot name="actions" /><slot /></div>',
          },
        },
      },
    })
  }

  it('verifies utility functions: masking and urgency check', () => {
    expect(maskPhoneNumber('08123456789')).toBe('0812****789')
    expect(maskEmailAddress('fauzan14072004@gmail.com')).toBe('fau***@gmail.com')

    const closeDate = new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString()
    const farDate = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString()
    expect(isUrgentWedding(closeDate)).toBe(true)
    expect(isUrgentWedding(farDate)).toBe(false)
  })

  it('renders all 4 tabs (Inbox Prospek, Antrean Bantuan, Drilldown Tamu, Ledger Kredit AI)', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    expect(wrapper.find('[data-testid="tab-btn-leads"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="tab-btn-tickets"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="tab-btn-guest_moderation"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="tab-btn-ai_credits"]').exists()).toBe(true)

    expect(wrapper.text()).toContain('Inbox Prospek')
    expect(wrapper.text()).toContain('Antrean Bantuan')
    expect(wrapper.text()).toContain('Drilldown Tamu & Moderasi')
    expect(wrapper.text()).toContain('Ledger Kredit AI')
  })

  it('renders Leads tab with table and supports privacy masking toggle', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    // Panel leads should be visible
    expect(wrapper.find('[data-testid="panel-leads"]').isVisible()).toBe(true)

    // Check summary metrics
    expect(wrapper.find('[data-testid="metric-total-leads"]').text()).toBe('2')
    expect(wrapper.find('[data-testid="metric-new-leads"]').text()).toBe('1')
    expect(wrapper.find('[data-testid="metric-qualified-leads"]').text()).toBe('1')

    // Initial state: Masking is active (shows 0812****789 and fau***@gmail.com)
    expect(wrapper.text()).toContain('0812****789')
    expect(wrapper.text()).toContain('fau***@gmail.com')
    expect(wrapper.text()).not.toContain('08123456789')

    // Click privacy toggle button
    const toggleBtn = wrapper.get('[data-testid="privacy-toggle"]')
    expect(toggleBtn.text()).toContain('Masking Privasi: Aktif')
    await toggleBtn.trigger('click')
    await flushPromises()

    // Masking is now disabled: Full phone and email should be visible
    expect(toggleBtn.text()).toContain('Masking Privasi: Nonaktif')
    expect(wrapper.text()).toContain('08123456789')
    expect(wrapper.text()).toContain('fauzan14072004@gmail.com')
  })

  it('renders Support Tickets tab with SLA notice banner and urgent badge', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    // Switch to tickets tab
    await wrapper.get('[data-testid="tab-btn-tickets"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="panel-tickets"]').isVisible()).toBe(true)

    // Operational CS SLA Notice banner text
    const slaNotice = wrapper.get('[data-testid="sla-notice-text"]')
    expect(slaNotice.text()).toContain('Jam Operasional CS: 08:00 - 21:00 WIB • SLA Respon Pertama < 15 Menit')

    // Support metrics row
    expect(wrapper.find('[data-testid="metric-first-response"]').text()).toContain('12 Menit')
    expect(wrapper.find('[data-testid="metric-resolution-time"]').text()).toContain('3.5 Jam')
    expect(wrapper.find('[data-testid="metric-backlog-count"]').text()).toContain('2 Tiket')
    expect(wrapper.find('[data-testid="metric-urgent-count"]').text()).toContain('1 Tiket')

    // Urgent badge on wedding date < 7 days
    const urgentBadge = wrapper.find('[data-testid="urgent-badge"]')
    expect(urgentBadge.exists()).toBe(true)
    expect(urgentBadge.text()).toContain('< 7 Hari')

    // Urgent highlight banner
    const urgentBanner = wrapper.find('[data-testid="urgent-tickets-banner"]')
    expect(urgentBanner.exists()).toBe(true)
    expect(urgentBanner.text()).toContain('Mendekati Hari H (< 7 Hari ke Acara)')
  })

  it('renders Tamu Drilldown tab with KPI metrics and moderates guest messages', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    // Switch to guest moderation tab
    await wrapper.get('[data-testid="tab-btn-guest_moderation"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="panel-guest_moderation"]').isVisible()).toBe(true)

    // KPI cards
    expect(wrapper.find('[data-testid="metric-total-guests"]').text()).toBe('250')
    expect(wrapper.find('[data-testid="metric-sent-invitations"]').text()).toBe('210')
    expect(wrapper.find('[data-testid="metric-opened-invitations"]').text()).toBe('185')
    expect(wrapper.find('[data-testid="metric-rsvp-attending"]').text()).toBe('145')
    expect(wrapper.find('[data-testid="metric-total-pax"]').text()).toBe('290')
    expect(wrapper.find('[data-testid="metric-total-wishes"]').text()).toBe('68')

    // Progress rates
    expect(wrapper.find('[data-testid="rate-opened"]').text()).toContain('%')
    expect(wrapper.find('[data-testid="rate-attendance"]').text()).toContain('%')

    // Message row and moderation actions
    expect(wrapper.find('[data-testid="guest-msg-row-1"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Tante Mirna & Om Joko')

    // Moderate message to hidden
    const hideBtn = wrapper.find('[data-testid="btn-hide-1"]')
    expect(hideBtn.exists()).toBe(true)
    await hideBtn.trigger('click')
    await flushPromises()

    expect(guestApi.moderateGuestMessage).toHaveBeenCalledWith(1, 'hidden')
  })

  it('renders AI Credit Ledger tab with KPI summary cards and transaction log table', async () => {
    const wrapper = mountComponent()
    await flushPromises()

    // Switch to AI credits tab
    await wrapper.get('[data-testid="tab-btn-ai_credits"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-testid="panel-ai_credits"]').isVisible()).toBe(true)

    // KPI cards
    expect(wrapper.find('[data-testid="metric-ai-purchased"]').text()).toBe('5000')
    expect(wrapper.find('[data-testid="metric-ai-used"]').text()).toBe('3650')
    expect(wrapper.find('[data-testid="metric-ai-balance"]').text()).toBe('1350')
    expect(wrapper.find('[data-testid="metric-ai-requests"]').text()).toBe('2450')

    // Transaction ledger table
    expect(wrapper.find('[data-testid="ai-ledger-table"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="ai-log-row-1"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Nova Assistant - Wedding Theme Generator')
    expect(wrapper.text()).toContain('deepseek-chat')
  })
})
