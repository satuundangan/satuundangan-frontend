<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden pb-20 md:pb-0 font-sans">
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" class="no-print" />

    <div :class="['flex-1 flex flex-col transition-all duration-300 min-w-0', isSidebarOpen ? 'md:ml-64' : 'md:ml-0']">
      <Topbar title="Buku Tamu & Meja Resepsi" showButton @toggleSidebar="isSidebarOpen = !isSidebarOpen" class="no-print" />

      <main class="p-4 md:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
        <!-- Top Navigation / Tab Switcher -->
        <div class="space-y-4 no-print">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-[#a47148]"></span>
                <h2 class="text-lg md:text-xl font-black text-slate-900 tracking-tight truncate">
                  {{ activeTab === 'standee' ? 'QR Code Meja Resepsi' : activeTab === 'wishes' ? 'Daftar Ucapan & Doa' : 'Scanner Tiket Tamu' }}
                </h2>
              </div>
              <p class="text-xs text-slate-400 mt-1 max-w-xl truncate">
                {{ activeTab === 'standee'
                  ? 'Cetak atau unduh standee QR Code untuk dipajang di meja penerima tamu.'
                  : activeTab === 'wishes'
                  ? 'Pesan ucapan dan doa restu yang dikirimkan para tamu undangan.'
                  : 'Mode panitia untuk memindai tiket QR unik dari HP tamu di meja resepsi.' }}
              </p>
            </div>

            <!-- Tab Buttons (Segmented compact control without overflow) -->
            <div class="inline-flex items-center bg-slate-200/80 p-1 rounded-2xl w-full sm:w-auto shrink-0 overflow-x-auto custom-scrollbar">
              <!-- Tab 1: Standee QR (DEFAULT) -->
              <button
                type="button"
                @click="activeTab = 'standee'"
                :class="[
                  'flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap',
                  activeTab === 'standee'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
                title="Dapatkan QR Code meja resepsi untuk dipajang"
              >
                <i class="fa-solid fa-qrcode text-emerald-600 text-xs"></i>
                <span>Standee QR</span>
              </button>

              <!-- Tab 2: Ucapan & Doa -->
              <button
                type="button"
                @click="activeTab = 'wishes'"
                :class="[
                  'flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap',
                  activeTab === 'wishes'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
                title="Lihat ucapan dan doa dari para tamu"
              >
                <i class="fa-solid fa-comments text-amber-600 text-xs"></i>
                <span>Ucapan & Doa</span>
                <span
                  v-if="messages.length > 0"
                  class="ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-black bg-amber-100 text-amber-800"
                >
                  {{ messages.length }}
                </span>
              </button>

              <!-- Tab 3: Scanner Panitia -->
              <button
                type="button"
                @click="activeTab = 'scanner'"
                :class="[
                  'flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap',
                  activeTab === 'scanner'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
                title="Mode scanner kamera untuk panitia"
              >
                <i class="fa-solid fa-camera text-blue-600 text-xs"></i>
                <span>Scanner Panitia</span>
                <span
                  v-if="checkedInCount > 0"
                  class="ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-black bg-blue-100 text-blue-700"
                >
                  {{ checkedInCount }}
                </span>
              </button>
            </div>
          </div>

          <!-- Selector & Actions Bar -->
          <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div class="flex-1">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                Pilih Undangan Aktif
              </label>
              <select
                v-model="selectedInvitationId"
                class="w-full border border-slate-200 rounded-xl px-3.5 py-2 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all cursor-pointer"
              >
                <option v-for="inv in invitations" :key="inv.id" :value="inv.id">
                  {{ inv.title }}
                </option>
              </select>
            </div>

            <!-- Standee Action Buttons -->
            <div v-if="activeTab === 'standee'" class="flex items-center gap-2 pt-2 md:pt-0">
              <button
                type="button"
                @click="downloadStandeeQr"
                :disabled="!standeeQrDataUrl"
                class="flex-1 md:flex-none px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <i class="fa-solid fa-download text-emerald-600"></i>
                <span>Download QR</span>
              </button>

              <button
                type="button"
                @click="openStandeePrintModal"
                :disabled="!standeeQrDataUrl"
                class="flex-1 md:flex-none px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <i class="fa-solid fa-print"></i>
                <span>Cetak Standee</span>
              </button>
            </div>

            <!-- Scanner action buttons -->
            <div v-else-if="activeTab === 'scanner'" class="flex items-center gap-2 pt-2 md:pt-0">
              <button
                type="button"
                @click="exportToExcel"
                :disabled="guests.length === 0"
                class="flex-1 md:flex-none px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                title="Download Rekap Kehadiran Excel"
              >
                <i class="fa-solid fa-file-excel text-emerald-600"></i>
                <span>Download Excel</span>
              </button>

              <button
                type="button"
                @click="printRekap"
                :disabled="guests.length === 0"
                class="flex-1 md:flex-none px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                title="Cetak / Print Rekap"
              >
                <i class="fa-solid fa-print"></i>
                <span>Cetak Rekap</span>
              </button>

              <button
                type="button"
                @click="refreshData"
                :disabled="loadingGuests"
                class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Segarkan Data"
              >
                <i :class="['fa-solid fa-rotate-right text-xs', loadingGuests ? 'animate-spin text-[#a47148]' : '']"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- TAB 1: QR CODE MEJA RESEPSI (STANDEE) -->
        <!-- ============================================== -->
        <div v-if="activeTab === 'standee'" class="space-y-6 main-dashboard-content">
          <!-- Top Guidance Alert -->
          <div class="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div class="flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 text-base shadow-sm">
                <i class="fa-solid fa-qrcode"></i>
              </div>
              <div>
                <h3 class="text-sm font-black text-slate-900 tracking-tight">
                  QR Code Buku Tamu Meja Resepsi
                </h3>
                <p class="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
                  Cetak atau pajang QR Code ini di meja resepsi / pintu masuk. Para tamu cukup scan menggunakan kamera HP mereka untuk langsung membuka buku tamu digital, menitipkan ucapan doa, konfirmasi hadir, atau mengirim amplop digital.
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0 w-full md:w-auto">
              <button
                type="button"
                @click="openStandeePrintModal"
                class="flex-1 md:flex-none px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <i class="fa-solid fa-print"></i>
                <span>Cetak Standee Siap Pakai</span>
              </button>
            </div>
          </div>

          <!-- Main Grid: QR Details & Mockup Standee -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- Left: QR Code & Direct Actions (col-span-12 lg:col-span-6) -->
            <div class="lg:col-span-6 space-y-6">
              <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-5">
                <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">File Siap Cetak</span>
                    <h3 class="text-base font-black text-slate-900 mt-0.5">QR Code Acara Pernikahan</h3>
                  </div>
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Resolusi Tinggi (HD)
                  </span>
                </div>

                <!-- QR Display Container -->
                <div class="text-center py-4 bg-slate-50/70 rounded-2xl border border-slate-100 flex flex-col items-center justify-center">
                  <div class="p-4 bg-white rounded-2xl shadow-sm border border-slate-200/80 inline-block">
                    <img
                      v-if="standeeQrDataUrl"
                      :src="standeeQrDataUrl"
                      alt="QR Code Meja Resepsi"
                      class="w-56 h-56 object-contain mx-auto"
                    />
                    <div v-else class="w-56 h-56 flex flex-col items-center justify-center text-slate-400">
                      <i class="fa-solid fa-circle-notch animate-spin text-2xl mb-2 text-[#a47148]"></i>
                      <span class="text-xs font-bold">Membuat QR Code...</span>
                    </div>
                  </div>

                  <p class="text-xs font-black text-slate-800 mt-3 truncate max-w-xs">
                    {{ currentInvitation?.title || 'Undangan Pernikahan' }}
                  </p>
                  <p class="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-sm">
                    {{ guestbookUrl }}
                  </p>
                </div>

                <!-- Action Buttons -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    @click="downloadStandeeQr"
                    :disabled="!standeeQrDataUrl"
                    class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <i class="fa-solid fa-download"></i>
                    <span>Download QR (PNG)</span>
                  </button>

                  <button
                    type="button"
                    @click="openStandeePrintModal"
                    :disabled="!standeeQrDataUrl"
                    class="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <i class="fa-solid fa-print"></i>
                    <span>Cetak Standee (PDF/Print)</span>
                  </button>
                </div>

                <!-- Secondary Link Actions -->
                <div class="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    @click="copyGuestbookUrl"
                    class="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <i class="fa-regular fa-copy"></i>
                    <span>Salin Link</span>
                  </button>

                  <button
                    type="button"
                    @click="openGuestPreview"
                    class="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    <span>Buka Tampilan Tamu</span>
                  </button>
                </div>
              </div>

              <!-- Practical Advice Card -->
              <div class="p-5 rounded-3xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-2">
                <div class="flex items-center gap-2 font-black text-blue-950">
                  <i class="fa-solid fa-lightbulb text-amber-500"></i>
                  <span>Saran Peletakan di Hari H</span>
                </div>
                <ul class="space-y-1.5 text-[11px] text-blue-800/90 pl-5 list-disc leading-relaxed">
                  <li>Cetak Standee dengan ukuran <strong>A5</strong> atau <strong>4R</strong>.</li>
                  <li>Masukkan ke dalam <em>acrylic standee</em> (bingkai akrilik bening berdiri) dan tempatkan tepat di meja resepsi.</li>
                  <li>Tamu tidak perlu mengunduh aplikasi apapun; cukup buka kamera bawaan ponsel Android maupun iPhone untuk scan QR.</li>
                </ul>
              </div>
            </div>

            <!-- Right: Acrylic Standee Mockup Preview (col-span-12 lg:col-span-6) -->
            <div class="lg:col-span-6 flex flex-col">
              <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex-1 flex flex-col justify-between space-y-5">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Simulasi Tampilan Meja</span>
                    <h3 class="text-sm font-black text-slate-900 mt-0.5">Preview Standee Meja Resepsi</h3>
                  </div>
                  <button
                    type="button"
                    @click="openStandeePrintModal"
                    class="text-xs font-bold text-slate-600 hover:text-slate-900 underline flex items-center gap-1 cursor-pointer"
                  >
                    <i class="fa-solid fa-expand text-[10px]"></i>
                    <span>Perbesar</span>
                  </button>
                </div>

                <!-- Visual Acrylic Frame Mockup -->
                <div class="relative max-w-xs sm:max-w-sm mx-auto w-full aspect-[1/1.4] bg-white rounded-2xl border-4 border-slate-200/90 shadow-2xl p-6 flex flex-col items-center justify-between text-center overflow-hidden">
                  <!-- Monogram / Logo Crest -->
                  <div class="space-y-1">
                    <div class="w-10 h-10 rounded-full bg-[#f6f2ec] border border-[#d4af37]/40 text-[#a47148] flex items-center justify-center font-serif text-sm font-bold mx-auto shadow-2xs">
                      SU
                    </div>
                    <span class="text-[9px] font-black uppercase tracking-[0.2em] text-[#a47148] block">
                      Buku Tamu Digital
                    </span>
                    <h4 class="font-serif text-sm font-bold text-slate-900 leading-tight">
                      {{ currentInvitation?.title || 'Romeo & Juliet' }}
                    </h4>
                  </div>

                  <!-- Frame Inner QR -->
                  <div class="p-3 bg-white border border-slate-200/70 rounded-xl shadow-inner my-2">
                    <img
                      v-if="standeeQrDataUrl"
                      :src="standeeQrDataUrl"
                      alt="QR Standee"
                      class="w-36 h-36 sm:w-40 sm:h-40 object-contain"
                    />
                  </div>

                  <!-- Greeting & Instructions -->
                  <div class="space-y-1.5 max-w-[240px]">
                    <p class="text-[10px] text-slate-600 leading-snug font-medium">
                      Silakan arahkan kamera ponsel Anda ke QR Code untuk mengisi ucapan, doa restu & konfirmasi kehadiran.
                    </p>
                    <p class="text-[8px] uppercase tracking-widest text-slate-400 font-bold">
                      Terima Kasih atas Kehadiran Anda
                    </p>
                  </div>
                </div>

                <!-- Button below mockup -->
                <button
                  type="button"
                  @click="openStandeePrintModal"
                  class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <i class="fa-solid fa-sliders"></i>
                  <span>Buka Opsi Cetak & Pilih Ukuran</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Section: Personalized Guest Ticket Explanation -->
          <div class="p-6 rounded-3xl bg-white border border-slate-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shrink-0">
                <i class="fa-solid fa-ticket"></i>
              </div>
              <div>
                <h4 class="text-sm font-black text-slate-900 tracking-tight">
                  Ingin Menggunakan Tiket Masuk Khusus Per Tamu (VIP / Meja Khusus)?
                </h4>
                <p class="text-xs text-slate-500 mt-0.5 max-w-2xl leading-relaxed">
                  Jika Anda mengundang tamu dengan link personal ber-token, masing-masing tamu otomatis memiliki tiket QR tersendiri di dalam undangan mereka yang dapat di-scan oleh panitia resepsi.
                </p>
              </div>
            </div>
            <router-link
              to="/guests"
              class="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Buka Menu Buku Tamu & Tiket</span>
              <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </router-link>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- TAB 3: SCANNER TIKET PANITIA -->
        <!-- ============================================== -->
        <div v-if="activeTab === 'scanner'" class="space-y-6 main-dashboard-content">
          <!-- Guidance Hint Banner for Scanner Panitia -->
          <div class="p-5 rounded-3xl bg-blue-50/70 border border-blue-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div class="flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 text-base shadow-sm">
                <i class="fa-solid fa-camera"></i>
              </div>
              <div>
                <h3 class="text-sm font-black text-slate-900 tracking-tight">
                  Scanner Meja Resepsi (Khusus Panitia / Pagar Ayu)
                </h3>
                <p class="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
                  Gunakan kamera ponsel/laptop panitia untuk memindai <strong>Tiket QR</strong> di ponsel tamu saat tiba di venue. Kamera <strong>tidak aktif otomatis</strong> demi privasi — tekan tombol <em>"Mulai Kamera"</em> saat acara dimulai. Jika tamu tidak membawa HP, gunakan kolom pencarian di sebelah kanan untuk check-in manual.
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-blue-800 text-xs font-black shadow-2xs">
                Mode Petugas Resepsi
              </span>
            </div>
          </div>

          <!-- 1. Live Stats Bar -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- Stat 1: Hadir di Lokasi -->
            <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-[10px] font-black uppercase tracking-wider text-slate-400">Hadir di Lokasi</p>
                  <h3 class="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    {{ checkedInCount }} / {{ totalGuestsCount }} Tamu
                    <span class="text-xs font-extrabold text-emerald-600">({{ checkInPercentage }}%)</span>
                  </h3>
                </div>
                <div class="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
                  <i class="fa-solid fa-user-check"></i>
                </div>
              </div>
              <div class="mt-3">
                <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    class="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    :style="{ width: `${checkInPercentage}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Stat 2: Total Tamu Terdaftar -->
            <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
              <div>
                <p class="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Tamu Terdaftar</p>
                <h3 class="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {{ totalGuestsCount }} Orang
                </h3>
                <p class="text-[11px] text-slate-400 mt-0.5">Berdasarkan daftar undangan</p>
              </div>
              <div class="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shrink-0">
                <i class="fa-solid fa-users"></i>
              </div>
            </div>

            <!-- Stat 3: Belum Check-in -->
            <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
              <div>
                <p class="text-[10px] font-black uppercase tracking-wider text-slate-400">Belum Check-in</p>
                <h3 class="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {{ notCheckedInCount }} Orang
                </h3>
                <p class="text-[11px] text-slate-400 mt-0.5">Menunggu kedatangan di meja resepsi</p>
              </div>
              <div class="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg shrink-0">
                <i class="fa-solid fa-clock"></i>
              </div>
            </div>
          </div>

          <!-- 2. Scanner & Manual Check-in Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- Left Column: Camera QR Scanner (col-span-12 lg:col-span-6) -->
            <div class="lg:col-span-6 space-y-4">
              <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl bg-[#a47148]/10 text-[#a47148] flex items-center justify-center text-sm font-black">
                      <i class="fa-solid fa-qrcode"></i>
                    </div>
                    <div>
                      <h3 class="font-black text-slate-900 text-sm">Scanner QR Tamu</h3>
                      <p class="text-[11px] text-slate-400">Arahkan kamera ke QR Code tiket tamu</p>
                    </div>
                  </div>

                  <span
                    :class="[
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider',
                      isScanning
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    ]"
                  >
                    <span :class="['w-2 h-2 rounded-full', isScanning ? 'bg-emerald-500 animate-ping' : 'bg-slate-400']"></span>
                    {{ isScanning ? 'Kamera Aktif' : 'Standby' }}
                  </span>
                </div>

                <!-- Camera Controls & Selector -->
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-slate-100">
                  <div class="flex-1">
                    <select
                      v-model="selectedCameraId"
                      @change="onCameraChange"
                      :disabled="isCameraStarting"
                      class="w-full border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#a47148]/20 cursor-pointer disabled:opacity-50"
                    >
                      <option v-if="availableCameras.length === 0" value="">
                        Kamera Bawaan (Default)
                      </option>
                      <option v-for="cam in availableCameras" :key="cam.id" :value="cam.id">
                        {{ cam.label || `Kamera ${cam.id.slice(0, 6)}...` }}
                      </option>
                    </select>
                  </div>

                  <div class="flex gap-2">
                    <button
                      v-if="!isScanning"
                      type="button"
                      @click="startCamera"
                      :disabled="isCameraStarting"
                      class="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <i :class="['fa-solid', isCameraStarting ? 'fa-circle-notch animate-spin' : 'fa-video']"></i>
                      <span>{{ isCameraStarting ? 'Menyiapkan...' : 'Mulai Kamera' }}</span>
                    </button>

                    <button
                      v-else
                      type="button"
                      @click="stopCamera"
                      class="flex-1 sm:flex-none px-4 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-black shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <i class="fa-solid fa-stop"></i>
                      <span>Hentikan Kamera</span>
                    </button>
                  </div>
                </div>

                <!-- Camera Scanner Viewport -->
                <div class="relative w-full aspect-square max-w-[340px] mx-auto rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center border-2 border-slate-800 shadow-inner">
                  <!-- The HTML5-QRCode Target Element -->
                  <div
                    id="qr-reader-container"
                    class="w-full h-full"
                    :class="{ hidden: !isScanning }"
                  ></div>

                  <!-- Inactive Camera Placeholder -->
                  <div v-if="!isScanning" class="text-center p-6 space-y-3">
                    <div class="w-16 h-16 rounded-2xl bg-white/10 text-white/60 flex items-center justify-center mx-auto text-2xl border border-white/10">
                      <i class="fa-solid fa-camera"></i>
                    </div>
                    <div>
                      <p class="text-xs font-black text-white">Kamera Belum Aktif</p>
                      <p class="text-[11px] text-white/50 mt-1 max-w-xs leading-relaxed">
                        Klik tombol <strong>"Mulai Kamera"</strong> untuk memindai QR code tiket tamu secara otomatis.
                      </p>
                    </div>
                    <button
                      type="button"
                      @click="startCamera"
                      :disabled="isCameraStarting"
                      class="px-4 py-2 bg-[#a47148] hover:bg-[#8e5e38] text-white rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
                    >
                      <i class="fa-solid fa-play text-[10px]"></i>
                      <span>Aktifkan Scanner</span>
                    </button>
                  </div>

                  <!-- Scanner Laser / Viewfinder Overlay when scanning -->
                  <div v-if="isScanning" class="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div class="w-56 h-56 border-2 border-emerald-400/80 rounded-2xl relative shadow-2xl">
                      <!-- Corner Markers -->
                      <div class="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-emerald-400"></div>
                      <div class="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-emerald-400"></div>
                      <div class="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-emerald-400"></div>
                      <div class="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-emerald-400"></div>
                      <!-- Laser Line -->
                      <div class="absolute inset-x-2 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-laser"></div>
                    </div>
                  </div>
                </div>

                <!-- Recent Scan Result Banner -->
                <transition name="fade">
                  <div v-if="recentScanResult" class="pt-2">
                    <!-- 1. Green celebratory card (New check-in) -->
                    <div
                      v-if="recentScanResult.type === 'new'"
                      class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 shadow-sm flex items-start gap-3.5 transition-all"
                    >
                      <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 text-base shadow-sm">
                        <i class="fa-solid fa-check-double"></i>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2">
                          <span class="text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-md">
                            Check-in Baru Berhasil
                          </span>
                          <button
                            type="button"
                            @click="recentScanResult = null"
                            class="text-emerald-400 hover:text-emerald-700 text-xs cursor-pointer"
                          >
                            <i class="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                        <h4 class="font-black text-sm text-emerald-950 mt-1 truncate">
                          ✅ Selamat Datang, {{ recentScanResult.guestName }}!
                        </h4>
                        <p class="text-xs text-emerald-800 font-medium mt-0.5">
                          Kategori: <span class="font-bold">{{ recentScanResult.group }}</span> • Pukul: <span class="font-bold">{{ recentScanResult.time }}</span>
                        </p>
                      </div>
                    </div>

                    <!-- 2. Amber alert card (Already checked in) -->
                    <div
                      v-else-if="recentScanResult.type === 'already'"
                      class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 shadow-sm flex items-start gap-3.5 transition-all"
                    >
                      <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 text-base shadow-sm">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2">
                          <span class="text-[9px] font-black uppercase tracking-wider text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md">
                            Peringatan Check-in Ganda
                          </span>
                          <button
                            type="button"
                            @click="recentScanResult = null"
                            class="text-amber-400 hover:text-amber-700 text-xs cursor-pointer"
                          >
                            <i class="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                        <h4 class="font-black text-xs sm:text-sm text-amber-950 mt-1">
                          ⚠️ Tamu ini sudah pernah check-in sebelumnya pada pukul {{ recentScanResult.time }}
                        </h4>
                        <p class="text-xs text-amber-800 font-medium mt-0.5">
                          Nama: <span class="font-bold">{{ recentScanResult.guestName }}</span> • Kategori: <span class="font-bold">{{ recentScanResult.group }}</span>
                        </p>
                      </div>
                    </div>

                    <!-- 3. Red alert card (Not found / Invalid) -->
                    <div
                      v-else-if="recentScanResult.type === 'not_found'"
                      class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 shadow-sm flex items-start gap-3.5 transition-all"
                    >
                      <div class="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 text-base shadow-sm">
                        <i class="fa-solid fa-circle-xmark"></i>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2">
                          <span class="text-[9px] font-black uppercase tracking-wider text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-md">
                            Tamu Tidak Ditemukan
                          </span>
                          <button
                            type="button"
                            @click="recentScanResult = null"
                            class="text-rose-400 hover:text-rose-700 text-xs cursor-pointer"
                          >
                            <i class="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                        <h4 class="font-black text-xs sm:text-sm text-rose-950 mt-1">
                          ❌ {{ recentScanResult.message }}
                        </h4>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>

            <!-- Right Column: Manual Search & Check-in + Live Arrival Feed (col-span-12 lg:col-span-6) -->
            <div class="lg:col-span-6 space-y-6">
              <!-- Cari Cepat & Check-in Manual Card -->
              <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-black">
                      <i class="fa-solid fa-user-check"></i>
                    </div>
                    <div>
                      <h3 class="font-black text-slate-900 text-sm">Cari Cepat & Check-in Manual</h3>
                      <p class="text-[11px] text-slate-400">Untuk tamu tanpa membawa HP atau QR code tiket</p>
                    </div>
                  </div>
                </div>

                <!-- Search Input -->
                <div class="relative">
                  <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                  <input
                    v-model="manualSearchQuery"
                    type="text"
                    placeholder="Ketik nama, telepon, atau kategori tamu..."
                    class="w-full border border-slate-200 rounded-xl pl-9 pr-8 py-2.5 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                  />
                  <button
                    v-if="manualSearchQuery"
                    type="button"
                    @click="manualSearchQuery = ''"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>

                <!-- Search Results List -->
                <div class="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                  <div
                    v-for="guest in matchingGuests"
                    :key="guest.id"
                    class="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-all flex items-center justify-between gap-3"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-black text-xs shrink-0">
                        {{ guest.name ? guest.name.charAt(0).toUpperCase() : '?' }}
                      </div>
                      <div class="min-w-0">
                        <div class="flex items-center gap-2">
                          <h4 class="font-black text-slate-900 text-xs truncate">{{ guest.name }}</h4>
                          <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                            {{ guest.group || 'Umum' }}
                          </span>
                        </div>
                        <p class="text-[10px] text-slate-400 mt-0.5 truncate">
                          {{ guest.phoneNumber || 'Tanpa nomor HP' }}
                        </p>
                      </div>
                    </div>

                    <!-- Action Button / Badge -->
                    <div class="shrink-0">
                      <span
                        v-if="guest.checkedInAt"
                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200"
                      >
                        <i class="fa-solid fa-check text-[9px]"></i>
                        <span>Hadir {{ formatTime(guest.checkedInAt) }}</span>
                      </span>

                      <button
                        v-else
                        type="button"
                        @click="manualCheckIn(guest)"
                        :disabled="isSubmittingManualCheckIn"
                        class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <i class="fa-solid fa-check text-[10px]"></i>
                        <span>Check-in</span>
                      </button>
                    </div>
                  </div>

                  <div v-if="matchingGuests.length === 0" class="py-6 text-center text-slate-400 space-y-1">
                    <i class="fa-solid fa-user-slash text-xl text-slate-300"></i>
                    <p class="text-xs font-bold">Tidak ada tamu yang cocok</p>
                    <p class="text-[11px] text-slate-400">Coba ketik kata kunci pencarian yang lain.</p>
                  </div>
                </div>
              </div>

              <!-- Daftar Tamu Baru Tiba (Live Arrival Feed) -->
              <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black">
                      <i class="fa-solid fa-bell"></i>
                    </div>
                    <div>
                      <h3 class="font-black text-slate-900 text-sm">Daftar Tamu Baru Tiba</h3>
                      <p class="text-[11px] text-slate-400">Live arrival feed berurutan dari yang terbaru</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Live ({{ checkedInGuests.length }})</span>
                  </div>
                </div>

                <!-- Feed list -->
                <div class="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                  <div
                    v-for="(guest, idx) in checkedInGuests"
                    :key="guest.id"
                    class="p-3 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition-all flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-8 h-8 rounded-xl bg-[#a47148] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                        {{ guest.name ? guest.name.charAt(0).toUpperCase() : '?' }}
                      </div>
                      <div class="min-w-0">
                        <div class="flex items-center gap-2">
                          <h4 class="font-black text-slate-900 text-xs truncate">{{ guest.name }}</h4>
                          <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                            {{ guest.group || 'Umum' }}
                          </span>
                        </div>
                        <p class="text-[10px] text-slate-400 mt-0.5">
                          Tamu ke-{{ checkedInGuests.length - idx }} tiba
                        </p>
                      </div>
                    </div>

                    <div class="text-right shrink-0">
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-black">
                        <i class="fa-regular fa-clock text-[9px]"></i>
                        {{ formatTime(guest.checkedInAt) }}
                      </span>
                    </div>
                  </div>

                  <div v-if="checkedInGuests.length === 0" class="py-10 text-center text-slate-400 space-y-2">
                    <div class="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto text-xl border border-slate-100">
                      <i class="fa-solid fa-users"></i>
                    </div>
                    <p class="text-xs font-bold text-slate-700">Belum Ada Tamu yang Tiba</p>
                    <p class="text-[11px] text-slate-400 max-w-xs mx-auto">
                      Scan QR tiket atau gunakan tombol check-in manual di atas saat tamu hadir di lokasi resepsi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- TAB 2: DAFTAR UCAPAN & DOA (EXISTING VIEW) -->
        <!-- ============================================== -->
        <div v-else-if="activeTab === 'wishes'" class="space-y-6 main-dashboard-content">
          <!-- Guidance Hint Banner for Wishes & Doa -->
          <div class="p-5 rounded-3xl bg-amber-50/70 border border-amber-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div class="flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 text-base shadow-sm">
                <i class="fa-solid fa-comments"></i>
              </div>
              <div>
                <h3 class="text-sm font-black text-slate-900 tracking-tight">
                  Pesan Ucapan & Doa Restu Tamu
                </h3>
                <p class="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
                  Semua ucapan dan doa yang dikirimkan tamu melalui undangan digital atau setelah scan QR di meja resepsi akan terkumpul di sini secara real-time. Anda dapat meninjau konfirmasi kehadiran (RSVP) serta pesan hangat dari keluarga dan sahabat tercinta.
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-amber-800 text-xs font-black shadow-2xs">
                Total {{ messages.length }} Pesan
              </span>
            </div>
          </div>

          <div v-if="loadingMessages" class="flex flex-col items-center justify-center py-20 text-slate-400">
            <i class="fa-solid fa-circle-notch animate-spin text-3xl mb-3 text-[#a47148]"></i>
            <p class="text-xs font-bold">Memuat pesan ucapan...</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="bg-white p-5 rounded-2xl shadow-xs border border-slate-100 hover:border-slate-200 transition-all relative flex flex-col justify-between"
            >
              <div>
                <div class="flex justify-between items-start mb-3 gap-2">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-9 h-9 bg-[#a47148] text-white rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
                      {{ msg.guestName ? msg.guestName.charAt(0).toUpperCase() : '?' }}
                    </div>
                    <div class="min-w-0">
                      <h4 class="font-extrabold text-slate-900 text-xs truncate">{{ msg.guestName }}</h4>
                      <p class="text-[10px] text-slate-400 font-medium">{{ formatDate(msg.createdAt) }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-1 shrink-0">
                    <span v-if="msg.rsvpStatus === 'hadir'" class="text-[9px] font-black uppercase px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-200">Hadir</span>
                    <span v-else-if="msg.rsvpStatus === 'tidak'" class="text-[9px] font-black uppercase px-2 py-0.5 bg-rose-50 text-rose-500 rounded-md border border-rose-200">Tidak Hadir</span>
                    <span v-else class="text-[9px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md border border-slate-200">Ragu</span>
                  </div>
                </div>

                <div class="relative py-2">
                  <p class="text-slate-600 text-xs leading-relaxed italic">"{{ msg.message }}"</p>
                </div>
              </div>

              <div class="pt-3 mt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  @click="handleDeleteMessage(msg.id)"
                  class="text-[10px] text-rose-400 hover:text-rose-600 font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <i class="fa-solid fa-trash-can"></i> Hapus Ucapan
                </button>
              </div>
            </div>

            <div v-if="messages.length === 0" class="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200 space-y-2">
              <div class="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300 text-xl border border-slate-100">
                <i class="fa-solid fa-comment-slash"></i>
              </div>
              <h3 class="font-extrabold text-slate-800 text-sm">Belum Ada Ucapan Masuk</h3>
              <p class="text-xs text-slate-400">Doa dan pesan kebahagiaan dari para tamu akan tampil di sini.</p>
            </div>
          </div>
        </div>

        <!-- Hidden Printable Recap Area -->
        <div
          id="printable-recap"
          v-if="printMode === 'rekap'"
          class="p-8 bg-white font-sans text-slate-900"
        >
          <div class="border-b-2 border-slate-900 pb-4 mb-6">
            <h1 class="text-2xl font-black uppercase tracking-tight">Rekapitulasi Kehadiran Tamu (Meja Resepsi)</h1>
            <p class="text-sm font-bold text-slate-600 mt-1">Undangan: {{ currentInvitation?.title || '-' }}</p>
            <p class="text-xs text-slate-500">
              Dicetak pada: {{ formatDateTime(new Date().toISOString()) }} • Total Terdaftar: {{ totalGuestsCount }} • Hadir: {{ checkedInCount }} ({{ checkInPercentage }}%)
            </p>
          </div>

          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-slate-300 text-slate-700 uppercase font-black text-[10px]">
                <th class="py-2 pr-2">No</th>
                <th class="py-2 px-2">Nama Tamu</th>
                <th class="py-2 px-2">Nomor HP</th>
                <th class="py-2 px-2">Kategori</th>
                <th class="py-2 px-2">RSVP</th>
                <th class="py-2 px-2">Status</th>
                <th class="py-2 pl-2">Waktu Check-in</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="(g, idx) in guests" :key="g.id">
                <td class="py-2 pr-2 font-bold">{{ idx + 1 }}</td>
                <td class="py-2 px-2 font-black">{{ g.name }}</td>
                <td class="py-2 px-2 text-slate-600">{{ g.phoneNumber || '-' }}</td>
                <td class="py-2 px-2">{{ g.group || 'Umum' }}</td>
                <td class="py-2 px-2 uppercase text-[10px] font-bold">{{ g.rsvpStatus || '-' }}</td>
                <td class="py-2 px-2 font-bold" :class="g.checkedInAt ? 'text-emerald-700' : 'text-slate-400'">
                  {{ g.checkedInAt ? 'HADIR' : 'Belum Hadir' }}
                </td>
                <td class="py-2 pl-2 text-slate-700">{{ g.checkedInAt ? formatDateTime(g.checkedInAt) : '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Hidden Standee Printable Sheet for @media print -->
        <div
          id="printable-standee"
          v-if="printMode === 'standee'"
          class="flex flex-col items-center justify-center p-12 bg-white text-center font-sans"
        >
          <div class="border-4 border-[#d4af37] p-12 rounded-3xl max-w-md mx-auto flex flex-col items-center justify-between space-y-6">
            <div class="space-y-2">
              <div class="w-16 h-16 rounded-full bg-slate-50 text-[#a47148] flex items-center justify-center font-serif text-2xl font-bold mx-auto border-2 border-[#d4af37]/60">
                SU
              </div>
              <span class="text-xs font-black uppercase tracking-[0.25em] text-[#a47148] block">
                Buku Tamu Digital
              </span>
              <h1 class="font-serif text-2xl font-bold text-slate-900">
                {{ currentInvitation?.title || 'Undangan Pernikahan' }}
              </h1>
            </div>

            <div class="p-6 bg-white border-2 border-slate-300 rounded-2xl shadow-sm">
              <img
                v-if="standeeQrDataUrl"
                :src="standeeQrDataUrl"
                alt="QR Code Buku Tamu"
                class="w-64 h-64 object-contain mx-auto"
              />
            </div>

            <div class="space-y-2 max-w-sm">
              <p class="text-sm text-slate-700 font-medium leading-relaxed">
                Silakan scan QR Code ini menggunakan kamera smartphone Anda untuk mengisi buku tamu, menyampaikan ucapan & doa restu, serta amplop digital.
              </p>
              <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold pt-4 border-t border-slate-200">
                www.satuundangan.id • Terima Kasih atas Doa Restu Anda
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Standee Print & Preview Modal -->
    <Teleport to="body">
      <div
        v-if="showStandeeModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto no-print"
        @click.self="showStandeeModal = false"
      >
        <div class="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs">
                <i class="fa-solid fa-print"></i>
              </div>
              <div>
                <h3 class="text-sm font-black text-slate-900">Cetak Standee Meja Resepsi</h3>
                <p class="text-[11px] text-slate-400">Format siap cetak langsung untuk dipajang di resepsi</p>
              </div>
            </div>
            <button
              type="button"
              @click="showStandeeModal = false"
              class="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 overflow-y-auto space-y-5 custom-scrollbar text-center">
            <!-- Paper Size Selector -->
            <div>
              <label class="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-2 text-left">
                Pilih Ukuran Kertas / Bingkai:
              </label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  @click="standeeSize = 'A4'"
                  :class="[
                    'py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer',
                    standeeSize === 'A4'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  ]"
                >
                  Ukuran A4 (Besar)
                </button>
                <button
                  type="button"
                  @click="standeeSize = 'A5'"
                  :class="[
                    'py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer',
                    standeeSize === 'A5'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  ]"
                >
                  Ukuran A5 (Standar)
                </button>
                <button
                  type="button"
                  @click="standeeSize = '4R'"
                  :class="[
                    'py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer',
                    standeeSize === '4R'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  ]"
                >
                  Ukuran 4R (Foto Meja)
                </button>
              </div>
            </div>

            <!-- Standee Printable Card Preview Inside Modal -->
            <div class="p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
              <div class="bg-white p-8 rounded-2xl shadow-md border-2 border-[#d4af37]/60 max-w-xs w-full text-center space-y-3">
                <div class="w-12 h-12 rounded-full bg-[#f6f2ec] text-[#a47148] flex items-center justify-center font-serif text-base font-bold mx-auto border border-[#d4af37]/40">
                  SU
                </div>
                <div>
                  <span class="text-[9px] font-black uppercase tracking-[0.2em] text-[#a47148] block">
                    Buku Tamu Digital
                  </span>
                  <h3 class="font-serif text-base font-bold text-slate-900 mt-0.5">
                    {{ currentInvitation?.title || 'Romeo & Juliet' }}
                  </h3>
                </div>
                <div class="p-3 bg-white border border-slate-200 rounded-xl inline-block shadow-inner">
                  <img
                    v-if="standeeQrDataUrl"
                    :src="standeeQrDataUrl"
                    alt="QR Standee"
                    class="w-44 h-44 object-contain mx-auto"
                  />
                </div>
                <p class="text-[10px] text-slate-600 leading-snug">
                  Arahkan kamera smartphone ke QR Code ini untuk mengisi buku tamu & ucapan doa.
                </p>
                <p class="text-[8px] uppercase tracking-widest text-slate-400 font-bold">
                  SatuUndangan.id
                </p>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <button
              type="button"
              @click="downloadStandeeQr"
              class="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <i class="fa-solid fa-download"></i>
              <span>Simpan Gambar PNG</span>
            </button>

            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="showStandeeModal = false"
                class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                @click="printStandee"
                class="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <i class="fa-solid fa-print"></i>
                <span>Cetak Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <BottomNav class="no-print" />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed, watch, nextTick } from "vue"
import Sidebar from "@/components/dashboard/SidebarDashboard.vue"
import Topbar from "@/components/dashboard/TopbarDashboard.vue"
import BottomNav from "@/components/dashboard/BottomNav.vue"
import { getInvitations } from "@/api/invitation"
import { getGuestMessagesByInvitationId, deleteGuestMessage } from "@/api/guestMessage"
import {
  getGuestsByInvitationId,
  checkInGuest,
  checkInGuestByToken,
  getCheckInSummary,
} from "@/api/guest"
import { useToast } from "vue-toastification"
import Swal from "sweetalert2"
import { Html5Qrcode } from "html5-qrcode"
import * as XLSX from "xlsx"
import { extractQrToken } from "@/utils/qrCheckIn"
import QRCode from "qrcode"
import { trackAction } from "@/utils/telemetry.js"

const toast = useToast()

// View states
const activeTab = ref('standee') // 'standee' | 'wishes' | 'scanner'
const isSidebarOpen = ref(window.innerWidth >= 768)

// Standee states
const showStandeeModal = ref(false)
const standeeSize = ref('A5')
const printMode = ref('standee') // 'standee' | 'rekap'
const standeeQrDataUrl = ref('')
const isGeneratingQr = ref(false)

// Invitations & Messages
const invitations = ref([])
const selectedInvitationId = ref(null)
const messages = ref([])
const loadingMessages = ref(false)

// Guests & Check-in
const guests = ref([])
const loadingGuests = ref(false)
const summaryData = ref(null)

// Camera & Scanner
let html5QrCode = null
const isScanning = ref(false)
const isCameraStarting = ref(false)
const availableCameras = ref([])
const selectedCameraId = ref('')
const recentScanResult = ref(null)
let isProcessingScan = false
let lastScannedText = ''
let lastScanTime = 0

// Manual Search
const manualSearchQuery = ref('')
const isSubmittingManualCheckIn = ref(false)

const currentInvitation = computed(() => {
  return invitations.value.find((i) => i.id === selectedInvitationId.value) || null
})

// Stats Computations
const totalGuestsCount = computed(() => {
  if (summaryData.value?.totalGuests !== undefined) return summaryData.value.totalGuests
  return guests.value.length
})

const checkedInGuests = computed(() => {
  return [...guests.value]
    .filter((g) => Boolean(g.checkedInAt))
    .sort((a, b) => new Date(b.checkedInAt).getTime() - new Date(a.checkedInAt).getTime())
})

const checkedInCount = computed(() => {
  if (summaryData.value?.checkedInCount !== undefined) return summaryData.value.checkedInCount
  return checkedInGuests.value.length
})

const notCheckedInCount = computed(() => {
  if (summaryData.value?.notCheckedInCount !== undefined) return summaryData.value.notCheckedInCount
  return Math.max(0, totalGuestsCount.value - checkedInCount.value)
})

const checkInPercentage = computed(() => {
  if (totalGuestsCount.value === 0) return 0
  return Math.round((checkedInCount.value / totalGuestsCount.value) * 100)
})

const matchingGuests = computed(() => {
  const q = manualSearchQuery.value.trim().toLowerCase()
  if (!q) {
    return guests.value.slice(0, 15)
  }
  return guests.value.filter((g) => {
    const name = (g.name || '').toLowerCase()
    const phone = (g.phoneNumber || '').toLowerCase()
    const group = (g.group || '').toLowerCase()
    return name.includes(q) || phone.includes(q) || group.includes(q)
  })
})

// Standee Computations & Actions
const guestbookUrl = computed(() => {
  if (!currentInvitation.value?.slug) return ''
  const origin = window.location.origin
  return `${origin}/inv/${currentInvitation.value.slug}`
})

async function generateStandeeQr() {
  if (!guestbookUrl.value) {
    standeeQrDataUrl.value = ''
    return
  }
  isGeneratingQr.value = true
  try {
    standeeQrDataUrl.value = await QRCode.toDataURL(guestbookUrl.value, {
      width: 600,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' },
    })
  } catch (err) {
    console.error('Failed to generate standee QR:', err)
  } finally {
    isGeneratingQr.value = false
  }
}

function downloadStandeeQr() {
  if (!standeeQrDataUrl.value) return
  trackAction('GUESTBOOK_QR_DOWNLOAD', { slug: currentInvitation.value?.slug })
  const link = document.createElement('a')
  link.download = `QR-Buku-Tamu-${currentInvitation.value?.slug || 'undangan'}.png`
  link.href = standeeQrDataUrl.value
  link.click()
  toast.success('Gambar QR Code berhasil diunduh!')
}

function openStandeePrintModal() {
  showStandeeModal.value = true
}

function printStandee() {
  trackAction('GUESTBOOK_STANDEE_PRINT', {
    slug: currentInvitation.value?.slug,
    size: standeeSize.value,
  })
  showStandeeModal.value = false

  const title = currentInvitation.value?.title || 'Romeo & Juliet'
  const qrImg = standeeQrDataUrl.value
  const sizeMap = {
    'A4': { cardWidth: '380px', qrSize: '240px', padding: '40px', titleSize: '24px' },
    'A5': { cardWidth: '320px', qrSize: '190px', padding: '30px', titleSize: '20px' },
    '4R': { cardWidth: '280px', qrSize: '160px', padding: '24px', titleSize: '18px' },
  }
  const s = sizeMap[standeeSize.value] || sizeMap['A5']

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Cetak Standee - ${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page { margin: 1cm; size: auto; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
    .standee-card {
      width: ${s.cardWidth};
      background: #ffffff;
      border: 3px solid rgba(212, 175, 55, 0.7);
      border-radius: 24px;
      padding: ${s.padding};
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }
    .monogram {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #fdfaf6;
      border: 1px solid rgba(212, 175, 55, 0.4);
      color: #a47148;
      font-family: 'Playfair Display', serif;
      font-size: 16px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 12px;
    }
    .badge-sub {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.22em;
      color: #a47148;
      display: block;
      margin-bottom: 4px;
    }
    .title {
      font-family: 'Playfair Display', serif;
      font-size: ${s.titleSize};
      font-weight: 700;
      color: #0f172a;
      line-height: 1.25;
      margin-bottom: 16px;
    }
    .qr-box {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      padding: 12px;
      display: inline-block;
      margin-bottom: 16px;
      box-shadow: inset 0 2px 6px rgba(0,0,0,0.03);
    }
    .qr-img {
      width: ${s.qrSize};
      height: ${s.qrSize};
      display: block;
      object-fit: contain;
    }
    .instruction {
      font-size: 11px;
      color: #475569;
      line-height: 1.5;
      font-weight: 500;
      margin-bottom: 16px;
    }
    .footer {
      font-size: 8px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      font-weight: 700;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
      padding-top: 12px;
    }
  </style>
</head>
<body>
  <div class="standee-card">
    <div class="monogram">SU</div>
    <span class="badge-sub">Buku Tamu Digital</span>
    <h1 class="title">${title}</h1>
    <div class="qr-box">
      <img src="${qrImg}" class="qr-img" alt="QR Code Buku Tamu" />
    </div>
    <p class="instruction">
      Arahkan kamera smartphone ke QR Code ini untuk mengisi buku tamu & ucapan doa.
    </p>
    <div class="footer">SatuUndangan.id</div>
  </div>
</body>
</html>`

  printViaIframe(htmlContent)
}

function printViaIframe(html) {
  const existingFrame = document.getElementById('satuundangan-print-frame')
  if (existingFrame) existingFrame.remove()

  const iframe = document.createElement('iframe')
  iframe.id = 'satuundangan-print-frame'
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  document.body.appendChild(iframe)

  const doc = iframe.contentWindow.document
  doc.open()
  doc.write(html)
  doc.close()

  iframe.contentWindow.focus()
  setTimeout(() => {
    iframe.contentWindow.print()
    setTimeout(() => {
      iframe.remove()
    }, 1000)
  }, 250)
}

function copyGuestbookUrl() {
  if (!guestbookUrl.value) return
  navigator.clipboard.writeText(guestbookUrl.value)
  toast.success('Tautan buku tamu berhasil disalin!')
}

function openGuestPreview() {
  if (!guestbookUrl.value) return
  window.open(guestbookUrl.value, '_blank')
}

onMounted(async () => {
  try {
    const res = await getInvitations()
    const data = Array.isArray(res) ? res : res.data || []
    invitations.value = data
    if (data.length > 0) {
      selectedInvitationId.value = data[0].id
      await generateStandeeQr()
    }
  } catch (e) {
    console.error(e)
  }
})

watch(selectedInvitationId, async (newId) => {
  if (newId) {
    recentScanResult.value = null
    await Promise.all([
      fetchGuests(newId),
      fetchMessages(newId),
      generateStandeeQr(),
    ])
  }
})

watch(activeTab, async (newTab) => {
  if (newTab !== 'scanner') {
    await stopCamera()
  }
})

onBeforeUnmount(async () => {
  await stopCamera()
  if (html5QrCode) {
    try {
      html5QrCode.clear()
    } catch {
      // ignore
    }
  }
})

async function refreshData() {
  if (selectedInvitationId.value) {
    await Promise.all([
      fetchGuests(selectedInvitationId.value),
      fetchMessages(selectedInvitationId.value)
    ])
    toast.info("Data meja resepsi diperbarui")
  }
}

async function fetchGuests(invId) {
  loadingGuests.value = true
  try {
    const res = await getGuestsByInvitationId(invId)
    guests.value = Array.isArray(res) ? res : res.data || []

    try {
      const summaryRes = await getCheckInSummary(invId)
      if (summaryRes) {
        summaryData.value = summaryRes.data || summaryRes
      }
    } catch {
      // Optional fallback computed from guests.value
    }
  } catch (e) {
    console.error(e)
    toast.error("Gagal memuat data tamu")
  } finally {
    loadingGuests.value = false
  }
}

async function fetchMessages(invId) {
  loadingMessages.value = true
  try {
    const res = await getGuestMessagesByInvitationId(invId)
    messages.value = Array.isArray(res) ? res : res.data || []
  } catch (e) {
    console.error(e)
    toast.error("Gagal memuat pesan ucapan")
  } finally {
    loadingMessages.value = false
  }
}

// ----------------------------------------------------
// Sound Feedback (Browser Web Audio API Oscillator)
// ----------------------------------------------------
function playSuccessChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime

    const playTone = (freq, time, duration, type = 'sine') => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, time)
      gain.gain.setValueAtTime(0.001, time)
      gain.gain.exponentialRampToValueAtTime(0.2, time + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(time)
      osc.stop(time + duration)
    }

    // Pleasant high melodic chord: C5 -> E5 -> G5 -> C6
    playTone(523.25, now, 0.25, 'triangle')
    playTone(659.25, now + 0.08, 0.25, 'triangle')
    playTone(783.99, now + 0.16, 0.35, 'sine')
    playTone(1046.5, now + 0.24, 0.45, 'sine')
  } catch (e) {
    console.warn('Web Audio error:', e)
  }
}

function playWarningChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(360, now)
    osc.frequency.setValueAtTime(280, now + 0.12)
    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.35)
  } catch (e) {
    console.warn('Web Audio warning chime error:', e)
  }
}

// ----------------------------------------------------
// Camera Scanner Logic
// ----------------------------------------------------
async function loadCameras() {
  try {
    const devices = await Html5Qrcode.getCameras()
    if (devices && devices.length > 0) {
      availableCameras.value = devices
      // Prefer back camera if available
      const backCam = devices.find((d) => {
        const l = (d.label || '').toLowerCase()
        return l.includes('back') || l.includes('belakang') || l.includes('rear') || l.includes('environment')
      })
      selectedCameraId.value = backCam ? backCam.id : devices[0].id
    }
  } catch (e) {
    console.warn('Could not enumerate cameras:', e)
  }
}

async function startCamera() {
  if (isScanning.value || isCameraStarting.value) return
  isCameraStarting.value = true

  try {
    await nextTick()
    const container = document.getElementById('qr-reader-container')
    if (!container) {
      throw new Error('Elemen kamera tidak ditemukan di layar')
    }

    if (!html5QrCode) {
      html5QrCode = new Html5Qrcode('qr-reader-container')
    }

    if (availableCameras.value.length === 0) {
      await loadCameras()
    }

    const cameraConfig = selectedCameraId.value
      ? selectedCameraId.value
      : { facingMode: 'environment' }

    await html5QrCode.start(
      cameraConfig,
      {
        fps: 10,
        qrbox: { width: 220, height: 220 },
        aspectRatio: 1.0,
      },
      (decodedText) => {
        handleQrCodeScanned(decodedText)
      },
      () => {
        // per-frame parse failure, normal when camera sees no barcode
      }
    )

    isScanning.value = true
  } catch (err) {
    console.error('Failed to start camera:', err)
    toast.error('Gagal mengakses kamera: ' + (err.message || 'Izin kamera ditolak'))
  } finally {
    isCameraStarting.value = false
  }
}

async function stopCamera() {
  if (html5QrCode && isScanning.value) {
    try {
      await html5QrCode.stop()
    } catch (e) {
      console.warn('Error stopping camera:', e)
    } finally {
      isScanning.value = false
    }
  }
}

async function onCameraChange() {
  if (isScanning.value) {
    await stopCamera()
    await startCamera()
  }
}



async function handleQrCodeScanned(decodedText) {
  if (!decodedText || isProcessingScan) return
  const now = Date.now()

  // Prevent duplicate trigger within 3 seconds for exact same code
  if (decodedText === lastScannedText && now - lastScanTime < 3000) {
    return
  }

  isProcessingScan = true
  lastScannedText = decodedText
  lastScanTime = now

  try {
    const token = extractQrToken(decodedText)

    // Check in local guests list first
    let guest = guests.value.find(
      (g) =>
        (g.accessToken && g.accessToken === token) ||
        (g.slug && g.slug === token) ||
        String(g.id) === token ||
        (g.phoneNumber && g.phoneNumber === token)
    )

    if (guest) {
      if (guest.checkedInAt) {
        playWarningChime()
        const timeStr = formatTime(guest.checkedInAt)
        recentScanResult.value = {
          type: 'already',
          guestName: guest.name,
          group: guest.group || 'Umum',
          time: timeStr,
          message: `Tamu ini sudah pernah check-in sebelumnya pada pukul ${timeStr}`,
        }
        toast.warning(`Tamu ${guest.name} sudah pernah check-in pada pukul ${timeStr}`)
        return
      }

      // Guest exists and not yet checked in
      const res = await checkInGuest(guest.id)
      const checkInTime = res?.check_in_time || res?.checkedInAt || new Date().toISOString()
      guest.checkedInAt = checkInTime

      playSuccessChime()
      const timeStr = formatTime(checkInTime)
      recentScanResult.value = {
        type: 'new',
        guestName: guest.name,
        group: guest.group || 'Umum',
        time: timeStr,
        message: `Selamat Datang, ${guest.name}! Kategori: ${guest.group || 'Umum'} • Pukul: ${timeStr}`,
      }
      toast.success(`Check-in berhasil: ${guest.name}`)
    } else {
      // Try backend checkInGuestByToken API
      try {
        const res = await checkInGuestByToken(token)
        playSuccessChime()
        const guestName = res?.guest?.name || res?.name || 'Tamu Undangan'
        const group = res?.guest?.group || res?.group || 'Umum'
        const timeStr = formatTime(res?.check_in_time || res?.checkedInAt || new Date().toISOString())
        recentScanResult.value = {
          type: 'new',
          guestName,
          group,
          time: timeStr,
          message: `Selamat Datang, ${guestName}! Kategori: ${group} • Pukul: ${timeStr}`,
        }
        toast.success(`Check-in berhasil: ${guestName}`)
        await fetchGuests(selectedInvitationId.value)
      } catch {
        playWarningChime()
        recentScanResult.value = {
          type: 'not_found',
          guestName: 'Tidak Diketahui',
          group: '-',
          time: formatTime(new Date()),
          message: 'Tamu / QR Code tidak terdaftar dalam undangan ini.',
        }
        toast.error('QR Code tidak valid atau tamu tidak ditemukan.')
      }
    }
  } catch (err) {
    console.error('Scan processing error:', err)
    toast.error('Gagal memproses check-in: ' + (err.message || 'Terjadi kesalahan'))
  } finally {
    setTimeout(() => {
      isProcessingScan = false
    }, 1500)
  }
}

// ----------------------------------------------------
// Manual Check-in Logic
// ----------------------------------------------------
async function manualCheckIn(guest) {
  if (guest.checkedInAt) {
    playWarningChime()
    const timeStr = formatTime(guest.checkedInAt)
    recentScanResult.value = {
      type: 'already',
      guestName: guest.name,
      group: guest.group || 'Umum',
      time: timeStr,
      message: `Tamu ini sudah pernah check-in sebelumnya pada pukul ${timeStr}`,
    }
    toast.warning(`Tamu ${guest.name} sudah check-in pada pukul ${timeStr}`)
    return
  }

  isSubmittingManualCheckIn.value = true
  try {
    const res = await checkInGuest(guest.id)
    const checkInTime = res?.check_in_time || res?.checkedInAt || new Date().toISOString()
    guest.checkedInAt = checkInTime

    playSuccessChime()
    const timeStr = formatTime(checkInTime)
    recentScanResult.value = {
      type: 'new',
      guestName: guest.name,
      group: guest.group || 'Umum',
      time: timeStr,
      message: `Selamat Datang, ${guest.name}! Kategori: ${guest.group || 'Umum'} • Pukul: ${timeStr}`,
    }
    toast.success(`Check-in berhasil: ${guest.name}`)
  } catch (err) {
    console.error('Manual check-in error:', err)
    toast.error('Gagal melakukan check-in: ' + (err.message || 'Terjadi kesalahan'))
  } finally {
    isSubmittingManualCheckIn.value = false
  }
}

// ----------------------------------------------------
// Export Rekap Kehadiran (Excel & Print)
// ----------------------------------------------------
function exportToExcel() {
  if (guests.value.length === 0) {
    toast.warning('Tidak ada data tamu untuk diexport')
    return
  }

  try {
    const rows = guests.value.map((g, idx) => ({
      'No': idx + 1,
      'Nama Tamu': g.name || '-',
      'Nomor WhatsApp': g.phoneNumber || '-',
      'Kategori': g.group || 'Umum',
      'Status RSVP': g.rsvpStatus || 'Belum Respon',
      'Status Kehadiran': g.checkedInAt ? 'Hadir di Lokasi' : 'Belum Check-in',
      'Waktu Check-in': g.checkedInAt ? formatDateTime(g.checkedInAt) : '-',
    }))

    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Rekap Kehadiran')

    const cleanTitle = (currentInvitation.value?.title || 'Undangan')
      .replace(/[/\\?%*:|"<>]/g, '-')
      .replace(/\s+/g, '_')
    const dateStr = new Date().toISOString().slice(0, 10)
    XLSX.writeFile(wb, `Rekap_Kehadiran_${cleanTitle}_${dateStr}.xlsx`)
    toast.success('Rekap kehadiran berhasil di-download')
  } catch (e) {
    console.error('Export excel error:', e)
    toast.error('Gagal mengekspor data ke Excel')
  }
}

function printRekap() {
  const title = currentInvitation.value?.title || '-'
  const dateStr = formatDateTime(new Date().toISOString())
  const rowsHtml = guests.value.map((g, idx) => `
    <tr>
      <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-weight: 700;">${idx + 1}</td>
      <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-weight: 800; color: #0f172a;">${g.name || '-'}</td>
      <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; color: #64748b;">${g.phoneNumber || '-'}</td>
      <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0;">${g.group || 'Umum'}</td>
      <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; text-transform: uppercase; font-size: 10px; font-weight: 700;">${g.rsvpStatus || '-'}</td>
      <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: ${g.checkedInAt ? '#047857' : '#94a3b8'};">
        ${g.checkedInAt ? 'HADIR' : 'Belum Hadir'}
      </td>
      <td style="padding: 6px 8px; border-bottom: 1px solid #e2e8f0; color: #475569;">${g.checkedInAt ? formatDateTime(g.checkedInAt) : '-'}</td>
    </tr>
  `).join('')

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Rekap Kehadiran - ${title}</title>
  <style>
    @page { margin: 1cm; size: landscape; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #0f172a; }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
    .title { font-size: 18px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; }
    .subtitle { font-size: 12px; font-weight: 700; color: #475569; margin-top: 4px; }
    .meta { font-size: 11px; color: #64748b; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; text-align: left; }
    th { padding: 8px; border-bottom: 2px solid #cbd5e1; text-transform: uppercase; font-size: 9px; font-weight: 800; color: #475569; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">Rekapitulasi Kehadiran Tamu (Meja Resepsi)</div>
    <div class="subtitle">Undangan: ${title}</div>
    <div class="meta">Dicetak: ${dateStr} • Total Tamu: ${totalGuestsCount.value} • Hadir: ${checkedInCount.value} (${checkInPercentage.value}%)</div>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 40px;">No</th>
        <th>Nama Tamu</th>
        <th>Nomor HP</th>
        <th>Kategori</th>
        <th>RSVP</th>
        <th>Status</th>
        <th>Waktu Check-in</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>
</body>
</html>`

  printViaIframe(htmlContent)
}

// ----------------------------------------------------
// Helpers & Message Deletion
// ----------------------------------------------------
function formatTime(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
  } catch {
    return '-'
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    const options = { day: 'numeric', month: 'short', year: 'numeric' }
    return new Date(dateStr).toLocaleDateString('id-ID', options)
  } catch {
    return '-'
  }
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    const date = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
    return `${date} ${time}`
  } catch {
    return '-'
  }
}

async function handleDeleteMessage(id) {
  const result = await Swal.fire({
    title: 'Hapus Ucapan Ini?',
    text: 'Ucapan tamu yang dihapus tidak dapat dikembalikan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#cbd5e1',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
  })

  if (!result.isConfirmed) return

  try {
    await deleteGuestMessage(id)
    toast.success('Ucapan berhasil dihapus')
    await fetchMessages(selectedInvitationId.value)
  } catch (e) {
    console.error(e)
    toast.error('Gagal menghapus ucapan: ' + (e.message || 'Terjadi kesalahan'))
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f1f5f9;
  border-radius: 10px;
}

@keyframes laser-sweep {
  0% {
    top: 5%;
    opacity: 0.2;
  }
  50% {
    top: 95%;
    opacity: 1;
  }
  100% {
    top: 5%;
    opacity: 0.2;
  }
}

.animate-laser {
  animation: laser-sweep 2s ease-in-out infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media print {
  @page {
    margin: 1cm;
    size: auto;
  }
  
  html, body {
    background: white !important;
    height: auto !important;
    overflow: visible !important;
  }

  /* Sembunyikan elemen dashboard & antarmuka aplikasi */
  .no-print,
  nav,
  aside,
  header {
    display: none !important;
  }

  /* Sembunyikan konten non-print di main */
  .main-dashboard-content {
    display: none !important;
  }

  /* Tampilkan hanya area yang dipilih untuk dicetak */
  #printable-recap {
    display: block !important;
    position: static !important;
    width: 100% !important;
    padding: 0 !important;
  }

  #printable-standee {
    display: flex !important;
    position: static !important;
    width: 100% !important;
    min-height: 80vh !important;
    padding: 2rem 0 !important;
    justify-content: center !important;
    align-items: center !important;
  }
}
</style>
