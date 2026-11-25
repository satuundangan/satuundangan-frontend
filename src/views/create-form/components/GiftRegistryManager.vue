<template>
  <div class="space-y-4 rounded-2xl border border-amber-200/80 bg-amber-50/40 p-5" data-test="gift-registry-manager">
    <!-- Header Card -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="flex items-center gap-2.5">
        <span class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 font-bold shrink-0">
          <i class="fa-solid fa-gifts text-base"></i>
        </span>
        <div>
          <h4 class="text-sm font-bold text-gray-800">Daftar Kado Impian & Wishlist (Anti-Kado Kembar)</h4>
          <p class="text-xs text-gray-500">
            Tamu dapat memilih kado fisik yang ingin dihadiahkan dan otomatis terkunci agar tidak kembar/ganda.
          </p>
        </div>
      </div>

      <button
        type="button"
        @click="openAddModal"
        class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
      >
        <i class="fa-solid fa-plus text-[10px]"></i>
        <span>Tambah Kado</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-6 text-center text-gray-400 space-y-1">
      <i class="fa-solid fa-circle-notch animate-spin text-lg text-amber-500"></i>
      <p class="text-xs">Memuat daftar kado...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="items.length === 0" class="py-6 text-center bg-white/70 rounded-xl border border-dashed border-amber-200 text-gray-400 space-y-1.5">
      <i class="fa-solid fa-gift text-2xl text-amber-400"></i>
      <p class="text-xs font-bold text-gray-700">Belum ada kado impian yang ditambahkan</p>
      <p class="text-[11px] text-gray-400 max-w-sm mx-auto">
        Tambahkan barang yang Anda butuhkan (cth: Air Fryer, Bedcover, Set Piring) beserta link marketplace.
      </p>
    </div>

    <!-- Items List Table / Cards -->
    <div v-else class="space-y-2.5">
      <div
        v-for="item in items"
        :key="item.id"
        class="p-3.5 rounded-xl border bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs transition-all"
        :class="item.status === 'CLAIMED' ? 'border-amber-300/80 bg-amber-50/20' : 'border-gray-200'"
      >
        <div class="space-y-1 min-w-0 flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <h5 class="text-xs font-black text-gray-900 truncate">{{ item.itemName }}</h5>
            <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {{ item.category || 'Lainnya' }}
            </span>
            <span
              v-if="item.status === 'CLAIMED'"
              class="inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200"
            >
              <i class="fa-solid fa-check text-[8px]"></i>
              <span>Diklaim oleh: {{ item.claimedByGuestName || 'Tamu' }}</span>
            </span>
            <span
              v-else
              class="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200"
            >
              Tersedia
            </span>
          </div>

          <div class="flex items-center gap-3 text-[11px] text-gray-500 flex-wrap">
            <span v-if="item.priceEstimate" class="font-bold text-amber-800">
              Est. {{ formatRupiah(item.priceEstimate) }}
            </span>
            <a
              v-if="item.productUrl"
              :href="item.productUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <span>Link Produk</span>
              <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
            </a>
            <span v-if="item.notes" class="text-gray-400">
              • {{ item.notes }}
            </span>
            <span v-if="item.claimedByPhone" class="text-slate-600">
              (WA: {{ item.claimedByPhone }})
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            v-if="item.status === 'CLAIMED'"
            type="button"
            @click="handleUnclaim(item)"
            class="px-2.5 py-1 text-[11px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors cursor-pointer"
            title="Batalkan status klaim agar kado bisa dipilih tamu lain"
          >
            Reset Klaim
          </button>
          <button
            type="button"
            @click="openEditModal(item)"
            class="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
            title="Edit kado"
          >
            <i class="fa-solid fa-pen-to-square text-xs"></i>
          </button>
          <button
            type="button"
            @click="handleDelete(item)"
            class="p-1.5 text-rose-400 hover:text-rose-600 transition-colors"
            title="Hapus kado"
          >
            <i class="fa-solid fa-trash text-xs"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Form Tambah / Edit Kado -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        @click.self="showModal = false"
      >
        <div class="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
          <div class="p-5 border-b border-gray-100 flex items-center justify-between bg-amber-50/50">
            <div class="flex items-center gap-2.5">
              <span class="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                <i class="fa-solid fa-gift"></i>
              </span>
              <h4 class="font-black text-sm text-gray-900">
                {{ editingItem ? 'Edit Kado Impian' : 'Tambah Kado Impian Baru' }}
              </h4>
            </div>
            <button
              type="button"
              @click="showModal = false"
              class="w-7 h-7 rounded-lg bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center text-xs"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form @submit.prevent="saveItem" class="p-5 space-y-3.5 overflow-y-auto custom-scrollbar flex-1">
            <div>
              <label class="block text-xs font-black text-gray-700 mb-1">
                Nama Barang / Kado <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="form.itemName"
                type="text"
                required
                placeholder="Cth: Air Fryer Philips HD9252 / Set Sprei Tencel King"
                class="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-black text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  v-model="form.category"
                  class="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
                >
                  <option value="Peralatan Dapur">Peralatan Dapur</option>
                  <option value="Elektronik Rumah">Elektronik Rumah</option>
                  <option value="Kamar Tidur">Kamar Tidur</option>
                  <option value="Ruang Tamu & Dekorasi">Ruang Tamu & Dekorasi</option>
                  <option value="Traveling / Honeymoon">Traveling / Honeymoon</option>
                  <option value="Voucher / Lainnya">Voucher / Lainnya</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-black text-gray-700 mb-1">
                  Estimasi Harga (Rp)
                </label>
                <input
                  v-model.number="form.priceEstimate"
                  type="number"
                  min="0"
                  step="10000"
                  placeholder="Cth: 750000"
                  class="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-black text-gray-700 mb-1">
                Link Produk / Marketplace (Opsional)
              </label>
              <input
                v-model="form.productUrl"
                type="url"
                placeholder="https://shopee.co.id/... atau https://tokopedia.com/..."
                class="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label class="block text-xs font-black text-gray-700 mb-1">
                Catatan / Spesifikasi (Opsional)
              </label>
              <textarea
                v-model="form.notes"
                rows="2"
                placeholder="Cth: Warna sage green atau hitam / ukuran 180x200"
                class="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
              ></textarea>
            </div>

            <div class="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                type="button"
                @click="showModal = false"
                :disabled="isSubmitting"
                class="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-5 py-2 rounded-xl text-xs font-black text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 transition-all flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
              >
                <i v-if="isSubmitting" class="fa-solid fa-circle-notch animate-spin text-xs"></i>
                <i v-else class="fa-solid fa-check text-xs"></i>
                <span>Simpan Kado</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import {
  getGiftRegistryItems,
  createGiftRegistryItem,
  updateGiftRegistryItem,
  deleteGiftRegistryItem,
  unclaimGiftRegistryItem,
} from '@/api/giftRegistry'
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  invitationId: {
    type: [Number, String],
    default: null,
  },
  formData: {
    type: Object,
    default: () => ({}),
  },
})

const items = ref([])
const loading = ref(false)
const showModal = ref(false)
const editingItem = ref(null)
const isSubmitting = ref(false)

const form = ref({
  itemName: '',
  category: 'Peralatan Dapur',
  priceEstimate: null,
  productUrl: '',
  notes: '',
})

function formatRupiah(num) {
  if (!num) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num)
}

async function loadItems() {
  if (!props.invitationId || props.invitationId === 'live-preview' || props.invitationId === 0) {
    if (Array.isArray(props.formData?.giftRegistryItems)) {
      items.value = props.formData.giftRegistryItems
    }
    return
  }

  loading.value = true
  try {
    const res = await getGiftRegistryItems(props.invitationId)
    const data = Array.isArray(res) ? res : res.data || []
    items.value = data
  } catch (err) {
    console.error('Failed to load gift registry items:', err)
  } finally {
    loading.value = false
  }
}

function openAddModal() {
  editingItem.value = null
  form.value = {
    itemName: '',
    category: 'Peralatan Dapur',
    priceEstimate: null,
    productUrl: '',
    notes: '',
  }
  showModal.value = true
}

function openEditModal(item) {
  editingItem.value = item
  form.value = {
    itemName: item.itemName,
    category: item.category || 'Peralatan Dapur',
    priceEstimate: item.priceEstimate || null,
    productUrl: item.productUrl || '',
    notes: item.notes || '',
  }
  showModal.value = true
}

async function saveItem() {
  const name = form.value.itemName.trim()
  if (!name) {
    toast.error('Nama kado wajib diisi')
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      itemName: name,
      category: form.value.category,
      priceEstimate: form.value.priceEstimate ? Number(form.value.priceEstimate) : undefined,
      productUrl: form.value.productUrl?.trim() || undefined,
      notes: form.value.notes?.trim() || undefined,
    }

    if (props.invitationId && props.invitationId !== 'live-preview' && props.invitationId !== 0) {
      if (editingItem.value) {
        const updated = await updateGiftRegistryItem(editingItem.value.id, payload)
        const updatedData = updated?.data || updated
        const idx = items.value.findIndex((i) => i.id === editingItem.value.id)
        if (idx !== -1) items.value[idx] = updatedData
        toast.success('Kado impian berhasil diperbarui')
      } else {
        const created = await createGiftRegistryItem(props.invitationId, payload)
        const createdData = created?.data || created
        items.value.unshift(createdData)
        toast.success('Kado impian berhasil ditambahkan')
      }
    } else {
      // Local draft state
      if (editingItem.value) {
        Object.assign(editingItem.value, payload)
      } else {
        const newItem = {
          id: 'temp-' + Date.now(),
          status: 'AVAILABLE',
          ...payload,
        }
        items.value.unshift(newItem)
        if (props.formData) {
          if (!Array.isArray(props.formData.giftRegistryItems)) {
            props.formData.giftRegistryItems = []
          }
          props.formData.giftRegistryItems.unshift(newItem)
        }
      }
      toast.success('Kado impian tersimpan di draf')
    }
    showModal.value = false
  } catch (err) {
    console.error('Error saving gift registry item:', err)
    toast.error(err.message || 'Gagal menyimpan kado impian')
  } finally {
    isSubmitting.value = false
  }
}

async function handleDelete(item) {
  if (!confirm(`Hapus kado "${item.itemName}" dari daftar wishlist?`)) return
  const prevItems = [...items.value]
  items.value = items.value.filter((i) => i.id !== item.id)

  try {
    if (props.invitationId && props.invitationId !== 'live-preview' && props.invitationId !== 0 && !item.id.startsWith('temp-')) {
      await deleteGiftRegistryItem(item.id)
    }
    toast.success('Kado berhasil dihapus')
  } catch (err) {
    items.value = prevItems
    toast.error('Gagal menghapus kado: ' + err.message)
  }
}

async function handleUnclaim(item) {
  if (!confirm(`Reset status kado "${item.itemName}" agar bisa diklaim tamu lain?`)) return
  const prevStatus = item.status
  const prevClaimer = item.claimedByGuestName
  item.status = 'AVAILABLE'
  item.claimedByGuestName = null

  try {
    if (props.invitationId && props.invitationId !== 'live-preview' && props.invitationId !== 0 && !item.id.startsWith('temp-')) {
      await unclaimGiftRegistryItem(item.id)
    }
    toast.success('Status kado berhasil direset')
  } catch (err) {
    item.status = prevStatus
    item.claimedByGuestName = prevClaimer
    toast.error('Gagal mereset status kado')
  }
}

watch(() => props.invitationId, () => {
  loadItems()
})

onMounted(() => {
  loadItems()
})
</script>
