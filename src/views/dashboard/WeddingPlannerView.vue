<template>
  <div class="flex h-screen bg-slate-50 overflow-hidden pb-20 md:pb-0 font-sans">
    <Sidebar :isOpen="isSidebarOpen" @close="isSidebarOpen = false" class="no-print" />

    <div :class="['flex-1 flex flex-col transition-all duration-300 min-w-0', isSidebarOpen ? 'md:ml-64' : 'md:ml-0']">
      <Topbar title="Wedding Planner & Budget" showButton @toggleSidebar="isSidebarOpen = !isSidebarOpen" class="no-print" />

      <main class="p-4 md:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
        <!-- 1. Header Section -->
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
              <h2 class="text-lg md:text-xl font-black text-slate-900 tracking-tight">
                Wedding Planner Eksklusif
              </h2>
              <span v-if="isUnlocked" class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300/80">
                Akses Gratis Aktif ✨
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-1 max-w-xl">
              Susun anggaran pernikahan, pantau checklist persiapan H-180 s/d Hari H, kelola vendor, dan susun rundown acara dalam satu dasbor rapi.
            </p>
          </div>

          <!-- Quick Actions -->
          <div v-if="isUnlocked" class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              @click="openSetupModal = true"
              class="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Atur ulang profil dan target pernikahan"
            >
              <i class="fa-solid fa-sliders text-amber-600"></i>
              <span>Profil Pernikahan</span>
            </button>

            <button
              type="button"
              @click="printRundown"
              class="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <i class="fa-solid fa-print text-slate-500"></i>
              <span>Cetak Rundown / PDF</span>
            </button>

            <button
              type="button"
              @click="handleSavePlanner"
              :disabled="saving"
              class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-slate-900/10 cursor-pointer disabled:opacity-50"
            >
              <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-floppy-disk"></i>
              <span>{{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
            </button>
          </div>
        </div>

        <!-- 2. LOCKED STATE GATE / MODAL -->
        <div v-if="!loading && !isUnlocked" class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950 via-stone-900 to-slate-950 text-white p-6 md:p-12 shadow-2xl border border-amber-500/20">
          <!-- Background Glow Effect -->
          <div class="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="max-w-2xl mx-auto text-center relative z-10 space-y-6">
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-extrabold uppercase tracking-widest">
              <i class="fa-solid fa-crown text-amber-400"></i>
              <span>Fitur Premium • Buka 100% Gratis</span>
            </div>

            <h3 class="text-2xl md:text-3xl font-black tracking-tight leading-tight">
              Buka Akses <span class="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 bg-clip-text text-transparent">Wedding Planner Terpadu</span> Seumur Hidup!
            </h3>

            <p class="text-xs md:text-sm text-stone-300 leading-relaxed">
              Dapatkan Kalkulator Budget Otomatis, 21 Checklist Persiapan Pernikahan Adat & Nasional, Buku Kontak Vendor, serta Generator Rundown Hari H tanpa biaya sepeser pun. Cukup dukung kami dengan 2 langkah mudah di bawah ini!
            </p>

            <!-- 2 Simple Steps -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-2">
              <!-- Step 1 -->
              <div class="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3 flex flex-col justify-between">
                <div class="flex items-start gap-3">
                  <div class="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h4 class="font-bold text-xs text-white">Follow Instagram</h4>
                    <p class="text-[11px] text-stone-400 mt-0.5">Follow akun resmi <b>@satuundangan_official</b></p>
                  </div>
                </div>
                <a
                  href="https://www.instagram.com/satuundangan_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click="hasClickedFollow = true"
                  class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-90 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <i class="fa-brands fa-instagram text-sm"></i>
                  <span>{{ hasClickedFollow ? 'Sudah Diklik (Cek IG)' : 'Buka Instagram Kami' }}</span>
                </a>
              </div>

              <!-- Step 2 -->
              <div class="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3 flex flex-col justify-between">
                <div class="flex items-start gap-3">
                  <div class="w-7 h-7 rounded-lg bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h4 class="font-bold text-xs text-white">Bagikan ke WhatsApp</h4>
                    <p class="text-[11px] text-stone-400 mt-0.5">Bantu rekomendasikan SatuUndangan ke teman/grup</p>
                  </div>
                </div>
                <button
                  type="button"
                  @click="shareToWhatsApp"
                  class="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <i class="fa-brands fa-whatsapp text-sm"></i>
                  <span>{{ hasClickedShare ? 'Sudah Dibagikan (Buka WA)' : 'Buka WhatsApp & Share' }}</span>
                </button>
              </div>
            </div>

            <!-- Unlock Form -->
            <div class="pt-4 max-w-md mx-auto space-y-3">
              <div class="text-left">
                <label class="text-[11px] font-bold text-amber-200 block mb-1">
                  Username Instagram Kamu <span class="text-rose-400">*wajib</span>:
                </label>
                <div class="relative">
                  <i class="fa-solid fa-at absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs"></i>
                  <input
                    v-model="unlockForm.instagramHandle"
                    type="text"
                    required
                    placeholder="nama_kamu (contoh: rina.septiani)"
                    class="w-full rounded-xl bg-white/10 border border-white/20 pl-9 pr-3.5 py-2.5 text-xs font-semibold text-white placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                </div>
                <p class="text-[10px] text-stone-400 mt-1">
                  Kami akan memeriksa apakah kamu sudah mem-follow @satuundangan_official.
                </p>
              </div>

              <button
                type="button"
                @click="submitUnlock"
                :disabled="unlocking"
                class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs md:text-sm tracking-wide transition-all shadow-xl shadow-amber-500/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <i v-if="unlocking" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fa-solid fa-gift"></i>
                <span>{{ unlocking ? 'Membuka Akses...' : 'Buka Akses Gratis Sekarang 🎉' }}</span>
              </button>

              <p class="text-[10px] text-stone-400">
                🔒 Tanpa kartu kredit. Akses terbuka instan dan tersimpan di akun Anda selamanya.
              </p>
            </div>
          </div>
        </div>

        <!-- 3. UNLOCKED TOOL INTERFACE -->
        <div v-else-if="!loading && isUnlocked" class="space-y-6">
          <!-- MINI DASHBOARD / PROGRESS SUMMARY BANNER -->
          <div class="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-stone-900 to-amber-950 text-white shadow-xl border border-amber-500/20 relative overflow-hidden">
            <div class="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <!-- Left: Wedding Overview Info -->
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {{ planner.weddingConcept || 'Pernikahan Modern' }}
                  </span>
                  <span v-if="planner.weddingDate" class="text-xs text-stone-300 font-mono flex items-center gap-1">
                    <i class="fa-solid fa-calendar-day text-amber-400"></i> {{ formatDate(planner.weddingDate) }}
                  </span>
                  <span v-if="countdownDays !== null" class="text-xs font-black text-amber-400">
                    ({{ countdownDays > 0 ? countdownDays + ' Hari Menuju Hari H' : countdownDays === 0 ? 'Hari Ini Hari H!' : 'Acara Telah Selesai' }})
                  </span>
                </div>

                <h3 class="text-xl sm:text-2xl font-black tracking-tight">
                  Status Kesiapan Pernikahan: <span class="text-amber-400">{{ overallReadinessPercent }}% Siap</span>
                </h3>

                <p class="text-xs text-stone-300 max-w-xl leading-relaxed">
                  Target Tamu: <b>{{ planner.estimatedGuests || 300 }} Orang</b> • Total Anggaran: <b>{{ formatCurrency(planner.budgetTotal || 0) }}</b> • Vendor Terdaftar: <b>{{ planner.vendors?.length || 0 }} Vendor</b>
                </p>
              </div>

              <!-- Right: 3 Mini Progress Rings / Gauges -->
              <div class="grid grid-cols-3 gap-3 sm:gap-4 shrink-0 text-center">
                <!-- 1. Budget Usage -->
                <div class="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
                  <span class="text-[9px] font-black uppercase text-stone-400 block">Anggaran</span>
                  <div class="text-sm sm:text-base font-black font-mono" :class="budgetPercent > 100 ? 'text-rose-400' : 'text-amber-300'">
                    {{ budgetPercent }}%
                  </div>
                  <span class="text-[9px] text-stone-400 block truncate">Realisasi</span>
                </div>

                <!-- 2. Checklist Progress -->
                <div class="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
                  <span class="text-[9px] font-black uppercase text-stone-400 block">Checklist</span>
                  <div class="text-sm sm:text-base font-black font-mono text-emerald-400">
                    {{ completedChecklistCount }}/{{ totalChecklistCount }}
                  </div>
                  <span class="text-[9px] text-stone-400 block">{{ checklistPercent }}% Selesai</span>
                </div>

                <!-- 3. Payment Status -->
                <div class="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
                  <span class="text-[9px] font-black uppercase text-stone-400 block">Vendor Bayar</span>
                  <div class="text-sm sm:text-base font-black font-mono text-blue-300">
                    {{ paidVendorsCount }}/{{ planner.vendors?.length || 0 }}
                  </div>
                  <span class="text-[9px] text-stone-400 block">Lunas</span>
                </div>
              </div>
            </div>

            <!-- Global Readiness Progress Bar -->
            <div class="mt-4 pt-4 border-t border-white/10">
              <div class="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 transition-all duration-700"
                  :style="{ width: overallReadinessPercent + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Sub-navigation Tabs -->
          <div class="inline-flex items-center bg-slate-200/80 p-1 rounded-2xl w-full sm:w-auto overflow-x-auto custom-scrollbar">
            <button
              type="button"
              @click="activeTab = 'budget'"
              :class="[
                'flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap',
                activeTab === 'budget' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              <i class="fa-solid fa-wallet text-amber-600 text-xs"></i>
              <span>Kalkulator Budget</span>
            </button>

            <button
              type="button"
              @click="activeTab = 'checklist'"
              :class="[
                'flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap',
                activeTab === 'checklist' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              <i class="fa-solid fa-list-check text-emerald-600 text-xs"></i>
              <span>Checklist H-180</span>
              <span class="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                {{ completedChecklistCount }}/{{ totalChecklistCount }}
              </span>
            </button>

            <button
              type="button"
              @click="activeTab = 'vendors'"
              :class="[
                'flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap',
                activeTab === 'vendors' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              <i class="fa-solid fa-handshake text-blue-600 text-xs"></i>
              <span>Buku Vendor</span>
              <span v-if="planner.vendors?.length" class="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
                {{ planner.vendors.length }}
              </span>
            </button>

            <button
              type="button"
              @click="activeTab = 'rundown'"
              :class="[
                'flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap',
                activeTab === 'rundown' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              ]"
            >
              <i class="fa-solid fa-clock text-purple-600 text-xs"></i>
              <span>Rundown Hari H</span>
            </button>
          </div>

          <!-- TAB 1: BUDGET CALCULATOR -->
          <div v-if="activeTab === 'budget'" class="space-y-6">
            <!-- Summary Stats Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Total Target Budget -->
              <div class="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-1">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Target Anggaran</span>
                <div class="flex items-center justify-between">
                  <h4 class="text-lg font-black text-slate-900 font-mono">{{ formatCurrency(planner.budgetTotal || 0) }}</h4>
                  <button @click="promptEditTotalBudget" class="text-xs text-amber-600 hover:text-amber-800 font-bold" title="Ubah target">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                </div>
                <p class="text-[11px] text-slate-400">Batas maksimal pengeluaran</p>
              </div>

              <!-- Total Estimated (Rencana) -->
              <div class="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-1">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Estimasi Pos</span>
                <h4 class="text-lg font-black text-blue-900 font-mono">{{ formatCurrency(totalEstimatedCost) }}</h4>
                <p class="text-[11px]" :class="totalEstimatedCost > planner.budgetTotal ? 'text-rose-500 font-bold' : 'text-slate-400'">
                  {{ totalEstimatedCost > planner.budgetTotal ? '⚠️ Melebihi target anggaran' : 'Dalam batas aman anggaran' }}
                </p>
              </div>

              <!-- Total Actual Cost (Realisasi) -->
              <div class="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-1">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Realisasi Kontrak</span>
                <h4 class="text-lg font-black text-slate-900 font-mono">{{ formatCurrency(totalActualCost) }}</h4>
                <p class="text-[11px] text-slate-400">Total nilai kesepakatan final</p>
              </div>

              <!-- Total Paid Amount (Sudah Terbayar) -->
              <div class="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-1">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Sudah Terbayar (DP/Lunas)</span>
                <h4 class="text-lg font-black text-emerald-600 font-mono">{{ formatCurrency(totalPaidAmount) }}</h4>
                <p class="text-[11px] text-amber-600 font-bold">
                  Sisa tagihan: {{ formatCurrency(totalActualCost - totalPaidAmount) }}
                </p>
              </div>
            </div>

            <!-- Budget Progress Bar -->
            <div class="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-2">
              <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-slate-700">Realisasi vs Target Budget</span>
                <span :class="budgetPercent > 100 ? 'text-rose-600' : 'text-slate-900'">{{ budgetPercent }}% ({{ formatCurrency(totalActualCost) }} / {{ formatCurrency(planner.budgetTotal || 0) }})</span>
              </div>
              <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full transition-all duration-500"
                  :class="budgetPercent > 100 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-emerald-500'"
                  :style="{ width: Math.min(budgetPercent, 100) + '%' }"
                ></div>
              </div>
            </div>

            <!-- Expense Items Table & Adder -->
            <div class="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
              <div class="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                <div>
                  <h3 class="text-sm font-black text-slate-900">Rincian Pos Biaya & Pembayaran</h3>
                  <p class="text-[11px] text-slate-400">Kelola setiap pengeluaran per kategori secara transparan</p>
                </div>
                <button
                  type="button"
                  @click="openAddBudgetItemModal"
                  class="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <i class="fa-solid fa-plus text-xs"></i>
                  <span>Tambah Pos Biaya</span>
                </button>
              </div>

              <!-- Table -->
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead class="bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th class="py-3 px-4">Kategori</th>
                      <th class="py-3 px-4">Nama Pos</th>
                      <th class="py-3 px-4 text-right">Estimasi (Rp)</th>
                      <th class="py-3 px-4 text-right">Realisasi (Rp)</th>
                      <th class="py-3 px-4 text-right">Terbayar (Rp)</th>
                      <th class="py-3 px-4 text-right">Sisa (Rp)</th>
                      <th class="py-3 px-4 text-center">Status</th>
                      <th class="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                    <tr v-for="(item, idx) in planner.budgetItems" :key="item.id" class="hover:bg-slate-50/70 transition-colors">
                      <td class="py-3 px-4 font-bold text-slate-900">{{ item.category }}</td>
                      <td class="py-3 px-4">
                        <div class="font-bold text-slate-800">{{ item.name }}</div>
                        <div v-if="item.notes" class="text-[10px] text-slate-400 mt-0.5">{{ item.notes }}</div>
                      </td>
                      <td class="py-3 px-4 text-right font-mono">{{ formatNumber(item.estimatedCost) }}</td>
                      <td class="py-3 px-4 text-right font-mono font-bold">{{ formatNumber(item.actualCost) }}</td>
                      <td class="py-3 px-4 text-right font-mono text-emerald-600">{{ formatNumber(item.paidAmount) }}</td>
                      <td class="py-3 px-4 text-right font-mono font-bold" :class="(item.actualCost - item.paidAmount) > 0 ? 'text-amber-600' : 'text-slate-400'">
                        {{ formatNumber(item.actualCost - item.paidAmount) }}
                      </td>
                      <td class="py-3 px-4 text-center">
                        <span
                          class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider"
                          :class="item.paidAmount >= item.actualCost
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.paidAmount > 0
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'"
                        >
                          {{ item.paidAmount >= item.actualCost ? 'Lunas' : item.paidAmount > 0 ? 'DP' : 'Belum' }}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-right">
                        <div class="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            @click="editBudgetItem(item, idx)"
                            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                            title="Edit"
                          >
                            <i class="fa-solid fa-pen-to-square text-xs"></i>
                          </button>
                          <button
                            type="button"
                            @click="deleteBudgetItem(idx)"
                            class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Hapus"
                          >
                            <i class="fa-solid fa-trash text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="!planner.budgetItems?.length">
                      <td colspan="8" class="text-center py-8 text-slate-400">
                        Belum ada pos biaya. Klik tombol "Tambah Pos Biaya" di atas.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- TAB 2: CHECKLIST COUNTDOWN H-180 -->
          <div v-else-if="activeTab === 'checklist'" class="space-y-6">
            <!-- Progress Banner -->
            <div class="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <span class="text-[10px] font-black uppercase tracking-wider text-emerald-300">Countdown & Progress Persiapan</span>
                <h3 class="text-base sm:text-lg font-black mt-0.5">
                  {{ completedChecklistCount }} dari {{ totalChecklistCount }} Tugas Selesai ({{ checklistPercent }}%)
                </h3>
                <p class="text-xs text-emerald-200/80 mt-1">
                  Bagi tugas persiapan pernikahan dengan pasangan dan keluarga agar eksekusi lancar & bebas stres.
                </p>
              </div>
              <button
                type="button"
                @click="openAddChecklistModal"
                class="px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-black text-xs hover:bg-emerald-50 transition-all shadow-md shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <i class="fa-solid fa-plus text-xs"></i>
                <span>Tambah Tugas Baru</span>
              </button>
            </div>

            <!-- Persona & Urgency Stat Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <!-- Groom Task Card -->
              <div
                @click="checklistFilter = checklistFilter === 'groom' ? 'all' : 'groom'"
                class="p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3"
                :class="checklistFilter === 'groom' ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20' : 'bg-white border-slate-100 hover:border-slate-200'"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <div class="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-sm shrink-0">
                    👨
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] font-black uppercase text-slate-400 truncate">Tugas Pria (Groom)</p>
                    <p class="text-xs font-black text-slate-800">{{ groomCompletedCount }}/{{ groomTasksCount }} Selesai</p>
                  </div>
                </div>
                <i class="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
              </div>

              <!-- Bride Task Card -->
              <div
                @click="checklistFilter = checklistFilter === 'bride' ? 'all' : 'bride'"
                class="p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3"
                :class="checklistFilter === 'bride' ? 'bg-pink-50 border-pink-300 ring-2 ring-pink-500/20' : 'bg-white border-slate-100 hover:border-slate-200'"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <div class="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center text-sm shrink-0">
                    👩
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] font-black uppercase text-slate-400 truncate">Tugas Wanita (Bride)</p>
                    <p class="text-xs font-black text-slate-800">{{ brideCompletedCount }}/{{ brideTasksCount }} Selesai</p>
                  </div>
                </div>
                <i class="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
              </div>

              <!-- Both Task Card -->
              <div
                @click="checklistFilter = checklistFilter === 'both' ? 'all' : 'both'"
                class="p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3"
                :class="checklistFilter === 'both' ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-500/20' : 'bg-white border-slate-100 hover:border-slate-200'"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <div class="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-sm shrink-0">
                    💑
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] font-black uppercase text-slate-400 truncate">Tugas Bersama</p>
                    <p class="text-xs font-black text-slate-800">{{ bothCompletedCount }}/{{ bothTasksCount }} Selesai</p>
                  </div>
                </div>
                <i class="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
              </div>

              <!-- Urgent Task Card -->
              <div
                @click="checklistFilter = checklistFilter === 'urgent' ? 'all' : 'urgent'"
                class="p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3"
                :class="checklistFilter === 'urgent' ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-500/20' : 'bg-white border-slate-100 hover:border-slate-200'"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <div class="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-sm shrink-0">
                    🔥
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] font-black uppercase text-rose-500 truncate">Tugas Urgent</p>
                    <p class="text-xs font-black text-slate-800">{{ urgentTasksCount }} Pending</p>
                  </div>
                </div>
                <i class="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
              </div>
            </div>

            <!-- Filter Pills Bar -->
            <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
              <span class="text-[11px] text-slate-400 uppercase font-black tracking-wider mr-1 shrink-0">Filter:</span>
              <button
                type="button"
                @click="checklistFilter = 'all'"
                class="px-3 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer"
                :class="checklistFilter === 'all' ? 'bg-slate-900 text-white border-slate-900 shadow-xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
              >
                Semua ({{ totalChecklistCount }})
              </button>
              <button
                type="button"
                @click="checklistFilter = 'groom'"
                class="px-3 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                :class="checklistFilter === 'groom' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-blue-50'"
              >
                <span>👨 Pengantin Pria</span>
                <span class="px-1.5 py-0.2 rounded-full text-[10px]" :class="checklistFilter === 'groom' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'">
                  {{ groomTasksCount }}
                </span>
              </button>
              <button
                type="button"
                @click="checklistFilter = 'bride'"
                class="px-3 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                :class="checklistFilter === 'bride' ? 'bg-pink-600 text-white border-pink-600 shadow-xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-pink-50'"
              >
                <span>👩 Pengantin Wanita</span>
                <span class="px-1.5 py-0.2 rounded-full text-[10px]" :class="checklistFilter === 'bride' ? 'bg-pink-700 text-white' : 'bg-slate-100 text-slate-600'">
                  {{ brideTasksCount }}
                </span>
              </button>
              <button
                type="button"
                @click="checklistFilter = 'both'"
                class="px-3 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                :class="checklistFilter === 'both' ? 'bg-purple-600 text-white border-purple-600 shadow-xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-purple-50'"
              >
                <span>💑 Bersama</span>
                <span class="px-1.5 py-0.2 rounded-full text-[10px]" :class="checklistFilter === 'both' ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-600'">
                  {{ bothTasksCount }}
                </span>
              </button>
              <button
                type="button"
                @click="checklistFilter = 'family'"
                class="px-3 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                :class="checklistFilter === 'family' ? 'bg-amber-600 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50'"
              >
                <span>👥 Keluarga/Panitia</span>
              </button>
              <button
                type="button"
                @click="checklistFilter = 'urgent'"
                class="px-3 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                :class="checklistFilter === 'urgent' ? 'bg-rose-600 text-white border-rose-600 shadow-xs' : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'"
              >
                <i class="fa-solid fa-fire text-xs"></i>
                <span>Urgent</span>
                <span v-if="urgentTasksCount > 0" class="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-800">
                  {{ urgentTasksCount }}
                </span>
              </button>
              <button
                type="button"
                @click="checklistFilter = 'pending'"
                class="px-3 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
                :class="checklistFilter === 'pending' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50'"
              >
                <span>⏳ Belum Selesai</span>
              </button>
            </div>

            <!-- Grouped by Phase -->
            <div class="space-y-6">
              <div
                v-for="phase in checklistPhases"
                :key="phase"
                class="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden"
              >
                <div class="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h4 class="font-black text-xs md:text-sm text-slate-900">{{ phase }}</h4>
                  </div>
                  <span class="text-[11px] font-bold text-slate-400">
                    {{ getCompletedPhaseCount(phase) }}/{{ getTotalPhaseCount(phase) }} Selesai
                  </span>
                </div>

                <div class="divide-y divide-slate-100 p-2">
                  <div
                    v-for="task in getPhaseTasks(phase)"
                    :key="task.id"
                    class="p-3.5 rounded-2xl hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-3"
                  >
                    <label class="flex items-start gap-3 cursor-pointer flex-1 min-w-0">
                      <input
                        type="checkbox"
                        v-model="task.isCompleted"
                        @change="handleSavePlanner"
                        class="h-4 w-4 mt-0.5 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div class="min-w-0">
                        <div class="flex flex-wrap items-center gap-2">
                          <span
                            class="text-xs font-bold leading-snug"
                            :class="task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'"
                          >
                            {{ task.task }}
                          </span>

                          <!-- Assignee Badge -->
                          <span
                            v-if="task.assignee === 'groom'"
                            class="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1"
                          >
                            <span>👨</span> Pria (Groom)
                          </span>
                          <span
                            v-else-if="task.assignee === 'bride'"
                            class="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-pink-50 text-pink-700 border border-pink-200 flex items-center gap-1"
                          >
                            <span>👩</span> Wanita (Bride)
                          </span>
                          <span
                            v-else-if="task.assignee === 'family'"
                            class="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1"
                          >
                            <span>👥</span> Keluarga
                          </span>
                          <span
                            v-else
                            class="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1"
                          >
                            <span>💑</span> Bersama
                          </span>

                          <!-- Category Badge -->
                          <span v-if="task.category" class="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                            {{ task.category }}
                          </span>

                          <!-- Urgent Badge -->
                          <span v-if="task.isUrgent" class="px-2 py-0.5 rounded-md text-[9px] font-black bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                            <i class="fa-solid fa-fire text-rose-500"></i> Urgent
                          </span>
                        </div>

                        <!-- Notes / Panduan -->
                        <p v-if="task.notes" class="text-[11px] text-slate-500 mt-1 leading-relaxed bg-slate-50/70 p-2 rounded-xl border border-slate-100">
                          📝 {{ task.notes }}
                        </p>

                        <!-- Deadline DueDate -->
                        <span v-if="task.dueDate" class="text-[10px] text-amber-700 font-bold flex items-center gap-1 mt-1.5">
                          <i class="fa-regular fa-calendar-check text-amber-500"></i>
                          <span>Tenggat: {{ task.dueDate }}</span>
                        </span>
                      </div>
                    </label>

                    <div class="flex items-center gap-1 shrink-0 pt-0.5">
                      <button
                        type="button"
                        @click="editChecklist(task, planner.checklists.findIndex(c => c.id === task.id))"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Edit tugas"
                      >
                        <i class="fa-solid fa-pen-to-square text-xs"></i>
                      </button>
                      <button
                        type="button"
                        @click="deleteChecklist(task.id)"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus tugas"
                      >
                        <i class="fa-solid fa-trash text-xs"></i>
                      </button>
                    </div>
                  </div>

                  <div v-if="!getPhaseTasks(phase).length" class="p-6 text-center text-slate-400 text-xs">
                    Tidak ada tugas di fase ini untuk filter yang dipilih.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 3: BUKU VENDOR -->
          <div v-else-if="activeTab === 'vendors'" class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 class="text-sm font-black text-slate-900">Buku Kontak Vendor Pernikahan</h3>
                <p class="text-[11px] text-slate-400">Simpan nomor kontak PIC katering, dekorasi, fotografer, dan status pembayaran</p>
              </div>
              <button
                type="button"
                @click="openAddVendorModal"
                class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <i class="fa-solid fa-plus text-xs"></i>
                <span>Tambah Vendor</span>
              </button>
            </div>

            <!-- Vendor Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="(vendor, idx) in planner.vendors"
                :key="vendor.id"
                class="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4 hover:border-slate-200 transition-all flex flex-col justify-between"
              >
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                      {{ vendor.category }}
                    </span>
                    <span
                      class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider"
                      :class="vendor.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : vendor.paymentStatus === 'dp' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'"
                    >
                      {{ vendor.paymentStatus === 'paid' ? 'Lunas' : vendor.paymentStatus === 'dp' ? 'DP' : 'Belum Bayar' }}
                    </span>
                  </div>

                  <h4 class="font-black text-sm text-slate-900">{{ vendor.name }}</h4>
                  <p v-if="vendor.picName" class="text-xs text-slate-500">PIC: <b>{{ vendor.picName }}</b></p>
                  <p v-if="vendor.price" class="text-xs font-mono font-bold text-slate-800">
                    Nilai Kontrak: {{ formatCurrency(vendor.price) }}
                  </p>
                  <p v-if="vendor.notes" class="text-[11px] text-slate-400 italic">
                    "{{ vendor.notes }}"
                  </p>
                </div>

                <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    v-if="vendor.phoneNumber"
                    :href="'https://wa.me/' + normalizePhone(vendor.phoneNumber)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <i class="fa-brands fa-whatsapp text-emerald-600"></i>
                    <span>Chat WA</span>
                  </a>
                  <span v-else class="text-[10px] text-slate-400">Tanpa nomor WA</span>

                  <div class="flex items-center gap-1">
                    <button
                      type="button"
                      @click="editVendor(vendor, idx)"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    >
                      <i class="fa-solid fa-pen-to-square text-xs"></i>
                    </button>
                    <button
                      type="button"
                      @click="deleteVendor(idx)"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <i class="fa-solid fa-trash text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="!planner.vendors?.length" class="col-span-full py-12 text-center bg-white rounded-3xl border border-slate-100 text-slate-400 space-y-2">
                <i class="fa-solid fa-handshake text-3xl text-slate-300"></i>
                <p class="text-xs font-bold text-slate-600">Belum ada vendor yang dicatat</p>
                <p class="text-[11px]">Tambahkan kontak WO, MUA, Katering atau Fotografer kamu di sini.</p>
              </div>
            </div>
          </div>

          <!-- TAB 4: RUNDOWN HARI H -->
          <div v-else-if="activeTab === 'rundown'" class="space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 class="text-sm font-black text-slate-900">Susunan Acara (Rundown) Hari H</h3>
                <p class="text-[11px] text-slate-400">Jadwal detail akad dan resepsi agar acara berjalan tepat waktu</p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="openPrintRundownModal"
                  class="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <i class="fa-solid fa-print"></i>
                  <span>Cetak Rundown</span>
                </button>
                <button
                  type="button"
                  @click="openAddRundownModal"
                  class="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <i class="fa-solid fa-plus text-xs"></i>
                  <span>Tambah Sesi</span>
                </button>
              </div>
            </div>

            <!-- Printable Rundown Box -->
            <div id="printable-rundown-area" class="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
              <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h4 class="font-black text-sm text-slate-900">Rundown Acara Pernikahan</h4>
                  <p class="text-[11px] text-slate-500">Disusun rapi melalui SatuUndangan.id</p>
                </div>
                <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-purple-50 text-purple-700 border border-purple-200">
                  {{ planner.rundown?.length || 0 }} Sesi Acara
                </span>
              </div>

              <div class="divide-y divide-slate-100">
                <div
                  v-for="(item, idx) in planner.rundown"
                  :key="item.id"
                  class="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                >
                  <div class="flex items-start gap-4 min-w-0">
                    <div class="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-900 font-mono font-bold text-xs shrink-0 border border-purple-100 text-center">
                      {{ item.time }}
                    </div>
                    <div class="min-w-0">
                      <h5 class="font-black text-xs md:text-sm text-slate-900">{{ item.activity }}</h5>
                      <div class="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span v-if="item.location" class="flex items-center gap-1">
                          <i class="fa-solid fa-location-dot text-slate-400"></i> {{ item.location }}
                        </span>
                        <span v-if="item.pic" class="flex items-center gap-1 font-bold text-purple-700">
                          <i class="fa-solid fa-user-tie text-purple-400"></i> PIC: {{ item.pic }}
                        </span>
                      </div>
                      <p v-if="item.notes" class="text-[11px] text-slate-400 italic mt-1">
                        Catatan: {{ item.notes }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center justify-end gap-1 shrink-0 pt-2 sm:pt-0">
                    <button
                      type="button"
                      @click="editRundown(item, idx)"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    >
                      <i class="fa-solid fa-pen-to-square text-xs"></i>
                    </button>
                    <button
                      type="button"
                      @click="deleteRundown(idx)"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <i class="fa-solid fa-trash text-xs"></i>
                    </button>
                  </div>
                </div>

                <div v-if="!planner.rundown?.length" class="p-8 text-center text-slate-400 text-xs">
                  Belum ada rundown. Klik "Tambah Sesi" di atas.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. ONBOARDING & SETUP PROFILE MODAL (Muncul pertama kali atau via tombol Profil) -->
        <Teleport to="body">
          <div
            v-if="openSetupModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto"
            @click.self="openSetupModal = false"
          >
            <div class="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-100 animate-scale-up">
              <div class="flex items-start justify-between">
                <div>
                  <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black uppercase mb-1">
                    <i class="fa-solid fa-sparkles text-amber-500"></i> Personalisasi Wedding Planner
                  </div>
                  <h3 class="text-base sm:text-lg font-black text-slate-900">
                    Yuk Atur Rencana Pernikahanmu!
                  </h3>
                  <p class="text-xs text-slate-500 mt-0.5">
                    Isi detail ini agar kalkulator budget dan countdown otomatis menyesuaikan acara pernikahanmu.
                  </p>
                </div>
                <button
                  type="button"
                  @click="openSetupModal = false"
                  class="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div class="space-y-4 text-xs">
                <!-- 1. Tanggal Pernikahan -->
                <div>
                  <label class="font-bold text-slate-800 block mb-1">
                    Tanggal Hari H Pernikahan:
                  </label>
                  <input
                    v-model="setupForm.weddingDate"
                    type="date"
                    class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 font-semibold focus:bg-white focus:outline-none focus:border-amber-500 transition-all"
                  />
                  <p class="text-[10px] text-slate-400 mt-1">Digunakan untuk menghitung countdown hari persiapan.</p>
                </div>

                <!-- 2. Konsep / Adat -->
                <div>
                  <label class="font-bold text-slate-800 block mb-1">
                    Konsep & Tema Pernikahan:
                  </label>
                  <select
                    v-model="setupForm.weddingConcept"
                    class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 font-semibold focus:bg-white focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
                  >
                    <option value="Modern & Minimalis">Modern & Minimalis (Nasional)</option>
                    <option value="Adat Jawa (Klasik/Keraton)">Adat Jawa (Klasik/Keraton)</option>
                    <option value="Adat Sunda (Siger)">Adat Sunda (Siger)</option>
                    <option value="Adat Minang / Batak / Sumatera">Adat Minang / Batak / Sumatera</option>
                    <option value="Adat Bugis / Makassar / Kalimantan">Adat Bugis / Makassar / Kalimantan</option>
                    <option value="Intimate Wedding / Garden Party">Intimate Wedding / Garden Party</option>
                    <option value="Pernikahan Islami / Syar'i">Pernikahan Islami / Syar'i</option>
                  </select>
                </div>

                <!-- 3. Target Budget & Estimasi Tamu -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="font-bold text-slate-800 block mb-1">
                      Target Budget (Rp):
                    </label>
                    <input
                      v-model.number="setupForm.budgetTotal"
                      type="number"
                      placeholder="Contoh: 75000000"
                      class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                  <div>
                    <label class="font-bold text-slate-800 block mb-1">
                      Estimasi Jumlah Tamu:
                    </label>
                    <input
                      v-model.number="setupForm.estimatedGuests"
                      type="number"
                      placeholder="Contoh: 400"
                      class="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div class="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  @click="openSetupModal = false"
                  class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Nanti Saja
                </button>
                <button
                  type="button"
                  @click="saveSetupProfile"
                  class="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <i class="fa-solid fa-check"></i>
                  <span>Simpan & Terapkan</span>
                </button>
              </div>
            </div>
          </div>
        </Teleport>

        <!-- 5. OTHER MODALS (Budget, Checklist, Vendor, Rundown) -->
        <!-- Budget Item Modal -->
        <Teleport to="body">
          <div v-if="showBudgetModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4" @click.self="showBudgetModal = false">
            <div class="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100">
              <h3 class="text-sm font-black text-slate-900">{{ editingBudgetItemIdx !== null ? 'Edit Pos Biaya' : 'Tambah Pos Biaya' }}</h3>
              <div class="space-y-3 text-xs">
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Kategori</label>
                  <select v-model="budgetItemForm.category" class="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 font-semibold">
                    <option value="Venue & Gedung">Venue & Gedung</option>
                    <option value="Katering">Katering</option>
                    <option value="Dekorasi">Dekorasi</option>
                    <option value="MUA & Busana">MUA & Busana</option>
                    <option value="Dokumentasi">Dokumentasi</option>
                    <option value="Undangan & Digital">Undangan & Digital</option>
                    <option value="Suvenir & Mahar">Suvenir & Mahar</option>
                    <option value="Wedding Organizer & Hiburan">Wedding Organizer & Hiburan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Nama Pos Pengeluaran</label>
                  <input v-model="budgetItemForm.name" type="text" placeholder="Contoh: Sewa Gedung Resepsi" class="w-full border border-slate-200 rounded-xl p-2.5 font-semibold" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="font-bold text-slate-700 block mb-1">Estimasi Biaya (Rp)</label>
                    <input v-model.number="budgetItemForm.estimatedCost" type="number" class="w-full border border-slate-200 rounded-xl p-2.5 font-mono font-bold" />
                  </div>
                  <div>
                    <label class="font-bold text-slate-700 block mb-1">Realisasi Kontrak (Rp)</label>
                    <input v-model.number="budgetItemForm.actualCost" type="number" class="w-full border border-slate-200 rounded-xl p-2.5 font-mono font-bold" />
                  </div>
                </div>
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Sudah Dibayar (Rp)</label>
                  <input v-model.number="budgetItemForm.paidAmount" type="number" class="w-full border border-slate-200 rounded-xl p-2.5 font-mono font-bold text-emerald-600" />
                </div>
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Catatan</label>
                  <input v-model="budgetItemForm.notes" type="text" placeholder="Opsional" class="w-full border border-slate-200 rounded-xl p-2.5" />
                </div>
              </div>
              <div class="flex justify-end gap-2 pt-2">
                <button type="button" @click="showBudgetModal = false" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Batal</button>
                <button type="button" @click="saveBudgetItem" class="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold">Simpan</button>
              </div>
            </div>
          </div>
        </Teleport>

        <!-- Checklist Modal -->
        <Teleport to="body">
          <div v-if="showChecklistModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4" @click.self="showChecklistModal = false">
            <div class="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-black text-slate-900">
                  {{ editingChecklistIdx !== null ? 'Edit Tugas Checklist' : 'Tambah Tugas Checklist Baru' }}
                </h3>
                <span
                  v-if="checklistForm.isUrgent"
                  class="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 flex items-center gap-1"
                >
                  <i class="fa-solid fa-fire text-rose-500"></i> Urgent
                </span>
              </div>

              <div class="space-y-3 text-xs">
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Fase Persiapan</label>
                  <select v-model="checklistForm.phase" class="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 font-semibold">
                    <option v-for="p in checklistPhases" :key="p" :value="p">{{ p }}</option>
                  </select>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="font-bold text-slate-700 block mb-1">Penanggung Jawab (PIC)</label>
                    <select v-model="checklistForm.assignee" class="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 font-bold text-slate-800">
                      <option value="both">💑 Bersama (Groom & Bride)</option>
                      <option value="groom">👨 Pengantin Pria (Groom)</option>
                      <option value="bride">👩 Pengantin Wanita (Bride)</option>
                      <option value="family">👥 Keluarga / Panitia</option>
                    </select>
                  </div>
                  <div>
                    <label class="font-bold text-slate-700 block mb-1">Kategori Tugas</label>
                    <input v-model="checklistForm.category" type="text" placeholder="Contoh: KUA, Busana, Katering" class="w-full border border-slate-200 rounded-xl p-2.5 font-semibold" />
                  </div>
                </div>

                <div>
                  <label class="font-bold text-slate-700 block mb-1">Nama Tugas / Rencana</label>
                  <input v-model="checklistForm.task" type="text" placeholder="Contoh: Minta surat pengantar RT/RW untuk KUA" class="w-full border border-slate-200 rounded-xl p-2.5 font-semibold" />
                </div>

                <div>
                  <label class="font-bold text-slate-700 block mb-1">Catatan, Link Dokumen, atau Kontak (Opsional)</label>
                  <textarea
                    v-model="checklistForm.notes"
                    rows="2"
                    placeholder="Contoh: Syarat bawa KTP & KK asli. Jam operasional loket 09.00 - 15.00"
                    class="w-full border border-slate-200 rounded-xl p-2.5 font-normal resize-none"
                  ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <label class="font-bold text-slate-700 block mb-1">Tenggat Waktu / Deadline (Opsional)</label>
                    <input v-model="checklistForm.dueDate" type="text" placeholder="Contoh: H-30 atau 15 Nov" class="w-full border border-slate-200 rounded-xl p-2.5 font-semibold" />
                  </div>
                  <div class="pt-5">
                    <label class="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        v-model="checklistForm.isUrgent"
                        class="h-4 w-4 rounded-md border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                      />
                      <span class="text-xs font-bold text-rose-700 flex items-center gap-1">
                        <i class="fa-solid fa-fire text-xs"></i> Tugas Mendesak (Urgent)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="flex justify-end gap-2 pt-2">
                <button type="button" @click="showChecklistModal = false" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Batal</button>
                <button type="button" @click="saveChecklistTask" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">Simpan</button>
              </div>
            </div>
          </div>
        </Teleport>

        <!-- Vendor Modal -->
        <Teleport to="body">
          <div v-if="showVendorModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4" @click.self="showVendorModal = false">
            <div class="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100">
              <h3 class="text-sm font-black text-slate-900">{{ editingVendorIdx !== null ? 'Edit Vendor' : 'Tambah Vendor' }}</h3>
              <div class="space-y-3 text-xs">
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Kategori Vendor</label>
                  <select v-model="vendorForm.category" class="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 font-semibold">
                    <option value="Venue & Gedung">Venue & Gedung</option>
                    <option value="Katering">Katering</option>
                    <option value="Dekorasi">Dekorasi</option>
                    <option value="MUA & Busana">MUA & Busana</option>
                    <option value="Fotografi & Video">Fotografi & Video</option>
                    <option value="Wedding Organizer">Wedding Organizer</option>
                    <option value="Musik & Sound">Musik & Sound</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Nama Vendor</label>
                  <input v-model="vendorForm.name" type="text" placeholder="Contoh: Diamond Ballroom" class="w-full border border-slate-200 rounded-xl p-2.5 font-semibold" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="font-bold text-slate-700 block mb-1">Nama PIC</label>
                    <input v-model="vendorForm.picName" type="text" placeholder="Bpk. Hendra" class="w-full border border-slate-200 rounded-xl p-2.5 font-semibold" />
                  </div>
                  <div>
                    <label class="font-bold text-slate-700 block mb-1">Nomor WhatsApp</label>
                    <input v-model="vendorForm.phoneNumber" type="text" placeholder="0812xxxx" class="w-full border border-slate-200 rounded-xl p-2.5 font-semibold" />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="font-bold text-slate-700 block mb-1">Nilai Kontrak (Rp)</label>
                    <input v-model.number="vendorForm.price" type="number" class="w-full border border-slate-200 rounded-xl p-2.5 font-mono font-bold" />
                  </div>
                  <div>
                    <label class="font-bold text-slate-700 block mb-1">Status Bayar</label>
                    <select v-model="vendorForm.paymentStatus" class="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 font-semibold">
                      <option value="unpaid">Belum Bayar</option>
                      <option value="dp">Sudah DP</option>
                      <option value="paid">Lunas</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Catatan Tambahan</label>
                  <input v-model="vendorForm.notes" type="text" placeholder="Contoh: DP 30% s/d H-30" class="w-full border border-slate-200 rounded-xl p-2.5" />
                </div>
              </div>
              <div class="flex justify-end gap-2 pt-2">
                <button type="button" @click="showVendorModal = false" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Batal</button>
                <button type="button" @click="saveVendor" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">Simpan</button>
              </div>
            </div>
          </div>
        </Teleport>

        <!-- Rundown Modal -->
        <Teleport to="body">
          <div v-if="showRundownModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4" @click.self="showRundownModal = false">
            <div class="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100">
              <h3 class="text-sm font-black text-slate-900">{{ editingRundownIdx !== null ? 'Edit Sesi Rundown' : 'Tambah Sesi Rundown' }}</h3>
              <div class="space-y-3 text-xs">
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Waktu / Jam</label>
                  <input v-model="rundownForm.time" type="text" placeholder="Contoh: 08:00 - 09:30" class="w-full border border-slate-200 rounded-xl p-2.5 font-mono font-semibold" />
                </div>
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Nama Sesi / Kegiatan</label>
                  <input v-model="rundownForm.activity" type="text" placeholder="Contoh: Prosesi Akad Nikah & Tukar Cincin" class="w-full border border-slate-200 rounded-xl p-2.5 font-semibold" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="font-bold text-slate-700 block mb-1">Lokasi</label>
                    <input v-model="rundownForm.location" type="text" placeholder="Contoh: Area Pelaminan" class="w-full border border-slate-200 rounded-xl p-2.5 font-semibold" />
                  </div>
                  <div>
                    <label class="font-bold text-slate-700 block mb-1">PIC / Penanggung Jawab</label>
                    <input v-model="rundownForm.pic" type="text" placeholder="Contoh: MC & WO" class="w-full border border-slate-200 rounded-xl p-2.5 font-semibold" />
                  </div>
                </div>
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Catatan Khusus</label>
                  <input v-model="rundownForm.notes" type="text" placeholder="Contoh: Siapkan mikrofon & meja ijab" class="w-full border border-slate-200 rounded-xl p-2.5" />
                </div>
              </div>
              <div class="flex justify-end gap-2 pt-2">
                <button type="button" @click="showRundownModal = false" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">Batal</button>
                <button type="button" @click="saveRundown" class="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold">Simpan</button>
              </div>
            </div>
          </div>
        </Teleport>

        <!-- Rundown Print & Preview Modal -->
        <Teleport to="body">
          <div
            v-if="showPrintRundownModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto no-print"
            @click.self="showPrintRundownModal = false"
          >
            <div class="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6">
              <!-- Modal Header -->
              <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                    <i class="fa-solid fa-print"></i>
                  </div>
                  <div>
                    <h3 class="font-black text-sm text-slate-900">Preview & Cetak Rundown Acara</h3>
                    <p class="text-[11px] text-slate-500">Siap dicetak di kertas A4 atau disimpan dalam format PDF</p>
                  </div>
                </div>
                <button
                  type="button"
                  @click="showPrintRundownModal = false"
                  class="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors text-xs"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>

              <!-- Paper Preview Container -->
              <div class="p-6 bg-slate-100 max-h-[60vh] overflow-y-auto">
                <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 text-slate-800 font-sans">
                  <!-- Header Paper -->
                  <div class="text-center border-b-2 border-slate-900 pb-3 mb-4">
                    <h2 class="text-base sm:text-lg font-black uppercase tracking-wider text-slate-900">Rundown Acara Pernikahan</h2>
                    <p class="text-xs text-slate-500 mt-1">
                      <span v-if="planner.weddingDate">Tanggal: {{ formatDate(planner.weddingDate) }} • </span>
                      Disusun rapi melalui SatuUndangan.id
                    </p>
                  </div>

                  <!-- Rundown Table -->
                  <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr class="border-b-2 border-slate-200 bg-slate-50">
                          <th class="p-2.5 font-black uppercase text-[10px] text-slate-600 w-28">Waktu</th>
                          <th class="p-2.5 font-black uppercase text-[10px] text-slate-600">Sesi & Acara</th>
                          <th class="p-2.5 font-black uppercase text-[10px] text-slate-600 w-32">Lokasi</th>
                          <th class="p-2.5 font-black uppercase text-[10px] text-slate-600 w-28">PIC</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100">
                        <tr v-for="r in planner.rundown" :key="r.id" class="text-slate-800">
                          <td class="p-2.5 font-mono font-bold text-slate-700 align-top">{{ r.time }}</td>
                          <td class="p-2.5 align-top">
                            <div class="font-bold text-slate-900">{{ r.activity }}</div>
                            <div v-if="r.notes" class="text-[11px] text-slate-500 mt-0.5 italic">{{ r.notes }}</div>
                          </td>
                          <td class="p-2.5 text-slate-600 align-top">{{ r.location || '-' }}</td>
                          <td class="p-2.5 font-bold text-purple-700 align-top">{{ r.pic || '-' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Footer Paper -->
                  <div class="mt-6 pt-3 border-t border-dashed border-slate-300 text-center text-[10px] text-slate-400">
                    Dicetak dari platform SatuUndangan.id • Solusi Undangan Digital & Wedding Planner Modern Indonesia
                  </div>
                </div>
              </div>

              <!-- Modal Actions -->
              <div class="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
                <span class="text-xs text-slate-400 font-medium hidden sm:inline">
                  {{ planner.rundown?.length || 0 }} sesi acara
                </span>
                <div class="flex items-center justify-end gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    @click="showPrintRundownModal = false"
                    class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    @click="executePrintRundown"
                    class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <i class="fa-solid fa-print"></i>
                    <span>Cetak Sekarang (Print / PDF)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Teleport>
      </main>
    </div>

    <BottomNav class="no-print" />
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import Sidebar from '@/components/dashboard/SidebarDashboard.vue'
import Topbar from '@/components/dashboard/TopbarDashboard.vue'
import BottomNav from '@/components/dashboard/BottomNav.vue'
import { getWeddingPlanner, unlockWeddingPlanner, updateWeddingPlanner } from '@/api/weddingPlanner'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const auth = useAuthStore()
const toast = useToast()

const isSidebarOpen = ref(false)
const loading = ref(true)
const saving = ref(false)
const unlocking = ref(false)

const isUnlocked = ref(false)
const instagramHandle = ref('')
const hasClickedFollow = ref(false)
const hasClickedShare = ref(false)

const activeTab = ref('budget')
const openSetupModal = ref(false)

const unlockForm = reactive({
  instagramHandle: '',
})

// Planner Data State
const planner = reactive({
  budgetTotal: 70000000,
  weddingDate: '',
  weddingConcept: 'Modern & Minimalis',
  estimatedGuests: 300,
  budgetItems: [],
  checklists: [],
  vendors: [],
  rundown: [],
})

const setupForm = reactive({
  weddingDate: '',
  weddingConcept: 'Modern & Minimalis',
  budgetTotal: 70000000,
  estimatedGuests: 300,
})

const checklistPhases = [
  'H-180 s/d H-120',
  'H-90 s/d H-60',
  'H-30 s/d H-7',
  'Minggu Terakhir & Hari H',
]

// Modal states
const showBudgetModal = ref(false)
const editingBudgetItemIdx = ref(null)
const budgetItemForm = reactive({
  id: '',
  category: 'Venue & Gedung',
  name: '',
  estimatedCost: 0,
  actualCost: 0,
  paidAmount: 0,
  notes: '',
})

const showChecklistModal = ref(false)
const editingChecklistIdx = ref(null)
const checklistFilter = ref('all') // 'all' | 'groom' | 'bride' | 'both' | 'family' | 'urgent' | 'pending'
const checklistForm = reactive({
  id: '',
  phase: 'H-180 s/d H-120',
  category: 'Administrasi',
  task: '',
  notes: '',
  dueDate: '',
  assignee: 'both', // 'groom' | 'bride' | 'both' | 'family'
  isUrgent: false,
})

const showVendorModal = ref(false)
const editingVendorIdx = ref(null)
const vendorForm = reactive({
  id: '',
  category: 'Venue & Gedung',
  name: '',
  picName: '',
  phoneNumber: '',
  price: 0,
  paymentStatus: 'unpaid',
  notes: '',
})

const showRundownModal = ref(false)
const showPrintRundownModal = ref(false)
const editingRundownIdx = ref(null)
const rundownForm = reactive({
  id: '',
  time: '',
  activity: '',
  location: '',
  pic: '',
  notes: '',
})

// Computed Stats
const totalEstimatedCost = computed(() => {
  return (planner.budgetItems || []).reduce((sum, item) => sum + (Number(item.estimatedCost) || 0), 0)
})

const totalActualCost = computed(() => {
  return (planner.budgetItems || []).reduce((sum, item) => sum + (Number(item.actualCost) || 0), 0)
})

const totalPaidAmount = computed(() => {
  return (planner.budgetItems || []).reduce((sum, item) => sum + (Number(item.paidAmount) || 0), 0)
})

const budgetPercent = computed(() => {
  if (!planner.budgetTotal || planner.budgetTotal === 0) return 0
  return Math.round((totalActualCost.value / planner.budgetTotal) * 100)
})

const totalChecklistCount = computed(() => (planner.checklists || []).length)
const completedChecklistCount = computed(() => (planner.checklists || []).filter(c => c.isCompleted).length)
const checklistPercent = computed(() => {
  if (!totalChecklistCount.value) return 0
  return Math.round((completedChecklistCount.value / totalChecklistCount.value) * 100)
})

const paidVendorsCount = computed(() => {
  return (planner.vendors || []).filter(v => v.paymentStatus === 'paid').length
})

// Overall readiness score (0-100%)
const overallReadinessPercent = computed(() => {
  let score = 0
  // 50% from checklist
  score += Math.round(checklistPercent.value * 0.5)
  // 25% from having vendors listed
  if (planner.vendors?.length >= 3) score += 25
  else if (planner.vendors?.length > 0) score += 15
  // 25% from budget setup
  if (totalActualCost.value > 0) score += 25
  return Math.min(score, 100)
})

// Countdown Days to Wedding
const countdownDays = computed(() => {
  if (!planner.weddingDate) return null
  const target = new Date(planner.weddingDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  const diffTime = target.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const groomTasksCount = computed(() => (planner.checklists || []).filter(c => c.assignee === 'groom').length)
const groomCompletedCount = computed(() => (planner.checklists || []).filter(c => c.assignee === 'groom' && c.isCompleted).length)

const brideTasksCount = computed(() => (planner.checklists || []).filter(c => c.assignee === 'bride').length)
const brideCompletedCount = computed(() => (planner.checklists || []).filter(c => c.assignee === 'bride' && c.isCompleted).length)

const bothTasksCount = computed(() => (planner.checklists || []).filter(c => (!c.assignee || c.assignee === 'both')).length)
const bothCompletedCount = computed(() => (planner.checklists || []).filter(c => (!c.assignee || c.assignee === 'both') && c.isCompleted).length)

const urgentTasksCount = computed(() => (planner.checklists || []).filter(c => c.isUrgent && !c.isCompleted).length)

function getPhaseTasks(phase) {
  const phaseList = (planner.checklists || []).filter(c => c.phase === phase)
  if (checklistFilter.value === 'all') return phaseList
  if (checklistFilter.value === 'groom') return phaseList.filter(c => c.assignee === 'groom')
  if (checklistFilter.value === 'bride') return phaseList.filter(c => c.assignee === 'bride')
  if (checklistFilter.value === 'both') return phaseList.filter(c => (!c.assignee || c.assignee === 'both'))
  if (checklistFilter.value === 'family') return phaseList.filter(c => c.assignee === 'family')
  if (checklistFilter.value === 'urgent') return phaseList.filter(c => c.isUrgent)
  if (checklistFilter.value === 'pending') return phaseList.filter(c => !c.isCompleted)
  return phaseList
}

function getCompletedPhaseCount(phase) {
  return (planner.checklists || []).filter(c => c.phase === phase && c.isCompleted).length
}

function getTotalPhaseCount(phase) {
  return (planner.checklists || []).filter(c => c.phase === phase).length
}

// Formatters
function formatCurrency(val) {
  return 'Rp ' + Number(val || 0).toLocaleString('id-ID')
}

function formatNumber(val) {
  return Number(val || 0).toLocaleString('id-ID')
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function normalizePhone(phone) {
  if (!phone) return ''
  let cleaned = String(phone).replace(/\D/g, '')
  if (cleaned.startsWith('0')) cleaned = '62' + cleaned.slice(1)
  return cleaned
}

// Lifecycle Load
onMounted(async () => {
  await loadPlanner()
})

async function loadPlanner() {
  loading.value = true
  try {
    const res = await getWeddingPlanner()
    isUnlocked.value = Boolean(res.hasWeddingPlannerAccess)
    instagramHandle.value = res.instagramHandle || ''
    if (res.planner) {
      planner.budgetTotal = Number(res.planner.budgetTotal) || 70000000
      planner.weddingDate = res.planner.weddingDate || ''
      planner.weddingConcept = res.planner.weddingConcept || 'Modern & Minimalis'
      planner.estimatedGuests = Number(res.planner.estimatedGuests) || 300
      planner.budgetItems = res.planner.budgetItems || []
      planner.checklists = res.planner.checklists || []
      planner.vendors = res.planner.vendors || []
      planner.rundown = res.planner.rundown || []

      // Sync setupForm
      setupForm.budgetTotal = planner.budgetTotal
      setupForm.weddingDate = planner.weddingDate
      setupForm.weddingConcept = planner.weddingConcept
      setupForm.estimatedGuests = planner.estimatedGuests
    }
  } catch (err) {
    console.error('Failed to load wedding planner:', err)
  } finally {
    loading.value = false
  }
}

// Share to WhatsApp
function shareToWhatsApp() {
  hasClickedShare.value = true
  const text = encodeURIComponent(
    'Halo! Rekomendasi buat kamu yang lagi siapin nikahan: coba pakai platform SatuUndangan.id. Ada fitur Wedding Planner, Kalkulator Budget & Checklist H-180 gratis seumur hidup! Cek di: https://satuundangan.id/wedding-planner'
  )
  window.open(`https://wa.me/?text=${text}`, '_blank')
}

// Submit Unlock
async function submitUnlock() {
  const handle = (unlockForm.instagramHandle || '').trim().replace(/^@/, '')
  if (!handle) {
    toast.warning('Silakan masukkan username Instagram kamu terlebih dahulu!')
    return
  }

  unlocking.value = true
  try {
    const res = await unlockWeddingPlanner({
      instagramHandle: `@${handle}`,
      platform: 'instagram',
    })
    isUnlocked.value = true
    instagramHandle.value = res.instagramHandle || `@${handle}`
    if (res.planner) {
      planner.budgetTotal = Number(res.planner.budgetTotal) || 70000000
      planner.weddingDate = res.planner.weddingDate || ''
      planner.weddingConcept = res.planner.weddingConcept || 'Modern & Minimalis'
      planner.estimatedGuests = Number(res.planner.estimatedGuests) || 300
      planner.budgetItems = res.planner.budgetItems || []
      planner.checklists = res.planner.checklists || []
      planner.vendors = res.planner.vendors || []
      planner.rundown = res.planner.rundown || []

      setupForm.budgetTotal = planner.budgetTotal
      setupForm.weddingDate = planner.weddingDate
      setupForm.weddingConcept = planner.weddingConcept
      setupForm.estimatedGuests = planner.estimatedGuests
    }

    toast.success('Selamat! Akses Wedding Planner kamu sudah aktif gratis seumur hidup 🎉')
    // Open onboarding modal immediately so user can customize their budget & date
    openSetupModal.value = true
  } catch (err) {
    toast.error(err.message || 'Gagal membuka akses')
  } finally {
    unlocking.value = false
  }
}

// Save Setup Profile
async function saveSetupProfile() {
  planner.weddingDate = setupForm.weddingDate
  planner.weddingConcept = setupForm.weddingConcept
  planner.budgetTotal = Number(setupForm.budgetTotal) || 70000000
  planner.estimatedGuests = Number(setupForm.estimatedGuests) || 300

  openSetupModal.value = false
  await handleSavePlanner()
  toast.success('Profil rencana pernikahan berhasil diperbarui!')
}

// Save Planner
async function handleSavePlanner() {
  saving.value = true
  try {
    await updateWeddingPlanner({
      budgetTotal: planner.budgetTotal,
      weddingDate: planner.weddingDate,
      weddingConcept: planner.weddingConcept,
      estimatedGuests: planner.estimatedGuests,
      budgetItems: planner.budgetItems,
      checklists: planner.checklists,
      vendors: planner.vendors,
      rundown: planner.rundown,
    })
    toast.success('Data Wedding Planner berhasil disimpan!')
  } catch (err) {
    toast.error(err.message || 'Gagal menyimpan planner')
  } finally {
    saving.value = false
  }
}

// Prompt Edit Total Budget
async function promptEditTotalBudget() {
  const { value: newBudget } = await Swal.fire({
    title: 'Ubah Target Anggaran',
    text: 'Masukkan total budget maksimal rencana pernikahan kamu:',
    input: 'number',
    inputValue: planner.budgetTotal,
    showCancelButton: true,
    confirmButtonText: 'Simpan',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#d97706',
  })
  if (newBudget !== undefined && newBudget !== null) {
    planner.budgetTotal = Number(newBudget)
    setupForm.budgetTotal = Number(newBudget)
    handleSavePlanner()
  }
}

// Budget Modal Handlers
function openAddBudgetItemModal() {
  editingBudgetItemIdx.value = null
  Object.assign(budgetItemForm, {
    id: 'bgt-' + Date.now(),
    category: 'Venue & Gedung',
    name: '',
    estimatedCost: 0,
    actualCost: 0,
    paidAmount: 0,
    notes: '',
  })
  showBudgetModal.value = true
}

function editBudgetItem(item, idx) {
  editingBudgetItemIdx.value = idx
  Object.assign(budgetItemForm, JSON.parse(JSON.stringify(item)))
  showBudgetModal.value = true
}

function saveBudgetItem() {
  if (!budgetItemForm.name) {
    toast.warning('Nama pos pengeluaran wajib diisi')
    return
  }
  if (editingBudgetItemIdx.value !== null) {
    planner.budgetItems[editingBudgetItemIdx.value] = { ...budgetItemForm }
  } else {
    planner.budgetItems.push({ ...budgetItemForm })
  }
  showBudgetModal.value = false
  handleSavePlanner()
}

function deleteBudgetItem(idx) {
  planner.budgetItems.splice(idx, 1)
  handleSavePlanner()
}

// Checklist Modal Handlers
function openAddChecklistModal() {
  editingChecklistIdx.value = null
  Object.assign(checklistForm, {
    id: 'chk-' + Date.now(),
    phase: 'H-180 s/d H-120',
    category: 'Administrasi & Konsep',
    task: '',
    notes: '',
    dueDate: '',
    assignee: 'both',
    isUrgent: false,
  })
  showChecklistModal.value = true
}

function editChecklist(task, idx) {
  editingChecklistIdx.value = idx
  Object.assign(checklistForm, {
    id: task.id || 'chk-' + Date.now(),
    phase: task.phase || 'H-180 s/d H-120',
    category: task.category || 'Administrasi & Konsep',
    task: task.task || '',
    notes: task.notes || '',
    dueDate: task.dueDate || '',
    assignee: task.assignee || 'both',
    isUrgent: Boolean(task.isUrgent),
  })
  showChecklistModal.value = true
}

function saveChecklistTask() {
  if (!checklistForm.task) {
    toast.warning('Nama tugas wajib diisi')
    return
  }

  const taskData = {
    id: checklistForm.id,
    phase: checklistForm.phase,
    category: checklistForm.category,
    task: checklistForm.task,
    notes: checklistForm.notes,
    dueDate: checklistForm.dueDate,
    assignee: checklistForm.assignee,
    isUrgent: checklistForm.isUrgent,
  }

  if (editingChecklistIdx.value !== null && planner.checklists[editingChecklistIdx.value]) {
    planner.checklists[editingChecklistIdx.value] = {
      ...planner.checklists[editingChecklistIdx.value],
      ...taskData,
    }
  } else {
    planner.checklists.push({
      ...taskData,
      isCompleted: false,
    })
  }

  showChecklistModal.value = false
  handleSavePlanner()
}

function deleteChecklist(id) {
  const idx = planner.checklists.findIndex(c => c.id === id)
  if (idx !== -1) {
    planner.checklists.splice(idx, 1)
    handleSavePlanner()
  }
}

// Vendor Modal Handlers
function openAddVendorModal() {
  editingVendorIdx.value = null
  Object.assign(vendorForm, {
    id: 'vnd-' + Date.now(),
    category: 'Venue & Gedung',
    name: '',
    picName: '',
    phoneNumber: '',
    price: 0,
    paymentStatus: 'unpaid',
    notes: '',
  })
  showVendorModal.value = true
}

function editVendor(vendor, idx) {
  editingVendorIdx.value = idx
  Object.assign(vendorForm, JSON.parse(JSON.stringify(vendor)))
  showVendorModal.value = true
}

function saveVendor() {
  if (!vendorForm.name) {
    toast.warning('Nama vendor wajib diisi')
    return
  }
  if (editingVendorIdx.value !== null) {
    planner.vendors[editingVendorIdx.value] = { ...vendorForm }
  } else {
    planner.vendors.push({ ...vendorForm })
  }
  showVendorModal.value = false
  handleSavePlanner()
}

function deleteVendor(idx) {
  planner.vendors.splice(idx, 1)
  handleSavePlanner()
}

// Rundown Modal Handlers
function openAddRundownModal() {
  editingRundownIdx.value = null
  Object.assign(rundownForm, {
    id: 'rdn-' + Date.now(),
    time: '08:00 - 09:00',
    activity: '',
    location: '',
    pic: '',
    notes: '',
  })
  showRundownModal.value = true
}

function editRundown(item, idx) {
  editingRundownIdx.value = idx
  Object.assign(rundownForm, JSON.parse(JSON.stringify(item)))
  showRundownModal.value = true
}

function saveRundown() {
  if (!rundownForm.activity) {
    toast.warning('Nama sesi kegiatan wajib diisi')
    return
  }
  if (editingRundownIdx.value !== null) {
    planner.rundown[editingRundownIdx.value] = { ...rundownForm }
  } else {
    planner.rundown.push({ ...rundownForm })
  }
  showRundownModal.value = false
  handleSavePlanner()
}

function deleteRundown(idx) {
  planner.rundown.splice(idx, 1)
  handleSavePlanner()
}

function openPrintRundownModal() {
  if (!planner.rundown || planner.rundown.length === 0) {
    toast.warning('Belum ada jadwal rundown untuk dicetak. Tambahkan sesi acara terlebih dahulu.')
    return
  }
  showPrintRundownModal.value = true
}

function generateRundownPrintHtml() {
  const weddingDateStr = planner.weddingDate ? formatDate(planner.weddingDate) : ''
  const rowsHtml = (planner.rundown || []).map(r => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px; font-weight: bold; font-family: monospace; font-size: 13px; color: #475569;">${r.time}</td>
      <td style="padding: 10px; font-size: 13px;">
        <strong style="color: #0f172a;">${r.activity}</strong>
        ${r.notes ? `<div style="color: #64748b; font-size: 11px; margin-top: 2px;">${r.notes}</div>` : ''}
      </td>
      <td style="padding: 10px; font-size: 12px; color: #334155;">${r.location || '-'}</td>
      <td style="padding: 10px; font-size: 12px; font-weight: bold; color: #7c3aed;">${r.pic || '-'}</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Rundown Acara Pernikahan - SatuUndangan.id</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          * { box-sizing: border-box; }
          body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 24px; }
          .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 14px; margin-bottom: 20px; }
          .header h1 { font-size: 20px; margin: 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 800; }
          .header p { font-size: 12px; color: #64748b; margin: 4px 0 0; }
          table { width: 100%; border-collapse: collapse; text-align: left; }
          th { background: #f8fafc; padding: 10px; font-size: 11px; text-transform: uppercase; color: #475569; border-bottom: 2px solid #cbd5e1; font-weight: 800; }
          .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Rundown Acara Pernikahan</h1>
          <p>${weddingDateStr ? `Tanggal: ${weddingDateStr} • ` : ''}Disusun rapi menggunakan Wedding Planner SatuUndangan.id</p>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 20%;">Waktu</th>
              <th style="width: 45%;">Kegiatan / Acara</th>
              <th style="width: 20%;">Lokasi</th>
              <th style="width: 15%;">PIC</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
        <div class="footer">
          Dicetak dari platform SatuUndangan.id • Solusi Undangan Digital & Wedding Planner Modern Indonesia
        </div>
      </body>
    </html>
  `
}

// Execute Print via new window with fallback to iframe
function executePrintRundown() {
  if (!planner.rundown || planner.rundown.length === 0) {
    toast.warning('Belum ada jadwal rundown untuk dicetak')
    return
  }

  const html = generateRundownPrintHtml()

  try {
    const printWindow = window.open('', '_blank', 'width=800,height=900')
    if (printWindow) {
      printWindow.document.open()
      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        try {
          printWindow.print()
        } catch (e) {
          console.error('Print window error:', e)
        }
      }, 350)
      return
    }
  } catch (err) {
    console.warn('window.open blocked, falling back to hidden iframe:', err)
  }

  // Fallback: Safe isolated iframe
  try {
    const existingFrame = document.getElementById('satuundangan-rundown-frame')
    if (existingFrame) existingFrame.remove()

    const iframe = document.createElement('iframe')
    iframe.id = 'satuundangan-rundown-frame'
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
      try {
        iframe.contentWindow.print()
      } catch (e) {
        console.error('Iframe print error:', e)
      }
    }, 350)
  } catch (e) {
    console.error('Fatal print error:', e)
    toast.error('Gagal membuka dialog cetak. Silakan periksa pengaturan browser Anda.')
  }
}
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
