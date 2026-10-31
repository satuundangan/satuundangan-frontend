<template>
  <AdminShell
    title="Promo Code"
    description="Kelola kode promo, redemption, omzet & exit-intent banner"
    show-search
    :search="search"
    search-placeholder="Cari kode promo..."
    action-label="Tambah Promo"
    @update:search="handleSearch"
    @action="openCreate"
  >
    <!-- Summary Metrics Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Promo Aktif</span>
          <span class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>
        <div class="mt-2 text-2xl font-bold text-slate-900">{{ summary.total_active_promos }}</div>
        <div class="mt-1 text-xs text-slate-500">dari {{ summary.total_promos }} total kode</div>
      </div>

      <div class="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Redemption Lunas</span>
          <span class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </span>
        </div>
        <div class="mt-2 text-2xl font-bold text-slate-900">{{ summary.total_redemptions }}</div>
        <div class="mt-1 text-xs text-slate-500">Counter kuota: {{ summary.total_reserved_slots_count }}</div>
        <div class="text-xs text-amber-600">Checkout pending: {{ summary.total_pending_reservations }}</div>
      </div>

      <div class="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Diskon Diberikan</span>
          <span class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>
        <div class="mt-2 text-2xl font-bold text-slate-900">{{ formatCurrency(summary.total_discount_amount) }}</div>
        <div class="mt-1 text-xs text-slate-500">potongan pada order settled</div>
      </div>

      <div class="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">Omzet dari Promo</span>
          <span class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </span>
        </div>
        <div class="mt-2 text-2xl font-bold text-slate-900">{{ formatCurrency(summary.total_gross_revenue) }}</div>
        <div class="mt-1 text-xs text-slate-500">gross revenue transaksi diskon</div>
      </div>
    </div>

    <!-- Filter Status Tabs -->
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
      <div class="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Filter status promo">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          type="button"
          role="tab"
          :aria-selected="statusFilter === tab.value"
          @click="setStatusFilter(tab.value)"
          class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5"
          :class="statusFilter === tab.value
            ? 'bg-slate-900 text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'"
        >
          <span>{{ tab.label }}</span>
          <span
            v-if="statusCounts[tab.value] !== undefined"
            class="px-1.5 py-0.2 rounded-full text-[10px]"
            :class="statusFilter === tab.value ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'"
          >
            {{ statusCounts[tab.value] }}
          </span>
        </button>
      </div>

      <div class="flex items-center gap-2 text-xs text-slate-500">
        <span class="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-600">
          <svg class="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          WIB (UTC+7)
        </span>
      </div>
    </div>

    <AdminTableStatus
      :error="loadError"
      :loading="loading"
      :count="promoCodes.length"
      :filtered="Boolean(search || statusFilter !== 'all')"
      :updated-at="lastLoadedAt"
      @retry="loadData"
      @reset="resetFilters"
    />

    <DataTable
      v-if="!loadError"
      :headers="headers"
      :items="promoCodes"
      :loading="loading"
      :total="total"
      v-model:page="page"
      :limit="limit"
      @update:page="setPage"
    >
      <template #cell(code)="{ item }">
        <div class="flex flex-col items-start gap-1">
          <div class="flex items-center gap-2">
            <span class="font-mono font-bold text-slate-900 tracking-wider text-sm">{{ item.code }}</span>
            <span
              v-if="item.is_exit_intent_active"
              class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200"
              title="Aktif sebagai penawaran Exit Intent di landing page"
            >
              <svg class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Exit Intent
            </span>
          </div>
          <span v-if="item.exit_intent_text" class="text-[11px] text-slate-500 truncate max-w-[200px]" :title="item.exit_intent_text">
            {{ item.exit_intent_text }}
          </span>
        </div>
      </template>

      <template #cell(discount)="{ item }">
        <div class="flex flex-col">
          <span class="font-semibold text-slate-800">
            {{ item.discount_type === 'percentage' ? `${item.discount_value}%` : formatCurrency(item.discount_value) }}
          </span>
          <span class="text-[10px] uppercase font-bold text-slate-500">
            {{ item.discount_type === 'percentage' ? 'Persentase' : 'Potongan Tetap' }}
          </span>
        </div>
      </template>

      <template #cell(usage)="{ item }">
        <div class="flex flex-col">
          <div class="flex items-center gap-1.5">
            <span class="font-bold text-emerald-600">{{ item.redemptions_count ?? 0 }} lunas</span>
            <span class="text-xs text-slate-400">/</span>
            <span class="text-xs text-slate-600">{{ item.max_uses !== null && item.max_uses !== undefined ? `${item.max_uses} kuota` : '∞' }}</span>
          </div>
          <span class="text-[10px] text-slate-500">
            Counter kuota: {{ item.reserved_slots_count ?? item.used_count ?? 0 }}
          </span>
          <span class="text-[10px] text-amber-600">
            {{ item.pending_reservations_count ?? 0 }} checkout pending
          </span>
          <span class="text-[10px] text-slate-400">
            {{ getRemainingSlotsText(item) }}
          </span>
        </div>
      </template>

      <template #cell(performance)="{ item }">
        <div class="flex flex-col">
          <span class="font-semibold text-slate-900">{{ formatCurrency(item.total_gross_revenue ?? 0) }}</span>
          <span class="text-[11px] text-rose-600">
            Hemat: {{ formatCurrency(item.total_discount_amount ?? 0) }}
          </span>
        </div>
      </template>

      <template #cell(validity)="{ item }">
        <div class="flex flex-col text-xs">
          <span class="text-slate-700">
            {{ formatValidityRange(item.valid_from, item.valid_until) }}
          </span>
          <span class="text-[10px] text-slate-500 font-medium">
            {{ getValidityCountdown(item.valid_from, item.valid_until) }}
          </span>
        </div>
      </template>

      <template #cell(status)="{ item }">
        <div class="flex flex-col items-start gap-1">
          <span
            class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border tracking-wider"
            :class="getStatusBadgeClass(item.computed_status || (item.is_active ? 'active' : 'inactive'))"
          >
            {{ getStatusLabel(item.computed_status || (item.is_active ? 'active' : 'inactive')) }}
          </span>
          <button
            @click="toggleActive(item)"
            class="text-[10px] text-slate-500 hover:text-slate-800 underline decoration-slate-300"
          >
            {{ item.is_active ? 'Nonaktifkan' : 'Aktifkan' }}
          </button>
        </div>
      </template>

      <template #cell(actions)="{ item }">
        <div class="flex justify-end gap-1.5 text-xs font-medium">
          <button
            class="rounded-lg border border-slate-200 px-2.5 py-1 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
            @click="openDetail(item)"
            title="Lihat riwayat transaksi dan detail promo"
          >
            <svg class="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Detail</span>
          </button>
          <button
            class="rounded-lg border border-slate-200 px-2.5 py-1 text-slate-700 hover:bg-slate-50 transition-colors"
            @click="openEdit(item)"
          >
            Edit
          </button>
          <button
            class="rounded-lg border border-rose-200 px-2.5 py-1 text-rose-600 hover:bg-rose-50 transition-colors"
            @click="confirmDelete(item)"
          >
            Hapus
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Detail Drawer / Modal -->
    <Transition name="fade">
      <div v-if="showDetail" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
        <div class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
          <div class="mb-5 flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-mono text-xl font-bold tracking-wider text-slate-900">{{ selectedPromo?.code }}</span>
                <span
                  class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border"
                  :class="getStatusBadgeClass(selectedPromo?.computed_status || (selectedPromo?.is_active ? 'active' : 'inactive'))"
                >
                  {{ getStatusLabel(selectedPromo?.computed_status || (selectedPromo?.is_active ? 'active' : 'inactive')) }}
                </span>
                <span
                  v-if="selectedPromo?.is_exit_intent_active"
                  class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200"
                >
                  Exit Intent
                </span>
              </div>
              <p class="mt-1 text-xs text-slate-500">
                Tipe Diskon: {{ selectedPromo?.discount_type === 'percentage' ? `${selectedPromo?.discount_value}%` : formatCurrency(selectedPromo?.discount_value) }}
                • Berlaku: {{ formatValidityRange(selectedPromo?.valid_from, selectedPromo?.valid_until) }} (WIB)
              </p>
            </div>
            <button class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" @click="closeDetail">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Detail Metrics -->
          <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
            <div class="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <div class="text-[11px] font-medium text-slate-500 uppercase">Redemption Lunas</div>
              <div class="mt-1 text-lg font-bold text-emerald-600">{{ selectedPromo?.redemptions_count ?? 0 }}</div>
              <div class="text-[10px] text-slate-400">{{ selectedPromo?.max_uses !== null && selectedPromo?.max_uses !== undefined ? `dari ${selectedPromo?.max_uses} kuota` : 'Kuota unlimited' }}</div>
            </div>
            <div class="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <div class="text-[11px] font-medium text-slate-500 uppercase">Counter Kuota</div>
              <div class="mt-1 text-lg font-bold text-slate-900">{{ selectedPromo?.reserved_slots_count ?? selectedPromo?.used_count ?? 0 }}</div>
              <div class="text-[10px] text-slate-400">slot dipesan</div>
              <div class="text-[10px] text-slate-400">{{ getRemainingSlotsText(selectedPromo || {}) }}</div>
            </div>
            <div class="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <div class="text-[11px] font-medium text-slate-500 uppercase">Checkout Pending</div>
              <div class="mt-1 text-lg font-bold text-amber-600">{{ selectedPromo?.pending_reservations_count ?? 0 }}</div>
              <div class="text-[10px] text-slate-400">menunggu pembayaran</div>
            </div>
            <div class="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <div class="text-[11px] font-medium text-slate-500 uppercase">Total Diskon</div>
              <div class="mt-1 text-lg font-bold text-rose-600">{{ formatCurrency(selectedPromo?.total_discount_amount ?? 0) }}</div>
              <div class="text-[10px] text-slate-400">potongan yang diberikan</div>
            </div>
            <div class="rounded-lg bg-slate-50 p-3 border border-slate-100">
              <div class="text-[11px] font-medium text-slate-500 uppercase">Total Omzet</div>
              <div class="mt-1 text-lg font-bold text-slate-900">{{ formatCurrency(selectedPromo?.total_gross_revenue ?? 0) }}</div>
              <div class="text-[10px] text-slate-400">gross revenue settled</div>
            </div>
          </div>

          <!-- Orders / Redemptions List -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-slate-800">Riwayat Transaksi Pengguna Promo</h3>
              <span class="text-xs text-slate-400">{{ promoOrders.length }} transaksi terbaru</span>
            </div>

            <div v-if="loadingDetail" class="py-8 text-center text-sm text-slate-500">
              Memuat riwayat transaksi...
            </div>
            <div v-else-if="promoOrders.length === 0" class="rounded-lg border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
              Belum ada transaksi yang menggunakan kode promo ini.
            </div>
            <div v-else class="overflow-x-auto rounded-lg border border-slate-200">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th class="p-2.5 font-semibold">Order ID</th>
                    <th class="p-2.5 font-semibold">Pelanggan</th>
                    <th class="p-2.5 font-semibold">Paket</th>
                    <th class="p-2.5 font-semibold text-right">Diskon</th>
                    <th class="p-2.5 font-semibold text-right">Bayar</th>
                    <th class="p-2.5 font-semibold text-center">Status</th>
                    <th class="p-2.5 font-semibold">Waktu (WIB)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  <tr v-for="order in promoOrders" :key="order.id" class="hover:bg-slate-50/60">
                    <td class="p-2.5 font-mono text-slate-800 font-medium">{{ order.order_id }}</td>
                    <td class="p-2.5">
                      <div class="font-medium text-slate-900">{{ order.customer_name || '—' }}</div>
                      <div class="text-[11px] text-slate-400">{{ order.customer_email || '—' }}</div>
                    </td>
                    <td class="p-2.5 capitalize text-slate-700">{{ order.package || 'invitation' }}</td>
                    <td class="p-2.5 text-right font-medium text-rose-600">{{ formatCurrency(order.discount_amount || 0) }}</td>
                    <td class="p-2.5 text-right font-bold text-slate-900">{{ formatCurrency(order.amount || 0) }}</td>
                    <td class="p-2.5 text-center">
                      <span
                        class="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                        :class="getOrderStatusBadgeClass(order.status)"
                      >
                        {{ order.status }}
                      </span>
                    </td>
                    <td class="p-2.5 text-slate-600">{{ formatDateTimeWib(order.created_at) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button class="rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800" @click="closeDetail">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Create / Edit Form Modal with Exit Intent Live Preview -->
    <Transition name="fade">
      <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
        <div class="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
          <div class="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 class="text-lg font-semibold text-slate-900">{{ editing ? 'Edit Promo Code' : 'Tambah Promo Code' }}</h2>
              <p class="text-xs text-slate-500">Konfigurasi nilai diskon, kuota, periode waktu (WIB), dan pesan exit intent</p>
            </div>
            <button class="text-slate-400 hover:text-slate-600 text-lg leading-none" @click="closeForm">×</button>
          </div>

          <form class="grid grid-cols-1 gap-4" @submit.prevent="submitForm">
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-600">Kode Promo <span class="text-rose-500">*</span></label>
                <input v-model="form.code" type="text" required :disabled="!!editing"
                  class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm uppercase tracking-wider outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50 disabled:text-slate-400"
                  placeholder="Contoh: NIKAH50" />
              </div>

              <div>
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-600">Tipe Diskon <span class="text-rose-500">*</span></label>
                <select v-model="form.discount_type" required
                  class="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100">
                  <option value="percentage">Persentase (%)</option>
                  <option value="fixed">Fixed (Rp)</option>
                </select>
              </div>

              <div>
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Nilai Diskon <span class="text-rose-500">*</span>
                  <span class="text-slate-400 font-normal">({{ form.discount_type === 'percentage' ? '%' : 'Rp' }})</span>
                </label>
                <input v-model.number="form.discount_value" type="number" required min="0"
                  :max="form.discount_type === 'percentage' ? 100 : undefined"
                  class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  placeholder="50" />
              </div>

              <div>
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-600">Maks. Kuota Pemakaian</label>
                <input v-model.number="form.max_uses" type="number" min="1"
                  class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  placeholder="Kosong = tidak terbatas" />
              </div>

              <div>
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-600">Berlaku Dari (WIB)</label>
                <input v-model="form.valid_from" type="datetime-local"
                  class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
              </div>

              <div class="col-span-2">
                <label class="text-xs font-semibold uppercase tracking-wider text-slate-600">Berlaku Hingga (WIB)</label>
                <input v-model="form.valid_until" type="datetime-local"
                  class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
              </div>

              <div class="col-span-2 flex items-center gap-3">
                <input type="checkbox" id="is_active" v-model="form.is_active"
                  class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400" />
                <label for="is_active" class="text-sm font-medium text-slate-700 cursor-pointer">Aktifkan promo code ini</label>
              </div>

              <!-- Exit Intent Config & Live Preview -->
              <div class="col-span-2 mt-2 pt-4 border-t border-slate-100">
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <h4 class="text-sm font-semibold text-slate-800">Pengaturan Promo Landing Page (Exit-Intent)</h4>
                    <p class="text-[11px] text-slate-500">Ditampilkan kepada pengunjung sebelum meninggalkan website</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <input type="checkbox" id="is_exit_intent" v-model="form.is_exit_intent_active"
                      class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400" />
                    <label for="is_exit_intent" class="text-xs font-semibold text-slate-700 cursor-pointer">Aktifkan Exit-Intent</label>
                  </div>
                </div>

                <div v-if="form.is_exit_intent_active" class="space-y-3">
                  <div>
                    <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">Pesan Penawaran Exit Intent</label>
                    <textarea v-model="form.exit_intent_text" rows="2"
                      placeholder="Contoh: Khusus untuk Anda yang mendaftar hari ini, dapatkan potongan harga spesial..."
                      class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"></textarea>
                  </div>

                  <!-- Live Preview Component -->
                  <div class="rounded-xl border border-dashed border-[#A67C52]/50 bg-[#FDFBF7] p-4 text-center">
                    <div class="text-[10px] font-bold uppercase tracking-wider text-[#A67C52] mb-1">
                      Live Preview Modal Exit-Intent Pengunjung
                    </div>
                    <div class="mx-auto max-w-sm rounded-xl bg-white p-4 shadow-sm border border-[#E5E0D8]">
                      <div class="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F0E6] text-[#A67C52]">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </div>
                      <h5 class="font-serif text-base font-semibold text-slate-900">Tunggu Sebentar!</h5>
                      <p class="mt-1 text-xs text-slate-600 line-clamp-2">
                        {{ form.exit_intent_text || 'Khusus untuk Anda yang mendaftar hari ini, dapatkan potongan harga spesial.' }}
                      </p>
                      <div class="mt-3 rounded-lg border border-dashed border-[#A67C52] bg-[#FDFBF7] p-2 text-center">
                        <div class="text-[9px] uppercase tracking-wider text-slate-500 font-medium">Gunakan Kode Promo</div>
                        <div class="text-lg font-bold font-mono tracking-widest text-[#A67C52]">{{ form.code || 'CONTOH50' }}</div>
                        <div class="mt-1 inline-block rounded-full bg-[#F4F0E6] px-2 py-0.5 text-[10px] font-medium text-slate-700">
                          Diskon {{ form.discount_type === 'percentage' ? `${form.discount_value || 0}%` : formatCurrency(form.discount_value || 0) }}
                        </div>
                      </div>
                      <div class="mt-3 w-full rounded-lg bg-slate-900 py-1.5 text-xs font-medium text-white">
                        Amankan Promo Sekarang
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-3 border-t border-slate-100 text-sm font-medium">
              <button type="button" class="rounded-lg border border-slate-200 px-4 py-2 hover:bg-slate-50"
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
import AdminTableStatus from '@/components/admin/AdminTableStatus.vue'
import DataTable from '@/components/admin/DataTable.vue'
import {
  fetchAdminPromoCodes,
  fetchAdminPromoCodeDetail,
  fetchAdminPromoSummary,
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
const statusFilter = ref('all')
const loading = ref(false)
const showForm = ref(false)
const saving = ref(false)
const editing = ref(null)

const showDetail = ref(false)
const loadingDetail = ref(false)
const selectedPromo = ref(null)
const promoOrders = ref([])

const summary = reactive({
  total_promos: 0,
  total_active_promos: 0,
  total_redemptions: 0,
  total_reserved_slots_count: 0,
  total_pending_reservations: 0,
  total_discount_amount: 0,
  total_gross_revenue: 0,
})

const statusTabs = [
  { label: 'Semua', value: 'all' },
  { label: 'Aktif', value: 'active' },
  { label: 'Terjadwal', value: 'scheduled' },
  { label: 'Kedaluwarsa', value: 'expired' },
  { label: 'Kuota Habis', value: 'exhausted' },
  { label: 'Nonaktif', value: 'inactive' },
]

const statusCounts = computed(() => {
  const counts = { all: total.value }
  promoCodes.value.forEach((p) => {
    const st = p.computed_status || (p.is_active ? 'active' : 'inactive')
    counts[st] = (counts[st] || 0) + 1
  })
  return counts
})

const headers = [
  { label: 'Kode Promo', key: 'code' },
  { label: 'Diskon', key: 'discount' },
  { label: 'Klaim / Kuota', key: 'usage' },
  { label: 'Omzet & Diskon', key: 'performance' },
  { label: 'Masa Berlaku', key: 'validity' },
  { label: 'Status', key: 'status' },
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

const loadError = ref('')
const lastLoadedAt = ref(null)

function resetFilters() {
  search.value = ''
  statusFilter.value = 'all'
  page.value = 1
  loadData()
}

function setStatusFilter(filter) {
  statusFilter.value = filter
  page.value = 1
  loadData()
}

async function loadData() {
  loading.value = true
  loadError.value = ''
  try {
    const params = {
      page: page.value,
      limit,
      q: search.value || undefined,
      status: statusFilter.value !== 'all' ? statusFilter.value : undefined,
    }
    const [res, summaryRes] = await Promise.all([
      fetchAdminPromoCodes(params),
      fetchAdminPromoSummary().catch(() => null),
    ])

    promoCodes.value = res.data || []
    total.value = res.total || 0
    lastLoadedAt.value = new Date()

    if (summaryRes?.data) {
      Object.assign(summary, summaryRes.data)
    } else {
      // Local fallback calculation if summary endpoint is loading or unavailable
      summary.total_promos = res.total || promoCodes.value.length
      summary.total_active_promos = promoCodes.value.filter((p) => p.is_active && (p.computed_status === 'active' || !p.computed_status)).length
      summary.total_redemptions = promoCodes.value.reduce((acc, p) => acc + (p.redemptions_count || 0), 0)
      summary.total_reserved_slots_count = promoCodes.value.reduce(
        (acc, p) => acc + (p.reserved_slots_count ?? p.used_count ?? 0),
        0,
      )
      summary.total_pending_reservations = promoCodes.value.reduce((acc, p) => acc + (p.pending_reservations_count || 0), 0)
      summary.total_discount_amount = promoCodes.value.reduce((acc, p) => acc + (p.total_discount_amount || 0), 0)
      summary.total_gross_revenue = promoCodes.value.reduce((acc, p) => acc + (p.total_gross_revenue || 0), 0)
    }
  } catch (error) {
    loadError.value = error.message || 'Gagal memuat data promo code'
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

async function openDetail(promo) {
  selectedPromo.value = promo
  promoOrders.value = []
  showDetail.value = true
  loadingDetail.value = true
  try {
    const res = await fetchAdminPromoCodeDetail(promo.id)
    if (res?.data) {
      selectedPromo.value = { ...promo, ...res.data }
      promoOrders.value = res.data.orders || []
    }
  } catch (err) {
    toast.error(err.message || 'Gagal memuat detail promo')
  } finally {
    loadingDetail.value = false
  }
}

function closeDetail() {
  showDetail.value = false
  selectedPromo.value = null
  promoOrders.value = []
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
    is_exit_intent_active: Boolean(promo.is_exit_intent_active),
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
      is_exit_intent_active: Boolean(form.is_exit_intent_active),
      exit_intent_text: form.is_exit_intent_active ? (form.exit_intent_text || '') : null,
    }
    if (form.max_uses) payload.max_uses = form.max_uses
    if (form.valid_from) payload.valid_from = new Date(form.valid_from).toISOString()
    if (form.valid_until) payload.valid_until = new Date(form.valid_until).toISOString()

    if (editing.value) {
      await updateAdminPromoCode(editing.value.id, payload)
      toast.success('Promo code berhasil diperbarui')
    } else {
      await createAdminPromoCode(payload)
      toast.success('Promo code berhasil dibuat')
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
    const nextStatus = !promo.is_active
    await updateAdminPromoCode(promo.id, { is_active: nextStatus })
    promo.is_active = nextStatus
    toast.success(`Promo ${promo.is_active ? 'diaktifkan' : 'dinonaktifkan'}`)
    loadData()
  } catch (error) {
    toast.error(error.message || 'Gagal mengubah status promo')
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
    toast.success('Promo code berhasil dihapus')
    loadData()
  } catch (error) {
    toast.error(error.message || 'Gagal menghapus promo code')
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value || 0)
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

function formatDateTimeWib(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
}

function formatValidityRange(from, until) {
  if (!from && !until) return 'Selamanya / Tanpa Batas'
  if (from && !until) return `Mulai ${formatDate(from)}`
  if (!from && until) return `Hingga ${formatDate(until)}`
  return `${formatDate(from)} – ${formatDate(until)}`
}

function getValidityCountdown(from, until) {
  const now = new Date()
  if (from && new Date(from) > now) {
    const diffDays = Math.ceil((new Date(from) - now) / (1000 * 60 * 60 * 24))
    return `Mulai dalam ${diffDays} hari`
  }
  if (until) {
    const diffDays = Math.ceil((new Date(until) - now) / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return `Kedaluwarsa ${Math.abs(diffDays)} hari lalu`
    if (diffDays === 0) return 'Berakhir hari ini'
    return `Berakhir dalam ${diffDays} hari`
  }
  return 'Tanpa batas waktu'
}

function getRemainingSlotsText(item) {
  if (item.max_uses === null || item.max_uses === undefined) return 'Sisa slot: Unlimited'
  const reservedSlots = item.reserved_slots_count ?? item.used_count ?? 0
  const remaining = item.remaining_slots ?? Math.max(0, item.max_uses - reservedSlots)
  return `Sisa slot: ${remaining}`
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'active':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'scheduled':
      return 'bg-sky-50 text-sky-700 border-sky-200'
    case 'expired':
      return 'bg-rose-50 text-rose-700 border-rose-200'
    case 'exhausted':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'inactive':
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200'
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'active':
      return 'Aktif'
    case 'scheduled':
      return 'Terjadwal'
    case 'expired':
      return 'Kedaluwarsa'
    case 'exhausted':
      return 'Kuota Habis'
    case 'inactive':
    default:
      return 'Nonaktif'
  }
}

function getOrderStatusBadgeClass(status) {
  if (status === 'settlement' || status === 'capture') {
    return 'bg-emerald-50 text-emerald-700'
  }
  if (status === 'pending') {
    return 'bg-amber-50 text-amber-700'
  }
  return 'bg-rose-50 text-rose-700'
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
