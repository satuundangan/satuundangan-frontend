<template>
  <div class="min-h-screen bg-[#FFF6E3] font-sans px-6 py-10">
    <h1 class="text-3xl font-bold text-[#FFB3C6] text-center mb-6">Langkah 2: Pilih Bagian Undangan</h1>

    <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
      <h2 class="text-lg font-semibold mb-4">Template Dipilih:</h2>
      <div class="mb-6">
        <img :src="selectedTemplate" class="rounded-xl shadow h-48 object-cover w-full" />
      </div>

      <h2 class="text-lg font-semibold mb-4">Pilih Komponen yang Ingin Ditampilkan:</h2>
      <div class="grid grid-cols-2 gap-4">
        <label v-for="(section, key) in sectionOptions" :key="key" class="flex items-center gap-2">
          <input type="checkbox" v-model="selectedSections" :value="key" class="accent-[#FFB3C6] w-4 h-4" />
          <span class="text-sm">{{ section }}</span>
        </label>
      </div>

      <div class="mt-8 text-center">
        <button class="bg-[#FFB3C6] hover:bg-[#ffa3b9] text-white font-bold py-2 px-6 rounded-xl" @click="goToForm">
          Lanjut Isi Data ✍️
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedTemplate = ref('')
const selectedSections = ref([])

// Section toggle options
const sectionOptions = {
  quote: 'Quote Ayat',
  loveStory: 'Love Story',
  photoCouple: 'Foto Mempelai',
  music: 'Musik Latar',
  map: 'Google Map',
  rsvp: 'RSVP',
  wishes: 'Ucapan untuk Mempelai',
  likes: 'Like Count',
  countdown: 'Hitung Mundur',
  denah: 'Denah Ruangan',
  encryptedGuest: 'Enkripsi Nama Tamu',
  foodList: 'List Makanan/Minuman',
  gift: 'Amplop Digital & Alamat Kado',
}

// Load dari localStorage saat page dimuat
onMounted(() => {
  const template = localStorage.getItem('selectedTemplate')
  console.log(template);

  if (!template) {
    router.push('/') // kalau belum pilih template, balikin ke home
  } else {
    selectedTemplate.value = template
  }
})

// Simpan section ke localStorage & lanjut
function goToForm() {
  localStorage.setItem('selectedSections', JSON.stringify(selectedSections.value))
  router.push('/create/form')
}
</script>

<style scoped>
input[type='checkbox'] {
  transform: scale(1.2);
}
</style>
