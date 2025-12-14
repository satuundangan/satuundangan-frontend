<template>
  <AdminShell
    title="Pesan Tamu"
    description="Moderasi pesan ucapan dari para tamu"
    show-search
    :search="search"
    search-placeholder="Cari nama tamu atau pesan"
    @update:search="handleSearch"
  >
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table class="min-w-full divide-y divide-slate-200 text-sm">
        <thead class="bg-slate-50 text-left font-medium text-slate-500">
          <tr>
            <th class="px-4 py-3">Nama</th>
            <th class="px-4 py-3">Pesan</th>
            <th class="px-4 py-3">Undangan</th>
            <th class="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="message in messages" :key="message.id">
            <td class="px-4 py-3 font-medium text-slate-900">{{ message.guestName || message.guest?.name || '-' }}</td>
            <td class="px-4 py-3 text-slate-600">{{ message.message }}</td>
            <td class="px-4 py-3 text-slate-600">{{ message.invitation?.title || '-' }}</td>
            <td class="px-4 py-3 text-right">
              <button class="rounded-lg border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50" @click="confirmDelete(message)">Hapus</button>
            </td>
          </tr>
          <tr v-if="!loading && !messages.length">
            <td colspan="4" class="px-4 py-8 text-center text-slate-400">Tidak ada data</td>
          </tr>
          <tr v-if="loading">
            <td colspan="4" class="px-4 py-8 text-center text-slate-400">Memuat data…</td>
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
import { fetchAdminGuestMessages, deleteAdminGuestMessage } from '@/api/admin.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const messages = ref([])
const total = ref(0)
const page = ref(1)
const limit = 10
const search = ref('')
const loading = ref(false)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)))

async function loadMessages() {
  loading.value = true
  try {
    const res = await fetchAdminGuestMessages({ page: page.value, limit, q: search.value })
    messages.value = res.data
    total.value = res.total
  } catch (error) {
    toast.error(error.message || 'Gagal memuat pesan tamu')
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn(() => loadMessages(), 300)

function handleSearch(value) {
  search.value = value
  page.value = 1
  debouncedSearch()
}

function setPage(newPage) {
  page.value = newPage
  loadMessages()
}

async function confirmDelete(message) {
  const result = await Swal.fire({
    title: 'Hapus pesan?',
    text: 'Pesan ini akan dihapus permanen',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
  })
  if (!result.isConfirmed) return
  try {
    await deleteAdminGuestMessage(message.id)
    toast.success('Pesan dihapus')
    loadMessages()
  } catch (error) {
    toast.error(error.message || 'Gagal menghapus pesan')
  }
}

onMounted(() => {
  loadMessages()
})
</script>
