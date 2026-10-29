import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AdminArticles from '@/views/admin/AdminArticles.vue'

const api = vi.hoisted(() => ({
  fetchAdminArticles: vi.fn(),
  fetchAdminArticleBotStatus: vi.fn(),
  deleteAdminArticle: vi.fn(),
  autoGenerateAdminArticle: vi.fn(),
}))
vi.mock('@/api/admin.js', () => api)
vi.mock('@/components/admin/AdminShell.vue', () => ({
  default: { template: '<main><slot /></main>' },
}))
vi.mock('sweetalert2', () => ({ default: { fire: vi.fn() } }))

const status = {
  autoBlogEnabled: true,
  geminiConfigured: true,
  scheduleTime: '08:00 WIB (Setiap Hari)',
  curatedKeywordsRemaining: 48,
  curatedKeywordsTotal: 100,
  historyAvailable: true,
  lastAttemptAt: null,
  lastSuccessAt: null,
  lastError: null,
  runState: 'unknown',
}
const shell = { template: '<main><slot /></main>' }
let wrapper
const render = () =>
  mount(AdminArticles, {
    global: { stubs: { AdminShell: shell }, mocks: { $router: { push: vi.fn() } } },
  })

describe('AdminArticles truthful operational information', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.fetchAdminArticles.mockResolvedValue({
      items: [{ id: 1, title: 'Panduan Nikah', status: 'draft' }],
      total: 21,
      statusCounts: { all: 40, published: 19, draft: 21 },
    })
    api.fetchAdminArticleBotStatus.mockResolvedValue(status)
  })
  afterEach(() => wrapper?.unmount())

  it('renders server aggregate tab counts instead of current page counts', async () => {
    wrapper = render()
    await flushPromises()
    const tabs = wrapper
      .findAll('button')
      .filter((button) => /^(Semua|Published|Draft)/.test(button.text()))
    expect(tabs.map((button) => button.text().replace(/\s+/g, ' '))).toEqual([
      'Semua 40',
      'Published 19',
      'Draft 21',
    ])
    await tabs[2].trigger('click')
    await flushPromises()
    expect(api.fetchAdminArticles).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 1, filters: JSON.stringify({ status: 'draft' }) }),
    )
    expect(wrapper.text()).toContain('Published 19')
    expect(wrapper.text()).toContain('Kelengkapan SEO')
  })

  it('distinguishes a configured schedule from an observed successful run', async () => {
    wrapper = render()
    await flushPromises()
    expect(wrapper.text()).toContain('Jadwal aktif')
    expect(wrapper.text()).toContain('Belum ada catatan eksekusi')
    expect(wrapper.text()).toContain('48 dari 100')
    expect(wrapper.text()).not.toContain('AKTIF 08:00 WIB')
  })

  it('shows bot API failures and lets admin retry without claiming active', async () => {
    api.fetchAdminArticleBotStatus.mockRejectedValueOnce(new Error('Provider unavailable'))
    wrapper = render()
    await flushPromises()
    expect(wrapper.text()).toContain('Status bot belum dapat dimuat')
    expect(wrapper.text()).not.toContain('Jadwal aktif')
    await wrapper
      .findAll('button')
      .find((button) => button.text() === 'Coba lagi status bot')
      .trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Jadwal aktif')
  })

  it('keeps list errors separate from an empty dataset and supports retry', async () => {
    api.fetchAdminArticles.mockRejectedValueOnce(new Error('List unavailable'))
    wrapper = render()
    await flushPromises()
    expect(wrapper.text()).toContain('Data artikel gagal dimuat')
    expect(wrapper.text()).not.toContain('Belum ada artikel.')
    await wrapper
      .findAll('button')
      .find((button) => button.text() === 'Coba lagi artikel')
      .trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Panduan Nikah')
  })

  it('does not let an earlier response overwrite a newer status filter', async () => {
    let finishFirst
    api.fetchAdminArticles.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishFirst = resolve
        }),
    )
    wrapper = render()
    await flushPromises()
    await wrapper
      .findAll('button')
      .find((button) => button.text().startsWith('Draft'))
      .trigger('click')
    await flushPromises()
    finishFirst({
      items: [{ id: 2, title: 'Stale response', status: 'published' }],
      total: 1,
      statusCounts: { all: 1, published: 1, draft: 0 },
    })
    await flushPromises()
    expect(wrapper.text()).toContain('Panduan Nikah')
    expect(wrapper.text()).not.toContain('Stale response')
  })
})
