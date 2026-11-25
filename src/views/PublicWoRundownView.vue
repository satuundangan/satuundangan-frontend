<template>
  <div class="min-h-screen bg-[#FAF8F5] text-stone-800 print:bg-white">
    <!-- Top Editorial Bar -->
    <header class="border-b border-stone-200/80 bg-[#FAF8F5]/95 backdrop-blur-sm sticky top-0 z-20 no-print">
      <div class="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
        <div class="min-w-0">
          <p class="text-[11px] uppercase tracking-[0.2em] text-stone-400 font-medium">
            Technical Rundown Panitia & WO
          </p>
          <h1 class="font-serif text-lg sm:text-xl text-stone-900 truncate">
            Jadwal Teknis Hari-H
          </h1>
        </div>
        <button
          v-if="!loading && !loadError"
          type="button"
          @click="handlePrint"
          class="shrink-0 inline-flex items-center gap-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium px-4 py-2 transition-colors cursor-pointer"
        >
          <i class="fa-solid fa-print text-[11px]"></i>
          <span>Cetak / Simpan PDF</span>
        </button>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-5 py-7 space-y-8">
      <div v-if="loading" class="py-16 text-center space-y-3">
        <i class="fa-solid fa-circle-notch animate-spin text-xl text-stone-400"></i>
        <p class="text-sm text-stone-500">Memuat rundown teknis...</p>
      </div>

      <div
        v-else-if="loadError"
        class="bg-white border border-stone-200/80 rounded-2xl p-8 text-center space-y-3"
      >
        <i class="fa-regular fa-calendar-xmark text-2xl text-stone-400"></i>
        <h2 class="font-serif text-xl text-stone-900">Tautan Tidak Tersedia</h2>
        <p class="text-sm text-stone-500 max-w-sm mx-auto">
          {{ loadError }}
        </p>
      </div>

      <template v-else>
        <!-- Event Summary Card -->
        <section class="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p class="text-[11px] uppercase tracking-[0.16em] text-stone-400 font-medium">
              Tanggal Acara
            </p>
            <p class="text-sm font-semibold text-stone-900 mt-1 tabular-nums">
              {{ formattedDate }}
            </p>
          </div>
          <div>
            <p class="text-[11px] uppercase tracking-[0.16em] text-stone-400 font-medium">
              Konsep Pernikahan
            </p>
            <p class="text-sm font-semibold text-stone-900 mt-1">
              {{ data.weddingConcept || 'Standar Nasional / Adat' }}
            </p>
          </div>
          <div>
            <p class="text-[11px] uppercase tracking-[0.16em] text-stone-400 font-medium">
              Estimasi Tamu
            </p>
            <p class="text-sm font-semibold text-stone-900 mt-1 tabular-nums">
              {{ data.estimatedGuests || 0 }} Orang
            </p>
          </div>
        </section>

        <!-- Technical Rundown Timeline -->
        <section class="bg-white border border-stone-200/80 rounded-2xl overflow-hidden">
          <div class="px-5 py-4 border-b border-stone-200/80 bg-[#FAF8F5]/70 flex items-center justify-between">
            <h2 class="font-serif text-lg text-stone-900">
              Susunan Acara Jam-ke-Jam
            </h2>
            <span class="text-xs text-stone-500 tabular-nums">
              {{ rundownList.length }} sesi
            </span>
          </div>

          <div v-if="rundownList.length === 0" class="p-8 text-center text-sm text-stone-500">
            Belum ada sesi rundown yang ditambahkan.
          </div>

          <div v-else class="divide-y divide-stone-100">
            <div
              v-for="(item, idx) in rundownList"
              :key="item.id || idx"
              class="p-4 sm:px-5 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-start"
            >
              <div class="sm:col-span-2 font-mono text-xs font-semibold text-stone-900 tabular-nums pt-0.5">
                {{ item.time || '-' }}
              </div>
              <div class="sm:col-span-5 space-y-0.5">
                <p class="text-sm font-semibold text-stone-900">
                  {{ item.activity || '-' }}
                </p>
                <p v-if="item.notes" class="text-xs text-stone-500 leading-relaxed">
                  {{ item.notes }}
                </p>
              </div>
              <div class="sm:col-span-3 text-xs text-stone-600">
                <span class="sm:hidden font-medium text-stone-400 mr-1">Lokasi:</span>
                {{ item.location || '-' }}
              </div>
              <div class="sm:col-span-2 text-xs font-medium text-stone-800">
                <span class="sm:hidden font-medium text-stone-400 mr-1">PIC:</span>
                {{ item.pic || '-' }}
              </div>
            </div>
          </div>
        </section>

        <!-- Vendor PIC Directory (No Financial Info) -->
        <section v-if="vendorList.length > 0" class="space-y-3">
          <div class="flex items-baseline justify-between border-b border-stone-200/80 pb-2.5">
            <h2 class="font-serif text-lg text-stone-900">
              Kontak PIC Vendor
            </h2>
            <span class="text-xs text-stone-500 tabular-nums">
              {{ vendorList.length }} vendor
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <article
              v-for="v in vendorList"
              :key="v.id"
              class="bg-white border border-stone-200/80 rounded-xl p-4 space-y-1.5"
            >
              <p class="text-[10px] uppercase tracking-[0.16em] text-stone-400 font-semibold">
                {{ v.category }}
              </p>
              <h3 class="text-sm font-semibold text-stone-900">
                {{ v.name }}
              </h3>
              <p v-if="v.picName" class="text-xs text-stone-600">
                PIC: {{ v.picName }}
              </p>
              <p v-if="v.phoneNumber" class="text-xs font-mono text-stone-800 tabular-nums">
                {{ v.phoneNumber }}
              </p>
              <p v-if="v.notes" class="text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                {{ v.notes }}
              </p>
            </article>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getPublicWoRundown } from '@/api/weddingPlanner'

const route = useRoute()
const token = computed(() => String(route.params.token || ''))

const loading = ref(true)
const loadError = ref('')
const data = ref({
  weddingDate: null,
  weddingConcept: '',
  estimatedGuests: 0,
  rundown: [],
  vendors: [],
})

const rundownList = computed(() => (Array.isArray(data.value?.rundown) ? data.value.rundown : []))
const vendorList = computed(() => (Array.isArray(data.value?.vendors) ? data.value.vendors : []))

const formattedDate = computed(() => {
  if (!data.value?.weddingDate) return 'Belum ditentukan'
  try {
    return new Date(data.value.weddingDate).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return data.value.weddingDate
  }
})

function handlePrint() {
  window.print()
}

async function fetchRundown() {
  if (!token.value) {
    loadError.value = 'Token rundown tidak valid.'
    loading.value = false
    return
  }

  loading.value = true
  loadError.value = ''
  try {
    const res = await getPublicWoRundown(token.value)
    data.value = res || {}
  } catch (err) {
    loadError.value = err?.message || 'Rundown teknis tidak ditemukan.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchRundown)
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
