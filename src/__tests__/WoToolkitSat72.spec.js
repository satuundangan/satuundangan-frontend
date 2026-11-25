import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { reactive } from 'vue'
import PublicWoRundownView from '@/views/PublicWoRundownView.vue'
import * as plannerApi from '@/api/weddingPlanner'

const mockRoute = reactive({ params: { token: 'wo-token-123' } })

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
}))

vi.mock('@/api/weddingPlanner', () => ({
  getWeddingPlanner: vi.fn(),
  unlockWeddingPlanner: vi.fn(),
  updateWeddingPlanner: vi.fn(),
  resetWeddingPlanner: vi.fn(),
  createRundownShareLink: vi.fn(),
  getPublicWoRundown: vi.fn(),
}))

describe('WO Technical Rundown Share (SAT-72)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRoute.params.token = 'wo-token-123'
  })

  it('renders public technical rundown and vendor PIC contacts without financial fields', async () => {
    plannerApi.getPublicWoRundown.mockResolvedValueOnce({
      weddingDate: '2026-12-20',
      weddingConcept: 'Adat Jawa Modern',
      estimatedGuests: 300,
      rundown: [
        {
          id: 'r1',
          time: '05:00',
          activity: 'MUA Standby',
          location: 'Bridal Suite',
          pic: 'WO Sari',
          notes: 'Siapkan sarapan pengantin',
        },
      ],
      vendors: [
        {
          id: 'v1',
          category: 'MUA',
          name: 'Studio Cantik',
          picName: 'Mbak Rina',
          phoneNumber: '08123456789',
          notes: 'Datang pukul 04:45',
        },
      ],
    })

    const wrapper = mount(PublicWoRundownView)
    await flushPromises()

    expect(plannerApi.getPublicWoRundown).toHaveBeenCalledWith('wo-token-123')
    expect(wrapper.text()).toContain('Adat Jawa Modern')
    expect(wrapper.text()).toContain('300 Orang')
    expect(wrapper.text()).toContain('05:00')
    expect(wrapper.text()).toContain('MUA Standby')
    expect(wrapper.text()).toContain('WO Sari')
    expect(wrapper.text()).toContain('Studio Cantik')
    expect(wrapper.text()).toContain('Mbak Rina')
    expect(wrapper.text()).toContain('08123456789')
  })
})
