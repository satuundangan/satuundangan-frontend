<template>
  <div class="relative min-h-screen bg-black overflow-hidden font-sans no-scrollbar font-montserrat">
    <transition name="slide-up">

      <div v-if="showWelcome"
        class="absolute w-full flex flex-col items-center justify-center h-screen text-center px-6 bg-transparent text-white transition-opacity duration-700 ease-in-out z-50"
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
        <div class="absolute bottom-0 left-0 right-0 h-40 z-[1]" :style="paletteStyle.gradientBottomFromTransparent">
        </div>

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
      <section :style="paletteStyle.background" class="sm:py-24 py-16 text-center px-6 relative font-montserrat">
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


      <section :style="paletteStyle.background" class=" text-gray-300 py-16 px-4">
        <div
          class="max-w-5xl relative mx-auto text-center bg-white/5 backdrop-blur-lg rounded-t-[3rem] pt-12 px-4 pb-24 ">

          <!-- Gradient di bawah -->
          <div :style="paletteStyle.gradientBottomFromTransparent"
            class="absolute bottom-0 left-0 right-0 h-40 z-[1] pointer-events-none">
          </div>

          <h2 class="text-4xl font-serif text-white font-alex mb-2">Our Wedding</h2>
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
                <h3 class="text-lg font-serif font-semibold mb-1" v-html="data.groomName"></h3>
                <p class="text-xs text-gray-300 mb-2" v-html="'Putra dari ' + data.parents?.groomParents"></p>
                <a href="https://instagram.com" target="_blank"
                  class="inline-block text-xs bg-[#bfa88f]/90 text-white cursor-pointer px-3 py-1 rounded-full hover:bg-[#bfa88f]"
                  v-html="'IG : ' + data.socialMediaGroom?.instagram">
                </a>
              </div>
            </div>

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
                <h3 class="text-lg font-serif font-semibold mb-1" v-html="data.brideName"></h3>
                <p class="text-xs text-gray-300 mb-2" v-html="'Putra dari ' + data.parents?.brideParents"></p>
                <a href="https://instagram.com" target="_blank"
                  class="inline-block text-xs bg-[#bfa88f]/90 text-white cursor-pointer px-3 py-1 rounded-full hover:bg-[#bfa88f]"
                  v-html="'IG : ' + data.socialMediaBrides?.instagram">

                </a>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section :style="paletteStyle.background" class="relative text-gray-200 py-20 px-6 overflow-hidden">
        <div
          class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-10 pointer-events-none">
        </div>

        <div class="max-w-5xl mx-auto text-center relative z-10">
          <h2 class="text-4xl font-serif font-alex font-bold text-white mb-5 tracking-wide ">Acara Pernikahan</h2>

          <p class="mb-7 font-montserrat">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila,
            Bapak/Ibu/Saudara/i berkenan hadir untuk
            memberikan do'a restunya, kami ucapkan terima kasih.</p>
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


      <!-- Love Story - Elegant Responsive Timeline -->
      <section :style="paletteStyle.background" class="py-20 px-4 text-white">
        <div class="max-w-5xl mx-auto text-center mb-16">
          <h2 class="text-4xl font-alex font-serif font-bold tracking-wide text-[#f8f4f0] mb-8">Our Love Story</h2>

          <!-- Timeline Container -->
          <div class="relative space-y-16 before:absolute before:top-0 before:bottom-0 before:w-1 before:bg-[#bfa88f]/30
                md:before:left-1/2 before:left-4 md:before:-ml-0.5">

            <!-- Timeline Item -->
            <div class="relative md:w-1/2 md:pl-10 md:pr-0 pl-12 pr-4 text-left md:ml-auto group">
              <!-- Icon -->
              <div
                class="absolute top-6 left-0 md:left-1/2 md:-translate-x-1/2 w-10 h-10 bg-[#bfa88f] text-white rounded-full flex items-center justify-center shadow-md z-10">
                <i class="fa-solid fa-calendar-days"></i>
              </div>

              <!-- Card -->
              <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-6">
                <img src="https://i.ibb.co/2tXkWKV/couple1.jpg" alt="Love Story Photo 1"
                  class="w-full max-h-60 object-cover rounded-xl mb-4" />
                <p class="text-sm text-gray-300 font-medium mb-1">12 September 2017</p>
                <h3 class="text-xl font-semibold text-[#d1bfa7] mb-2">Awal Bertemu</h3>
                <p class="text-gray-200 leading-relaxed">
                  Tahun di mana dia dikenalkan oleh rekan kerjanya yang juga temanku melalui sosial media.
                </p>
              </div>
            </div>

            <!-- Timeline Item 2 (alternate side on desktop) -->
            <div class="relative md:w-1/2 md:pr-10 md:pl-0 pl-12 pr-4 text-left md:mr-auto group">
              <!-- Icon -->
              <div
                class="absolute top-6 left-0 md:left-1/2 md:-translate-x-1/2 w-10 h-10 bg-[#bfa88f] text-white rounded-full flex items-center justify-center shadow-md z-10">
                <i class="fa-solid fa-calendar-days"></i>
              </div>

              <!-- Card -->
              <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-6">
                <img src="https://i.ibb.co/gzSRtgD/couple2.jpg" alt="Love Story Photo 2"
                  class="w-full max-h-60 object-cover rounded-xl mb-4" />
                <p class="text-sm text-gray-300 font-medium mb-1">8 Maret 2018</p>
                <h3 class="text-xl font-semibold text-[#d1bfa7] mb-2">Jadian</h3>
                <p class="text-gray-200 leading-relaxed">
                  Setelah banyak ngobrol dan saling mengenal, akhirnya kami memutuskan untuk bersama.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>



      <section :style="paletteStyle.background" class="py-20 px-4 text-white">
        <div
          class="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.25)] p-6 sm:p-10 relative overflow-hidden group transition-all duration-500">

          <!-- Ornamen -->
          <div
            class="absolute bottom-6 right-6 text-4xl sm:text-5xl text-white/10 group-hover:text-white/30 transition-all">
            💫
          </div>

          <h2
            class="text-2xl sm:text-3xl font-alex md:text-4xl font-serif font-semibold text-center text-white drop-shadow-xl mb-2 sm:mb-4">
            Konfirmasi Kehadiran
          </h2>

          <p class="text-center text-white/80 italic mb-8">
            "Kehadiran dan doa baik Anda adalah hadiah terindah bagi kami di hari bahagia ini"
          </p>

          <form @submit.prevent="submitRSVP" class="space-y-6 text-sm sm:text-base">
            <!-- Nama Lengkap -->
            <input v-model="rsvp.name" type="text" placeholder="Nama Lengkap"
              class="w-full p-3 sm:p-4 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/20 transition-all"
              required />

            <!-- Kehadiran -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <label
                class="flex items-center justify-center px-4 py-3 sm:px-6 sm:py-3 rounded-md border border-white/30 text-white bg-white/10 cursor-pointer hover:bg-white/20 transition-all"
                :class="rsvp.attendance === 'hadir' ? 'ring-2 ring-white/50' : ''">
                <input type="radio" value="hadir" v-model="rsvp.attendance" class="hidden" required />
                Hadir
              </label>

              <label
                class="flex items-center justify-center px-4 py-3 sm:px-6 sm:py-3 rounded-md border border-white/30 text-white bg-white/10 cursor-pointer hover:bg-white/20 transition-all"
                :class="rsvp.attendance === 'belum tau' ? 'ring-2 ring-white/50' : ''">
                <input type="radio" value="belum tau" v-model="rsvp.attendance" class="hidden" />
                Belum Tau
              </label>

              <label
                class="flex items-center justify-center px-4 py-3 sm:px-6 sm:py-3 rounded-md border border-white/30 text-white bg-white/10 cursor-pointer hover:bg-white/20 transition-all"
                :class="rsvp.attendance === 'tidak' ? 'ring-2 ring-white/50' : ''">
                <input type="radio" value="tidak" v-model="rsvp.attendance" class="hidden" />
                Tidak Hadir
              </label>
            </div>

            <!-- Jumlah Tamu Hadir -->
            <div v-if="rsvp.attendance === 'hadir'">
              <select v-model="rsvp.totalGuest"
                class="w-full p-3 sm:p-4 rounded-xl bg-white/10 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/20 transition-all"
                required>
                <option disabled value="">Jumlah Tamu yang Hadir</option>
                <option v-for="n in guestOptions" :key="n" :value="n" class="text-black">
                  {{ n }} Orang
                </option>
              </select>
            </div>

            <!-- Ucapan -->
            <textarea v-model="rsvp.message" rows="3" placeholder="Ucapan atau pesan untuk pengantin"
              class="w-full p-3 sm:p-4 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/20 transition-all"></textarea>

            <!-- Tombol Submit -->
            <button type="submit" :style="paletteStyle.button"
              class="w-full py-3 px-6 font-semibold text-sm sm:text-base rounded-full shadow-lg hover:opacity-90 active:scale-95 transition-all">
              Kirim RSVP 💌
            </button>
          </form>
        </div>
      </section>

      <section :style="paletteStyle.background" class="py-20 px-4 text-white">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-3xl font-serif font-semibold text-center mb-10 drop-shadow-lg">
            Ucapan dari Tamu
          </h2>

          <div v-if="wishesList.length === 0" class="text-center text-white/50">
            Belum ada ucapan masuk 😢 Jadilah yang pertama!
          </div>

          <!-- Scrollable area -->
          <div
            class="max-h-[60vh] overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-white/5 hover:scrollbar-thumb-white/40 transition-all">
            <ul class="space-y-6">
              <li v-for="(wish, index) in wishesList" :key="index"
                class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-md transition hover:scale-[1.02]">
                <p class="text-white text-lg font-semibold mb-1">{{ wish.name }}</p>
                <p class="text-white/80">{{ wish.message }}</p>
              </li>
            </ul>
          </div>
        </div>
      </section>


      <section :style="paletteStyle.background" class="py-20 px-4 text-white">
        <GalleryInvitation :items="galleryImages" />
      </section>
      <!-- Gift Section - Elegant Dark Theme -->
      <section :style="paletteStyle.background" class="py-20 px-4 text-white">
        <div class="max-w-4xl mx-auto">
          <!-- Section Header -->
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-alex font-serif font-light tracking-wider mb-4 text-[#f8f4f0]">
              Kirim Hadiah
            </h2>
            <div class="w-24 h-px bg-gradient-to-r from-transparent via-[#d1bfa7] to-transparent mx-auto mb-6"></div>
            <p class="text-[#e0d5c5] max-w-2xl mx-auto text-lg leading-relaxed">
              Doa dan restu Anda sudah menjadi hadiah terindah. Jika ingin berbagi kebahagiaan lebih,
              kami dengan rendah hati menerima tanda kasih melalui:
            </p>
          </div>

          <!-- Gift Options -->
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Bank Transfer -->
            <div
              class="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-lg border border-white/10 rounded-xl p-8 shadow-xl hover:border-white/20 transition-all duration-300">
              <div class="flex items-center gap-3 mb-4">
                <div class="text-2xl text-[#d1bfa7]">🏦</div>
                <h3 class="font-serif text-xl text-[#f8e9d0]">Transfer Bank</h3>
              </div>

              <div class="space-y-3 pl-2 border-l-2 border-[#d1bfa7]/30">
                <div>
                  <p class="text-sm text-[#c9c9c9]">Bank Central Asia (BCA)</p>
                  <p class="text-lg font-medium text-white">123 456 7890</p>
                </div>
                <div>
                  <p class="text-sm text-[#c9c9c9]">a.n.</p>
                  <p class="text-lg font-medium text-white">Dimas Noval</p>
                </div>
              </div>

              <button @click="copyToClipboard('1234567890')"
                class="mt-6 px-4 py-2 text-sm bg-[#d1bfa7]/10 hover:bg-[#d1bfa7]/20 border border-[#d1bfa7]/30 rounded-lg text-[#f8e9d0] transition-all flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Salin Nomor Rekening
              </button>
            </div>

            <!-- E-Wallet -->
            <div
              class="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-lg border border-white/10 rounded-xl p-8 shadow-xl hover:border-white/20 transition-all duration-300">
              <div class="flex items-center gap-3 mb-4">
                <div class="text-2xl text-[#d1bfa7]">📱</div>
                <h3 class="font-serif text-xl text-[#f8e9d0]">E-Wallet (QRIS)</h3>
              </div>

              <div class="flex flex-col items-center">
                <div class="bg-white p-3 rounded-lg mb-4 shadow-inner">
                  <img
                    src="https://www.xendit.co/wp-content/uploads/2023/06/How-to-Enable-QR-Payments-for-Your-Business.jpeg"
                    alt="QR Code" class="w-40 h-40 object-contain mx-auto" />
                </div>
                <p class="text-center text-sm text-[#c9c9c9] max-w-xs">
                  Scan QR code untuk mengirim melalui aplikasi e-wallet favorit Anda
                </p>
              </div>
            </div>
          </div>

          <!-- Footer Note -->
          <p class="text-center text-[#c9c9c9] text-sm mt-12 italic">
            *Terima kasih telah menjadi bagian dari perjalanan cinta kami
          </p>
        </div>
      </section>


      <!-- Section: Penutup -->
      <section
        class="bg-gradient-to-b min-h-screen flex justify-center items-center from-[#1e1e1e] via-[#2a2a2a] to-[#363636] py-24 px-4 text-center relative overflow-hidden">
        <!-- Decorative elements -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[#d1bfa7] mix-blend-overlay filter blur-3xl">
          </div>
          <div
            class="absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-[#f8f4f0] mix-blend-overlay filter blur-3xl">
          </div>
        </div>

        <div class="max-w-2xl mx-auto relative z-10 ">
          <!-- Wedding of -->
          <div class="mb-2">
            <span class="text-xs uppercase tracking-[0.5em] text-[#d1bfa7] opacity-80">The Wedding of</span>
          </div>

          <!-- Couple Names -->
          <h1 class="text-5xl md:text-6xl lg:text-7xl font-serif font-light text-[#f8f4f0] mb-4 leading-tight">
            <span class="inline-block transform transition-all duration-500 hover:scale-105">Adam</span>
            <span class="mx-3 text-[#d1bfa7] font-thin">&</span>
            <span class="inline-block transform transition-all duration-500 hover:scale-105">Hawa</span>
          </h1>

          <!-- Date -->
          <div class="mb-10">
            <div class="w-24 h-px bg-gradient-to-r from-transparent via-[#d1bfa7]/50 to-transparent mx-auto mb-3"></div>
            <p class="text-sm tracking-widest text-[#d1bfa7] font-light">21 Oktober 2024</p>
            <div class="w-24 h-px bg-gradient-to-r from-transparent via-[#d1bfa7]/50 to-transparent mx-auto mt-3"></div>
          </div>

          <!-- Invitation Text -->
          <div class="mb-12">
            <p class="text-[#e0d5c5] text-lg leading-relaxed max-w-lg mx-auto font-light">
              Merupakan kehormatan dan kebahagiaan bagi kami atas kehadiran Bapak/Ibu/Saudara/i
              untuk memberikan doa restu dalam perjalanan rumah tangga kami.
            </p>
          </div>

          <!-- Signature -->
          <div class="mt-12">
            <div class="text-xs text-[#d1bfa7]/70 tracking-widest mb-1">With love,</div>
            <div class="text-xl font-serif text-[#f8e9d0] tracking-wider">Adam & Hawa</div>
          </div>
        </div>
      </section>

    </div>

  </div>
</template>

<script setup>
import GalleryInvitation from '@/components/invitation/GalleryInvitation.vue'
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'



/* === PALETTE SETUP === */
const defaultPalette = {
  primary: '#d6b18a',
  background: '#2e2e2e',
  text: '#f0f0f0',
  accent: '#b48c5b',
  border: '#444444'
}

const galleryImages = ref([
  // Featured image (large square - top left)
  {
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
    alt: 'Mountain landscape',
    caption: 'Beautiful mountain view at sunrise',
    colSpan: 1,
    rowSpan: 1
  },
  // Vertical image (top right)
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200',
    alt: 'Forest path',
    caption: 'Sunlight through the trees',
    colSpan: 1,
    rowSpan: 1
  },
  // Small square (middle right)
  {
    src: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f',
    thumbnail: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=200',
    alt: 'Beach sunset',
    caption: 'Golden hour at the beach',
    colSpan: 1,
    rowSpan: 1
  },
  // Wide horizontal (middle)
  {
    src: 'https://images.unsplash.com/photo-1470114716159-e389f8712fda',
    thumbnail: 'https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=400',
    alt: 'Waterfall',
    caption: 'Majestic waterfall in the jungle',
    colSpan: 1,
    rowSpan: 1
  },
  // Small square (bottom left)
  {
    src: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0',
    thumbnail: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=200',
    alt: 'Desert',
    caption: 'Sand dunes at sunset',
    colSpan: 1,
    rowSpan: 1
  },
  // Vertical image (bottom right)
  {
    src: 'https://images.unsplash.com/photo-1511497584788-876760111969',
    thumbnail: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=200',
    alt: 'Cityscape',
    caption: 'Urban skyline at night',
    colSpan: 1,
    rowSpan: 1
  },
  // Second row - left vertical
  {
    src: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07',
    thumbnail: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=200',
    alt: 'Flowers',
    caption: 'Colorful spring flowers',
    colSpan: 1,
    rowSpan: 1
  },
  // Small square (middle)
  {
    src: 'https://images.unsplash.com/photo-1417325384643-aac51acc9e5d',
    thumbnail: 'https://images.unsplash.com/photo-1417325384643-aac51acc9e5d?w=200',
    alt: 'Coffee',
    caption: 'Morning coffee time',
    colSpan: 1,
    rowSpan: 1
  },
  // Wide horizontal (bottom)
  {
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    thumbnail: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400',
    alt: 'Lake view',
    caption: 'Serene lake at dusk',
    colSpan: 1,
    rowSpan: 1
  },
  // Small square (top)
  {
    src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
    thumbnail: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=200',
    alt: 'Rock formation',
    caption: 'Natural rock arch',
    colSpan: 1,
    rowSpan: 1
  },
  // Vertical image (middle)
  {
    src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716',
    thumbnail: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=200',
    alt: 'Waterfall',
    caption: 'Misty forest waterfall',
    colSpan: 1,
    rowSpan: 1
  },
  // Small square (bottom)
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200',
    alt: 'Foggy landscape',
    caption: 'Mystical morning fog',
    colSpan: 1,
    rowSpan: 1
  }
])
const paletteColor = ref({ ...defaultPalette }) // jadi reactive bro

const usePaletteStyle = (palette) => ({
  background: {
    backgroundColor: palette.background,
    color: palette.text,
    borderColor: palette.border
  },
  gradientBottomFromTransparent: {
    backgroundImage: `linear-gradient(to bottom, rgba(255,0,0,0), ${palette.background})`,
    color: palette.text
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
  attendance: '',
  totalGuest: '', // baru ditambah
  message: '',
})

const wishesList = ref([])

const guestOptions = [1, 2, 3, 4, 5] // bisa diganti dari API nanti

// Misalnya mau fetch dari API:
onMounted(() => {
  // Example API call
  // fetch('/api/guest-options')
  //   .then(res => res.json())
  //   .then(data => guestOptions.value = data)
})

function submitRSVP() {
  if (rsvp.value.attendance === 'hadir' || rsvp.value.attendance === 'belum tau' || rsvp.value.attendance === 'tidak') {
    if (rsvp.value.name && rsvp.value.message) {
      wishesList.value.push({
        name: rsvp.value.name,
        message: rsvp.value.message
      })
    }
  }

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
let backgroundUrl = 'https://img.freepik.com/premium-photo/young-girl-wearing-flowery-headband-necklace-is-smiling-she-is-surrounded-by-other-people_715671-30163.jpg'

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
        console.warn("Tanggalnya gak valid bro", data.value.akadLocation.dateTime)
      }
    }

    if (data.value.bridePhotoUrl) {
      // Menggunakan encodeURI untuk menangani spasi dan karakter khusus lainnya
      backgroundUrl = encodeURI(data.value.bridePhotoUrl.trim());
      console.log("Encoded Background URL:", backgroundUrl)

      // Contoh implementasi ke CSS background
      document.documentElement.style.setProperty(
        '--background-url',
        `url('${backgroundUrl}')`
      );
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


.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.8s ease-in-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

/* Scrollbar umum */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>
