<template>
  <AdminShell
    title="Undangan"
    description="Pantau seluruh undangan, status pembayaran, publikasi, dan masa berlaku"
    show-search
    :search="search"
    search-placeholder="Cari judul, pasangan, slug, email pemilik, atau order ID..."
    @update:search="handleSearch"
  >
    <!-- Filter Bar (ADM-004) -->
    <div class="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
      <div class="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <i class="fa-solid fa-filter text-slate-400"></i> Filter:
      </div>

      <!-- Filter Pembayaran -->
      <select
        v-model="selectedPaymentStatus"
        @change="handleFilterChange"
        class="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs focus:border-slate-400 focus:outline-none cursor-pointer"
      >
        <option value="all">Semua Status Bayar</option>
        <option value="paid">✅ Lunas Berbayar</option>
        <option value="free">🎁 Gratis / Promo</option>
        <option value="pending">⏳ Menunggu Pembayaran</option>
        <option value="failed">❌ Gagal</option>
        <option value="expired">🕰️ Expired</option>
        <option value="reconcile">⚠️ Perlu Rekonsiliasi</option>
        <option value="unpaid">🛒 Belum Checkout</option>
      </select>

      <!-- Filter Publikasi -->
      <select
        v-model="selectedPublished"
        @change="handleFilterChange"
        class="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs focus:border-slate-400 focus:outline-none cursor-pointer"
      >
        <option value="all">Semua Publikasi</option>
        <option value="published">🟢 Terbit (Online)</option>
        <option value="draft">⚪ Draft (Belum Terbit)</option>
      </select>

      <!-- Filter Paket -->
      <select
        v-model="selectedPackage"
        @change="handleFilterChange"
        class="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs focus:border-slate-400 focus:outline-none cursor-pointer"
      >
        <option value="all">Semua Paket</option>
        <option value="basic">Basic</option>
        <option value="premium">Premium</option>
        <option value="eksklusif">Eksklusif</option>
      </select>

      <!-- Reset Filter Button -->
      <button
        v-if="hasActiveFilters"
        @click="resetFilters"
        class="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <i class="fa-solid fa-rotate-left text-[10px]"></i> Reset
      </button>
    </div>

    <!-- Data Table -->
    <div class="card bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      <DataTable
        :value="invitations"
        lazy
        paginator
        :rows="limit"
        :totalRecords="total"
        :loading="loading"
        @page="onPage"
        class="p-datatable-sm bg-white"
        dataKey="id"
      >
        <template #empty>
          <div class="py-12 text-center text-slate-400">
            <i class="fa-solid fa-envelope-open-text text-3xl mb-2 text-slate-300"></i>
            <p class="text-sm font-semibold text-slate-700">Tidak ada undangan ditemukan</p>
            <p class="text-xs text-slate-400">Coba ubah filter pencarian atau kata kunci di atas.</p>
          </div>
        </template>
        <template #loading> Memuat data undangan. Silakan tunggu... </template>

        <!-- Undangan & Slug -->
        <Column field="title" header="Undangan" style="min-width: 14rem">
          <template #body="{ data }">
            <div class="flex flex-col">
              <span class="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors cursor-pointer" @click="openDetail(data.id)">
                {{ data.title }}
              </span>
              <span v-if="data.coupleName" class="text-xs text-slate-500 font-medium mt-0.5">
                {{ data.coupleName }}
              </span>
              <div class="flex items-center gap-1.5 mt-1">
                <span class="font-mono text-[11px] text-slate-400">/{{ data.slug }}</span>
                <button
                  @click="copyLink(data.slug)"
                  class="text-slate-400 hover:text-slate-700 text-[10px] p-0.5"
                  title="Salin Link Preview"
                >
                  <i class="fa-regular fa-copy"></i>
                </button>
              </div>
            </div>
          </template>
        </Column>

        <!-- Pemilik -->
        <Column field="user" header="Pemilik" style="min-width: 12rem">
          <template #body="{ data }">
            <div class="flex flex-col">
              <span class="font-semibold text-slate-800 text-xs">{{ data.user?.name || '-' }}</span>
              <span class="text-[11px] text-slate-500 font-mono">{{ data.user?.email || '-' }}</span>
            </div>
          </template>
        </Column>

        <!-- Paket & Publikasi (ADM-002) -->
        <Column header="Paket & Status" style="min-width: 10rem">
          <template #body="{ data }">
            <div class="flex flex-col gap-1 items-start">
              <!-- Badge Paket -->
              <span
                :class="[
                  'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border',
                  data.package === 'eksklusif' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                  data.package === 'premium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-slate-100 text-slate-700 border-slate-200'
                ]"
              >
                {{ data.package || 'Basic' }}
              </span>
              <!-- Status Publikasi -->
              <span
                v-if="data.isPublished"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Terbit
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Draft
              </span>
            </div>
          </template>
        </Column>

        <!-- Status Pembayaran (ADM-001) -->
        <Column header="Pembayaran" style="min-width: 12rem">
          <template #body="{ data }">
            <div class="flex flex-col gap-1 items-start">
              <span
                v-if="data.paymentStatus"
                :class="[
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border shadow-2xs',
                  data.paymentStatus.variant === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  data.paymentStatus.variant === 'info' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  data.paymentStatus.variant === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  data.paymentStatus.variant === 'danger' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  'bg-slate-50 text-slate-600 border-slate-200'
                ]"
              >
                <i
                  :class="[
                    'text-[10px]',
                    data.paymentStatus.code === 'paid' ? 'fa-solid fa-circle-check text-emerald-600' :
                    data.paymentStatus.code === 'free' ? 'fa-solid fa-gift text-blue-600' :
                    data.paymentStatus.code === 'reconcile' ? 'fa-solid fa-triangle-exclamation text-rose-600 animate-pulse' :
                    data.paymentStatus.code === 'pending' ? 'fa-solid fa-hourglass-half text-amber-600' :
                    'fa-solid fa-circle-minus text-slate-400'
                  ]"
                ></i>
                {{ data.paymentStatus.label }}
              </span>
              <span v-if="data.paymentStatus?.code === 'reconcile'" class="text-[10px] text-rose-600 font-semibold">
                ⚠️ Terbit tanpa payment lunas!
              </span>
            </div>
          </template>
        </Column>

        <!-- Transaksi Terakhir (ADM-003) -->
        <Column header="Transaksi Terakhir" style="min-width: 11rem">
          <template #body="{ data }">
            <div v-if="data.latestTransaction" class="flex flex-col text-xs">
              <span class="font-bold text-slate-900">
                {{ formatRupiah(data.latestTransaction.amount) }}
              </span>
              <span class="font-mono text-[10px] text-slate-500 truncate max-w-[130px]" :title="data.latestTransaction.orderId">
                {{ data.latestTransaction.orderId }}
              </span>
              <span class="text-[10px] text-slate-400 mt-0.5">
                {{ data.latestTransaction.paymentType || data.latestTransaction.paymentMethod || 'Metode -' }}
              </span>
            </div>
            <span v-else class="text-xs text-slate-400">-</span>
          </template>
        </Column>

        <!-- Masa Berlaku (ADM-002) -->
        <Column header="Masa Berlaku" style="min-width: 10rem">
          <template #body="{ data }">
            <div class="flex flex-col text-xs">
              <span
                v-if="data.expiry"
                :class="[
                  'font-bold',
                  data.expiry.isExpired ? 'text-rose-600' : 'text-slate-800'
                ]"
              >
                {{ data.expiry.label }}
              </span>
              <span v-if="data.expiredAt" class="text-[10px] text-slate-400 mt-0.5">
                {{ formatDate(data.expiredAt) }}
              </span>
              <span v-else class="text-xs text-slate-400">-</span>
            </div>
          </template>
        </Column>

        <!-- Aksi -->
        <Column header="Aksi" headerClass="text-right" bodyClass="text-right" style="min-width: 14rem">
          <template #body="{ data }">
            <div class="flex justify-end gap-1.5 text-xs font-medium">
              <!-- Detail Terpadu Button (ADM-005) -->
              <button
                @click="openDetail(data.id)"
                class="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                title="Lihat Detail Terpadu"
              >
                <i class="fa-solid fa-circle-info text-[11px] text-blue-600"></i> Detail
              </button>
              <RouterLink
                :to="`/admin/invitations/${data.id}/edit`"
                class="flex h-8 items-center gap-1.5 rounded-lg border border-amber-200 px-2.5 text-amber-600 hover:bg-amber-50 transition-colors"
                title="Edit Undangan"
              >
                <i class="fa-solid fa-pencil text-[10px]"></i> Edit
              </RouterLink>
              <a
                :href="`/preview?slug=${data.slug}`"
                target="_blank"
                class="flex h-8 items-center gap-1.5 rounded-lg border border-blue-200 px-2.5 text-blue-600 hover:bg-blue-50 transition-colors"
                title="Lihat Live Preview"
              >
                <i class="fa-solid fa-eye text-[10px]"></i> Lihat
              </a>
              <button
                class="flex h-8 items-center gap-1.5 rounded-lg border border-rose-200 px-2.5 text-rose-600 hover:bg-rose-50 transition-colors"
                @click="confirmDelete(data)"
                title="Hapus Undangan"
              >
                <i class="fa-solid fa-trash text-[10px]"></i>
              </button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal Detail Undangan Terpadu (ADM-005) -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs transition-opacity"
      @click.self="closeDetail"
    >
      <div class="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50/60">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#a47148]/10 text-[#a47148]">
              <i class="fa-solid fa-envelope-open-text text-lg"></i>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-slate-900">
                {{ detailData?.title || 'Detail Undangan' }}
              </h3>
              <p class="text-xs text-slate-400 font-mono">/{{ detailData?.slug }}</p>
            </div>
          </div>
          <button
            @click="closeDetail"
            class="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition"
          >
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <div v-if="loadingDetail" class="flex flex-col items-center justify-center py-16 text-slate-400">
            <i class="fa-solid fa-circle-notch animate-spin text-3xl mb-3 text-slate-900"></i>
            <p class="text-xs font-bold">Memuat rincian terpadu...</p>
          </div>

          <template v-else-if="detailData">
            <!-- Status & Badges Strip -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Bayar</p>
                <p class="text-xs font-extrabold text-slate-900 mt-0.5">
                  {{ detailData.paymentStatus?.label || '-' }}
                </p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Publikasi</p>
                <p class="text-xs font-extrabold mt-0.5" :class="detailData.isPublished ? 'text-emerald-600' : 'text-slate-500'">
                  {{ detailData.isPublished ? 'Terbit (Online)' : 'Draft' }}
                </p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Paket Aktif</p>
                <p class="text-xs font-extrabold text-slate-900 uppercase mt-0.5">
                  {{ detailData.package || 'Basic' }}
                </p>
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Masa Berlaku</p>
                <p class="text-xs font-extrabold mt-0.5" :class="detailData.expiry?.isExpired ? 'text-rose-600' : 'text-slate-900'">
                  {{ detailData.expiry?.label || '-' }}
                </p>
              </div>
            </div>

            <!-- Bagian 1: Pemilik & Konten -->
            <div class="space-y-3">
              <h4 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <i class="fa-solid fa-user text-slate-400"></i> Informasi Pemilik & Pasangan
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white rounded-xl border border-slate-100 p-4">
                <div>
                  <span class="text-slate-400 block">Nama Pemilik:</span>
                  <span class="font-bold text-slate-800">{{ detailData.user?.name || '-' }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block">Email Pemilik:</span>
                  <span class="font-bold text-slate-800 font-mono">{{ detailData.user?.email || '-' }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block">Nama Pasangan:</span>
                  <span class="font-bold text-slate-800">{{ detailData.coupleName || '-' }}</span>
                </div>
                <div>
                  <span class="text-slate-400 block">Template Desain:</span>
                  <span class="font-bold text-slate-800">{{ detailData.templateDesign?.name || 'Standar' }}</span>
                </div>
              </div>
            </div>

            <!-- Bagian 2: Ringkasan Tamu & RSVP -->
            <div class="space-y-3">
              <h4 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <i class="fa-solid fa-users text-slate-400"></i> Ringkasan Tamu & RSVP
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">Total Tamu</span>
                  <span class="text-base font-extrabold text-slate-900">{{ detailData.stats?.totalGuests || 0 }}</span>
                </div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span class="text-[10px] text-slate-400 uppercase font-bold block">Ucapan Masuk</span>
                  <span class="text-base font-extrabold text-slate-900">{{ detailData.stats?.totalMessages || 0 }}</span>
                </div>
                <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span class="text-[10px] text-emerald-600 uppercase font-bold block">Hadir</span>
                  <span class="text-base font-extrabold text-emerald-700">{{ detailData.stats?.attendingCount || 0 }}</span>
                </div>
                <div class="p-3 bg-rose-50 rounded-xl border border-rose-100">
                  <span class="text-[10px] text-rose-600 uppercase font-bold block">Tidak Hadir</span>
                  <span class="text-base font-extrabold text-rose-700">{{ detailData.stats?.notAttendingCount || 0 }}</span>
                </div>
                <div class="p-3 bg-amber-50 rounded-xl border border-amber-100 col-span-2 sm:col-span-1">
                  <span class="text-[10px] text-amber-600 uppercase font-bold block">Ragu-ragu</span>
                  <span class="text-base font-extrabold text-amber-700">{{ detailData.stats?.uncertainCount || 0 }}</span>
                </div>
              </div>
              <p class="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                <i class="fa-solid fa-circle-info text-blue-500"></i>
                <span>Status pengiriman tautan pada buku tamu merupakan penandaan internal pengguna dan tidak mewakili konfirmasi delivery API WhatsApp.</span>
              </p>
            </div>

            <!-- Bagian 3: Riwayat Transaksi Lengkap -->
            <div class="space-y-3">
              <h4 class="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <i class="fa-solid fa-receipt text-slate-400"></i> Riwayat Transaksi Pembayaran ({{ (detailData.allPayments || []).length }})
              </h4>
              <div v-if="(detailData.allPayments || []).length > 0" class="overflow-x-auto rounded-xl border border-slate-100">
                <table class="w-full text-left text-xs">
                  <thead class="bg-slate-50 text-[10px] text-slate-400 uppercase font-extrabold border-b border-slate-100">
                    <tr>
                      <th class="p-2.5">Order ID</th>
                      <th class="p-2.5">Nominal</th>
                      <th class="p-2.5">Status</th>
                      <th class="p-2.5">Metode</th>
                      <th class="p-2.5">Tanggal Lunas</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="tx in detailData.allPayments" :key="tx.id" class="hover:bg-slate-50/50">
                      <td class="p-2.5 font-mono font-medium text-slate-800">{{ tx.orderId }}</td>
                      <td class="p-2.5 font-extrabold text-slate-900">{{ formatRupiah(tx.amount) }}</td>
                      <td class="p-2.5">
                        <span
                          :class="[
                            'px-2 py-0.5 rounded-md text-[10px] font-bold uppercase',
                            String(tx.status).toLowerCase() === 'success' ? 'bg-emerald-50 text-emerald-700' :
                            String(tx.status).toLowerCase() === 'pending' ? 'bg-amber-50 text-amber-700' :
                            'bg-rose-50 text-rose-700'
                          ]"
                        >
                          {{ tx.status }}
                        </span>
                      </td>
                      <td class="p-2.5 text-slate-600">{{ tx.paymentType || tx.paymentMethod || '-' }}</td>
                      <td class="p-2.5 text-slate-500 font-mono text-[11px]">{{ formatDate(tx.settlementTime || tx.createdAt) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="text-xs text-slate-400 p-4 text-center border border-dashed border-slate-200 rounded-xl">
                Belum ada transaksi pembayaran untuk undangan ini.
              </div>
            </div>
          </template>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-between border-t border-slate-100 p-4 bg-slate-50/60">
          <div class="flex items-center gap-2">
            <a
              v-if="detailData?.slug"
              :href="`/preview?slug=${detailData.slug}`"
              target="_blank"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 text-xs font-bold transition"
            >
              <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i> Live Preview
            </a>
            <RouterLink
              v-if="detailData?.id"
              :to="`/admin/invitations/${detailData.id}/edit`"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 text-amber-600 bg-amber-50 hover:bg-amber-100 text-xs font-bold transition"
            >
              <i class="fa-solid fa-pencil text-[10px]"></i> Edit
            </RouterLink>
          </div>
          <button
            @click="closeDetail"
            class="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </AdminShell>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import AdminShell from '@/components/admin/AdminShell.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { fetchAdminInvitations, fetchAdminInvitationDetail, deleteAdminInvitation } from '@/api/admin.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const invitations = ref([])
const total = ref(0)
const page = ref(1)
const limit = 10
const search = ref(route.query.q || '')
const selectedPaymentStatus = ref(route.query.paymentStatus || 'all')
const selectedPublished = ref(route.query.isPublished || 'all')
const selectedPackage = ref(route.query.package || 'all')
const loading = ref(false)

// Unified Detail Modal State
const showDetailModal = ref(false)
const loadingDetail = ref(false)
const detailData = ref(null)

const hasActiveFilters = computed(() => {
  return (
    search.value.trim() !== '' ||
    selectedPaymentStatus.value !== 'all' ||
    selectedPublished.value !== 'all' ||
    selectedPackage.value !== 'all'
  )
})

function formatRupiah(val) {
  const num = Number(val) || 0
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num)
}

function formatDate(dateString) {
  if (!dateString) return '-'
  const d = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d)
}

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

function syncUrlParams() {
  const query = {}
  if (page.value > 1) query.page = String(page.value)
  if (search.value.trim()) query.q = search.value.trim()
  if (selectedPaymentStatus.value !== 'all') query.paymentStatus = selectedPaymentStatus.value
  if (selectedPublished.value !== 'all') query.isPublished = selectedPublished.value
  if (selectedPackage.value !== 'all') query.package = selectedPackage.value
  router.replace({ query }).catch(() => {})
}

async function loadInvitations() {
  loading.value = true
  syncUrlParams()
  try {
    const params = {
      page: page.value,
      limit,
      q: search.value.trim() || undefined,
      paymentStatus: selectedPaymentStatus.value !== 'all' ? selectedPaymentStatus.value : undefined,
      isPublished: selectedPublished.value !== 'all' ? selectedPublished.value : undefined,
      package: selectedPackage.value !== 'all' ? selectedPackage.value : undefined,
    }
    const res = await fetchAdminInvitations(params)
    invitations.value = res.data
    total.value = res.total
  } catch (error) {
    toast.error(error.message || 'Gagal memuat data undangan')
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn(() => {
  page.value = 1
  loadInvitations()
}, 300)

function handleSearch(value) {
  search.value = value
  debouncedSearch()
}

function handleFilterChange() {
  page.value = 1
  loadInvitations()
}

function resetFilters() {
  search.value = ''
  selectedPaymentStatus.value = 'all'
  selectedPublished.value = 'all'
  selectedPackage.value = 'all'
  page.value = 1
  loadInvitations()
}

function onPage(event) {
  page.value = event.page + 1
  loadInvitations()
}

function copyLink(slug) {
  const url = `${window.location.origin}/preview?slug=${slug}`
  navigator.clipboard.writeText(url)
  toast.success('Link preview disalin ke clipboard')
}

async function openDetail(id) {
  showDetailModal.value = true
  loadingDetail.value = true
  try {
    detailData.value = await fetchAdminInvitationDetail(id)
  } catch (err) {
    toast.error(err.message || 'Gagal memuat rincian undangan')
    showDetailModal.value = false
  } finally {
    loadingDetail.value = false
  }
}

function closeDetail() {
  showDetailModal.value = false
  detailData.value = null
}

async function confirmDelete(invitation) {
  const result = await Swal.fire({
    title: 'Hapus undangan?',
    html: `
      <p class="text-sm text-slate-600">Undangan <strong>${invitation.title}</strong> akan dihapus permanen.</p>
      <p class="text-xs text-amber-600 mt-2">Catatan: Riwayat transaksi pembayaran di sistem tetap akan diarsipkan untuk pelaporan keuangan.</p>
    `,
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
    toast.success('Undangan berhasil dihapus')
    loadInvitations()
  } catch (error) {
    toast.error(error.message || 'Gagal menghapus undangan')
  }
}

onMounted(() => {
  loadInvitations()
})
</script>
