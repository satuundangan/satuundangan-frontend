<template>
  <AdminShell
    title="Undangan"
    description="Pantau seluruh undangan yang dibuat pengguna"
    show-search
    :search="search"
    search-placeholder="Cari judul, pasangan, atau slug"
    @update:search="handleSearch"
  >
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table class="min-w-full divide-y divide-slate-200 text-sm">
        <thead class="bg-slate-50 text-left font-medium text-slate-500">
          <tr>
            <th class="px-4 py-3">Judul</th>
            <th class="px-4 py-3">Pengguna</th>
            <th class="px-4 py-3">Slug</th>
            <th class="px-4 py-3">Kategori</th>
            <th class="px-4 py-3">Dibuat</th>
            <th class="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="inv in invitations" :key="inv.id">
            <td class="px-4 py-3 font-medium text-slate-900">{{ inv.title }}</td>
            <td class="px-4 py-3 text-slate-600">{{ inv.user?.name || inv.user?.email || '-' }}</td>
            <td class="px-4 py-3 text-slate-600">{{ inv.slug }}</td>
            <td class="px-4 py-3 text-slate-600">{{ inv.category || '-' }}</td>
            <td class="px-4 py-3 text-slate-600">{{ diffForHumans(inv.createdAt) }}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2">
                <a :href="`/preview?slug=${inv.slug}`" target="_blank" class="rounded-lg border border-blue-200 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50">Lihat</a>
                <button class="rounded-lg border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50" @click="confirmDelete(inv)">Hapus</button>
              </div>
            </td>
          </tr>
          <tr v-if="!loading && !invitations.length">
            <td colspan="6" class="px-4 py-8 text-center text-slate-400">Tidak ada data</td>
          </tr>
          <tr v-if="loading">
            <td colspan="6" class="px-4 py-8 text-center text-slate-400">Memuat data…</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="total > limit" class="mt-4 flex items-center justify-between text-sm text-slate-600">
      <p>Menampilkan halaman {{ page }} dari {{ totalPages }}</p>
      <div class="flex items-center gap-2">
        <button class="rounded-lg border border-slate-200 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40" :disabled="page === 1" @click="setPage(page - 1)">Sebelumnya</button>
        <button class="rounded-lg border border-slate-200 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40" :disabled="page === totalPages" @click="setPage(page + 1)">Berikutnya</button>
      </div>
    </div>
  </AdminShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import AdminShell from '@/components/admin/AdminShell.vue'
import { fetchAdminInvitations, deleteAdminInvitation } from '@/api/admin.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const invitations = ref([])
const total = ref(0)
const page = ref(1)
const limit = 10
const search = ref('')
const loading = ref(false)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)))

function diffForHumans(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) return `${diffInSeconds} detik yang lalu`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} bulan yang lalu`
  return `${Math.floor(diffInSeconds / 31536000)} tahun yang lalu`
}

async function loadInvitations() {
  loading.value = true
  try {
    const res = await fetchAdminInvitations({ page: page.value, limit, q: search.value })
    invitations.value = res.data
    total.value = res.total
  } catch (error) {
    toast.error(error.message || 'Gagal memuat data undangan')
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn(() => loadInvitations(), 300)

function handleSearch(value) {
  search.value = value
  page.value = 1
  debouncedSearch()
}

function setPage(newPage) {
  page.value = newPage
  loadInvitations()
}

async function confirmDelete(invitation) {
  const result = await Swal.fire({
    title: 'Hapus undangan?',
    text: `Undangan ${invitation.title} akan dihapus permanen`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
  })
  if (!result.isConfirmed) return
  try {
    await deleteAdminInvitation(invitation.id)
    toast.success('Undangan dihapus')
    loadInvitations()
  } catch (error) {
    toast.error(error.message || 'Gagal menghapus undangan')
  }
}

onMounted(() => {
  loadInvitations()
})
</script>
