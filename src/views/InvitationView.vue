<template>
  <MusicControl />

  <div class="bg-[#FFF6E3] text-gray-800 font-sans">
    <!-- Hero Section -->
    <section
      class="min-h-screen flex flex-col justify-center items-center text-center px-6 py-20 bg-gradient-to-b from-[#BFECFF] via-[#FFF6E3] to-[#FFCCEA]">
      <h1 class="text-4xl md:text-6xl font-extrabold text-pink-600 leading-tight">Adam & Aisyah</h1>
      <p class="mt-4 text-lg md:text-xl text-gray-700">Akan melangsungkan pernikahan pada</p>
      <p class="mt-1 text-xl md:text-2xl font-semibold text-[#7C3AED]">Sabtu, 20 Juli 2025</p>
      <div class="mt-10">
        <button class="bg-[#FFCCEA] text-white font-semibold px-6 py-2 rounded-xl hover:opacity-90 transition">Lihat
          Detail</button>
      </div>
    </section>

    <!-- Ayat Section -->
    <section class="min-h-screen flex flex-col justify-center items-center text-center py-16 px-6 bg-white text-center">
      <h2 class="text-2xl font-bold text-pink-600 mb-4">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</h2>
      <p class="italic text-gray-700 max-w-2xl mx-auto">
        "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri,
        agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
        <br />
        <span class="text-sm">(QS. Ar-Rum: 21)</span>
      </p>
    </section>

    <!-- Couple Section -->
    <section class="min-h-screen flex flex-col justify-center items-center text-center py-16 px-6 text-center">
      <h2 class="text-3xl font-bold text-pink-600 mb-8">Mempelai</h2>
      <div class="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto items-center">
        <div>
          <img src="https://images/wanita.png" alt="wanita" class="w-40 h-40 rounded-full mx-auto mb-4" />
          <h3 class="text-xl font-semibold">Aisyah Zahra</h3>
          <p class="text-sm text-gray-600">Putri dari Bpk. Ahmad & Ibu Siti</p>
        </div>
        <div>
          <img src="https://images/pria.png" alt="pria" class="w-40 h-40 rounded-full mx-auto mb-4" />
          <h3 class="text-xl font-semibold">Muhammad Adam</h3>
          <p class="text-sm text-gray-600">Putra dari Bpk. Yusuf & Ibu Fatimah</p>
        </div>
      </div>
    </section>

    <!-- Acara Section -->
    <section
      class="min-h-screen flex flex-col justify-center items-center text-center py-16 px-6 bg-[#CDC1FF]/20 text-center">
      <h2 class="text-3xl font-bold text-pink-600 mb-8">Rangkaian Acara</h2>
      <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div class="bg-white rounded-xl shadow p-6">
          <h3 class="text-xl font-semibold text-[#7C3AED] mb-2">Akad Nikah</h3>
          <p class="text-sm text-gray-600">Sabtu, 20 Juli 2025 | 08.00 WIB</p>
          <p class="text-sm text-gray-600">Masjid Raya Al-Azhar, Jakarta</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6">
          <h3 class="text-xl font-semibold text-[#7C3AED] mb-2">Resepsi</h3>
          <p class="text-sm text-gray-600">Sabtu, 20 Juli 2025 | 11.00 - 14.00 WIB</p>
          <p class="text-sm text-gray-600">Gedung Graha MSS, Jakarta Selatan</p>
        </div>
      </div>
    </section>

    <!-- Countdown Section -->
    <section class="min-h-screen flex flex-col justify-center items-center text-center py-16 bg-white px-6 text-center">
      <h2 class="text-3xl font-bold text-pink-600 mb-6">Hitung Mundur</h2>
      <div class="text-4xl font-bold text-[#7C3AED]">44 Hari 13 Jam 20 Menit</div>
    </section>

    <!-- Gallery Section -->
    <section class="min-h-screen  flex flex-col justify-center items-center text-center py-16 px-6 bg-[#BFECFF]/30">
      <h2 class="text-3xl font-bold text-pink-600 text-center mb-8">Galeri Cinta Kami</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        <img v-for="n in 8" :key="n" :src="`https://images/prewed${n}.jpg`"
          class="w-full h-48 min-w-48 object-cover rounded-xl shadow" />
      </div>
    </section>

    <!-- RSVP Section -->
    <section
      class="min-h-screen  flex flex-col justify-center items-center text-center py-16 px-6 text-center bg-white">
      <h2 class="text-3xl font-bold text-pink-600 mb-6">Konfirmasi Kehadiran</h2>
      <form class="max-w-md mx-auto space-y-4">
        <input type="text" placeholder="Nama Lengkap" class="w-full border border-gray-300 rounded-lg px-4 py-2" />
        <select class="w-full border border-gray-300 rounded-lg px-4 py-2">
          <option value="">Apakah Anda akan hadir?</option>
          <option value="yes">Hadir</option>
          <option value="no">Maaf tidak bisa</option>
        </select>
        <textarea rows="3" placeholder="Ucapan & Doa"
          class="w-full border border-gray-300 rounded-lg px-4 py-2"></textarea>
        <button type="submit"
          class="bg-[#FFCCEA] text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition">Kirim</button>
      </form>
    </section>

    <section class="py-10 px-6 bg-[#FFF6E3] text-center">
      <h2 class="text-2xl font-bold text-pink-600 mb-4">Sebarkan Undangan</h2>
      <p class="text-sm text-gray-700 mb-4">Share ke teman & keluarga kamu 💌</p>
      <a :href="`https://wa.me/?text=${encodeURIComponent(shareMessage)}`" target="_blank"
        class="inline-block bg-[#25D366] text-white px-6 py-2 rounded-xl hover:opacity-90 transition">
        Share via WhatsApp
      </a>
    </section>


    <!-- Footer -->
    <footer class="py-8 text-center text-sm text-gray-500">
      <p>© 2025 undangdong.com - Made with 💕 by Fauzan</p>
    </footer>
  </div>
</template>

<script setup>
import MusicControl from '@/components/MusicControl.vue';

const shareMessage = `
Hai! Kamu diundang ke pernikahan Adam & Aisyah 💍✨
📆 Sabtu, 20 Juli 2025
📍 Graha MSS, Jakarta Selatan

Cek undangannya di sini:
https://undangdong.com/adamaisyah
`;
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
</style>
