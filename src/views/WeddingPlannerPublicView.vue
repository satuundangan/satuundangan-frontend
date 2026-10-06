<template>
  <div class="bg-ivory min-h-screen font-sans text-dark scroll-smooth selection:bg-amber-100 selection:text-amber-900">
    <!-- Navbar -->
    <Navbar />

    <!-- Hero Section -->
    <header class="relative pt-28 pb-20 overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-white to-ivory">
      <!-- Ambient Glows -->
      <div class="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-5xl mx-auto px-6 relative z-10 text-center space-y-6">
        <!-- Floating Pill Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-900 text-xs font-black uppercase tracking-widest shadow-xs">
          <i class="fa-solid fa-crown text-amber-600"></i>
          <span>100% Gratis Tanpa Syarat Pembayaran</span>
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
          Aplikasi <span class="bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 bg-clip-text text-transparent">Wedding Planner</span> & Kalkulator Budget Terlengkap
        </h1>

        <p class="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Semua alat penting untuk calon pengantin Indonesia: hitung rincian anggaran pernikahan, pantau 20+ checklist H-180 s/d Hari H, kelola kontak vendor, dan susun rundown acara otomatis.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <router-link
            to="/planner"
            class="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-black text-sm tracking-wide transition-all shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <i class="fa-solid fa-wand-magic-sparkles text-amber-400"></i>
            <span>Buka Wedding Planner Gratis</span>
          </router-link>

          <a
            href="#features"
            class="w-full sm:w-auto px-7 py-4 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <i class="fa-solid fa-layer-group text-slate-400"></i>
            <span>Pelajari Fitur Lengkap</span>
          </a>
        </div>

        <!-- Social Proof Metrics -->
        <div class="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium border-t border-slate-200/60 max-w-xl mx-auto">
          <div class="flex items-center gap-1.5">
            <i class="fa-solid fa-circle-check text-emerald-600"></i>
            <span>Template Standar Nasional & Adat</span>
          </div>
          <div class="flex items-center gap-1.5">
            <i class="fa-solid fa-circle-check text-emerald-600"></i>
            <span>Akses Seumur Hidup</span>
          </div>
          <div class="flex items-center gap-1.5">
            <i class="fa-solid fa-circle-check text-emerald-600"></i>
            <span>Cetak PDF & Rundown Siap TM</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 4 Main Pillars Section -->
    <section id="features" class="py-20 bg-white border-y border-stone-200/60">
      <div class="max-w-6xl mx-auto px-6 space-y-16">
        <div class="text-center space-y-3">
          <span class="text-amber-700 font-bold tracking-widest uppercase text-xs">Modul Terpadu</span>
          <h2 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            4 Alat Penting Mempersiapkan Pernikahan Impian
          </h2>
          <p class="text-sm text-slate-500 max-w-xl mx-auto">
            Disusun berdasarkan pengalaman ribuan pengantin Indonesia agar hari pernikahanmu lancar tanpa panik dan bebas boncos.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Pillar 1: Budget Calculator -->
          <div class="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-amber-400 transition-all shadow-xs space-y-4 group">
            <div class="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-wallet"></i>
            </div>
            <h3 class="text-xl font-black text-slate-900">1. Kalkulator Budget & Realisasi Biaya</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Tetapkan batas anggaran maksimal. Catat estimasi, nilai kontrak final, hingga nominal DP per pos (Gedung, Katering, MUA, Dokumentasi, dsb). Progress bar otomatis memperingatkan jika pengeluaran mulai over-budget!
            </p>
            <ul class="text-xs text-slate-600 space-y-2 pt-2 font-medium">
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Rumus otomatis sisa tagihan per vendor</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Status bayar real-time: Belum Bayar, DP, atau Lunas</li>
            </ul>
          </div>

          <!-- Pillar 2: Partner Task Tracker (Collaborative To-Do) -->
          <div class="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-400 transition-all shadow-xs space-y-4 group">
            <div class="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-user-group"></i>
            </div>
            <div class="flex items-center gap-2">
              <h3 class="text-xl font-black text-slate-900">2. Pembagian Tugas Pasangan (Partner To-Do)</h3>
              <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-100 text-blue-700">Baru</span>
            </div>
            <p class="text-sm text-slate-600 leading-relaxed">
              Bagi tugas persiapan pernikahan dengan jelas antara Groom (Pria), Bride (Wanita), Bersama, dan Panitia Keluarga. Pantau progres kerja pasangan secara transparan tanpa drama miskomunikasi.
            </p>
            <ul class="text-xs text-slate-600 space-y-2 pt-2 font-medium">
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Filter PIC tugas: Pria, Wanita, Bersama, atau Panitia</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Label prioritas mendesak (Urgent) & deadline fleksibel</li>
            </ul>
          </div>

          <!-- Pillar 3: Checklist Countdown H-180 -->
          <div class="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-emerald-400 transition-all shadow-xs space-y-4 group">
            <div class="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-list-check"></i>
            </div>
            <h3 class="text-xl font-black text-slate-900">3. Checklist Countdown H-180 s/d Hari H</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Panduan langkah demi langkah 4 fase persiapan pernikahan Indonesia: H-180 s/d H-120 (Fondasi), H-90 s/d H-60 (Dokumen KUA & Vendor), H-30 s/d H-7 (Sebar Undangan & TM), hingga Hari H (D-Day).
            </p>
            <ul class="text-xs text-slate-600 space-y-2 pt-2 font-medium">
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Termasuk panduan berkas N1-N4 & Puskesmas Catin</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Bebas menambah tugas kustom & simpan link/catatan</li>
            </ul>
          </div>

          <!-- Pillar 4: Buku Kontak Vendor -->
          <div class="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-indigo-400 transition-all shadow-xs space-y-4 group">
            <div class="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-handshake"></i>
            </div>
            <h3 class="text-xl font-black text-slate-900">4. Buku Kontak Vendor & 1-Click WhatsApp</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Simpan semua nomor PIC vendor dalam satu dashboard rapi. Tak perlu mencari-cari nomor di riwayat chat HP saat hari H. Dilengkapi tombol direct chat WhatsApp ke WO, Katering, MUA, dan Dokumentasi.
            </p>
            <ul class="text-xs text-slate-600 space-y-2 pt-2 font-medium">
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Terintegrasi langsung dengan link chat WhatsApp</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Catatan klausul kontrak dan tenggat pelunasan</li>
            </ul>
          </div>

          <!-- Pillar 5: Rundown Generator -->
          <div class="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-purple-400 transition-all shadow-xs space-y-4 group">
            <div class="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-purple-600/20 group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-clock"></i>
            </div>
            <h3 class="text-xl font-black text-slate-900">5. Susunan Rundown Hari H & Cetak PDF</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Jadwal acara pernikahan dari subuh, prosesi ijab kabul/pemberkatan, kirab pengantin, hingga penutupan acara. Siap dicetak dalam format rapi A4 untuk dibagikan saat Technical Meeting seluruh keluarga & vendor.
            </p>
            <ul class="text-xs text-slate-600 space-y-2 pt-2 font-medium">
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Format cetak A4 siap dibagikan ke seluruh panitia</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Penanggung jawab (PIC) tertera jelas per kegiatan</li>
            </ul>
          </div>

          <!-- Pillar 6: Ecosystem Sync -->
          <div class="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-teal-400 transition-all shadow-xs space-y-4 group">
            <div class="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-teal-600/20 group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-qrcode"></i>
            </div>
            <h3 class="text-xl font-black text-slate-900">6. Terkoneksi ke Undangan Digital & Meja Resepsi</h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Ekosistem terintegrasi: setelah merencanakan anggaran dan checklist, buat undangan digitalmu, kelola daftar tamu, sebar via WhatsApp otomatis, dan gunakan Scanner QR Buku Tamu di meja penerima tamu hari H.
            </p>
            <ul class="text-xs text-slate-600 space-y-2 pt-2 font-medium">
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Sinkronisasi daftar tamu & rekap RSVP riil</li>
              <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Standee QR code meja resepsi & buku tamu instan</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Tips & Guides Teaser Section -->
    <section class="py-20 bg-stone-50/60 border-b border-stone-200/60">
      <div class="max-w-5xl mx-auto px-6 space-y-12">
        <div class="text-center space-y-3">
          <span class="text-amber-700 font-bold tracking-widest uppercase text-xs">Panduan & Tips Pernikahan</span>
          <h2 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Pelajari Kiat Rencana Pernikahan Cerdas
          </h2>
          <p class="text-sm text-slate-500 max-w-lg mx-auto">
            Kumpulan artikel rekomendasi dari tim editorial SatuUndangan untuk membimbing setiap langkah persiapanmu.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <router-link
            to="/blog"
            class="p-6 rounded-3xl bg-white border border-stone-200/80 hover:border-amber-400 hover:shadow-lg transition-all group flex flex-col justify-between"
          >
            <div class="space-y-3">
              <span class="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-black uppercase">
                Legalitas KUA
              </span>
              <h3 class="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                Panduan Lengkap Syarat Nikah KUA: Berkas N1–N4 & Tes Catin Puskesmas
              </h3>
              <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                Ketahui berkas apa saja yang wajib disiapkan dari kelurahan, cara daftar SIMKAH online, hingga jadwal tes kesehatan di puskesmas.
              </p>
            </div>
            <div class="pt-4 flex items-center text-xs font-bold text-amber-700 group-hover:translate-x-1 transition-transform">
              <span>Baca Panduan</span>
              <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i>
            </div>
          </router-link>

          <router-link
            to="/blog"
            class="p-6 rounded-3xl bg-white border border-stone-200/80 hover:border-blue-400 hover:shadow-lg transition-all group flex flex-col justify-between"
          >
            <div class="space-y-3">
              <span class="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-[10px] font-black uppercase">
                Budgeting
              </span>
              <h3 class="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                Cara Mengatur Anggaran Pernikahan Agar Tidak Boncos (Rumus Pos Biaya)
              </h3>
              <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                Trik membagi persentase budget antara venue, katering, MUA, dan suvenir pernikahan dengan aman tanpa mengorbankan kualitas.
              </p>
            </div>
            <div class="pt-4 flex items-center text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
              <span>Baca Panduan</span>
              <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i>
            </div>
          </router-link>

          <router-link
            to="/blog"
            class="p-6 rounded-3xl bg-white border border-stone-200/80 hover:border-purple-400 hover:shadow-lg transition-all group flex flex-col justify-between"
          >
            <div class="space-y-3">
              <span class="px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 text-[10px] font-black uppercase">
                Hari H & Rundown
              </span>
              <h3 class="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                Susunan Acara (Rundown) Akad & Resepsi Pernikahan yang Rapi dan Tepat Waktu
              </h3>
              <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                Contoh urutan waktu dari makeup subuh, ijab kabul, kirab, sampai penutupan acara yang memudahkan koordinasi seluruh panitia keluarga.
              </p>
            </div>
            <div class="pt-4 flex items-center text-xs font-bold text-purple-700 group-hover:translate-x-1 transition-transform">
              <span>Baca Panduan</span>
              <i class="fa-solid fa-arrow-right ml-1.5 text-[10px]"></i>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-20 bg-white">
      <div class="max-w-4xl mx-auto px-6 space-y-12">
        <div class="text-center space-y-3">
          <span class="text-amber-700 font-bold tracking-widest uppercase text-xs">Pertanyaan Populer</span>
          <h2 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Pertanyaan Seputar Wedding Planner
          </h2>
        </div>

        <div class="space-y-4">
          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h4 class="font-bold text-sm text-slate-900">Apakah fitur Wedding Planner ini benar-benar gratis?</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Ya, 100% gratis tanpa biaya tersembunyi. Kamu cukup membantu follow Instagram resmi kami dan membagikan informasi SatuUndangan untuk membuka akses penuh selamanya.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h4 class="font-bold text-sm text-slate-900">Apakah saya bisa mengubah atau menambah checklist sendiri?</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Tentu saja! Kamu bebas menambahkan tugas baru, mengubah PIC penanggung jawab (Pria, Wanita, Bersama, atau Panitia), mengatur deadline, mencatat link dokumen, hingga menandai tugas yang mendesak (Urgent).
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h4 class="font-bold text-sm text-slate-900">Apakah susunan rundown acara bisa dicetak?</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Bisa. Kami menyediakan fitur tombol "Cetak Rundown" yang langsung menampilkan preview kertas ukuran A4 dan bisa dicetak atau disimpan menjadi file PDF untuk dibagikan saat Technical Meeting.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How to Unlock Section -->
    <section class="py-20 bg-ivory border-t border-stone-200/60">
      <div class="max-w-4xl mx-auto px-6 text-center space-y-10">
        <div class="space-y-3">
          <span class="text-amber-700 font-bold tracking-widest uppercase text-xs">Akses Instan</span>
          <h2 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Bagaimana Cara Membuka Akses Gratis?
          </h2>
          <p class="text-sm text-slate-600 max-w-lg mx-auto">
            Hanya butuh 30 detik untuk membuka akses penuh seumur hidup:
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div class="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 font-black text-sm flex items-center justify-center">1</div>
            <h4 class="font-bold text-sm text-slate-900">Follow Instagram</h4>
            <p class="text-xs text-slate-500">Ikuti akun resmi kami di <b>@satuundangan_official</b> untuk info tren pernikahan terkini.</p>
          </div>

          <div class="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 font-black text-sm flex items-center justify-center">2</div>
            <h4 class="font-bold text-sm text-slate-900">Bagikan ke WhatsApp</h4>
            <p class="text-xs text-slate-500">Bantu share link rekomendasi SatuUndangan ke teman atau grup WhatsApp calon pengantin.</p>
          </div>

          <div class="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div class="w-8 h-8 rounded-xl bg-purple-100 text-purple-900 font-black text-sm flex items-center justify-center">3</div>
            <h4 class="font-bold text-sm text-slate-900">Input Username IG</h4>
            <p class="text-xs text-slate-500">Ketik username Instagram kamu dan klik tombol aktifkan. Fitur langsung terbuka permanen!</p>
          </div>
        </div>

        <div class="pt-4">
          <router-link
            to="/planner"
            class="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Mulai Rencanakan Pernikahanmu Sekarang</span>
            <i class="fa-solid fa-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/layout/NavbarSection.vue'
import Footer from '@/components/layout/FooterSection.vue'
</script>
