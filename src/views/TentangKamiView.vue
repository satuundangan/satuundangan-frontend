<template>
  <div class="min-h-screen bg-[#faf9f7] font-sans text-gray-800">
    <!-- Navbar Navigation -->
    <header class="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-40">
      <div class="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <router-link to="/" class="font-serif text-xl font-bold text-dark flex items-center gap-2">
          <span>💍</span>
          <span>Satu<span class="text-mocha">Undangan</span></span>
        </router-link>
        <div class="flex items-center gap-4 text-xs font-semibold">
          <router-link to="/" class="text-stone-600 hover:text-mocha transition">Beranda</router-link>
          <router-link to="/#pricing" class="text-stone-600 hover:text-mocha transition">Harga</router-link>
          <router-link to="/#templates" class="text-stone-600 hover:text-mocha transition">Katalog Tema</router-link>
          <router-link to="/create" class="px-4 py-2 rounded-full bg-mocha text-white hover:bg-mocha/90 transition shadow-sm">
            Buat Undangan
          </router-link>
        </div>
      </div>
    </header>

    <!-- Header -->
    <div class="bg-[#1c1917] text-white py-16 sm:py-20">
      <div class="max-w-3xl mx-auto px-6 text-center">
        <span class="inline-block px-3.5 py-1 rounded-full bg-white/10 text-stone-300 text-xs font-semibold uppercase tracking-wider mb-3">
          Profil &amp; Standar Layanan
        </span>
        <h1 class="font-serif text-4xl md:text-5xl font-bold mb-4">Tentang Kami</h1>
        <p class="text-stone-300 text-base sm:text-lg">Berawal dari Eksplorasi, Berkembang Menjadi Solusi Pernikahan Indonesia</p>
      </div>
    </div>

    <!-- Content -->
    <main class="max-w-3xl mx-auto px-6 py-12 space-y-12 leading-relaxed">
      <!-- Story -->
      <section class="space-y-4 text-stone-700">
        <p>
          Satu Undangan lahir dari semangat eksplorasi dan kecintaan terhadap pengembangan teknologi.
          Sekitar dua tahun yang lalu, platform ini bermula dari sebuah <em>weekend project</em> yang
          diinisiasi oleh kami. Pada awalnya, proyek ini murni dibangun sebagai wadah
          <em>hands-on</em> untuk mempelajari dan mendalami ekosistem framework modern, secara
          spesifik menggunakan NestJS untuk backend dan VueJS untuk frontend.
        </p>

        <p>
          Seiring berjalannya waktu, barisan kode yang pada mulanya hanya menjadi sarana belajar ini
          bertumbuh menjadi sesuatu yang lebih besar dan matang. Kami menyadari bahwa infrastruktur
          dan teknologi yang kami bangun tidak hanya sekadar eksperimen akhir pekan, melainkan dapat
          memberikan manfaat nyata—membantu banyak orang merayakan momen spesial mereka melalui
          platform undangan digital yang praktis, elegan, dan mudah dikelola.
        </p>

        <p>
          Kini, Satu Undangan terus berinovasi menjadi layanan SaaS (<em>Software as a Service</em>)
          yang andal. Kami percaya bahwa setiap momen berharga layak dibagikan dengan cara yang
          istimewa, dan kami di sini untuk mewujudkannya melalui sentuhan teknologi yang tepat guna.
        </p>
      </section>

      <!-- Operational Standards & Customer Trust (ADM-091 & ADM-092) -->
      <section class="border-t border-stone-200 pt-10">
        <div class="text-center sm:text-left mb-8">
          <span class="text-xs uppercase font-extrabold tracking-widest text-mocha block mb-1">
            Standar Layanan &amp; Transparansi
          </span>
          <h2 class="font-serif text-2xl sm:text-3xl font-bold text-dark">
            Komitmen Operasional &amp; Keamanan Pengguna
          </h2>
          <p class="text-sm text-stone-600 mt-2">
            Kami mengutamakan kejujuran harga, keandalan server, dan dukungan purnajual yang responsif bagi setiap pasangan.
          </p>
        </div>

        <div class="grid sm:grid-cols-2 gap-5">
          <!-- Pillar 1: Customer Support Hours & SLA -->
          <div class="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center text-lg">
              <i class="fa-solid fa-headset"></i>
            </div>
            <h3 class="font-bold text-base text-dark">Jam Operasional CS &amp; SLA Respon Cepat</h3>
            <p class="text-xs text-stone-600 leading-relaxed">
              Tim Customer Support kami siap mendampingi setiap hari <strong>pukul 08.00 – 21.00 WIB</strong>. Kami berkomitmen memberikan balasan dengan <strong>SLA respon rata-rata di bawah 15 menit</strong> untuk konsultasi teknis, bantuan pengisian data, maupun kendala aktivasi.
            </p>
            <div class="pt-2 flex flex-col gap-1.5 text-xs text-stone-700 font-medium">
              <div class="flex items-center gap-2">
                <i class="fa-brands fa-whatsapp text-emerald-600 text-sm"></i>
                <span>WhatsApp CS: <b>+62 851-2126-6550</b></span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-envelope text-mocha text-sm"></i>
                <span>Email Dukungan: <b>support@satuundangan.id</b></span>
              </div>
            </div>
          </div>

          <!-- Pillar 2: Licensed Payment Gateway -->
          <div class="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center text-lg">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <h3 class="font-bold text-base text-dark">Pembayaran Berlisensi Bank Indonesia</h3>
            <p class="text-xs text-stone-600 leading-relaxed">
              Seluruh transaksi pembayaran digital diproses secara instan dan otomatis melalui payment gateway resmi <strong>Midtrans</strong> yang berizin dan diawasi ketat oleh <strong>Bank Indonesia</strong>.
            </p>
            <div class="pt-2 flex flex-col gap-1.5 text-xs text-stone-700 font-medium">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-lock text-emerald-600 text-xs"></i>
                <span>Enkripsi SSL 256-bit &amp; PCI-DSS Level 1</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-qrcode text-red-500 text-xs"></i>
                <span>QRIS Instant &amp; Virtual Account Seluruh Bank</span>
              </div>
            </div>
          </div>

          <!-- Pillar 3: Zero-Risk Reassurance -->
          <div class="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-3">
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center text-lg">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <h3 class="font-bold text-base text-dark">Transparansi Biaya &amp; Coba Gratis</h3>
            <p class="text-xs text-stone-600 leading-relaxed">
              Kamu bebas mencoba, mendesain, dan mengedit template sepuasnya secara gratis tanpa perlu kartu kredit di awal. <strong>Kamu hanya membayar saat undangan siap disebarkan</strong>. Tidak ada biaya langganan berulang (*no recurring fees*).
            </p>
            <div class="pt-2 text-xs text-stone-700 font-medium">
              <span class="inline-flex items-center gap-1.5 text-blue-800">
                <i class="fa-solid fa-circle-check text-blue-600 text-xs"></i>
                Bebas ganti template &amp; edit tanpa batas
              </span>
            </div>
          </div>

          <!-- Pillar 4: Cloud Stability & Active Period Guarantee -->
          <div class="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-3">
            <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center text-lg">
              <i class="fa-solid fa-clock-rotate-left"></i>
            </div>
            <h3 class="font-bold text-base text-dark">Masa Aktif 365 + 1 Hari Penuh</h3>
            <p class="text-xs text-stone-600 leading-relaxed">
              Setiap undangan digital aktif selama <strong>365 + 1 hari (1 tahun penuh)</strong> sejak pembuatan. Link undangan dan momen kenangan bahagia tetap aman diakses oleh keluarga sebelum, saat hari H, hingga sesudah resepsi selesai.
            </p>
            <div class="pt-2 text-xs text-stone-700 font-medium">
              <span class="inline-flex items-center gap-1.5 text-purple-800">
                <i class="fa-solid fa-cloud text-purple-600 text-xs"></i>
                Server berkinerja tinggi, cepat dibuka ribuan tamu
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Developers -->
      <section class="border-t border-stone-200 pt-10">
        <h2 class="font-serif text-2xl font-bold text-[#1c1917] mb-2">
          Pengembang di Balik Satu Undangan
        </h2>
        <p class="text-sm text-stone-600 mb-6">Platform ini dibangun dan dikembangkan secara mandiri oleh:</p>
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="flex items-center gap-4 p-4 rounded-xl bg-white border border-stone-200">
            <div class="w-12 h-12 rounded-full bg-[#1c1917] flex items-center justify-center text-white font-serif font-bold text-lg shrink-0">
              R
            </div>
            <div>
              <p class="font-bold text-[#1c1917]">Muhammad Refda</p>
              <p class="text-xs text-stone-500 mb-1">Software Engineer</p>
              <a
                href="https://www.linkedin.com/in/mrefda/?locale=in"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <i class="fa-brands fa-linkedin"></i>
                <span>Profil LinkedIn</span>
              </a>
            </div>
          </div>

          <div class="flex items-center gap-4 p-4 rounded-xl bg-white border border-stone-200">
            <div class="w-12 h-12 rounded-full bg-[#1c1917] flex items-center justify-center text-white font-serif font-bold text-lg shrink-0">
              F
            </div>
            <div>
              <p class="font-bold text-[#1c1917]">Muhammad Fauzan</p>
              <p class="text-xs text-stone-500 mb-1">Software Engineer</p>
              <a
                href="https://www.linkedin.com/in/muhammad-fauzanlm/?locale=in"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <i class="fa-brands fa-linkedin"></i>
                <span>Profil LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-stone-200 py-8 text-center text-xs text-stone-500">
      <div class="max-w-4xl mx-auto px-6 space-y-2">
        <p>&copy; {{ new Date().getFullYear() }} SatuUndangan. Hak Cipta Dilindungi Undang-Undang.</p>
        <div class="flex items-center justify-center gap-4 text-xs font-medium">
          <router-link to="/privacy" class="hover:text-mocha">Kebijakan Privasi</router-link>
          <span>•</span>
          <router-link to="/terms" class="hover:text-mocha">Syarat &amp; Ketentuan</router-link>
          <span>•</span>
          <router-link to="/#pricing" class="hover:text-mocha">Paket Harga</router-link>
        </div>
      </div>
    </footer>
  </div>
</template>
