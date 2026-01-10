<template>
  <section class="section bg-ivory">
    <div class="max-w-4xl mx-auto px-6">
      <div class="text-center mb-12">
        <h2 class="heading mb-4">Pertanyaan Umum</h2>
        <p class="text-muted">Jawaban untuk hal-hal yang sering ditanyakan.</p>
      </div>

      <div class="space-y-4">
        <div v-for="(faq, index) in faqs" :key="index"
          class="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300"
          :class="{'shadow-md ring-1 ring-mocha/20': isOpen(index)}">
          <button @click="toggle(index)"
            class="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none bg-white hover:bg-gray-50 transition">
            <span class="font-semibold text-dark" :class="{'text-mocha': isOpen(index)}">{{ faq.question }}</span>
            <span class="text-mocha transition-transform duration-300" :class="{ 'rotate-180': isOpen(index) }">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </span>
          </button>
          <div v-show="isOpen(index)" class="px-6 pb-4 pt-0 text-muted text-sm leading-relaxed border-t border-gray-50 bg-gray-50/30">
            <div class="pt-4" v-html="faq.answer"></div>
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
    answer: 'Cukup pilih template yang kamu suka, isi data pernikahan, upload foto, dan undangan siap dibagikan. Prosesnya cepat dan mudah.'
  },
  {
    question: 'Apakah bisa diedit setelah disebarkan?',
    answer: 'Tentu saja. Kamu bisa mengedit informasi undangan kapan saja melalui dashboard, bahkan setelah link disebarkan ke tamu undangan.'
  },
  {
    question: 'Berapa lama undangan akan aktif?',
    answer: 'Undangan kamu akan aktif selamanya. Kami menjamin kenangan bahagiamu tersimpan aman.'
  },
  {
    question: 'Bagaimana cara menyebarkan undangannya?',
    answer: 'Kamu akan mendapatkan link unik (contoh: satuundangan.id/romeo-juliet). Link ini bisa kamu copy dan kirimkan via WhatsApp, Instagram, atau media sosial lainnya.'
  },
  {
    question: 'Apakah ada batasan jumlah tamu?',
    answer: 'Tidak ada batasan jumlah tamu. Kamu bisa menyebarkan undangan ke sebanyak mungkin orang yang kamu mau.'
  }
]
</script>