<template>
  <AdminShell
    title="Master Bank & E-wallet"
    description="Kelola referensi bank dan e-wallet. Riwayat transaksi tersedia pada menu Pembayaran & Transaksi."
    show-search
    :search="search"
    search-placeholder="Cari nama bank"
    action-label="Tambah Bank"
    @update:search="handleSearch"
    @action="openCreate"
  >
    <div class="mb-6 flex justify-between items-center">
      <div class="flex bg-slate-100 p-1 rounded-xl">
        <button 
          @click="viewType = 'grid'"
          class="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
          :class="viewType === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'"
        >
          Grid
        </button>
        <button 
          @click="viewType = 'table'"
          class="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
          :class="viewType === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'"
        >
          Table
        </button>
      </div>
    </div>

    <AdminTableStatus
      :error="loadError"
      :loading="loading"
      :count="banks.length"
      :filtered="Boolean(search)"
      :updated-at="lastLoadedAt"
      @retry="loadBanks"
      @reset="resetSearch"
    />
    <p class="mb-4 rounded-lg bg-slate-50 px-4 py-3 text-xs text-slate-600">
      Ini master nama, kode, dan logo yang ditampilkan pada undangan—bukan saldo atau settlement. Jumlah referensi mencocokkan nama persis pada snapshot undangan. <a href="/admin/payments" class="font-semibold text-blue-700 underline">Buka Pembayaran &amp; Transaksi</a> untuk status transaksi.
    </p>

    <div v-if="viewType === 'grid' && !loadError" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div v-for="bank in banks" :key="bank.id" class="group relative flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-md">
        <button @click="openEdit(bank)" class="absolute top-2 left-2 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-all" title="Edit master">
          <i class="pi pi-pencil"></i>
        </button>
        <button @click="confirmDelete(bank)" class="absolute top-2 right-2 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        
        <div class="h-16 w-full flex items-center justify-center mb-3">
          <img v-if="bank.logo && !brokenLogos.has(bank.id)" :src="bank.logo" :alt="bank.name" class="max-h-full max-w-full object-contain" @error="markLogoBroken(bank.id)" />
          <div v-else class="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
          </div>
        </div>
        
        <h3 class="font-medium text-slate-900 text-center text-sm">{{ bank.name }}</h3>
        <p class="text-xs text-slate-500 text-center mt-1">{{ bank.code }}</p>
        <p v-if="bank.code && hasDuplicateCode(bank)" class="mt-1 text-[10px] font-semibold text-amber-700">Kode duplikat</p>
        <p class="mt-2 text-center text-[10px] text-slate-500">{{ bank.bankAccountUseCount ?? 0 }} undangan bank · {{ bank.walletUseCount ?? 0 }} e-wallet</p>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !banks.length" class="col-span-full py-12 text-center text-slate-500">
        Belum ada data bank.
      </div>
    </div>

    <DataTable
      v-else-if="viewType !== 'grid' && !loadError"
      :headers="headers"
      :items="banks"
      :loading="loading"
    >
      <template #cell(logo)="{ item }">
        <div class="h-10 w-16 flex items-center justify-center bg-white rounded border border-slate-100 overflow-hidden p-1">
          <img v-if="item.logo && !brokenLogos.has(item.id)" :src="item.logo" :alt="item.name" class="max-h-full max-w-full object-contain" @error="markLogoBroken(item.id)" />
          <span v-else class="text-[10px] text-slate-300 font-bold uppercase">No Logo</span>
        </div>
      </template>
      <template #cell(name)="{ item }">
        <span class="font-bold text-slate-900">{{ item.name }}</span>
      </template>
      <template #cell(code)="{ item }">
        <span class="font-mono text-xs" :class="hasDuplicateCode(item) ? 'text-amber-700' : 'text-slate-500'">{{ item.code || '-' }}{{ hasDuplicateCode(item) ? ' · duplikat' : '' }}</span>
      </template>
      <template #cell(usage)="{ item }">
        <span class="text-xs">{{ item.bankAccountUseCount ?? 0 }} bank · {{ item.walletUseCount ?? 0 }} e-wallet</span>
      </template>
      <template #cell(actions)="{ item }">
        <div class="flex justify-end">
          <button @click="openEdit(item)" class="mr-3 text-[11px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700">Edit</button>
          <button @click="confirmDelete(item)" class="text-[11px] font-black uppercase tracking-widest text-rose-600 hover:text-rose-700">Hapus</button>
        </div>
      </template>
    </DataTable>

    <!-- Modal Form -->
    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
        <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900">{{ editing ? 'Edit Master' : 'Tambah Master Bank / E-wallet' }}</h2>
            <button class="text-slate-500 hover:text-slate-600" @click="closeForm">×</button>
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
import AdminTableStatus from '@/components/admin/AdminTableStatus.vue'
import DataTable from '@/components/admin/DataTable.vue'
import { fetchAdminBanks, createAdminBank, updateAdminBank, deleteAdminBank } from '@/api/master.js'
import { uploadFileApi } from '@/api/file.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const banks = ref([])
const brokenLogos = ref(new Set())
const search = ref('')
const loading = ref(false)
const showForm = ref(false)
const saving = ref(false)
const editing = ref(null)
const uploadingFile = ref(false)
const viewType = ref('grid') // 'grid' or 'table'

const headers = [
  { label: 'Logo', key: 'logo', class: 'w-20' },
  { label: 'Nama Bank / E-Wallet', key: 'name' },
  { label: 'Kode', key: 'code' },
  { label: 'Referensi tersimpan', key: 'usage' },
  { label: 'Aksi', key: 'actions', class: 'text-right' },
]

const form = reactive({
  name: '',
  code: '',
  logo: '',
})

const loadError = ref('')
const lastLoadedAt = ref(null)
function resetSearch() {
  handleSearch('')
}

async function loadBanks() {
  loading.value = true
  loadError.value = ''
  try {
    const res = await fetchAdminBanks({ q: search.value })
    banks.value = Array.isArray(res) ? res : (res.data || [])
    brokenLogos.value = new Set()
    lastLoadedAt.value = new Date()
  } catch (error) {
    loadError.value = error.message || 'Gagal memuat bank'
  } finally {
    loading.value = false
  }
}

function hasDuplicateCode(bank) {
  if (!bank.code) return false
  const normalized = bank.code.trim().toLowerCase()
  return banks.value.filter((candidate) => candidate.code?.trim().toLowerCase() === normalized).length > 1
}

function markLogoBroken(id) {
  brokenLogos.value = new Set([...brokenLogos.value, id])
}

const debouncedSearch = useDebounceFn(() => loadBanks(), 300)

function handleSearch(value) {
  search.value = value
  debouncedSearch()
}

function openCreate() {
  editing.value = null
  Object.assign(form, { name: '', code: '', logo: '' })
  showForm.value = true
}

function openEdit(bank) {
  editing.value = bank
  Object.assign(form, { name: bank.name || '', code: bank.code || '', logo: bank.logo || '' })
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
  if (
    editing.value &&
    (editing.value.bankAccountUseCount > 0 || editing.value.walletUseCount > 0) &&
    (form.name !== editing.value.name || form.code !== editing.value.code || form.logo !== editing.value.logo)
  ) {
    const impact = await Swal.fire({
      title: 'Perbarui master yang sudah dipakai?',
      text: 'Perubahan berlaku untuk pilihan baru. Undangan yang sudah tersimpan tetap memakai snapshot bank/e-wallet sebelumnya.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f172a',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Perbarui master',
      cancelButtonText: 'Batal',
    })
    if (!impact.isConfirmed) return
  }
  saving.value = true
  try {
    if (editing.value) {
      await updateAdminBank(editing.value.id, { ...form })
      toast.success('Master diperbarui')
    } else {
      await createAdminBank({ ...form })
      toast.success('Master ditambahkan')
    }
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
    text: `${bank.bankAccountUseCount ?? 0} undangan memakai nama ini sebagai bank dan ${bank.walletUseCount ?? 0} sebagai e-wallet. Master yang masih terdeteksi tidak dapat dihapus.`,
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
