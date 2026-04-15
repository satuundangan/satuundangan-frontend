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
    <section class="mb-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="max-w-3xl">
          <h2 class="text-base font-semibold text-slate-900">Starter Pack Wedding Audio</h2>
          <p class="mt-1 text-sm text-slate-600">
            Import katalog musik wedding yang sudah dikelompokkan per nuansa acara:
            akad, aisle, first dance, garden party, hingga resepsi hangat.
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="option in categoryOptions"
              :key="option.value"
              class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium"
              :class="option.badgeClass"
            >
              {{ option.label }}
            </span>
          </div>
        </div>

        <div class="flex shrink-0 gap-2">
          <button
            type="button"
            class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="seeding"
            @click="importWeddingPresets"
          >
            {{ seeding ? 'Mengimpor…' : 'Import Preset Wedding' }}
          </button>
        </div>
      </div>
    </section>

    <section class="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="option in categoryOptions"
        :key="option.value"
        class="rounded-2xl border border-slate-200 bg-white p-4"
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <h3 class="text-sm font-semibold text-slate-900">{{ option.label }}</h3>
            <p class="mt-1 text-xs text-slate-500">{{ option.description }}</p>
          </div>
          <span
            class="inline-flex min-w-10 items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold"
            :class="option.badgeClass"
          >
            {{ categoryCounts[option.value] || 0 }}
          </span>
        </div>
      </article>
    </section>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="track in filteredAudios"
        :key="track.id"
        class="group relative rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1 overflow-hidden">
            <div class="flex items-center gap-2">
              <h3 class="truncate font-semibold text-slate-900" :title="track.title">{{ track.title }}</h3>
              <span
                class="inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-semibold"
                :class="getCategoryMeta(track.category).badgeClass"
              >
                {{ getCategoryMeta(track.category).label }}
              </span>
            </div>
            <p class="mt-2 line-clamp-2 text-xs text-slate-500">
              {{ getCategoryMeta(track.category).description }}
            </p>
          </div>
          <button
            type="button"
            class="text-slate-400 transition-colors hover:text-rose-500"
            @click="confirmDelete(track)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
          </button>
        </div>

        <div class="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
          <audio controls class="h-8 w-full">
            <source :src="track.url" type="audio/mpeg">
            Browser Anda tidak mendukung elemen audio.
          </audio>
        </div>

        <p class="mt-3 truncate text-[11px] text-slate-400">{{ track.url }}</p>
      </div>

      <div v-if="!loading && !filteredAudios.length" class="col-span-full py-12 text-center text-slate-400">
        {{ audios.length ? 'Tidak ada musik yang cocok dengan pencarian.' : 'Belum ada musik. Gunakan preset wedding atau tambahkan manual.' }}
      </div>

      <div v-if="loading" class="col-span-full py-12 text-center text-slate-400">
        Memuat musik…
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-slate-900">Tambah Musik</h2>
              <p class="mt-1 text-xs text-slate-500">Gunakan kategori yang paling pas dengan nuansa wedding.</p>
            </div>
            <button class="text-slate-400 hover:text-slate-600" @click="closeForm">×</button>
          </div>

          <form class="space-y-4" @submit.prevent="submitForm">
            <div>
              <label class="text-sm font-medium text-slate-600">Judul Musik</label>
              <input
                v-model="form.title"
                type="text"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                required
              />
            </div>

            <div>
              <label class="text-sm font-medium text-slate-600">Kategori</label>
              <select
                v-model="form.category"
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              >
                <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="text-sm font-medium text-slate-600">URL Audio</label>
              <input
                v-model="form.url"
                type="text"
                placeholder="https://... atau /audio/..."
                class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            <div>
              <label class="text-sm font-medium text-slate-600">File Audio (MP3)</label>
              <input
                type="file"
                accept="audio/mpeg, audio/mp3"
                class="mt-2 w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                :required="!form.url"
                @change="handleFileChange"
              />
              <p v-if="uploadingFile" class="mt-1 text-xs text-blue-500">Mengupload file…</p>
            </div>

            <div class="flex justify-end gap-2 pt-2 text-sm font-medium">
              <button type="button" class="rounded-lg border border-slate-200 px-4 py-2" @click="closeForm">Batal</button>
              <button
                type="submit"
                :disabled="saving || uploadingFile"
                class="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {{ saving ? 'Menyimpan…' : 'Simpan' }}
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
    badgeClass: 'border border-rose-200 bg-rose-50 text-rose-700',
  },
  {
    value: 'acoustic',
    label: 'Acoustic Morning',
    description: 'Hangat dan ringan untuk intimate wedding atau garden party.',
    badgeClass: 'border border-amber-200 bg-amber-50 text-amber-700',
  },
  {
    value: 'elegant',
    label: 'Elegant First Dance',
    description: 'Lebih megah untuk ballroom, dinner, dan first dance.',
    badgeClass: 'border border-indigo-200 bg-indigo-50 text-indigo-700',
  },
  {
    value: 'sacred',
    label: 'Sacred Ceremony',
    description: 'Tenang dan khidmat untuk akad, blessing, atau pemberkatan.',
    badgeClass: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  {
    value: 'warm',
    label: 'Warm Reception',
    description: 'Sedikit lebih penuh untuk resepsi santai dan momen kumpul keluarga.',
    badgeClass: 'border border-orange-200 bg-orange-50 text-orange-700',
  },
  {
    value: 'instrumental',
    label: 'Instrumental Garden',
    description: 'Netral dan ringan untuk outdoor wedding serta slideshow galeri.',
    badgeClass: 'border border-sky-200 bg-sky-50 text-sky-700',
  },
]

const WEDDING_AUDIO_PRESETS = [
  {
    title: 'Romantic Aisle Glow',
    category: 'romantic',
    url: '/audio/wedding-romantic-aisle.mp3',
  },
  {
    title: 'Acoustic Morning Promise',
    category: 'acoustic',
    url: '/audio/wedding-acoustic-morning.mp3',
  },
  {
    title: 'Elegant First Dance Reverie',
    category: 'elegant',
    url: '/audio/wedding-elegant-firstdance.mp3',
  },
  {
    title: 'Sacred Ceremony Bloom',
    category: 'sacred',
    url: '/audio/wedding-sacred-ceremony.mp3',
  },
  {
    title: 'Warm Reception Serenade',
    category: 'warm',
    url: '/audio/wedding-warm-reception.mp3',
  },
  {
    title: 'Instrumental Garden Breeze',
    category: 'instrumental',
    url: '/audio/wedding-instrumental-garden.mp3',
  },
]

const toast = useToast()
const audios = ref([])
const search = ref('')
const loading = ref(false)
const showForm = ref(false)
const saving = ref(false)
const uploadingFile = ref(false)
const seeding = ref(false)

const form = reactive({
  title: '',
  category: 'romantic',
  url: '',
})

const categoryOptions = CATEGORY_OPTIONS

const filteredAudios = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  if (!keyword) return audios.value

  return audios.value.filter((track) => {
    const categoryLabel = getCategoryMeta(track.category).label.toLowerCase()
    return [
      track.title,
      track.category,
      categoryLabel,
      track.url,
    ]
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
  return (
    CATEGORY_OPTIONS.find((option) => option.value === category) || {
      value: category || 'other',
      label: category || 'Umum',
      description: 'Kategori lain untuk kebutuhan audio khusus.',
      badgeClass: 'border border-slate-200 bg-slate-100 text-slate-700',
    }
  )
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

function handleSearch(value) {
  search.value = value
}

function resetForm() {
  Object.assign(form, { title: '', category: 'romantic', url: '' })
}

function openCreate() {
  resetForm()
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  resetForm()
}

async function handleFileChange(event) {
  const file = event.target.files?.[0]
  if (!file) return

  uploadingFile.value = true
  try {
    const res = await uploadFileApi(file)
    form.url = res.fileUrl
  } catch (error) {
    toast.error('Gagal mengupload file audio')
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
    toast.success('Musik ditambahkan')
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

  const existingKeys = new Set(
    audios.value.map((track) => `${track.title}::${track.url}`.toLowerCase()),
  )
  const missingTracks = WEDDING_AUDIO_PRESETS.filter(
    (track) => !existingKeys.has(`${track.title}::${track.url}`.toLowerCase()),
  )

  if (!missingTracks.length) {
    toast.info('Preset wedding sudah tersedia semua')
    return
  }

  const result = await Swal.fire({
    title: 'Import preset wedding?',
    text: `${missingTracks.length} audio preset akan ditambahkan ke katalog admin.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, import',
    cancelButtonText: 'Batal',
  })
  if (!result.isConfirmed) return

  seeding.value = true
  try {
    for (const track of missingTracks) {
      await createAdminAudio(track)
    }
    toast.success(`${missingTracks.length} preset wedding berhasil ditambahkan`)
    await loadAudio()
  } catch (error) {
    toast.error(error.message || 'Gagal mengimpor preset wedding')
  } finally {
    seeding.value = false
  }
}

async function confirmDelete(track) {
  const result = await Swal.fire({
    title: 'Hapus musik?',
    text: `Musik "${track.title}" akan dihapus permanen.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
  })
  if (!result.isConfirmed) return
  try {
    await deleteAdminAudio(track.id)
    toast.success('Musik dihapus')
    await loadAudio()
  } catch (error) {
    toast.error(error.message || 'Gagal menghapus')
  }
}

onMounted(() => {
  loadAudio()
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
