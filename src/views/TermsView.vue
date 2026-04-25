<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24 text-black">
    <div class="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
      <h1 class="text-3xl font-bold text-mocha mb-8">Syarat dan Ketentuan</h1>
      
      <div class="prose prose-mocha max-w-none text-gray-700 leading-relaxed">
        <p class="mb-6 text-gray-500 italic">Terakhir Diperbarui: 22 April 2026</p>
        
        <p class="mb-6">Selamat datang di <strong>Satu Undangan</strong>. Dengan mengakses atau menggunakan platform kami, Anda (selanjutnya disebut "Pengguna") menyatakan telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat dan Ketentuan ini.</p>

        <section class="mb-8">
          <h2 class="text-xl font-bold text-mocha mb-3">A. Layanan Satu Undangan</h2>
          <p>Satu Undangan menyediakan platform SaaS untuk pembuatan undangan pernikahan digital, manajemen tamu (RSVP), galeri foto, dan fitur pendukung lainnya untuk masyarakat Indonesia.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-bold text-mocha mb-3">B. Akun dan Keamanan Data</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Otentikasi:</strong> Pendaftaran dan akses akun dilakukan melalui mekanisme Google Login. Pengguna bertanggung jawab penuh atas keamanan akun Google yang digunakan.</li>
            <li><strong>Kerahasiaan:</strong> Satu Undangan tidak bertanggung jawab atas kerugian yang diakibatkan oleh kelalaian Pengguna dalam menjaga keamanan akses akun mereka.</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-bold text-mocha mb-3">C. Konten dan Hak Cipta</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Kepemilikan:</strong> Seluruh data acara, teks, dan foto yang diunggah adalah milik Pengguna.</li>
            <li><strong>Tanggung Jawab:</strong> Pengguna bertanggung jawab penuh atas setiap konten yang diunggah. Dilarang keras menggunakan layanan untuk konten yang melanggar hukum di Indonesia, termasuk namun tidak terbatas pada:
              <ul class="list-circle pl-5 mt-2 space-y-1">
                <li>Konten asusila atau pornografi.</li>
                <li>Konten yang mengandung SARA, ujaran kebencian, atau pencemaran nama baik.</li>
                <li>Konten yang melanggar hak cipta pihak lain.</li>
              </ul>
            </li>
            <li><strong>Penindakan:</strong> Kami berhak menangguhkan atau menghapus undangan secara permanen jika ditemukan pelanggaran terhadap poin di atas tanpa kewajiban pengembalian dana.</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-bold text-mocha mb-3">D. Pembayaran dan Kebijakan Non-Refund</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Transaksi:</strong> Pembayaran layanan diproses melalui mitra payment gateway kami, Midtrans.</li>
            <li><strong>Kebijakan Refund:</strong> Mengingat Satu Undangan adalah produk digital yang bersifat instant access, maka seluruh pembayaran bersifat final. Tidak ada pengembalian dana (refund) setelah transaksi berhasil dan fitur premium diaktifkan.</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-bold text-mocha mb-3">E. Batasan Tanggung Jawab Teknis</h2>
          <p>Satu Undangan menggunakan infrastruktur pihak ketiga seperti Cloudflare R2 (penyimpanan data) dan Midtrans (prosesor pembayaran).</p>
          <p class="mt-2">Kami tidak bertanggung jawab atas kegagalan layanan, kehilangan data sementara, atau gangguan teknis yang disebabkan secara langsung oleh gangguan pada penyedia layanan pihak ketiga tersebut.</p>
        </section>
      </div>

      <div class="mt-12 pt-8 border-t border-gray-100">
        <router-link to="/" class="text-mocha hover:underline font-medium">← Kembali ke Beranda</router-link>
      </div>
    </div>
  </div>
</template>
