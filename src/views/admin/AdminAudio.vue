<template>
  <AdminShell
    title="Audio & Musik"
    description="Kelola starter pack musik latar untuk invitation wedding"
    show-search
    :search="search"
    search-placeholder="Cari judul atau kategori musik"
    action-label="Tambah Musik"
    @update:search="handleSearch"
    @action="openCreate"
  >
    <!-- Welcome / Preset Section -->
    <section class="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="flex flex-col lg:flex-row">
        <div class="flex-1 p-6 md:p-8">
          <div class="flex items-center gap-3 mb-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
            </div>
            <h2 class="text-xl font-bold text-slate-900">Starter Pack Wedding Audio</h2>
          </div>
          <p class="max-w-2xl text-slate-600 leading-relaxed">
            Import katalog musik wedding yang sudah dikelompokkan per nuansa acara. 
            Mulai dari nuansa <span class="font-semibold text-rose-500">Romantic</span> untuk Aisle, 
            hingga <span class="font-semibold text-amber-600">Acoustic</span> untuk Garden Party.
          </p>

          <div class="mt-6 flex flex-wrap gap-2">
            <span
              v-for="option in categoryOptions"
              :key="option.value"
              class="inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-105"
              :class="option.badgeClass"
            >
              {{ option.label }}
            </span>
          </div>
        </div>
        <div class="flex items-center justify-center border-t border-slate-100 bg-slate-50/50 p-6 lg:w-72 lg:border-l lg:border-t-0">
          <button
            type="button"
            class="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="seeding"
            @click="importWeddingPresets"
          >
            <span v-if="seeding" class="flex items-center gap-2">
              <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Mengimpor…
            </span>
            <span v-else class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Import Presets
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- Stats Summary -->
    <section class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <article
        v-for="option in categoryOptions"
        :key="option.value"
        class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-sm"
      >
        <div class="relative z-10 flex items-center justify-between">
          <div class="h-8 w-8 rounded-lg flex items-center justify-center" :class="option.badgeClass.split(' ').slice(1, 3).join(' ')">
             <i class="fa-solid fa-music text-[10px]"></i>
          </div>
          <span class="text-xl font-black text-slate-900">{{ categoryCounts[option.value] || 0 }}</span>
        </div>
        <div class="mt-3">
          <h3 class="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-900 transition-colors">{{ option.label }}</h3>
        </div>
        <!-- Decorative background icon -->
        <i class="fa-solid fa-compact-disc absolute -bottom-2 -right-2 text-4xl opacity-[0.03] transition-transform group-hover:rotate-90"></i>
      </article>
    </section>

    <!-- Main List -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      <!-- Loading Skeleton -->
      <template v-if="loading">
        <div v-for="i in 6" :key="i" class="animate-pulse rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div class="flex items-center gap-4 mb-6">
            <div class="h-12 w-12 rounded-2xl bg-slate-100"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 w-3/4 rounded bg-slate-100"></div>
              <div class="h-3 w-1/4 rounded bg-slate-50"></div>
            </div>
          </div>
          <div class="h-10 w-full rounded-xl bg-slate-50"></div>
        </div>
      </template>

      <!-- Audio Cards -->
      <template v-else>
        <div
          v-for="track in filteredAudios"
          :key="track.id"
          class="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50"
        >
          <div class="flex items-start justify-between gap-4 mb-6">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <span
                  class="inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  :class="getCategoryMeta(track.category).badgeClass"
                >
                  {{ getCategoryMeta(track.category).label }}
                </span>
              </div>
              <h3 class="truncate text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors" :title="track.title">
                {{ track.title }}
              </h3>
              <p class="mt-1 line-clamp-1 text-xs text-slate-400 font-medium">
                {{ getCategoryMeta(track.category).description }}
              </p>
            </div>
            
            <div class="flex flex-col gap-2">
              <button
                type="button"
                class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500"
                title="Hapus"
                @click="confirmDelete(track)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>

          <!-- Custom Audio Player Feel -->
          <div class="relative mt-auto">
            <div class="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-100 transition-all group-hover:bg-white group-hover:ring-slate-200">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm transition-transform group-hover:scale-110">
                <i class="fa-solid fa-play text-slate-400 group-hover:text-indigo-600"></i>
              </div>
              <div class="flex-1 overflow-hidden">
                <audio 
                  controls 
                  class="h-8 w-full opacity-80"
                  @play="handlePlay($event)"
                >
                  <source :src="track.url" type="audio/mpeg">
                </audio>
              </div>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
             <span class="text-[10px] font-mono text-slate-300 truncate pr-4">{{ track.url }}</span>
             <button @click="copyLink(track.url)" class="shrink-0 text-[10px] font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-700">Copy Link</button>
          </div>
        </div>
      </template>

      <!-- Empty State -->
      <div v-if="!loading && !filteredAudios.length" class="col-span-full py-20 flex flex-col items-center justify-center text-center">
        <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 text-slate-200">
           <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
        </div>
        <h3 class="text-lg font-bold text-slate-900">Belum ada musik</h3>
        <p class="mt-2 max-w-xs text-sm text-slate-500">
          {{ audios.length ? "Tidak ada musik yang cocok dengan pencarian." : "Gunakan preset wedding atau tambahkan manual musik favoritmu." }}
        </p>
        <button 
          v-if="!audios.length"
          @click="importWeddingPresets" 
          class="mt-6 font-bold text-sm text-indigo-600 hover:text-indigo-800"
        >
          Import Preset Sekarang →
        </button>
      </div>
    </div>

    <!-- Create Modal -->
    <Transition name="modal">
      <div v-if="showForm" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closeForm"></div>
        
        <!-- Modal Content -->
        <div class="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white shadow-2xl transition-all">
          <div class="bg-indigo-600 p-8 text-white">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-2xl font-black">Tambah Musik</h2>
              <button class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95" @click="closeForm">
                 <i class="fa-solid fa-times"></i>
              </button>
            </div>
            <p class="text-indigo-100 text-sm opacity-80">Gunakan kategori yang paling pas dengan nuansa wedding.</p>
          </div>

          <form class="p-8 space-y-6" @submit.prevent="submitForm">
            <div>
              <label class="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Judul Musik</label>
              <input
                v-model="form.title"
                type="text"
                placeholder="Contoh: A Thousand Years - Piano"
                class="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-indigo-100 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                required
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
               <div>
                  <label class="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Kategori</label>
                  <select
                    v-model="form.category"
                    class="w-full appearance-none rounded-2xl border-2 border-slate-50 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-indigo-100 focus:bg-white"
                  >
                    <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
               </div>
               <div>
                  <label class="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Format</label>
                  <div class="w-full rounded-2xl bg-slate-50 px-5 py-4 text-sm font-bold text-slate-400">
                     MP3 Audio
                  </div>
               </div>
            </div>

            <!-- Upload Zone -->
            <div>
              <label class="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">File Audio</label>
              <div 
                class="group relative flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 transition-all hover:border-indigo-300 hover:bg-indigo-50/30"
                :class="{ 'border-indigo-400 bg-indigo-50': uploadingFile }"
              >
                <input
                  type="file"
                  accept="audio/mpeg, audio/mp3"
                  class="absolute inset-0 z-10 cursor-pointer opacity-0"
                  @change="handleFileChange"
                />
                
                <div v-if="uploadingFile" class="text-center">
                   <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl">
                      <svg class="h-8 w-8 animate-spin text-indigo-600" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   </div>
                   <p class="text-sm font-black text-indigo-600 uppercase tracking-widest">Uploading...</p>
                   <p class="mt-1 text-xs text-slate-400">Sedang mengirim file ke R2 Storage</p>
                </div>
                
                <div v-else-if="form.url" class="text-center">
                   <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-200">
                      <i class="fa-solid fa-check text-2xl"></i>
                   </div>
                   <p class="text-sm font-black text-emerald-600 uppercase tracking-widest">File Ready</p>
                   <p class="mt-1 text-[10px] text-slate-400 truncate max-w-[200px]">{{ form.url.split("/").pop() }}</p>
                </div>

                <div v-else class="text-center">
                   <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm transition-all group-hover:scale-110 group-hover:text-indigo-400 group-hover:shadow-md">
                      <i class="fa-solid fa-cloud-arrow-up text-2xl"></i>
                   </div>
                   <p class="text-sm font-black text-slate-900 uppercase tracking-widest">Pilih File MP3</p>
                   <p class="mt-1 text-xs text-slate-400">Klik atau drag audio ke sini</p>
                </div>
              </div>
            </div>

            <div class="flex gap-4 pt-4">
              <button 
                type="button" 
                class="flex-1 rounded-2xl border-2 border-slate-100 py-4 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50 active:scale-95" 
                @click="closeForm"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="saving || uploadingFile || !form.url"
                class="flex-[2] rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ saving ? 'Menyimpan…' : 'Simpan Musik' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </AdminShell>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import AdminShell from '@/components/admin/AdminShell.vue'
import { fetchAdminAudio, createAdminAudio, deleteAdminAudio } from '@/api/master.js'
import { uploadFileApi } from '@/api/file.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const CATEGORY_OPTIONS = [
  {
    value: 'romantic',
    label: 'Romantic Aisle',
    description: 'Lembut dan emosional untuk opening, aisle, dan first look.',
    badgeClass: 'border-rose-100 bg-rose-50 text-rose-600',
  },
  {
    value: 'acoustic',
    label: 'Acoustic Morning',
    description: 'Hangat dan ringan untuk intimate wedding atau garden party.',
    badgeClass: 'border-amber-100 bg-amber-50 text-amber-600',
  },
  {
    value: 'elegant',
    label: 'Elegant First Dance',
    description: 'Lebih megah untuk ballroom, dinner, dan first dance.',
    badgeClass: 'border-indigo-100 bg-indigo-50 text-indigo-600',
  },
  {
    value: 'sacred',
    label: 'Sacred Ceremony',
    description: 'Tenang dan khidmat untuk akad, blessing, atau pemberkatan.',
    badgeClass: 'border-emerald-100 bg-emerald-50 text-emerald-600',
  },
  {
    value: 'warm',
    label: 'Warm Reception',
    description: 'Sedikit lebih penuh untuk resepsi santai dan momen kumpul keluarga.',
    badgeClass: 'border-orange-100 bg-orange-50 text-orange-600',
  },
  {
    value: 'instrumental',
    label: 'Instrumental Garden',
    description: 'Netral dan ringan untuk outdoor wedding serta slideshow galeri.',
    badgeClass: 'border-sky-100 bg-sky-50 text-sky-600',
  },
]

const WEDDING_AUDIO_PRESETS = [
  { title: 'Romantic Aisle Glow', category: 'romantic', url: '/audio/wedding-romantic-aisle.mp3' },
  { title: 'Acoustic Morning Promise', category: 'acoustic', url: '/audio/wedding-acoustic-morning.mp3' },
  { title: 'Elegant First Dance Reverie', category: 'elegant', url: '/audio/wedding-elegant-firstdance.mp3' },
  { title: 'Sacred Ceremony Bloom', category: 'sacred', url: '/audio/wedding-sacred-ceremony.mp3' },
  { title: 'Warm Reception Serenade', category: 'warm', url: '/audio/wedding-warm-reception.mp3' },
  { title: 'Instrumental Garden Breeze', category: 'instrumental', url: '/audio/wedding-instrumental-garden.mp3' },
]

const toast = useToast()
const audios = ref([])
const search = ref('')
const loading = ref(false)
const showForm = ref(false)
const saving = ref(false)
const uploadingFile = ref(false)
const seeding = ref(false)
const currentPlayingAudio = ref(null)

const form = reactive({ title: '', category: 'romantic', url: '' })
const categoryOptions = CATEGORY_OPTIONS

const filteredAudios = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  if (!keyword) return audios.value
  return audios.value.filter((track) => {
    const categoryLabel = getCategoryMeta(track.category).label.toLowerCase()
    return [track.title, track.category, categoryLabel, track.url]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(keyword))
  })
})

const categoryCounts = computed(() =>
  audios.value.reduce((acc, track) => {
    const key = track.category || 'romantic'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {}),
)

function getCategoryMeta(category) {
  return CATEGORY_OPTIONS.find((option) => option.value === category) || {
    value: category || 'other',
    label: category || 'Umum',
    description: 'Kategori lain untuk kebutuhan audio khusus.',
    badgeClass: 'border-slate-100 bg-slate-50 text-slate-500',
  }
}

async function loadAudio() {
  loading.value = true
  try {
    const res = await fetchAdminAudio()
    const data = Array.isArray(res) ? res : (res.data || [])
    audios.value = data
  } catch (error) {
    toast.error(error.message || 'Gagal memuat musik')
  } finally {
    loading.value = false
  }
}

function handleSearch(value) { search.value = value }
function resetForm() { Object.assign(form, { title: '', category: 'romantic', url: '' }) }
function openCreate() { resetForm(); showForm.value = true }
function closeForm() { showForm.value = false; resetForm() }

function handlePlay(event) {
  if (currentPlayingAudio.value && currentPlayingAudio.value !== event.target) {
    currentPlayingAudio.value.pause()
  }
  currentPlayingAudio.value = event.target
}

function copyLink(url) {
  const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`
  navigator.clipboard.writeText(fullUrl)
  toast.success("Link berhasil disalin!")
}

async function handleFileChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (file.size > 25 * 1024 * 1024) {
     toast.error("Ukuran file terlalu besar (Maks 25MB)")
     event.target.value = ""
     return
  }

  uploadingFile.value = true
  try {
    const res = await uploadFileApi(file)
    form.url = res.fileUrl
    toast.success("Audio terupload ke R2!")
  } catch (error) {
    toast.error(error.message || 'Gagal mengupload file audio')
    event.target.value = ''
  } finally {
    uploadingFile.value = false
  }
}

async function submitForm() {
  if (saving.value || !form.url) return
  saving.value = true
  try {
    await createAdminAudio({ ...form })
    toast.success('Musik ditambahkan ke katalog')
    closeForm()
    await loadAudio()
  } catch (error) {
    toast.error(error.message || 'Gagal menyimpan')
  } finally {
    saving.value = false
  }
}

async function importWeddingPresets() {
  if (seeding.value) return
  const existingKeys = new Set(audios.value.map((track) => `${track.title}::${track.url}`.toLowerCase()))
  const missingTracks = WEDDING_AUDIO_PRESETS.filter(t => !existingKeys.has(`${t.title}::${t.url}`.toLowerCase()))

  if (!missingTracks.length) return toast.info('Semua preset sudah tersedia')

  const result = await Swal.fire({
    title: 'Import preset wedding?',
    text: `${missingTracks.length} audio preset akan ditambahkan ke katalog.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, Import',
    cancelButtonText: 'Batal',
  })
  if (!result.isConfirmed) return

  seeding.value = true
  try {
    for (const track of missingTracks) { await createAdminAudio(track) }
    toast.success(`Berhasil mengimport ${missingTracks.length} preset`)
    await loadAudio()
  } catch (error) {
    toast.error('Gagal mengimpor preset')
  } finally { seeding.value = false }
}

async function confirmDelete(track) {
  const result = await Swal.fire({
    title: 'Hapus musik?',
    text: `Musik "${track.title}" akan dihapus permanen.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
  })
  if (!result.isConfirmed) return
  try {
    await deleteAdminAudio(track.id)
    toast.success('Musik dihapus')
    await loadAudio()
  } catch (error) {
    toast.error('Gagal menghapus')
  }
}

onMounted(() => { loadAudio() })
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95) translateY(20px); }

/* Custom Scrollbar for the list */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style>
