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
        <div class="bg-mocha/5 rounded-[2rem] p-8 border-2 border-mocha/30 relative shadow-2xl shadow-mocha/10 flex flex-col justify-between">
          <div class="absolute -top-4 right-8 bg-mocha text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1.5">
            <i class="fa-solid fa-crown text-accent-gold text-xs"></i> Paling Hemat & Praktis
          </div>
          
          <div>
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 rounded-2xl bg-mocha flex items-center justify-center text-white text-xl shadow-lg shadow-mocha/30">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-dark">SatuUndangan</h3>
                <span class="text-xs text-mocha font-bold">Solusi Modern Calon Pengantin</span>
              </div>
            </div>

            <ul class="space-y-6">
              <li v-for="(item, i) in positivePoints" :key="i" class="flex gap-4">
                <div class="shrink-0 w-6 h-6 rounded-full bg-mocha text-white flex items-center justify-center text-[10px] mt-1 shadow-md shadow-mocha/20">
                  <i class="fa-solid fa-check"></i>
                </div>
                <div>
                  <p class="font-bold text-dark">{{ item.title }}</p>
                  <p class="text-sm text-dark/70 leading-relaxed">{{ item.desc }}</p>
                </div>
              </li>
            </ul>
          </div>

          <!-- ROI Banner -->
          <div class="mt-8 pt-6 border-t border-mocha/15 bg-white/70 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-center sm:text-left">
              <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Estimasi Penghematan</p>
              <p class="text-sm font-bold text-dark">Hemat hingga <span class="text-emerald-600 font-extrabold text-base">80%</span> biaya cetak & kirim</p>
            </div>
            <a href="#templates" class="btn-primary text-xs px-5 py-2.5 rounded-full font-bold shadow-md shadow-mocha/20 hover:scale-105 transition-all text-center shrink-0">
              Lihat Desain
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const negativePoints = [
  { title: 'Biaya Mahal & Boncos', desc: 'Rata-rata Rp 5.000 - Rp 15.000 per lembar, belum termasuk ongkir ke rumah ratusan tamu.' },
  { title: 'Proses Lama (Mingguan)', desc: 'Desain, cetak, revisi vendor, hingga kirim kurir butuh waktu 1-3 minggu.' },
  { title: 'Fatal Kalau Ada Typo', desc: 'Salah ketik nama tamu, gelar, atau lokasi? Harus cetak ulang dengan biaya jutaan rupiah.' },
  { title: 'Distribusi Ribet & Capek', desc: 'Harus diantar fisik satu per satu. Menguras tenaga dan waktu berharga menjelang hari H.' },
]

const positivePoints = [
  { title: 'Sangat Hemat (Mulai Rp 49rb)', desc: 'Bayar sekali, sebar tanpa batas ke ribuan tamu tanpa tambahan biaya cetak atau ongkir.' },
  { title: 'Free Wedding Planner & Budgeting', desc: 'Lengkap dengan kalkulator budget biaya, countdown checklist H-180, kontak vendor, & cetak rundown.' },
  { title: 'Instan Jadi dalam 5 Menit', desc: 'Tinggal pilih tema aesthetic, isi nama & tanggal, undangan langsung aktif dan siap disebar.' },
  { title: 'Bebas Revisi Kapan Saja', desc: 'Ganti tanggal, venue, atau link maps? Edit sendiri langsung terupdate secara real-time.' },
  { title: 'Sebar Cepat via WhatsApp', desc: 'Kirim link personal nama tamu dengan 1 klik lewat WhatsApp, Instagram, atau grup keluarga.' },
]
</script>

<style scoped>
.font-playfair {
  font-family: 'Playfair Display', serif;
}
</style>
