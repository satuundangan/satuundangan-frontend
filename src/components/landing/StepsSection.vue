<template>
  <section class="section bg-ivory">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="heading mb-4">Cara Buat Undangan</h2>
        <p class="text-muted">Langkah mudah membuat undangan impianmu.</p>
      </div>

      <div class="grid md:grid-cols-5 gap-8 relative">
        <!-- Connecting Line (Desktop) -->
        <div class="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-sage/20 -z-10"></div>

        <div v-for="(step, index) in steps" :key="index" class="flex flex-col items-center text-center group">
          <div
            class="w-24 h-24 mb-6 rounded-full bg-white border-2 border-sage text-sage flex items-center justify-center text-3xl font-bold shadow-md group-hover:bg-sage group-hover:text-white transition-all duration-300 relative">
            {{ index + 1 }}
            
            <!-- Icon Overlay -->
            <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-mocha rounded-full flex items-center justify-center text-white text-xs">
               {{ step.icon }}
            </div>
          </div>
          <h4 class="font-bold text-dark text-lg mb-2">{{ step.title }}</h4>
          <p class="text-sm text-muted leading-relaxed px-2">{{ step.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  { title: "Mulai Desain", description: "Klik buat undangan, tanpa perlu daftar akun dulu.", icon: '🎨' },
  { title: "Pilih Template", description: "Pilih tema eksklusif yang sesuai seleramu.", icon: '🖼️' },
  { title: "Isi Data", description: "Lengkapi data mempelai, acara, dan foto.", icon: '📝' },
  { title: "Preview", description: "Lihat hasil undanganmu secara real-time.", icon: '👁️' },
  { title: "Bagikan", description: "Undangan siap disebar ke semua tamu.", icon: '🚀' },
]
</script>
