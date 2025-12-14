<template>
  <div class="bg-ivory min-h-screen font-sans text-dark">
    <Navbar @create-invitation="showModal = true" />

    <!-- Hero Section -->
    <section class="min-h-screen bg-ivory flex flex-col justify-center items-center text-center px-4">
      <h1 class="text-5xl md:text-6xl font-bold text-mocha leading-tight font-serif">
        Undangan Digital Modern<br />Untuk Hari Spesialmu
      </h1>
      <p class="text-dark text-lg mt-4 max-w-2xl">Desain undangan digital yang cantik, simpel, dan langsung bisa kamu
        bagikan.</p>
      <button class="btn-primary mt-8" @click="showModal = true">Mulai Desain</button>
    </section>


    <!-- Modal Pilih Template -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div class="bg-white w-full max-w-5xl p-6 rounded-xl shadow-lg relative flex gap-6">

        <!-- Close Button -->
        <button @click="showModal = false"
          class="absolute top-3 right-4 text-muted hover:text-dark text-xl">&times;</button>

        <!-- Sidebar Kategori -->
        <aside class="w-1/4 border-r pr-4">
          <h4 class="text-sm font-bold text-mocha mb-3 uppercase tracking-wider">Kategori</h4>
          <ul class="space-y-2 text-sm">
            <li v-for="(cat, i) in classCategories" :key="i" @click="selectedCategory = cat" :class="[
              'cursor-pointer px-3 py-2 rounded-md',
              selectedCategory === cat ? 'bg-mocha text-white' : 'hover:bg-mocha/10 text-gray-700'
            ]">
              {{ cat }}
            </li>
          </ul>
        </aside>

        <!-- Template Grid -->
        <div class="w-3/4">
          <h3 class="text-lg font-bold mb-4 text-mocha">Pilih Template Undangan</h3>

          <div class="relative">
            <div v-if="filteredTemplates.length > 0"
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-h-[420px] max-h-[420px] overflow-y-auto p-1">
              <div v-for="(item) in filteredTemplates" :key="item.id" :ref="el => templateRefs[item.id] = el"
                @click="selectTemplate(item.id)" :class="[
                  selectedTemplate === item.id
                    ? 'border-2 border-mocha shadow-lg'
                    : 'border border-gray-200',
                  'rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] h-[270px] transition bg-white flex flex-col'
                ]">
                <img :src="item.previewUrl" alt="template" class="w-full h-32 object-cover" />
                <div class="p-3 text-left space-y-1">
                  <h4 class="text-sm font-bold text-mocha">{{ item.name }}</h4>
                  <div class="flex gap-1">
                    <span v-for="color in item.paletteColor" :key="color"
                      class="w-5 h-5 rounded-full border border-gray-300" :style="{ backgroundColor: color }"></span>
                  </div>
                  <div :class="['bg-[{{color}}] p-1 rounded-full']">
                  </div>
                  <p class="text-xs text-gray-500">{{ item.description }}</p>
                  <div class="flex flex-wrap gap-1 mt-2">
                    <span v-for="tag in item.tags" :key="tag"
                      class="text-[10px] bg-mocha/10 text-mocha px-2 py-0.5 rounded-full">
                      #{{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Coming Soon -->
            <div v-else class="h-[420px] flex items-center justify-center text-center text-gray-400 italic">
              📦 Template akan segera hadir. Stay tuned!
            </div>
          </div>

          <button
            class="mt-6 w-full btn-primary disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            :disabled="selectedTemplate === null" @click="goToCreate">
            Lanjut Isi Desain
          </button>

        </div>

      </div>
    </div>

    <!-- Why Us -->
    <section class="section bg-white text-center">
      <h2 class="heading mb-10">Kenapa Pilih satuundangan.id?</h2>
      <div class="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div class="card">
          <h3 class="subheading mb-2">Desain Elegan</h3>
          <p class="text-muted">Pilih dari template elegan yang bisa kamu sesuaikan sendiri.</p>
        </div>
        <div class="card">
          <h3 class="subheading mb-2">Desain Tanpa Daftar</h3>
          <p class="text-muted">Langsung buat dan simpan di browser. Tanpa login, tanpa ribet.</p>
        </div>
        <div class="card">
          <h3 class="subheading mb-2">Bisa Diedit Kapan Aja</h3>
          <p class="text-muted">Kamu bisa balik edit kapanpun. Simpel dan fleksibel.</p>
        </div>
      </div>
    </section>

    <section class="section bg-ivory">
      <h2 class="heading text-center mb-12">Cara Buat Undangan di satuundangan.id</h2>
      <div class="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
        <div v-for="(step, index) in steps" :key="index" class="card flex flex-col items-center text-center px-4 py-6">
          <div
            class="w-14 h-14 mb-4 rounded-full bg-sage flex items-center justify-center text-white text-xl font-bold shadow">
            {{ index + 1 }}
          </div>
          <h4 class="font-semibold text-dark mb-2">{{ step.title }}</h4>
          <p class="text-sm text-muted">{{ step.description }}</p>
        </div>
      </div>
    </section>

    <section class="section bg-white">
      <h2 class="heading text-center mb-12">Pilih Template Favoritmu</h2>
      <div class="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        <div v-for="(item) in templates.slice(0, 9)" :key="item.id" @click="selectTemplate(item.id); showModal = true;"
          class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
          <div class="relative">
            <img :src="item.previewUrl" :alt="item.name" class="w-full h-52 object-cover" />
            <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />
          </div>
          <div class="p-5 text-center">
            <h4 class="font-semibold text-dark text-lg mb-1">{{ item.name }}</h4>
            <p class="text-sm text-muted">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section bg-ivory">
      <h2 class="heading text-center mb-12">Apa Kata Mereka?</h2>
      <div class="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div v-for="(item, i) in testimonials" :key="i"
          class="bg-white rounded-xl p-6 shadow-lg border-px border-sage/30 relative">
          <svg class="w-8 h-8 text-sage absolute top-4 left-4 opacity-20" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M9 11.5a4.5 4.5 0 1 1 0-9c1.18 0 2.28.45 3.12 1.25A5.99 5.99 0 0 0 9 2a6 6 0 0 0 0 12h1v3a1 1 0 1 0 2 0v-3a1 1 0 0 0-1-1H9Zm10 0a4.5 4.5 0 1 1 0-9c1.18 0 2.28.45 3.12 1.25A5.99 5.99 0 0 0 19 2a6 6 0 0 0 0 12h1v3a1 1 0 1 0 2 0v-3a1 1 0 0 0-1-1h-1Z" />
          </svg>
          <p class="italic text-dark mb-6 mt-2">“{{ item.text }}”</p>
          <div class="flex items-center gap-4 mt-auto">
            <img :src="item.avatar" alt="avatar" class="w-12 h-12 rounded-full object-cover border border-sage/40" />
            <div>
              <h4 class="text-sm font-semibold text-dark">{{ item.name }}</h4>
              <p class="text-xs text-muted">{{ item.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/layout/NavbarSection.vue'
import Footer from '@/components/layout/FooterSection.vue'
import { getTemplateDesigns } from '@/api/templateDesign'

const router = useRouter()
const showModal = ref(false)
const selectedTemplate = ref(null)
const selectedCategory = ref('Semua')
const templateRefs = reactive({})


watch(() => showModal.value, (newVal) => {
  if (newVal) {
    document.body.classList.add('overflow-hidden')
  } else {
    document.body.classList.remove('overflow-hidden')
  }
})

watch(() => showModal.value, async (val) => {
  if (val && selectedTemplate.value) {
    await nextTick() // tunggu DOM-nya render dulu
    const el = templateRefs[selectedTemplate.value]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
})


const steps = [
  { title: "Mulai Desain", description: "Tanpa login, langsung mulai dari browser." },
  { title: "Pilih Template", description: "Pilih tema undangan yang kamu suka." },
  { title: "Isi Data", description: "Masukkan info nikah, foto, lokasi, dll." },
  { title: "Lihat Preview", description: "Lihat hasil undanganmu secara real-time." },
  { title: "Share & Simpan", description: "Kirim ke tamu atau simpan dulu di HP." },
]
const templates = ref([
  // {
  //   id: 1,
  //   name: 'Dark Elegant',
  //   slug: 'dark-elegant',
  //   previewUrl: 'https://i.pinimg.com/736x/9b/2b/45/9b2b4584e36ea2757eebe765d2184611.jpg',
  //   description: 'Elegant Dark Style dengan kesan simple romantis.',
  //   category: 'Premium',
  //   tags: ['elegant', 'manis', 'romantis'],
  //   palleteColor: {
  //     primary: '#e5e5e5',
  //     secondary: '#ffffff',
  //     accent: '#222222',
  //     background: '#ffffff',
  //     text: '#222222'
  //   },
  //   sectionOptions: [
  //     'Quote Ayat',
  //     'Love Story',
  //     'Foto Mempelai',
  //     'Musik Latar',
  //     'Google Map',
  //     'RSVP',
  //     'Ucapan untuk Mempelai',
  //     'Like Count',
  //     'Hitung Mundur',
  //     'Denah Ruangan',
  //     'Enkripsi Nama Tamu',
  //     'List Makanan/Minuman',
  //     'Amplop Digital & Alamat Kado',
  //     'Gallery',
  //   ]
  // },
]);

const classCategories = ['Semua', 'Premium', 'Eksklusif', 'Gratis']

const loading = ref(true)

onMounted(async () => {
  try {
    const data = await getTemplateDesigns()
    templates.value = data // pastikan struktur datanya sesuai!
  } catch (e) {
    console.error('Gagal ambil template:', e)
  } finally {
    loading.value = false
  }
})

const filteredTemplates = computed(() => {
  // console.log(templates)
  if (selectedCategory.value === 'Semua') return templates.value
  return templates.value.filter(t => t.category === selectedCategory.value)
})

function selectTemplate(id) {
  // console.log(id)
  selectedTemplate.value = id
}

function goToCreate() {
  localStorage.setItem('selectedTemplate', JSON.stringify(templates.value.find((t) => t.id === selectedTemplate.value)))
  showModal.value = false;
  router.push('/create')
}


const testimonials = [
  {
    id: 1,
    name: 'Rani & Aldi',
    role: 'Pengantin Bahagia',
    text: 'Bikinnya cepet banget! Semua keluarga langsung bisa akses undangannya 😍',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: 2,
    name: 'Nabila',
    role: 'Sahabat Mempelai',
    text: 'Desainnya gemes banget! Gampang di-share dan interaktif.',
    avatar: 'https://i.pravatar.cc/150?img=32',
  },
  {
    id: 3,
    name: 'Vina & Robby',
    role: 'Pengantin',
    text: 'Nggak nyangka bisa dapet hasil seprofesional ini cuma dari HP doang!',
    avatar: 'https://i.pravatar.cc/150?img=51',
  },
];
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
</style>
