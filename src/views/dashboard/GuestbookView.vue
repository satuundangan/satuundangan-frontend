<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden pb-20 md:pb-0 font-sans">
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" class="no-print" />

    <div :class="['flex-1 flex flex-col transition-all duration-300 min-w-0', isSidebarOpen ? 'md:ml-64' : 'md:ml-0']">
      <Topbar title="Buku Tamu & Meja Resepsi" showButton @toggleSidebar="isSidebarOpen = !isSidebarOpen" class="no-print" />

      <main class="p-4 md:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
        <!-- Top Navigation / Tab Switcher -->
        <div class="space-y-4 no-print">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                {{ activeTab === 'reception' ? 'Meja Resepsi & Buku Tamu Digital' : 'Daftar Ucapan & Doa' }}
              </h2>
              <p class="text-xs text-slate-400 mt-1">
                {{ activeTab === 'reception'
                  ? 'Scan tiket QR tamu, check-in manual cepat, dan pantau statistik kehadiran langsung di meja resepsi.'
                  : 'Lihat ucapan dan konfirmasi kehadiran langsung dari para tamu.' }}
              </p>
            </div>

            <!-- Tab Buttons -->
            <div class="flex items-center bg-slate-200/70 p-1 rounded-2xl w-full sm:w-auto">
              <button
                type="button"
                @click="activeTab = 'reception'"
                :class="[
                  'flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer',
                  activeTab === 'reception'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
              >
                <i class="fa-solid fa-qrcode text-emerald-600"></i>
                <span>Meja Resepsi & Scanner QR</span>
                <span
                  v-if="checkedInCount > 0"
                  class="ml-1 px-1.5 py-0.5 text-[10px] rounded-full font-black bg-emerald-100 text-emerald-700"
                >
                  {{ checkedInCount }}
                </span>
              </button>

              <button
                type="button"
                @click="activeTab = 'wishes'"
                :class="[
                  'flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer',
                  activeTab === 'wishes'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
              >
                <i class="fa-solid fa-comments text-amber-600"></i>
                <span>Daftar Ucapan & Doa</span>
                <span
                  v-if="messages.length > 0"
                  class="ml-1 px-1.5 py-0.5 text-[10px] rounded-full font-black bg-amber-100 text-amber-800"
                >
                  {{ messages.length }}
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

            <!-- Reception action buttons -->
            <div v-if="activeTab === 'reception'" class="flex items-center gap-2 pt-2 md:pt-0">
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
        <!-- TAB 1: MEJA RESEPSI & SCANNER QR -->
        <!-- ============================================== -->
        <div v-if="activeTab === 'reception'" class="space-y-6">
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
        <div v-else-if="activeTab === 'wishes'" class="space-y-4">
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
        <div id="printable-recap" class="hidden print:block p-8 bg-white font-sans text-slate-900">
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
      </main>
    </div>

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

const toast = useToast()

// View states
const activeTab = ref('reception') // 'reception' | 'wishes'
const isSidebarOpen = ref(window.innerWidth >= 768)

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

onMounted(async () => {
  try {
    const res = await getInvitations()
    const data = Array.isArray(res) ? res : res.data || []
    invitations.value = data
    if (data.length > 0) {
      selectedInvitationId.value = data[0].id
    }
  } catch (e) {
    console.error(e)
  }

  await loadCameras()
})

watch(selectedInvitationId, async (newId) => {
  if (newId) {
    recentScanResult.value = null
    await Promise.all([fetchGuests(newId), fetchMessages(newId)])
  }
})

watch(activeTab, async (newTab) => {
  if (newTab !== 'reception') {
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
  window.print()
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
  body {
    background: white !important;
  }
  .no-print {
    display: none !important;
  }
  #printable-recap {
    display: block !important;
  }
}
</style>
