<template>
  <AdminShell title="Dashboard Bisnis & Operasional" description="Pusat Kendali Metrik Bisnis, Rekonsiliasi, dan Pertumbuhan Platform">
    
    <!-- Top Filter Bar & Timezone Info -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
          <i class="fa-solid fa-calendar-days text-slate-400 mr-1.5"></i>
          Periode:
        </span>
        <button
          v-for="r in rangeOptions"
          :key="r.key"
          @click="changeRange(r.key)"
          :class="[
            selectedRange === r.key
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all'
          ]"
        >
          {{ r.label }}
        </button>
      </div>

      <div class="flex items-center gap-3 text-xs text-slate-500">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          WIB (UTC+7)
        </span>
        <span v-if="lastUpdatedText" class="text-[11px] text-slate-400">
          Update: {{ lastUpdatedText }}
        </span>
        <button
          @click="refreshAll"
          :disabled="isLoadingStats"
          class="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          title="Segarkan Data"
        >
          <i :class="['fa-solid fa-rotate-right text-xs', isLoadingStats && 'animate-spin text-blue-600']"></i>
        </button>
      </div>
    </div>

    <!-- Action Required / Perlu Tindakan Panel (ADM-019) -->
    <section v-if="actionQueue.length > 0" class="mb-8">
      <div class="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-white p-5 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2.5">
            <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
              <i class="fa-solid fa-triangle-exclamation text-sm"></i>
            </span>
            <div>
              <h2 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                Perlu Tindakan Operasional
                <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
                  {{ totalActionItems }} antrean
                </span>
              </h2>
              <p class="text-[11px] text-slate-500">Item kritis yang membutuhkan verifikasi atau intervensi admin segera</p>
            </div>
          </div>
          <RouterLink
            to="/admin/payments?tab=reconciliation"
            class="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 uppercase tracking-wider"
          >
            Buka Pusat Rekonsiliasi
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </RouterLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          <div
            v-for="item in actionQueue"
            :key="item.type"
            class="p-3.5 bg-white rounded-xl border border-amber-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <span
                  :class="[
                    item.severity === 'danger'
                      ? 'bg-rose-100 text-rose-700 border-rose-200'
                      : item.severity === 'warning'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-blue-100 text-blue-700 border-blue-200',
                    'px-2 py-0.5 rounded-md text-[10px] font-extrabold border'
                  ]"
                >
                  {{ item.count }} item
                </span>
                <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {{ item.severity === 'danger' ? 'Prioritas Tinggi' : 'Operasional' }}
                </span>
              </div>
              <h4 class="text-xs font-bold text-slate-800 line-clamp-1 mb-1">{{ item.title }}</h4>
              <p class="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{{ item.description }}</p>
            </div>
            <RouterLink
              :to="item.link"
              class="mt-3 inline-flex items-center justify-between text-xs font-bold text-slate-700 hover:text-blue-600 pt-2 border-t border-slate-100"
            >
              <span>{{ item.actionLabel }}</span>
              <i class="fa-solid fa-chevron-right text-[9px]"></i>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Financial & Business KPIs (ADM-017, ADM-020, ADM-021) -->
    <section class="mb-8">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <i class="fa-solid fa-chart-pie text-slate-400"></i>
          Ringkasan Finansial & Konversi ({{ activeRangeLabel }})
        </h2>
        <span class="text-[11px] text-slate-400">Klik kartu untuk melihat rincian</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- 1. Omzet / Gross Revenue -->
        <RouterLink
          to="/admin/payments?status=paid"
          class="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden block"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Omzet</span>
            <div class="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-money-bill-trend-up"></i>
            </div>
          </div>
          <div v-if="isLoadingStats" class="space-y-2 animate-pulse my-2">
            <div class="h-7 bg-slate-200 rounded w-3/4"></div>
            <div class="h-3 bg-slate-100 rounded w-1/2"></div>
          </div>
          <div v-else>
            <p class="text-2xl font-extrabold text-slate-900 tracking-tight">{{ formatRupiah(kpiData.revenue?.value) }}</p>
            <div class="mt-2 flex items-center justify-between text-[11px]">
              <span
                v-if="kpiData.revenue?.growth !== null"
                :class="[
                  kpiData.revenue?.growth > 0
                    ? 'text-emerald-600 bg-emerald-50'
                    : kpiData.revenue?.growth < 0
                    ? 'text-rose-600 bg-rose-50'
                    : 'text-slate-600 bg-slate-50',
                  'px-1.5 py-0.5 rounded font-bold inline-flex items-center gap-1'
                ]"
              >
                <i :class="kpiData.revenue?.growth >= 0 ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"></i>
                {{ Math.abs(kpiData.revenue?.growth) }}% vs lalu
              </span>
              <span class="text-slate-400">Diskon: {{ formatRupiah(kpiData.revenue?.discount) }}</span>
            </div>
          </div>
        </RouterLink>

        <!-- 2. Order Lunas (Paid Orders) -->
        <RouterLink
          to="/admin/payments?status=paid"
          class="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden block"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Berbayar</span>
            <div class="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-cart-shopping"></i>
            </div>
          </div>
          <div v-if="isLoadingStats" class="space-y-2 animate-pulse my-2">
            <div class="h-7 bg-slate-200 rounded w-1/2"></div>
            <div class="h-3 bg-slate-100 rounded w-2/3"></div>
          </div>
          <div v-else>
            <p class="text-2xl font-extrabold text-slate-900 tracking-tight">{{ kpiData.paidOrders?.value || 0 }} <span class="text-xs font-semibold text-slate-400">transaksi</span></p>
            <div class="mt-2 flex items-center justify-between text-[11px]">
              <span
                v-if="kpiData.paidOrders?.growth !== null"
                :class="[
                  kpiData.paidOrders?.growth > 0
                    ? 'text-emerald-600 bg-emerald-50'
                    : kpiData.paidOrders?.growth < 0
                    ? 'text-rose-600 bg-rose-50'
                    : 'text-slate-600 bg-slate-50',
                  'px-1.5 py-0.5 rounded font-bold inline-flex items-center gap-1'
                ]"
              >
                <i :class="kpiData.paidOrders?.growth >= 0 ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"></i>
                {{ Math.abs(kpiData.paidOrders?.growth) }}% vs lalu
              </span>
              <span class="text-amber-600 font-semibold">Pending: {{ kpiData.pendingOrders?.value || 0 }}</span>
            </div>
          </div>
        </RouterLink>

        <!-- 3. Rata-Rata Order (AOV) -->
        <RouterLink
          to="/admin/payments"
          class="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden block"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Rata-Rata Order (AOV)</span>
            <div class="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-scale-balanced"></i>
            </div>
          </div>
          <div v-if="isLoadingStats" class="space-y-2 animate-pulse my-2">
            <div class="h-7 bg-slate-200 rounded w-3/4"></div>
            <div class="h-3 bg-slate-100 rounded w-1/2"></div>
          </div>
          <div v-else>
            <p class="text-2xl font-extrabold text-slate-900 tracking-tight">{{ formatRupiah(kpiData.aov?.value) }}</p>
            <div class="mt-2 flex items-center justify-between text-[11px]">
              <span
                v-if="kpiData.aov?.growth !== null"
                :class="[
                  kpiData.aov?.growth > 0
                    ? 'text-emerald-600 bg-emerald-50'
                    : kpiData.aov?.growth < 0
                    ? 'text-rose-600 bg-rose-50'
                    : 'text-slate-600 bg-slate-50',
                  'px-1.5 py-0.5 rounded font-bold inline-flex items-center gap-1'
                ]"
              >
                <i :class="kpiData.aov?.growth >= 0 ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"></i>
                {{ Math.abs(kpiData.aov?.growth) }}%
              </span>
              <span class="text-slate-400">Omzet / Paid Order</span>
            </div>
          </div>
        </RouterLink>

        <!-- 4. Pembeli Unik (Unique Buyers) -->
        <RouterLink
          to="/admin/users"
          class="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden block"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Pembeli Unik</span>
            <div class="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform">
              <i class="fa-solid fa-user-check"></i>
            </div>
          </div>
          <div v-if="isLoadingStats" class="space-y-2 animate-pulse my-2">
            <div class="h-7 bg-slate-200 rounded w-1/2"></div>
            <div class="h-3 bg-slate-100 rounded w-2/3"></div>
          </div>
          <div v-else>
            <p class="text-2xl font-extrabold text-slate-900 tracking-tight">{{ kpiData.uniqueBuyers?.value || 0 }} <span class="text-xs font-semibold text-slate-400">pelanggan</span></p>
            <div class="mt-2 flex items-center justify-between text-[11px]">
              <span class="text-slate-500 font-medium">
                Undangan: <strong class="text-slate-700">{{ kpiData.invitations?.paid || 0 }}</strong> berbayar
              </span>
              <span class="text-slate-400">
                {{ kpiData.invitations?.free || 0 }} promo/free
              </span>
            </div>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- Platform Operational Core Stats Grid (ADM-016, ADM-020) -->
    <section class="mb-8">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <i class="fa-solid fa-server text-slate-400"></i>
          Status Operasional Platform Kumulatif
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <RouterLink
          v-for="stat in operationalStats"
          :key="stat.label"
          :to="stat.link"
          class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300 group block"
        >
          <div class="space-y-1">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ stat.label }}</p>
            <p class="text-2xl font-extrabold text-slate-900 tracking-tight">
              <span v-if="stat.isError" class="text-slate-400 text-lg font-bold" title="Data tidak dapat dimuat">-</span>
              <span v-else>{{ stat.value }}</span>
            </p>
            <p class="text-[10px] text-slate-400 group-hover:text-blue-600 transition-colors">
              {{ stat.subtitle }} &rarr;
            </p>
          </div>
          <div :class="[stat.color, 'h-11 w-11 rounded-xl flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform']">
            <i :class="['fa-solid', stat.icon]"></i>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- Cockpit Interactive Controls & Trends -->
    <section class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Quick Actions & System Control -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Quick Actions Panel -->
        <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 class="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i class="fa-solid fa-wand-magic-sparkles text-indigo-500"></i>
            Aksi Cepat Admin
          </h3>
          <div class="grid grid-cols-2 gap-3">
            <RouterLink to="/admin/payments" class="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all text-center group">
              <i class="fa-solid fa-credit-card text-lg text-emerald-600 group-hover:scale-110 transition-transform mb-1.5"></i>
              <span class="text-[10px] font-bold text-slate-700">Pembayaran</span>
            </RouterLink>
            <RouterLink to="/admin/invitations" class="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all text-center group">
              <i class="fa-solid fa-envelope text-lg text-blue-500 group-hover:scale-110 transition-transform mb-1.5"></i>
              <span class="text-[10px] font-bold text-slate-700">Kelola Undangan</span>
            </RouterLink>
            <RouterLink to="/admin/templates" class="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/20 transition-all text-center group">
              <i class="fa-solid fa-palette text-lg text-pink-500 group-hover:scale-110 transition-transform mb-1.5"></i>
              <span class="text-[10px] font-bold text-slate-700">Buat Tema</span>
            </RouterLink>
            <RouterLink to="/admin/promo-codes" class="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/20 transition-all text-center group">
              <i class="fa-solid fa-ticket text-lg text-orange-500 group-hover:scale-110 transition-transform mb-1.5"></i>
              <span class="text-[10px] font-bold text-slate-700">Kode Promo</span>
            </RouterLink>
            <RouterLink to="/admin/users" class="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all text-center group">
              <i class="fa-solid fa-users text-lg text-indigo-500 group-hover:scale-110 transition-transform mb-1.5"></i>
              <span class="text-[10px] font-bold text-slate-700">Pengguna</span>
            </RouterLink>
            <RouterLink to="/admin/resellers" class="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/20 transition-all text-center group">
              <i class="fa-solid fa-handshake text-lg text-amber-500 group-hover:scale-110 transition-transform mb-1.5"></i>
              <span class="text-[10px] font-bold text-slate-700">Afiliasi & Reseller</span>
            </RouterLink>
          </div>
        </div>

        <!-- System Settings & Maintenance Mode -->
        <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
          <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
            <i class="fa-solid fa-gears text-slate-400"></i>
            Kontrol Pemeliharaan
          </h3>
          <div class="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <span class="text-xs font-bold text-slate-700 block">Mode Perbaikan (Maintenance)</span>
              <span class="text-[10px] text-slate-400 block">Buka/tutup akses publik aplikasi</span>
            </div>
            <button 
              @click="toggleMaintenance"
              :class="isMaintenanceMode ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-600'"
              class="w-12 h-6 rounded-full p-0.5 transition-colors relative flex items-center shadow-inner"
            >
              <span 
                :class="isMaintenanceMode ? 'translate-x-6' : 'translate-x-0'"
                class="w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
              ></span>
            </button>
          </div>
        </div>

        <!-- Live Diagnostics Tools -->
        <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
              <i class="fa-solid fa-shield-heart text-emerald-500"></i>
              Diagnostik Sistem
            </h3>
            <button
              @click="runDiagnostics"
              :disabled="isRunningDiagnostics"
              class="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <i class="fa-solid fa-rotate animate-spin text-[10px]" v-if="isRunningDiagnostics"></i>
              <span>{{ isRunningDiagnostics ? 'Cek...' : 'Uji Sekarang' }}</span>
            </button>
          </div>
          <p class="text-[10px] text-slate-400 leading-normal mb-3">Status konektivitas database, storage media, dan gateway Midtrans.</p>
          
          <div class="space-y-2">
            <div class="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs">
              <span class="font-medium text-slate-500">Database Core</span>
              <span v-if="!diagnosticResults?.database" class="text-slate-400">-</span>
              <span v-else class="font-bold text-emerald-600 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {{ diagnosticResults?.database?.msg || 'Connected' }}
              </span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs">
              <span class="font-medium text-slate-500">File Storage</span>
              <span v-if="!diagnosticResults?.storage" class="text-slate-400">-</span>
              <span v-else class="font-bold text-emerald-600">
                {{ diagnosticResults?.storage?.msg || 'Ready' }}
              </span>
            </div>
            <div class="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs">
              <span class="font-medium text-slate-500">Midtrans Gateway</span>
              <span v-if="!diagnosticResults?.payment" class="text-slate-400">-</span>
              <span v-else class="font-bold text-emerald-600">
                {{ diagnosticResults?.payment?.msg || 'Ready' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Trend Analysis Chart (ADM-016: Undangan Dibuat & Revenue) -->
      <div class="lg:col-span-2">
        <div class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm h-full flex flex-col justify-between">
          <div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <h3 class="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <i class="fa-solid fa-chart-line text-blue-500"></i>
                  Grafik Tren: {{ activeChartTab === 'invitations' ? 'Undangan Dibuat' : 'Pendapatan Harian' }}
                </h3>
                <p class="text-[10px] text-slate-400">
                  {{ activeChartTab === 'invitations' ? 'Kuantitas pembuatan undangan baru di platform.' : 'Akumulasi omzet transaksi lunas harian.' }}
                </p>
              </div>

              <!-- Chart Switcher Tabs -->
              <div class="flex items-center p-1 bg-slate-100 rounded-xl">
                <button
                  @click="activeChartTab = 'invitations'"
                  :class="[
                    activeChartTab === 'invitations'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900',
                    'px-3 py-1 rounded-lg text-xs font-bold transition-all'
                  ]"
                >
                  Undangan Dibuat
                </button>
                <button
                  @click="activeChartTab = 'revenue'"
                  :class="[
                    activeChartTab === 'revenue'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900',
                    'px-3 py-1 rounded-lg text-xs font-bold transition-all'
                  ]"
                >
                  Pendapatan (Rp)
                </button>
              </div>
            </div>
            
            <!-- SVG Line & Area Chart -->
            <div class="h-64 relative mt-4">
              <svg class="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                <!-- Gradients -->
                <defs>
                  <linearGradient id="invGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.30"/>
                    <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.00"/>
                  </linearGradient>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#10b981" stop-opacity="0.30"/>
                    <stop offset="100%" stop-color="#10b981" stop-opacity="0.00"/>
                  </linearGradient>
                </defs>
                
                <!-- Grid Lines -->
                <line x1="0" y1="30" x2="600" y2="30" stroke="#f8fafc" stroke-width="1" />
                <line x1="0" y1="80" x2="600" y2="80" stroke="#f8fafc" stroke-width="1" />
                <line x1="0" y1="130" x2="600" y2="130" stroke="#f8fafc" stroke-width="1" />
                <line x1="0" y1="180" x2="600" y2="180" stroke="#f1f5f9" stroke-width="1.5" />
                
                <!-- Area Path -->
                <path
                  :d="svgChartData.areaPath"
                  :fill="activeChartTab === 'invitations' ? 'url(#invGradient)' : 'url(#revGradient)'"
                />
                
                <!-- Line Path -->
                <path
                  :d="svgChartData.linePath"
                  fill="none"
                  :stroke="activeChartTab === 'invitations' ? '#3b82f6' : '#10b981'"
                  stroke-width="3"
                  stroke-linecap="round"
                />
                
                <!-- Chart Dots -->
                <circle 
                  v-for="pt in svgChartData.coords" 
                  :key="pt.label + pt.date"
                  :cx="pt.x" 
                  :cy="pt.y" 
                  r="4" 
                  :fill="activeChartTab === 'invitations' ? '#3b82f6' : '#10b981'" 
                  stroke="#ffffff" 
                  stroke-width="2" 
                >
                  <title>{{ pt.label }}: {{ activeChartTab === 'invitations' ? `${pt.count} Undangan` : formatRupiah(pt.revenue) }}</title>
                </circle>
              </svg>
              
              <!-- Floating Data Labels -->
              <div 
                v-for="(pt, idx) in svgChartData.visibleLabels" 
                :key="'lbl-' + idx"
                class="absolute bottom-1 text-[9px] font-bold uppercase -translate-x-1/2 whitespace-nowrap"
                :style="{ left: `${(pt.x / 600) * 100}%` }"
                :class="pt.label === 'Hari Ini' ? 'text-blue-600 font-extrabold' : 'text-slate-400'"
              >
                {{ pt.label }}
              </div>
            </div>
          </div>
          
          <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              <span>Rata-rata Harian: </span>
              <strong class="text-slate-800">
                {{ activeChartTab === 'invitations' ? `${trendDailyAverage} Undangan/hari` : `${formatRupiah(trendDailyAverageRevenue)}/hari` }}
              </strong>
            </div>
            <div class="text-[11px] text-slate-400">
              Total Periode Ini: <strong class="text-slate-700">{{ activeChartTab === 'invitations' ? `${trendPeriodTotal} Undangan` : formatRupiah(trendPeriodTotalRevenue) }}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Detailed Listings (Recent Invitations & Categories distribution) -->
    <section class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Recent Invitations List -->
      <div class="lg:col-span-2 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden flex flex-col justify-between">
        <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 class="text-base font-bold text-slate-800 flex items-center gap-2">
            <i class="fa-solid fa-clock-rotate-left text-slate-400"></i>
            Undangan Terbaru
          </h2>
          <RouterLink to="/admin/invitations" class="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider">
            Lihat semua
          </RouterLink>
        </div>
        <div class="p-6 flex-1">
          <DataTable
            :value="recentInvitations"
            class="p-datatable-sm"
            dataKey="id"
          >
            <template #empty>
              <div class="text-center py-6 text-slate-400 text-xs">Tidak ada data undangan terbaru.</div>
            </template>
            
            <Column field="title" header="Judul Undangan" style="min-width: 14rem">
              <template #body="{ data }">
                <div class="flex flex-col">
                  <span class="font-bold text-slate-900 line-clamp-1">{{ data.title }}</span>
                  <span class="text-[10px] text-slate-400 font-mono">/preview?slug={{ data.slug }}</span>
                </div>
              </template>
            </Column>

            <Column field="status" header="Status" style="min-width: 8rem">
              <template #body="{ data }">
                <span
                  v-if="data.isPublished"
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100"
                >
                  Published
                </span>
                <span
                  v-else
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600"
                >
                  Draft
                </span>
              </template>
            </Column>

            <Column field="user" header="Pemilik" style="min-width: 12rem">
              <template #body="{ data }">
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-slate-700">{{ data.user?.name || '-' }}</span>
                  <span class="text-[10px] text-slate-400">{{ data.user?.email || '' }}</span>
                </div>
              </template>
            </Column>

            <Column header="Aksi" headerClass="text-right" bodyClass="text-right">
              <template #body="{ data }">
                <div class="flex justify-end gap-1.5">
                  <a :href="`/preview?slug=${data.slug}`" target="_blank"
                    class="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-100 text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Lihat Undangan">
                    <i class="fa-solid fa-eye text-xs"></i>
                  </a>
                  <RouterLink :to="`/admin/invitations/${data.id}/edit`"
                    class="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-100 text-amber-600 hover:bg-amber-50 transition-colors"
                    title="Edit Undangan">
                    <i class="fa-solid fa-pencil text-xs"></i>
                  </RouterLink>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>

      <!-- Categories Distribution Breakdown -->
      <div class="lg:col-span-1 rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden flex flex-col justify-between">
        <div class="border-b border-slate-100 px-6 py-4">
          <h2 class="text-base font-bold text-slate-800 flex items-center gap-2">
            <i class="fa-solid fa-chart-pie text-slate-400"></i>
            Kategori Undangan Populer
          </h2>
        </div>
        <div class="p-6 flex-1 space-y-4">
          <div v-for="cat in categoryDistribution" :key="cat.name" class="space-y-1.5">
            <div class="flex justify-between items-center text-xs">
              <span class="font-bold text-slate-700 capitalize">{{ cat.name }}</span>
              <span class="text-slate-500 font-semibold">{{ cat.count }} ({{ cat.percentage }}%)</span>
            </div>
            <!-- Progress Bar -->
            <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
              <div 
                :class="cat.color"
                class="h-full rounded-full transition-all duration-1000"
                :style="{ width: `${cat.percentage}%` }"
              ></div>
            </div>
          </div>
          
          <div v-if="categoryDistribution.length === 0" class="text-center py-10 text-slate-400 text-xs">
            Tidak ada data distribusi kategori.
          </div>
        </div>
      </div>
    </section>

  </AdminShell>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import AdminShell from '@/components/admin/AdminShell.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import {
  fetchAdminUsers,
  fetchAdminInvitations,
  fetchAdminGuests,
  fetchAdminTemplates,
  fetchAdminHealth,
  fetchAdminStats,
} from '@/api/admin.js'
import { getAdminResellers, getAdminWithdrawals } from '@/api/adminAffiliate.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const toast = useToast()

// Range Filter Options (ADM-018)
const rangeOptions = [
  { key: '7d', label: '7 Hari' },
  { key: '30d', label: '30 Hari' },
  { key: '90d', label: '90 Hari' },
  { key: 'month', label: 'Bulan Ini' },
  { key: 'all', label: 'Semua' },
]
const selectedRange = ref('7d')
const activeRangeLabel = computed(() => {
  const opt = rangeOptions.find((o) => o.key === selectedRange.value)
  return opt ? opt.label : '7 Hari Terakhir'
})

// State KPI & Trend
const isLoadingStats = ref(false)
const lastUpdatedText = ref('')
const kpiData = ref({
  revenue: { value: 0, discount: 0, net: 0, growth: 0 },
  paidOrders: { value: 0, growth: 0 },
  pendingOrders: { value: 0 },
  aov: { value: 0, growth: 0 },
  uniqueBuyers: { value: 0, growth: 0 },
  invitations: { total: 0, paid: 0, free: 0, growth: 0 },
})
const actionQueue = ref([])
const totalActionItems = computed(() =>
  actionQueue.value.reduce((acc, it) => acc + (it.count || 0), 0)
)

// Chart Display State (ADM-016)
const activeChartTab = ref('invitations') // 'invitations' | 'revenue'
const trendData = ref([])
const categoryData = ref([])

// Platform Operational Stats (Cumulative)
const operationalStats = ref([
  {
    label: 'Total Pengguna',
    value: 0,
    subtitle: 'Kelola akun pengguna',
    icon: 'fa-users',
    color: 'bg-blue-50 text-blue-600',
    link: '/admin/users',
    isError: false,
  },
  {
    label: 'Total Undangan',
    value: 0,
    subtitle: 'Semua draf & rilis',
    icon: 'fa-envelope',
    color: 'bg-indigo-50 text-indigo-600',
    link: '/admin/invitations',
    isError: false,
  },
  {
    label: 'Reseller Aktif',
    value: 0,
    subtitle: 'Mitra afiliasi terdaftar',
    icon: 'fa-handshake',
    color: 'bg-orange-50 text-orange-600',
    link: '/admin/resellers',
    isError: false,
  },
  {
    label: 'Penarikan Pending',
    value: 0,
    subtitle: 'Permintaan payout',
    icon: 'fa-clock',
    color: 'bg-rose-50 text-rose-600',
    link: '/admin/withdrawals',
    isError: false,
  },
])

const recentInvitations = ref([])

// Diagnostics simulation states
const isRunningDiagnostics = ref(false)
const diagnosticResults = ref(null)

const runDiagnostics = async () => {
  isRunningDiagnostics.value = true
  diagnosticResults.value = null
  try {
    const res = await fetchAdminHealth()
    diagnosticResults.value = res?.data || res || null
    toast.success('Diagnostik sistem selesai!')
  } catch (error) {
    console.warn('Diagnostics error:', error)
  } finally {
    isRunningDiagnostics.value = false
  }
}

// Maintenance Mode switch configuration
const isMaintenanceMode = ref(localStorage.getItem('admin_maintenance_mode') === 'true')

const toggleMaintenance = async () => {
  const targetState = !isMaintenanceMode.value
  const result = await Swal.fire({
    title: targetState ? 'Aktifkan Mode Perbaikan?' : 'Matikan Mode Perbaikan?',
    text: targetState 
      ? 'Aplikasi akan menampilkan halaman pemeliharaan untuk pengguna biasa.' 
      : 'Pengguna biasa akan dapat mengakses kembali aplikasi secara normal.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#cbd5e1',
    confirmButtonText: targetState ? 'Ya, Aktifkan' : 'Ya, Nonaktifkan',
    cancelButtonText: 'Batal'
  })
  
  if (result.isConfirmed) {
    isMaintenanceMode.value = targetState
    localStorage.setItem('admin_maintenance_mode', targetState)
    toast.success(targetState ? 'Mode perbaikan diaktifkan' : 'Mode perbaikan dinonaktifkan')
  }
}

// Category Distribution Calculator based on DB Data
const categoryColors = {
  modern: 'bg-blue-500',
  classic: 'bg-purple-500',
  rustic: 'bg-amber-500',
  floral: 'bg-pink-500',
  elegant: 'bg-slate-700',
}

const categoryDistribution = computed(() => {
  const items = Array.isArray(categoryData.value) && categoryData.value.length 
    ? categoryData.value 
    : []
  
  const total = items.reduce((sum, item) => sum + (item.count || 0), 0) || 1
  return items.map(item => {
    const key = (item.category || 'Lainnya').toLowerCase()
    return {
      name: item.category || 'Lainnya',
      count: item.count || 0,
      percentage: Math.round(((item.count || 0) / total) * 100),
      color: categoryColors[key] || 'bg-slate-400'
    }
  }).sort((a, b) => b.count - a.count)
})

// Dynamic SVG Chart Coordinates Calculator (ADM-016)
const svgChartData = computed(() => {
  const points = trendData.value.length ? trendData.value : [
    { dayLabel: 'H-6', count: 0, revenue: 0 },
    { dayLabel: 'H-5', count: 0, revenue: 0 },
    { dayLabel: 'H-4', count: 0, revenue: 0 },
    { dayLabel: 'H-3', count: 0, revenue: 0 },
    { dayLabel: 'H-2', count: 0, revenue: 0 },
    { dayLabel: 'Kemarin', count: 0, revenue: 0 },
    { dayLabel: 'Hari Ini', count: 0, revenue: 0 },
  ]
  
  const isRev = activeChartTab.value === 'revenue'
  const maxVal = Math.max(
    ...points.map(p => (isRev ? p.revenue || 0 : p.count || 0)),
    1
  )
  
  const width = 600
  const height = 150
  const yOffset = 180
  const step = width / (points.length - 1 || 1)
  
  const coords = points.map((p, idx) => {
    const val = isRev ? (p.revenue || 0) : (p.count || 0)
    const x = Math.round(idx * step)
    const y = Math.round(yOffset - (val / maxVal) * height)
    return {
      x,
      y,
      count: p.count || 0,
      revenue: p.revenue || 0,
      label: p.dayLabel,
      date: p.date,
    }
  })
  
  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ')
  const areaPath = `${linePath} L ${width} 180 L 0 180 Z`
  
  // Pick visible labels to prevent overcrowding on 30d/90d
  const stride = Math.ceil(coords.length / 7)
  const visibleLabels = coords.filter((_, idx) => idx % stride === 0 || idx === coords.length - 1)
  
  return {
    coords,
    visibleLabels,
    linePath,
    areaPath,
  }
})

// Chart Totals & Averages
const trendDailyAverage = computed(() => {
  if (!trendData.value.length) return 0
  const sum = trendData.value.reduce((acc, curr) => acc + (curr.count || 0), 0)
  return Math.round(sum / trendData.value.length)
})

const trendDailyAverageRevenue = computed(() => {
  if (!trendData.value.length) return 0
  const sum = trendData.value.reduce((acc, curr) => acc + (curr.revenue || 0), 0)
  return Math.round(sum / trendData.value.length)
})

const trendPeriodTotal = computed(() => {
  return trendData.value.reduce((acc, curr) => acc + (curr.count || 0), 0)
})

const trendPeriodTotalRevenue = computed(() => {
  return trendData.value.reduce((acc, curr) => acc + (curr.revenue || 0), 0)
})

// Currency Formatter
function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

// Fetch stats with range
async function fetchStatsForRange(range) {
  isLoadingStats.value = true
  try {
    const statsRes = await fetchAdminStats({ range })
    const data = statsRes?.data || statsRes || {}
    
    if (data.kpi) {
      kpiData.value = data.kpi
    }
    if (data.actionRequired?.items) {
      actionQueue.value = data.actionRequired.items
    } else {
      actionQueue.value = []
    }
    if (Array.isArray(data.trend)) {
      trendData.value = data.trend
    }
    if (Array.isArray(data.categories)) {
      categoryData.value = data.categories
    }
    if (data.lastUpdated) {
      const d = new Date(data.lastUpdated)
      lastUpdatedText.value = d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB'
    }
  } catch (e) {
    console.warn('Failed to fetch admin stats:', e)
    toast.error('Gagal memperbarui metrik statistik')
  } finally {
    isLoadingStats.value = false
  }
}

async function changeRange(rangeKey) {
  selectedRange.value = rangeKey
  await fetchStatsForRange(rangeKey)
}

async function refreshAll() {
  await Promise.all([
    fetchStatsForRange(selectedRange.value),
    loadOperationalData(),
  ])
  toast.success('Data dashboard berhasil diperbarui')
}

async function loadOperationalData() {
  try {
    const [users, invitations] = await Promise.all([
      fetchAdminUsers({ page: 1, limit: 1 }).catch((err) => {
        console.warn('Failed to fetch users count:', err)
        return { total: 0, isError: true }
      }),
      fetchAdminInvitations({ page: 1, limit: 5 }).catch((err) => {
        console.warn('Failed to fetch invitations count:', err)
        return { total: 0, data: [], isError: true }
      }),
    ])

    let resellersCount = 0
    let resellersError = false
    try {
      const resellersRes = await getAdminResellers({ page: 1, limit: 1 })
      resellersCount = resellersRes?.total ?? 0
    } catch (e) {
      console.warn('Failed to fetch resellers count:', e)
      resellersError = true
    }

    let withdrawalsCount = 0
    let withdrawalsError = false
    try {
      const withdrawalsRes = await getAdminWithdrawals({ page: 1, limit: 1, status: 'pending' })
      withdrawalsCount = withdrawalsRes?.total ?? 0
    } catch (e) {
      console.warn('Failed to fetch withdrawals count:', e)
      withdrawalsError = true
    }

    operationalStats.value[0].value = users.total || 0
    operationalStats.value[0].isError = Boolean(users.isError)

    operationalStats.value[1].value = invitations.total || 0
    operationalStats.value[1].isError = Boolean(invitations.isError)

    operationalStats.value[2].value = resellersCount
    operationalStats.value[2].isError = resellersError

    operationalStats.value[3].value = withdrawalsCount
    operationalStats.value[3].isError = withdrawalsError

    recentInvitations.value = invitations.data || []
  } catch (error) {
    console.warn('Error loading operational data:', error)
  }
}

onMounted(() => {
  fetchStatsForRange(selectedRange.value)
  loadOperationalData()
  runDiagnostics()
})
</script>
