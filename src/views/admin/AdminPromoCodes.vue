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
    <DataTable
      :headers="headers"
      :items="promoCodes"
      :loading="loading"
      :total="total"
      v-model:page="page"
      :limit="limit"
      @update:page="setPage"
    >
      <template #cell(code)="{ item }">
        <span class="font-mono font-bold text-slate-900 tracking-wider">{{ item.code }}</span>
      </template>
      <template #cell(discount_type)="{ item }">
        <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
          :class="item.discount_type === 'percentage' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'">
          {{ item.discount_type === 'percentage' ? 'Persentase' : 'Fixed' }}
        </span>
      </template>
      <template #cell(discount_value)="{ item }">
        <span class="font-medium text-slate-700">
          {{ item.discount_type === 'percentage' ? `${item.discount_value}%` : formatCurrency(item.discount_value) }}
        </span>
      </template>
      <template #cell(usage)="{ item }">
        <span class="text-slate-600">
          {{ item.used_count ?? 0 }}{{ item.max_uses ? ` / ${item.max_uses}` : ' / ∞' }}
        </span>
      </template>
      <template #cell(valid_until)="{ item }">
        <span class="text-slate-600">
          {{ item.valid_until ? formatDate(item.valid_until) : '—' }}
        </span>
      </template>
      <template #cell(is_active)="{ item }">
        <div class="flex flex-col gap-1 items-start">
          <button
            @click="toggleActive(item)"
            class="px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors"
            :class="item.is_active ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'"
          >
            {{ item.is_active ? 'Aktif' : 'Nonaktif' }}
          </button>
          <span v-if="item.is_exit_intent_active" class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-50 text-amber-600 border border-amber-200">
            Exit Intent
          </span>
        </div>
      </template>
      <template #cell(actions)="{ item }">
        <div class="flex justify-end gap-2 text-xs font-medium">
          <button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 transition-colors"
            @click="openEdit(item)">Edit</button>
          <button class="rounded-lg border border-rose-200 px-3 py-1 text-rose-600 hover:bg-rose-50 transition-colors"
            @click="confirmDelete(item)">Hapus</button>
        </div>
      </template>
    </DataTable>

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

              <!-- Exit Intent Config -->
              <div class="col-span-2 mt-4 pt-4 border-t border-slate-100">
                <h4 class="text-sm font-semibold text-slate-800 mb-3">Pengaturan Promo Landing Page (Exit-Intent)</h4>
                <div class="flex items-center gap-3 mb-3">
                  <input type="checkbox" id="is_exit_intent" v-model="form.is_exit_intent_active"
                    class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400" />
                  <label for="is_exit_intent" class="text-sm font-medium text-slate-600 cursor-pointer">Jadikan promo ini sebagai penawaran Exit-Intent</label>
                </div>
                <div v-if="form.is_exit_intent_active">
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">Teks Promo Exit Intent</label>
                  <textarea v-model="form.exit_intent_text" rows="2" placeholder="Contoh: Khusus untuk Anda yang mendaftar hari ini..."
                    class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"></textarea>
                </div>
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
import DataTable from '@/components/admin/DataTable.vue'
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

const headers = [
  { label: 'Kode', key: 'code' },
  { label: 'Tipe', key: 'discount_type' },
  { label: 'Nilai', key: 'discount_value' },
  { label: 'Pemakaian', key: 'usage' },
  { label: 'Berlaku Hingga', key: 'valid_until' },
  { label: 'Status', key: 'is_active' },
  { label: 'Aksi', key: 'actions', class: 'text-right' },
]

const form = reactive({
  code: '',
  discount_type: 'percentage',
  discount_value: null,
  max_uses: null,
  valid_from: '',
  valid_until: '',
  is_active: true,
  is_exit_intent_active: false,
  exit_intent_text: '',
})

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
    is_exit_intent_active: false,
    exit_intent_text: '',
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
    is_exit_intent_active: promo.is_exit_intent_active ?? false,
    exit_intent_text: promo.exit_intent_text || '',
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
      is_exit_intent_active: form.is_exit_intent_active,
      exit_intent_text: form.exit_intent_text,
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
