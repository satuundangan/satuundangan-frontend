<template>
  <div class="bg-[#FFF6E3] min-h-screen font-sans">
    <Navbar />

    <!-- Hero Section -->
    <section class="text-center px-6 py-20">
      <h1 class="text-4xl md:text-5xl font-extrabold text-[#FFB3C6] leading-tight">
        Undangan Pernikahan Online<br />Modern & Lucu
      </h1>
      <p class="mt-4 text-gray-600 max-w-xl mx-auto">
        Buat undangan digital cantik, simpel, dan gratis! Cocok buat kamu yang pengen tampil beda.
      </p>
      <div class="mt-8 flex justify-center gap-4">
        <button class="bg-[#FFB3C6] hover:bg-[#ffa3b9] text-white font-semibold py-2 px-6 rounded-xl"
          @click="showModal = true">
          Mulai Desain Gratis
        </button>

        <button class="border border-[#FFB3C6] text-[#FFB3C6] hover:bg-[#fff0f4] font-semibold py-2 px-6 rounded-xl">
          Lihat Contoh
        </button>
      </div>
      <p class="text-xs text-gray-500 mt-2">*Tanpa daftar, langsung mulai aja. Bisa disimpan di browser kamu.</p>
    </section>

    <!-- Modal Pilih Template -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div class="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg relative">
        <button @click="showModal = false"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800">&times;</button>
        <h3 class="text-lg font-bold mb-4 text-[#FFB3C6]">Pilih Template Undangan</h3>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(item, index) in templates" :key="index" @click="selectTemplate(index)"
            :class="[selectedTemplate === index ? 'border-2 border-[#FFB3C6]' : 'border border-gray-200', 'rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition']">
            <img :src="item" alt="template" class="w-full h-32 object-cover" />
          </div>
        </div>
        <button class="mt-6 w-full bg-[#FFB3C6] text-white py-2 rounded-xl hover:bg-[#ffa3b9] font-semibold"
          :disabled="selectedTemplate === null" @click="goToCreate">
          Lanjut Isi Desain
        </button>
      </div>
    </div>

    <!-- Why Us -->
    <section class="bg-white py-16 px-6">
      <h2 class="text-3xl font-bold text-center text-[#FFB3C6] mb-8">Kenapa Pilih Kami?</h2>
      <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div class="bg-[#FFCCD2] rounded-2xl p-6 text-center shadow">
          <h3 class="font-bold text-lg">Desain Custom</h3>
          <p class="text-gray-600 text-sm">Sesuaikan warna, font, dan layout sesuai selera kamu.</p>
        </div>
        <div class="bg-[#FFCCD2] rounded-2xl p-6 text-center shadow">
          <h3 class="font-bold text-lg">Mudah Digunakan</h3>
          <p class="text-gray-600 text-sm">Buat dalam hitungan menit, tanpa ribet sama sekali.</p>
        </div>
        <div class="bg-[#FFCCD2] rounded-2xl p-6 text-center shadow">
          <h3 class="font-bold text-lg">Langsung Share</h3>
          <p class="text-gray-600 text-sm">Bagikan ke WhatsApp, Instagram, atau QR Code.</p>
        </div>
      </div>
    </section>

    <!-- Langkah Mudah -->
    <section class="py-16 px-6 bg-[#FFF6E3]">
      <h2 class="text-3xl font-bold text-center text-[#FFB3C6] mb-12">Langkah Mudah Buat Undangan</h2>
      <div class="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">

        <div class="flex flex-col items-center">
          <div class="bg-white p-6 rounded-full shadow w-20 h-20 flex items-center justify-center mb-4">
            <span class="text-[#FFB3C6] font-bold text-2xl">1</span>
          </div>
          <h4 class="font-semibold">Mulai Desain</h4>
          <p class="text-sm text-gray-600">Langsung mulai tanpa login. Desain kamu aman di browser.</p>
        </div>
        <div class="flex flex-col items-center">
          <div class="bg-white p-6 rounded-full shadow w-20 h-20 flex items-center justify-center mb-4">
            <span class="text-[#FFB3C6] font-bold text-2xl">2</span>
          </div>
          <h4 class="font-semibold">Isi Data</h4>
          <p class="text-sm text-gray-600">Masukkan info nikah & galeri foto</p>
        </div>
        <div class="flex flex-col items-center">
          <div class="bg-white p-6 rounded-full shadow w-20 h-20 flex items-center justify-center mb-4">
            <span class="text-[#FFB3C6] font-bold text-2xl">3</span>
          </div>
          <h4 class="font-semibold">Preview</h4>
          <p class="text-sm text-gray-600">Lihat hasil undangan kamu sebelum share</p>
        </div>
        <div class="flex flex-col items-center">
          <div class="bg-white p-6 rounded-full shadow w-20 h-20 flex items-center justify-center mb-4">
            <span class="text-[#FFB3C6] font-bold text-2xl">4</span>
          </div>
          <h4 class="font-semibold">Daftar</h4>
          <p class="text-sm text-gray-600">Buat akun dengan cepat dan mudah</p>
        </div>
        <div class="flex flex-col items-center">
          <div class="bg-white p-6 rounded-full shadow w-20 h-20 flex items-center justify-center mb-4">
            <span class="text-[#FFB3C6] font-bold text-2xl">5</span>
          </div>
          <h4 class="font-semibold">Sebar</h4>
          <p class="text-sm text-gray-600">Undangan siap dikirim ke semua tamu</p>
        </div>
      </div>
    </section>

    <!-- Template List -->
    <section class="py-16 px-6 bg-white">
      <h2 class="text-3xl font-bold text-center text-[#FFB3C6] mb-12">Pilih Template Favoritmu</h2>
      <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div class="bg-[#BFECFF] rounded-xl shadow overflow-hidden">
          <img src="/src/assets/template1.png" alt="Template 1" class="w-full h-48 object-cover" />
          <div class="p-4">
            <h4 class="font-semibold">Floral Pink</h4>
            <p class="text-sm text-gray-600">Tema bunga dengan sentuhan pink soft</p>
          </div>
        </div>
        <div class="bg-[#BFECFF] rounded-xl shadow overflow-hidden">
          <img src="/src/assets/template1.png" alt="Template 2" class="w-full h-48 object-cover" />
          <div class="p-4">
            <h4 class="font-semibold">Minimalist Love</h4>
            <p class="text-sm text-gray-600">Tema clean dan elegan buat pasangan simpel</p>
          </div>
        </div>
        <div class="bg-[#BFECFF] rounded-xl shadow overflow-hidden">
          <img src="/src/assets/template1.png" alt="Template 3" class="w-full h-48 object-cover" />
          <div class="p-4">
            <h4 class="font-semibold">Tropical Vibes</h4>
            <p class="text-sm text-gray-600">Tema tropis ceria dengan daun dan bunga</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 px-6 bg-[#FFF6E3]">
      <h2 class="text-2xl md:text-3xl font-bold text-center text-pink-600 mb-10">Lihat Contoh Template</h2>
      <div class="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div v-for="(img, i) in templates" :key="i"
          class="rounded-xl overflow-hidden shadow hover:scale-[1.02] transition">
          <img :src="img" alt="template" class="w-full h-60 object-cover" />
        </div>
      </div>
    </section>

    <section class="bg-[#CDC1FF]/20 py-16 px-6">
      <h2 class="text-2xl md:text-3xl font-bold text-center text-pink-600 mb-12">Apa Kata Mereka?</h2>
      <div class="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div v-for="(item, i) in testimonials" :key="i"
          class="bg-white rounded-2xl p-6 shadow-md border border-[#CDC1FF]/40">
          <p class="text-gray-700 italic mb-4">“{{ item.text }}”</p>
          <div class="flex items-center gap-4">
            <img :src="item.avatar" alt="avatar" class="w-12 h-12 rounded-full object-cover" />
            <div>
              <h4 class="font-semibold text-sm text-pink-600">{{ item.name }}</h4>
              <p class="text-xs text-gray-500">{{ item.role }}</p>
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

const templates = [
  '/src/assets/template1.png',
  '/src/assets/template1.png',
  '/src/assets/template1.png'
]

const goToCreate = () => {
  if (selectedTemplate.value !== null) {
    localStorage.setItem('selectedTemplate', selectedTemplate.value)
    console.log('apasi')
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
