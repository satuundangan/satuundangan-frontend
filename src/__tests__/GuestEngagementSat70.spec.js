import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import GuestTriviaAndSongDock from '@/components/invitation/GuestTriviaAndSongDock.vue'
import * as guestMessageApi from '@/api/guestMessage'

vi.mock('@/api/guestMessage', () => ({
  createGuestMessage: vi.fn(),
  getGuestMessagesByInvitationId: vi.fn(),
  getOwnerGuestMessagesByInvitationId: vi.fn(),
  getSongRequestsByInvitationId: vi.fn(),
  deleteGuestMessage: vi.fn(),
}))

describe('Guest Engagement: Song Request & Mini Trivia Quiz (SAT-70)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('plays Mini Trivia Quiz interactively and computes final score', async () => {
    const invitation = {
      id: 12,
      isPublished: true,
      designSettings: {
        triviaQuiz: {
          enabled: true,
          title: 'Kuis Romeo & Juliet',
          questions: [
            {
              question: 'Siapa yang menyatakan perasaan duluan?',
              options: ['Romeo', 'Juliet', 'Bersamaan'],
              correctIndex: 0,
              funFact: 'Di balkon malam itu.',
            },
            {
              question: 'Kota tempat mereka pertama bertemu?',
              options: ['Roma', 'Verona', 'Venice'],
              correctIndex: 1,
              funFact: 'Verona selalu punya kenangan.',
            },
          ],
        },
      },
    }

    const wrapper = mount(GuestTriviaAndSongDock, {
      props: { invitation, isDemo: false },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    })

    await wrapper.find('[data-testid="open-trivia-btn"]').trigger('click')
    expect(wrapper.text()).toContain('Kuis Romeo & Juliet')
    expect(wrapper.text()).toContain('Siapa yang menyatakan perasaan duluan?')

    // Answer Q1 correctly (index 0)
    const q1Options = wrapper.findAll('button').filter((b) => b.text().includes('Romeo'))
    await q1Options[0].trigger('click')
    expect(wrapper.text()).toContain('Tepat sekali.')
    expect(wrapper.text()).toContain('Di balkon malam itu.')

    const nextBtn = wrapper.findAll('button').find((b) => b.text().includes('Pertanyaan Berikutnya'))
    await nextBtn.trigger('click')

    // Answer Q2 incorrectly (index 0 = Roma)
    const q2Option = wrapper.findAll('button').find((b) => b.text().includes('Roma'))
    await q2Option.trigger('click')
    expect(wrapper.text()).toContain('Hampir benar.')

    const finishBtn = wrapper.findAll('button').find((b) => b.text().includes('Lihat Hasil Kuis'))
    await finishBtn.trigger('click')

    expect(wrapper.text()).toContain('Hasil Akhir')
    expect(wrapper.text()).toContain('1 / 2')
  })

  it('submits guest song request via createGuestMessage with songRequest field', async () => {
    guestMessageApi.createGuestMessage.mockResolvedValueOnce({ success: true })

    const wrapper = mount(GuestTriviaAndSongDock, {
      props: {
        invitation: {
          id: 12,
          isPublished: true,
          guestName: 'Dimas',
          designSettings: {},
        },
        isDemo: false,
      },
      global: {
        stubs: {
          Teleport: true,
        },
      },
    })

    await wrapper.find('[data-testid="open-song-request-btn"]').trigger('click')
    await wrapper.find('#dock-song-title').setValue('Akad - Payung Teduh')
    await wrapper.find('#dock-song-note').setValue('Selamat menempuh hidup baru!')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(guestMessageApi.createGuestMessage).toHaveBeenCalledWith({
      invitationId: 12,
      guestName: 'Dimas',
      message: 'Selamat menempuh hidup baru!',
      rsvpStatus: 'hadir',
      totalGuests: 1,
      songRequest: 'Akad - Payung Teduh',
    })
    expect(wrapper.text()).toContain('Request lagu Anda berhasil dikirim ke playlist pasangan.')
  })
})
