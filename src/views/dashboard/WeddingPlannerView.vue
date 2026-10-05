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
          <div v-if="isUnlocked" class="flex items-center gap-2">
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
              Dapatkan Kalkulator Budget Otomatis, 20+ Checklist Persiapan Pernikahan Adat & Nasional, Buku Kontak Vendor, serta Generator Rundown Hari H tanpa biaya sepeser pun. Cukup dukung kami dengan 2 langkah mudah di bawah ini!
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
                  Username Instagram Kamu (opsional, untuk konfirmasi):
                </label>
                <div class="relative">
                  <i class="fa-solid fa-at absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs"></i>
                  <input
                    v-model="unlockForm.instagramHandle"
                    type="text"
                    placeholder="nama_kamu (contoh: rina.septiani)"
                    class="w-full rounded-xl bg-white/10 border border-white/20 pl-9 pr-3.5 py-2.5 text-xs font-semibold text-white placeholder-stone-400 focus:outline-none focus:border-amber-400 transition-all"
                  />
                </div>
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
            <div class="p-5 rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <span class="text-[10px] font-black uppercase tracking-wider text-emerald-300">Countdown & Progress Persiapan</span>
                <h3 class="text-base font-black mt-0.5">
                  {{ completedChecklistCount }} dari {{ totalChecklistCount }} Tugas Selesai ({{ checklistPercent }}%)
                </h3>
                <p class="text-xs text-emerald-200/80 mt-1">
                  Centang tugas yang sudah kamu selesaikan agar tidak ada detail penting yang terlewat!
                </p>
              </div>
              <button
                type="button"
                @click="openAddChecklistModal"
                class="px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-black text-xs hover:bg-emerald-50 transition-all shadow-md shrink-0 cursor-pointer"
              >
                <i class="fa-solid fa-plus mr-1"></i> Tambah Tugas Baru
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
                    {{ getCompletedPhaseCount(phase) }}/{{ getPhaseTasks(phase).length }} Selesai
                  </span>
                </div>

                <div class="divide-y divide-slate-100 p-2">
                  <div
                    v-for="task in getPhaseTasks(phase)"
                    :key="task.id"
                    class="p-3 rounded-2xl hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-3"
                  >
                    <label class="flex items-start gap-3 cursor-pointer flex-1 min-w-0">
                      <input
                        type="checkbox"
                        v-model="task.isCompleted"
                        class="h-4 w-4 mt-0.5 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div class="min-w-0">
                        <span
                          class="text-xs font-bold block"
                          :class="task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'"
                        >
                          {{ task.task }}
                        </span>
                        <span v-if="task.dueDate" class="text-[10px] text-amber-600 font-semibold block mt-0.5">
                          Tenggat: {{ task.dueDate }}
                        </span>
                      </div>
                    </label>

                    <button
                      type="button"
                      @click="deleteChecklist(task.id)"
                      class="text-slate-300 hover:text-rose-500 p-1 text-xs"
                      title="Hapus tugas"
                    >
                      <i class="fa-solid fa-xmark"></i>
                    </button>
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
                  @click="printRundown"
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

        <!-- 4. MODALS (Add/Edit Budget, Checklist, Vendor, Rundown) -->
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
                    <option value="Musik & Hiburan">Musik & Hiburan</option>
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
              <h3 class="text-sm font-black text-slate-900">Tambah Tugas Checklist</h3>
              <div class="space-y-3 text-xs">
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Fase Persiapan</label>
                  <select v-model="checklistForm.phase" class="w-full border border-slate-200 rounded-xl p-2.5 bg-slate-50 font-semibold">
                    <option v-for="p in checklistPhases" :key="p" :value="p">{{ p }}</option>
                  </select>
                </div>
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Nama Tugas</label>
                  <input v-model="checklistForm.task" type="text" placeholder="Contoh: Booking MUA Pengantin" class="w-full border border-slate-200 rounded-xl p-2.5 font-semibold" />
                </div>
                <div>
                  <label class="font-bold text-slate-700 block mb-1">Tenggat Waktu (Opsional)</label>
                  <input v-model="checklistForm.dueDate" type="text" placeholder="Contoh: Akhir Bulan Ini" class="w-full border border-slate-200 rounded-xl p-2.5 font-semibold" />
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

const unlockForm = reactive({
  instagramHandle: '',
})

// Planner Data State
const planner = reactive({
  budgetTotal: 70000000,
  budgetItems: [],
  checklists: [],
  vendors: [],
  rundown: [],
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
const checklistForm = reactive({
  id: '',
  phase: 'H-180 s/d H-120',
  task: '',
  dueDate: '',
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

function getPhaseTasks(phase) {
  return (planner.checklists || []).filter(c => c.phase === phase)
}

function getCompletedPhaseCount(phase) {
  return getPhaseTasks(phase).filter(c => c.isCompleted).length
}

// Formatters
function formatCurrency(val) {
  return 'Rp ' + Number(val || 0).toLocaleString('id-ID')
}

function formatNumber(val) {
  return Number(val || 0).toLocaleString('id-ID')
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
      planner.budgetItems = res.planner.budgetItems || []
      planner.checklists = res.planner.checklists || []
      planner.vendors = res.planner.vendors || []
      planner.rundown = res.planner.rundown || []
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
    'Halo! Rekomendasi buat kamu yang lagi siapin nikahan: coba pakai platform SatuUndangan.id. Ada fitur Wedding Planner, Kalkulator Budget & Checklist H-180 gratis seumur hidup! Cek di: https://satuundangan.id'
  )
  window.open(`https://wa.me/?text=${text}`, '_blank')
}

// Submit Unlock
async function submitUnlock() {
  unlocking.value = true
  try {
    const res = await unlockWeddingPlanner({
      instagramHandle: unlockForm.instagramHandle || auth.user?.name || '',
      platform: 'instagram',
    })
    isUnlocked.value = true
    if (res.planner) {
      planner.budgetTotal = Number(res.planner.budgetTotal) || 70000000
      planner.budgetItems = res.planner.budgetItems || []
      planner.checklists = res.planner.checklists || []
      planner.vendors = res.planner.vendors || []
      planner.rundown = res.planner.rundown || []
    }
    toast.success('Selamat! Akses Wedding Planner kamu sudah aktif gratis seumur hidup 🎉')
  } catch (err) {
    toast.error(err.message || 'Gagal membuka akses')
  } finally {
    unlocking.value = false
  }
}

// Save Planner
async function handleSavePlanner() {
  saving.value = true
  try {
    await updateWeddingPlanner({
      budgetTotal: planner.budgetTotal,
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
  Object.assign(checklistForm, {
    id: 'chk-' + Date.now(),
    phase: 'H-180 s/d H-120',
    task: '',
    dueDate: '',
  })
  showChecklistModal.value = true
}

function saveChecklistTask() {
  if (!checklistForm.task) {
    toast.warning('Nama tugas wajib diisi')
    return
  }
  planner.checklists.push({
    id: checklistForm.id,
    phase: checklistForm.phase,
    task: checklistForm.task,
    dueDate: checklistForm.dueDate,
    isCompleted: false,
  })
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

// Print Rundown via isolated iframe
function printRundown() {
  const el = document.getElementById('printable-rundown-area')
  if (!el) {
    toast.error('Konten rundown tidak ditemukan')
    return
  }

  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.top = '-9999px'
  iframe.style.left = '-9999px'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  document.body.appendChild(iframe)

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

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Rundown Acara Pernikahan - SatuUndangan.id</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
          .header h1 { font-size: 20px; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
          .header p { font-size: 12px; color: #64748b; margin: 4px 0 0; }
          table { width: 100%; border-collapse: collapse; text-align: left; }
          th { background: #f8fafc; padding: 10px; font-size: 11px; text-transform: uppercase; color: #64748b; border-bottom: 2px solid #cbd5e1; }
          .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Rundown Acara Pernikahan</h1>
          <p>Disusun rapi menggunakan Wedding Planner SatuUndangan.id</p>
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
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
