<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { chatWithNova, getNovaCredits, purchaseNovaCredits } from '@/api/ai'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['close', 'require-auth'])

const router = useRouter()
const authStore = useAuthStore()

const PACKAGES = [
  { id: '1', label: '1 Kredit', price: 'Rp 2.000' },
  { id: '5', label: '5 Kredit', price: 'Rp 8.000', badge: 'Hemat' },
  { id: '10', label: '10 Kredit', price: 'Rp 14.000', badge: 'Terbaik' },
]

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: 'Halo! Saya Nova 💍 AI assistant dari satuundangan.id. Saya akan pandu kamu buat undangan pernikahan digital hanya dengan chat! Mulai dari nama mempelai — siapa nama mempelai pria dan wanitanya?',
}

const view = ref('intro') // 'intro' | 'chat' | 'locked' | 'loading' | 'done'
const messages = ref([INITIAL_MESSAGE])
const userInput = ref('')
const isTyping = ref(false)
const credits = ref(0)
const currentData = ref({})
const isComplete = ref(false)
const snapToken = ref(null)
const scrollContainer = ref(null)
const isPurchasing = ref(false)

const scrollToBottom = async () => {
  await nextTick()
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }
}

const loadCredits = async () => {
  if (!authStore.user) return
  try {
    const res = await getNovaCredits()
    credits.value = res.credits
  } catch {
    credits.value = 0
  }
}

onMounted(async () => {
  if (authStore.user) {
    view.value = 'loading'
    await loadCredits()
    view.value = credits.value > 0 ? 'intro' : 'locked'
  }
})

const startChat = () => {
  if (!authStore.user) {
    emit('require-auth')
    return
  }
  if (credits.value < 1) {
    view.value = 'locked'
    return
  }
  messages.value = [INITIAL_MESSAGE]
  currentData.value = {}
  isComplete.value = false
  view.value = 'chat'
}

const sendMessage = async () => {
  const text = userInput.value.trim()
  if (!text || isTyping.value) return

  messages.value.push({ role: 'user', content: text })
  userInput.value = ''
  isTyping.value = true
  scrollToBottom()

  try {
    const res = await chatWithNova(messages.value, currentData.value)
    messages.value.push({ role: 'assistant', content: res.message })
    currentData.value = { ...currentData.value, ...res.updatedData }
    if (typeof res.creditsRemaining === 'number') credits.value = res.creditsRemaining
    if (res.isComplete) isComplete.value = true
  } catch (err) {
    const msg = err.message?.includes('Kredit Nova habis')
      ? 'Kredit Nova kamu habis. Silakan beli paket kredit dulu ya! 🙏'
      : 'Nova sedang sibuk sebentar. Coba lagi ya!'
    messages.value.push({ role: 'assistant', content: msg })
    if (err.message?.includes('Kredit')) {
      credits.value = 0
      view.value = 'locked'
    }
  } finally {
    isTyping.value = false
    scrollToBottom()
  }
}

const goToCreateForm = () => {
  localStorage.setItem('nova_draft', JSON.stringify(currentData.value))
  router.push('/create')
  emit('close')
}

const buyPackage = async (pkgId) => {
  if (isPurchasing.value) return
  isPurchasing.value = true
  try {
    const res = await purchaseNovaCredits(pkgId)
    if (res.token && window.snap) {
      window.snap.pay(res.token, {
        onSuccess: async () => {
          await loadCredits()
          view.value = credits.value > 0 ? 'intro' : 'locked'
        },
        onPending: () => {},
        onError: () => {},
        onClose: () => {},
      })
    } else if (res.redirect_url) {
      window.location.href = res.redirect_url
    }
  } catch {
    alert('Gagal memproses pembayaran. Coba lagi.')
  } finally {
    isPurchasing.value = false
  }
}

const handleKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}
</script>

<template>
  <div class="flex flex-col w-[360px] h-[540px] bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden">

    <!-- Header -->
    <div class="relative bg-gradient-to-br from-rose-500 to-rose-600 px-4 py-3 flex items-center gap-3 text-white">
      <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold flex-shrink-0">
        N
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-bold text-sm flex items-center gap-1">
          Nova
          <svg class="w-3.5 h-3.5 text-rose-200" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </div>
        <p class="text-[10px] text-rose-100">AI Invitation Assistant</p>
      </div>
      <div v-if="authStore.user && view === 'chat'" class="text-[10px] text-rose-100 flex items-center gap-1">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z"/>
        </svg>
        {{ credits }} kredit
      </div>
      <button @click="emit('close')" class="ml-auto text-white/70 hover:text-white transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="view === 'loading'" class="flex-1 flex items-center justify-center">
      <div class="w-6 h-6 border-2 border-rose-400 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Intro screen -->
    <div v-else-if="view === 'intro'" class="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
      <div class="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-3xl">💍</div>
      <div>
        <h3 class="font-bold text-gray-800 text-base">Buat Undangan Lewat Chat</h3>
        <p class="text-gray-500 text-sm mt-1">Ceritakan detail pernikahan kamu, Nova yang akan rangkai jadi undangan digital.</p>
      </div>
      <a
        href="https://youtube.com"
        target="_blank"
        class="flex items-center gap-2 text-rose-500 text-sm hover:text-rose-600 transition-colors"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 15l5.19-3L10 9v6zm11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
        </svg>
        Lihat cara kerjanya
      </a>
      <div class="w-full bg-rose-50 rounded-xl p-3 text-xs text-gray-500">
        🎁 <span class="font-medium text-gray-700">Free trial 1x</span> — {{ credits > 0 ? `Kamu masih punya ${credits} kredit gratis!` : 'Kredit kamu sudah digunakan.' }}
      </div>
      <button
        @click="startChat"
        class="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-2.5 rounded-full transition-all active:scale-95 text-sm"
      >
        {{ credits > 0 ? '✨ Mulai Chat dengan Nova' : 'Beli Kredit untuk Lanjut' }}
      </button>
    </div>

    <!-- Locked / buy credits -->
    <div v-else-if="view === 'locked'" class="flex-1 flex flex-col items-center justify-center gap-4 p-5 text-center">
      <div class="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl">🔒</div>
      <div>
        <h3 class="font-bold text-gray-800 text-sm">Kredit Nova habis</h3>
        <p class="text-gray-500 text-xs mt-1">Pilih paket kredit untuk melanjutkan</p>
      </div>
      <div class="w-full flex flex-col gap-2">
        <button
          v-for="pkg in PACKAGES"
          :key="pkg.id"
          @click="buyPackage(pkg.id)"
          :disabled="isPurchasing"
          class="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 transition-all text-sm disabled:opacity-50"
        >
          <span class="font-medium text-gray-700">{{ pkg.label }}</span>
          <div class="flex items-center gap-2">
            <span v-if="pkg.badge" class="text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full font-medium">{{ pkg.badge }}</span>
            <span class="font-bold text-rose-600">{{ pkg.price }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Chat view -->
    <template v-else-if="view === 'chat'">
      <div ref="scrollContainer" class="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          :class="['flex items-end gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start']"
        >
          <div v-if="msg.role === 'assistant'" class="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">N</div>
          <div :class="[
            'max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
            msg.role === 'user'
              ? 'bg-rose-500 text-white rounded-br-none'
              : 'bg-white text-gray-700 border border-rose-100 rounded-bl-none shadow-sm'
          ]">{{ msg.content }}</div>
        </div>

        <div v-if="isTyping" class="flex items-end gap-2">
          <div class="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">N</div>
          <div class="bg-white border border-rose-100 px-3 py-2.5 rounded-2xl rounded-bl-none shadow-sm flex gap-1 items-center">
            <div class="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce"></div>
            <div class="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:0.15s]"></div>
            <div class="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce [animation-delay:0.3s]"></div>
          </div>
        </div>

        <div v-if="isComplete" class="flex justify-center pt-1">
          <button
            @click="goToCreateForm"
            class="bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-5 py-2 rounded-full transition-all active:scale-95 shadow-md"
          >
            🎉 Buat Undangan Sekarang
          </button>
        </div>
      </div>

      <div class="p-3 border-t border-rose-100 bg-white">
        <form @submit.prevent="sendMessage" class="flex gap-2">
          <input
            v-model="userInput"
            @keydown="handleKeydown"
            type="text"
            placeholder="Ceritakan ke Nova..."
            class="flex-1 px-3 py-2 border border-rose-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm bg-gray-50 placeholder:text-gray-400"
          />
          <button
            type="submit"
            :disabled="isTyping || !userInput.trim()"
            class="bg-rose-500 hover:bg-rose-600 text-white p-2 rounded-full transition-all disabled:opacity-40 active:scale-95"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </form>
      </div>
    </template>

  </div>
</template>
