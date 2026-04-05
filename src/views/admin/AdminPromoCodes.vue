<template>
  <AdminShell
    title="Promo Code"
    description="Kelola kode promo & diskon"
    show-search
    :search="search"
    search-placeholder="Cari kode promo"
    action-label="Tambah Promo"
    @update:search="handleSearch"
    @action="openCreate"
  >
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table class="min-w-full divide-y divide-slate-200 text-sm">
        <thead class="bg-slate-50 text-left font-medium text-slate-500">
          <tr>
            <th class="px-4 py-3">Kode</th>
            <th class="px-4 py-3">Tipe</th>
            <th class="px-4 py-3">Nilai</th>
            <th class="px-4 py-3">Pemakaian</th>
            <th class="px-4 py-3">Berlaku Hingga</th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-for="promo in promoCodes" :key="promo.id" class="hover:bg-slate-50/50">
            <td class="px-4 py-3 font-mono font-bold text-slate-900 tracking-wider">{{ promo.code }}</td>
            <td class="px-4 py-3 text-slate-600">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                :class="promo.discount_type === 'percentage' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'">
                {{ promo.discount_type === 'percentage' ? 'Persentase' : 'Fixed' }}
              </span>
            </td>
            <td class="px-4 py-3 font-medium text-slate-700">
              {{ promo.discount_type === 'percentage' ? `${promo.discount_value}%` : formatCurrency(promo.discount_value) }}
            </td>
            <td class="px-4 py-3 text-slate-600">
              {{ promo.used_count ?? 0 }}{{ promo.max_uses ? ` / ${promo.max_uses}` : ' / ∞' }}
            </td>
            <td class="px-4 py-3 text-slate-600">
              {{ promo.valid_until ? formatDate(promo.valid_until) : '—' }}
            </td>
            <td class="px-4 py-3">
              <button
                @click="toggleActive(promo)"
                class="px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors"
                :class="promo.is_active ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'"
              >
                {{ promo.is_active ? 'Aktif' : 'Nonaktif' }}
              </button>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2 text-xs font-medium">
                <button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50"
                  @click="openEdit(promo)">Edit</button>
                <button class="rounded-lg border border-rose-200 px-3 py-1 text-rose-600 hover:bg-rose-50"
                  @click="confirmDelete(promo)">Hapus</button>
              </div>
            </td>
          </tr>
          <tr v-if="!loading && !promoCodes.length">
            <td colspan="7" class="px-4 py-8 text-center text-slate-400">Tidak ada data</td>
          </tr>
          <tr v-if="loading">
            <td colspan="7" class="px-4 py-8 text-center text-slate-400">Memuat data…</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="total > limit" class="mt-4 flex items-center justify-between text-sm text-slate-600">
      <p>Menampilkan halaman {{ page }} dari {{ totalPages }}</p>
      <div class="flex items-center gap-2">
        <button class="rounded-lg border border-slate-200 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="page === 1" @click="setPage(page - 1)">Sebelumnya</button>
        <button class="rounded-lg border border-slate-200 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="page === totalPages" @click="setPage(page + 1)">Berikutnya</button>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
        <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900">{{ editing ? 'Edit Promo Code' : 'Tambah Promo Code' }}</h2>
            <button class="text-slate-400 hover:text-slate-600" @click="closeForm">×</button>
          </div>

          <form class="grid grid-cols-1 gap-4" @submit.prevent="submitForm">
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="text-sm font-medium text-slate-600">Kode Promo <span class="text-rose-500">*</span></label>
                <input v-model="form.code" type="text" required :disabled="!!editing"
                  class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm uppercase tracking-wider outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50 disabled:text-slate-400"
                  placeholder="Contoh: NIKAH50" />
              </div>

              <div>
                <label class="text-sm font-medium text-slate-600">Tipe Diskon <span class="text-rose-500">*</span></label>
                <select v-model="form.discount_type" required
                  class="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100">
                  <option value="percentage">Persentase (%)</option>
                  <option value="fixed">Fixed (Rp)</option>
                </select>
              </div>

              <div>
                <label class="text-sm font-medium text-slate-600">
                  Nilai Diskon <span class="text-rose-500">*</span>
                  <span class="text-slate-400 font-normal">({{ form.discount_type === 'percentage' ? '%' : 'Rp' }})</span>
                </label>
                <input v-model.number="form.discount_value" type="number" required min="0"
                  :max="form.discount_type === 'percentage' ? 100 : undefined"
                  class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  placeholder="50" />
              </div>

              <div>
                <label class="text-sm font-medium text-slate-600">Maks. Pemakaian</label>
                <input v-model.number="form.max_uses" type="number" min="1"
                  class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  placeholder="Kosong = tidak terbatas" />
              </div>

              <div>
                <label class="text-sm font-medium text-slate-600">Berlaku Dari</label>
                <input v-model="form.valid_from" type="datetime-local"
                  class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
              </div>

              <div class="col-span-2">
                <label class="text-sm font-medium text-slate-600">Berlaku Hingga</label>
                <input v-model="form.valid_until" type="datetime-local"
                  class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
              </div>

              <div class="col-span-2 flex items-center gap-3">
                <input type="checkbox" id="is_active" v-model="form.is_active"
                  class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400" />
                <label for="is_active" class="text-sm font-medium text-slate-600 cursor-pointer">Aktifkan promo code ini</label>
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-2 text-sm font-medium">
              <button type="button" class="rounded-lg border border-slate-200 px-4 py-2"
                @click="closeForm">Batal</button>
              <button type="submit" :disabled="saving"
                class="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-60">
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
import { useDebounceFn } from '@vueuse/core'
import AdminShell from '@/components/admin/AdminShell.vue'
import {
  fetchAdminPromoCodes,
  createAdminPromoCode,
  updateAdminPromoCode,
  deleteAdminPromoCode,
} from '@/api/admin.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const promoCodes = ref([])
const total = ref(0)
const page = ref(1)
const limit = 20
const search = ref('')
const loading = ref(false)
const showForm = ref(false)
const saving = ref(false)
const editing = ref(null)

const form = reactive({
  code: '',
  discount_type: 'percentage',
  discount_value: null,
  max_uses: null,
  valid_from: '',
  valid_until: '',
  is_active: true,
})

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)))

async function loadData() {
  loading.value = true
  try {
    const res = await fetchAdminPromoCodes({ page: page.value, limit, q: search.value })
    promoCodes.value = res.data || []
    total.value = res.total || 0
  } catch (error) {
    toast.error(error.message || 'Gagal memuat data')
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn(() => loadData(), 300)

function handleSearch(value) {
  search.value = value
  page.value = 1
  debouncedSearch()
}

function setPage(newPage) {
  page.value = newPage
  loadData()
}

function openCreate() {
  editing.value = null
  Object.assign(form, {
    code: '',
    discount_type: 'percentage',
    discount_value: null,
    max_uses: null,
    valid_from: '',
    valid_until: '',
    is_active: true,
  })
  showForm.value = true
}

function openEdit(promo) {
  editing.value = promo
  Object.assign(form, {
    code: promo.code || '',
    discount_type: promo.discount_type || 'percentage',
    discount_value: promo.discount_value ?? null,
    max_uses: promo.max_uses ?? null,
    valid_from: promo.valid_from ? toLocalDatetime(promo.valid_from) : '',
    valid_until: promo.valid_until ? toLocalDatetime(promo.valid_until) : '',
    is_active: promo.is_active ?? true,
  })
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  saving.value = false
}

async function submitForm() {
  if (saving.value) return
  try {
    saving.value = true
    const payload = {
      code: form.code.trim().toUpperCase(),
      discount_type: form.discount_type,
      discount_value: form.discount_value,
      is_active: form.is_active,
    }
    if (form.max_uses) payload.max_uses = form.max_uses
    if (form.valid_from) payload.valid_from = new Date(form.valid_from).toISOString()
    if (form.valid_until) payload.valid_until = new Date(form.valid_until).toISOString()

    if (editing.value) {
      await updateAdminPromoCode(editing.value.id, payload)
      toast.success('Promo code diperbarui')
    } else {
      await createAdminPromoCode(payload)
      toast.success('Promo code dibuat')
    }
    showForm.value = false
    loadData()
  } catch (error) {
    toast.error(error.message || 'Gagal menyimpan promo code')
  } finally {
    saving.value = false
  }
}

async function toggleActive(promo) {
  try {
    await updateAdminPromoCode(promo.id, { is_active: !promo.is_active })
    promo.is_active = !promo.is_active
    toast.success(`Promo ${promo.is_active ? 'diaktifkan' : 'dinonaktifkan'}`)
  } catch (error) {
    toast.error(error.message || 'Gagal mengubah status')
  }
}

async function confirmDelete(promo) {
  const result = await Swal.fire({
    title: 'Hapus promo code?',
    text: `Kode "${promo.code}" akan dihapus permanen`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
  })
  if (!result.isConfirmed) return
  try {
    await deleteAdminPromoCode(promo.id)
    toast.success('Promo code dihapus')
    loadData()
  } catch (error) {
    toast.error(error.message || 'Gagal menghapus promo code')
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function toLocalDatetime(isoString) {
  const d = new Date(isoString)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

onMounted(() => {
  loadData()
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
