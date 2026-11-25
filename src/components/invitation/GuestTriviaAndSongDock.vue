<template>
  <div v-if="showDock" class="fixed bottom-5 left-4 z-40 flex flex-wrap items-center gap-2 pointer-events-auto">
    <button
      v-if="hasTrivia"
      type="button"
      data-testid="open-trivia-btn"
      @click="openPanel('trivia')"
      class="inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-[#FAF8F5]/95 hover:bg-white text-stone-800 px-3.5 py-2 text-xs font-medium shadow-md backdrop-blur-sm transition-colors cursor-pointer"
    >
      <i class="fa-solid fa-circle-question text-stone-600"></i>
      <span>Kuis Pasangan</span>
    </button>

    <button
      v-if="canRequestSong"
      type="button"
      data-testid="open-song-request-btn"
      @click="openPanel('song')"
      class="inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-stone-900 hover:bg-stone-800 text-white px-3.5 py-2 text-xs font-medium shadow-md transition-colors cursor-pointer"
    >
      <i class="fa-solid fa-music text-stone-300"></i>
      <span>Request Lagu</span>
    </button>

    <!-- Editorial Modal -->
    <Teleport to="body">
      <div
        v-if="activePanel"
        class="fixed inset-0 z-110 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/60 backdrop-blur-xs"
        @click.self="closePanel"
      >
        <div class="w-full sm:max-w-lg bg-[#FAF8F5] border border-stone-200/80 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
          <!-- Modal Header -->
          <div class="px-5 py-4 border-b border-stone-200/80 bg-white flex items-center justify-between gap-3">
            <div>
              <p class="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold">
                {{ activePanel === 'trivia' ? 'Mini Trivia Quiz' : 'Playlist Resepsi' }}
              </p>
              <h3 class="font-serif text-lg text-stone-900">
                {{
                  activePanel === 'trivia'
                    ? (quizTitle || 'Seberapa Kenal Kamu dengan Kami?')
                    : 'Request Lagu untuk Resepsi'
                }}
              </h3>
            </div>
            <button
              type="button"
              @click="closePanel"
              class="w-8 h-8 rounded-lg border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-50 flex items-center justify-center text-xs cursor-pointer transition-colors"
              aria-label="Tutup"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Panel 1: Mini Trivia Quiz -->
          <div v-if="activePanel === 'trivia'" class="p-5 overflow-y-auto space-y-5">
            <template v-if="!quizFinished && currentQuestion">
              <div class="flex items-center justify-between text-xs text-stone-500">
                <span class="tabular-nums">Pertanyaan {{ currentQuestionIndex + 1 }} dari {{ questions.length }}</span>
                <span class="tabular-nums font-medium text-stone-800">Skor: {{ score }}</span>
              </div>

              <div class="w-full h-1 bg-stone-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-stone-800 transition-all duration-300"
                  :style="{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }"
                />
              </div>

              <p class="font-serif text-base sm:text-lg text-stone-900 leading-snug">
                {{ currentQuestion.question }}
              </p>

              <div class="space-y-2.5">
                <button
                  v-for="(opt, idx) in currentQuestion.options"
                  :key="idx"
                  type="button"
                  :disabled="selectedOption !== null"
                  @click="selectAnswer(idx)"
                  class="w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default"
                  :class="optionClasses(idx)"
                >
                  <span>{{ opt }}</span>
                  <i
                    v-if="selectedOption !== null && idx === currentQuestion.correctIndex"
                    class="fa-solid fa-check text-emerald-700 text-xs shrink-0"
                  ></i>
                  <i
                    v-else-if="selectedOption === idx && idx !== currentQuestion.correctIndex"
                    class="fa-solid fa-xmark text-rose-700 text-xs shrink-0"
                  ></i>
                </button>
              </div>

              <div
                v-if="selectedOption !== null"
                class="rounded-xl border border-stone-200 bg-white p-3.5 space-y-2"
              >
                <p class="text-xs font-semibold" :class="selectedOption === currentQuestion.correctIndex ? 'text-emerald-800' : 'text-stone-700'">
                  {{ selectedOption === currentQuestion.correctIndex ? 'Tepat sekali.' : 'Hampir benar.' }}
                </p>
                <p v-if="currentQuestion.funFact" class="text-xs text-stone-600 leading-relaxed">
                  {{ currentQuestion.funFact }}
                </p>
                <button
                  type="button"
                  @click="nextQuestion"
                  class="w-full mt-1 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  {{ currentQuestionIndex + 1 < questions.length ? 'Pertanyaan Berikutnya' : 'Lihat Hasil Kuis' }}
                </button>
              </div>
            </template>

            <div v-else class="bg-white border border-stone-200/80 rounded-2xl p-6 text-center space-y-4">
              <p class="text-[11px] uppercase tracking-[0.2em] text-stone-400 font-semibold">
                Hasil Akhir
              </p>
              <p class="font-serif text-3xl text-stone-900 tabular-nums">
                {{ score }} / {{ questions.length }}
              </p>
              <p class="text-sm text-stone-600 leading-relaxed">
                {{
                  score === questions.length
                    ? 'Luar biasa. Anda mengenal perjalanan pasangan ini dengan sangat baik.'
                    : score >= Math.ceil(questions.length / 2)
                      ? 'Cukup dekat. Terima kasih sudah ikut merayakan momen bahagia ini.'
                      : 'Terima kasih sudah bermain. Semoga semakin mengenal kisah kami di hari-H.'
                }}
              </p>
              <button
                type="button"
                @click="resetQuiz"
                class="px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-medium transition-colors cursor-pointer"
              >
                Ulangi Kuis
              </button>
            </div>
          </div>

          <!-- Panel 2: Song Request -->
          <div v-else-if="activePanel === 'song'" class="p-5 overflow-y-auto space-y-4">
            <p class="text-xs text-stone-600 leading-relaxed">
              Rekomendasikan lagu favorit Anda untuk diputar oleh Wedding Band atau DJ saat resepsi berlangsung.
            </p>

            <div
              v-if="songFeedback"
              class="rounded-xl px-4 py-3 text-xs border"
              :class="
                songFeedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              "
            >
              {{ songFeedback.text }}
            </div>

            <form @submit.prevent="submitSongRequest" class="space-y-3.5">
              <div class="space-y-1">
                <label for="dock-song-guest" class="block text-xs font-medium text-stone-700">
                  Nama Anda
                </label>
                <input
                  id="dock-song-guest"
                  v-model="songForm.guestName"
                  type="text"
                  required
                  maxlength="80"
                  placeholder="Contoh: Dimas & Tari"
                  class="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
                />
              </div>

              <div class="space-y-1">
                <label for="dock-song-title" class="block text-xs font-medium text-stone-700">
                  Judul Lagu & Artis
                </label>
                <input
                  id="dock-song-title"
                  v-model="songForm.songRequest"
                  type="text"
                  required
                  maxlength="180"
                  placeholder="Contoh: Akad - Payung Teduh"
                  class="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
                />
              </div>

              <div class="space-y-1">
                <label for="dock-song-note" class="block text-xs font-medium text-stone-700">
                  Ucapan Singkat (Opsional)
                </label>
                <input
                  id="dock-song-note"
                  v-model="songForm.message"
                  type="text"
                  maxlength="240"
                  placeholder="Selamat menempuh hidup baru"
                  class="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-500"
                />
              </div>

              <button
                type="submit"
                :disabled="submittingSong"
                class="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                {{ submittingSong ? 'Mengirim Request...' : 'Kirim Request Lagu' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { createGuestMessage } from '@/api/guestMessage'

const props = defineProps({
  invitation: {
    type: Object,
    default: null,
  },
  isDemo: {
    type: Boolean,
    default: false,
  },
})

const activePanel = ref(null) // 'trivia' | 'song' | null

// Trivia state
const currentQuestionIndex = ref(0)
const selectedOption = ref(null)
const score = ref(0)
const quizFinished = ref(false)

// Song request state
const submittingSong = ref(false)
const songFeedback = ref(null)
const songForm = reactive({
  guestName: props.invitation?.guestName || '',
  songRequest: '',
  message: '',
})

const triviaConfig = computed(() => props.invitation?.designSettings?.triviaQuiz || null)
const questions = computed(() => {
  const list = triviaConfig.value?.questions
  if (!Array.isArray(list)) return []
  return list.filter(
    (q) =>
      q &&
      typeof q.question === 'string' &&
      q.question.trim() &&
      Array.isArray(q.options) &&
      q.options.length >= 2,
  )
})
const hasTrivia = computed(() => Boolean(triviaConfig.value?.enabled && questions.value.length > 0))
const quizTitle = computed(() => triviaConfig.value?.title || '')
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || null)

const canRequestSong = computed(() => Boolean(props.invitation?.id && !props.isDemo && props.invitation?.isPublished))
const showDock = computed(() => hasTrivia.value || canRequestSong.value)

function openPanel(panel) {
  activePanel.value = panel
  if (panel === 'song' && props.invitation?.guestName && !songForm.guestName) {
    songForm.guestName = props.invitation.guestName
  }
}

function closePanel() {
  activePanel.value = null
}

function selectAnswer(idx) {
  if (selectedOption.value !== null || !currentQuestion.value) return
  selectedOption.value = idx
  if (idx === currentQuestion.value.correctIndex) {
    score.value += 1
  }
}

function nextQuestion() {
  if (currentQuestionIndex.value + 1 < questions.value.length) {
    currentQuestionIndex.value += 1
    selectedOption.value = null
  } else {
    quizFinished.value = true
  }
}

function resetQuiz() {
  currentQuestionIndex.value = 0
  selectedOption.value = null
  score.value = 0
  quizFinished.value = false
}

function optionClasses(idx) {
  if (selectedOption.value === null) {
    return 'border-stone-200 bg-white hover:border-stone-400 text-stone-800'
  }
  const isCorrect = idx === currentQuestion.value?.correctIndex
  const isChosen = idx === selectedOption.value
  if (isCorrect) return 'border-emerald-300 bg-emerald-50 text-emerald-900 font-medium'
  if (isChosen) return 'border-rose-300 bg-rose-50 text-rose-900'
  return 'border-stone-200 bg-white/60 text-stone-400'
}

async function submitSongRequest() {
  if (!props.invitation?.id || submittingSong.value) return
  submittingSong.value = true
  songFeedback.value = null
  try {
    await createGuestMessage({
      invitationId: Number(props.invitation.id),
      guestName: songForm.guestName.trim(),
      message: songForm.message.trim() || `Request lagu: ${songForm.songRequest.trim()}`,
      rsvpStatus: 'hadir',
      totalGuests: 1,
      songRequest: songForm.songRequest.trim(),
    })
    songForm.songRequest = ''
    songForm.message = ''
    songFeedback.value = {
      type: 'success',
      text: 'Request lagu Anda berhasil dikirim ke playlist pasangan.',
    }
  } catch (err) {
    songFeedback.value = {
      type: 'error',
      text: err?.message || 'Gagal mengirim request lagu.',
    }
  } finally {
    submittingSong.value = false
  }
}
</script>
