<template>
  <div class="absolute bottom-24 right-4 z-40">
    <button @click="toggleAudio"
      class="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 backdrop-blur-md border border-white/20"
      :class="isPlaying ? 'bg-mocha/80 text-white animate-spin-slow' : 'bg-black/50 text-white/70'">
      
      <i v-if="isPlaying" class="fa-solid fa-compact-disc text-xl"></i>
      <i v-else class="fa-solid fa-play text-lg ml-1"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

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

const isPlaying = ref(false)
const audio = ref(null)

const initAudio = () => {
  if(audio.value) {
    audio.value.pause()
    audio.value = null
  }
  audio.value = new Audio(props.src)
  audio.value.loop = true
}

onMounted(() => {
  initAudio()

  if (props.autoPlay) {
    const tryPlay = () => {
      if(!audio.value) return
      audio.value.play().then(() => {
        isPlaying.value = true
      }).catch((e) => {
        console.log("Autoplay blocked:", e)
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
   initAudio()
   if(isPlaying.value) audio.value.play()
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