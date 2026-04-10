<template>
  <section class="section bg-white relative overflow-hidden py-24">
    <!-- Subtle Background Pattern -->
    <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>

    <div class="max-w-7xl mx-auto px-6 relative z-10">
      <div class="text-center mb-20">
        <span class="text-mocha font-bold tracking-widest uppercase text-sm mb-2 block">Fitur Premium</span>
        <h2 class="text-4xl md:text-5xl font-playfair font-bold text-dark mb-6">Fitur Lengkap Undanganmu</h2>
        <p class="text-muted max-w-2xl mx-auto text-lg">
          Semua yang kamu butuhkan untuk membuat undangan pernikahan digital yang sempurna dan berkesan ada di sini.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(feature, index) in features" :key="index"
          class="group p-8 rounded-3xl border border-gray-100 hover:border-mocha/30 hover:shadow-2xl transition-all duration-500 bg-white relative overflow-hidden">
          
          <!-- Hover Gradient Background -->
          <div class="absolute inset-0 bg-gradient-to-br from-ivory/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div class="relative z-10">
             <div
               class="w-16 h-16 rounded-2xl bg-ivory text-mocha flex items-center justify-center text-3xl mb-8 group-hover:bg-mocha group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
               <i :class="feature.icon"></i>
             </div>
             <h3 class="text-xl font-bold text-dark mb-3 group-hover:text-mocha transition-colors">{{ feature.title }}</h3>
             <p class="text-sm text-muted leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    icon: 'fa-solid fa-music',
    title: 'Musik Latar',
    description: 'Pilih lagu favoritmu untuk menemani tamu saat membuka undangan. Bisa autoplay!'
  },
  {
    icon: 'fa-solid fa-map-location-dot',
    title: 'Peta Lokasi',
    description: 'Integrasi langsung dengan Google Maps agar tamu tidak tersesat menuju venue.'
  },
  {
    icon: 'fa-solid fa-envelope-open-text',
    title: 'RSVP & Ucapan',
    description: 'Terima konfirmasi kehadiran dan doa restu dari tamu secara real-time.'
  },
  {
    icon: 'fa-solid fa-gift',
    title: 'Amplop Digital',
    description: 'Terima kado cashless via QRIS, e-wallet, atau transfer bank dengan mudah.'
  },
  {
    icon: 'fa-solid fa-images',
    title: 'Galeri Foto',
    description: 'Pamerkan foto pre-wedding terbaikmu dalam tampilan galeri yang estetik.'
  },
  {
    icon: 'fa-solid fa-hourglass-half',
    title: 'Hitung Mundur',
    description: 'Countdown timer menuju hari H untuk membangun antusiasme para tamu.'
  },
  {
    icon: 'fa-solid fa-heart',
    title: 'Love Story',
    description: 'Ceritakan perjalanan cintamu dari awal bertemu hingga pelaminan.'
  },
  {
    icon: 'fa-solid fa-mobile-screen',
    title: 'Responsive & Cepat',
    description: 'Tampilan undangan yang sempurna dan loading cepat di semua ukuran layar.'
  }
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
.font-playfair {
  font-family: 'Playfair Display', serif;
}
</style>
