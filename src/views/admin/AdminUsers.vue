<template>
  <AdminShell
    title="Pengguna"
    description="Kelola seluruh akun pengguna terdaftar, status verifikasi, dan hak akses admin"
    show-search
    :search="search"
    search-placeholder="Cari nama atau email pengguna..."
    action-label="Tambah Pengguna"
    @update:search="handleSearch"
    @action="openCreate"
  >
    <div class="space-y-6">
      <!-- 1. Stats Counter Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Users -->
        <div class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[11px] font-black uppercase tracking-wider text-slate-400">Total Pengguna</p>
            <h3 class="text-2xl font-black text-slate-900 mt-1">{{ total }}</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Akun terdaftar di database</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shrink-0">
            <i class="fa-solid fa-users"></i>
          </div>
        </div>

        <!-- Verified Users -->
        <div class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[11px] font-black uppercase tracking-wider text-emerald-600">Email Terverifikasi</p>
            <h3 class="text-2xl font-black text-slate-900 mt-1">{{ verifiedUsersCount }}</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Memiliki email aktif</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
            <i class="fa-solid fa-envelope-circle-check"></i>
          </div>
        </div>

        <!-- Admin Users -->
        <div class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[11px] font-black uppercase tracking-wider text-indigo-600">Administrator</p>
            <h3 class="text-2xl font-black text-slate-900 mt-1">{{ adminUsersCount }}</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Akses panel admin</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg shrink-0">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
        </div>

        <!-- Regular Users -->
        <div class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p class="text-[11px] font-black uppercase tracking-wider text-amber-600">User Pengantin</p>
            <h3 class="text-2xl font-black text-slate-900 mt-1">{{ Math.max(0, total - adminUsersCount) }}</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Pembuat undangan</p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg shrink-0">
            <i class="fa-solid fa-heart"></i>
          </div>
        </div>
      </div>

      <!-- Quick Filter Bar -->
      <div class="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          <button
            type="button"
            @click="setQuickFilter('')"
            :class="[
              'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
              !quickFilter
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            ]"
          >
            Semua Akun
          </button>

          <button
            type="button"
            @click="setQuickFilter('playwright')"
            :class="[
              'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
              quickFilter === 'playwright'
                ? 'bg-rose-900 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            ]"
          >
            <i class="fa-solid fa-robot text-xs"></i>
            <span>Akun Playwright (Testing)</span>
          </button>

          <button
            type="button"
            @click="setQuickFilter('test')"
            :class="[
              'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
              quickFilter === 'test'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            ]"
          >
            <i class="fa-solid fa-flask text-xs"></i>
            <span>Akun @test / @example</span>
          </button>
        </div>

        <div v-if="quickFilter" class="text-xs text-rose-600 font-bold flex items-center gap-1.5">
          <i class="fa-solid fa-filter"></i>
          <span>Filter Aktif: "{{ quickFilter }}"</span>
          <button
            type="button"
            @click="setQuickFilter('')"
            class="text-[11px] underline ml-1 text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- 2. Clean Datatable Card -->
      <div class="card bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <DataTable
          :value="users"
          lazy
          paginator
          :rows="limit"
          :totalRecords="total"
          :loading="loading"
          @page="onPage"
          class="p-datatable-sm"
          dataKey="id"
          responsiveLayout="scroll"
        >
          <template #empty>
            <div class="py-12 text-center space-y-2">
              <i class="fa-solid fa-user-slash text-3xl text-slate-300"></i>
              <p class="text-sm font-bold text-slate-700">Tidak ada pengguna ditemukan</p>
              <p class="text-xs text-slate-400">Coba ubah kata kunci pencarian Anda.</p>
            </div>
          </template>
          <template #loading>
            <div class="py-8 text-center text-sm font-medium text-slate-500">Memuat data pengguna...</div>
          </template>

          <!-- User Name & Avatar & ID -->
          <Column field="name" header="Pengguna" style="min-width: 14rem">
            <template #body="{ data }">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                  {{ (data.name || data.email || 'U').charAt(0).toUpperCase() }}
                </div>
                <div class="flex flex-col min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-slate-900 text-xs truncate max-w-[180px]">{{ data.name || '-' }}</span>
                    <span class="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">#{{ data.id }}</span>
                    <span
                      v-if="isTestAccount(data)"
                      class="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 border border-rose-200"
                    >
                      🤖 Akun Test
                    </span>
                  </div>
                  <span class="text-[11px] text-slate-500 truncate max-w-[180px]">{{ data.email }}</span>
                </div>
              </div>
            </template>
          </Column>

          <!-- Email & Verification Status -->
          <Column header="Status Email" style="min-width: 10rem">
            <template #body="{ data }">
              <span
                :class="[
                  'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                  data.emailVerifiedAt
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                ]"
              >
                <i :class="data.emailVerifiedAt ? 'fa-solid fa-check text-[9px]' : 'fa-solid fa-clock text-[9px]'"></i>
                {{ data.emailVerifiedAt ? 'Terverifikasi' : 'Belum Verifikasi' }}
              </span>
            </template>
          </Column>

          <!-- Provider Login -->
          <Column header="Metode Login" style="min-width: 9rem">
            <template #body="{ data }">
              <div class="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                <i v-if="data.provider === 'google'" class="fa-brands fa-google text-red-500 text-xs"></i>
                <i v-else class="fa-solid fa-envelope text-slate-400 text-xs"></i>
                <span class="capitalize">{{ data.provider || 'Email' }}</span>
              </div>
            </template>
          </Column>

          <!-- Role -->
          <Column field="role" header="Role" style="min-width: 7rem">
            <template #body="{ data }">
              <span
                class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border"
                :class="data.isAdmin ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-600 border-slate-200'"
              >
                <i :class="data.isAdmin ? 'fa-solid fa-shield-halved text-[9px]' : 'fa-solid fa-user text-[9px]'"></i>
                {{ data.isAdmin ? 'Admin' : 'User' }}
              </span>
            </template>
          </Column>

          <!-- Total Invitations -->
          <Column header="Undangan" style="min-width: 8rem">
            <template #body="{ data }">
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold">
                <i class="fa-solid fa-envelope-open-text text-[10px]"></i>
                {{ data.invitationsCount || 0 }} Undangan
              </span>
            </template>
          </Column>

          <!-- Created At / Tanggal Terdaftar -->
          <Column field="createdAt" header="Tanggal Terdaftar" style="min-width: 12rem">
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-xs font-semibold text-slate-800 font-mono">
                  {{ formatDate(data.createdAt) }}
                </span>
                <span class="text-[10px] text-slate-400 mt-0.5">
                  {{ formatRelative(data.createdAt) }}
                </span>
              </div>
            </template>
          </Column>

          <!-- Aksi -->
          <Column header="Aksi" headerClass="text-right" bodyClass="text-right" style="min-width: 9rem">
            <template #body="{ data }">
              <div class="flex justify-end gap-1.5 text-xs font-medium">
                <button
                  type="button"
                  class="flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 px-3 hover:bg-slate-50 transition-colors text-slate-700 font-bold cursor-pointer"
                  @click="openEdit(data)"
                  title="Edit pengguna"
                >
                  <i class="fa-solid fa-pencil text-[10px] text-slate-400"></i> Edit
                </button>
                <button
                  type="button"
                  class="flex h-8 items-center gap-1.5 rounded-xl border border-rose-200 px-2.5 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  @click="confirmDelete(data)"
                  title="Hapus pengguna"
                >
                  <i class="fa-solid fa-trash text-[10px]"></i>
                </button>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Modal Form Tambah / Edit Pengguna -->
    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs px-4" @click.self="closeForm">
        <div class="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
          <div class="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-black">
                <i :class="editing ? 'fa-solid fa-user-pen' : 'fa-solid fa-user-plus'"></i>
              </div>
              <div>
                <h2 class="text-base font-black text-slate-900">{{ editing ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru' }}</h2>
                <p class="text-xs text-slate-400 mt-0.5">Kelola akun dan kredensial login</p>
              </div>
            </div>
            <button class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer" @click="closeForm">
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          <form class="space-y-4" @submit.prevent="submitForm">
            <div>
              <label class="text-xs font-bold text-slate-700 block mb-1">Nama Lengkap</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Contoh: Budi Pratama"
                class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 bg-slate-50 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label class="text-xs font-bold text-slate-700 block mb-1">Alamat Email</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="contoh@email.com"
                class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 bg-slate-50 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label class="text-xs font-bold text-slate-700 block mb-1">Password</label>
              <input
                v-model="form.password"
                type="password"
                :required="!editing"
                class="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 bg-slate-50 focus:bg-white transition-all"
                :placeholder="editing ? 'Kosongkan jika tidak ingin mengubah password' : 'Minimal 6 karakter'"
              />
            </div>

            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <label for="isAdmin" class="text-xs font-bold text-slate-900 block cursor-pointer">Hak Akses Administrator</label>
                <p class="text-[11px] text-slate-500">Izinkan akun ini mengakses panel dashboard admin</p>
              </div>
              <input
                id="isAdmin"
                v-model="form.isAdmin"
                type="checkbox"
                class="h-5 w-5 rounded-md border-slate-300 text-slate-900 focus:ring-slate-500 cursor-pointer"
              />
            </div>

            <div v-if="editing" class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <label for="isEmailVerified" class="text-xs font-bold text-slate-900 block cursor-pointer">Status Verifikasi Email</label>
                <p class="text-[11px] text-slate-500">Bypass / verifikasi email pengguna secara instan</p>
              </div>
              <input
                id="isEmailVerified"
                v-model="form.isEmailVerified"
                type="checkbox"
                class="h-5 w-5 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            <div class="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                class="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                @click="closeForm"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-60 transition-all cursor-pointer shadow-md"
              >
                {{ saving ? 'Menyimpan…' : 'Simpan Pengguna' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </AdminShell>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import AdminShell from '@/components/admin/AdminShell.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import {
  fetchAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '@/api/admin.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const users = ref([])
const total = ref(0)
const page = ref(1)
const limit = 15
const search = ref('')
const loading = ref(false)
const showForm = ref(false)
const saving = ref(false)
const editing = ref(null)

const form = reactive({
  name: '',
  email: '',
  isAdmin: false,
  isEmailVerified: false,
  password: '',
})

const adminUsersCount = computed(() => {
  return users.value.filter((u) => u.isAdmin).length
})

const verifiedUsersCount = computed(() => {
  return users.value.filter((u) => Boolean(u.emailVerifiedAt)).length
})

async function loadUsers() {
  loading.value = true
  try {
    const res = await fetchAdminUsers({ page: page.value, limit, q: search.value })
    users.value = res.data || []
    total.value = res.total || 0
  } catch (error) {
    toast.error(error.message || 'Gagal memuat pengguna')
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn(() => {
  loadUsers()
}, 350)

const quickFilter = ref('')

function isTestAccount(user) {
  if (!user) return false
  const email = (user.email || '').toLowerCase()
  const name = (user.name || '').toLowerCase()
  return (
    email.includes('playwright') ||
    email.includes('@test.com') ||
    email.includes('@example.com') ||
    email.includes('test.') ||
    name.includes('playwright') ||
    name.includes('pw prod') ||
    name.includes('tester')
  )
}

function setQuickFilter(val) {
  quickFilter.value = val
  search.value = val
  page.value = 1
  loadUsers()
}

function handleSearch(value) {
  search.value = value
  quickFilter.value = ''
  page.value = 1
  debouncedSearch()
}

function onPage(event) {
  page.value = event.page + 1
  loadUsers()
}

function openCreate() {
  editing.value = null
  Object.assign(form, { name: '', email: '', isAdmin: false, isEmailVerified: false, password: '' })
  showForm.value = true
}

function openEdit(user) {
  editing.value = user
  Object.assign(form, {
    name: user.name || '',
    email: user.email || '',
    isAdmin: Boolean(user.isAdmin),
    isEmailVerified: Boolean(user.emailVerifiedAt),
    password: '',
  })
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  saving.value = false
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && showForm.value) closeForm()
}

async function submitForm() {
  saving.value = true
  try {
    const payload = { ...form }
    if (editing.value && !payload.password) {
      delete payload.password
    }
    if (editing.value) {
      await updateAdminUser(editing.value.id, payload)
      toast.success('Pengguna berhasil diperbarui')
    } else {
      await createAdminUser(payload)
      toast.success('Pengguna baru berhasil ditambahkan')
    }
    closeForm()
    loadUsers()
  } catch (error) {
    toast.error(error.message || 'Gagal menyimpan pengguna')
  } finally {
    saving.value = false
  }
}

async function confirmDelete(user) {
  const result = await Swal.fire({
    title: 'Hapus Pengguna?',
    html: `Apakah Anda yakin ingin menghapus akun <strong>${user.name || user.email}</strong>? Tindakan ini tidak dapat dibatalkan.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
  })

  if (!result.isConfirmed) return

  try {
    await deleteAdminUser(user.id)
    toast.success('Pengguna berhasil dihapus')
    loadUsers()
  } catch (error) {
    toast.error(error.message || 'Gagal menghapus pengguna')
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatRelative(dateStr) {
  if (!dateStr) return ''
  const diffSec = Math.floor((new Date() - new Date(dateStr)) / 1000)
  if (diffSec < 60) return 'Baru saja'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin} mnt lalu`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour} jam lalu`
  const diffDay = Math.floor(diffHour / 24)
  return `${diffDay} hari lalu`
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  loadUsers()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
