<template>
  <div class="relative min-h-screen bg-black overflow-hidden font-sans no-scrollbar font-montserrat">
    <transition name="fade-up">

      <div v-if="showWelcome"
        class="relative flex flex-col items-center justify-center h-screen text-center px-6 text-white transition-opacity duration-700 ease-in-out"
        style="background-image: url('/background/default-dark-background.jpg'); background-size: cover; background-position: center;">

        <div class="absolute inset-0 bg-black/40 backdrop-blur-xs"></div>

        <div class="relative z-10 space-y-2 ">
          <h1 class="text-md font-light tracking-widest uppercase">The Wedding Of</h1>

          <h2 class="text-5xl font-alex font-normal leading-snug" v-html="data.groomName"></h2>
          <span class="text-sm tracking-wide">AND</span>
          <h2 class="text-5xl font-alex font-normal mb-2 leading-snug" v-html="data.brideName"></h2>

          <p class="text-sm mb-6" v-html="data.akadLocation?.dateTime"></p>

          <div class="text-sm">Kepada Yth.</div>
          <div class="text-xl font-semibold text-white mb-4">Nama Tamu</div>

          <button @click="openInvitation" class="btn-glow-gold px-8 py-3 text-sm font-semibold tracking-wide rounded-full transition-all duration-300 ease-in-out
         bg-gradient-to-r from-[#d6b18a] to-[#b48c5b] text-white shadow-lg
         hover:from-[#e6c395] hover:to-[#c59d6c] hover:scale-105">
            Buka Undangan
          </button>

        </div>
      </div>
    </transition>

    <div v-if="!showWelcome" class="invitation-content">
      <!-- Bagian awal -->
      <div
        class="relative min-h-[110vh] flex flex-col items-center justify-center text-white text-center bg-cover bg-center px-6"
        :style="{ backgroundImage: `url(${backgroundUrl})` }">
        <!-- Overlay gradasi -->
        <div class="absolute inset-0 bg-black/20 backdrop-brightness-75"></div>
        <div class="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#4b5563] to-transparent z-[1]"></div>

        <!-- Konten utama -->
        <div class="relative z-10 space-y-4 font-montserrat">
          <p class="text-xs tracking-widest uppercase opacity-80">The Wedding Of</p>

          <h1 class="text-5xl font-alex leading-tight" v-html="data.groomName"></h1>
          <p class="text-base tracking-wider opacity-80">and</p>
          <h1 class="text-5xl font-alex leading-tight" v-html="data.brideName"></h1>

          <p class="text-sm mt-4 opacity-90" v-html="data.akadLocation?.dateTime"></p>

          <!-- Optional garis pemisah -->
          <div class="w-16 h-[1px] bg-white/30 mx-auto mt-4"></div>

          <!-- Countdown -->
          <div class="flex justify-center gap-6 mt-6">
            <div v-for="(val, label) in countdown" :key="label" class="text-center">
              <div class="text-2xl font-bold">{{ val }}</div>
              <div class="text-xs tracking-widest uppercase opacity-80 font-light">{{ label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section Kutipan Ayat -->
      <section class="bg-[#4b5563] sm:py-24 py-16 text-center px-6 relative font-montserrat">
        <!-- Border atas bawah -->
        <div class="absolute top-0 left-1/2 w-32 h-[1px] bg-white/30 -translate-x-1/2"></div>
        <div class="absolute bottom-0 left-1/2 w-32 h-[1px] bg-white/30 -translate-x-1/2"></div>

        <p class="italic text-gray-200 max-w-2xl mx-auto text-lg leading-relaxed">
          "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu
          sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan
          sayang."
        </p>

        <p class="mt-4 text-sm italic text-gray-300 tracking-wide">Q.S. Ar-Rum : 21</p>
      </section>


      <section class="bg-gradient-to-b from-[#4b5563] via-[#3e3e3e] to-[#2e2e2e] text-gray-300 py-16 px-4">
        <div
          class="max-w-5xl relative mx-auto text-center bg-white/5 backdrop-blur-lg rounded-t-[3rem] pt-12 px-4 pb-24 ">

          <!-- Gradient di bawah -->
          <div
            class="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#2e2e2e] to-transparent z-[1] pointer-events-none">
          </div>

          <h2 class="text-3xl font-serif text-[#f8f4f0] uppercase mb-2">Our Wedding</h2>
          <p class="italic text-gray-300 text-sm max-w-xl mx-auto leading-relaxed px-4 py-3">
            Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara
            Pernikahan kami
          </p>

          <!-- Divider -->
          <div class="flex items-center justify-center mb-8 px-12">
            <div class="flex-grow border-t border-white/20"></div>
            <div class="mx-4 text-[#bfa88f] text-xl">
              <i class="fas fa-heart"></i>
            </div>
            <div class="flex-grow border-t border-white/20"></div>
          </div>

          <!-- Cards -->
          <div class="flex flex-col md:flex-row justify-center gap-8">
            <!-- Bride -->
            <div
              class="w-full md:w-1/2 max-w-sm bg-white/5 backdrop-blur border border-white/10 rounded-3xl shadow-lg overflow-hidden relative">
              <div
                class="absolute top-4 left-4 bg-gradient-to-br from-[#bfa88f] to-[#d1bfa7] text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide shadow">
                Bride
              </div>
              <img src="https://i.pinimg.com/736x/7f/4b/41/7f4b41f027b8e316e2821274761b86b6.jpg" alt="Bride"
                class="w-full h-72 object-cover grayscale-0  transition duration-300">
              <div class="p-5 text-center text-white">
                <h3 class="text-lg font-serif font-semibold mb-1">Mafaza Humaira Zega</h3>
                <p class="text-xs text-gray-300 mb-2">Putra dari Bapak Bapak, S.H. & Ibu Ibu Komplek</p>
                <a href="https://instagram.com" target="_blank"
                  class="inline-block text-xs bg-[#bfa88f]/90 text-white cursor-pointer px-3 py-1 rounded-full hover:bg-[#bfa88f]">
                  ig: @gatausiapa
                </a>
              </div>
            </div>

            <!-- Groom -->
            <div
              class="w-full md:w-1/2 max-w-sm bg-white/5 backdrop-blur border border-white/10 rounded-3xl shadow-lg overflow-hidden relative">
              <div
                class="absolute top-4 left-4 bg-gradient-to-br from-[#bfa88f] to-[#d1bfa7] text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide shadow">
                Groom
              </div>
              <img
                src="https://cdn0.weddingwire.in/article/1811/original/1280/jpg/101181-wedding-dresses-for-men-11jpg.jpeg"
                alt="Groom" class="w-full h-72 object-cover grayscale-0  transition duration-300">
              <div class="p-5 text-center text-white">
                <h3 class="text-lg font-serif font-semibold mb-1">Habib Palsu</h3>
                <p class="text-xs text-gray-300 mb-2">Putra dari Bapak Bapak, S.H. & Ibu Ibu Komplek Juga</p>
                <a href="https://instagram.com" target="_blank"
                  class="inline-block text-xs bg-[#bfa88f]/90 text-white cursor-pointer px-3 py-1 rounded-full hover:bg-[#bfa88f]">
                  ig: @sahateing
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section
        class="relative bg-gradient-to-b from-[#2e2e2e] via-[#3e3e3e] to-[#4b5563] text-gray-200 py-20 px-6 overflow-hidden">
        <div
          class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-10 pointer-events-none">
        </div>

        <div class="max-w-5xl mx-auto text-center relative z-10">
          <h2 class="text-4xl font-serif font-bold text-white mb-14 tracking-wide">Detail Acara</h2>

          <div class="grid md:grid-cols-2 gap-10">
            <!-- Card Akad -->
            <div
              class="relative bg-white/10 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl p-8 overflow-hidden group transition-all hover:scale-[1.01] hover:shadow-3xl">

              <!-- Sudut Daun -->
              <div class="absolute bottom-4 right-4 text-3xl text-white/10">🌿</div>

              <!-- Icon Bulat -->
              <div
                class="absolute top-4 left-4  rounded-full w-12 h-12 flex items-center justify-center text-2xl text-white ">
                🕊️
              </div>

              <!-- Isi -->
              <h3 class="text-2xl font-serif text-white mb-3 ">Akad Nikah</h3>
              <p class="text-sm text-gray-200 mb-1"><strong class="text-white">Tanggal:</strong> 21 Oktober 2024</p>
              <p class="text-sm text-gray-200 mb-1"><strong class="text-white">Waktu:</strong> 08.00 WIB</p>
              <p class="text-sm text-gray-200"><strong class="text-white">Lokasi:</strong> Masjid Agung Al-Azhar</p>
            </div>

            <!-- Card Resepsi -->
            <div
              class="relative bg-white/10 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl p-8 overflow-hidden group transition-all hover:scale-[1.01] hover:shadow-3xl">

              <!-- Sudut Daun Dekoratif -->
              <div class="absolute bottom-4 left-4 text-3xl text-white/10">🌿</div>

              <!-- Icon Bulat 🎉 -->
              <div class="absolute top-4 right-4 w-12 h-12 flex items-center justify-center text-2xl text-white ">
                🎉
              </div>

              <!-- Isi Konten -->
              <h3 class="text-2xl font-serif text-white mb-3">Resepsi</h3>
              <p class="text-sm text-gray-200 mb-1"><strong class="text-white">Tanggal:</strong> Minggu, 21 Oktober
                2024</p>
              <p class="text-sm text-gray-200 mb-1"><strong class="text-white">Waktu:</strong> 11.00 WIB - Selesai</p>
              <p class="text-sm text-gray-200"><strong class="text-white">Lokasi:</strong> Gedung Serbaguna Al-Azhar,
                Jakarta Selatan</p>
            </div>

          </div>
        </div>
      </section>
      <section class="bg-[#4b5563] py-16 px-4 text-white">
        <div
          class="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 relative overflow-hidden group">

          <!-- Ornamen di sudut -->
          <div class="absolute bottom-4 right-4 text-4xl text-white/10 group-hover:text-white/20 transition">💫</div>

          <h2 class="text-3xl font-serif font-bold text-white text-center mb-8 drop-shadow-md">Konfirmasi Kehadiran
            (RSVP)</h2>

          <form @submit.prevent="submitRSVP" class="space-y-5">
            <input v-model="rsvp.name" type="text" placeholder="Nama Lengkap"
              class="w-full p-4 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#4b5563] focus:bg-white/20 transition"
              required />

            <input v-model="rsvp.phone" type="tel" placeholder="Nomor Telepon / WhatsApp"
              class="w-full p-4 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#4b5563] focus:bg-white/20 transition" />

            <select v-model="rsvp.attendance"
              class="w-full p-4 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#4b5563] focus:bg-white/20 transition"
              required>
              <option disabled value="">Apakah kamu akan hadir?</option>
              <option value="hadir" class="text-black">Hadir</option>
              <option value="tidak" class="text-black">Tidak Hadir</option>
            </select>

            <textarea v-model="rsvp.message" placeholder="Ucapan atau pesan untuk pengantin" rows="3"
              class="w-full p-4 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#4b5563] focus:bg-white/20 transition"></textarea>

            <button type="submit"
              class="bg-white/10 hover:bg-[#4b5563] text-white font-bold py-3 px-6 rounded-full w-full shadow-lg transition-all">
              Kirim RSVP 💌
            </button>
          </form>
        </div>
      </section>
      <!-- Love Story - Elegant Dark Style -->
      <section class="bg-gradient-to-b to-[#2e2e2e] via-[#3e3e3e] from-[#4b5563] py-16 px-4">
        <div class="max-w-5xl mx-auto text-center mb-12">
          <h2 class="text-4xl font-serif text-[#f8f4f0] font-bold tracking-wider mb-6">Our Love Story</h2>

          <div class="relative border-l-4 border-[#bfa88f]/40 pl-10 space-y-16">
            <!-- Item 1 -->
            <div
              class="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-6 text-left">
              <div
                class="absolute -left-6 top-6 bg-[#bfa88f] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                <i class="fa-solid fa-calendar-days"></i>
              </div>
              <img src="https://i.ibb.co/2tXkWKV/couple1.jpg" alt="Love Story Photo 1"
                class="w-full max-h-60 object-cover rounded-xl mb-4">
              <p class="text-sm text-gray-300 font-medium mb-1">12 September 2017</p>
              <h3 class="text-xl font-semibold text-[#d1bfa7] mb-2">Awal Bertemu</h3>
              <p class="text-gray-200 leading-relaxed">
                Tahun di mana dia dikenalkan oleh rekan kerjanya yang juga temanku melalui sosial media.
              </p>
            </div>

            <!-- Item 2 -->
            <div
              class="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-6 text-left">
              <div
                class="absolute -left-6 top-6 bg-[#bfa88f] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                <i class="fa-solid fa-calendar-days"></i>
              </div>
              <img src="https://i.ibb.co/gzSRtgD/couple2.jpg" alt="Love Story Photo 2"
                class="w-full max-h-60 object-cover rounded-xl mb-4">
              <p class="text-sm text-gray-300 font-medium mb-1">8 Maret 2018</p>
              <h3 class="text-xl font-semibold text-[#d1bfa7] mb-2">Jadian</h3>
              <p class="text-gray-200 leading-relaxed">
                Setelah banyak ngobrol dan saling mengenal, akhirnya kami memutuskan untuk bersama.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Kirim Hadiah - Elegant Dark Style -->
      <section class="bg-[#2e2e2e] py-16 px-4">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-3xl font-serif font-bold text-[#f8f4f0] mb-6">Kirim Hadiah</h2>
          <p class="text-gray-300 mb-10 max-w-lg mx-auto">
            Doa restu Anda sudah cukup, namun jika ingin mengirimkan hadiah sebagai tanda kasih, kami menyediakan opsi
            berikut:
          </p>

          <div class="grid md:grid-cols-2 gap-6 text-left">
            <!-- Bank -->
            <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
              <h3 class="font-semibold text-[#d1bfa7] mb-2">🏦 Transfer Bank</h3>
              <p class="text-sm text-gray-300"><strong>BCA</strong></p>
              <p class="text-sm text-gray-300">1234567890</p>
              <p class="text-sm text-gray-300 mb-2">a.n. Dimas Noval</p>
              <button @click="copyToClipboard('1234567890')" class="text-xs text-[#f8e9d0] hover:underline mt-1">
                Salin No. Rekening
              </button>
            </div>

            <!-- E-Wallet -->
            <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
              <h3 class="font-semibold text-[#d1bfa7] mb-2">📱 E-Wallet (QRIS)</h3>
              <img
                src="https://www.xendit.co/wp-content/uploads/2023/06/How-to-Enable-QR-Payments-for-Your-Business.jpeg"
                alt="QRIS" class="w-40 mx-auto mb-3 rounded-md border border-white/20" />
              <p class="text-xs text-center text-gray-400">Scan QR untuk mengirim melalui e-wallet favorit Anda</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Ucapan & Doa -->
      <section class="bg-[#2e2e2e] py-16 px-4">
        <div class="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6">
          <h2 class="text-3xl font-serif font-bold text-[#f8f4f0] text-center mb-6">Ucapan & Doa</h2>

          <form @submit.prevent="submitWishes" class="space-y-4">
            <input v-model="wishes.name" type="text" placeholder="Nama"
              class="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d1bfa7]/50"
              required />

            <textarea v-model="wishes.message" placeholder="Tulis ucapan terbaikmu untuk pengantin 💖" rows="3"
              class="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d1bfa7]/50"
              required></textarea>

            <button type="submit"
              class="bg-white/10 hover:bg-[#4b5563] text-white font-semibold py-3 px-6 rounded-full w-full transition-all">
              Kirim Ucapan 🎉
            </button>
          </form>

          <!-- List wishes -->
          <div
            class="mt-8 space-y-4 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <div v-for="(wish, index) in wishesList" :key="index"
              class="bg-white/10 border border-white/10 text-white p-3 rounded-xl shadow text-sm">
              <p class="font-semibold text-[#d1bfa7]">{{ wish.name }}</p>
              <p class="text-gray-300 mt-1">{{ wish.message }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Penutup -->
      <section class="bg-gradient-to-b from-[#2e2e2e] via-[#3e3e3e] to-[#4b5563] py-20 px-4 text-center">
        <div class="max-w-xl mx-auto">
          <h2 class="text-sm uppercase tracking-widest text-gray-400">The Wedding of</h2>
          <h1 class="text-4xl md:text-5xl font-serif font-bold text-[#f8f4f0] my-4">Adam & Hawa</h1>
          <p class="text-sm text-gray-400 mb-10">21 Oktober 2024</p>

          <p class="text-md text-gray-300 max-w-md mx-auto leading-relaxed">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan
            memberikan doa restu. Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.
          </p>

          <div class="mt-8 text-sm text-gray-400 italic">With love,</div>
          <div class="text-lg font-bold text-[#d1bfa7]">Adam & Hawa</div>
        </div>
      </section>

    </div>

  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

/* === PALETTE SETUP === */
const defaultPalette = {
  primary: '#d6b18a',
  background: '#2e2e2e',
  text: '#f0f0f0',
  accent: '#b48c5b',
  border: '#444444'
}

const paletteColor = ref({ ...defaultPalette }) // jadi reactive bro

const usePaletteStyle = (palette) => ({
  background: {
    backgroundColor: palette.background,
    color: palette.text,
    borderColor: palette.border
  },
  gradientBottom: {
    backgroundImage: `linear-gradient(to bottom, ${palette.background}, ${palette.accent})`,
    color: palette.text
  },
  gradientTop: {
    backgroundImage: `linear-gradient(to top, ${palette.background}, ${palette.accent})`,
    color: palette.text
  },
  gradientRight: {
    backgroundImage: `linear-gradient(to right, ${palette.primary}, ${palette.accent})`,
    color: palette.text
  },
  gradientLeft: {
    backgroundImage: `linear-gradient(to left, ${palette.primary}, ${palette.accent})`,
    color: palette.text
  },
  button: {
    background: `linear-gradient(to right, ${palette.primary}, ${palette.accent})`,
    color: '#fff',
    border: `1px solid ${palette.border}`,
    padding: '12px 24px',
    borderRadius: '9999px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer'
  },
  buttonHover: {
    background: `linear-gradient(to right, ${palette.accent}, ${palette.primary})`,
    transform: 'scale(1.05)'
  },
  borderedBox: {
    backgroundColor: `${palette.background}cc`,
    border: `1px solid ${palette.border}`,
    color: palette.text,
    backdropFilter: 'blur(8px)',
    borderRadius: '1.5rem',
    padding: '1.5rem'
  },
  text: {
    color: palette.text
  },
  border: {
    borderColor: palette.border
  },
  overlay: {
    backgroundColor: `${palette.background}66`,
    backdropFilter: 'blur(4px)'
  }
})

const paletteStyle = computed(() => usePaletteStyle(paletteColor.value)) // jadiin reactive 💡

/* === DATA === */
const data = ref({})
const showWelcome = ref(true)

const rsvp = ref({
  name: '',
  phone: '',
  attendance: '',
  message: '',
})

const wishes = ref({
  name: '',
  message: '',
})
const wishesList = ref([])

function submitWishes() {
  if (!wishes.value.name || !wishes.value.message) return
  wishesList.value.push({ ...wishes.value })
  wishes.value.name = ''
  wishes.value.message = ''
  alert('Ucapan terkirim! 🎊')
}

function submitRSVP() {
  console.log('RSVP data:', rsvp.value)
  alert(`Terima kasih ${rsvp.value.name}, RSVP kamu berhasil dikirim! ✨`)
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
  alert('Nomor rekening disalin ke clipboard')
}

function openInvitation() {
  showWelcome.value = false
  setTimeout(() => {
    document.getElementById('invitation-content')?.scrollIntoView({ behavior: 'smooth' })
  }, 500)
}

/* === COUNTDOWN === */
const backgroundUrl = 'https://img.freepik.com/premium-photo/young-girl-wearing-flowery-headband-necklace-is-smiling-she-is-surrounded-by-other-people_715671-30163.jpg'

const countdown = ref({
  Hari: '00',
  Jam: '00',
  Menit: '00',
  Detik: '00',
})

let targetDate = null

const updateCountdown = () => {
  const now = new Date()
  const diff = targetDate - now

  if (diff <= 0) {
    countdown.value = { Hari: '00', Jam: '00', Menit: '00', Detik: '00' }
    clearInterval(interval)
    return
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  countdown.value = {
    Hari: String(days).padStart(2, '0'),
    Jam: String(hours).padStart(2, '0'),
    Menit: String(minutes).padStart(2, '0'),
    Detik: String(seconds).padStart(2, '0'),
  }
}

let interval = null

onMounted(() => {
  const stored = localStorage.getItem('finalPayload')
  if (stored) {
    data.value = JSON.parse(stored)
    console.log(data.value)

    // Optional: inject palette dari DB kalau ada
    if (data.value.palleteColor) {
      paletteColor.value = { ...defaultPalette, ...data.value.palleteColor }
    }

    if (data.value.akadLocation?.dateTime) {
      const parsed = new Date(data.value.akadLocation.dateTime)
      if (!isNaN(parsed)) {
        targetDate = parsed
        updateCountdown()
        interval = setInterval(updateCountdown, 1000)
      } else {
        console.warn("Tanggalnya gak valid bro 🚨", data.value.akadLocation.dateTime)
      }
    }
  }
})

onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

/* main.css */
.fade-up-leave-active {
  transition: all 0.7s ease-in-out;
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-40px);
  pointer-events: none;
}
</style>
