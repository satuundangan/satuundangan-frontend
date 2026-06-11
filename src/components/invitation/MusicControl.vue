<template>
  <div class="fixed bottom-24 right-4 md:right-8 z-50 animate-fade-in">
    
    <!-- YouTube mode: mini visible player with mute toggle -->
    <div v-if="isYoutube" class="relative group">
       <div class="w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden shadow-2xl border ring-1 ring-white/10"
         :style="{ borderColor: accentColor + '4D' }">
          <iframe
            ref="ytIframe"
            :src="`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&enablejsapi=1${audioStart > 0 ? '&start=' + Math.floor(audioStart) : ''}${audioEnd > 0 ? '&end=' + Math.floor(audioEnd) : ''}`"
            class="w-full h-full pointer-events-none"
            frameborder="0"
            allow="autoplay; encrypted-media"
          />
       </div>
       <button
         @click="toggleYoutubeMute"
         class="absolute inset-0 flex items-center justify-center rounded-full backdrop-blur-md transition-all duration-500"
         :style="{ backgroundColor: primaryColor + '99' }"
       >
         <i :class="isMuted ? 'fa-solid fa-volume-xmark text-white/50' : 'fa-solid fa-compact-disc animate-spin-slow'" 
            class="text-base md:text-xl"
            :style="{ color: !isMuted ? accentColor : undefined }" />
       </button>
    </div>

    <!-- Regular audio mode (The Premium Redesign) -->
    <button
      v-else
      @click="toggleAudio"
      class="relative group w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-110 active:scale-95 border backdrop-blur-xl"
      :style="{ 
        backgroundColor: primaryColor + '99', 
        borderColor: accentColor + '4D' 
      }"
    >
      <!-- Animated Music Waves -->
      <div v-if="isPlaying" class="absolute inset-0 flex items-center justify-center gap-[2px] opacity-40">
         <span v-for="i in 3" :key="i" class="w-[2px] h-3 rounded-full animate-music-bar" :style="{ backgroundColor: accentColor, animationDelay: `${i * 0.2}s` }"></span>
      </div>

      <!-- Icon Container -->
      <div class="relative z-10 flex items-center justify-center transition-transform duration-500" :class="{ 'rotate-[360deg]': isPlaying }">
         <i v-if="isPlaying" class="fa-solid fa-compact-disc text-lg md:text-2xl animate-spin-slow" :style="{ color: accentColor }" />
         <i v-else class="fa-solid fa-play text-sm md:text-lg ml-1 opacity-40" :style="{ color: accentColor }" />
      </div>

      <!-- Pulsing Glow Effect -->
      <div v-if="isPlaying" class="absolute inset-0 rounded-full animate-ping-slow pointer-events-none" :style="{ backgroundColor: accentColor + '33' }"></div>
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
  },
  audioStart: {
    type: Number,
    default: 0
  },
  audioEnd: {
    type: Number,
    default: 0
  },
  primaryColor: {
    type: String,
    default: '#043927'
  },
  accentColor: {
    type: String,
    default: '#d4af37'
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
  
  audio.value.onloadedmetadata = () => {
    if (props.audioStart > 0) {
      audio.value.currentTime = props.audioStart
    }
  }

  audio.value.ontimeupdate = () => {
    if (props.audioEnd > 0 && audio.value.currentTime >= props.audioEnd) {
      audio.value.currentTime = props.audioStart
    }
  }
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
  animation: spin 6s linear infinite;
}

.animate-ping-slow {
  animation: ping-custom 3s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ping-custom {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes music-bar {
  0%, 100% { height: 4px; }
  50% { height: 16px; }
}

.animate-music-bar {
  animation: music-bar 0.8s ease-in-out infinite;
}

.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
