<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24 text-black">
    <div class="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
      <h1 class="text-3xl font-bold text-mocha mb-8">Kebijakan Privasi</h1>
      
      <div class="prose prose-mocha max-w-none text-gray-700 leading-relaxed">
        <p class="mb-6 text-gray-500 italic">Terakhir Diperbarui: 22 April 2026</p>
        
        <p class="mb-6">Kebijakan Privasi ini menjelaskan bagaimana <strong>Satu Undangan</strong> mengumpulkan, menggunakan, dan melindungi data pribadi Anda sesuai dengan UU Pelindungan Data Pribadi (UU PDP) di Indonesia.</p>

        <section class="mb-8">
          <h2 class="text-xl font-bold text-mocha mb-3">A. Informasi yang Kami Kumpulkan</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Data Identitas:</strong> Nama dan alamat email yang diperoleh melalui Google Auth.</li>
            <li><strong>Data Konten:</strong> Informasi acara pernikahan dan foto yang diunggah oleh Pengguna.</li>
            <li><strong>Data Tamu:</strong> Nama dan informasi lain yang diinput oleh tamu Pengguna melalui fitur RSVP.</li>
            <li><strong>Data Transaksi:</strong> Riwayat pembayaran yang dikelola secara aman oleh Midtrans.</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-bold text-mocha mb-3">B. Penyimpanan dan Keamanan Data</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Penyimpanan:</strong> Seluruh aset media (foto/gambar) disimpan secara aman menggunakan Cloudflare R2. Data tekstual disimpan dalam database terenkripsi kami.</li>
            <li><strong>Keamanan:</strong> Kami berkomitmen melindungi data tamu yang diinput oleh Pengguna. Namun, Pengguna (sebagai pengendali data) wajib memastikan bahwa tamu telah setuju data mereka dimasukkan ke dalam platform ini.</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-bold text-mocha mb-3">C. Berbagi Data dengan Pihak Ketiga</h2>
          <p>Kami hanya membagikan data Anda kepada mitra teknis yang diperlukan untuk menjalankan layanan:</p>
          <ul class="list-disc pl-5 mt-2 space-y-2">
            <li><strong>Google:</strong> Untuk kebutuhan verifikasi identitas (Login).</li>
            <li><strong>Midtrans:</strong> Untuk memproses transaksi pembayaran (kami tidak menyimpan data kartu kredit atau akun bank Anda).</li>
            <li><strong>Cloudflare:</strong> Untuk penyimpanan data gambar dan optimasi pengiriman konten.</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-bold text-mocha mb-3">D. Hak Anda</h2>
          <p>Sesuai hukum yang berlaku, Anda memiliki hak untuk mengakses, mengubah, atau meminta penghapusan data pribadi Anda dari server kami. Untuk permintaan ini, Anda dapat menghubungi tim kami melalui kontak resmi yang tersedia.</p>
        </section>
      </div>

      <div class="mt-12 pt-8 border-t border-gray-100">
        <router-link to="/" class="text-mocha hover:underline font-medium">← Kembali ke Beranda</router-link>
      </div>
    </div>
  </div>
</template>
