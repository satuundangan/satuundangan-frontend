<template>
  <div class="bg-ivory min-h-screen font-sans text-dark">
    <Navbar />

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
    <div v-if="showModal" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div class="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg relative">
        <button @click="showModal = false" class="absolute top-3 right-3 text-muted hover:text-dark">&times;</button>
        <h3 class="text-lg font-bold mb-4 text-mocha">Pilih Template Undangan</h3>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(item, index) in templates" :key="index" @click="selectTemplate(index)"
            :class="[selectedTemplate === index ? 'border-2 border-mocha' : 'border border-gray-200', 'rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition']">
            <img :src="item.image" alt="template" class="w-full h-32 object-cover" />
          </div>
        </div>
        <button class="mt-6 w-full btn-primary" :disabled="selectedTemplate === null" @click="goToCreate">
          Lanjut Isi Desain
        </button>
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
          <p class="text-sm text-muted">{{ step.desc }}</p>
        </div>
      </div>
    </section>

    <section class="section bg-white">
      <h2 class="heading text-center mb-12">Pilih Template Favoritmu</h2>
      <div class="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        <div v-for="(item, index) in templates" :key="index"
          class="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
          <div class="relative">
            <img :src="item.image" :alt="item.name" class="w-full h-52 object-cover" />
            <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />
          </div>
          <div class="p-5 text-center">
            <h4 class="font-semibold text-dark text-lg mb-1">{{ item.name }}</h4>
            <p class="text-sm text-muted">{{ item.desc }}</p>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/NavbarSection.vue'
import Footer from '@/components/FooterSection.vue'

const router = useRouter()
const showModal = ref(false)
const selectedTemplate = ref(null)

const steps = [
  { title: "Mulai Desain", desc: "Tanpa login, langsung mulai dari browser." },
  { title: "Pilih Template", desc: "Pilih tema undangan yang kamu suka." },
  { title: "Isi Data", desc: "Masukkan info nikah, foto, lokasi, dll." },
  { title: "Lihat Preview", desc: "Lihat hasil undanganmu secara real-time." },
  { title: "Share & Simpan", desc: "Kirim ke tamu atau simpan dulu di HP." },
]

const templates = [
  {
    name: 'Floral Pink',
    image: '/src/assets/template1.png',
    desc: 'Bunga manis untuk pasangan romantis.',
  },
  {
    name: 'Minimalist Love',
    image: '/src/assets/template2.png',
    desc: 'Tampilan simpel dan elegan buat kamu yang lowkey.',
  },
  {
    name: 'Tropical Vibes',
    image: '/src/assets/template3.png',
    desc: 'Tema tropis ceria penuh warna daun dan bunga.',
  },
];


const goToCreate = () => {
  if (selectedTemplate.value !== null) {
    localStorage.setItem('selectedTemplate', selectedTemplate.value)
    router.push('/create')
  }
}

const selectTemplate = (index) => {
  selectedTemplate.value = index
}
const testimonials = [
  {
    name: 'Rani & Aldi',
    role: 'Pengantin Bahagia',
    text: 'Bikinnya cepet banget! Semua keluarga langsung bisa akses undangannya 😍',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    name: 'Nabila',
    role: 'Sahabat Mempelai',
    text: 'Desainnya gemes banget! Gampang di-share dan interaktif.',
    avatar: 'https://i.pravatar.cc/150?img=32',
  },
  {
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
