import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AdminArticleEditor from '@/views/admin/AdminArticleEditor.vue'
import { saveArticleDraft } from '@/utils/articleDrafts.js'

const mocks = vi.hoisted(() => ({
  article: { id: 1, title: 'Judul server', slug: 'judul-server', content: '<p>Isi server</p>', editVersion: 4, status: 'draft', updatedAt: '2026-10-29T01:00:00Z', sourceUrls: [] },
  fetch: vi.fn(), update: vi.fn(), create: vi.fn(), push: vi.fn(), fire: vi.fn(), leave: null, routeUpdate: null,
  revisions: vi.fn(), revision: vi.fn(), restore: vi.fn(), check: vi.fn(),
}))
vi.mock('@/api/admin.js', () => ({ fetchAdminArticle: mocks.fetch, updateAdminArticle: mocks.update, createAdminArticle: mocks.create }))
vi.mock('@/api/articleEditorial.js', () => ({ fetchArticleRevisions: mocks.revisions, fetchArticleRevision: mocks.revision, restoreArticleRevision: mocks.restore, checkArticleLinks: mocks.check }))
vi.mock('@/components/admin/AdminShell.vue', () => ({ default: { template: '<main><slot /></main>' } }))
vi.mock('@/stores/auth.js', () => ({ useAuthStore: () => ({ user: { id: 1 } }) }))
vi.mock('sweetalert2', () => ({ default: { fire: mocks.fire } }))
vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '1' } }), useRouter: () => ({ push: mocks.push }),
  onBeforeRouteLeave: (guard) => { mocks.leave = guard }, onBeforeRouteUpdate: (guard) => { mocks.routeUpdate = guard },
}))
vi.mock('@tiptap/vue-3', async () => {
  const { ref } = await import('vue')
  return { EditorContent: { template: '<div>Editor</div>' }, useEditor: () => ref({ commands: { setContent: vi.fn() }, storage: { characterCount: { characters: () => 10, words: () => 2 } }, isActive: () => false, getHTML: () => '<p>Isi server</p>', destroy: vi.fn() }) }
})

let wrapper
const render = () => mount(AdminArticleEditor)
describe('article editing safeguards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    mocks.fetch.mockResolvedValue({ ...mocks.article })
    mocks.update.mockResolvedValue({ ...mocks.article, editVersion: 5 })
    mocks.fire.mockResolvedValue({ isConfirmed: false })
    mocks.revisions.mockResolvedValue({ items: [], retainedLimit: 10 })
  })
  afterEach(() => { wrapper?.unmount(); vi.useRealTimers() })

  it('offers a user-scoped local draft without overwriting server content silently', async () => {
    saveArticleDraft(localStorage, { userId: 1, articleId: 1, serverVersion: 3, data: { title: 'Draft perangkat' } })
    wrapper = render()
    await flushPromises()
    expect(wrapper.find('input[placeholder="Judul Artikel..."]').element.value).toBe('Judul server')
    expect(wrapper.text()).toContain('Ada draft di perangkat ini')
    expect(wrapper.text()).toContain('Versi server sudah berubah')
    await wrapper.findAll('button').find((button) => button.text() === 'Pulihkan draft perangkat').trigger('click')
    expect(wrapper.find('input[placeholder="Judul Artikel..."]').element.value).toBe('Draft perangkat')
  })

  it('persists a changed title locally and guards unsaved server changes', async () => {
    vi.useFakeTimers()
    wrapper = render()
    await flushPromises()
    await wrapper.find('input[placeholder="Judul Artikel..."]').setValue('Judul belum disimpan')
    await vi.advanceTimersByTimeAsync(800)
    expect(wrapper.text()).toContain('Tersimpan di perangkat')
    expect(localStorage.getItem('admin-article-draft:v1:1:1')).toContain('Judul belum disimpan')
    expect(await mocks.leave()).toBe(false)
    expect(mocks.fire).toHaveBeenCalledWith(expect.objectContaining({ title: 'Keluar dari editor?' }))
  })

  it('sends a UTC schedule and current edit version to the server', async () => {
    wrapper = render()
    await flushPromises()
    await wrapper.find('input[type="datetime-local"]').setValue('2099-10-30T08:00')
    await wrapper.findAll('button').find((button) => button.text() === 'Jadwalkan terbit').trigger('click')
    await flushPromises()
    expect(mocks.update).toHaveBeenCalledWith('1', expect.objectContaining({ status: 'scheduled', scheduledPublishAt: '2099-10-30T01:00:00.000Z', expectedVersion: 4 }))
  })

  it('previews the article in a script-less sandboxed frame and returns focus on close', async () => {
    mocks.fetch.mockResolvedValue({ ...mocks.article, title: 'Judul <script>alert(1)</script>', content: '<p>Isi server</p>' })
    wrapper = mount(AdminArticleEditor, { attachTo: document.body })
    await flushPromises()
    const opener = wrapper.findAll('button').find((b) => b.text() === 'Pratinjau')
    await opener.trigger('click')
    await flushPromises()
    const dialog = wrapper.get('[role="dialog"]')
    const frame = dialog.get('iframe')
    expect(frame.attributes('sandbox')).toBe('')
    expect(frame.attributes('srcdoc')).toContain('Isi server')
    expect(frame.attributes('srcdoc')).not.toContain('<script>alert(1)</script>')
    expect(frame.attributes('srcdoc')).toContain('&lt;script&gt;')
    await dialog.findAll('button').find((b) => b.text() === 'Tutup').trigger('click')
    await flushPromises()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('checks links on the saved version and lists only problems', async () => {
    mocks.check.mockResolvedValue({
      checked: 3, broken: 1, notChecked: 1, note: 'Pengecekan sekali jalan dari server.',
      results: [
        { url: 'https://ok.test/', kind: 'tautan', status: 'ok', httpStatus: 200, note: null },
        { url: 'https://gone.test/', kind: 'gambar', status: 'rusak', httpStatus: 404, note: 'Tidak ditemukan' },
        { url: 'https://shy.test/', kind: 'tautan', status: 'tidak_dicek', httpStatus: 403, note: 'Server menolak pengecekan otomatis' },
      ],
    })
    wrapper = render()
    await flushPromises()
    await wrapper.findAll('button').find((b) => b.text() === 'Cek tautan & gambar').trigger('click')
    await flushPromises()
    expect(mocks.check).toHaveBeenCalledWith('1')
    const box = wrapper.get('[data-testid="link-check"]')
    expect(box.text()).toContain('3 tautan dicek: 1 rusak, 1 tidak dapat dicek')
    expect(box.text()).toContain('https://gone.test/')
    expect(box.text()).not.toContain('https://ok.test/')
  })

  it('shows a persistent error when the link check cannot run', async () => {
    mocks.check.mockRejectedValue(new Error('Server sibuk'))
    wrapper = render()
    await flushPromises()
    await wrapper.findAll('button').find((b) => b.text() === 'Cek tautan & gambar').trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Server sibuk')
  })
})
