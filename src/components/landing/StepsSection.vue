<template>
  <section class="section bg-gradient-to-b from-ivory to-white relative overflow-hidden pb-32">
    <!-- Decorative Background Elements -->
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-sage/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
    <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-mocha/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

    <div class="max-w-6xl mx-auto px-6 relative z-10">
      <div class="text-center mb-20">
        <span class="text-mocha font-bold tracking-widest uppercase text-sm mb-2 block">Mudah & Cepat</span>
        <h2 class="text-4xl md:text-5xl font-playfair font-bold text-dark mb-6">Cara Buat Undangan</h2>
        <p class="text-muted max-w-xl mx-auto text-lg">Hanya butuh beberapa menit untuk membuat undangan digital impianmu. Tanpa ribet, langsung jadi.</p>
      </div>

      <div class="relative">
        <!-- Connecting Line (Desktop) -->
        <div class="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-sage/30 to-transparent -translate-y-1/2 z-0"></div>

        <div class="grid md:grid-cols-5 gap-8 md:gap-4 relative z-10">
          <div v-for="(step, index) in steps" :key="index" class="flex flex-col items-center group relative">
            
            <!-- Step Number -->
            <div class="text-[80px] font-black text-gray-100/50 absolute -top-10 -z-10 group-hover:-translate-y-2 transition-transform duration-500 font-serif select-none">
              0{{ index + 1 }}
            </div>

            <!-- Icon Container -->
            <div
              class="w-20 h-20 md:w-24 md:h-24 mb-8 rounded-2xl bg-white border border-gray-100 shadow-xl flex items-center justify-center text-3xl md:text-4xl text-sage group-hover:bg-sage group-hover:text-white group-hover:-translate-y-4 transition-all duration-500 relative z-10 rotate-3 group-hover:rotate-0">
              <i :class="step.icon"></i>
              
              <!-- Ping Animation -->
              <div v-if="index === 0" class="absolute -top-2 -right-2 w-4 h-4 bg-mocha rounded-full animate-ping opacity-75"></div>
              <div v-if="index === 0" class="absolute -top-2 -right-2 w-4 h-4 bg-mocha rounded-full"></div>
            </div>
            
            <!-- Content -->
            <div class="text-center bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-50 group-hover:shadow-md transition-all duration-300 w-full h-full">
              <h4 class="font-bold text-dark text-lg mb-2">{{ step.title }}</h4>
              <p class="text-sm text-muted leading-relaxed">{{ step.description }}</p>
            </div>
            
          </div>
        </div>
      </div>
      
      <!-- Call to action button -->
      <div class="text-center mt-20">
         <button @click="$emit('create-invitation')" class="btn-primary px-10 py-4 text-lg rounded-full shadow-xl shadow-mocha/20 hover:scale-105 transition-transform flex items-center gap-3 mx-auto">
            Mulai Buat Sekarang <i class="fa-solid fa-arrow-right"></i>
         </button>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  { title: "Mulai Desain", description: "Klik buat undangan, tanpa perlu daftar akun dulu.", icon: 'fa-solid fa-wand-magic-sparkles' },
  { title: "Pilih Template", description: "Pilih tema eksklusif yang sesuai seleramu.", icon: 'fa-solid fa-palette' },
  { title: "Isi Data", description: "Lengkapi data mempelai, acara, dan galeri foto.", icon: 'fa-solid fa-file-signature' },
  { title: "Live Preview", description: "Lihat hasil undanganmu secara real-time.", icon: 'fa-solid fa-mobile-screen' },
  { title: "Bagikan", description: "Undangan siap disebar ke semua tamu.", icon: 'fa-solid fa-paper-plane' },
]

defineEmits(['create-invitation'])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
.font-playfair {
  font-family: 'Playfair Display', serif;
}
</style>
