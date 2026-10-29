<template>
  <AdminShell
    title="Pembayaran & Transaksi"
    description="Pusat pencatatan transaksi, rekonsiliasi gateway, bukti transfer, dan pemantauan omzet platform"
    show-search
    :search="search"
    search-placeholder="Cari Order ID, nama pembayar, email, slug undangan, atau ID gateway..."
    @update:search="handleSearch"
  >
    <!-- Header Action Slot: Export CSV -->
    <template #actions>
      <div class="flex items-center gap-2">
        <button
          @click="handleExportCsv"
          :disabled="loadingExport"
          class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors disabled:opacity-50"
          title="Ekspor CSV Data Transaksi"
        >
          <i :class="loadingExport ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-file-export'" class="text-emerald-600"></i>
          <span>Ekspor CSV</span>
        </button>
        <button
          @click="loadAllData"
          :disabled="loading"
          class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
          title="Segarkan Data"
        >
          <i :class="loading ? 'fa-solid fa-arrows-rotate fa-spin' : 'fa-solid fa-arrows-rotate'" class="text-blue-600"></i>
          <span>Refresh</span>
        </button>
      </div>
    </template>

    <!-- Financial KPI Summary Cards (ADM-013) -->
    <div class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>Omzet Bersih</span>
          <i class="fa-solid fa-wallet text-emerald-500"></i>
        </div>
        <div class="mt-2 text-lg font-black text-slate-900 tracking-tight">
          {{ formatRupiah(stats?.netRevenue || 0) }}
        </div>
        <div class="mt-1 text-[11px] text-slate-500">
          Total transaksi sukses
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>Diskon Promo</span>
          <i class="fa-solid fa-tag text-purple-500"></i>
        </div>
        <div class="mt-2 text-lg font-black text-purple-700 tracking-tight">
          {{ formatRupiah(stats?.discountTotal || 0) }}
        </div>
        <div class="mt-1 text-[11px] text-slate-500">
          Potongan voucher digunakan
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>Sukses</span>
          <i class="fa-solid fa-circle-check text-emerald-600"></i>
        </div>
        <div class="mt-2 text-lg font-black text-emerald-700 tracking-tight">
          {{ stats?.statusCounts?.success || 0 }}
        </div>
        <div class="mt-1 text-[11px] text-slate-500">
          Order lunas
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>Menunggu</span>
          <i class="fa-solid fa-clock text-amber-500"></i>
        </div>
        <div class="mt-2 text-lg font-black text-amber-600 tracking-tight">
          {{ stats?.statusCounts?.pending || 0 }}
        </div>
        <div class="mt-1 text-[11px] text-slate-500">
          <span v-if="stats?.pendingAgingCount > 0" class="font-bold text-rose-600">
            {{ stats.pendingAgingCount }} aging >24j
          </span>
          <span v-else>Aktif</span>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>Gagal / Expired</span>
          <i class="fa-solid fa-ban text-rose-500"></i>
        </div>
        <div class="mt-2 text-lg font-black text-rose-600 tracking-tight">
          {{ (stats?.statusCounts?.failed || 0) + (stats?.statusCounts?.expired || 0) }}
        </div>
        <div class="mt-1 text-[11px] text-slate-500">
          Batal / kadaluarsa
        </div>
      </div>

      <div
        @click="activeTab = 'reconciliation'"
        :class="[
          'rounded-2xl border p-4 shadow-xs cursor-pointer transition-all',
          (reconData?.count || 0) > 0
            ? 'border-rose-300 bg-rose-50/50 hover:bg-rose-50'
            : 'border-slate-200 bg-white hover:bg-slate-50'
        ]"
      >
        <div class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>Rekonsiliasi</span>
          <i class="fa-solid fa-triangle-exclamation" :class="(reconData?.count || 0) > 0 ? 'text-rose-600' : 'text-slate-400'"></i>
        </div>
        <div class="mt-2 text-lg font-black tracking-tight" :class="(reconData?.count || 0) > 0 ? 'text-rose-700' : 'text-slate-700'">
          {{ reconData?.count || 0 }}
        </div>
        <div class="mt-1 text-[11px] font-semibold" :class="(reconData?.count || 0) > 0 ? 'text-rose-600' : 'text-slate-500'">
          {{ (reconData?.count || 0) > 0 ? 'Perlu tindakan segera' : 'Semua tersinkron' }}
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="mb-4 flex items-center gap-2 border-b border-slate-200">
      <button
        @click="activeTab = 'transactions'"
        :class="[
          'flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors',
          activeTab === 'transactions'
            ? 'border-slate-900 text-slate-900'
            : 'border-transparent text-slate-500 hover:text-slate-800'
        ]"
      >
        <i class="fa-solid fa-list-check"></i>
        <span>Semua Transaksi</span>
        <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 font-black">
          {{ total }}
        </span>
      </button>

      <button
        @click="activeTab = 'reconciliation'"
        :class="[
          'flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-colors',
          activeTab === 'reconciliation'
            ? 'border-rose-600 text-rose-600'
            : 'border-transparent text-slate-500 hover:text-slate-800'
        ]"
      >
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span>Antrean Rekonsiliasi (ADM-011)</span>
        <span
          v-if="(reconData?.count || 0) > 0"
          class="rounded-full bg-rose-100 text-rose-700 px-2 py-0.5 text-[10px] font-black"
        >
          {{ reconData.count }}
        </span>
      </button>
    </div>

    <!-- TAB 1: Semua Transaksi (ADM-009) -->
    <div v-show="activeTab === 'transactions'">
      <!-- Filter Bar -->
      <div class="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div class="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <i class="fa-solid fa-filter text-slate-400"></i> Filter:
        </div>

        <!-- Filter Status -->
        <select
          v-model="selectedStatus"
          @change="handleFilterChange"
          class="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs focus:border-slate-400 focus:outline-none cursor-pointer"
        >
          <option value="all">Semua Status Bayar</option>
          <option value="success">✅ Sukses (Lunas)</option>
          <option value="pending">⏳ Menunggu Pembayaran</option>
          <option value="failed">❌ Gagal / Batal</option>
          <option value="expired">🕰️ Expired</option>
        </select>

        <!-- Filter Purpose / Tujuan -->
        <select
          v-model="selectedPurpose"
          @change="handleFilterChange"
          class="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs focus:border-slate-400 focus:outline-none cursor-pointer"
        >
          <option value="all">Semua Tujuan</option>
          <option value="invitation">💍 Undangan Pernikahan</option>
          <option value="ai_credits">✨ Topup Kredit AI Nova</option>
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

        <!-- Reset Button -->
        <button
          v-if="hasActiveFilters"
          @click="resetFilters"
          class="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
        >
          <i class="fa-solid fa-xmark"></i> Reset Filter
        </button>
      </div>

      <!-- Table Section -->
      <div class="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <DataTable
          :value="payments"
          :loading="loading"
          lazy
          paginator
          :rows="limit"
          :totalRecords="total"
          :first="(page - 1) * limit"
          @page="onPage"
          tableStyle="min-width: 60rem"
          class="p-datatable-sm"
        >
          <template #empty>
            <div class="flex flex-col items-center justify-center p-12 text-center">
              <i class="fa-solid fa-receipt text-4xl text-slate-300 mb-3"></i>
              <p class="text-sm font-semibold text-slate-600">Tidak ada transaksi ditemukan</p>
              <p class="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter yang aktif.</p>
            </div>
          </template>

          <!-- Order ID & Ref -->
          <Column header="Order ID" style="min-width: 13rem">
            <template #body="{ data }">
              <div class="flex flex-col text-xs">
                <div class="flex items-center gap-1.5">
                  <button
                    @click="openDetail(data.id)"
                    class="font-mono font-bold text-slate-900 hover:text-blue-600 transition-colors text-left"
                    title="Buka Rincian Order"
                  >
                    {{ data.orderId }}
                  </button>
                  <button
                    @click="copyText(data.orderId, 'Order ID disalin')"
                    class="text-slate-400 hover:text-slate-700 p-0.5"
                    title="Salin Order ID"
                  >
                    <i class="fa-regular fa-copy text-[11px]"></i>
                  </button>
                </div>
                <span v-if="data.transactionId" class="text-[10px] text-slate-400 font-mono truncate max-w-[180px]">
                  ID: {{ data.transactionId }}
                </span>
              </div>
            </template>
          </Column>

          <!-- Pembayar / Pelanggan -->
          <Column header="Pelanggan" style="min-width: 14rem">
            <template #body="{ data }">
              <div class="flex flex-col text-xs">
                <span class="font-bold text-slate-800">{{ data.name || '-' }}</span>
                <span class="text-[11px] text-slate-500">{{ data.email || '-' }}</span>
              </div>
            </template>
          </Column>

          <!-- Tujuan & Paket -->
          <Column header="Tujuan & Paket" style="min-width: 12rem">
            <template #body="{ data }">
              <div class="flex flex-col items-start gap-1 text-xs">
                <span
                  v-if="data.purpose === 'ai_credits'"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200"
                >
                  <i class="fa-solid fa-sparkles text-[9px]"></i> AI Nova (+{{ data.aiCreditsAmount }} kredit)
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase"
                >
                  <i class="fa-solid fa-ring text-[9px]"></i> {{ data.package || 'Basic' }}
                </span>
                <span v-if="data.invitation" class="text-[11px] text-slate-600 truncate max-w-[160px]" :title="data.invitation.title">
                  {{ data.invitation.title }}
                </span>
              </div>
            </template>
          </Column>

          <!-- Nominal & Diskon -->
          <Column header="Nominal" style="min-width: 11rem">
            <template #body="{ data }">
              <div class="flex flex-col text-xs">
                <span class="font-black text-slate-900">{{ formatRupiah(data.amount) }}</span>
                <div v-if="data.discountAmount > 0" class="flex items-center gap-1 text-[10px] text-purple-600 font-semibold mt-0.5">
                  <i class="fa-solid fa-tag text-[9px]"></i>
                  <span>Diskon: {{ formatRupiah(data.discountAmount) }}</span>
                </div>
              </div>
            </template>
          </Column>

          <!-- Metode / Channel -->
          <Column header="Metode / Channel" style="min-width: 10rem">
            <template #body="{ data }">
              <div class="flex flex-col text-xs">
                <span class="font-semibold text-slate-800 uppercase tracking-wide">
                  {{ data.paymentType || data.paymentMethod || '-' }}
                </span>
                <span v-if="data.fraudStatus" class="text-[10px] text-slate-400 capitalize">
                  Fraud: {{ data.fraudStatus }}
                </span>
              </div>
            </template>
          </Column>

          <!-- Status Pembayaran -->
          <Column header="Status" style="min-width: 10rem">
            <template #body="{ data }">
              <div class="flex flex-col items-start gap-1">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border',
                    data.status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    data.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    data.status === 'expired' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  ]"
                >
                  <span class="mr-1.5 h-1.5 w-1.5 rounded-full" :class="data.status === 'success' ? 'bg-emerald-500' : data.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'"></span>
                  {{ getStatusLabel(data.status) }}
                </span>
                <span v-if="data.isPendingAging" class="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600">
                  <i class="fa-solid fa-triangle-exclamation"></i> Pending > 24j
                </span>
              </div>
            </template>
          </Column>

          <!-- Waktu Transaksi -->
          <Column header="Waktu" style="min-width: 11rem">
            <template #body="{ data }">
              <div class="flex flex-col text-xs">
                <span class="text-slate-800">{{ formatDate(data.createdAt) }}</span>
                <span class="text-[10px] text-slate-400 mt-0.5">{{ diffForHumans(data.createdAt) }}</span>
              </div>
            </template>
          </Column>

          <!-- Aksi -->
          <Column header="Aksi" headerClass="text-right" bodyClass="text-right" style="min-width: 11rem">
            <template #body="{ data }">
              <div class="flex justify-end gap-1.5 text-xs font-medium">
                <button
                  @click="openDetail(data.id)"
                  class="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                  title="Lihat Detail Transaksi"
                >
                  <i class="fa-solid fa-circle-info text-[11px] text-blue-600"></i> Detail
                </button>
                <button
                  @click="openReceipt(data)"
                  class="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                  title="Lihat Struk / Bukti Transaksi Resmi"
                >
                  <i class="fa-solid fa-receipt text-[11px] text-purple-600"></i> Struk
                </button>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- TAB 2: Antrean Rekonsiliasi (ADM-011) -->
    <div v-show="activeTab === 'reconciliation'">
      <div class="mb-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 flex items-start gap-3">
        <i class="fa-solid fa-triangle-exclamation text-amber-600 text-base mt-0.5 shrink-0"></i>
        <div>
          <strong class="font-bold">Pusat Antrean Rekonsiliasi Gateway & Finansial</strong>
          <p class="mt-0.5 text-amber-800 leading-relaxed">
            Menyaring otomatis anomali seperti transaksi berstatus sukses di database namun undangan belum terbit, transaksi yang tertahan (pending) lebih dari 24 jam, atau undangan terbit tanpa catatan pembayaran lunas.
          </p>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div v-if="(reconData?.items || []).length === 0" class="p-12 text-center">
          <i class="fa-solid fa-circle-check text-4xl text-emerald-500 mb-3"></i>
          <h3 class="text-sm font-bold text-slate-800">Semua Transaksi Bersih & Tersinkron</h3>
          <p class="text-xs text-slate-500 mt-1">Tidak ada anomali pembayaran atau penerbitan undangan yang memerlukan intervensi.</p>
        </div>

        <div v-else class="divide-y divide-slate-100">
          <div
            v-for="(item, idx) in reconData.items"
            :key="idx"
            class="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider',
                    item.severity === 'danger' ? 'bg-rose-100 text-rose-700' :
                    item.severity === 'warning' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-700'
                  ]"
                >
                  {{ item.type }}
                </span>
                <span class="text-xs font-bold text-slate-900">{{ item.title }}</span>
                <span v-if="item.orderId" class="text-xs font-mono text-slate-400">({{ item.orderId }})</span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">{{ item.description }}</p>
              <div class="flex items-center gap-3 text-[11px] text-slate-400">
                <span>Pelanggan: <strong class="text-slate-700">{{ item.customer }}</strong></span>
                <span>•</span>
                <span v-if="item.amount > 0">Nominal: <strong class="text-slate-900">{{ formatRupiah(item.amount) }}</strong></span>
                <span v-if="item.amount > 0">•</span>
                <span>{{ formatDate(item.createdAt) }}</span>
              </div>
            </div>

            <!-- Action buttons for anomaly -->
            <div class="flex items-center gap-2 shrink-0">
              <button
                v-if="item.action === 'RECONCILE_PUBLISH'"
                @click="triggerReconcilePublish(item.paymentId, item.orderId)"
                class="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
              >
                <i class="fa-solid fa-cloud-arrow-up"></i>
                <span>Publish Undangan</span>
              </button>

              <button
                v-if="item.action === 'SYNC_GATEWAY'"
                @click="triggerSyncGateway(item.paymentId, item.orderId)"
                class="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <i class="fa-solid fa-rotate text-blue-600"></i>
                <span>Sinkronkan Status</span>
              </button>

              <RouterLink
                v-if="item.invitationId"
                :to="`/admin/invitations/${item.invitationId}/edit`"
                class="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-500"></i>
                <span>Buka Undangan</span>
              </RouterLink>

              <button
                v-if="item.paymentId"
                @click="openDetail(item.paymentId)"
                class="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <i class="fa-solid fa-circle-info text-blue-600"></i>
                <span>Detail</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- DETAIL ORDER & PROVENANCE MODAL (ADM-010) -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
      @click.self="closeDetail"
    >
      <div class="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar my-auto">
        <!-- Header -->
        <div class="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Rincian Order:</span>
              <span class="text-base font-black font-mono text-slate-900">{{ detailData?.orderId }}</span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              Dibuat pada {{ formatDate(detailData?.createdAt) }} ({{ diffForHumans(detailData?.createdAt) }})
            </p>
          </div>
          <button
            @click="closeDetail"
            class="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <div v-if="loadingDetail" class="py-16 text-center">
          <i class="fa-solid fa-spinner fa-spin text-3xl text-slate-400"></i>
          <p class="text-xs text-slate-500 mt-2 font-medium">Memuat rincian transaksi...</p>
        </div>

        <div v-else-if="detailData" class="space-y-6">
          <!-- Status & Highlight Banner -->
          <div class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 flex flex-wrap items-center justify-between gap-3">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-600">Status Pembayaran:</span>
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider',
                    detailData.status === 'success' ? 'bg-emerald-100 text-emerald-800' :
                    detailData.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    detailData.status === 'expired' ? 'bg-slate-200 text-slate-700' :
                    'bg-rose-100 text-rose-800'
                  ]"
                >
                  {{ detailData.status }}
                </span>
              </div>
              <p class="text-xs text-slate-500">
                Waktu Settlement: <strong class="text-slate-800">{{ formatDate(detailData.settlementTime) }}</strong>
              </p>
            </div>

            <div class="text-right">
              <span class="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Dibayar</span>
              <div class="text-2xl font-black text-slate-900 tracking-tight">
                {{ formatRupiah(detailData.amount) }}
              </div>
            </div>
          </div>

          <!-- Grid: Info Transaksi & Pelanggan -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Finansial & Gateway Snapshot -->
            <div class="rounded-2xl border border-slate-200 p-4 space-y-3">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <i class="fa-solid fa-credit-card text-blue-500"></i> Gateway & Finansial
              </h4>
              <div class="space-y-2 text-xs divide-y divide-slate-100">
                <div class="flex justify-between py-1">
                  <span class="text-slate-500">Metode / Tipe:</span>
                  <span class="font-bold text-slate-900 uppercase">{{ detailData.paymentType || detailData.paymentMethod || '-' }}</span>
                </div>
                <div class="flex justify-between py-1">
                  <span class="text-slate-500">ID Gateway:</span>
                  <span class="font-mono text-slate-900">{{ detailData.transactionId || '-' }}</span>
                </div>
                <div class="flex justify-between py-1">
                  <span class="text-slate-500">Fraud Status:</span>
                  <span class="font-semibold text-slate-900 capitalize">{{ detailData.fraudStatus || '-' }}</span>
                </div>
                <div class="flex justify-between py-1">
                  <span class="text-slate-500">Potongan Diskon:</span>
                  <span class="font-bold text-purple-700">{{ formatRupiah(detailData.discountAmount) }}</span>
                </div>
                <div v-if="detailData.promoCode" class="flex justify-between py-1">
                  <span class="text-slate-500">Kode Promo Digunakan:</span>
                  <span class="font-mono font-bold text-purple-800">{{ detailData.promoCode.code }}</span>
                </div>
                <div v-if="detailData.snapToken" class="flex flex-col py-1 gap-1">
                  <span class="text-slate-500">Snap Token:</span>
                  <span class="font-mono text-[10px] text-slate-400 break-all bg-slate-50 p-1.5 rounded">{{ detailData.snapToken }}</span>
                </div>
              </div>
            </div>

            <!-- Pelanggan & Undangan Snapshot -->
            <div class="rounded-2xl border border-slate-200 p-4 space-y-3">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <i class="fa-solid fa-user text-emerald-500"></i> Pelanggan & Sasaran
              </h4>
              <div class="space-y-2 text-xs divide-y divide-slate-100">
                <div class="flex justify-between py-1">
                  <span class="text-slate-500">Nama Pembayar:</span>
                  <span class="font-bold text-slate-900">{{ detailData.name }}</span>
                </div>
                <div class="flex justify-between py-1">
                  <span class="text-slate-500">Email:</span>
                  <span class="text-slate-800">{{ detailData.email }}</span>
                </div>
                <div class="flex justify-between py-1">
                  <span class="text-slate-500">Tujuan Order:</span>
                  <span class="font-semibold text-slate-900 capitalize">{{ detailData.purpose }}</span>
                </div>
                <div v-if="detailData.package" class="flex justify-between py-1">
                  <span class="text-slate-500">Paket Dibeli:</span>
                  <span class="font-bold text-blue-700 uppercase">{{ detailData.package }}</span>
                </div>
                <div v-if="detailData.invitation" class="py-1 space-y-1">
                  <div class="flex justify-between">
                    <span class="text-slate-500">Undangan:</span>
                    <span class="font-bold text-slate-900">{{ detailData.invitation.title }}</span>
                  </div>
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-slate-400">Status Terbit:</span>
                    <span :class="detailData.invitation.isPublished ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'">
                      {{ detailData.invitation.isPublished ? 'Terbit (Published)' : 'Draft' }}
                    </span>
                  </div>
                  <a
                    :href="`/preview?slug=${detailData.invitation.slug}`"
                    target="_blank"
                    class="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline mt-1"
                  >
                    <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i> Buka Preview Undangan
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline Percobaan Pembayaran Terkait (Multiple Attempts) -->
          <div class="rounded-2xl border border-slate-200 p-4 space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <i class="fa-solid fa-clock-rotate-left text-amber-500"></i> Riwayat Semua Percobaan Pembayaran (Attempts)
            </h4>
            <div class="space-y-2">
              <div
                v-for="att in detailData.attempts"
                :key="att.id"
                :class="[
                  'flex items-center justify-between p-2.5 rounded-xl border text-xs',
                  att.id === detailData.id ? 'border-blue-300 bg-blue-50/40 font-semibold' : 'border-slate-100 bg-white'
                ]"
              >
                <div class="flex items-center gap-2.5">
                  <span class="font-mono font-bold">{{ att.orderId }}</span>
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-full text-[10px] font-bold',
                      att.status === 'success' ? 'bg-emerald-100 text-emerald-800' :
                      att.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-600'
                    ]"
                  >
                    {{ att.status }}
                  </span>
                  <span v-if="att.id === detailData.id" class="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.2 rounded">
                    Current
                  </span>
                </div>
                <div class="flex items-center gap-4 text-slate-500">
                  <span class="font-bold text-slate-900">{{ formatRupiah(att.amount) }}</span>
                  <span>{{ formatDate(att.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Audit Activity Logs -->
          <div v-if="(detailData.recentActivities || []).length > 0" class="rounded-2xl border border-slate-200 p-4 space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <i class="fa-solid fa-shield-halved text-slate-500"></i> Jejak Audit Aktivitas Terkait
            </h4>
            <div class="space-y-1.5 text-xs divide-y divide-slate-100">
              <div v-for="act in detailData.recentActivities" :key="act.id" class="pt-1.5 flex justify-between">
                <div>
                  <span class="font-bold text-slate-800">{{ act.action }}</span>
                  <span class="text-slate-400 text-[11px] ml-2">({{ act.userEmail || 'System' }})</span>
                </div>
                <span class="text-[11px] text-slate-400">{{ formatDate(act.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            v-if="detailData?.status === 'success' && detailData?.invitation && !detailData?.invitation?.isPublished"
            @click="triggerReconcilePublish(detailData.id, detailData.orderId)"
            class="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
          >
            <i class="fa-solid fa-cloud-arrow-up mr-1.5"></i> Publish & Rekonsiliasi
          </button>
          <button
            @click="openReceipt(detailData)"
            class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <i class="fa-solid fa-receipt mr-1.5 text-purple-600"></i> Lihat Struk Resmi
          </button>
          <button
            @click="closeDetail"
            class="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- OFFICIAL RECEIPT VIEWER / PRINT MODAL (ADM-014) -->
    <div
      v-if="showReceiptModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
      @click.self="closeReceipt"
    >
      <div class="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl space-y-6 my-auto print:shadow-none print:p-0">
        <!-- Receipt Card Container -->
        <div id="printable-receipt" class="space-y-6">
          <!-- Receipt Header -->
          <div class="text-center border-b border-slate-200 pb-5">
            <h2 class="text-lg font-black tracking-tight text-slate-900">SatuUndangan</h2>
            <p class="text-xs text-slate-400 uppercase tracking-widest mt-0.5">Bukti Transaksi Digital Resmi</p>
            <p class="text-[11px] text-slate-500 mt-2 font-mono">No: {{ receiptData?.orderId }}</p>
          </div>

          <!-- Receipt Details Grid -->
          <div class="space-y-3 text-xs">
            <div class="flex justify-between py-1 border-b border-slate-100">
              <span class="text-slate-500">Tanggal Transaksi:</span>
              <span class="font-semibold text-slate-800">{{ formatDate(receiptData?.createdAt) }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-100">
              <span class="text-slate-500">Pelanggan:</span>
              <span class="font-bold text-slate-900">{{ receiptData?.name }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-100">
              <span class="text-slate-500">Email:</span>
              <span class="text-slate-700">{{ receiptData?.email }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-100">
              <span class="text-slate-500">Item Pembelian:</span>
              <span class="font-bold text-slate-900">
                {{ receiptData?.purpose === 'ai_credits' ? 'Topup Kredit AI Nova' : `Paket Undangan Digital (${(receiptData?.package || 'Basic').toUpperCase()})` }}
              </span>
            </div>
            <div v-if="receiptData?.invitation" class="flex justify-between py-1 border-b border-slate-100">
              <span class="text-slate-500">Undangan:</span>
              <span class="font-semibold text-slate-800">{{ receiptData?.invitation?.title }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-100">
              <span class="text-slate-500">Metode Pembayaran:</span>
              <span class="font-bold text-slate-900 uppercase">{{ receiptData?.paymentType || receiptData?.paymentMethod || '-' }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-100">
              <span class="text-slate-500">Status Pembayaran:</span>
              <span class="font-black text-emerald-700 uppercase">
                {{ receiptData?.status === 'success' ? 'LUNAS / BERHASIL' : receiptData?.status }}
              </span>
            </div>

            <!-- Price Breakdown -->
            <div class="pt-3 space-y-1.5">
              <div class="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>{{ formatRupiah((receiptData?.amount || 0) + (receiptData?.discountAmount || 0)) }}</span>
              </div>
              <div v-if="(receiptData?.discountAmount || 0) > 0" class="flex justify-between text-purple-700 font-semibold">
                <span>Potongan Promo:</span>
                <span>- {{ formatRupiah(receiptData?.discountAmount) }}</span>
              </div>
              <div class="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-2">
                <span>Total Dibayar:</span>
                <span class="text-base text-slate-900">{{ formatRupiah(receiptData?.amount) }}</span>
              </div>
            </div>
          </div>

          <!-- Receipt Footer Note -->
          <div class="rounded-xl bg-slate-50 p-3 text-[10px] text-slate-500 text-center leading-relaxed">
            Struk ini adalah bukti sah pembayaran digital melalui SatuUndangan. Simpan tanda terima ini untuk keperluan konfirmasi dan bantuan layanan pelanggan.
          </div>
        </div>

        <!-- Receipt Action Buttons -->
        <div class="flex justify-end gap-2 border-t border-slate-100 pt-4 print:hidden">
          <button
            @click="printReceipt"
            class="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
          >
            <i class="fa-solid fa-print"></i>
            <span>Cetak / PDF</span>
          </button>
          <button
            @click="closeReceipt"
            class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </AdminShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import AdminShell from '@/components/admin/AdminShell.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import {
  fetchAdminPayments,
  fetchAdminPaymentStats,
  fetchAdminPaymentReconciliationQueue,
  fetchAdminPaymentDetail,
  reconcileAdminPaymentPublish,
  syncAdminPaymentGateway,
  exportAdminPayments,
} from '@/api/admin.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const activeTab = ref('transactions')
const payments = ref([])
const total = ref(0)
const page = ref(Number(route.query.page) || 1)
const limit = 15
const search = ref(route.query.q || '')
const selectedStatus = ref(route.query.status || 'all')
const selectedPurpose = ref(route.query.purpose || 'all')
const selectedPackage = ref(route.query.package || 'all')

const loading = ref(false)
const loadingExport = ref(false)
const stats = ref(null)
const reconData = ref(null)

// Detail Modal
const showDetailModal = ref(false)
const loadingDetail = ref(false)
const detailData = ref(null)

// Receipt Modal
const showReceiptModal = ref(false)
const receiptData = ref(null)

const hasActiveFilters = computed(() => {
  return (
    search.value.trim() !== '' ||
    selectedStatus.value !== 'all' ||
    selectedPurpose.value !== 'all' ||
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
  return `${Math.floor(diffInSeconds / 31536000)} tahun yang lalu`
}

function getStatusLabel(st) {
  if (st === 'success') return 'Sukses'
  if (st === 'pending') return 'Menunggu'
  if (st === 'expired') return 'Expired'
  if (st === 'failed' || st === 'failure') return 'Gagal'
  return st || '-'
}

function copyText(txt, msg = 'Tersalin ke clipboard') {
  navigator.clipboard.writeText(txt)
  toast.success(msg)
}

function syncUrlParams() {
  const query = {}
  if (page.value > 1) query.page = String(page.value)
  if (search.value.trim()) query.q = search.value.trim()
  if (selectedStatus.value !== 'all') query.status = selectedStatus.value
  if (selectedPurpose.value !== 'all') query.purpose = selectedPurpose.value
  if (selectedPackage.value !== 'all') query.package = selectedPackage.value
  router.replace({ query }).catch(() => {})
}

async function loadPayments() {
  loading.value = true
  syncUrlParams()
  try {
    const params = {
      page: page.value,
      limit,
      q: search.value.trim() || undefined,
      status: selectedStatus.value !== 'all' ? selectedStatus.value : undefined,
      purpose: selectedPurpose.value !== 'all' ? selectedPurpose.value : undefined,
      package: selectedPackage.value !== 'all' ? selectedPackage.value : undefined,
    }
    const res = await fetchAdminPayments(params)
    payments.value = res.data
    total.value = res.total
  } catch (error) {
    toast.error(error.message || 'Gagal memuat data transaksi')
  } finally {
    loading.value = false
  }
}

async function loadStats() {
  try {
    stats.value = await fetchAdminPaymentStats()
  } catch (err) {
    console.error('Failed to load payment stats:', err)
  }
}

async function loadReconciliationQueue() {
  try {
    reconData.value = await fetchAdminPaymentReconciliationQueue()
  } catch (err) {
    console.error('Failed to load reconciliation queue:', err)
  }
}

async function loadAllData() {
  await Promise.all([loadPayments(), loadStats(), loadReconciliationQueue()])
}

const debouncedSearch = useDebounceFn(() => {
  page.value = 1
  loadPayments()
}, 300)

function handleSearch(value) {
  search.value = value
  debouncedSearch()
}

function handleFilterChange() {
  page.value = 1
  loadPayments()
}

function resetFilters() {
  search.value = ''
  selectedStatus.value = 'all'
  selectedPurpose.value = 'all'
  selectedPackage.value = 'all'
  page.value = 1
  loadPayments()
}

function onPage(event) {
  page.value = event.page + 1
  loadPayments()
}

async function openDetail(id) {
  showDetailModal.value = true
  loadingDetail.value = true
  try {
    detailData.value = await fetchAdminPaymentDetail(id)
  } catch (err) {
    toast.error(err.message || 'Gagal memuat detail transaksi')
    showDetailModal.value = false
  } finally {
    loadingDetail.value = false
  }
}

function closeDetail() {
  showDetailModal.value = false
  detailData.value = null
}

function openReceipt(item) {
  receiptData.value = item
  showReceiptModal.value = true
}

function closeReceipt() {
  showReceiptModal.value = false
  receiptData.value = null
}

function printReceipt() {
  window.print()
}

async function triggerReconcilePublish(paymentId, orderId) {
  const { value: reason, isConfirmed } = await Swal.fire({
    title: 'Rekonsiliasi & Terbitkan Undangan?',
    text: `Transaksi ${orderId} akan diverifikasi dan status undangan akan diaktifkan (Published).`,
    icon: 'question',
    input: 'text',
    inputLabel: 'Alasan Rekonsiliasi (Audit)',
    inputPlaceholder: 'Cth: Konfirmasi pembayaran valid dari mutasi bank/Midtrans',
    showCancelButton: true,
    confirmButtonColor: '#059669',
    confirmButtonText: 'Ya, Terbitkan',
    cancelButtonText: 'Batal',
  })

  if (!isConfirmed) return

  try {
    const res = await reconcileAdminPaymentPublish(paymentId, reason)
    toast.success(res.message || 'Undangan berhasil direkonsiliasi dan diterbitkan')
    loadAllData()
    if (showDetailModal.value) {
      openDetail(paymentId)
    }
  } catch (err) {
    toast.error(err.message || 'Gagal merekonsiliasi pembayaran')
  }
}

async function triggerSyncGateway(paymentId, orderId) {
  try {
    const res = await syncAdminPaymentGateway(paymentId)
    toast.success(res.message || 'Status gateway berhasil diperbarui')
    loadAllData()
  } catch (err) {
    toast.error(err.message || 'Gagal menyinkronkan status gateway')
  }
}

async function handleExportCsv() {
  loadingExport.value = true
  try {
    const params = {
      q: search.value.trim() || undefined,
      status: selectedStatus.value !== 'all' ? selectedStatus.value : undefined,
      purpose: selectedPurpose.value !== 'all' ? selectedPurpose.value : undefined,
      package: selectedPackage.value !== 'all' ? selectedPackage.value : undefined,
    }
    const res = await exportAdminPayments(params)
    if (!res.csv) throw new Error('Data ekspor kosong')

    const blob = new Blob([res.csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', res.filename || 'transaksi-satuundangan.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success(`Berhasil mengekspor ${res.total} data transaksi`)
  } catch (err) {
    toast.error(err.message || 'Gagal mengekspor data CSV')
  } finally {
    loadingExport.value = false
  }
}

onMounted(() => {
  loadAllData()
})
</script>
