<template>
  <section class="section bg-white">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="heading mb-4">Fitur Lengkap Undanganmu</h2>
        <p class="text-muted max-w-2xl mx-auto">
          Semua yang kamu butuhkan untuk membuat undangan pernikahan digital yang sempurna ada di sini.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="(feature, index) in features" :key="index"
          class="group p-6 rounded-2xl border border-gray-100 hover:border-mocha/20 hover:shadow-xl transition-all duration-300 bg-white">
          <div
            class="w-14 h-14 rounded-xl bg-ivory text-mocha flex items-center justify-center text-2xl mb-6 group-hover:bg-mocha group-hover:text-white transition-colors duration-300">
            <span>{{ feature.icon }}</span>
          </div>
          <h3 class="text-lg font-bold text-dark mb-2">{{ feature.title }}</h3>
          <p class="text-sm text-muted leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    icon: '🎵',
    title: 'Musik Latar',
    description: 'Pilih lagu favoritmu untuk menemani tamu saat membuka undangan. Bisa autoplay!'
  },
  {
    icon: '📍',
    title: 'Peta Lokasi',
    description: 'Integrasi langsung dengan Google Maps agar tamu tidak tersesat menuju venue.'
  },
  {
    icon: '📝',
    title: 'RSVP & Ucapan',
    description: 'Terima konfirmasi kehadiran dan doa restu dari tamu secara real-time.'
  },
  {
    icon: '💰',
    title: 'Amplop Digital',
    description: 'Terima kado cashless via QRIS, e-wallet, atau transfer bank dengan mudah.'
  },
  {
    icon: '📷',
    title: 'Galeri Foto',
    description: 'Pamerkan foto pre-wedding terbaikmu dalam tampilan galeri yang estetik.'
  },
  {
    icon: '⏱️',
    title: 'Hitung Mundur',
    description: 'Countdown timer menuju hari H untuk membangun antusiasme para tamu.'
  },
  {
    icon: '📖',
    title: 'Love Story',
    description: 'Ceritakan perjalanan cintamu dari awal bertemu hingga pelaminan.'
  },
  {
    icon: '📱',
    title: 'Responsive',
    description: 'Tampilan undangan yang sempurna di semua ukuran layar smartphone.'
  }
]
</script>
