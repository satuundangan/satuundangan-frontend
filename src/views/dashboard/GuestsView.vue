<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden pb-20 md:pb-0 font-sans">
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" />

    <div
      :class="[
        'flex-1 flex flex-col transition-all duration-300 min-w-0',
        isSidebarOpen ? 'md:ml-64' : 'md:ml-0',
      ]"
    >
      <Topbar title="Daftar Tamu" showButton @toggleSidebar="isSidebarOpen = !isSidebarOpen" />

      <main class="p-4 md:p-8 flex-1 overflow-y-auto space-y-6 custom-scrollbar">
        <!-- Header & Main Actions -->
        <div class="space-y-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-3">
                <h2 class="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Manajemen Tamu</h2>
                <button
                  @click="showHelpModal = true"
                  class="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs hover:bg-blue-100 transition-colors"
                  title="Panduan Manajemen Tamu"
                >
                  <i class="fa-solid fa-circle-question"></i>
                </button>
              </div>
              <p class="text-xs text-slate-400 mt-1">Kelola daftar penerima, asisten sebar WhatsApp, dan pantau status kehadiran.</p>
            </div>

            <div class="flex flex-wrap gap-2 md:gap-3">
              <button
                @click="showAddModal = true"
                :disabled="!selectedInvitationId"
                class="flex-1 md:flex-none bg-[#a47148] text-white px-4 py-2.5 rounded-xl text-xs font-extrabold hover:bg-[#8e5e38] flex items-center justify-center gap-2 shadow-md shadow-[#a47148]/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                <i class="fa-solid fa-user-plus text-[11px]"></i> Tambah
              </button>
              <button
                @click="showBulkModal = true"
                :disabled="!selectedInvitationId"
                class="flex-1 md:flex-none bg-white text-slate-800 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
              >
                <i class="fa-solid fa-users text-[11px]"></i> Massal
              </button>
              <button
                @click="pickFromContacts"
                :disabled="!selectedInvitationId"
                class="flex-1 md:flex-none bg-white text-blue-600 border border-blue-100 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-50 flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
              >
                <i class="fa-solid fa-address-book text-[11px]"></i> Kontak
              </button>
              <div class="flex gap-1">
                <button
                  @click="triggerExcelImport"
                  :disabled="!selectedInvitationId"
                  class="flex-1 md:flex-none bg-white text-emerald-600 border border-emerald-100 px-4 py-2.5 rounded-l-xl text-xs font-bold hover:bg-emerald-50 flex items-center justify-center gap-2 disabled:opacity-50 transition-all border-r-0 cursor-pointer"
                >
                  <i class="fa-solid fa-file-excel text-[11px]"></i> Import
                </button>
                <button
                  @click="downloadTemplate"
                  :disabled="!selectedInvitationId"
                  class="bg-white text-emerald-600 border border-emerald-100 px-3 py-2.5 rounded-r-xl text-xs font-bold hover:bg-emerald-50 flex items-center justify-center disabled:opacity-50 transition-all cursor-pointer"
                  title="Download Template Excel"
                >
                  <i class="fa-solid fa-download text-[11px]"></i>
                </button>
              </div>
              <input
                type="file"
                ref="excelInput"
                class="hidden"
                accept=".xlsx, .xls"
                @change="handleExcelImport"
              />
            </div>
          </div>

          <!-- Selector & Search Row -->
          <div
            class="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row gap-4"
          >
            <div class="flex-1">
              <label
                class="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5"
                >Pilih Undangan</label
              >
              <select
                v-model="selectedInvitationId"
                class="w-full border border-slate-200 rounded-xl px-3.5 py-2 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
              >
                <option v-for="inv in invitations" :key="inv.id" :value="inv.id">
                  {{ inv.title }}
                </option>
              </select>
            </div>
            <div class="flex-1">
              <label
                class="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5"
                >Cari Nama / Kontak Tamu</label
              >
              <div class="relative">
                <i
                  class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
                ></i>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Ketik nama, telepon, atau grup tamu..."
                  class="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2 bg-gray-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#a47148]/20"
                />
              </div>
            </div>
          </div>

          <!-- Public vs Private Invitation Access Mode Toggle -->
          <div
            v-if="currentInvitation"
            class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div class="flex items-start gap-3.5">
              <div
                class="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-sm transition-colors"
                :class="currentInvitation.isGuestPublic === false ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'"
              >
                <i :class="currentInvitation.isGuestPublic === false ? 'fa-solid fa-lock' : 'fa-solid fa-earth-asia'"></i>
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-bold text-slate-900 text-xs sm:text-sm">Mode Privasi Undangan</h3>
                  <span
                    v-if="currentInvitation.isGuestPublic === false"
                    class="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide bg-amber-50 text-amber-800 border border-amber-200/80 inline-flex items-center gap-1"
                  >
                    <i class="fa-solid fa-lock text-[8px]"></i> MODE PRIVAT (TERKUNCI)
                  </span>
                  <span
                    v-else
                    class="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200/80 inline-flex items-center gap-1"
                  >
                    <i class="fa-solid fa-earth-asia text-[8px]"></i> AKSES PUBLIK (TERBUKA)
                  </span>
                </div>
                <p class="mt-0.5 max-w-2xl text-[11px] leading-relaxed text-slate-500">
                  {{ currentInvitation.isGuestPublic === false
                    ? 'Undangan dikunci khusus untuk tamu terdaftar. Orang asing yang membuka link utama akan disambut layar privat santun. Bagikan link khusus personal untuk masing-masing tamu.'
                    : 'Siapa saja dengan tautan utama dapat membuka dan melihat isi undangan. Cocok untuk perayaan umum atau resepsi massal.' }}
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              :aria-checked="currentInvitation.isGuestPublic !== false"
              :aria-label="currentInvitation.isGuestPublic !== false ? 'Kunci menjadi mode privat' : 'Buka menjadi mode publik'"
              :disabled="updatingGuestAccess"
              @click="toggleGuestAccess"
              class="relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
              :class="currentInvitation.isGuestPublic !== false ? 'bg-emerald-500' : 'bg-amber-600'"
              :title="currentInvitation.isGuestPublic !== false ? 'Klik untuk mengubah ke Mode Privat' : 'Klik untuk mengubah ke Mode Publik'"
            >
              <span
                class="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform"
                :class="currentInvitation.isGuestPublic !== false ? 'translate-x-6' : 'translate-x-1'"
              ></span>
            </button>
          </div>

          <!-- Section 3a: Stats & Progress Header Card -->
          <div
            v-if="currentInvitation"
            class="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-xs space-y-5"
          >
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <!-- Left: WhatsApp Distribution Progress -->
              <div class="space-y-2.5 flex-1">
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <span class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm shadow-xs">
                      <i class="fa-brands fa-whatsapp text-lg"></i>
                    </span>
                    <div>
                      <h3 class="font-black text-slate-900 text-sm md:text-base">Distribusi & Sebar WhatsApp</h3>
                      <p class="text-[11px] text-slate-400">Pantau progres penyebaran undangan dan kirim cepat ke seluruh tamu</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-sm md:text-base font-black text-emerald-600">
                      Terkirim: {{ sentGuestsCount }} / {{ totalGuestsCount }}
                    </span>
                    <span class="text-xs font-black text-slate-500 ml-1">({{ sentPercentage }}%)</span>
                  </div>
                </div>

                <!-- Visual Progress Bar -->
                <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div
                    class="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                    :style="{ width: `${sentPercentage}%` }"
                  ></div>
                </div>

                <div class="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                  <span class="flex items-center gap-1">
                    <i class="fa-solid fa-circle-check text-emerald-500"></i>
                    <span>{{ sentGuestsCount }} sudah terkirim</span>
                  </span>
                  <span class="flex items-center gap-1">
                    <i class="fa-regular fa-clock text-amber-500"></i>
                    <span>{{ unsentGuestsCount }} belum terkirim</span>
                  </span>
                </div>
              </div>

              <!-- Right: Distribution Assistant Buttons -->
              <div class="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                <button
                  @click="startQueueRunner"
                  :disabled="!selectedInvitationId || totalGuestsCount === 0"
                  class="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <i class="fa-solid fa-paper-plane text-xs"></i>
                  <span>Mulai Sebar WhatsApp</span>
                  <span
                    v-if="unsentGuestsCount > 0"
                    class="ml-1 px-1.5 py-0.5 rounded-full bg-emerald-800 text-[10px] font-bold"
                  >
                    {{ unsentGuestsCount }}
                  </span>
                </button>

                <button
                  @click="openTemplateModal"
                  :disabled="!selectedInvitationId"
                  class="flex-1 sm:flex-none px-3.5 py-2.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                  title="Atur Format Pesan WhatsApp"
                >
                  <i class="fa-solid fa-pen-to-square text-xs text-slate-500"></i>
                  <span>Template Pesan</span>
                </button>

                <button
                  @click="showExportModal = true"
                  :disabled="!selectedInvitationId || totalGuestsCount === 0"
                  class="px-3.5 py-2.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                  title="Salin Daftar Link Seluruh Tamu"
                >
                  <i class="fa-solid fa-link text-xs text-slate-500"></i>
                  <span class="hidden sm:inline">Salin Link</span>
                </button>
              </div>
            </div>

            <!-- RSVP Summary Bar -->
            <div class="pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2 text-slate-500 font-bold text-[11px]">
                <i class="fa-solid fa-clipboard-user text-slate-400"></i>
                <span>Status Kehadiran (RSVP):</span>
              </div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-50 text-green-700 text-[11px] font-bold border border-green-100">
                  <i class="fa-solid fa-circle-check text-[10px]"></i> Hadir: {{ rsvpAttendingCount }}
                </span>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 text-rose-600 text-[11px] font-bold border border-rose-100">
                  <i class="fa-solid fa-circle-xmark text-[10px]"></i> Tidak Hadir: {{ rsvpDeclinedCount }}
                </span>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200">
                  <i class="fa-solid fa-hourglass-half text-[10px]"></i> Menunggu: {{ rsvpPendingCount }}
                </span>
              </div>
            </div>
          </div>

          <!-- Section 3b: Status Filtering Tabs & Category Filter -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div class="inline-flex p-1 bg-slate-200/60 rounded-xl text-xs font-bold gap-1 self-start sm:self-auto">
              <button
                type="button"
                @click="statusFilter = 'all'"
                class="px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                :class="statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'"
              >
                <span>Semua</span>
                <span class="px-1.5 py-0.2 rounded-full text-[10px]" :class="statusFilter === 'all' ? 'bg-slate-100 text-slate-700' : 'bg-slate-300/60 text-slate-600'">
                  {{ totalGuestsCount }}
                </span>
              </button>
              <button
                type="button"
                @click="statusFilter = 'unsent'"
                class="px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                :class="statusFilter === 'unsent' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'"
              >
                <i class="fa-regular fa-clock text-[10px] text-amber-500"></i>
                <span>Belum Terkirim</span>
                <span class="px-1.5 py-0.2 rounded-full text-[10px]" :class="statusFilter === 'unsent' ? 'bg-amber-100 text-amber-800 font-extrabold' : 'bg-slate-300/60 text-slate-600'">
                  {{ unsentGuestsCount }}
                </span>
              </button>
              <button
                type="button"
                @click="statusFilter = 'sent'"
                class="px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                :class="statusFilter === 'sent' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'"
              >
                <i class="fa-solid fa-check text-[10px] text-emerald-500"></i>
                <span>Sudah Terkirim</span>
                <span class="px-1.5 py-0.2 rounded-full text-[10px]" :class="statusFilter === 'sent' ? 'bg-emerald-100 text-emerald-800 font-extrabold' : 'bg-slate-300/60 text-slate-600'">
                  {{ sentGuestsCount }}
                </span>
              </button>
            </div>

            <!-- Category filter dropdown if multiple groups exist -->
            <div v-if="uniqueGroups.length > 0" class="flex items-center gap-2">
              <span class="text-[11px] font-bold text-slate-400 whitespace-nowrap">Kategori:</span>
              <select
                v-model="groupFilter"
                class="border border-slate-200 rounded-xl px-3 py-1.5 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
              >
                <option value="">Semua Kategori</option>
                <option v-for="grp in uniqueGroups" :key="grp" :value="grp">{{ grp }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading Spinner -->
        <div v-if="loading" class="flex justify-center py-20">
          <i class="fa-solid fa-circle-notch animate-spin text-[#a47148] text-2xl"></i>
        </div>

        <!-- Section 3c: Table & Mobile List Upgrades -->
        <div v-else class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 class="font-bold text-slate-700 text-xs uppercase tracking-wider">
              Menampilkan: {{ filteredGuests.length }} Tamu
            </h3>
            <span v-if="searchQuery || statusFilter !== 'all' || groupFilter" class="text-[11px] text-slate-400 font-medium">
              Filter aktif
            </span>
          </div>

          <!-- Desktop Table -->
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead
                class="bg-gray-50 text-gray-400 uppercase text-[10px] font-bold tracking-widest"
              >
                <tr>
                  <th class="px-6 py-4">Nama Tamu</th>
                  <th class="px-6 py-4">Kategori</th>
                  <th class="px-6 py-4">Status Kirim</th>
                  <th class="px-6 py-4">Status RSVP</th>
                  <th class="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr
                  v-for="guest in filteredGuests"
                  :key="guest.id"
                  class="hover:bg-gray-50/50 transition-colors"
                >
                  <td class="px-6 py-4">
                    <p class="font-bold text-slate-900">{{ guest.name }}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <i class="fa-solid fa-phone text-[9px]"></i>
                      {{ guest.phoneNumber || 'Tanpa nomor HP' }}
                    </p>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="px-2.5 py-1 rounded-lg text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider"
                      >{{ guest.group || 'Umum' }}</span
                    >
                  </td>
                  <td class="px-6 py-4">
                    <!-- Interactive Status Badge: click to toggle -->
                    <button
                      type="button"
                      @click="toggleGuestStatusSend(guest)"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide transition-all cursor-pointer border shadow-2xs hover:scale-105 active:scale-95"
                      :class="guest.statusSend === 'sent'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100'
                        : 'bg-amber-50 text-amber-700 border-amber-200/80 hover:bg-amber-100'"
                      :title="guest.statusSend === 'sent' ? 'Klik untuk tandai Belum Terkirim' : 'Klik untuk tandai Sudah Terkirim'"
                    >
                      <i :class="guest.statusSend === 'sent' ? 'fa-solid fa-check text-[9px]' : 'fa-regular fa-clock text-[9px]'"></i>
                      <span>{{ guest.statusSend === 'sent' ? 'Terkirim' : 'Belum Terkirim' }}</span>
                    </button>
                  </td>
                  <td class="px-6 py-4">
                    <div
                      v-if="guest.rsvpStatus === 'hadir'"
                      class="flex items-center gap-1.5 text-green-600 font-bold text-xs"
                    >
                      <i class="fa-solid fa-circle-check"></i> Hadir
                    </div>
                    <div
                      v-else-if="guest.rsvpStatus === 'tidak'"
                      class="flex items-center gap-1.5 text-red-400 font-bold text-xs"
                    >
                      <i class="fa-solid fa-circle-xmark"></i> Tidak
                    </div>
                    <div v-else class="text-gray-300 text-[10px] italic">Menunggu...</div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                      <button
                        @click="openShareModal(guest)"
                        :class="
                          currentInvitation?.isPublished
                            ? 'text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100'
                            : 'text-gray-300 bg-gray-50'
                        "
                        class="w-9 h-9 flex items-center justify-center rounded-xl transition cursor-pointer"
                        title="Kirim Pesan WhatsApp"
                      >
                        <i class="fa-brands fa-whatsapp text-lg"></i>
                      </button>
                      <button
                        @click="copyGuestIndividualLink(guest)"
                        class="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                        title="Salin Link Undangan"
                      >
                        <i class="fa-regular fa-copy text-xs"></i>
                      </button>
                      <button
                        @click="deleteGuestHandler(guest.id)"
                        class="w-9 h-9 flex items-center justify-center text-red-400 hover:text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition cursor-pointer"
                        title="Hapus Tamu"
                      >
                        <i class="fa-solid fa-trash-can text-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards View -->
          <div class="md:hidden divide-y divide-gray-50">
            <div v-for="guest in filteredGuests" :key="guest.id" class="p-4 space-y-3">
              <div class="flex justify-between items-start">
                <div class="min-w-0 flex-1 pr-3">
                  <p class="font-bold text-slate-900 truncate">{{ guest.name }}</p>
                  <p class="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <i class="fa-solid fa-phone text-[8px]"></i>
                    {{ guest.phoneNumber || 'Tanpa nomor HP' }}
                  </p>
                </div>
                <span
                  class="shrink-0 px-2 py-0.5 rounded-lg text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider"
                  >{{ guest.group || 'Umum' }}</span
                >
              </div>

              <!-- Status badge & RSVP row -->
              <div class="flex items-center justify-between gap-2">
                <button
                  type="button"
                  @click="toggleGuestStatusSend(guest)"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide transition-all cursor-pointer border"
                  :class="guest.statusSend === 'sent'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'"
                >
                  <i :class="guest.statusSend === 'sent' ? 'fa-solid fa-check text-[9px]' : 'fa-regular fa-clock text-[9px]'"></i>
                  <span>{{ guest.statusSend === 'sent' ? 'Terkirim' : 'Belum Terkirim' }}</span>
                </button>

                <div class="text-xs">
                  <div
                    v-if="guest.rsvpStatus === 'hadir'"
                    class="flex items-center gap-1.5 text-green-600 font-bold"
                  >
                    <i class="fa-solid fa-circle-check"></i> Hadir
                  </div>
                  <div
                    v-else-if="guest.rsvpStatus === 'tidak'"
                    class="flex items-center gap-1.5 text-red-400 font-bold"
                  >
                    <i class="fa-solid fa-circle-xmark"></i> Tidak
                  </div>
                  <div v-else class="text-gray-300 italic text-[10px]">Menunggu...</div>
                </div>
              </div>

              <!-- Card Actions -->
              <div class="flex items-center justify-end gap-2 pt-1 border-t border-slate-50">
                <button
                  @click="copyGuestIndividualLink(guest)"
                  class="h-9 px-3 flex items-center justify-center text-slate-600 bg-slate-100 active:bg-slate-200 rounded-xl text-xs font-bold gap-1.5 transition"
                >
                  <i class="fa-regular fa-copy text-xs"></i>
                  <span>Salin Link</span>
                </button>
                <button
                  @click="openShareModal(guest)"
                  :class="
                    currentInvitation?.isPublished
                      ? 'text-white bg-emerald-600 active:bg-emerald-700 shadow-xs'
                      : 'text-gray-400 bg-gray-100'
                  "
                  class="h-9 px-3 flex items-center justify-center rounded-xl text-xs font-bold gap-1.5 transition"
                >
                  <i class="fa-brands fa-whatsapp text-sm"></i>
                  <span>Kirim WA</span>
                </button>
                <button
                  @click="deleteGuestHandler(guest.id)"
                  class="w-9 h-9 flex items-center justify-center text-red-400 bg-red-50 active:bg-red-100 rounded-xl transition"
                  title="Hapus"
                >
                  <i class="fa-solid fa-trash-can text-sm"></i>
                </button>
              </div>
            </div>
          </div>

          <div v-if="filteredGuests.length === 0" class="px-6 py-12 text-center">
            <div class="text-gray-300 mb-2"><i class="fa-solid fa-users-slash text-3xl"></i></div>
            <p class="text-gray-400 text-xs italic">Belum ada tamu atau nama tidak ditemukan dalam filter ini.</p>
          </div>
        </div>
      </main>
    </div>

    <!-- Section 3d: Template Pesan WhatsApp Modal -->
    <div
      v-if="showTemplateModal"
      class="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs overflow-y-auto"
    >
      <div class="bg-white rounded-3xl w-full max-w-3xl p-5 sm:p-7 shadow-2xl animate-scale-up my-auto max-h-[92vh] flex flex-col">
        <!-- Modal Header -->
        <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 class="font-black text-lg sm:text-xl text-slate-900 flex items-center gap-2">
              <i class="fa-brands fa-whatsapp text-emerald-600"></i>
              Template Pesan WhatsApp
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              Sesuaikan pesan undangan otomatis yang akan terkirim ke WhatsApp setiap tamu.
            </p>
          </div>
          <button
            @click="showTemplateModal = false"
            class="w-8 h-8 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="flex-1 overflow-y-auto py-4 space-y-4 custom-scrollbar">
          <!-- 4 Quick Preset Buttons -->
          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
              4 Pilihan Preset Cepat
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                v-for="p in PRESETS"
                :key="p.id"
                type="button"
                @click="applyPreset(p)"
                class="p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer"
                :class="templateText === p.content ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500' : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'"
              >
                <div class="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <i class="fa-solid fa-wand-magic-sparkles text-[10px] text-emerald-600"></i>
                  {{ p.title }}
                </div>
                <div class="text-[10px] text-slate-400 mt-1 line-clamp-1">{{ p.desc }}</div>
              </button>
            </div>
          </div>

          <!-- Variable Placeholders -->
          <div>
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
              Variabel Placeholder (Klik untuk Sisipkan):
            </label>
            <div class="flex items-center gap-1.5 flex-wrap">
              <button
                v-for="tag in ['[GuestName]', '[CoupleName]', '[GroomName]', '[BrideName]', '[Link]']"
                :key="tag"
                type="button"
                @click="insertPlaceholder(tag)"
                class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-mono font-bold transition-colors border border-slate-200/80 cursor-pointer"
              >
                + {{ tag }}
              </button>
            </div>
          </div>

          <!-- Editor & Real-time Preview Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Left: Textarea -->
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
                Teks Template Pesan
              </label>
              <textarea
                ref="templateTextareaRef"
                v-model="templateText"
                rows="11"
                class="w-full border border-slate-200 rounded-2xl p-3.5 bg-slate-50 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all custom-scrollbar leading-relaxed"
                placeholder="Tulis pesan template undangan di sini..."
              ></textarea>
            </div>

            <!-- Right: Real-time WhatsApp Preview -->
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                <span>Real-Time Preview</span>
                <span class="text-slate-400 font-normal">Tampilan di WhatsApp Tamu</span>
              </label>
              <div class="border border-slate-200 rounded-2xl bg-[#efeae2] p-3 sm:p-4 overflow-y-auto shadow-inner flex flex-col justify-end max-h-[260px] custom-scrollbar">
                <div class="bg-white rounded-2xl rounded-tl-none p-3.5 shadow-xs max-w-[95%] self-start border border-slate-200/50 space-y-1">
                  <div class="text-[11px] sm:text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-sans select-none break-words">
                    {{ previewFormattedMessage }}
                  </div>
                  <div class="text-[9px] text-slate-400 text-right flex items-center justify-end gap-1 select-none">
                    <span>12:00</span>
                    <i class="fa-solid fa-check-double text-sky-500"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            @click="showTemplateModal = false"
            class="px-4 py-2.5 text-slate-500 hover:text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Batal
          </button>
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="resetToDefaultTemplate"
              class="px-3.5 py-2.5 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Reset Default
            </button>
            <button
              type="button"
              @click="saveWhatsAppTemplate"
              :disabled="isSavingTemplate"
              class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <i v-if="isSavingTemplate" class="fa-solid fa-circle-notch animate-spin text-xs"></i>
              <i v-else class="fa-solid fa-floppy-disk text-xs"></i>
              <span>{{ isSavingTemplate ? 'Menyimpan...' : 'Simpan Template' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 3e: Mode Kirim Cepat (Queue Runner / Assistant Modal) -->
    <div
      v-if="showQueueModal"
      class="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs overflow-y-auto"
    >
      <div class="bg-white rounded-3xl w-full max-w-xl p-5 sm:p-7 shadow-2xl animate-scale-up my-auto max-h-[92vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                <i class="fa-solid fa-paper-plane"></i>
              </span>
              <h3 class="font-black text-base sm:text-lg text-slate-900">
                Asisten Sebar WhatsApp
              </h3>
            </div>
            <p class="text-[11px] text-slate-400 mt-0.5">
              Mode sebar cepat personal: buka WhatsApp & otomatis tandai terkirim ke antrean berikutnya.
            </p>
          </div>
          <button
            @click="showQueueModal = false"
            class="w-7 h-7 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <i class="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>

        <!-- All Sent Celebratory State -->
        <div v-if="unsentGuests.length === 0" class="py-12 px-4 text-center space-y-4 my-auto">
          <div class="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div class="space-y-1">
            <h4 class="text-xl font-black text-slate-900">Semua Undangan Terkirim! 🎉</h4>
            <p class="text-xs text-slate-500 max-w-sm mx-auto">
              Luar biasa! Seluruh {{ totalGuestsCount }} tamu dalam daftar undangan telah berhasil ditandai terkirim via WhatsApp.
            </p>
          </div>
          <div class="pt-4 flex justify-center gap-3">
            <button
              @click="showQueueModal = false"
              class="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Selesai & Tutup
            </button>
          </div>
        </div>

        <!-- Active Queue Item State -->
        <div v-else class="flex-1 overflow-y-auto py-4 space-y-4 custom-scrollbar">
          <!-- Progress Indicator -->
          <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
            <div>
              <span class="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Antrean Tamu Belum Terkirim</span>
              <span class="text-xs font-black text-slate-800">
                Tamu ke-{{ currentQueueIndex + 1 }} dari {{ unsentGuests.length }} belum terkirim
              </span>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
              {{ sentPercentage }}% Selesai
            </span>
          </div>

          <!-- Current Guest Card -->
          <div v-if="currentQueueGuest" class="bg-white rounded-2xl border-2 border-emerald-500/25 p-4 shadow-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <h4 class="text-lg font-black text-slate-900">{{ currentQueueGuest.name }}</h4>
                <div class="flex items-center gap-2 mt-1 flex-wrap">
                  <span class="px-2 py-0.5 rounded-md text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                    {{ currentQueueGuest.group || 'Umum' }}
                  </span>
                  <span v-if="currentQueueGuest.phoneNumber" class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <i class="fa-brands fa-whatsapp text-emerald-600 text-xs"></i>
                    {{ currentQueueGuest.phoneNumber }}
                  </span>
                  <span v-else class="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <i class="fa-solid fa-triangle-exclamation mr-1"></i>Belum ada nomor HP
                  </span>
                </div>
              </div>
            </div>

            <!-- WhatsApp Preview Bubble for this guest -->
            <div>
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                Pesan WhatsApp Personal:
              </span>
              <div class="bg-[#efeae2] rounded-xl p-3 max-h-48 overflow-y-auto custom-scrollbar border border-slate-200/50">
                <div class="bg-white rounded-xl rounded-tl-none p-3 shadow-xs max-w-[95%] text-xs text-slate-800 whitespace-pre-wrap leading-relaxed select-none break-words">
                  {{ currentQueueGuestFormattedMessage }}
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div v-if="currentQueueGuest" class="space-y-2.5 pt-2">
            <button
              type="button"
              @click="markAndSendCurrentInQueue"
              class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <i class="fa-brands fa-whatsapp text-lg"></i>
              <span>Buka WhatsApp & Tandai Terkirim</span>
              <i class="fa-solid fa-arrow-right text-xs ml-1"></i>
            </button>

            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                @click="prevInQueue"
                :disabled="currentQueueIndex === 0"
                class="py-2.5 px-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <i class="fa-solid fa-chevron-left text-[10px]"></i>
                <span>Sebelumnya</span>
              </button>

              <button
                type="button"
                @click="markSentOnlyInQueue"
                class="py-2.5 px-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                title="Tandai status Terkirim tanpa membuka WhatsApp"
              >
                <i class="fa-solid fa-check text-emerald-600 text-xs"></i>
                <span>Tandai Saja</span>
              </button>

              <button
                type="button"
                @click="nextInQueue"
                :disabled="currentQueueIndex >= unsentGuests.length - 1"
                class="py-2.5 px-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Lewati</span>
                <i class="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 3f: Export / Salin Daftar Link Modal -->
    <div
      v-if="showExportModal"
      class="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs overflow-y-auto"
    >
      <div class="bg-white rounded-3xl w-full max-w-lg p-5 sm:p-7 shadow-2xl animate-scale-up my-auto max-h-[92vh] flex flex-col">
        <!-- Header -->
        <div class="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 class="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <i class="fa-solid fa-link text-[#a47148]"></i>
              Salin Daftar Link Undangan
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">
              Format daftar teks rapi untuk dibagikan via grup, broadcast manual, atau catatan keluarga.
            </p>
          </div>
          <button
            @click="showExportModal = false"
            class="w-7 h-7 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <i class="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>

        <!-- Filter Selection -->
        <div class="py-3 flex items-center gap-1.5 flex-wrap">
          <span class="text-[11px] font-bold text-slate-400">Filter:</span>
          <button
            type="button"
            @click="exportFilter = 'all'"
            class="px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            :class="exportFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            Semua ({{ totalGuestsCount }})
          </button>
          <button
            type="button"
            @click="exportFilter = 'unsent'"
            class="px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            :class="exportFilter === 'unsent' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            Belum Terkirim ({{ unsentGuestsCount }})
          </button>
          <button
            type="button"
            @click="exportFilter = 'sent'"
            class="px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            :class="exportFilter === 'sent' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
          >
            Sudah Terkirim ({{ sentGuestsCount }})
          </button>
        </div>

        <!-- Links Textarea -->
        <div class="flex-1 overflow-y-auto py-1">
          <textarea
            readonly
            :value="exportListText"
            rows="10"
            class="w-full border border-slate-200 rounded-2xl p-3.5 bg-slate-50 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-slate-900/10 custom-scrollbar leading-relaxed"
          ></textarea>
        </div>

        <!-- Modal Footer -->
        <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            @click="showExportModal = false"
            class="px-4 py-2.5 text-slate-500 hover:text-slate-800 font-bold text-xs cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            @click="copyExportList"
            :disabled="!exportListText"
            class="px-5 py-2.5 bg-[#a47148] hover:bg-[#8e5e38] text-white rounded-xl text-xs font-black shadow-md shadow-[#a47148]/20 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
          >
            <i class="fa-solid fa-copy text-xs"></i>
            <span>Salin Semua Link</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Add Single Guest Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 shadow-xl animate-scale-up">
        <h3 class="font-bold text-xl mb-6 text-slate-900 flex items-center gap-2">
          <i class="fa-solid fa-user-plus text-[#a47148]"></i> Tambah Tamu
        </h3>
        <div class="space-y-4">
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1"
              >Nama Tamu</label
            >
            <input
              v-model="newGuest.name"
              type="text"
              class="w-full border border-gray-100 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-[#a47148]/20 outline-none text-sm"
              placeholder="Misal: Budi Santoso"
            />
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1"
              >Kategori</label
            >
            <select
              v-model="newGuest.group"
              class="w-full border border-gray-100 rounded-xl p-3 bg-gray-50 text-sm"
            >
              <option value="">Umum</option>
              <option value="Keluarga">Keluarga</option>
              <option value="Teman">Teman</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
          <div>
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1"
              >WhatsApp (08...)</label
            >
            <input
              v-model="newGuest.phoneNumber"
              type="text"
              class="w-full border border-gray-100 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-[#a47148]/20 outline-none text-sm"
              placeholder="085121266550"
            />
          </div>
        </div>
        <div class="mt-8 flex gap-3">
          <button @click="showAddModal = false" class="flex-1 py-3 text-gray-400 font-bold text-sm cursor-pointer">
            Batal
          </button>
          <button
            @click="submitGuest"
            :disabled="isSubmitting"
            class="flex-[2] py-3 bg-[#a47148] text-white rounded-xl text-sm font-bold disabled:opacity-50 cursor-pointer"
          >
            {{ isSubmitting ? 'Menyimpan...' : 'Simpan Tamu' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Bulk Add Modal -->
    <div
      v-if="showBulkModal"
      class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-xl animate-scale-up">
        <h3 class="font-bold text-xl mb-2 text-slate-900">Tambah Tamu Massal</h3>
        <p class="text-xs text-slate-500 mb-6 italic">
          Format: "Nama NomorHP" (per baris). Contoh: "Budi Santoso 08123456789"
        </p>
        <textarea
          v-model="bulkText"
          class="w-full border border-gray-100 rounded-2xl p-4 bg-gray-50 h-64 text-sm focus:ring-2 focus:ring-[#a47148]/20 outline-none"
          placeholder="Budi Santoso 08123456789&#10;Ani Wijaya 081388889999"
        ></textarea>
        <div class="mt-8 flex gap-3">
          <button
            @click="showBulkModal = false"
            class="flex-1 py-3 text-gray-400 font-bold text-sm cursor-pointer"
          >
            Batal
          </button>
          <button
            @click="processBulkAdd"
            :disabled="!bulkText.trim() || isSubmitting"
            class="flex-[2] py-3 bg-[#a47148] text-white rounded-xl text-sm font-bold disabled:opacity-50 cursor-pointer"
          >
            {{ isSubmitting ? 'Memproses...' : 'Proses Massal' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Single Share Modal -->
    <div
      v-if="showShareModal"
      class="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 shadow-xl animate-scale-up">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-bold text-xl text-slate-900">Kirim Undangan</h3>
          <span
            v-if="selectedGuestForShare"
            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
            :class="selectedGuestForShare.statusSend === 'sent' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'"
          >
            {{ selectedGuestForShare.statusSend === 'sent' ? 'Sudah Terkirim' : 'Belum Terkirim' }}
          </span>
        </div>
        <p class="text-xs text-slate-500 mb-6">
          Kirim langsung via WhatsApp, atau salin pesan/link untuk dikirim lewat aplikasi lain.
        </p>
        <textarea
          v-if="loadingMessage"
          disabled
          class="w-full border border-gray-100 rounded-2xl p-4 bg-gray-50 h-40 text-sm italic"
        >Memuat pesan template...</textarea>
        <textarea
          v-else
          v-model="shareMessage"
          class="w-full border border-gray-100 rounded-2xl p-4 bg-gray-50 focus:ring-2 focus:ring-[#a47148]/20 outline-none h-40 text-sm leading-relaxed"
        ></textarea>

        <div class="mt-4 grid grid-cols-2 gap-3">
          <button
            @click="copyText(shareMessage, 'Pesan')"
            :disabled="loadingMessage"
            class="py-2.5 border border-gray-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer"
          >
            <i class="fa-regular fa-copy"></i> Salin Pesan
          </button>
          <button
            @click="copyText(shareUrl, 'Link')"
            :disabled="loadingMessage || !shareUrl"
            class="py-2.5 border border-gray-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer"
          >
            <i class="fa-solid fa-link"></i> Salin Link
          </button>
        </div>

        <div class="mt-6 flex gap-3">
          <button
            @click="showShareModal = false"
            class="flex-1 py-3 text-gray-400 font-bold text-sm cursor-pointer"
          >
            Batal
          </button>
          <button
            @click="sendWhatsApp"
            :disabled="loadingMessage"
            class="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition cursor-pointer"
          >
            <i class="fa-brands fa-whatsapp text-lg"></i> Buka WhatsApp
          </button>
        </div>
      </div>
    </div>

    <!-- Help Modal -->
    <div
      v-if="showHelpModal"
      class="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-xs"
    >
      <div class="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl animate-scale-up">
        <h3 class="font-bold text-2xl mb-2 text-slate-900">Panduan Manajemen Tamu</h3>
        <p class="text-sm text-gray-500 mb-6">Cara mudah mengelola dan menyebarkan undangan digital Anda.</p>

        <div class="space-y-4">
          <div class="flex gap-4">
            <div
              class="w-9 h-9 shrink-0 rounded-full bg-[#a47148] text-white flex items-center justify-center font-bold text-xs"
            >
              1
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-xs sm:text-sm">Input & Import Tamu</h4>
              <p class="text-xs text-gray-500 leading-relaxed">
                Gunakan tombol <b>Tambah</b> untuk satu orang, <b>Massal</b> untuk paste banyak nama sekaligus, atau <b>Import Excel</b>.
              </p>
            </div>
          </div>
          <div class="flex gap-4">
            <div
              class="w-9 h-9 shrink-0 rounded-full bg-[#a47148] text-white flex items-center justify-center font-bold text-xs"
            >
              2
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-xs sm:text-sm">Atur Template Pesan</h4>
              <p class="text-xs text-gray-500 leading-relaxed">
                Klik <b>Template Pesan</b> untuk memilih gaya bahasa (Islami, Santai, Adat, atau Ringkas) serta melihat preview langsung.
              </p>
            </div>
          </div>
          <div class="flex gap-4">
            <div
              class="w-9 h-9 shrink-0 rounded-full bg-[#a47148] text-white flex items-center justify-center font-bold text-xs"
            >
              3
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-xs sm:text-sm">Asisten Sebar WhatsApp</h4>
              <p class="text-xs text-gray-500 leading-relaxed">
                Gunakan <b>Mulai Sebar WhatsApp</b> untuk membagikan undangan satu per satu dengan satu tombol langsung menuju chat WhatsApp tanpa perlu ketik ulang!
              </p>
            </div>
          </div>
        </div>

        <div class="mt-8">
          <button
            @click="showHelpModal = false"
            class="w-full py-3.5 bg-[#a47148] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[#a47148]/20 cursor-pointer"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import Sidebar from '@/components/dashboard/SidebarDashboard.vue'
import Topbar from '@/components/dashboard/TopbarDashboard.vue'
import BottomNav from '@/components/dashboard/BottomNav.vue'
import { getInvitations, updateInvitation } from '@/api/invitation'
import { featuresFor } from '@/config/packageFeatures'
import {
  getGuestsByInvitationId,
  createGuest,
  updateGuest,
  deleteGuest,
  getGuestShareLink,
  importGuests,
} from '@/api/guest'
import { useToast } from 'vue-toastification'
import * as XLSX from 'xlsx'
import {
  PRESET_TEMPLATES as PRESETS,
  buildWhatsAppUrl,
  getCoupleDisplayName as utilGetCoupleDisplayName,
  getGuestUrl as utilGetGuestUrl,
  formatGuestMessage as utilFormatGuestMessage,
} from '@/utils/whatsappDistribution'

const toast = useToast()
const invitations = ref([])
const selectedInvitationId = ref(null)
const guests = ref([])
const loading = ref(false)
const showAddModal = ref(false)
const showBulkModal = ref(false)
const showHelpModal = ref(false)
const bulkText = ref('')
const isSubmitting = ref(false)
const searchQuery = ref('')
const isSidebarOpen = ref(window.innerWidth >= 768)
const excelInput = ref(null)

// Filtering state
const statusFilter = ref('all') // 'all' | 'unsent' | 'sent'
const groupFilter = ref('')

// Single Share Modal state
const showShareModal = ref(false)
const shareMessage = ref('')
const shareUrl = ref('')
const selectedGuestForShare = ref(null)
const loadingMessage = ref(false)
const updatingGuestAccess = ref(false)
const newGuest = ref({ name: '', group: '', phoneNumber: '' })

// Template WhatsApp Modal state
const showTemplateModal = ref(false)
const templateText = ref('')
const isSavingTemplate = ref(false)
const templateTextareaRef = ref(null)

// Queue Runner (Mode Kirim Cepat) state
const showQueueModal = ref(false)
const queueIndex = ref(0)

// Export Links Modal state
const showExportModal = ref(false)
const exportFilter = ref('all')

// Presets imported from @/utils/whatsappDistribution as PRESETS

const currentInvitation = computed(() => {
  return invitations.value.find((inv) => inv.id === selectedInvitationId.value) || null
})

const isContactPickerSupported = computed(() => {
  return 'contacts' in navigator && !!navigator.contacts.select
})

// Stats Computations
const totalGuestsCount = computed(() => guests.value.length)
const sentGuestsCount = computed(() => guests.value.filter((g) => g.statusSend === 'sent').length)
const unsentGuestsCount = computed(() => guests.value.filter((g) => g.statusSend !== 'sent').length)
const sentPercentage = computed(() => {
  if (totalGuestsCount.value === 0) return 0
  return Math.round((sentGuestsCount.value / totalGuestsCount.value) * 100)
})

const rsvpAttendingCount = computed(() => guests.value.filter((g) => g.rsvpStatus === 'hadir').length)
const rsvpDeclinedCount = computed(() => guests.value.filter((g) => g.rsvpStatus === 'tidak').length)
const rsvpPendingCount = computed(
  () => guests.value.filter((g) => g.rsvpStatus !== 'hadir' && g.rsvpStatus !== 'tidak').length,
)

const uniqueGroups = computed(() => {
  const set = new Set()
  guests.value.forEach((g) => {
    if (g.group && g.group.trim()) set.add(g.group.trim())
  })
  return Array.from(set)
})

// Filtered Guests list
const filteredGuests = computed(() => {
  let list = guests.value

  // Status Filter
  if (statusFilter.value === 'unsent') {
    list = list.filter((g) => g.statusSend !== 'sent')
  } else if (statusFilter.value === 'sent') {
    list = list.filter((g) => g.statusSend === 'sent')
  }

  // Category Filter
  if (groupFilter.value) {
    list = list.filter((g) => (g.group || '').toLowerCase() === groupFilter.value.toLowerCase())
  }

  // Search Query
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter((g) => {
      const matchName = (g.name || '').toLowerCase().includes(q)
      const matchPhone = (g.phoneNumber || '').toLowerCase().includes(q)
      const matchGroup = (g.group || '').toLowerCase().includes(q)
      return matchName || matchPhone || matchGroup
    })
  }

  return list
})

// Unsent Guests queue
const unsentGuests = computed(() => {
  return guests.value.filter((g) => g.statusSend !== 'sent')
})

const currentQueueIndex = computed(() => {
  if (unsentGuests.value.length === 0) return 0
  return Math.min(queueIndex.value, unsentGuests.value.length - 1)
})

const currentQueueGuest = computed(() => {
  if (unsentGuests.value.length === 0) return null
  return unsentGuests.value[currentQueueIndex.value] || null
})

const currentQueueGuestFormattedMessage = computed(() => {
  if (!currentQueueGuest.value) return ''
  return formatGuestMessage(currentInvitation.value?.whatsappMessageTemplate, currentQueueGuest.value)
})

// Preview for Template Editor modal
const previewFormattedMessage = computed(() => {
  const sampleGuest = guests.value[0] || {
    name: 'Budi Santoso',
    slug: 'budi-santoso',
    accessToken: 'sample-token',
  }
  return formatGuestMessage(templateText.value, sampleGuest)
})

// Export list text generator
const exportListText = computed(() => {
  let list = guests.value
  if (exportFilter.value === 'unsent') {
    list = list.filter((g) => g.statusSend !== 'sent')
  } else if (exportFilter.value === 'sent') {
    list = list.filter((g) => g.statusSend === 'sent')
  }

  return list
    .map((g, idx) => {
      const link = getGuestUrl(g)
      const phone = g.phoneNumber ? ` (${g.phoneNumber})` : ''
      return `${idx + 1}. ${g.name}${phone}: ${link}`
    })
    .join('\n')
})

onMounted(async () => {
  await fetchInvitations()
})

watch(selectedInvitationId, async (newId) => {
  if (newId) await fetchGuests(newId)
})

async function fetchInvitations() {
  try {
    const res = await getInvitations()
    const data = Array.isArray(res) ? res : res.data || []
    invitations.value = data
    if (data.length > 0 && !selectedInvitationId.value) {
      selectedInvitationId.value = data[0].id
    }
  } catch (error) {
    toast.error('Gagal memuat undangan')
    console.error(error)
  }
}

async function fetchGuests(invId) {
  loading.value = true
  try {
    const res = await getGuestsByInvitationId(invId)
    guests.value = Array.isArray(res) ? res : res.data || []
  } catch (error) {
    toast.error('Gagal memuat tamu')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// URL & Message Formatting Helpers
function getCoupleDisplayName(invitation) {
  return utilGetCoupleDisplayName(invitation || currentInvitation.value)
}

function getGuestUrl(guest) {
  return utilGetGuestUrl(guest, currentInvitation.value)
}

function formatGuestMessage(rawTemplate, guest) {
  return utilFormatGuestMessage(rawTemplate, guest, currentInvitation.value)
}

// Manual Status Toggle Handler
async function toggleGuestStatusSend(guest) {
  const newStatus = guest.statusSend === 'sent' ? 'unsent' : 'sent'
  const oldStatus = guest.statusSend
  guest.statusSend = newStatus
  try {
    await updateGuest(guest.id, { statusSend: newStatus })
    if (newStatus === 'sent') {
      toast.success(`Ditandai terkirim: ${guest.name}`)
    } else {
      toast.info(`Ditandai belum terkirim: ${guest.name}`)
    }
  } catch (err) {
    guest.statusSend = oldStatus
    toast.error('Gagal memperbarui status pengiriman')
    console.error(err)
  }
}

// Copy individual guest link
async function copyGuestIndividualLink(guest) {
  const link = getGuestUrl(guest)
  await copyText(link, `Link untuk ${guest.name}`)
}

// Template Editor Operations
function openTemplateModal() {
  templateText.value = currentInvitation.value?.whatsappMessageTemplate || PRESETS[0].content
  showTemplateModal.value = true
}

function applyPreset(preset) {
  templateText.value = preset.content
}

function resetToDefaultTemplate() {
  templateText.value = PRESETS[0].content
}

function insertPlaceholder(placeholder) {
  const el = templateTextareaRef.value
  if (!el) {
    templateText.value += ` ${placeholder} `
    return
  }
  const start = el.selectionStart || 0
  const end = el.selectionEnd || 0
  const text = templateText.value
  templateText.value = text.slice(0, start) + placeholder + text.slice(end)
  setTimeout(() => {
    el.focus()
    el.setSelectionRange(start + placeholder.length, start + placeholder.length)
  }, 0)
}

async function saveWhatsAppTemplate() {
  if (!currentInvitation.value) return
  isSavingTemplate.value = true
  try {
    await updateInvitation(currentInvitation.value.id, {
      whatsappMessageTemplate: templateText.value,
    })
    currentInvitation.value.whatsappMessageTemplate = templateText.value
    toast.success('Template pesan WhatsApp berhasil disimpan')
    showTemplateModal.value = false
  } catch (error) {
    toast.error(error?.message || 'Gagal menyimpan template pesan')
    console.error(error)
  } finally {
    isSavingTemplate.value = false
  }
}

// Queue Runner Operations
function startQueueRunner() {
  if (!currentInvitation.value?.isPublished) {
    toast.warning('Undangan belum dipublikasikan')
    return
  }
  if (!featuresFor(currentInvitation.value?.package).whatsapp) {
    toast.warning('Kirim undangan via WhatsApp tersedia untuk paket Premium & Eksklusif.')
    return
  }
  queueIndex.value = 0
  showQueueModal.value = true
}

async function markAndSendCurrentInQueue() {
  const guest = currentQueueGuest.value
  if (!guest) return

  const message = formatGuestMessage(currentInvitation.value?.whatsappMessageTemplate, guest)
  const waUrl = buildWhatsAppUrl(guest.phoneNumber, message)

  // Open WhatsApp in new tab
  window.open(waUrl, '_blank')

  // Optimistic update status
  guest.statusSend = 'sent'
  try {
    await updateGuest(guest.id, { statusSend: 'sent' })
    toast.success(`Terkirim ke ${guest.name}`)
  } catch (err) {
    console.error('Failed to update status in queue:', err)
  }

  // Adjust queue pointer if at the end of remaining list
  if (queueIndex.value >= unsentGuests.value.length && unsentGuests.value.length > 0) {
    queueIndex.value = unsentGuests.value.length - 1
  }
}

async function markSentOnlyInQueue() {
  const guest = currentQueueGuest.value
  if (!guest) return

  guest.statusSend = 'sent'
  try {
    await updateGuest(guest.id, { statusSend: 'sent' })
    toast.success(`Ditandai terkirim ke ${guest.name}`)
  } catch (err) {
    console.error('Failed to mark as sent:', err)
  }

  if (queueIndex.value >= unsentGuests.value.length && unsentGuests.value.length > 0) {
    queueIndex.value = unsentGuests.value.length - 1
  }
}

function nextInQueue() {
  if (queueIndex.value < unsentGuests.value.length - 1) {
    queueIndex.value++
  }
}

function prevInQueue() {
  if (queueIndex.value > 0) {
    queueIndex.value--
  }
}

// Export Links Modal Operations
async function copyExportList() {
  await copyText(exportListText.value, 'Daftar Link Undangan')
}

// Toggle Guest Public Access
async function toggleGuestAccess() {
  const invitation = currentInvitation.value
  if (!invitation || updatingGuestAccess.value) return

  const isGuestPublic = invitation.isGuestPublic === false
  updatingGuestAccess.value = true
  try {
    await updateInvitation(invitation.id, { isGuestPublic })
    invitation.isGuestPublic = isGuestPublic
    toast.success(isGuestPublic ? 'Akses publik diaktifkan' : 'Undangan sekarang privat')
  } catch (error) {
    toast.error(error?.message || 'Gagal mengubah akses undangan')
  } finally {
    updatingGuestAccess.value = false
  }
}

// Single Guest Add
async function submitGuest() {
  if (!newGuest.value.name?.trim()) {
    toast.warning('Nama tamu wajib diisi')
    return
  }
  isSubmitting.value = true
  try {
    await createGuest({ ...newGuest.value, invitationId: selectedInvitationId.value })
    toast.success('Tamu berhasil ditambahkan')
    showAddModal.value = false
    newGuest.value = { name: '', group: '', phoneNumber: '' }
    await fetchGuests(selectedInvitationId.value)
  } catch (error) {
    toast.error('Gagal menambahkan tamu')
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

// Bulk Add
async function processBulkAdd() {
  const lines = bulkText.value.split('\n').filter((l) => l.trim())
  if (lines.length === 0) return

  isSubmitting.value = true
  let successCount = 0
  let failCount = 0

  for (const line of lines) {
    try {
      const parts = line.trim().split(/\s+/)
      let name = ''
      let phone = ''

      if (parts.length > 1) {
        const lastPart = parts[parts.length - 1]
        if (/^[0-9+]+$/.test(lastPart)) {
          phone = lastPart
          name = parts.slice(0, -1).join(' ')
        } else {
          name = parts.join(' ')
        }
      } else {
        name = parts[0]
      }

      await createGuest({
        name,
        phoneNumber: phone,
        invitationId: selectedInvitationId.value,
      })
      successCount++
    } catch (err) {
      console.error('Failed to add guest:', line, err)
      failCount++
    }
  }

  toast.success(`${successCount} tamu berhasil ditambahkan`)
  if (failCount > 0) toast.error(`${failCount} tamu gagal ditambahkan`)

  bulkText.value = ''
  showBulkModal.value = false
  isSubmitting.value = false
  await fetchGuests(selectedInvitationId.value)
}

// Contacts Picker
async function pickFromContacts() {
  if (!isContactPickerSupported.value) {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const isInstagram = /Instagram/.test(navigator.userAgent)
    const isWhatsApp = /WhatsApp/.test(navigator.userAgent)

    if (isInstagram || isWhatsApp) {
      toast.info(
        'Browser di dalam aplikasi membatasi fitur ini. Silakan klik titik tiga di pojok kanan atas lalu "Buka di Chrome/Safari".',
      )
    } else if (isIOS) {
      toast.info(
        'Apple (Safari iOS) belum mendukung fitur ambil kontak otomatis demi privasi. Silakan gunakan Tambah Manual atau Massal.',
      )
    } else {
      toast.info('Browser Anda belum mendukung fitur ambil kontak. Pastikan Anda menggunakan Chrome di Android.')
    }
    return
  }

  try {
    const supportedProperties = await navigator.contacts.getProperties()
    const props = []
    if (supportedProperties.includes('name')) props.push('name')
    if (supportedProperties.includes('tel')) props.push('tel')

    if (props.length === 0) {
      toast.warning('Perangkat Anda tidak mengizinkan akses nama atau nomor telepon.')
      return
    }

    const opts = { multiple: true }
    const contacts = await navigator.contacts.select(props, opts)

    if (contacts && contacts.length > 0) {
      isSubmitting.value = true
      let added = 0
      for (const contact of contacts) {
        const name = contact.name?.[0] || 'Tamu'
        const phone = contact.tel?.[0] || ''
        try {
          await createGuest({ name, phoneNumber: phone, invitationId: selectedInvitationId.value })
          added++
        } catch (e) {
          console.error('Failed to add contact:', name, e)
        }
      }
      toast.success(`${added} kontak berhasil ditambahkan`)
      await fetchGuests(selectedInvitationId.value)
    }
  } catch (err) {
    if (err.name === 'SecurityError') {
      toast.error('Gagal: Fitur ini tidak bisa dijalankan di dalam frame atau mode tertentu.')
    } else if (err.name !== 'AbortError') {
      console.error('Contact picker error:', err)
      toast.error('Gagal mengambil kontak: ' + err.message)
    }
  } finally {
    isSubmitting.value = false
  }
}

// Excel Import & Download
function triggerExcelImport() {
  excelInput.value?.click()
}

async function handleExcelImport(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheet = workbook.SheetNames[0]
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet])

      if (jsonData.length === 0) {
        toast.warning('File Excel kosong')
        return
      }

      isSubmitting.value = true
      // Excel cells may be numbers; 08xx phones lose their leading 0 (→ 8xx)
      const cell = (v) => (v === undefined || v === null ? '' : String(v).trim())
      const phoneCell = (v) => {
        const p = cell(v)
        return /^8\d{7,}$/.test(p) ? `0${p}` : p
      }
      let success = 0
      const failed = []
      for (const row of jsonData) {
        const name = cell(row.Nama ?? row.nama ?? row.Name ?? row.name)
        const phone = phoneCell(row.WhatsApp ?? row.whatsapp ?? row.NoHP ?? row.phone ?? row.telp)
        const group = cell(row.Kategori ?? row.group ?? row.category) || undefined

        if (name) {
          try {
            await createGuest({
              name,
              phoneNumber: phone,
              group,
              invitationId: selectedInvitationId.value,
            })
            success++
          } catch (err) {
            console.error(err)
            failed.push(name)
          }
        }
      }
      if (success) toast.success(`${success} tamu berhasil diimport`)
      if (failed.length) {
        const sample = failed.slice(0, 3).join(', ')
        toast.error(
          `${failed.length} tamu gagal diimport (${sample}${failed.length > 3 ? ', …' : ''}). Cek nama/nomor lalu coba lagi.`,
        )
      }
      await fetchGuests(selectedInvitationId.value)
    } catch (err) {
      toast.error('Gagal membaca file Excel')
      console.error(err)
    } finally {
      isSubmitting.value = false
      if (excelInput.value) excelInput.value.value = ''
    }
  }
  reader.readAsArrayBuffer(file)
}

function downloadTemplate() {
  const ws = XLSX.utils.json_to_sheet([
    { Nama: 'Budi Santoso', WhatsApp: '08123456789', Kategori: 'Keluarga' },
    { Nama: 'Ani Wijaya', WhatsApp: '081388889999', Kategori: 'Teman' },
  ])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Template Tamu')
  XLSX.writeFile(wb, 'Template_Tamu_SatuUndangan.xlsx')
}

// Delete Guest
async function deleteGuestHandler(id) {
  if (!confirm('Hapus tamu ini dari daftar?')) return
  try {
    await deleteGuest(id)
    toast.success('Tamu berhasil dihapus')
    await fetchGuests(selectedInvitationId.value)
  } catch (error) {
    toast.error('Gagal menghapus tamu')
    console.error(error)
  }
}

// Single Guest Share Modal
async function openShareModal(guest) {
  if (!currentInvitation.value?.isPublished) {
    toast.warning('Undangan belum dipublikasikan')
    return
  }
  if (!featuresFor(currentInvitation.value?.package).whatsapp) {
    toast.warning('Kirim undangan via WhatsApp tersedia untuk paket Premium & Eksklusif.')
    return
  }
  selectedGuestForShare.value = guest
  showShareModal.value = true
  loadingMessage.value = true
  try {
    const res = await getGuestShareLink(guest.id)
    const data = res?.data || res
    shareUrl.value = data?.url || getGuestUrl(guest)
    if (data?.message) {
      shareMessage.value = data.message
    } else {
      shareMessage.value = formatGuestMessage(currentInvitation.value?.whatsappMessageTemplate, guest)
    }
  } catch (error) {
    shareUrl.value = getGuestUrl(guest)
    shareMessage.value = formatGuestMessage(currentInvitation.value?.whatsappMessageTemplate, guest)
  } finally {
    loadingMessage.value = false
  }
}

async function sendWhatsApp() {
  if (!selectedGuestForShare.value) return
  const guest = selectedGuestForShare.value
  const waUrl = buildWhatsAppUrl(guest.phoneNumber, shareMessage.value)
  window.open(waUrl, '_blank')

  if (guest.statusSend !== 'sent') {
    guest.statusSend = 'sent'
    try {
      await updateGuest(guest.id, { statusSend: 'sent' })
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }
  showShareModal.value = false
}

// Generic Clipboard Copy
async function copyText(text, label) {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} berhasil disalin`)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
      toast.success(`${label} berhasil disalin`)
    } catch {
      toast.error('Gagal menyalin')
    }
    document.body.removeChild(ta)
  }
}
</script>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.2s ease-out;
}
@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
