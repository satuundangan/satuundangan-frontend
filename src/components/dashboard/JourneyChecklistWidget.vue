<template>
  <div 
    data-tour="dashboard-journey-checklist"
    class="bg-white rounded-2xl md:rounded-3xl border border-amber-100/90 p-5 md:p-6 shadow-xs relative overflow-hidden transition-all duration-300"
    :class="{ 'ring-1 ring-amber-200/50': !isCollapsed && progressPercentage < 100 }"
  >
    <!-- Background subtle decoration -->
    <div class="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br from-amber-100/40 to-transparent pointer-events-none blur-xl"></div>

    <!-- Header Section -->
    <div class="relative z-10 flex flex-col gap-4">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3.5 min-w-0">
          <div 
            class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-colors"
            :class="progressPercentage === 100 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' : 'bg-gradient-to-br from-amber-50 to-amber-100 text-[#a47148] border border-amber-200/60'"
          >
            <i :class="progressPercentage === 100 ? 'fa-solid fa-circle-check text-lg' : 'fa-solid fa-list-check text-base'"></i>
          </div>

          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-sm md:text-base font-extrabold text-slate-900 tracking-tight">
                Panduan Persiapan Undangan
              </h3>
              <span 
                class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-colors"
                :class="progressBadgeClass"
              >
                {{ completedCount }}/{{ steps.length }} Selesai
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5 line-clamp-1">
              {{ motivationMessage }}
            </p>
          </div>
        </div>

        <!-- Action / Toggle Controls -->
        <div class="flex items-center gap-2 shrink-0">
          <div class="text-right hidden sm:block">
            <span class="text-xs font-black text-slate-800">{{ progressPercentage }}%</span>
            <span class="text-[10px] text-slate-400 block font-medium">Progres</span>
          </div>

          <button 
            type="button"
            data-test="collapse-btn"
            @click="toggleCollapse"
            class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            :title="isCollapsed ? 'Buka panduan langkah' : 'Ciutkan panduan langkah'"
            :aria-label="isCollapsed ? 'Buka panduan langkah' : 'Ciutkan panduan langkah'"
          >
            <i 
              class="fa-solid fa-chevron-up text-xs transition-transform duration-300"
              :class="{ 'rotate-180': isCollapsed }"
            ></i>
          </button>
        </div>
      </div>

      <!-- Linear Progress Bar -->
      <div class="space-y-1">
        <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex items-center p-0.5">
          <div 
            class="h-full rounded-full transition-all duration-700 ease-out"
            :class="progressPercentage === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 via-[#a47148] to-emerald-500'"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
        <div class="flex justify-between items-center text-[10px] text-slate-400 sm:hidden">
          <span>Progres Anda</span>
          <span class="font-bold text-slate-700">{{ progressPercentage }}%</span>
        </div>
      </div>
    </div>

    <!-- Collapsible Step Cards Grid -->
    <div 
      v-show="!isCollapsed" 
      data-test="steps-grid"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 relative z-10"
    >
      <div 
        v-for="(step, index) in steps" 
        :key="step.id"
        class="rounded-2xl p-4 transition-all flex flex-col justify-between border"
        :class="getStepCardClass(step, index)"
      >
        <div>
          <!-- Step Top Header -->
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="text-[10px] font-black uppercase tracking-wider" :class="step.completed ? 'text-emerald-700' : isCurrentStep(index) ? 'text-amber-800' : 'text-slate-400'">
              Langkah {{ index + 1 }}
            </span>
            
            <div 
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-transform"
              :class="step.completed ? 'bg-emerald-600 text-white' : isCurrentStep(index) ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-200 text-slate-500'"
            >
              <i v-if="step.completed" class="fa-solid fa-check text-[11px]"></i>
              <span v-else>{{ index + 1 }}</span>
            </div>
          </div>

          <!-- Step Title & Description -->
          <h4 class="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
            <i :class="[step.icon, step.completed ? 'text-emerald-600' : 'text-slate-400']" class="text-[11px]"></i>
            <span>{{ step.title }}</span>
          </h4>
          <p class="text-[11px] leading-relaxed mb-3" :class="step.completed ? 'text-emerald-700/90 font-medium' : 'text-slate-500'">
            {{ step.statusText }}
          </p>
        </div>

        <!-- Action Button -->
        <router-link 
          :to="step.actionTo" 
          class="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl text-xs font-bold transition-all text-center"
          :class="getStepButtonClass(step, index)"
        >
          <span>{{ step.actionLabel }}</span>
          <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  invitations: {
    type: Array,
    default: () => []
  },
  stats: {
    type: Object,
    default: () => ({ guests: 0, total: 0, attending: 0, responses: 0 })
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const STORAGE_KEY = 'satuundangan_journey_collapsed'
const isCollapsed = ref(false)

const latestInvitation = computed(() => {
  if (Array.isArray(props.invitations) && props.invitations.length > 0) {
    return props.invitations[0]
  }
  return null
})

// Step 1: Pilih Desain Template
const step1Completed = computed(() => {
  return Array.isArray(props.invitations) && props.invitations.length > 0
})

// Step 2: Lengkapi Data Mempelai
const step2Completed = computed(() => {
  const inv = latestInvitation.value
  if (!inv) return false
  const groom = (inv.groomName || inv.groom_name || '').trim()
  const bride = (inv.brideName || inv.bride_name || '').trim()
  return Boolean(groom && bride)
})

// Step 3: Masukkan Daftar Tamu
const step3Completed = computed(() => {
  return Number(props.stats?.guests || 0) > 0
})

// Step 4: Uji Coba & Sebar Undangan
const step4Completed = computed(() => {
  const inv = latestInvitation.value
  if (!inv) return false
  return Boolean(
    inv.isPublished || 
    inv.paymentStatus === 'settled' || 
    inv.latestPaymentStatus === 'settled'
  )
})

const steps = computed(() => {
  const inv = latestInvitation.value
  const invId = inv?.id

  // Step 1 Status Text
  let s1Text = 'Pilih desain tema pernikahan yang kamu sukai.'
  if (step1Completed.value) {
    s1Text = inv?.title || inv?.templateName || 'Desain tema telah dipilih'
  }

  // Step 2 Status Text
  let s2Text = 'Isi nama calon mempelai dan detail akad/resepsi.'
  if (step2Completed.value) {
    const groom = (inv.groomName || inv.groom_name || '').trim()
    const bride = (inv.brideName || inv.bride_name || '').trim()
    s2Text = `${groom} & ${bride}`
  }

  // Step 3 Status Text
  let s3Text = 'Masukkan daftar tamu untuk sebar via WhatsApp.'
  if (step3Completed.value) {
    s3Text = `${props.stats?.guests || 0} tamu telah didaftarkan`
  }

  // Step 4 Status Text
  let s4Text = 'Aktifkan paket undangan dan bagikan ke kerabat.'
  if (step4Completed.value) {
    s4Text = 'Undangan sudah aktif & siap disebarkan'
  }

  return [
    {
      id: 'template',
      title: 'Pilih Desain',
      completed: step1Completed.value,
      icon: 'fa-solid fa-wand-magic-sparkles',
      statusText: s1Text,
      actionLabel: step1Completed.value ? 'Ganti Desain' : 'Pilih Desain',
      actionTo: '/templates'
    },
    {
      id: 'couple_info',
      title: 'Data Mempelai',
      completed: step2Completed.value,
      icon: 'fa-solid fa-heart',
      statusText: s2Text,
      actionLabel: step2Completed.value ? 'Ubah Data' : 'Lengkapi Data',
      actionTo: invId ? `/invitation/${invId}/edit` : '/templates'
    },
    {
      id: 'guests',
      title: 'Daftar Tamu',
      completed: step3Completed.value,
      icon: 'fa-solid fa-users',
      statusText: s3Text,
      actionLabel: step3Completed.value ? 'Kelola Tamu' : 'Tambah Tamu',
      actionTo: invId ? `/guests?invitationId=${invId}` : '/guests'
    },
    {
      id: 'distribute',
      title: 'Sebar Undangan',
      completed: step4Completed.value,
      icon: 'fa-solid fa-paper-plane',
      statusText: s4Text,
      actionLabel: step4Completed.value ? 'Sebar WhatsApp' : 'Uji & Sebar',
      actionTo: invId ? `/guests?invitationId=${invId}` : '/templates'
    }
  ]
})

const completedCount = computed(() => {
  return steps.value.filter(s => s.completed).length
})

const progressPercentage = computed(() => {
  return Math.round((completedCount.value / steps.value.length) * 100)
})

const motivationMessage = computed(() => {
  const pct = progressPercentage.value
  if (pct === 100) {
    return 'Luar biasa! Undangan digitalmu siap disebarkan ke keluarga dan sahabat 🎉'
  }
  if (pct >= 75) {
    return 'Hampir selesai! Tambahkan daftar tamu terdekat untuk disapa via WhatsApp.'
  }
  if (pct >= 50) {
    return 'Bagus sekali! Lengkapi detail kedua mempelai dan tanggal bahagia kalian.'
  }
  if (pct >= 25) {
    return 'Desain sudah dipilih! Lanjutkan pengisian informasi kedua mempelai.'
  }
  return 'Yuk mulai perjalanan pernikahan impianmu! Pilih desain favorit terlebih dahulu.'
})

const progressBadgeClass = computed(() => {
  if (progressPercentage.value === 100) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }
  if (completedCount.value > 0) {
    return 'bg-amber-50 text-amber-700 border-amber-200'
  }
  return 'bg-slate-100 text-slate-500 border-slate-200'
})

function isCurrentStep(index) {
  // The first uncompleted step is the current step
  const firstUnfinishedIdx = steps.value.findIndex(s => !s.completed)
  return firstUnfinishedIdx === index
}

function getStepCardClass(step, index) {
  if (step.completed) {
    return 'bg-emerald-50/40 border-emerald-100/90'
  }
  if (isCurrentStep(index)) {
    return 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-500/10 shadow-xs'
  }
  return 'bg-slate-50/50 border-slate-100'
}

function getStepButtonClass(step, index) {
  if (step.completed) {
    return 'bg-emerald-100/70 hover:bg-emerald-200/80 text-emerald-800'
  }
  if (isCurrentStep(index)) {
    return 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
  }
  return 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
}

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
  try {
    localStorage.setItem(STORAGE_KEY, String(isCollapsed.value))
  } catch (e) {
    // Ignore localStorage errors (e.g. quota or sandbox)
  }
}

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) {
      isCollapsed.value = saved === 'true'
    } else if (progressPercentage.value === 100) {
      // Default to collapsed when 100% completed so experienced users have a clean dashboard
      isCollapsed.value = true
    }
  } catch (e) {
    // Ignore localStorage errors
  }
})
</script>
