<template>
  <div class="min-h-screen bg-[#FFF6E3] font-sans px-6 py-10">
    <h1 class="text-3xl font-bold text-[#FFB3C6] text-center mb-6">Langkah 3: Isi Data Undangan</h1>

    <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-6">
      <div v-if="sections.quote">
        <label class="font-semibold block mb-1">Quote Ayat</label>
        <textarea v-model="formData.quote" class="w-full p-2 rounded border" rows="2"
          placeholder="Masukkan kutipan ayat..."></textarea>
      </div>

      <div v-if="sections.loveStory">
        <label class="font-semibold block mb-1">Love Story</label>
        <textarea v-model="formData.loveStory" class="w-full p-2 rounded border" rows="4"
          placeholder="Ceritakan perjalanan cintamu..."></textarea>
      </div>

      <div v-if="sections.photoCouple">
        <label class="font-semibold block mb-1">URL Foto Mempelai</label>
        <input v-model="formData.photoCouple" type="text" class="w-full p-2 rounded border" placeholder="https://..." />
      </div>

      <div v-if="sections.music">
        <label class="font-semibold block mb-1">Link Musik (YouTube / SoundCloud)</label>
        <input v-model="formData.music" type="text" class="w-full p-2 rounded border" placeholder="https://..." />
      </div>

      <div v-if="sections.map">
        <label class="font-semibold block mb-1">Link Google Maps Lokasi Acara</label>
        <input v-model="formData.map" type="text" class="w-full p-2 rounded border"
          placeholder="https://maps.google.com/..." />
      </div>

      <div v-if="sections.rsvp">
        <label class="font-semibold block mb-1">RSVP Aktif?</label>
        <select v-model="formData.rsvp" class="w-full p-2 rounded border">
          <option value="ya">Ya</option>
          <option value="tidak">Tidak</option>
        </select>
      </div>

      <div v-if="sections.wishes">
        <label class="font-semibold block mb-1">Tampilkan Kolom Ucapan?</label>
        <select v-model="formData.wishes" class="w-full p-2 rounded border">
          <option value="ya">Ya</option>
          <option value="tidak">Tidak</option>
        </select>
      </div>

      <div v-if="sections.countdown">
        <label class="font-semibold block mb-1">Tanggal & Waktu Acara</label>
        <input v-model="formData.date" type="datetime-local" class="w-full p-2 rounded border" />
      </div>

      <div v-if="sections.denah">
        <label class="font-semibold block mb-1">Gambar Denah Ruangan</label>
        <input v-model="formData.denah" type="text" class="w-full p-2 rounded border"
          placeholder="URL gambar denah..." />
      </div>

      <div v-if="sections.encryptedGuest">
        <label class="font-semibold block mb-1">Nama Tamu Terenkripsi?</label>
        <select v-model="formData.encryptedGuest" class="w-full p-2 rounded border">
          <option value="ya">Ya</option>
          <option value="tidak">Tidak</option>
        </select>
      </div>

      <div v-if="sections.foodList">
        <label class="font-semibold block mb-1">Daftar Menu Makanan</label>
        <textarea v-model="formData.foodList" class="w-full p-2 rounded border" rows="3"
          placeholder="Misal: Nasi Kebuli, Sate Ayam, dll..."></textarea>
      </div>

      <div v-if="sections.gift">
        <label class="font-semibold block mb-1">Alamat Kirim Kado / Link E-Wallet</label>
        <textarea v-model="formData.gift" class="w-full p-2 rounded border" rows="3"
          placeholder="Alamat rumah atau QRIS..."></textarea>
      </div>

      <div class="text-center pt-4">
        <button @click="saveAndPreview"
          class="bg-[#FFB3C6] hover:bg-[#ffa3b9] text-white font-bold py-2 px-6 rounded-xl">
          Lihat Preview 🎉
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
  if (!stored) return router.push('/create') // fallback kalau belum milih
  const selected = JSON.parse(stored)
  // convert jadi object boolean buat gampang v-if
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
