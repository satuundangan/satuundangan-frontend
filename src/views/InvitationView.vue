<template>
  <MusicControl />

  <div class="bg-[#FFF6E3] text-gray-800 font-sans">
    <!-- Hero Section -->
    <section
      class="min-h-screen flex flex-col justify-center items-center text-center px-6 py-20 bg-gradient-to-b from-[#F9F6F1] via-[#EFEAE3] to-[#E8E3DC]">
      <h1 class="text-4xl md:text-6xl font-extrabold text-[#6B4EFF] leading-tight">
        {{ undangan.nama_pria }} & {{ undangan.nama_wanita }}
      </h1>
      <p class="mt-4 text-lg md:text-xl text-[#4B4B4B]">Akan melangsungkan pernikahan pada</p>
      <p class="mt-1 text-xl md:text-2xl font-semibold text-[#7C3AED]">
        {{ formatTanggal(undangan.tanggal_resepsi) }}
      </p>
      <div class="mt-10">
        <button class="bg-[#C1A57B] text-white font-semibold px-6 py-2 rounded-xl hover:opacity-90 transition">
          Lihat Detail
        </button>
      </div>
    </section>

    <!-- Ayat Section -->
    <section class="min-h-screen flex flex-col justify-center items-center text-center py-16 px-6 bg-white text-center">
      <h2 class="text-2xl font-bold text-[#6B4EFF] mb-4">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</h2>
      <p class="italic text-[#4B4B4B] max-w-2xl mx-auto">
        "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu
        dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan
        di antaramu rasa kasih dan sayang."
        <br />
        <span class="text-sm">(QS. Ar-Rum: 21)</span>
      </p>
    </section>

    <!-- Couple Section -->
    <section class="min-h-screen flex flex-col justify-center items-center text-center py-16 px-6 text-center">
      <h2 class="text-3xl font-bold text-[#6B4EFF] mb-8">Mempelai</h2>
      <div class="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto items-center">
        <div>
          <img :src="undangan.foto_wanita" alt="wanita" class="w-40 h-40 rounded-full mx-auto mb-4" />
          <h3 class="text-xl font-semibold">{{ undangan.nama_wanita }}</h3>
          <p class="text-sm text-gray-600">{{ undangan.orangtua_wanita }}</p>
        </div>
        <div>
          <img :src="undangan.foto_pria" alt="pria" class="w-40 h-40 rounded-full mx-auto mb-4" />
          <h3 class="text-xl font-semibold">{{ undangan.nama_pria }}</h3>
          <p class="text-sm text-gray-600">{{ undangan.orangtua_pria }}</p>
        </div>
      </div>
    </section>

    <!-- Acara Section -->
    <section
      class="min-h-screen flex flex-col justify-center items-center text-center py-16 px-6 bg-[#CDC1FF]/20 text-center">
      <h2 class="text-3xl font-bold text-[#6B4EFF] mb-8">Rangkaian Acara</h2>
      <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div class="bg-white rounded-xl shadow p-6">
          <h3 class="text-xl font-semibold text-[#7C3AED] mb-2">Akad Nikah</h3>
          <p class="text-sm text-gray-600">{{ formatTanggal(undangan.tanggal_akad, true) }}</p>
          <p class="text-sm text-gray-600">{{ undangan.lokasi_akad }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-6">
          <h3 class="text-xl font-semibold text-[#7C3AED] mb-2">Resepsi</h3>
          <p class="text-sm text-gray-600">{{ formatTanggal(undangan.tanggal_resepsi, true) }}</p>
          <p class="text-sm text-gray-600">{{ undangan.lokasi_resepsi }}</p>
        </div>
      </div>
    </section>

    <!-- Countdown Section -->
    <section class="min-h-screen flex flex-col justify-center items-center text-center py-16 bg-white px-6">
      <h2 class="text-3xl font-bold text-[#6B4EFF] mb-6">Countdown</h2>
      <div class="flex gap-6 text-[#6B4EFF] text-center text-3xl md:text-4xl font-bold">
        <div>
          <div>{{ countdown.days }}</div>
          <p class="text-sm md:text-base text-[#6C6C6C]">Hari</p>
        </div>
        <div>
          <div>{{ countdown.hours }}</div>
          <p class="text-sm md:text-base text-[#6C6C6C]">Jam</p>
        </div>
        <div>
          <div>{{ countdown.minutes }}</div>
          <p class="text-sm md:text-base text-[#6C6C6C]">Menit</p>
        </div>
        <div>
          <div>{{ countdown.seconds }}</div>
          <p class="text-sm md:text-base text-[#6C6C6C]">Detik</p>
        </div>
      </div>
    </section>


    <!-- Gallery Section -->
    <section class="min-h-screen flex flex-col justify-center items-center text-center py-16 px-6 bg-[#BFECFF]/30">
      <h2 class="text-3xl font-bold text-[#6B4EFF] text-center mb-8">Galeri Cinta Kami</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        <img v-for="(foto, idx) in undangan.galeri" :key="idx" :src="foto"
          class="w-full h-48 min-w-48 object-cover rounded-xl shadow" />
      </div>
    </section>
    <!-- Our Story (Bright Theme) -->
    <section class="min-h-screen flex flex-col items-center py-16 px-6 bg-[#FFF9F4] text-[#333]">
      <h2 class="text-3xl font-bold text-[#6B4EFF] mb-12">OUR STORY</h2>
      <div class="space-y-10 w-full max-w-4xl">
        <div v-for="(moment, idx) in undangan.perjalanan_kami" :key="idx"
          class="flex flex-col md:flex-row bg-white border border-[#ECE6DA] rounded-xl shadow-md overflow-hidden">
          <img :src="moment.gambar" alt="moment" class="w-full md:w-1/3 h-60 object-cover" />
          <div class="p-6 flex flex-col justify-center text-left w-full">
            <h3 class="text-lg md:text-xl font-bold text-[#A6784E] uppercase">
              {{ moment.judul }}
            </h3>
            <div class="flex items-center space-x-4 text-sm text-[#7A7A7A] my-2">
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4 text-[#6B4EFF]" fill="none" stroke="currentColor" stroke-width="2"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M17.657 16.657L13.414 20.9a1 1 0 01-1.414 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{{ moment.lokasi }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4 text-[#6B4EFF]" fill="none" stroke="currentColor" stroke-width="2"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ moment.tanggal }}</span>
              </div>
            </div>
            <p class="text-sm text-[#4E4E4E] leading-relaxed">
              {{ moment.deskripsi }}
            </p>
          </div>
        </div>
      </div>
    </section>


    <!-- RSVP Section -->
    <section class="min-h-screen flex flex-col justify-center items-center text-center py-16 px-6 text-center bg-white">
      <h2 class="text-3xl font-bold text-[#6B4EFF] mb-6">Konfirmasi Kehadiran</h2>
      <form class="max-w-md mx-auto space-y-4">
        <input type="text" placeholder="Nama Lengkap" class="w-full border border-[#DDD2C3] rounded-lg px-4 py-2" />
        <select class="w-full border border-[#DDD2C3] rounded-lg px-4 py-2">
          <option value="">Apakah Anda akan hadir?</option>
          <option value="yes">Hadir</option>
          <option value="no">Maaf tidak bisa</option>
        </select>
        <textarea rows="3" placeholder="Ucapan & Doa"
          class="w-full border border-[#DDD2C3] rounded-lg px-4 py-2"></textarea>
        <button type="submit"
          class="bg-[#C1A57B] text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition">
          Kirim
        </button>
      </form>
    </section>

    <section class="min-h-screen flex flex-col justify-center items-center text-center py-16 px-6 bg-[#EFEAE3]">
      <h2 class="text-3xl font-bold text-[#6B4EFF] mb-6">Kado Pernikahan</h2>
      <p class="text-[#4B4B4B] max-w-md mb-6">
        Doa restu Anda merupakan hadiah terbaik, namun jika ingin mengirimkan tanda kasih, berikut detailnya:
      </p>
      <div class="bg-white rounded-xl shadow p-6 text-left w-full max-w-md">
        <p class="font-semibold">
          Rekening {{ undangan.gift.rekening.bank }} a.n {{ undangan.gift.rekening.nama }}
        </p>
        <p class="text-gray-600 text-sm mb-4">{{ undangan.gift.rekening.nomor }}</p>
        <p class="font-semibold">Alamat Pengiriman Kado</p>
        <p class="text-gray-600 text-sm">{{ undangan.gift.alamat }}</p>
      </div>
    </section>


    <!-- Share -->
    <section class="py-10 px-6 bg-[#FFF6E3] text-center">
      <h2 class="text-2xl font-bold text-[#6B4EFF] mb-4">Sebarkan Undangan</h2>
      <p class="text-sm text-[#4B4B4B] mb-4">Share ke teman & keluarga kamu 💌</p>
      <a :href="`https://wa.me/?text=${encodeURIComponent(shareMessage)}`" target="_blank"
        class="inline-block bg-[#25D366] text-white px-6 py-2 rounded-xl hover:opacity-90 transition">
        Share via WhatsApp
      </a>
    </section>

    <footer class="py-8 text-center text-sm text-gray-500">
      <p>© 2025 undangdong.com - Made with 💕 by Fauzan</p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import MusicControl from '@/components/MusicControl.vue'

const undangan = ref({
  nama_pria: 'Muhammad Adam',
  orangtua_pria: 'Putra dari Bpk. Yusuf & Ibu Fatimah',
  foto_pria: 'https://images/pria.png',
  nama_wanita: 'Aisyah Zahra',
  orangtua_wanita: 'Putri dari Bpk. Ahmad & Ibu Siti',
  foto_wanita: 'https://images/wanita.png',
  tanggal_akad: '2025-07-20T08:00:00',
  lokasi_akad: 'Masjid Raya Al-Azhar, Jakarta',
  tanggal_resepsi: '2025-07-20T11:00:00',
  lokasi_resepsi: 'Gedung Graha MSS, Jakarta Selatan',
  galeri: [
    'https://images/prewed1.jpg',
    'https://images/prewed2.jpg',
    'https://images/prewed3.jpg',
    'https://images/prewed4.jpg',
    'https://images/prewed5.jpg',
    'https://images/prewed6.jpg',
    'https://images/prewed7.jpg',
    'https://images/prewed8.jpg',
  ],
  gift: {
    rekening: {
      bank: 'BCA',
      nomor: '1234567890',
      nama: 'Muhammad Adam'
    },
    alamat: 'Jl. Bahagia No. 123, Jakarta Selatan'
  },
  perjalanan_kami: [
    {
      judul: 'Pertama Kenal',
      lokasi: 'Gramedia',
      tanggal: '01 Januari 2020',
      deskripsi: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
      gambar: 'https://yourdomain.com/image1.jpg'
    },
    {
      judul: 'Menyatakan Cinta',
      lokasi: 'Pantai Parangtritis',
      tanggal: '10 Januari 2020',
      deskripsi: 'Lorem Ipsum has been the industry\'s standard dummy text ever since...',
      gambar: 'https://yourdomain.com/image2.jpg'
    },
    {
      judul: 'Tunangan',
      lokasi: 'Rumah Juliet',
      tanggal: '19 Januari 2020',
      deskripsi: 'When an unknown printer took a galley of type and scrambled it...',
      gambar: 'https://yourdomain.com/image3.jpg'
    }
  ],
  share_link: 'https://undangdong.com/adamaisyah',
})

const shareMessage = `
                      Hai! Kamu diundang ke pernikahan ${undangan.value.nama_pria} & ${undangan.value.nama_wanita} 💍✨
                      📆 Sabtu, 20 Juli 2025
                      📍 ${undangan.value.lokasi_resepsi}

                      Cek undangannya di sini:
                      ${undangan.value.share_link}
                      `

const formatTanggal = (tgl, denganJam = false) => {
  const d = new Date(tgl)
  return d.toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(denganJam && { hour: '2-digit', minute: '2-digit' }),
  })
}

const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

const updateCountdown = () => {
  const now = new Date()
  const diff = new Date(undangan.value.tanggal_resepsi) - now

  if (diff <= 0) {
    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }

  countdown.value = {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}


let intervalId
onMounted(() => {
  updateCountdown()
  intervalId = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})

// Kalau udah ada API-nya tinggal aktifin ini:
// const fetchData = async () => {
//   const res = await fetch('https://api.undangdong.com/undangan/slugnya')
//   const data = await res.json()
//   undangan.value = data
// }
// onMounted(() => fetchData())
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
</style>
