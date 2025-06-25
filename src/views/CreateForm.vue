<template>
  <div class="min-h-screen bg-[#FFF6E3] font-sans px-6 py-10">
    <h1 class="text-3xl font-bold text-mocha text-center mb-10">Langkah 3: Isi Data Undangan</h1>

    <div class="max-w-6xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-300">
      <div class="grid md:grid-cols-2 gap-8">
        <div v-if="sections.quote">
          <label class="block text-mocha font-semibold mb-2">📖 Quote Ayat</label>
          <textarea v-model="formData.quote" rows="2"
            class="w-full p-2 bg-[#FFFDF8] border border-gray-300 rounded-xl focus:ring focus:ring-gray-500 focus:outline-none resize-none"
            placeholder="Masukkan kutipan ayat..."></textarea>
        </div>

        <div v-if="sections.loveStory">
          <label class="block text-mocha font-semibold mb-2">💌 Love Story</label>
          <textarea v-model="formData.loveStory" rows="4"
            class="w-full p-2 bg-[#FFFDF8] border border-gray-300 rounded-xl focus:ring focus:ring-gray-500 focus:outline-none resize-none"
            placeholder="Ceritakan perjalanan cintamu..."></textarea>
        </div>

        <div v-if="sections.photoCouple">
          <label class="block text-mocha font-semibold mb-2">🖼️ URL Foto Mempelai</label>
          <input v-model="formData.photoCouple" type="text"
            class="w-full p-2 bg-[#FFFDF8] border border-gray-300 rounded-xl focus:ring focus:ring-gray-500 focus:outline-none"
            placeholder="https://..." />
        </div>

        <div v-if="sections.music">
          <label class="block text-mocha font-semibold mb-2">🎵 Link Musik</label>
          <input v-model="formData.music" type="text"
            class="w-full p-2 bg-[#FFFDF8] border border-gray-300 rounded-xl focus:ring focus:ring-gray-500 focus:outline-none"
            placeholder="https://..." />
        </div>

        <div v-if="sections.map">
          <label class="block text-mocha font-semibold mb-2">📍 Link Google Maps Lokasi Acara</label>
          <input v-model="formData.map" type="text"
            class="w-full p-2 bg-[#FFFDF8] border border-gray-300 rounded-xl focus:ring focus:ring-gray-500 focus:outline-none"
            placeholder="https://maps.google.com/..." />
        </div>

        <div v-if="sections.countdown">
          <label class="block text-mocha font-semibold mb-2">⏰ Tanggal & Waktu Acara</label>
          <input v-model="formData.date" type="datetime-local"
            class="w-full p-2 bg-[#FFFDF8] border border-gray-300 rounded-xl focus:ring focus:ring-gray-500 focus:outline-none" />
        </div>

        <div v-if="sections.rsvp">
          <label class="block text-mocha font-semibold mb-2">📨 RSVP Aktif?</label>
          <select v-model="formData.rsvp"
            class="w-full p-2 bg-[#FFFDF8] border border-gray-300 rounded-xl focus:ring focus:ring-gray-500 focus:outline-none">
            <option value="ya">Ya</option>
            <option value="tidak">Tidak</option>
          </select>
        </div>

        <div v-if="sections.wishes">
          <label class="block text-mocha font-semibold mb-2">💬 Tampilkan Kolom Ucapan?</label>
          <select v-model="formData.wishes"
            class="w-full p-2 bg-[#FFFDF8] border border-gray-300 rounded-xl focus:ring focus:ring-gray-500 focus:outline-none">
            <option value="ya">Ya</option>
            <option value="tidak">Tidak</option>
          </select>
        </div>

        <div v-if="sections.encryptedGuest">
          <label class="block text-mocha font-semibold mb-2">🔒 Nama Tamu Terenkripsi?</label>
          <select v-model="formData.encryptedGuest"
            class="w-full p-2 bg-[#FFFDF8] border border-gray-300 rounded-xl focus:ring focus:ring-gray-500 focus:outline-none">
            <option value="ya">Ya</option>
            <option value="tidak">Tidak</option>
          </select>
        </div>

        <div v-if="sections.denah">
          <label class="block text-mocha font-semibold mb-2">🗺️ Gambar Denah Ruangan</label>
          <input v-model="formData.denah" type="text"
            class="w-full p-2 bg-[#FFFDF8] border border-gray-300 rounded-xl focus:ring focus:ring-gray-500 focus:outline-none"
            placeholder="URL gambar denah..." />
        </div>

        <div v-if="sections.foodList">
          <label class="block text-mocha font-semibold mb-2">🍽️ Daftar Menu Makanan</label>
          <textarea v-model="formData.foodList" rows="3"
            class="w-full p-2 bg-[#FFFDF8] border border-gray-300 rounded-xl focus:ring focus:ring-gray-500 focus:outline-none resize-none"
            placeholder="Misal: Nasi Kebuli, Sate Ayam, dll..."></textarea>
        </div>

        <div v-if="sections.gift">
          <label class="block text-mocha font-semibold mb-2">🎁 Alamat Kirim Kado / Link E-Wallet</label>
          <textarea v-model="formData.gift" rows="3"
            class="w-full p-2 bg-[#FFFDF8] border border-gray-300 rounded-xl focus:ring focus:ring-gray-500 focus:outline-none resize-none"
            placeholder="Alamat rumah atau QRIS..."></textarea>
        </div>
      </div>

      <div class="text-center pt-8">
        <button @click="saveAndPreview"
          class="bg-mocha text-white font-semibold py-3 px-8 rounded-full hover:bg-mocha/90 transition-all duration-200 shadow-md">
          Lihat Preview
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const formData = ref({
  quote: '',
  loveStory: '',
  photoCouple: '',
  music: '',
  map: '',
  rsvp: 'ya',
  wishes: 'ya',
  date: '',
  denah: '',
  encryptedGuest: 'ya',
  foodList: '',
  gift: '',
})

const sections = ref({})

onMounted(() => {
  const stored = localStorage.getItem('selectedSections')
  if (!stored) return router.push('/create')
  const selected = JSON.parse(stored)
  sections.value = selected.reduce((obj, key) => {
    obj[key] = true
    return obj
  }, {})
})

function saveAndPreview() {
  localStorage.setItem('formData', JSON.stringify(formData.value))
  router.push('/preview')
}
</script>

<style scoped></style>
