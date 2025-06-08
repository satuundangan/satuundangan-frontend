<template>
  <div class="fixed bottom-4 right-4 z-50 spin-slow">
    <button @click="toggleAudio"
      class="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-200">
      <svg v-if="!isPlaying" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
        stroke-linecap="round" stroke-linejoin="round">
        <polygon points="5,3 19,12 5,21 5,3" />
      </svg>
      <svg v-else class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
        stroke-linecap="round" stroke-linejoin="round">
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isPlaying = ref(false)
const audio = ref(null)

onMounted(() => {
  // Bikin instance audio pas mounted
  audio.value = new Audio('/audio/romantic_music1.mp3')
  audio.value.loop = true
  audio.value.volume = 0.6

  // Autoplay bakal gagal tanpa user interaction, jadi pasang event listener
  const tryPlay = () => {
    audio.value.play().then(() => {
      isPlaying.value = true
    }).catch(() => {
      isPlaying.value = false
    })

    // Hapus listener biar gak dobel2
    window.removeEventListener('click', tryPlay)
  }

  window.addEventListener('click', tryPlay)
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
</script>
