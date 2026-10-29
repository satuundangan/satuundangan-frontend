import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ArticleEditorialPanel from '@/components/admin/ArticleEditorialPanel.vue'

const api = vi.hoisted(() => ({ overview: vi.fn(), performance: vi.fn() }))
vi.mock('@/api/articleEditorial.js', () => ({ fetchEditorialOverview: api.overview, fetchArticlePerformance: api.performance }))

const overview = {
  execution: { overdueCount: 1, note: '1 artikel melewati jadwal dan belum terbit.', lastRuns: [{ at: '2026-10-29T02:00:00Z', ok: false, details: { message: 'x' } }] },
  calendar: { scheduled: [{ id: 2, title: 'Terlewat', scheduledPublishAt: '2026-10-28T01:00:00Z', overdue: true }, { id: 1, title: 'Besok', scheduledPublishAt: '2026-10-30T01:00:00Z', overdue: false }], recentlyPublished: [] },
  attention: { thresholds: { stalePublishedDays: 180, staleDraftDays: 30 }, stalePublished: [{ id: 4, title: 'Lama', ageDays: 300 }], staleDrafts: [{ id: 5, title: 'Draf basi', ageDays: 58 }] },
}

beforeEach(() => {
  vi.clearAllMocks()
  api.overview.mockResolvedValue(overview)
  api.performance.mockResolvedValue({
    sources: { ga4: { status: 'not_connected', missingConfiguration: ['GA4_PRIVATE_KEY'] }, searchConsole: { status: 'not_connected', missingConfiguration: ['GSC_SITE_URL'] } },
    items: [{ id: 1, title: 'Tips A', reader: null, conversion: null, search: null }],
    definitions: { search: 'Tanpa koneksi, kolom ditampilkan kosong, bukan nol.' },
  })
})

const open = async (wrapper) => {
  // jsdom fires the native toggle event itself when `open` changes, as a browser does.
  wrapper.get('details').element.open = true
  await new Promise((resolve) => setTimeout(resolve, 0))
  await flushPromises()
}
let wrapperRef
afterEach(() => wrapperRef?.unmount())
const mountPanel = () => (wrapperRef = mount(ArticleEditorialPanel, { attachTo: document.body, global: { stubs: { RouterLink: RouterLinkStub } } }))

describe('article editorial panel', () => {
  it('does not fetch anything until it is opened', async () => {
    mountPanel()
    await flushPromises()
    expect(api.overview).not.toHaveBeenCalled()
  })

  it('shows the schedule, flags overdue items and surfaces stale content from one list', async () => {
    const wrapper = mountPanel()
    await open(wrapper)
    expect(wrapper.get('[data-testid="overdue-note"]').text()).toContain('melewati jadwal')
    expect(wrapper.get('[data-testid="scheduled-list"]').text()).toContain('Melewati jadwal')
    expect(wrapper.get('[data-testid="scheduled-list"]').text()).toContain('WIB')
    const stale = wrapper.get('[data-testid="stale-list"]')
    expect(stale.text()).toContain('Lama')
    expect(stale.text()).toContain('300 hari')
    expect(stale.text()).toContain('Draf basi')
    expect(stale.findAllComponents(RouterLinkStub)[0].props('to')).toBe('/admin/articles/4/edit')
  })

  it('shows unconnected analytics sources as empty dashes, never zeros', async () => {
    const wrapper = mountPanel()
    await open(wrapper)
    await wrapper.findAll('[role="tab"]')[1].trigger('click')
    await flushPromises()
    expect(wrapper.get('[data-testid="sources"]').text()).toContain('GA4_PRIVATE_KEY')
    expect(wrapper.get('[data-testid="sources"]').text()).toContain('GSC_SITE_URL')
    const row = wrapper.get('[data-testid="performance-rows"] tr')
    expect(row.text()).toContain('—')
    expect(row.text()).not.toMatch(/\b0\b/)
  })

  it('keeps a failing load visible with retry', async () => {
    api.overview.mockRejectedValueOnce(new Error('Gagal memuat'))
    const wrapper = mountPanel()
    await open(wrapper)
    expect(wrapper.get('#ed-panel-calendar [role="alert"]').text()).toContain('Gagal memuat')
    await wrapper.get('#ed-panel-calendar [role="alert"] button').trigger('click')
    await flushPromises()
    expect(wrapper.find('#ed-panel-calendar [role="alert"]').exists()).toBe(false)
  })
})
