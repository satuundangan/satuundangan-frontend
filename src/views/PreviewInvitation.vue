<template>
  <div class="bg-[#FFF6E3] min-h-screen font-sans px-6 py-10">
    <h1 class="text-3xl font-bold text-center text-[#FFB3C6] mb-8">🎉 Preview Undangan</h1>

    <div class="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow space-y-6 text-gray-700">
      <div v-if="data.quote">
        <h2 class="font-bold text-xl text-[#FFB3C6] mb-2">📖 Kutipan Ayat</h2>
        <blockquote class="italic border-l-4 border-pink-300 pl-4">{{ data.quote }}</blockquote>
      </div>

      <div v-if="data.loveStory">
        <h2 class="font-bold text-xl text-[#FFB3C6] mb-2">💌 Love Story</h2>
        <p>{{ data.loveStory }}</p>
      </div>

      <div v-if="data.photoCouple">
        <h2 class="font-bold text-xl text-[#FFB3C6] mb-2">👰🤵 Foto Mempelai</h2>
        <img :src="data.photoCouple" alt="Foto Mempelai" class="w-full rounded-xl shadow" />
      </div>

      <div v-if="data.music">
        <h2 class="font-bold text-xl text-[#FFB3C6] mb-2">🎶 Musik Pilihan</h2>
        <iframe :src="embedMusic(data.music)" class="w-full h-40 rounded" allow="autoplay" allowfullscreen></iframe>
      </div>

      <div v-if="data.map">
        <h2 class="font-bold text-xl text-[#FFB3C6] mb-2">📍 Lokasi Acara</h2>
        <iframe :src="data.map" class="w-full h-60 rounded" loading="lazy"></iframe>
      </div>

      <div v-if="data.rsvp === 'ya'">
        <h2 class="font-bold text-xl text-[#FFB3C6] mb-2">📝 RSVP</h2>
        <p>Fitur RSVP akan ditampilkan untuk tamu mengisi kehadiran.</p>
      </div>

      <div v-if="data.wishes === 'ya'">
        <h2 class="font-bold text-xl text-[#FFB3C6] mb-2">💬 Kolom Ucapan</h2>
        <p>Tamu bisa memberikan ucapan langsung di halaman undangan.</p>
      </div>

      <div v-if="data.date">
        <h2 class="font-bold text-xl text-[#FFB3C6] mb-2">⏳ Hitung Mundur</h2>
        <p>Acara akan dimulai pada: <strong>{{ formatDate(data.date) }}</strong></p>
      </div>

      <div v-if="data.denah">
        <h2 class="font-bold text-xl text-[#FFB3C6] mb-2">🗺️ Denah Ruangan</h2>
        <img :src="data.denah" alt="Denah Acara" class="w-full rounded-xl shadow" />
      </div>

      <div v-if="data.encryptedGuest === 'ya'">
        <h2 class="font-bold text-xl text-[#FFB3C6] mb-2">🔒 Enkripsi Nama Tamu</h2>
        <p>Nama tamu akan dienkripsi agar tidak bisa diganti oleh tamu lain.</p>
      </div>

      <div v-if="data.foodList">
        <h2 class="font-bold text-xl text-[#FFB3C6] mb-2">🍽️ Menu Makanan & Minuman</h2>
        <ul class="list-disc ml-5">
          <li v-for="item in data.foodList.split(',')" :key="item">{{ item.trim() }}</li>
        </ul>
      </div>

      <div v-if="data.gift">
        <h2 class="font-bold text-xl text-[#FFB3C6] mb-2">🎁 Amplop & Kado</h2>
        <p>{{ data.gift }}</p>
      </div>

      <div class="text-center pt-8">
        <button @click="saveFinal"
          class="bg-[#FFB3C6] hover:bg-[#ffa3b9] text-white font-semibold py-2 px-6 rounded-xl">
          Simpan & Sebar 🔗
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
    const id = url.includes('watch?v=')
      ? url.split('watch?v=')[1]
      : url.split('/').pop()
    return `https://www.youtube.com/embed/${id}`
  }
  if (url.includes('soundcloud.com')) {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}`
  }
  return ''
}

function saveFinal() {
  alert('Undangan disimpan! (belum ada backend bro 😅)')
  // bisa langsung generate UUID, simpan localStorage/IndexedDB
}
</script>
