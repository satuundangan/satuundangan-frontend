<template>
  <AdminShell
    title="Bank & Pembayaran"
    description="Kelola daftar bank dan e-wallet yang didukung"
    show-search
    :search="search"
    search-placeholder="Cari nama bank"
    action-label="Tambah Bank"
    @update:search="handleSearch"
    @action="openCreate"
  >
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div v-for="bank in banks" :key="bank.id" class="group relative flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-md">
        <button @click="confirmDelete(bank)" class="absolute top-2 right-2 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        
        <div class="h-16 w-full flex items-center justify-center mb-3">
          <img v-if="bank.logo" :src="bank.logo" :alt="bank.name" class="max-h-full max-w-full object-contain" />
          <div v-else class="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
          </div>
        </div>
        
        <h3 class="font-medium text-slate-900 text-center text-sm">{{ bank.name }}</h3>
        <p class="text-xs text-slate-500 text-center mt-1">{{ bank.code }}</p>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !banks.length" class="col-span-full py-12 text-center text-slate-400">
        Belum ada data bank.
      </div>
    </div>

    <!-- Modal Form -->
    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
        <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900">Tambah Bank</h2>
            <button class="text-slate-400 hover:text-slate-600" @click="closeForm">×</button>
          </div>

          <form class="space-y-4" @submit.prevent="submitForm">
            <div>
              <label class="text-sm font-medium text-slate-600">Nama Bank / E-Wallet</label>
              <input v-model="form.name" type="text" placeholder="Contoh: BCA" class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" required />
            </div>

            <div>
              <label class="text-sm font-medium text-slate-600">Kode (Opsional)</label>
              <input v-model="form.code" type="text" placeholder="Contoh: 014" class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
            </div>

            <div>
              <label class="text-sm font-medium text-slate-600">Logo Bank</label>
              <input type="file" accept="image/*" @change="handleFileChange" class="mt-2 w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"/>
              <p v-if="uploadingFile" class="text-xs text-blue-500 mt-1">Mengupload logo...</p>
              
              <div v-if="form.logo" class="mt-2 flex justify-center p-2 border border-slate-100 rounded bg-slate-50">
                <img :src="form.logo" class="h-10 object-contain" />
              </div>
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
import { fetchAdminBanks, createAdminBank, deleteAdminBank } from '@/api/master.js'
import { uploadFileApi } from '@/api/file.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const banks = ref([])
const search = ref('')
const loading = ref(false)
const showForm = ref(false)
const saving = ref(false)
const uploadingFile = ref(false)

const form = reactive({
  name: '',
  code: '',
  logo: '',
})

async function loadBanks() {
  loading.value = true
  try {
    const res = await fetchAdminBanks({ q: search.value })
    banks.value = Array.isArray(res) ? res : (res.data || [])
  } catch (error) {
    toast.error(error.message || 'Gagal memuat bank')
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn(() => loadBanks(), 300)

function handleSearch(value) {
  search.value = value
  debouncedSearch()
}

function openCreate() {
  Object.assign(form, { name: '', code: '', logo: '' })
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
    form.logo = res.fileUrl
  } catch {
    toast.error('Gagal mengupload logo')
    event.target.value = '' 
  } finally {
    uploadingFile.value = false
  }
}

async function submitForm() {
  if (saving.value) return
  saving.value = true
  try {
    await createAdminBank({ ...form })
    toast.success('Bank ditambahkan')
    showForm.value = false
    loadBanks()
  } catch (error) {
    toast.error(error.message || 'Gagal menyimpan')
  } finally {
    saving.value = false
  }
}

async function confirmDelete(bank) {
  const result = await Swal.fire({
    title: 'Hapus bank?',
    text: `Bank "${bank.name}" akan dihapus.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
  })
  if (!result.isConfirmed) return
  try {
    await deleteAdminBank(bank.id)
    toast.success('Bank dihapus')
    loadBanks()
  } catch (error) {
    toast.error(error.message || 'Gagal menghapus')
  }
}

onMounted(() => {
  loadBanks()
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
