<template>
  <div class="h-screen w-screen bg-gray-950 text-white flex flex-col">
    <!-- NAVBAR -->
    <header class="h-14 flex items-center justify-between px-6 bg-gray-900 border-b border-gray-800">
      <h1 class="font-semibold text-lg">🎉 Preview Undangan</h1>
      <div class="flex gap-2">
        <button v-for="mode in modes" :key="mode" @click="viewMode = mode"
          :class="['px-3 py-1.5 text-sm rounded-md', viewMode === mode ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600']">
          {{ mode }}
        </button>
        <button @click="enterFullscreen" class="px-3 py-1.5 text-sm rounded-md bg-green-600 hover:bg-green-700">🔎
          Fullscreen</button>
        <button @click="handlePublish" class="px-3 py-1.5 text-sm rounded-md bg-purple-600 hover:bg-purple-700">✨
          Publish</button>
      </div>
    </header>

    <!-- BODY -->
    <div class="flex flex-1 overflow-hidden">
      <!-- SIDEBAR -->
      <aside class="hidden md:block w-64 bg-gray-900 border-r border-gray-800 p-4">
        <p class="text-sm font-semibold mb-3">📌 Info Preview</p>
        <ul class="text-xs text-gray-300 space-y-2">
          <li>- Simulasi tampilan real</li>
          <li>- Perangkat: Mobile/Web/Fullscreen</li>
        </ul>
        <div class="mt-4">
          <span v-if="!isPublished"
            class="bg-yellow-500/10 text-yellow-400 text-xs px-3 py-1 rounded-full border border-yellow-500 inline-block mt-2">
            ⚠️ Ini hanya preview. Belum dipublish publik.
          </span>
        </div>
      </aside>

      <!-- MAIN -->
      <main class="flex-1 flex justify-center items-center p-4">
        <div class="border border-gray-700 shadow-lg overflow-hidden bg-white" :class="frameClass">
          <iframe ref="iframeRef" :src="previewUrl" class="w-full h-full" frameborder="0" allowfullscreen />
        </div>
      </main>
    </div>

    <!-- MODAL LOGIN -->
    <AuthModal v-if="showLogin" :show="showLogin" :authMode="authMode" @close="showLogin = false"
      @update:authMode="authMode = $event" />
  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import AuthModal from '@/components/AuthModal.vue'

const auth = useAuthStore()
const router = useRouter()

const viewMode = ref('Mobile')
const modes = ['Mobile', 'Web']
const iframeRef = ref(null)
const isPublished = ref(false)

const previewUrl = '/invitation'

const showLogin = ref(false)
const authMode = ref('login')

const frameClass = computed(() => {
  switch (viewMode.value) {
    case 'Mobile':
      return 'w-[390px] h-[844px] rounded-[2.5rem]'
    case 'Web':
      return 'w-[1280px] h-[720px] rounded-md'
    case 'Fullscreen':
      return 'w-full h-[calc(100vh-3.5rem)]'
    default:
      return 'w-[390px] h-[844px] rounded-[2.5rem]'
  }
})

function enterFullscreen() {
  const el = iframeRef.value
  if (el?.requestFullscreen) el.requestFullscreen()
  else alert('Browser tidak mendukung fullscreen mode 😓')
}

const handlePublish = () => {
  if (!auth.isLoggedIn) {
    showLogin.value = true
    return
  }
  // Setelah login sukses, arahkan ke halaman detail pembayaran
  router.push('/payment-details')
}
</script>
