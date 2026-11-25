<template>
  <section class="section bg-white border-t border-stone-200/70 py-20">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-16">
        <span class="text-[#8f5e38] font-semibold tracking-widest uppercase text-xs mb-2 block">Fitur Lengkap</span>
        <h2 class="text-3xl md:text-5xl font-playfair font-bold text-stone-900 mb-4">Dirancang untuk Kebutuhan Acara</h2>
        <p class="text-stone-500 max-w-2xl mx-auto text-base md:text-lg">
          Dari perencanaan anggaran hingga check-in tamu di meja resepsi dalam satu sistem terpadu.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="(feature, index) in features" :key="index"
          class="group p-6 rounded-xl border border-stone-200/80 hover:border-stone-400 transition-colors bg-white relative">
          
          <!-- Badge if present -->
          <div v-if="feature.badge" class="inline-block mb-4 bg-stone-100 text-stone-700 border border-stone-200/80 text-[10px] font-semibold px-2 py-0.5 rounded">
            {{ feature.badge }}
          </div>

          <div>
             <div
               class="w-11 h-11 rounded-lg bg-[#FAF8F5] border border-stone-200/80 text-[#8f5e38] flex items-center justify-center text-lg mb-5 group-hover:bg-stone-900 group-hover:text-white group-hover:border-stone-900 transition-colors">
               <i :class="feature.icon" aria-hidden="true"></i>
             </div>
             <h3 class="text-base font-semibold text-stone-900 mb-2">{{ feature.title }}</h3>
             <p class="text-sm text-stone-500 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    icon: 'pi pi-check-square',
    badge: 'Gratis Selamanya',
    title: 'Wedding Planner Terpadu',
    description: 'Kalkulator budget & realisasi biaya, checklist persiapan H-180 s/d Hari H, buku vendor langsung chat WhatsApp, dan generator rundown acara siap cetak.'
  },
  {
    icon: 'pi pi-whatsapp',
    badge: 'Favorit',
    title: 'Bagikan via WhatsApp',
    description: 'Impor nama tamu dari Excel/HP, buat tautan personal, lalu buka pesan siap kirim di WhatsApp untuk tiap tamu.'
  },
  {
    icon: 'pi pi-qrcode',
    badge: 'Anti Antre',
    title: 'Buku Tamu Digital & QR',
    description: 'Check-in kilat cukup scan QR code tamu dari smartphone. Meja resepsi bebas antrean panjang dan kehadiran terpantau real-time.'
  },
  {
    icon: 'pi pi-volume-up',
    title: 'Musik Latar',
    description: 'Pilih lagu favoritmu untuk menemani tamu saat membuka undangan. Bisa autoplay!'
  },
  {
    icon: 'pi pi-map-marker',
    title: 'Peta Lokasi',
    description: 'Sematkan link Google Maps venue agar tamu tinggal klik untuk buka arah jalan.'
  },
  {
    icon: 'pi pi-envelope',
    title: 'RSVP & Ucapan',
    description: 'Terima konfirmasi kehadiran dan doa restu dari tamu secara real-time.'
  },
  {
    icon: 'pi pi-gift',
    title: 'Amplop Digital',
    description: 'Tampilkan QRIS, e-wallet, dan rekening bank agar tamu mudah kirim kado cashless.'
  },
  {
    icon: 'pi pi-images',
    title: 'Galeri Foto',
    description: 'Pamerkan foto pre-wedding terbaikmu dalam tampilan galeri yang estetik.'
  },
  {
    icon: 'pi pi-clock',
    title: 'Hitung Mundur',
    description: 'Countdown timer menuju hari H untuk membangun antusiasme para tamu.'
  },
  {
    icon: 'pi pi-heart-fill',
    title: 'Love Story',
    description: 'Ceritakan perjalanan cintamu dari awal bertemu hingga pelaminan.'
  },
  {
    icon: 'pi pi-video',
    badge: 'Sinematik',
    title: 'Video Prewedding',
    description: 'Sematkan video prewedding dari YouTube (bisa disetel Unlisted agar privat), langsung putar di undangan.'
  },
  {
    icon: 'pi pi-sync',
    title: 'Revisi Sepuasnya',
    description: 'Bebas edit isi undanganmu kapan saja tanpa batasan revisi, proses instan dan cepat.'
  }
]
</script>

<style scoped>
.font-playfair {
  font-family: 'Playfair Display', serif;
}
</style>
