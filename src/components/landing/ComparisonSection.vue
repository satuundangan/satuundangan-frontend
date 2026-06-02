<template>
  <section class="py-24 bg-white relative overflow-hidden">
    <div class="max-w-6xl mx-auto px-6 relative z-10">
      <div class="text-center mb-16">
        <span class="text-mocha font-bold tracking-widest uppercase text-sm mb-2 block">Perbandingan</span>
        <h2 class="text-4xl md:text-5xl font-playfair font-bold text-dark mb-4">Kenapa Pakai Undangan Digital?</h2>
        <p class="text-muted text-lg max-w-2xl mx-auto">SatuUndangan memberikan kemudahan, kecepatan, dan fleksibilitas yang tidak dimiliki undangan konvensional.</p>
      </div>

      <div class="grid md:grid-cols-2 gap-8 items-stretch">
        <!-- Undangan Cetak -->
        <div class="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 opacity-80">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-12 h-12 rounded-2xl bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
              <i class="fa-solid fa-print"></i>
            </div>
            <h3 class="text-2xl font-bold text-dark">Undangan Cetak</h3>
          </div>

          <ul class="space-y-6">
            <li v-for="(item, i) in negativePoints" :key="i" class="flex gap-4">
              <div class="shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs mt-1">
                <i class="fa-solid fa-xmark"></i>
              </div>
              <div>
                <p class="font-bold text-dark/80">{{ item.title }}</p>
                <p class="text-sm text-muted">{{ item.desc }}</p>
              </div>
            </li>
          </ul>
        </div>

        <!-- SatuUndangan -->
        <div class="bg-mocha/5 rounded-[2rem] p-8 border-2 border-mocha/20 relative shadow-2xl shadow-mocha/10">
          <div class="absolute -top-4 right-8 bg-mocha text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
            Rekomendasi
          </div>
          
          <div class="flex items-center gap-4 mb-8">
            <div class="w-12 h-12 rounded-2xl bg-mocha flex items-center justify-center text-white text-xl shadow-lg shadow-mocha/30">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <h3 class="text-2xl font-bold text-dark">SatuUndangan</h3>
          </div>

          <ul class="space-y-6">
            <li v-for="(item, i) in positivePoints" :key="i" class="flex gap-4">
              <div class="shrink-0 w-6 h-6 rounded-full bg-mocha text-white flex items-center justify-center text-[10px] mt-1 shadow-md shadow-mocha/20">
                <i class="fa-solid fa-check"></i>
              </div>
              <div>
                <p class="font-bold text-dark">{{ item.title }}</p>
                <p class="text-sm text-muted">{{ item.desc }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const negativePoints = [
  { title: 'Biaya Mahal', desc: 'Harga per lembar tinggi, belum termasuk ongkos kirim ke rumah tamu.' },
  { title: 'Proses Lama', desc: 'Butuh waktu berhari-hari untuk desain, cetak, hingga pengiriman.' },
  { title: 'Zero Revision', desc: 'Ada typo? Gak bisa diubah kalau sudah dicetak. Uang melayang sia-sia.' },
  { title: 'Ribet Distribusi', desc: 'Harus kirim fisik satu per satu. Capek di jalan, habis waktu & tenaga.' },
]

const positivePoints = [
  { title: 'Sangat Hemat', desc: 'Cukup bayar sekali, sebar ke ribuan tamu tanpa biaya tambahan.' },
  { title: 'Proses Instan', desc: 'Hanya butuh 5 menit. Selesai isi data, undangan langsung aktif.' },
  { title: 'Unlimited Revisi', desc: 'Salah ketik atau ganti lokasi? Edit sendiri kapanpun sepuasnya gratis.' },
  { title: 'Sebar Sekali Klik', desc: 'Kirim lewat WhatsApp atau sosmed secara personal dalam hitungan detik.' },
]
</script>

<style scoped>
.font-playfair {
  font-family: 'Playfair Display', serif;
}
</style>
