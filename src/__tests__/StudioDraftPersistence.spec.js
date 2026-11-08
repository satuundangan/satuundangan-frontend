import { flushPromises, mount } from '@vue/test-utils'
import { reactive, ref, nextTick } from 'vue'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import StudioView, { cleanForDraft } from '@/views/StudioView.vue'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
  getInvitationById: vi.fn(),
  createInvitation: vi.fn(),
  updateInvitation: vi.fn(),
  checkSubdomainAvailability: vi.fn(),
  getSections: vi.fn(),
  fetchPublicAudio: vi.fn(),
  trackAction: vi.fn(),
  uploadFileApi: vi.fn(),
}))

const routeState = reactive({
  params: {},
  query: {},
})

const authState = reactive({
  isAuthenticated: true,
  token: 'mock-token',
  user: { id: 1, name: 'Test User', email: 'test@example.com' },
})

vi.mock('vue-router', async (original) => ({
  ...(await original()),
  useRoute: () => routeState,
  useRouter: () => ({ push: mocks.push }),
  onBeforeRouteLeave: vi.fn(),
}))

vi.mock('vue-toastification', () => ({
  useToast: () => mocks.toast,
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => authState,
}))

vi.mock('@/api/invitation', () => ({
  getInvitationById: mocks.getInvitationById,
  createInvitation: mocks.createInvitation,
  updateInvitation: mocks.updateInvitation,
  checkSubdomainAvailability: mocks.checkSubdomainAvailability,
}))

vi.mock('@/api/master', () => ({
  getSections: mocks.getSections,
  fetchPublicAudio: mocks.fetchPublicAudio,
}))

vi.mock('@/api/file', () => ({
  uploadFileApi: mocks.uploadFileApi,
}))

vi.mock('@/api/analytics', () => ({
  analytics: {
    trackAction: mocks.trackAction,
    checkoutContext: vi.fn().mockResolvedValue({}),
  },
}))

describe('StudioDraftPersistence (SAT-43)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    routeState.params = {}
    routeState.query = {}
    authState.isAuthenticated = true

    mocks.getSections.mockResolvedValue([
      { key: 'cover', label: 'Cover' },
      { key: 'event', label: 'Event' },
    ])
    mocks.fetchPublicAudio.mockResolvedValue([])
    mocks.createInvitation.mockResolvedValue({ id: 101, slug: 'test-couple' })
  })

  describe('cleanForDraft helper', () => {
    it('cleans large base64 data URIs (> 2000 chars) to null', () => {
      const largeBase64 = 'data:image/png;base64,' + 'A'.repeat(2500)
      const input = {
        title: 'Wedding Putra & Putri',
        bridePhoto: largeBase64,
        nested: {
          photoCouple: largeBase64,
          normalText: 'halo',
        },
      }

      const result = cleanForDraft(input)

      expect(result.title).toBe('Wedding Putra & Putri')
      expect(result.bridePhoto).toBeNull()
      expect(result.nested.photoCouple).toBeNull()
      expect(result.nested.normalText).toBe('halo')
    })

    it('preserves small strings and URLs that do not exceed 2000 chars base64', () => {
      const smallDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      const normalUrl = 'https://example.com/photo.jpg'
      const input = {
        icon: smallDataUri,
        photoUrl: normalUrl,
      }

      const result = cleanForDraft(input)

      expect(result.icon).toBe(smallDataUri)
      expect(result.photoUrl).toBe(normalUrl)
    })

    it('cleans File and Blob objects and file-related keys', () => {
      const mockBlob = new Blob(['sample'], { type: 'text/plain' })
      const input = {
        myFile: 'some-data',
        groomPhotoFile: mockBlob,
        avatarBlob: mockBlob,
        normalField: 'test',
      }

      const result = cleanForDraft(input)

      expect(result.myFile).toBeNull()
      expect(result.groomPhotoFile).toBeNull()
      expect(result.avatarBlob).toBeNull()
      expect(result.normalField).toBe('test')
    })

    it('recursively processes arrays containing large base64', () => {
      const largeBase64 = 'data:image/jpeg;base64,' + 'B'.repeat(3000)
      const input = {
        gallery: [
          { url: 'https://example.com/1.jpg' },
          { url: largeBase64 },
        ],
      }

      const result = cleanForDraft(input)

      expect(result.gallery[0].url).toBe('https://example.com/1.jpg')
      expect(result.gallery[1].url).toBeNull()
    })

    it('handles primitive values safely', () => {
      expect(cleanForDraft(null)).toBeNull()
      expect(cleanForDraft(undefined)).toBeUndefined()
      expect(cleanForDraft(12345)).toBe(12345)
      expect(cleanForDraft(true)).toBe(true)
    })
  })

  describe('saveDraft warning behavior', () => {
    it('logs console.warn when localStorage.setItem throws QuotaExceededError', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      localStorage.setItem('selectedTemplate', JSON.stringify({ id: 1, name: 'Dark Elegant' }))

      const wrapper = mount(StudioView, {
        global: {
          stubs: {
            QuoteSection: true,
            AudioTrimmer: true,
            LoveStorySection: true,
            GiftSection: true,
            SocialSection: true,
            ImageCropperModal: true,
            AuthModal: true,
            RouterLink: true,
          },
        },
      })

      const setItemSpy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        const err = new Error('QuotaExceededError')
        err.name = 'QuotaExceededError'
        throw err
      })

      wrapper.vm.saveDraft({ title: 'Test Wedding' })

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Gagal menyimpan draf ke localStorage:',
        expect.any(Error),
      )

      consoleWarnSpy.mockRestore()
      setItemSpy.mockRestore()
    })
  })

  describe('Auto-restore draft on mount', () => {
    it('automatically restores draft into formData and notifies user when draft < 24h exists on /create', async () => {
      const savedDraft = {
        formData: {
          title: 'The Wedding of Romeo & Juliet',
          brideName: 'Juliet',
          groomName: 'Romeo',
          isSingleEvent: true,
          dateTime: '2026-12-12T10:00',
        },
        sections: { cover: true, quote: true },
        timestamp: Date.now() - 1000 * 60 * 30, // 30 mins ago
      }

      localStorage.setItem('selectedTemplate', JSON.stringify({ id: 1, name: 'Dark Elegant' }))
      localStorage.setItem('invitation_form_draft', JSON.stringify(savedDraft))

      const wrapper = mount(StudioView, {
        global: {
          stubs: {
            QuoteSection: true,
            AudioTrimmer: true,
            LoveStorySection: true,
            GiftSection: true,
            SocialSection: true,
            ImageCropperModal: true,
            AuthModal: true,
            RouterLink: true,
          },
        },
      })

      await flushPromises()

      expect(wrapper.vm.formData.title).toBe('The Wedding of Romeo & Juliet')
      expect(wrapper.vm.formData.brideName).toBe('Juliet')
      expect(wrapper.vm.formData.groomName).toBe('Romeo')
      expect(mocks.toast.success).toHaveBeenCalledWith('Draf berhasil dipulihkan!')
    })

    it('auto-restores draft silently (no toast) when pending_save_after_login is true', async () => {
      const savedDraft = {
        formData: {
          title: 'Save After Login Wedding',
          brideName: 'Ayu',
          groomName: 'Bagus',
          isSingleEvent: true,
          dateTime: '2026-12-12T10:00',
        },
        sections: { cover: true },
        timestamp: Date.now() - 1000 * 60 * 5,
      }

      localStorage.setItem('selectedTemplate', JSON.stringify({ id: 1, name: 'Dark Elegant' }))
      localStorage.setItem('invitation_form_draft', JSON.stringify(savedDraft))
      localStorage.setItem('pending_save_after_login', 'true')

      const wrapper = mount(StudioView, {
        global: {
          stubs: {
            QuoteSection: true,
            AudioTrimmer: true,
            LoveStorySection: true,
            GiftSection: true,
            SocialSection: true,
            ImageCropperModal: true,
            AuthModal: true,
            RouterLink: true,
          },
        },
      })

      await flushPromises()

      // formData was restored from draft
      expect(wrapper.vm.formData.title).toBe('Save After Login Wedding')
      expect(wrapper.vm.formData.brideName).toBe('Ayu')
      expect(wrapper.vm.formData.groomName).toBe('Bagus')

      // pending flag was removed
      expect(localStorage.getItem('pending_save_after_login')).toBeNull()
    })

    it('clears stale draft if draft is older than 24 hours', async () => {
      const staleDraft = {
        formData: { title: 'Old Draft' },
        timestamp: Date.now() - 1000 * 60 * 60 * 25, // 25 hours ago
      }

      localStorage.setItem('selectedTemplate', JSON.stringify({ id: 1, name: 'Dark Elegant' }))
      localStorage.setItem('invitation_form_draft', JSON.stringify(staleDraft))

      const wrapper = mount(StudioView, {
        global: {
          stubs: {
            QuoteSection: true,
            AudioTrimmer: true,
            LoveStorySection: true,
            GiftSection: true,
            SocialSection: true,
            ImageCropperModal: true,
            AuthModal: true,
            RouterLink: true,
          },
        },
      })

      await flushPromises()

      // The stale draft was not restored
      expect(wrapper.vm.formData.title).toBe('')
      expect(wrapper.vm.pendingDraftRecovery).toBeNull()
      const stored = JSON.parse(localStorage.getItem('invitation_form_draft') || '{}')
      expect(stored.formData?.title).not.toBe('Old Draft')
    })
  })
})
