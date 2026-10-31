import { flushPromises, mount } from '@vue/test-utils'
import { reactive } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PreviewInvitation from '@/views/PreviewInvitation.vue'

const api = vi.hoisted(() => ({
  getMyInvitationBySlug: vi.fn(),
  push: vi.fn(),
}))

const routeState = reactive({ query: {} })

vi.mock('@/api/invitation', () => ({
  getMyInvitationBySlug: api.getMyInvitationBySlug,
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({ user: { name: 'Alya' } }),
}))

vi.mock('vue-router', async (original) => ({
  ...(await original()),
  useRoute: () => routeState,
  useRouter: () => ({ push: api.push }),
}))

describe('PreviewInvitation.vue (SAT-10)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    routeState.query = {}
    localStorage.clear()
  })

  it('returns to the same saved invitation when preview lookup fails', async () => {
    routeState.query = { slug: 'draft-baru', id: 'invitation-123' }
    api.getMyInvitationBySlug.mockRejectedValueOnce(new Error('Network Error'))

    const wrapper = mount(PreviewInvitation, {
      global: { stubs: { AuthModal: true } },
    })

    await flushPromises()
    const editButton = wrapper.findAll('button').find((button) => button.text().includes('Edit Data'))
    expect(editButton).toBeDefined()

    await editButton.trigger('click')

    expect(api.push).toHaveBeenCalledWith('/invitation/invitation-123/edit')
  })
})
