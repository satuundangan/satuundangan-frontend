<template>
  <div class="relative min-h-screen bg-black overflow-hidden font-sans">
    <!-- Welcome Section -->
    <transition name="invite-reveal" mode="out-in">
      <div v-if="showWelcome"
        class="relative flex flex-col items-center justify-center h-screen text-center px-6 text-white"
        style="background-image: url('https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDhwZDZwbDh0ZjEwcmZwYnQ5ZDZqeTdqeWEzcjRoYjNkMWlveHc0NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gKncmZtoUiAcQxPvap/giphy.gif'); background-size: cover; background-position: center;">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-xs"></div>
        <div class="relative z-10 space-y-2">
          <h1 class="text-xl tracking-widest text-gray-200">THE WEDDING OF</h1>
          <h2 class="text-5xl font-serif font-bold">FAZA</h2>
          <span class="text-sm text-gray-200">AND</span>
          <h2 class="text-5xl font-serif font-bold mb-2">DIMAS</h2>
          <p class="text-sm text-gray-100 mb-6">21.10.2023</p>

          <div class="text-sm text-gray-200">Kepada Yth.</div>
          <div class="text-xl font-semibold text-white mb-4">Nama Tamu</div>

          <button @click="openInvitation"
            class="bg-white/90 text-purple-800 py-2 px-6 rounded-md shadow hover:bg-white transition-all duration-300 delay-100">
            💌 Open Invitation
          </button>

        </div>
      </div>

    </transition>


    <transition name="fade" mode="out-in">
      <div v-if="!showWelcome" class="">
        <div
          class="relative min-h-screen flex flex-col items-center justify-center text-white text-center bg-cover bg-center"
          :style="{ backgroundImage: `url(${backgroundUrl})` }">
          <!-- Overlay gradasi -->
          <div class="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

          <!-- Konten utama -->
          <div class="relative z-10 space-y-4">
            <p class="text-sm tracking-widest uppercase text-white/80">THE WEDDING OF</p>
            <h1 class="text-5xl font-serif font-semibold uppercase tracking-wide">REFDA</h1>
            <p class="text-xl font-light">and</p>
            <h1 class="text-5xl font-serif font-semibold uppercase tracking-wide">TOYYIB</h1>
            <p class="text-sm mt-2">21.10.2024</p>

            <!-- Countdown -->
            <div class="flex justify-center gap-6 mt-6 font-semibold">
              <div v-for="(val, label) in countdown" :key="label" class="text-center">
                <div class="text-3xl">{{ val }}</div>
                <div class="text-xs uppercase tracking-wide">{{ label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const data = ref({})
const showWelcome = ref(true)

function openInvitation() {
  showWelcome.value = false
}

const backgroundUrl = 'https://i.pinimg.com/originals/b4/dc/ae/b4dcae8b4c32a650d92ace938f558c7c.jpg'
const countdown = ref({
  Hari: '00',
  Jam: '00',
  Menit: '00',
  Detik: '00',
})

const targetDate = new Date('2025-10-21T00:00:00')

let interval = null

const updateCountdown = () => {
  const now = new Date()
  const diff = targetDate - now

  if (diff <= 0) {
    countdown.value = { Hari: '00', Jam: '00', Menit: '00', Detik: '00' }
    clearInterval(interval)
    return
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  countdown.value = {
    Hari: String(days).padStart(2, '0'),
    Jam: String(hours).padStart(2, '0'),
    Menit: String(minutes).padStart(2, '0'),
    Detik: String(seconds).padStart(2, '0'),
  }
}

onMounted(() => {
  const stored = localStorage.getItem('formData')
  if (stored) {
    data.value = JSON.parse(stored)
  }
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
})

onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.invite-reveal-enter-active,
.invite-reveal-leave-active {
  transition: all 0.8s ease-in-out;
  transform-origin: top center;
}

.invite-reveal-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.invite-reveal-enter-to {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.invite-reveal-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.invite-reveal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}
</style>
