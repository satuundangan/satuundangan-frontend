<template>
  <div class="h-screen w-screen bg-gray-950 text-white flex flex-col">
    <!-- NAVBAR -->
    <header class="h-14 flex items-center justify-between px-6 bg-gray-900 border-b border-gray-800">
      <h1 class="font-semibold text-lg flex items-center gap-2">
        <span v-if="isLoading" class="animate-pulse">🔄</span>
        <span v-else>🎉</span>
        Preview Undangan
      </h1>
      <div class="flex gap-2">
        <button v-for="mode in modes" :key="mode" @click="viewMode = mode"
          :class="['px-3 py-1.5 text-sm rounded-md transition-all', viewMode === mode ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600']">
          {{ mode }}
        </button>
        <button @click="enterFullscreen"
          class="px-3 py-1.5 text-sm rounded-md bg-green-600 hover:bg-green-700 transition-all flex items-center gap-1">
          <span v-if="isFullscreen">📱</span>
          <span v-else>🔍</span>
          {{ isFullscreen ? 'Exit' : 'Fullscreen' }}
        </button>
        <button @click="handlePublish"
          class="px-3 py-1.5 text-sm rounded-md bg-purple-600 hover:bg-purple-700 transition-all flex items-center gap-1">
          <span v-if="isPublishing">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </span>
          <span v-else>✨</span>
          {{ isPublishing ? 'Memproses...' : 'Publish' }}
        </button>
      </div>
    </header>

    <!-- BODY -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Loading Overlay -->
      <div v-if="isLoading" class="absolute inset-0 bg-gray-950/80 z-50 flex items-center justify-center">
        <div class="text-center">
          <svg class="animate-spin h-10 w-10 text-blue-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          <p class="text-sm text-gray-300">Memuat preview undangan...</p>
        </div>
      </div>

      <!-- SIDEBAR -->
      <aside class="hidden md:block w-64 bg-gray-900 border-r border-gray-800 p-4 transition-all duration-300">
        <div class="sticky top-4">
          <p class="text-sm font-semibold mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Info Preview
          </p>
          <ul class="text-xs text-gray-300 space-y-2">
            <li class="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mt-0.5 flex-shrink-0" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Simulasi tampilan real-time
            </li>
            <li class="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mt-0.5 flex-shrink-0" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Perangkat: Mobile/Web/Fullscreen
            </li>
            <li class="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mt-0.5 flex-shrink-0" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Responsif di berbagai ukuran layar
            </li>
          </ul>

          <div class="mt-6">
            <div v-if="!isPublished"
              class="bg-yellow-500/10 text-yellow-400 text-xs p-3 rounded-lg border border-yellow-500/50">
              <div class="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mt-0.5 flex-shrink-0" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p class="font-medium">Ini hanya preview</p>
                  <p class="mt-1 opacity-80">Undangan belum dipublikasikan ke publik</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- MAIN -->
      <main class="flex-1 flex justify-center items-center p-4 transition-all duration-300">
        <div class="border border-gray-700 shadow-lg overflow-hidden bg-white relative" :class="frameClass">
          <!-- Device frame for mobile view -->
          <div v-if="viewMode === 'Mobile'"
            class="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div class="absolute top-0 w-full h-8 bg-gray-900/50 rounded-t-[2rem] flex items-center justify-center">
              <div class="w-24 h-1.5 bg-gray-700 rounded-full"></div>
            </div>
            <div class="absolute bottom-0 w-full h-8 bg-gray-900/50 rounded-b-[2rem] flex items-center justify-center">
              <div class="w-8 h-8 rounded-full border border-gray-700"></div>
            </div>
          </div>

          <!-- Loading state for iframe -->
          <div v-if="isIframeLoading" class="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div class="text-center">
              <svg class="animate-spin h-8 w-8 text-gray-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <p class="text-xs text-gray-500">Memuat konten undangan...</p>
            </div>
          </div>

          <iframe seamless="seamless" ref="iframeRef" :src="previewUrl" class="w-full h-full iframe-content"
            frameborder="0" allowfullscreen sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            @load="onIframeLoad" />
        </div>
      </main>
    </div>

    <!-- MODAL LOGIN -->
    <AuthModal v-if="showLogin" :show="showLogin" :authMode="authMode" @close="showLogin = false"
      @update:authMode="authMode = $event" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import AuthModal from '@/components/modal/AuthModal.vue'

const auth = useAuthStore()
const userName = computed(() => auth.user?.name || null)
const router = useRouter()

const viewMode = ref('Mobile')
const modes = ['Mobile', 'Web']
const iframeRef = ref(null)
const isPublished = ref(false)
const isLoading = ref(true)
const isIframeLoading = ref(true)
const isPublishing = ref(false)
const isFullscreen = ref(false)

let previewUrl = '/'

const showLogin = ref(false)
const authMode = ref('login')

const frameClass = computed(() => {
  switch (viewMode.value) {
    case 'Mobile':
      return 'w-full md:w-[360px] h-full rounded-[2rem]'
    case 'Web':
      return 'w-full h-full rounded-md'
    case 'Fullscreen':
      return 'w-full h-[calc(100vh-3.5rem)]'
    default:
      return 'w-[360px] h-[640px] rounded-[2rem]'
  }
})

function enterFullscreen() {
  const el = iframeRef.value
  if (!el) return

  if (!document.fullscreenElement) {
    if (el.requestFullscreen) {
      el.requestFullscreen()
      isFullscreen.value = true
      viewMode.value = 'Fullscreen'
    } else {
      alert('Browser tidak mendukung fullscreen mode 😓')
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      isFullscreen.value = false
      viewMode.value = 'Mobile'
    }
  }
}

const onIframeLoad = () => {
  isIframeLoading.value = false
  isLoading.value = false
}

const handlePublish = async () => {
  if (!userName.value) {
    showLogin.value = true
    return
  }

  try {
    isPublishing.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/checkout')
  } catch (error) {
    console.error('Publish error:', error)
  } finally {
    isPublishing.value = false
  }
}

onMounted(() => {
  // Get from localstorage
  const savedUrl = localStorage.getItem('selectedTemplate')
  if (savedUrl) {
    const slug = JSON.parse(savedUrl).slug
    previewUrl = '/' + slug
    console.log('Preview URL:', previewUrl)
  }

  // Simulate loading delay
  setTimeout(() => {
    if (isIframeLoading.value) {
      isIframeLoading.value = false
      isLoading.value = false
    }
  }, 3000)

  // Listen for fullscreen change
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
    if (!isFullscreen.value) {
      viewMode.value = 'Mobile'
    }
  })
})
</script>

<style scoped>
/* Smooth transitions */
iframe {
  transition: opacity 0.3s ease;
}
/* Container iframe */
.iframe-container {
  overflow: hidden;
  position: relative;
}

/* Style iframe */
.iframe-content {
  width: 100%;
  height: 100%;
  border: none;
  overflow: hidden;
  display: block;

  /* Untuk browser WebKit (Chrome, Safari) */
  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  /* IE dan Edge */
  scrollbar-width: none;
  /* Firefox */
}
</style>
