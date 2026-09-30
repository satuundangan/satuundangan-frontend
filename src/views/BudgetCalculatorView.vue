<template>
  <div class="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans flex flex-col">
    <!-- Navbar Minimalist -->
    <header class="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2 group">
          <img src="/logo_satuundangan.png" alt="Satu Undangan" class="h-8 w-auto object-contain" />
          <span class="font-bold text-sm tracking-tight text-stone-800 group-hover:text-amber-700 transition">SatuUndangan.id</span>
        </router-link>
        
        <div class="flex items-center gap-3">
          <router-link
            to="/#templates"
            class="text-xs font-semibold text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition hidden sm:inline-block"
          >
            Katalog Desain
          </router-link>
          <router-link
            to="/create"
            class="bg-stone-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>Buat Undangan</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </router-link>
        </div>
      </div>
    </header>

    <main class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      <!-- Hero Title -->
      <div class="text-center max-w-3xl mx-auto space-y-3">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold tracking-wide">
          <i class="fa-solid fa-calculator text-amber-600"></i> Alat Bantu Gratis Calon Pengantin
        </div>
        <h1 class="text-3xl sm:text-5xl font-black font-serif text-stone-900 tracking-tight leading-tight">
          Kalkulator Budget Nikah & Wedding Checklist
        </h1>
        <p class="text-sm sm:text-base text-stone-600 leading-relaxed">
          Rencanakan anggaran pernikahan impianmu secara cerdas tanpa over-budget. Dapatkan pembagian alokasi dana realistis dan checklist persiapan lengkap gratis.
        </p>
      </div>

      <!-- Tab Switcher: Kalkulator Budget vs Checklist -->
      <div class="flex justify-center">
        <div class="bg-stone-200/80 p-1 rounded-2xl inline-flex gap-1 shadow-inner">
          <button
            type="button"
            @click="activeTab = 'calculator'"
            :class="[
              'px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer',
              activeTab === 'calculator'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900',
            ]"
          >
            <i class="fa-solid fa-coins text-amber-500"></i>
            <span>Kalkulator Anggaran</span>
          </button>
          <button
            type="button"
            @click="activeTab = 'checklist'"
            :class="[
              'px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer',
              activeTab === 'checklist'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900',
            ]"
          >
            <i class="fa-solid fa-clipboard-check text-emerald-500"></i>
            <span>Checklist Persiapan</span>
          </button>
        </div>
      </div>

      <!-- Tab 1: Calculator -->
      <div v-show="activeTab === 'calculator'" class="space-y-8 animate-fade-in">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Left Controls -->
          <div class="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <h2 class="text-lg font-bold text-stone-900 flex items-center gap-2">
              <i class="fa-solid fa-sliders text-amber-600"></i>
              <span>Parameter Acara</span>
            </h2>

            <!-- Budget Input -->
            <div class="space-y-2">
              <div class="flex justify-between items-center text-xs">
                <label for="budgetInput" class="font-bold text-stone-700">Total Anggaran (Rp)</label>
                <span class="font-mono text-amber-800 font-extrabold">{{ formatRupiah(totalBudget) }}</span>
              </div>
              <input
                id="budgetInput"
                type="range"
                v-model.number="totalBudget"
                :min="15000000"
                :max="350000000"
                :step="5000000"
                class="w-full accent-amber-600 cursor-pointer"
              />
              <div class="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>15 Jt</span>
                <span>100 Jt</span>
                <span>200 Jt</span>
                <span>350 Jt+</span>
              </div>
            </div>

            <!-- Guest Count -->
            <div class="space-y-2">
              <div class="flex justify-between items-center text-xs">
                <label for="guestInput" class="font-bold text-stone-700">Jumlah Tamu Undangan</label>
                <span class="font-mono text-stone-900 font-extrabold">{{ guestCount }} Tamu</span>
              </div>
              <input
                id="guestInput"
                type="range"
                v-model.number="guestCount"
                :min="50"
                :max="1500"
                :step="50"
                class="w-full accent-stone-900 cursor-pointer"
              />
              <div class="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>50</span>
                <span>300</span>
                <span>800</span>
                <span>1500+</span>
              </div>
            </div>

            <!-- Event Concept -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-stone-700">Konsep Pernikahan</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="c in concepts"
                  :key="c.id"
                  type="button"
                  @click="selectedConcept = c.id"
                  :class="[
                    'p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex flex-col gap-0.5',
                    selectedConcept === c.id
                      ? 'border-amber-600 bg-amber-50/60 text-amber-950 font-bold'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300',
                  ]"
                >
                  <span class="flex items-center gap-1.5">
                    <span>{{ c.icon }}</span>
                    <span>{{ c.name }}</span>
                  </span>
                  <span class="text-[10px] text-stone-400 font-normal">{{ c.desc }}</span>
                </button>
              </div>
            </div>

            <!-- Lead Magnet Trigger Button -->
            <div class="pt-3 border-t border-stone-100">
              <button
                type="button"
                @click="openLeadModal"
                class="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-amber-600/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <i class="fa-solid fa-file-arrow-down"></i>
                <span>Simpan & Kirim Rekap ke WhatsApp</span>
              </button>
              <p class="text-[10px] text-stone-400 text-center mt-2">
                100% Gratis & tanpa spam. Database kamu aman.
              </p>
            </div>
          </div>

          <!-- Right: Visual Allocations -->
          <div class="lg:col-span-7 space-y-6">
            <div class="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
                <div>
                  <h2 class="text-lg font-bold text-stone-900">Rekomendasi Alokasi Anggaran</h2>
                  <p class="text-xs text-stone-500">Estimasi pembagian pos pengeluaran berdasarkan konsep yang dipilih</p>
                </div>
                <div class="text-left sm:text-right">
                  <span class="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Per Tamu</span>
                  <p class="font-mono text-sm font-extrabold text-stone-800">
                    {{ formatRupiah(Math.round(totalBudget / Math.max(1, guestCount))) }} / tamu
                  </p>
                </div>
              </div>

              <!-- Allocation List -->
              <div class="space-y-4">
                <div
                  v-for="item in allocationBreakdown"
                  :key="item.name"
                  class="p-4 rounded-2xl border transition-all"
                  :class="item.highlight ? 'bg-amber-50/70 border-amber-300' : 'bg-stone-50/60 border-stone-200/80'"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center gap-2.5">
                      <span class="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-sm shadow-2xs">
                        {{ item.icon }}
                      </span>
                      <div>
                        <h4 class="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-1.5">
                          <span>{{ item.name }}</span>
                          <span v-if="item.highlight" class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white">
                            Paling Hemat!
                          </span>
                        </h4>
                        <p class="text-[11px] text-stone-500">{{ item.desc }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <span class="font-mono text-xs sm:text-sm font-black text-stone-900">
                        {{ formatRupiah(item.amount) }}
                      </span>
                      <p class="text-[10px] text-stone-400 font-mono">{{ item.percentage }}%</p>
                    </div>
                  </div>

                  <!-- Progress Bar -->
                  <div class="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-500"
                      :class="item.highlight ? 'bg-amber-500' : 'bg-stone-800'"
                      :style="{ width: `${item.percentage}%` }"
                    ></div>
                  </div>

                  <!-- In-line Upsell for Invitation -->
                  <div v-if="item.isInvitation" class="mt-3 pt-3 border-t border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <p class="text-amber-900 text-[11px] font-medium leading-snug">
                      💡 <strong>Tip Cerdas:</strong> Undangan cetak untuk {{ guestCount }} tamu bisa habis Rp 3 - 5 Juta. Pakai <strong>SatuUndangan.id</strong> mulai <strong>Rp 49.000</strong> sebar sepuasnya!
                    </p>
                    <router-link
                      to="/#templates"
                      class="shrink-0 text-xs font-bold text-amber-800 hover:text-amber-950 underline underline-offset-2 flex items-center gap-1"
                    >
                      Pilih Desain ↗
                    </router-link>
                  </div>
                </div>
              </div>

              <!-- Total Check -->
              <div class="p-4 bg-stone-900 text-white rounded-2xl flex justify-between items-center">
                <div>
                  <span class="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Total Anggaran Direncanakan</span>
                  <h3 class="text-lg font-black font-mono text-amber-400">{{ formatRupiah(totalBudget) }}</h3>
                </div>
                <button
                  type="button"
                  @click="openLeadModal"
                  class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-extrabold rounded-xl transition shadow-md cursor-pointer"
                >
                  Download Rekap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: Wedding Checklist -->
      <div v-show="activeTab === 'checklist'" class="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-8 animate-fade-in">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-6">
          <div>
            <h2 class="text-xl font-bold font-serif text-stone-900">Checklist Persiapan Pernikahan</h2>
            <p class="text-xs sm:text-sm text-stone-500">Timeline langkah demi langkah dari H-12 bulan hingga hari bahagia Anda.</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-stone-600">Selesai: {{ completedCount }} / {{ totalChecklistCount }}</span>
            <button
              type="button"
              @click="openLeadModal"
              class="text-xs font-bold text-amber-700 hover:text-amber-800 border border-amber-300 bg-amber-50 px-3 py-1.5 rounded-xl cursor-pointer"
            >
              <i class="fa-solid fa-file-pdf"></i> Dapatkan Versi PDF
            </button>
          </div>
        </div>

        <!-- Checklist Accordion / Timeline -->
        <div class="space-y-6">
          <div
            v-for="(phase, idx) in checklistPhases"
            :key="idx"
            class="rounded-2xl border border-stone-200 overflow-hidden"
          >
            <div class="bg-stone-50 px-5 py-3.5 border-b border-stone-200 flex items-center justify-between">
              <span class="text-xs font-black uppercase tracking-wider text-stone-700 flex items-center gap-2">
                <i class="fa-regular fa-calendar-check text-amber-600"></i>
                {{ phase.title }}
              </span>
              <span class="text-[11px] font-mono font-bold text-stone-400">
                {{ phase.items.filter(i => checklistStatus[i.id]).length }} / {{ phase.items.length }}
              </span>
            </div>

            <div class="p-4 space-y-3">
              <label
                v-for="item in phase.items"
                :key="item.id"
                class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-stone-50/80 cursor-pointer transition select-none group"
              >
                <input
                  type="checkbox"
                  v-model="checklistStatus[item.id]"
                  class="mt-1 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300 cursor-pointer"
                />
                <div class="flex-1">
                  <span
                    :class="[
                      'text-xs sm:text-sm font-medium transition',
                      checklistStatus[item.id] ? 'line-through text-stone-400' : 'text-stone-800',
                    ]"
                  >
                    {{ item.text }}
                  </span>
                  <p v-if="item.tip" class="text-[11px] text-amber-700/80 mt-0.5">{{ item.tip }}</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Lead Capture Form -->
    <Transition name="fade">
      <div
        v-if="showLeadModal"
        class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        @click.self="showLeadModal = false"
      >
        <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200 animate-scale-up" role="dialog">
          <!-- Header -->
          <div class="p-6 bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white relative">
            <button
              @click="showLeadModal = false"
              type="button"
              class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition text-sm cursor-pointer"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center text-lg mb-2">
              <i class="fa-solid fa-gift"></i>
            </div>
            <h3 class="text-lg font-bold font-serif text-white">Download Rekap & Checklist Lengkap</h3>
            <p class="text-xs text-stone-300 mt-1 leading-relaxed">
              Kami akan kirimkan rangkuman rincian anggaran pernikahan Anda langsung ke WhatsApp / Email tanpa biaya.
            </p>
          </div>

          <!-- Form or Success State -->
          <div v-if="!leadSubmitted" class="p-6 space-y-4">
            <div>
              <label for="leadName" class="block text-xs font-bold text-stone-700 mb-1">Nama Pasangan / Nama Anda</label>
              <input
                id="leadName"
                v-model="leadForm.name"
                type="text"
                placeholder="Contoh: Rian & Maya"
                class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-amber-600"
                required
              />
            </div>

            <div>
              <label for="leadWhatsApp" class="block text-xs font-bold text-stone-700 mb-1">Nomor WhatsApp Aktif</label>
              <input
                id="leadWhatsApp"
                v-model="leadForm.whatsapp"
                type="tel"
                placeholder="Contoh: 08123456789"
                class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-amber-600"
                required
              />
              <span class="text-[10px] text-stone-400">Rincian anggaran & link download checklist akan dikirim ke nomor ini</span>
            </div>

            <div>
              <label for="leadEmail" class="block text-xs font-bold text-stone-700 mb-1">Email (Opsional)</label>
              <input
                id="leadEmail"
                v-model="leadForm.email"
                type="email"
                placeholder="email@example.com"
                class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label for="leadDate" class="block text-xs font-bold text-stone-700 mb-1">Rencana Tanggal Acara (Opsional)</label>
              <input
                id="leadDate"
                v-model="leadForm.weddingDate"
                type="date"
                class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-amber-600"
              />
            </div>

            <div v-if="leadError" class="text-xs text-rose-600 font-medium">
              {{ leadError }}
            </div>

            <button
              type="button"
              :disabled="submittingLead || !leadForm.name || !leadForm.whatsapp"
              @click="submitLeadForm"
              class="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <i v-if="submittingLead" class="fa-solid fa-circle-notch animate-spin"></i>
              <span v-else>Kirim Rincian Budget Sekarang</span>
            </button>
          </div>

          <!-- Success Screen -->
          <div v-else class="p-6 text-center space-y-4">
            <div class="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              <i class="fa-solid fa-check"></i>
            </div>
            <div>
              <h4 class="text-base font-bold text-stone-900">Terima Kasih, {{ leadForm.name }}!</h4>
              <p class="text-xs text-stone-500 mt-1 leading-relaxed">
                Rincian kalkulasi anggaran pernikahan Anda berhasil disimpan. Anda juga dapat langsung membagikan hasil ini ke pasangan Anda via WhatsApp.
              </p>
            </div>

            <a
              :href="whatsappShareUrl"
              target="_blank"
              class="block w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 text-center"
            >
              <i class="fa-brands fa-whatsapp text-base"></i>
              <span>Buka Rekap di WhatsApp</span>
            </a>

            <button
              @click="showLeadModal = false"
              type="button"
              class="w-full py-2.5 text-xs font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Footer -->
    <footer class="bg-white border-t border-stone-200 py-6 text-center text-xs text-stone-500">
      <div class="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© 2026 SatuUndangan.id — Platform Undangan Pernikahan Digital Eksklusif</span>
        <div class="flex items-center gap-4">
          <router-link to="/#features" class="hover:text-stone-800">Fitur</router-link>
          <router-link to="/#pricing" class="hover:text-stone-800">Harga</router-link>
          <router-link to="/#templates" class="hover:text-stone-800">Template</router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { submitLead } from '@/api/lead'

const activeTab = ref('calculator')
const totalBudget = ref(60000000)
const guestCount = ref(300)
const selectedConcept = ref('modern')

const showLeadModal = ref(false)
const submittingLead = ref(false)
const leadSubmitted = ref(false)
const leadError = ref('')

const leadForm = reactive({
  name: '',
  whatsapp: '',
  email: '',
  weddingDate: '',
})

const concepts = [
  { id: 'intimate', name: 'Intimate Wedding', desc: 'Fokus ke keluarga & sahabat dekat', icon: '🌿' },
  { id: 'modern', name: 'Modern Minimalis', desc: 'Elegan, praktis, efisien', icon: '✨' },
  { id: 'traditional', name: 'Tradisional Adat', desc: 'Rangkaian upacara & prosesi lengkap', icon: '👑' },
  { id: 'outdoor', name: 'Semi-Outdoor / Garden', desc: 'Suasana asri & santai', icon: '🌸' },
]

const allocationBreakdown = computed(() => {
  const budget = totalBudget.value
  let cateringPct = 42
  let decorPct = 20
  let docPct = 10
  let invPct = 5
  let attirePct = 10
  let mcPct = 5
  let contingencyPct = 8

  if (selectedConcept.value === 'traditional') {
    cateringPct = 38
    decorPct = 22
    attirePct = 14
    invPct = 4
    contingencyPct = 12
  } else if (selectedConcept.value === 'intimate') {
    cateringPct = 48
    decorPct = 16
    attirePct = 8
    invPct = 4
    contingencyPct = 14
  } else if (selectedConcept.value === 'outdoor') {
    cateringPct = 40
    decorPct = 24
    mcPct = 8
    invPct = 4
    contingencyPct = 14
  }

  return [
    {
      name: 'Katering & Gedung / Venue',
      desc: 'Sewa tempat resepsi & menu makanan per tamu',
      percentage: cateringPct,
      amount: Math.round(budget * (cateringPct / 100)),
      icon: '🍽️',
    },
    {
      name: 'Dekorasi & Tata Panggung',
      desc: 'Pelaminan, lorong masuk, bunga, & pencahayaan',
      percentage: decorPct,
      amount: Math.round(budget * (decorPct / 100)),
      icon: '💐',
    },
    {
      name: 'Busana Pengantin & Tata Rias (MUA)',
      desc: 'Baju akad/resepsi kedua mempelai & orang tua',
      percentage: attirePct,
      amount: Math.round(budget * (attirePct / 100)),
      icon: '👗',
    },
    {
      name: 'Dokumentasi Foto & Video Cinematic',
      desc: 'Fotografer hari H, video teaser, & album kenangan',
      percentage: docPct,
      amount: Math.round(budget * (docPct / 100)),
      icon: '📸',
    },
    {
      name: 'Undangan Digital & Souvenir',
      desc: 'Website undangan tamu tanpa batas & cinderamata',
      percentage: invPct,
      amount: Math.round(budget * (invPct / 100)),
      icon: '💌',
      highlight: true,
      isInvitation: true,
    },
    {
      name: 'Hiburan, MC & Sound System',
      desc: 'Master of ceremony, band akustik / musik pengiring',
      percentage: mcPct,
      amount: Math.round(budget * (mcPct / 100)),
      icon: '🎤',
    },
    {
      name: 'Dana Darurat / Cadangan Tak Terduga',
      desc: 'Antisipasi kelebihan porsi atau kebutuhan mendadak',
      percentage: contingencyPct,
      amount: Math.round(budget * (contingencyPct / 100)),
      icon: '🛡️',
    },
  ]
})

const checklistPhases = [
  {
    title: 'Fase 1: H-12 s/d H-9 Bulan (Pondasi Acara)',
    items: [
      { id: 'c1', text: 'Tentukan perkiraan tanggal pernikahan & diskusikan dengan kedua keluarga' },
      { id: 'c2', text: 'Tentukan total budget & estimasi jumlah tamu undangan' },
      { id: 'c3', text: 'Survei dan booking venue / gedung pernikahan' },
      { id: 'c4', text: 'Pilih konsep pernikahan (Modern / Adat / Intimate)' },
    ],
  },
  {
    title: 'Fase 2: H-6 s/d H-4 Bulan (Vendor Inti)',
    items: [
      { id: 'c5', text: 'Booking Vendor Katering & lakukan sesi food testing' },
      { id: 'c6', text: 'Booking MUA (Make Up Artist) & fitting gaun/kebaya pengantin' },
      { id: 'c7', text: 'Booking Fotografer & Videografer prewedding dan hari-H' },
      { id: 'c8', text: 'Lakukan sesi foto prewedding untuk galeri undangan' },
    ],
  },
  {
    title: 'Fase 3: H-3 s/d H-2 Bulan (Undangan & Souvenir)',
    items: [
      { id: 'c9', text: 'Buat Undangan Digital Eksklusif di SatuUndangan.id', tip: 'Fitur WhatsApp bulk generator memudahkan sebar ratusan undangan dalam 5 menit.' },
      { id: 'c10', text: 'Susun daftar nama & nomor WhatsApp tamu undangan' },
      { id: 'c11', text: 'Pesan souvenir pernikahan & seragam keluarga' },
      { id: 'c12', text: 'Urus berkas administrasi KUA atau Catatan Sipil' },
    ],
  },
  {
    title: 'Fase 4: H-1 Bulan s/d Hari H (Pelaksanaan & Finishing)',
    items: [
      { id: 'c13', text: 'Kirim undangan digital personal via WhatsApp ke seluruh tamu' },
      { id: 'c14', text: 'Pantau konfirmasi kehadiran (RSVP) real-time di Dashboard SatuUndangan' },
      { id: 'c15', text: 'Technical meeting dengan seluruh vendor & keluarga' },
      { id: 'c16', text: 'Gladi resik prosesi acara & istirahat cukup menjelang hari H' },
    ],
  },
]

const checklistStatus = reactive({
  c1: true,
  c2: true,
  c9: false,
})

const totalChecklistCount = computed(() => {
  return checklistPhases.reduce((acc, p) => acc + p.items.length, 0)
})

const completedCount = computed(() => {
  return Object.values(checklistStatus).filter(Boolean).length
})

function formatRupiah(num) {
  if (!num) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num)
}

function openLeadModal() {
  leadSubmitted.value = false
  leadError.value = ''
  showLeadModal.value = true
}

async function submitLeadForm() {
  if (!leadForm.name || !leadForm.whatsapp) {
    leadError.value = 'Mohon isi nama dan nomor WhatsApp Anda'
    return
  }

  submittingLead.value = true
  leadError.value = ''
  try {
    await submitLead({
      name: leadForm.name,
      whatsapp: leadForm.whatsapp,
      email: leadForm.email || undefined,
      weddingDate: leadForm.weddingDate || undefined,
      estimatedBudget: totalBudget.value,
      guestCount: guestCount.value,
      concept: selectedConcept.value,
      breakdown: {
        totalBudget: totalBudget.value,
        guestCount: guestCount.value,
        allocations: allocationBreakdown.value.map(a => ({ name: a.name, amount: a.amount, pct: a.percentage })),
      },
      source: 'budget_calculator',
    })
    leadSubmitted.value = true
  } catch (err) {
    console.error('Gagal simpan lead:', err)
    // Tetap tandai submitted agar user experience tidak terhambat
    leadSubmitted.value = true
  } finally {
    submittingLead.value = false
  }
}

const whatsappShareUrl = computed(() => {
  const text = encodeURIComponent(
    `Halo! Ini perkiraan budget pernikahan kami:\n` +
    `💰 Total Anggaran: ${formatRupiah(totalBudget.value)}\n` +
    `👥 Estimasi Tamu: ${guestCount.value} orang\n` +
    `✨ Konsep: ${concepts.find(c => c.id === selectedConcept.value)?.name}\n\n` +
    `Dihitung otomatis via Kalkulator SatuUndangan.id (https://satuundangan.id/kalkulator-budget)`
  )
  return `https://wa.me/?text=${text}`
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
