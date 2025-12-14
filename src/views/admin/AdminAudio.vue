<template>
  <AdminShell
    title="Audio & Musik"
    description="Kelola koleksi musik latar untuk undangan"
    show-search
    :search="search"
    search-placeholder="Cari judul musik"
    action-label="Tambah Musik"
    @update:search="handleSearch"
    @action="openCreate"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="track in audios" :key="track.id" class="group relative rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:shadow-md">
        <div class="flex items-start justify-between">
          <div class="flex-1 overflow-hidden">
            <h3 class="font-semibold text-slate-900 truncate" :title="track.title">{{ track.title }}</h3>
            <p class="text-xs text-slate-500 truncate">{{ track.category || 'Umum' }}</p>
          </div>
          <button @click="confirmDelete(track)" class="text-slate-400 hover:text-rose-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
          </button>
        </div>

        <div class="mt-4">
          <audio controls class="w-full h-8">
            <source :src="track.url" type="audio/mpeg">
            Browser Anda tidak mendukung elemen audio.
          </audio>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="!loading && !audios.length" class="col-span-full py-12 text-center text-slate-400">
        Belum ada musik. Silakan tambahkan.
      </div>
    </div>

    <!-- Pagination if needed -->
    <div v-if="total > limit" class="mt-6 flex justify-center">
       <!-- (Simplified pagination similar to other views) -->
    </div>

    <!-- Modal Form -->
    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900">Tambah Musik</h2>
            <button class="text-slate-400 hover:text-slate-600" @click="closeForm">×</button>
          </div>

          <form class="space-y-4" @submit.prevent="submitForm">
            <div>
              <label class="text-sm font-medium text-slate-600">Judul Musik</label>
              <input v-model="form.title" type="text" class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" required />
            </div>

            <div>
              <label class="text-sm font-medium text-slate-600">Kategori</label>
              <select v-model="form.category" class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100">
                <option value="romantic">Romantic</option>
                <option value="acoustic">Acoustic</option>
                <option value="classic">Classic</option>
                <option value="pop">Pop</option>
                <option value="religious">Religious</option>
                <option value="instrumental">Instrumental</option>
              </select>
            </div>

            <div>
              <label class="text-sm font-medium text-slate-600">File Audio (MP3)</label>
              <input type="file" accept="audio/mpeg, audio/mp3" @change="handleFileChange" class="mt-2 w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" :required="!form.url"/>
              <p v-if="uploadingFile" class="text-xs text-blue-500 mt-1">Mengupload file...</p>
            </div>

            <div class="flex justify-end gap-2 pt-2 text-sm font-medium">
              <button type="button" class="rounded-lg border border-slate-200 px-4 py-2" @click="closeForm">Batal</button>
              <button type="submit" :disabled="saving || uploadingFile" class="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60">
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
import { onMounted, reactive, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import AdminShell from '@/components/admin/AdminShell.vue'
import { fetchAdminAudio, createAdminAudio, deleteAdminAudio } from '@/api/master.js'
import { uploadFileApi } from '@/api/file.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const audios = ref([])
const total = ref(0)
const page = ref(1)
const limit = 12
const search = ref('')
const loading = ref(false)
const showForm = ref(false)
const saving = ref(false)
const uploadingFile = ref(false)

const form = reactive({
  title: '',
  category: 'romantic',
  url: '',
})

async function loadAudio() {
  loading.value = true
  try {
    const res = await fetchAdminAudio({ page: page.value, limit, q: search.value })
    if (Array.isArray(res)) {
      audios.value = res
      total.value = res.length
    } else {
      audios.value = res.data || []
      total.value = res.total || 0
    }
  } catch (error) {
    toast.error(error.message || 'Gagal memuat musik')
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn(() => loadAudio(), 300)

function handleSearch(value) {
  search.value = value
  page.value = 1
  debouncedSearch()
}

function openCreate() {
  Object.assign(form, { title: '', category: 'romantic', url: '' })
  showForm.value = true
}

function closeForm() {
  showForm.value = false
}

async function handleFileChange(event) {
  const file = event.target.files[0]
  if (!file) return

  uploadingFile.value = true
  try {
    const res = await uploadFileApi(file)
    form.url = res.fileUrl
  } catch (error) {
    toast.error('Gagal mengupload file audio')
    event.target.value = '' // Reset input
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
    showForm.value = false
    loadAudio()
  } catch (error) {
    toast.error(error.message || 'Gagal menyimpan')
  } finally {
    saving.value = false
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
    loadAudio()
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
