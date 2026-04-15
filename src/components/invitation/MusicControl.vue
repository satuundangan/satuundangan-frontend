<template>
  <div class="fixed bottom-24 right-4 z-50">

    <!-- YouTube mode: mini visible player with mute toggle (required by YouTube ToS) -->
    <div v-if="isYoutube" class="relative w-12 h-12">
      <div class="w-12 h-12 rounded-full overflow-hidden shadow-lg border border-white/20">
        <iframe
          ref="ytIframe"
          :src="`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&enablejsapi=1`"
          width="48"
          height="48"
          frameborder="0"
          allow="autoplay; encrypted-media"
          title="Background music player"
        />
      </div>
      <button
        @click="toggleYoutubeMute"
        class="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/30 transition-all duration-300 hover:scale-110"
        :title="isMuted ? 'Unmute musik' : 'Mute musik'"
      >
        <i :class="isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-compact-disc animate-spin-slow'" class="text-white text-lg" />
      </button>
    </div>

    <!-- Regular audio mode -->
    <button
      v-else
      @click="toggleAudio"
      class="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 backdrop-blur-md border border-white/20"
      :class="isPlaying ? 'bg-mocha/80 text-white animate-spin-slow' : 'bg-black/50 text-white/70'"
    >
      <i v-if="isPlaying" class="fa-solid fa-compact-disc text-xl" />
      <i v-else class="fa-solid fa-play text-lg ml-1" />
    </button>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: '/audio/romantic_music1.mp3'
  },
  autoPlay: {
    type: Boolean,
    default: true
  }
})

// --- YouTube mode ---
const isYoutube = computed(() => props.src?.startsWith('yt:'))
const youtubeId = computed(() => isYoutube.value ? props.src.slice(3) : null)
const ytIframe = ref(null)
const isMuted = ref(true)

function toggleYoutubeMute() {
  if (!ytIframe.value?.contentWindow) return
  const func = isMuted.value ? 'unMute' : 'mute'
  ytIframe.value.contentWindow.postMessage(
    JSON.stringify({ event: 'command', func, args: [] }),
    '*'
  )
  isMuted.value = !isMuted.value
}

// --- Regular audio mode ---
const isPlaying = ref(false)
const audio = ref(null)

const initAudio = () => {
  if (audio.value) {
    audio.value.pause()
    audio.value = null
  }
  audio.value = new Audio(props.src)
  audio.value.loop = true
}

onMounted(() => {
  if (isYoutube.value) return

  initAudio()

  if (props.autoPlay) {
    const tryPlay = () => {
      if (!audio.value) return
      audio.value.play().then(() => {
        isPlaying.value = true
      }).catch(() => {
        isPlaying.value = false
      })
      window.removeEventListener('click', tryPlay)
      window.removeEventListener('touchstart', tryPlay)
    }

    window.addEventListener('click', tryPlay)
    window.addEventListener('touchstart', tryPlay)
  }
})

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause()
    audio.value = null
  }
})

const toggleAudio = () => {
  if (!audio.value) return
  if (isPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.play()
  }
  isPlaying.value = !isPlaying.value
}

watch(() => props.src, () => {
  if (isYoutube.value) return
  initAudio()
  if (isPlaying.value) audio.value.play()
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.animate-spin-slow {
  animation: spin 4s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
