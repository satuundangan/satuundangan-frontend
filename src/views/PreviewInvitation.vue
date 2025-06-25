<template>
  <div class="min-h-screen bg-[#FFF6E3] px-4 py-10 font-sans text-dark">
    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-10">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-4xl font-bold text-[#FFB3C6] mb-2">Undangan Pernikahan</h1>
        <p class="text-lg text-sage">Kami mengundang dengan suka cita ke pernikahan kami</p>
      </div>

      <!-- Foto Mempelai -->
      <div v-if="data.photoCouple" class="rounded-xl overflow-hidden border border-sage/30 shadow">
        <img :src="data.photoCouple" class="w-full h-60 object-cover" />
      </div>

      <!-- Quote -->
      <div v-if="data.quote" class="bg-[#FFFDF8] p-6 rounded-xl border-l-4 border-[#FFB3C6] shadow-sm">
        <p class="italic text-center text-lg">“{{ data.quote }}”</p>
      </div>

      <!-- Love Story -->
      <div v-if="data.loveStory">
        <h2 class="text-xl font-semibold text-[#FFB3C6] mb-2">💖 Kisah Cinta</h2>
        <p class="text-sm leading-relaxed text-gray-700">{{ data.loveStory }}</p>
      </div>

      <!-- Countdown -->
      <div v-if="data.date">
        <h2 class="text-xl font-semibold text-[#FFB3C6] mb-2">📅 Tanggal & Waktu</h2>
        <p class="text-sage text-lg">{{ formatDate(data.date) }}</p>
      </div>

      <!-- Lokasi -->
      <div v-if="data.map">
        <h2 class="text-xl font-semibold text-[#FFB3C6] mb-2">📍 Lokasi Acara</h2>
        <iframe :src="data.map" class="w-full h-60 rounded-xl border border-sage/30" loading="lazy"></iframe>
      </div>

      <!-- Musik -->
      <div v-if="data.music">
        <h2 class="text-xl font-semibold text-[#FFB3C6] mb-2">🎵 Musik</h2>
        <iframe :src="embedMusic(data.music)" class="w-full h-40 rounded" allow="autoplay" allowfullscreen></iframe>
      </div>

      <!-- Denah -->
      <div v-if="data.denah">
        <h2 class="text-xl font-semibold text-[#FFB3C6] mb-2">🗺️ Denah Lokasi</h2>
        <img :src="data.denah" class="w-full rounded-xl border border-sage/30" />
      </div>

      <!-- RSVP -->
      <div v-if="data.rsvp === 'ya'">
        <h2 class="text-xl font-semibold text-[#FFB3C6] mb-2">📨 RSVP</h2>
        <p class="text-gray-600">Silakan konfirmasi kehadiran melalui fitur RSVP.</p>
      </div>

      <!-- Ucapan -->
      <div v-if="data.wishes === 'ya'">
        <h2 class="text-xl font-semibold text-[#FFB3C6] mb-2">💬 Ucapan</h2>
        <p class="text-gray-600">Tamu bisa memberikan ucapan langsung dari halaman ini.</p>
      </div>

      <!-- Enkripsi -->
      <div v-if="data.encryptedGuest === 'ya'">
        <h2 class="text-xl font-semibold text-[#FFB3C6] mb-2">🔒 Nama Tamu</h2>
        <p class="text-gray-600">Nama tamu akan terenkripsi secara otomatis untuk menjaga privasi.</p>
      </div>

      <!-- Menu -->
      <div v-if="data.foodList">
        <h2 class="text-xl font-semibold text-[#FFB3C6] mb-2">🍽️ Menu Makanan</h2>
        <ul class="list-disc pl-5 text-gray-700">
          <li v-for="item in data.foodList.split(',')" :key="item">{{ item.trim() }}</li>
        </ul>
      </div>

      <!-- Gift -->
      <div v-if="data.gift">
        <h2 class="text-xl font-semibold text-[#FFB3C6] mb-2">🎁 Amplop & Kado</h2>
        <p class="text-gray-700">{{ data.gift }}</p>
      </div>

      <!-- Tombol Share -->
      <div class="text-center pt-4">
        <button @click="saveFinal"
          class="bg-[#FFB3C6] hover:bg-[#ffa3b9] text-white font-bold py-3 px-8 rounded-full shadow-md transition-all">
          Bagikan Undangan 🔗
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const data = ref({})

onMounted(() => {
  const stored = localStorage.getItem('formData')
  if (stored) {
    data.value = JSON.parse(stored)
  }
})

function formatDate(datetime) {
  const date = new Date(datetime)
  return date.toLocaleString('id-ID', {
    dateStyle: 'full',
    timeStyle: 'short',
  })
}

function embedMusic(url) {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const id = url.includes('watch?v=') ? url.split('watch?v=')[1] : url.split('/').pop()
    return `https://www.youtube.com/embed/${id}`
  }
  if (url.includes('soundcloud.com')) {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}`
  }
  return ''
}

function saveFinal() {
  alert('Undangan berhasil dibuat! 🎉\n(Simpan ke backend coming soon 🛠️)')
}
</script>
