<template>
  <div class="relative min-h-screen bg-black overflow-hidden font-sans">
    <!-- Welcome Section -->
    <transition name="invite-reveal" mode="out-in">
      <div v-if="showWelcome"
        class="relative flex flex-col items-center justify-center h-screen text-center px-6 text-white"
        style="background-image: url('https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDhwZDZwbDh0ZjEwcmZwYnQ5ZDZqeTdqeWEzcjRoYjNkMWlveHc0NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gKncmZtoUiAcQxPvap/giphy.gif'); background-size: cover; background-position: center;">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-xs"></div>
        <div class="relative z-10 space-y-2">
          <h1 class="text-md font-light tracking-widest text-gray-200">THE WEDDING OF</h1>
          <h2 class="text-5xl font-serif font-semibold">ADAM</h2>
          <span class="text-sm text-gray-200">AND</span>
          <h2 class="text-5xl font-serif font-semibold mb-2">HAWA</h2>
          <p class="text-sm text-gray-100 mb-6">21.10.2023</p>

          <div class="text-sm text-gray-200">Kepada Yth.</div>
          <div class="text-xl font-semibold text-white mb-4">Nama Tamu</div>

          <button @click="openInvitation"
            class="bg-blue-50 text-purple-800 py-2 px-6 rounded-md shadow hover:bg-purple-200 transition-all duration-300 delay-50">
            💌 Open Invitation
          </button>

        </div>
      </div>

    </transition>


    <transition name="invite-reveal" mode="out-in">
      <div v-if="!showWelcome" class="">
        <!-- Bagian awal -->
        <div
          class="relative min-h-screen flex flex-col items-center justify-center text-white text-center bg-cover bg-center"
          :style="{ backgroundImage: `url(${backgroundUrl})` }">
          <!-- Overlay gradasi -->
          <div class="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

          <!-- Konten utama -->
          <div class="relative z-10 space-y-4">
            <p class="text-sm tracking-widest uppercase text-white/80">THE WEDDING OF</p>
            <h1 class="text-5xl font-serif font-semibold uppercase tracking-wide">ADAM</h1>
            <p class="text-xl font-light">and</p>
            <h1 class="text-5xl font-serif font-semibold uppercase tracking-wide">HAWA</h1>
            <p class="text-sm mt-2">21.10.2024</p>

            <!-- Countdown -->
            <div class="flex justify-center gap-6 mt-6 font-semibold">
              <div v-for="(val, label) in countdown" :key="label" class="text-center">
                <div class="text-3xl">{{ val }}</div>
                <div class="text-xs uppercase tracking-wide">{{ label }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Kutipan Ayat -->
        <section class="bg-white py-12 text-center px-4">
          <p class="italic text-gray-700 max-w-xl mx-auto leading-relaxed">
            "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu
            sendiri,
            agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
          </p>
          <p class="mt-4 text-sm italic text-gray-600">Q.S. Ar-Rum : 21</p>
        </section>

        <section class="bg-purple-100 py-16 px-4">
          <div class="max-w-5xl mx-auto text-center">
            <h2 class="text-2xl font-semibold text-mocha mb-12">Mempelai</h2>

            <div class="flex flex-col md:flex-row justify-center gap-8">
              <!-- Bride -->
              <div
                class="w-full md:w-1/2 max-w-sm bg-white shadow-md rounded-xl overflow-hidden relative justify-between flex flex-col">
                <div
                  class="absolute top-4 left-4 bg-gradient-to-b from-purple-400 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  BRIDE
                </div>
                <img src="https://i.pinimg.com/736x/7f/4b/41/7f4b41f027b8e316e2821274761b86b6.jpg" alt="Bride"
                  class="w-full h-72 object-cover">
                <div class="p-5 text-center flex flex-col justify-between items-center">
                  <h3 class="text-lg font-semibold text-gray-800 mb-1">Mafaza Humaira Zega</h3>
                  <p class="text-xs text-gray-600 mb-2">Putra dari Bapak Bapak, S.H. & Ibu Ibu Komplek</p>
                  <a href="https://instagram.com" target="_blank"
                    class="inline-block text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full w-fit">
                    📸 @gatausiapa
                  </a>
                </div>
              </div>

              <!-- Groom -->
              <div
                class="w-full md:w-1/2 max-w-sm bg-white shadow-md rounded-xl overflow-hidden relative flex flex-col">
                <div
                  class="absolute top-4 left-4 bg-gradient-to-b from-purple-400 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  GROOM
                </div>
                <img
                  src="https://cdn0.weddingwire.in/article/1811/original/1280/jpg/101181-wedding-dresses-for-men-11jpg.jpeg"
                  alt="Groom" class="w-full h-72 object-cover">
                <div class="p-5 text-center flex flex-col justify-between items-center">
                  <h3 class="text-lg font-semibold text-gray-800 mb-1">Habib Palsu</h3>
                  <p class="text-xs text-gray-600 mb-2">Putra dari Bapak Bapak, S.H. & Ibu Ibu Komplek Juga
                  </p>
                  <a href="https://instagram.com/" target="_blank"
                    class="inline-block text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full w-fit">
                    📸 @sahateing
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="bg-white py-16 px-4">
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-3xl font-serif font-bold text-mocha mb-12">Detail Acara</h2>

            <div class="grid md:grid-cols-2 gap-8">
              <!-- Card Akad -->
              <div
                class="relative bg-white/70 backdrop-blur-md border border-[#e0cfc0] rounded-2xl shadow-xl p-6 text-left">
                <div class="absolute -top-6 left-6 text-4xl">🕊️</div>
                <h3 class="text-xl font-bold text-mocha mb-3 pl-10">Akad Nikah</h3>
                <p class="text-sm text-gray-700 mb-1"><strong>Tanggal:</strong> Minggu, 21 Oktober 2024</p>
                <p class="text-sm text-gray-700 mb-1"><strong>Waktu:</strong> Pukul 08.00 WIB</p>
                <p class="text-sm text-gray-700"><strong>Lokasi:</strong> Masjid Agung Al-Azhar, Jakarta Selatan</p>
              </div>

              <!-- Card Resepsi -->
              <div
                class="relative bg-white/70 backdrop-blur-md border border-[#e0cfc0] rounded-2xl shadow-xl p-6 text-left">
                <div class="absolute -top-6 left-6 text-4xl">🎉</div>
                <h3 class="text-xl font-bold text-mocha mb-3 pl-10">Resepsi</h3>
                <p class="text-sm text-gray-700 mb-1"><strong>Tanggal:</strong> Minggu, 21 Oktober 2024</p>
                <p class="text-sm text-gray-700 mb-1"><strong>Waktu:</strong> Pukul 11.00 WIB - Selesai</p>
                <p class="text-sm text-gray-700"><strong>Lokasi:</strong> Gedung Serbaguna Al-Azhar, Jakarta Selatan</p>
              </div>
            </div>
          </div>
        </section>
        <section class="bg-[#FFF6E3] py-16 px-4">
          <div class="max-w-2xl mx-auto bg-white/70 backdrop-blur-md border border-[#e0cfc0] rounded-2xl shadow-xl p-6">
            <h2 class="text-2xl font-serif font-bold text-mocha text-center mb-6">Konfirmasi Kehadiran (RSVP)</h2>
            <form @submit.prevent="submitRSVP" class="space-y-4">
              <input v-model="rsvp.name" type="text" placeholder="Nama Lengkap"
                class="w-full p-3 rounded-xl border border-sage/30 focus:outline-none focus:ring-2 focus:ring-mocha/50"
                required />
              <input v-model="rsvp.phone" type="tel" placeholder="Nomor Telepon / WhatsApp"
                class="w-full p-3 rounded-xl border border-sage/30 focus:outline-none focus:ring-2 focus:ring-mocha/50" />
              <select v-model="rsvp.attendance"
                class="w-full p-3 rounded-xl border border-sage/30 focus:outline-none focus:ring-2 focus:ring-mocha/50"
                required>
                <option disabled value="">Apakah kamu akan hadir?</option>
                <option value="hadir">Hadir</option>
                <option value="tidak">Tidak Hadir</option>
              </select>
              <textarea v-model="rsvp.message" placeholder="Ucapan atau pesan untuk pengantin" rows="3"
                class="w-full p-3 rounded-xl border border-sage/30 focus:outline-none focus:ring-2 focus:ring-mocha/50"></textarea>
              <button type="submit"
                class="bg-mocha text-white font-semibold py-3 px-6 rounded-full w-full hover:bg-mocha/90 transition-all">
                Kirim RSVP 💌
              </button>
            </form>
          </div>
        </section>
        <section class="bg-white py-16 px-4">
          <div class="max-w-2xl mx-auto text-center">
            <h2 class="text-2xl font-serif font-bold text-mocha mb-6">Kirim Hadiah</h2>
            <p class="text-gray-600 mb-8">Doa restu Anda sudah cukup, namun jika ingin mengirimkan hadiah sebagai tanda
              kasih, kami menyediakan opsi berikut:</p>

            <div class="grid md:grid-cols-2 gap-6 text-left">
              <!-- Bank -->
              <div class="bg-[#FFF6E3] rounded-xl border border-sage/30 p-5 shadow">
                <h3 class="font-bold text-mocha mb-2">🏦 Transfer Bank</h3>
                <p class="text-sm text-gray-700"><strong>BCA</strong></p>
                <p class="text-sm text-gray-700">1234567890</p>
                <p class="text-sm text-gray-700 mb-2">a.n. Dimas Noval</p>
                <button @click="copyToClipboard('1234567890')" class="text-xs text-purple-600 hover:underline">
                  Salin No. Rekening
                </button>
              </div>

              <!-- E-Wallet -->
              <div class="bg-[#FFF6E3] rounded-xl border border-sage/30 p-5 shadow">
                <h3 class="font-bold text-mocha mb-2">📱 E-Wallet (QRIS)</h3>
                <img
                  src="https://www.xendit.co/wp-content/uploads/2023/06/How-to-Enable-QR-Payments-for-Your-Business.jpeg"
                  alt="QRIS" class="w-40 mx-auto mb-2" />
                <p class="text-xs text-center text-gray-500">Scan QR untuk mengirim melalui e-wallet favorit Anda</p>
              </div>
            </div>
          </div>
        </section>
        <section class="bg-[#FFF6E3] py-16 px-4">
          <div class="max-w-2xl mx-auto bg-white/70 backdrop-blur-md border border-[#e0cfc0] rounded-2xl shadow-xl p-6">
            <h2 class="text-2xl font-serif font-bold text-mocha text-center mb-6">Ucapan & Doa</h2>
            <form @submit.prevent="submitWishes" class="space-y-4">
              <input v-model="wishes.name" type="text" placeholder="Nama"
                class="w-full p-3 rounded-xl border border-sage/30 focus:outline-none focus:ring-2 focus:ring-mocha/50"
                required />
              <textarea v-model="wishes.message" placeholder="Tulis ucapan terbaikmu untuk pengantin 💖" rows="3"
                class="w-full p-3 rounded-xl border border-sage/30 focus:outline-none focus:ring-2 focus:ring-mocha/50"
                required></textarea>
              <button type="submit"
                class="bg-mocha text-white font-semibold py-3 px-6 rounded-full w-full hover:bg-mocha/90 transition-all">
                Kirim Ucapan 🎉
              </button>
            </form>

            <!-- List wishes -->
            <div class="mt-8 space-y-4 max-h-64 overflow-y-auto pr-2">
              <div v-for="(wish, index) in wishesList" :key="index" class="bg-white p-3 rounded-xl shadow text-sm">
                <p class="font-semibold text-mocha">{{ wish.name }}</p>
                <p class="text-gray-700 mt-1">{{ wish.message }}</p>
              </div>
            </div>
          </div>
        </section>
        <section class="bg-white py-20 px-4 text-center">
          <div class="max-w-xl mx-auto">
            <h2 class="text-lg uppercase tracking-widest text-gray-500">The Wedding of</h2>
            <h1 class="text-4xl md:text-5xl font-serif font-bold text-mocha my-4">Adam & Hawa</h1>
            <p class="text-sm text-gray-500 mb-10">21 Oktober 2024</p>

            <p class="text-md text-gray-700 max-w-md mx-auto leading-relaxed">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan
              memberikan doa
              restu. Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.
            </p>

            <div class="mt-8 text-sm text-gray-400 italic">With love,</div>
            <div class="text-lg font-bold text-mocha">Adam & Hawa</div>
          </div>
        </section>

      </div>

    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

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
  // Simpan ke backend / firebase / localStorage dll
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
  alert('Nomor rekening disalin ke clipboard ✅')
}

function openInvitation() {
  showWelcome.value = false
}

const backgroundUrl = 'https://i.pinimg.com/originals/b4/dc/ae/b4dcae8b4c32a650d92ace938f558c7c.jpg'
const countdown = ref({
  Hari: '00',
  Jam: '00',
  Menit: '00',
  Detik: '00',
})

const targetDate = new Date('2025-10-21T00:00:00')

let interval = null

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

onMounted(() => {
  const stored = localStorage.getItem('formData')
  if (stored) {
    data.value = JSON.parse(stored)
  }
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
})

onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>

<style scoped>
/* .invite-reveal-enter-active,
.invite-reveal-leave-active {
  transition: all 0.8s ease-in-out;
  transform-origin: top center;
}

.invite-reveal-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.invite-reveal-enter-to {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.invite-reveal-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.invite-reveal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
} */
</style>
