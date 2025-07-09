<template>
  <div class="min-h-screen bg-ivory font-sans px-6 py-10">
    <h1 class="text-3xl font-bold text-mocha text-center mb-6">Langkah 2: Pilih Bagian Undangan</h1>

    <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg border-px border-sage/30">
      <!-- Template preview -->
      <h2 class="text-lg font-semibold mb-2 text-dark">Template Dipilih:</h2>
      <div class="flex items-start gap-4 mb-6">
        <img :src="selectedTemplate.previewUrl"
          class="rounded-xl shadow h-32 w-40 object-cover border-px border-sage/30" />
        <div class="flex-1 text-sm text-muted">
          <h3 class="text-base font-bold text-mocha">{{ selectedTemplate.name }}</h3>
          <p class="mb-2">{{ selectedTemplate.desc }}</p>
          <div class="flex gap-1">
            <span v-for="color in selectedTemplate.palleteColor" :key="color"
              class="w-5 h-5 rounded-full border border-gray-300" :style="{ backgroundColor: color }"></span>
          </div>
        </div>
      </div>

      <!-- Section checkbox -->
      <h2 class="text-lg font-semibold mb-2 text-dark">Pilih Komponen Undangan</h2>
      <p class="text-sm text-muted mb-4">Bikin undanganmu makin berkesan dengan bagian-bagian seru di bawah ini</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <template v-for="(section, key) in sectionOptions" :key="key">
          <label class="toggle-box" :class="{ 'active': selectedSections.includes(key) }">
            <input type="checkbox" v-model="selectedSections" :value="key" class="hidden" />
            <i class="fa-solid fa-circle-check" v-if="selectedSections.includes(key)"></i>
            {{ section }}
          </label>
        </template>
      </div>

      <!-- Button -->
      <div class="mt-8 text-center">
        <button class="btn-primary" @click="goToForm">
          Lanjut Isi Data
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedTemplate = ref({})
const selectedSections = ref([])
const sectionOptions = ref({})

onMounted(() => {
  const template = localStorage.getItem('selectedTemplate')
  if (!template) {
    router.push('/')
  } else {
    selectedTemplate.value = JSON.parse(template)
    console.log(selectedTemplate.value.sectionOptions)
  }
  if (selectedTemplate.value.sectionOptions && selectedTemplate.value.sectionOptions.length > 0) {
    sectionOptions.value = selectedTemplate.value.sectionOptions
  } else {
    sectionOptions.value = {
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
  }
})

function goToForm() {
  localStorage.setItem('selectedSections', JSON.stringify(selectedSections.value))
  router.push('/create/form')
}
</script>

<style scoped>
.toggle-box {
  font-size: 0.875rem;
  color: var(--color-text-dark);
  text-align: center;
  padding: 0.75rem 1rem;
  margin-bottom: 1%;
  border-radius: 0.75rem;
  border: 2px solid transparent;
  background-color: #f8f8f8;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  box-shadow: inset 0 0 0 1px rgba(168, 184, 162, 0.3);
}

.toggle-box:hover {
  background-color: rgba(168, 184, 162, 0.08);
  box-shadow: inset 0 0 0 2px var(--color-sage);
  transform: scale(1.02);
}

.toggle-box.active {
  background-color: var(--color-sage);
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-color: var(--color-sage);
}
</style>
