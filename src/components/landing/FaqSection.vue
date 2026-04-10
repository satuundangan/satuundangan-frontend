<template>
  <section class="section bg-ivory relative py-24">
    <!-- Decorative Circle -->
    <div class="absolute top-1/2 left-0 w-64 h-64 bg-sage/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
    <div class="absolute bottom-0 right-0 w-80 h-80 bg-mocha/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/3"></div>

    <div class="max-w-4xl mx-auto px-6 relative z-10">
      <div class="text-center mb-16">
        <span class="text-mocha font-bold tracking-widest uppercase text-sm mb-2 block">Bantuan</span>
        <h2 class="text-4xl md:text-5xl font-playfair font-bold text-dark mb-4">Pertanyaan Umum</h2>
        <p class="text-muted text-lg max-w-xl mx-auto">Jawaban untuk hal-hal yang sering ditanyakan seputar pembuatan undangan digital.</p>
      </div>

      <div class="space-y-4">
        <div v-for="(faq, index) in faqs" :key="index"
          class="bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-md"
          :class="{'shadow-xl ring-1 ring-mocha/20 scale-[1.02]': isOpen(index)}">
          <button @click="toggle(index)"
            class="w-full px-8 py-6 text-left flex justify-between items-center focus:outline-none bg-white hover:bg-gray-50 transition-colors group">
            <span class="font-bold text-lg text-dark group-hover:text-mocha transition-colors" :class="{'text-mocha': isOpen(index)}">
              {{ faq.question }}
            </span>
            <span class="text-mocha transition-transform duration-500 flex items-center justify-center w-8 h-8 rounded-full bg-ivory" :class="{ 'rotate-180 bg-mocha text-white': isOpen(index) }">
              <i class="fa-solid fa-chevron-down text-sm"></i>
            </span>
          </button>
          
          <div v-show="isOpen(index)" class="px-8 pb-6 pt-0 text-muted leading-relaxed bg-white">
            <div class="w-12 h-px bg-mocha/20 mb-4"></div>
            <div v-html="faq.answer" class="text-[15px]"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const openIndex = ref(null)

const toggle = (index) => {
  openIndex.value = openIndex.value === index ? null : index
}

const isOpen = (index) => openIndex.value === index

const faqs = [
  {
    question: 'Bagaimana cara membuat undangan?',
    answer: 'Cukup pilih template yang kamu suka, isi data pernikahan, upload foto, dan undangan siap dibagikan. Prosesnya cepat, mudah, dan bisa langsung kamu lihat preview-nya.'
  },
  {
    question: 'Apakah bisa diedit setelah disebarkan?',
    answer: 'Tentu saja. Kamu bisa mengedit informasi undangan kapan saja melalui dashboard, bahkan setelah link disebarkan ke tamu undangan. Perubahan akan langsung terlihat secara real-time.'
  },
  {
    question: 'Berapa lama undangan akan aktif?',
    answer: 'Undangan kamu akan aktif selamanya tanpa ada batasan waktu. Kami menjamin kenangan hari bahagiamu tersimpan aman dan bisa diakses kapanpun.'
  },
  {
    question: 'Bagaimana cara menyebarkan undangannya?',
    answer: 'Kamu akan mendapatkan link unik (contoh: <strong>satuundangan.id/romeo-juliet</strong>). Link ini bisa kamu copy dan kirimkan via WhatsApp, Instagram, atau media sosial lainnya. Kamu juga bisa membuat link khusus untuk masing-masing nama tamu.'
  },
  {
    question: 'Apakah ada batasan jumlah tamu yang bisa diundang?',
    answer: 'Tidak ada batasan jumlah tamu! Kamu bebas menyebarkan link undangan digitalmu ke sebanyak mungkin orang yang kamu mau, ke seluruh dunia tanpa biaya tambahan.'
  }
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
.font-playfair {
  font-family: 'Playfair Display', serif;
}
</style>
