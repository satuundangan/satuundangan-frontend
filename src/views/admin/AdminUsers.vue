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
        <div
          class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between"
        >
          <div>
            <p class="text-[11px] font-black uppercase tracking-wider text-slate-500">
              Total Pengguna
            </p>
            <h3 class="text-2xl font-black text-slate-900 mt-1">{{ stats.total ?? '—' }}</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Semua akun, bukan halaman ini saja</p>
          </div>
          <div
            class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shrink-0"
          >
            <i class="fa-solid fa-users"></i>
          </div>
        </div>

        <!-- Verified Users -->
        <div
          class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between"
        >
          <div>
            <p class="text-[11px] font-black uppercase tracking-wider text-emerald-700">
              Email Terverifikasi
            </p>
            <h3 class="text-2xl font-black text-slate-900 mt-1">{{ stats.verified ?? '—' }}</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Timestamp verifikasi tersimpan</p>
          </div>
          <div
            class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg shrink-0"
          >
            <i class="fa-solid fa-envelope-circle-check"></i>
          </div>
        </div>

        <!-- Admin Users -->
        <div
          class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between"
        >
          <div>
            <p class="text-[11px] font-black uppercase tracking-wider text-indigo-600">
              Administrator
            </p>
            <h3 class="text-2xl font-black text-slate-900 mt-1">{{ stats.admins ?? '—' }}</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Akses panel admin</p>
          </div>
          <div
            class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg shrink-0"
          >
            <i class="fa-solid fa-shield-halved"></i>
          </div>
        </div>

        <!-- Regular Users -->
        <div
          class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between"
        >
          <div>
            <p class="text-[11px] font-black uppercase tracking-wider text-amber-700">
              User Pengantin
            </p>
            <h3 class="text-2xl font-black text-slate-900 mt-1">{{ stats.customers ?? '—' }}</h3>
            <p class="text-[11px] text-slate-500 mt-0.5">Pembuat undangan</p>
          </div>
          <div
            class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg shrink-0"
          >
            <i class="fa-solid fa-heart"></i>
          </div>
        </div>
      </div>

      <!-- Quick Filter Bar -->
      <div
        class="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3"
      >
        <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          <button
            type="button"
            @click="setQuickFilter('')"
            :class="[
              'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
              !quickFilter
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
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
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200',
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
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200',
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

      <div class="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <label class="grid gap-1 text-[11px] font-semibold text-slate-600">
          Verifikasi
          <select
            v-model="verificationFilter"
            class="min-w-36 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
            @change="applyFilters"
          >
            <option value="all">Semua</option>
            <option value="verified">Terverifikasi</option>
            <option value="unverified">Belum verifikasi</option>
          </select>
        </label>
        <label class="grid gap-1 text-[11px] font-semibold text-slate-600">
          Role
          <select
            v-model="roleFilter"
            class="min-w-36 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
            @change="applyFilters"
          >
            <option value="all">Semua role</option>
            <option value="customer">Pelanggan</option>
            <option value="admin">Administrator</option>
          </select>
        </label>
        <label class="grid gap-1 text-[11px] font-semibold text-slate-600">
          Metode daftar
          <select
            v-model="providerFilter"
            class="min-w-36 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
            @change="applyFilters"
          >
            <option value="all">Semua metode</option>
            <option value="local">Email/password</option>
            <option value="google">Google</option>
          </select>
        </label>
        <label class="grid gap-1 text-[11px] font-semibold text-slate-600">
          Tahap pelanggan
          <select
            v-model="lifecycleFilter"
            class="min-w-44 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
            @change="applyFilters"
          >
            <option value="all">Semua tahap</option>
            <option value="never_started">Belum membuat undangan</option>
            <option value="draft">Memiliki draft</option>
            <option value="checkout_pending">Checkout menunggu</option>
            <option value="paid">Memiliki transaksi berbayar</option>
            <option value="published">Undangan terbit</option>
          </select>
        </label>
        <button
          v-if="hasActiveFilters"
          type="button"
          class="rounded-lg px-3 py-2 text-xs font-bold text-slate-600 underline"
          @click="resetFilters"
        >
          Reset filter
        </button>
        <p class="ml-auto text-[11px] text-slate-500">
          Total hasil: {{ total }} · Segmen dihitung di server
        </p>
      </div>

      <div
        class="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3"
      >
        <label class="text-[11px] font-semibold text-slate-600" for="saved-user-segment"
          >Filter tersimpan</label
        >
        <select
          id="saved-user-segment"
          v-model="selectedSegmentId"
          class="min-w-48 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
          @change="applySavedSegment"
        >
          <option value="">Pilih preset filter</option>
          <option v-for="segment in savedSegments" :key="segment.id" :value="segment.id">
            {{ segment.name }}
          </option>
        </select>
        <button
          type="button"
          class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
          @click="saveCurrentSegment"
        >
          Simpan filter saat ini
        </button>
        <button
          v-if="selectedSegmentId"
          type="button"
          class="rounded-lg px-3 py-2 text-xs font-semibold text-rose-700 underline"
          @click="removeSavedSegment"
        >
          Hapus preset
        </button>
        <span class="text-[10px] text-slate-500"
          >Preset menyimpan pilihan filter saja, di browser ini.</span
        >
      </div>

      <AdminTableStatus
        :error="loadError"
        :loading="loading"
        :count="users.length"
        :filtered="hasActiveFilters"
        :updated-at="lastLoadedAt"
        :visibility="cols"
        exportable
        :exporting="exporting"
        :export-note="exportNote"
        @retry="loadUsers"
        @reset="resetFilters"
        @export="exportUsers"
      />

      <!-- 2. Clean Datatable Card -->
      <div
        v-if="!loadError"
        class="card bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
      >
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
              <p class="text-xs text-slate-500">Coba ubah kata kunci pencarian Anda.</p>
            </div>
          </template>
          <template #loading>
            <div class="py-8 text-center text-sm font-medium text-slate-500">
              Memuat data pengguna...
            </div>
          </template>

          <!-- User Name & Avatar & ID -->
          <Column
            v-if="cols.isVisible('name')"
            field="name"
            header="Pengguna"
            style="min-width: 14rem"
          >
            <template #body="{ data }">
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs"
                >
                  {{ (data.name || data.email || 'U').charAt(0).toUpperCase() }}
                </div>
                <div class="flex flex-col min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-slate-900 text-xs truncate max-w-[180px]">{{
                      data.name || '-'
                    }}</span>
                    <span
                      class="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded"
                      >#{{ data.id }}</span
                    >
                    <span
                      v-if="isTestAccount(data)"
                      class="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 border border-rose-200"
                    >
                      🤖 Akun Test
                    </span>
                  </div>
                  <span class="text-[11px] text-slate-500 truncate max-w-[180px]">{{
                    data.email
                  }}</span>
                </div>
              </div>
            </template>
          </Column>

          <!-- Email & Verification Status -->
          <Column v-if="cols.isVisible('email')" header="Status Email" style="min-width: 12rem">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                    data.emailVerifiedAt
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200',
                  ]"
                >
                  <i
                    :class="
                      data.emailVerifiedAt
                        ? 'fa-solid fa-check text-[9px]'
                        : 'fa-solid fa-clock text-[9px]'
                    "
                  ></i>
                  {{ data.emailVerifiedAt ? 'Terverifikasi' : 'Belum Verifikasi' }}
                </span>
                <button
                  v-if="!data.emailVerifiedAt"
                  type="button"
                  :disabled="verifyingId === data.id"
                  @click="handleQuickVerify(data)"
                  class="px-2 py-0.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1 disabled:opacity-50"
                  title="Verifikasi manual akun ini sekarang"
                >
                  <i
                    v-if="verifyingId === data.id"
                    class="fa-solid fa-spinner fa-spin text-[9px]"
                  ></i>
                  <i v-else class="fa-solid fa-shield-check text-[9px]"></i>
                  <span>Verif</span>
                </button>
              </div>
            </template>
          </Column>

          <!-- Provider Login -->
          <Column v-if="cols.isVisible('login')" header="Metode Login" style="min-width: 9rem">
            <template #body="{ data }">
              <div class="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                <i
                  v-if="data.provider === 'google'"
                  class="fa-brands fa-google text-red-500 text-xs"
                ></i>
                <i v-else class="fa-solid fa-envelope text-slate-500 text-xs"></i>
                <span class="capitalize">{{ data.provider || 'Email' }}</span>
              </div>
            </template>
          </Column>

          <!-- Role -->
          <Column v-if="cols.isVisible('role')" field="role" header="Role" style="min-width: 7rem">
            <template #body="{ data }">
              <span
                class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border"
                :class="
                  data.isAdmin
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                "
              >
                <i
                  :class="
                    data.isAdmin
                      ? 'fa-solid fa-shield-halved text-[9px]'
                      : 'fa-solid fa-user text-[9px]'
                  "
                ></i>
                {{ data.isAdmin ? 'Admin' : 'User' }}
              </span>
            </template>
          </Column>

          <!-- Wedding Planner Access -->
          <Column v-if="cols.isVisible('planner')" header="Planner" style="min-width: 8rem">
            <template #body="{ data }">
              <span
                v-if="data.hasWeddingPlannerAccess"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200"
                :title="data.instagramHandle ? 'IG: ' + data.instagramHandle : 'Akses Aktif'"
              >
                <i class="fa-solid fa-crown text-[9px] text-amber-700"></i>
                <span>Aktif</span>
              </span>
              <span v-else class="text-[11px] text-slate-500 font-medium"> Terkunci </span>
            </template>
          </Column>

          <!-- Total Invitations -->
          <Column v-if="cols.isVisible('invitations')" header="Undangan" style="min-width: 8rem">
            <template #body="{ data }">
              <span
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold"
              >
                <i class="fa-solid fa-envelope-open-text text-[10px]"></i>
                {{ data.invitationsCount || 0 }} Undangan
              </span>
            </template>
          </Column>

          <Column header="Transaksi berbayar" style="min-width: 9rem">
            <template #body="{ data }">
              <div class="text-xs font-bold text-slate-800">
                {{ data.paidTransactionsCount }} transaksi
              </div>
              <div class="mt-0.5 text-[10px] text-slate-500">
                {{ data.paidTransactionsByFallback }} transaksi tertaut tanpa ID akun
              </div>
            </template>
          </Column>

          <Column header="Pembayaran sukses" style="min-width: 9rem">
            <template #body="{ data }">
              <div class="text-xs font-bold text-slate-800">
                {{ formatMoney(data.paidSpendByAccount) }}
              </div>
              <div class="mt-0.5 text-[10px] text-slate-500">ID akun · setelah diskon</div>
              <div class="mt-0.5 text-[10px] text-amber-700">
                Email/undangan tertaut: {{ formatMoney(data.paidSpendByFallback) }}
              </div>
            </template>
          </Column>

          <!-- Stored account timestamp; historical capture quality is not validated. -->
          <Column
            v-if="cols.isVisible('created')"
            field="createdAt"
            header="Waktu Tercatat"
            style="min-width: 12rem"
          >
            <template #body="{ data }">
              <div class="flex flex-col">
                <span class="text-xs font-semibold text-slate-800 font-mono">
                  {{ formatDate(data.createdAt) }}
                </span>
                <span class="mt-0.5 text-[10px] text-amber-700"
                  >Akurasi tanggal lama belum tervalidasi</span
                >
              </div>
            </template>
          </Column>

          <Column
            v-if="cols.isVisible('lastLogin')"
            field="lastLoginAt"
            header="Login Terakhir"
            style="min-width: 12rem"
          >
            <template #body="{ data }">
              <div class="flex flex-col">
                <span v-if="data.lastLoginAt" class="text-xs font-semibold text-slate-800">{{
                  formatDate(data.lastLoginAt)
                }}</span>
                <span v-else class="text-xs text-slate-500">Belum diketahui</span>
                <span class="mt-0.5 text-[10px] text-slate-500">Dicatat mulai fitur ini aktif</span>
              </div>
            </template>
          </Column>

          <!-- Aksi -->
          <Column
            header="Aksi"
            headerClass="text-right"
            bodyClass="text-right"
            style="min-width: 14rem"
          >
            <template #body="{ data }">
              <div class="flex justify-end gap-1.5 text-xs font-medium">
                <button
                  type="button"
                  class="flex h-8 items-center gap-1.5 rounded-xl border border-blue-200 px-3 text-blue-700 hover:bg-blue-50"
                  @click="openCustomerDetail(data)"
                >
                  <i class="fa-solid fa-address-card text-[10px]"></i> Detail
                </button>
                <button
                  type="button"
                  class="flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 px-3 hover:bg-slate-50 transition-colors text-slate-700 font-bold cursor-pointer"
                  @click="openEdit(data)"
                  title="Edit pengguna"
                >
                  <i class="fa-solid fa-pencil text-[10px] text-slate-500"></i> Edit
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

    <Transition name="fade">
      <div
        v-if="customerDetailOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 backdrop-blur-sm"
        @click.self="customerDetailOpen = false"
      >
        <section
          class="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl md:p-7"
          role="dialog"
          aria-modal="true"
          aria-labelledby="customer-detail-title"
        >
          <div class="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <p class="text-[10px] font-black uppercase tracking-widest text-blue-700">
                Profil pelanggan
              </p>
              <h2 id="customer-detail-title" class="mt-1 text-xl font-black text-slate-900">
                {{ customerDetail?.customer?.name || customerDetail?.customer?.email || 'Memuat…' }}
              </h2>
              <p class="mt-1 text-sm text-slate-600">{{ customerDetail?.customer?.email }}</p>
            </div>
            <button
              type="button"
              class="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Tutup detail"
              @click="customerDetailOpen = false"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div v-if="customerDetailLoading" class="py-12 text-center text-sm text-slate-500">
            Memuat detail pelanggan…
          </div>
          <div
            v-else-if="customerDetailError"
            role="alert"
            class="my-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
          >
            {{ customerDetailError }}
          </div>
          <div v-else-if="customerDetail" class="space-y-5 pt-5">
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div class="rounded-xl bg-slate-50 p-3">
                <p class="text-[10px] uppercase text-slate-500">Tahap berbukti</p>
                <p class="mt-1 text-sm font-bold text-slate-900">
                  {{ lifecycleLabel(customerDetail.lifecycle.stage) }}
                </p>
              </div>
              <div class="rounded-xl bg-slate-50 p-3">
                <p class="text-[10px] uppercase text-slate-500">Undangan milik akun</p>
                <p class="mt-1 text-sm font-bold text-slate-900">
                  {{ customerDetail.summary.invitationCount }}
                </p>
              </div>
              <div class="rounded-xl bg-slate-50 p-3">
                <p class="text-[10px] uppercase text-slate-500">Belanja via ID akun</p>
                <p class="mt-1 text-sm font-bold text-slate-900">
                  {{ formatMoney(customerDetail.summary.spendByAccount) }}
                </p>
              </div>
              <div class="rounded-xl bg-amber-50 p-3">
                <p class="text-[10px] uppercase text-amber-800">Transaksi tanpa ID akun</p>
                <p class="mt-1 text-sm font-bold text-amber-950">
                  {{ formatMoney(customerDetail.summary.spendByFallback) }} ·
                  {{ customerDetail.summary.paidTransactionCountByFallback }} transaksi
                </p>
              </div>
            </div>
            <p class="text-xs leading-relaxed text-slate-600">
              {{ customerDetail.lifecycle.evidence }} Transaksi tanpa ID akun ditampilkan terpisah;
              email pembayar saja belum membuktikan kepemilikan akun.
            </p>
            <div class="grid gap-5 lg:grid-cols-2">
              <section>
                <h3 class="mb-2 text-sm font-black text-slate-900">Undangan</h3>
                <div
                  v-if="!customerDetail.invitations.length"
                  class="rounded-xl border border-dashed p-4 text-xs text-slate-500"
                >
                  Belum ada undangan tercatat.
                </div>
                <ul v-else class="divide-y divide-slate-100 rounded-xl border border-slate-100">
                  <li
                    v-for="inv in customerDetail.invitations"
                    :key="inv.id"
                    class="flex items-center justify-between gap-3 p-3"
                  >
                    <div>
                      <p class="text-xs font-bold text-slate-800">
                        {{ inv.title || `Undangan #${inv.id}` }}
                      </p>
                      <p class="mt-1 text-[10px] text-slate-500">
                        Dibuat {{ formatDate(inv.createdAt) }} · waktu lama belum tervalidasi
                      </p>
                      <p
                        v-if="inv.publishedAt || inv.isPublished"
                        class="mt-1 text-[10px] text-slate-500"
                      >
                        Pertama terbit:
                        {{
                          inv.publishedAt ? formatDate(inv.publishedAt) : 'waktu belum diketahui'
                        }}
                      </p>
                    </div>
                    <span
                      class="rounded-full px-2 py-1 text-[10px] font-bold"
                      :class="
                        inv.isPublished
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      "
                      >{{ inv.isPublished ? 'Terbit' : 'Draft' }}</span
                    >
                  </li>
                </ul>
                <p
                  v-if="customerDetail.summary.invitationCount > customerDetail.invitations.length"
                  class="mt-2 text-[10px] text-slate-500"
                >
                  Menampilkan {{ customerDetail.invitations.length }} undangan terbaru dari
                  {{ customerDetail.summary.invitationCount }} undangan milik akun.
                </p>
                <p
                  v-if="customerDetail.summary.paymentCount > customerDetail.payments.length"
                  class="mt-2 text-[10px] text-slate-500"
                >
                  Menampilkan {{ customerDetail.payments.length }} transaksi terbaru dari
                  {{ customerDetail.summary.paymentCount }} transaksi tertaut.
                </p>
              </section>
              <section>
                <h3 class="mb-2 text-sm font-black text-slate-900">
                  Transaksi dan identitas pembayar
                </h3>
                <div
                  v-if="!customerDetail.payments.length"
                  class="rounded-xl border border-dashed p-4 text-xs text-slate-500"
                >
                  Belum ada transaksi tertaut.
                </div>
                <ul v-else class="divide-y divide-slate-100 rounded-xl border border-slate-100">
                  <li v-for="payment in customerDetail.payments" :key="payment.id" class="p-3">
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <p class="text-xs font-bold text-slate-800">
                          {{ payment.orderId }} · {{ payment.invitation?.title || payment.purpose }}
                        </p>
                        <p class="mt-1 text-[10px] text-slate-600">
                          Pembayar: {{ payment.payer.name }} · {{ payment.payer.email }}
                        </p>
                        <p class="mt-1 text-[10px] text-slate-500">
                          Kaitan:
                          {{
                            payment.accountAttribution === 'account_id'
                              ? 'ID akun'
                              : payment.accountAttribution === 'owned_invitation'
                                ? 'Undangan milik akun'
                                : payment.accountAttribution === 'payer_email_match'
                                  ? 'Email pembayar saja'
                                  : 'Tidak tertaut ke akun'
                          }}
                          · settlement {{ formatDate(payment.settlementTime) }}
                        </p>
                      </div>
                      <div class="text-right">
                        <p class="text-xs font-bold text-slate-900">
                          {{ formatMoney(payment.amount) }}
                        </p>
                        <p class="mt-1 text-[10px] text-slate-500">
                          {{ payment.status }} ·
                          {{
                            payment.paymentType ||
                            payment.paymentMethod ||
                            'gateway tidak diketahui'
                          }}
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </section>
            </div>
            <section>
              <h3 class="mb-2 text-sm font-black text-slate-900">Aktivitas yang memiliki waktu</h3>
              <div class="max-h-56 overflow-y-auto rounded-xl border border-slate-100">
                <p v-if="!customerDetail.timeline.length" class="p-4 text-xs text-slate-500">
                  Belum ada event dengan waktu yang bisa ditampilkan.
                </p>
                <ul v-else class="divide-y divide-slate-100">
                  <li
                    v-for="(event, index) in customerDetail.timeline"
                    :key="`${event.type}-${event.paymentId || event.invitationId || index}`"
                    class="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5"
                  >
                    <span class="text-xs font-semibold text-slate-700">{{
                      event.label || event.type
                    }}</span
                    ><span class="text-[10px] text-slate-500"
                      >{{ formatDate(event.at)
                      }}<template v-if="event.evidence"> · {{ event.evidence }}</template></span
                    >
                  </li>
                </ul>
              </div>
            </section>
            <p class="rounded-xl bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900">
              {{ customerDetail.limitations.join(' ') }} Histori aktivitas terbatas pada data yang
              masih tersedia. Nilai transaksi memakai Payment.amount setelah diskon; data
              refund/biaya/komisi tidak dikurangkan.
            </p>
          </div>
        </section>
      </div>
    </Transition>

    <!-- Modal Form Tambah / Edit Pengguna -->
    <Transition name="fade">
      <div
        v-if="showForm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs px-4"
        @click.self="closeForm"
      >
        <div class="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
          <div class="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
            <div class="flex items-center gap-2.5">
              <div
                class="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm font-black"
              >
                <i :class="editing ? 'fa-solid fa-user-pen' : 'fa-solid fa-user-plus'"></i>
              </div>
              <div>
                <h2 class="text-base font-black text-slate-900">
                  {{ editing ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru' }}
                </h2>
                <p class="text-xs text-slate-500 mt-0.5">Kelola akun dan kredensial login</p>
              </div>
            </div>
            <button
              class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              @click="closeForm"
            >
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
                :placeholder="
                  editing ? 'Kosongkan jika tidak ingin mengubah password' : 'Minimal 6 karakter'
                "
              />
            </div>

            <div
              class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
            >
              <div>
                <label for="isAdmin" class="text-xs font-bold text-slate-900 block cursor-pointer"
                  >Hak Akses Administrator</label
                >
                <p class="text-[11px] text-slate-500">
                  Izinkan akun ini mengakses panel dashboard admin
                </p>
              </div>
              <input
                id="isAdmin"
                v-model="form.isAdmin"
                type="checkbox"
                class="h-5 w-5 rounded-md border-slate-300 text-slate-900 focus:ring-slate-500 cursor-pointer"
              />
            </div>

            <div
              v-if="editing && form.isAdmin && isSuperadmin"
              class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
            >
              <div>
                <label for="adminRole" class="text-xs font-bold text-slate-900 block"
                  >Role Admin</label
                >
                <p class="text-[11px] text-slate-500">
                  Superadmin mengakses semua fitur; role lain dibatasi di server.
                </p>
              </div>
              <select
                id="adminRole"
                v-model="form.adminRole"
                class="rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-semibold"
              >
                <option value="superadmin">Superadmin</option>
                <option value="support">Support</option>
                <option value="finance">Finance</option>
                <option value="content">Content</option>
              </select>
            </div>

            <div
              v-if="editing"
              class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
            >
              <div>
                <label
                  for="isEmailVerified"
                  class="text-xs font-bold text-slate-900 block cursor-pointer"
                  >Status Verifikasi Email</label
                >
                <p class="text-[11px] text-slate-500">
                  Bypass / verifikasi email pengguna secara instan
                </p>
              </div>
              <input
                id="isEmailVerified"
                v-model="form.isEmailVerified"
                type="checkbox"
                class="h-5 w-5 rounded-md border-slate-300 text-emerald-700 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            <div
              v-if="editing"
              class="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2.5"
            >
              <div class="flex items-center justify-between">
                <div>
                  <label
                    for="hasWeddingPlannerAccess"
                    class="text-xs font-bold text-amber-900 block cursor-pointer flex items-center gap-1.5"
                  >
                    <i class="fa-solid fa-crown text-amber-700 text-xs"></i>
                    <span>Akses Wedding Planner (Gratis / VIP)</span>
                  </label>
                  <p class="text-[11px] text-amber-700/80">
                    Buka akses Wedding Planner untuk akun ini (bisa untuk kompensasi)
                  </p>
                </div>
                <input
                  id="hasWeddingPlannerAccess"
                  v-model="form.hasWeddingPlannerAccess"
                  type="checkbox"
                  class="h-5 w-5 rounded-md border-amber-300 text-amber-700 focus:ring-amber-500 cursor-pointer"
                />
              </div>
              <div v-if="form.hasWeddingPlannerAccess">
                <label class="text-[11px] font-bold text-amber-900 block mb-1"
                  >Handle Instagram / Bukti Follow</label
                >
                <input
                  v-model="form.instagramHandle"
                  type="text"
                  placeholder="@username"
                  class="w-full rounded-xl border border-amber-200 px-3 py-1.5 text-xs font-semibold outline-none focus:border-amber-400 bg-white"
                />
              </div>
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
import AdminTableStatus from '@/components/admin/AdminTableStatus.vue'
import { useColumnVisibility } from '@/utils/columnVisibility.js'
import { downloadCsv, fetchAllRows, toCsv } from '@/utils/csvExport.js'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import {
  fetchAdminUsers,
  fetchAdminUserStats,
  fetchAdminCustomerDetail,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  verifyAdminUserEmail,
} from '@/api/admin.js'
import { updateAdminRole } from '@/api/adminSecurity.js'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()
const authStore = useAuthStore()
const isSuperadmin = computed(() => authStore.adminRole === 'superadmin')
const users = ref([])
const total = ref(0)
const stats = ref({ total: null, verified: null, admins: null, customers: null })
const page = ref(1)
const limit = 15
const search = ref('')
const loading = ref(false)
const loadError = ref('')
const lastLoadedAt = ref(null)
const exporting = ref(false)
const exportNote = ref('')
const cols = useColumnVisibility('users', [
  { key: 'name', label: 'Pengguna', required: true },
  { key: 'email', label: 'Status email' },
  { key: 'login', label: 'Metode login' },
  { key: 'role', label: 'Role' },
  { key: 'planner', label: 'Planner' },
  { key: 'invitations', label: 'Undangan' },
  { key: 'created', label: 'Waktu tercatat' },
  { key: 'lastLogin', label: 'Login terakhir' },
])
const verifyingId = ref(null)
const showForm = ref(false)
const saving = ref(false)
const editing = ref(null)
const verificationFilter = ref('all')
const roleFilter = ref('all')
const lifecycleFilter = ref('all')
const providerFilter = ref('all')
const savedSegments = ref([])
const selectedSegmentId = ref('')
const customerDetailOpen = ref(false)
const customerDetailLoading = ref(false)
const customerDetailError = ref('')
const customerDetail = ref(null)

const form = reactive({
  name: '',
  email: '',
  isAdmin: false,
  isEmailVerified: false,
  hasWeddingPlannerAccess: false,
  instagramHandle: '',
  password: '',
  adminRole: 'superadmin',
})

const hasActiveFilters = computed(() =>
  Boolean(
    search.value ||
      quickFilter.value ||
      verificationFilter.value !== 'all' ||
      roleFilter.value !== 'all' ||
      lifecycleFilter.value !== 'all' ||
      providerFilter.value !== 'all',
  ),
)

function currentFilters() {
  return {
    q: search.value,
    verification: verificationFilter.value,
    role: roleFilter.value,
    lifecycle: lifecycleFilter.value,
    provider: providerFilter.value === 'all' ? '' : providerFilter.value,
  }
}

async function loadUsers() {
  loading.value = true
  loadError.value = ''
  try {
    const res = await fetchAdminUsers({ page: page.value, limit, ...currentFilters() })
    users.value = res.data || []
    total.value = res.total || 0
    lastLoadedAt.value = new Date()
  } catch (error) {
    loadError.value = error.message || 'Gagal memuat pengguna'
  } finally {
    loading.value = false
  }
}

async function loadStats() {
  try {
    stats.value = await fetchAdminUserStats()
  } catch {
    stats.value = { total: null, verified: null, admins: null, customers: null }
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
  verificationFilter.value = 'all'
  roleFilter.value = 'all'
  lifecycleFilter.value = 'all'
  providerFilter.value = 'all'
  page.value = 1
  loadUsers()
}

function applyFilters() {
  quickFilter.value = ''
  page.value = 1
  loadUsers()
}

function resetFilters() {
  search.value = ''
  quickFilter.value = ''
  verificationFilter.value = 'all'
  roleFilter.value = 'all'
  lifecycleFilter.value = 'all'
  providerFilter.value = 'all'
  page.value = 1
  loadUsers()
}

const SAVED_SEGMENTS_KEY = 'satuundangan.admin.users.saved-segments.v1'

function persistSavedSegments() {
  try {
    localStorage.setItem(SAVED_SEGMENTS_KEY, JSON.stringify(savedSegments.value))
  } catch {
    toast.error('Preset tidak dapat disimpan di browser ini.')
  }
}

function loadSavedSegments() {
  try {
    const stored = JSON.parse(localStorage.getItem(SAVED_SEGMENTS_KEY) || '[]')
    savedSegments.value = Array.isArray(stored)
      ? stored.filter(
          (segment) =>
            segment &&
            typeof segment.id === 'string' &&
            typeof segment.name === 'string' &&
            segment.filters,
        )
      : []
  } catch {
    savedSegments.value = []
  }
}

async function saveCurrentSegment() {
  const result = await Swal.fire({
    title: 'Simpan filter pelanggan',
    input: 'text',
    inputLabel: 'Nama preset',
    inputPlaceholder: 'Contoh: pelanggan checkout pending',
    inputValidator: (value) => (!value.trim() ? 'Nama preset wajib diisi.' : undefined),
    showCancelButton: true,
    confirmButtonText: 'Simpan preset',
    cancelButtonText: 'Batal',
  })
  if (!result.isConfirmed) return
  const segment = {
    id: crypto.randomUUID(),
    name: result.value.trim().slice(0, 60),
    filters: {
      verification: verificationFilter.value,
      role: roleFilter.value,
      lifecycle: lifecycleFilter.value,
      provider: providerFilter.value,
    },
  }
  savedSegments.value = [...savedSegments.value, segment]
  selectedSegmentId.value = segment.id
  persistSavedSegments()
}

function applySavedSegment() {
  const segment = savedSegments.value.find((item) => item.id === selectedSegmentId.value)
  if (!segment) return
  verificationFilter.value = segment.filters.verification || 'all'
  roleFilter.value = segment.filters.role || 'all'
  lifecycleFilter.value = segment.filters.lifecycle || 'all'
  providerFilter.value = segment.filters.provider || 'all'
  search.value = ''
  quickFilter.value = ''
  page.value = 1
  loadUsers()
}

async function removeSavedSegment() {
  const segment = savedSegments.value.find((item) => item.id === selectedSegmentId.value)
  if (!segment) return
  const result = await Swal.fire({
    title: 'Hapus preset filter?',
    text: segment.name,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Hapus preset',
    cancelButtonText: 'Batal',
  })
  if (!result.isConfirmed) return
  savedSegments.value = savedSegments.value.filter((item) => item.id !== segment.id)
  selectedSegmentId.value = ''
  persistSavedSegments()
}

function handleSearch(value) {
  search.value = value
  quickFilter.value = ''
  page.value = 1
  debouncedSearch()
}

async function exportUsers() {
  exporting.value = true
  exportNote.value = ''
  try {
    const { rows, total: all, truncated } = await fetchAllRows(fetchAdminUsers, currentFilters())
    downloadCsv(
      `pengguna-${new Date().toISOString().slice(0, 10)}.csv`,
      toCsv(
        [
          { label: 'ID', value: (u) => u.id },
          { label: 'Nama', value: (u) => u.name },
          { label: 'Email', value: (u) => u.email },
          { label: 'Admin', value: (u) => (u.isAdmin ? 'ya' : 'tidak') },
          { label: 'Role Admin', value: (u) => u.adminRole || '' },
          { label: 'Metode daftar', value: (u) => u.provider || '' },
          { label: 'Email terverifikasi', value: (u) => (u.emailVerifiedAt ? 'ya' : 'tidak') },
          { label: 'Transaksi berbayar via ID akun', value: (u) => u.paidTransactionsCount },
          { label: 'Transaksi tertaut tanpa ID akun', value: (u) => u.paidTransactionsByFallback },
          { label: 'Payment.amount via ID akun', value: (u) => u.paidSpendByAccount },
          { label: 'Payment.amount tertaut tanpa ID akun', value: (u) => u.paidSpendByFallback },
          {
            label: 'Waktu tercatat (akurasi lama belum tervalidasi)',
            value: (u) => u.createdAt || '',
          },
          { label: 'Login terakhir sejak pelacakan aktif', value: (u) => u.lastLoginAt || '' },
        ],
        rows,
      ),
    )
    exportNote.value = truncated
      ? `Ekspor dibatasi ${rows.length} dari ${all} baris.`
      : `${rows.length} baris diekspor (semua hasil filter, bukan hanya halaman ini).`
  } catch (error) {
    exportNote.value = error.message || 'Ekspor gagal dijalankan.'
  } finally {
    exporting.value = false
  }
}

function onPage(event) {
  page.value = event.page + 1
  loadUsers()
}

async function openCustomerDetail(user) {
  customerDetailOpen.value = true
  customerDetailLoading.value = true
  customerDetailError.value = ''
  customerDetail.value = null
  try {
    customerDetail.value = await fetchAdminCustomerDetail(user.id)
  } catch (error) {
    customerDetailError.value = error.message || 'Detail pelanggan gagal dimuat.'
  } finally {
    customerDetailLoading.value = false
  }
}

function openCreate() {
  editing.value = null
  Object.assign(form, {
    name: '',
    email: '',
    isAdmin: false,
    isEmailVerified: false,
    hasWeddingPlannerAccess: false,
    instagramHandle: '',
    password: '',
    adminRole: 'superadmin',
  })
  showForm.value = true
}

function openEdit(user) {
  editing.value = user
  Object.assign(form, {
    name: user.name || '',
    email: user.email || '',
    isAdmin: Boolean(user.isAdmin),
    isEmailVerified: Boolean(user.emailVerifiedAt),
    hasWeddingPlannerAccess: Boolean(user.hasWeddingPlannerAccess),
    instagramHandle: user.instagramHandle || '',
    password: '',
    adminRole: user.adminRole || 'superadmin',
  })
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  saving.value = false
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && showForm.value) closeForm()
  if (e.key === 'Escape' && customerDetailOpen.value) customerDetailOpen.value = false
}

async function submitForm() {
  saving.value = true
  try {
    let reason
    if (editing.value) {
      const reasonResult = await Swal.fire({
        title: 'Catat alasan perubahan',
        input: 'textarea',
        inputLabel: 'Alasan ini masuk ke jejak audit admin',
        inputPlaceholder: 'Contoh: koreksi data berdasarkan permintaan pelanggan',
        inputValidator: (value) =>
          value.trim().length < 5 ? 'Alasan minimal 5 karakter.' : undefined,
        showCancelButton: true,
        confirmButtonText: 'Simpan perubahan',
        cancelButtonText: 'Batal',
      })
      if (!reasonResult.isConfirmed) return
      reason = reasonResult.value
    }
    const { adminRole, ...payload } = { ...form }
    if (editing.value && !payload.password) {
      delete payload.password
    }
    if (editing.value) {
      await updateAdminUser(editing.value.id, payload, reason)
      const currentRole = editing.value.adminRole || 'superadmin'
      if (isSuperadmin.value && payload.isAdmin && adminRole !== currentRole) {
        await updateAdminRole(editing.value.id, adminRole, reason)
      }
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

async function handleQuickVerify(user) {
  const result = await Swal.fire({
    title: 'Verifikasi Email Manual?',
    html: `Verifikasi email untuk akun <strong>${user.name || user.email}</strong> secara manual? Pengguna dapat langsung checkout dan menggunakan seluruh fitur. Alasan dicatat di jejak audit.`,
    input: 'textarea',
    inputLabel: 'Alasan verifikasi (wajib)',
    inputValidator: (value) => (value.trim().length < 5 ? 'Alasan minimal 5 karakter.' : undefined),
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#059669',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, Verifikasi Akun',
    cancelButtonText: 'Batal',
  })

  if (!result.isConfirmed) return

  verifyingId.value = user.id
  try {
    await verifyAdminUserEmail(user.id, result.value)
    toast.success(`Email ${user.email} berhasil diverifikasi!`)
    loadUsers()
  } catch (error) {
    toast.error(error.message || 'Gagal memverifikasi email')
  } finally {
    verifyingId.value = null
  }
}

async function confirmDelete(user) {
  let impact
  try {
    impact = await fetchAdminCustomerDetail(user.id)
  } catch (error) {
    toast.error(error.message || 'Dampak penghapusan belum dapat dimuat. Akun tidak dihapus.')
    return
  }
  const result = await Swal.fire({
    title: 'Hapus Pengguna?',
    html: `Akun <strong>${user.name || user.email}</strong> memiliki <strong>${impact.summary.invitationCount}</strong> undangan terkait dan <strong>${impact.summary.paymentCount}</strong> transaksi terkait. Undangan akan dihapus bersama akun; catatan transaksi dipertahankan. Tindakan ini tidak dapat dibatalkan.`,
    input: 'textarea',
    inputLabel: 'Alasan penghapusan (wajib untuk jejak audit)',
    inputPlaceholder: 'Tuliskan alasan operasional yang jelas',
    inputValidator: (value) => (value.trim().length < 5 ? 'Alasan minimal 5 karakter.' : undefined),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#94a3b8',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
  })

  if (!result.isConfirmed) return

  try {
    await deleteAdminUser(user.id, result.value)
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
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatMoney(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function lifecycleLabel(stage) {
  return (
    {
      published: 'Undangan terbit',
      checkout_pending: 'Checkout menunggu',
      paid: 'Transaksi berbayar',
      paid_by_legacy_link: 'Transaksi tertaut tanpa ID akun',
      draft: 'Memiliki draft',
      verified_no_invitation: 'Email terverifikasi',
      unverified: 'Belum terverifikasi',
    }[stage] || 'Belum ada data'
  )
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  loadSavedSegments()
  loadUsers()
  loadStats()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
