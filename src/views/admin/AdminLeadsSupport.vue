<template>
  <AdminShell
    title="Prospek & Bantuan"
    description="Manajemen inbox prospek (leads), antrean tiket bantuan CS, drilldown & moderasi tamu, serta ledger kredit AI"
  >
    <template #actions>
      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="refreshCurrentTab"
          :disabled="loading"
          class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors disabled:opacity-50"
          title="Segarkan Data"
          data-testid="refresh-btn"
        >
          <i :class="loading ? 'pi pi-spin pi-spinner' : 'pi pi-refresh'" class="text-blue-600"></i>
          <span>Segarkan</span>
        </button>
      </div>
    </template>

    <!-- Main Tab Navigation -->
    <div
      role="tablist"
      aria-label="Modul Prospek dan Bantuan"
      class="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3"
    >
      <button
        v-for="t in tabs"
        :key="t.key"
        :id="`tab-${t.key}`"
        type="button"
        role="tab"
        :aria-selected="currentTab === t.key"
        :aria-controls="`panel-${t.key}`"
        @click="currentTab = t.key"
        class="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-blue-600"
        :class="
          currentTab === t.key
            ? 'bg-slate-900 text-white shadow-sm'
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
        "
        :data-testid="`tab-btn-${t.key}`"
      >
        <i :class="['pi', t.icon]"></i>
        <span>{{ t.label }}</span>
        <span
          v-if="t.badge !== undefined && t.badge !== null"
          class="rounded-full px-2 py-0.5 text-[10px]"
          :class="currentTab === t.key ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'"
        >
          {{ t.badge }}
        </span>
      </button>
    </div>

    <!-- ========================================================================= -->
    <!-- TAB 1: INBOX PROSPEK (LEADS) -->
    <!-- ========================================================================= -->
    <section
      v-show="currentTab === 'leads'"
      id="panel-leads"
      role="tabpanel"
      aria-labelledby="tab-leads"
      data-testid="panel-leads"
    >
      <!-- Summary Chips -->
      <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" data-testid="leads-metrics-row">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-500">Total Prospek</span>
          <div class="mt-2 text-2xl font-bold text-slate-900" data-testid="metric-total-leads">{{ leadMetrics.total }}</div>
          <div class="mt-1 text-[11px] text-slate-500">Semua lead terdaftar</div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span class="text-xs font-medium uppercase tracking-wider text-blue-600">Lead Baru</span>
          <div class="mt-2 text-2xl font-bold text-blue-700" data-testid="metric-new-leads">{{ leadMetrics.new }}</div>
          <div class="mt-1 text-[11px] text-slate-500">Menunggu tindak lanjut</div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span class="text-xs font-medium uppercase tracking-wider text-purple-600">Terkualifikasi</span>
          <div class="mt-2 text-2xl font-bold text-purple-700" data-testid="metric-qualified-leads">{{ leadMetrics.qualified }}</div>
          <div class="mt-1 text-[11px] text-slate-500">Anggaran & tanggal valid</div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span class="text-xs font-medium uppercase tracking-wider text-emerald-600">Closing (Won)</span>
          <div class="mt-2 text-2xl font-bold text-emerald-700" data-testid="metric-won-leads">{{ leadMetrics.won }}</div>
          <div class="mt-1 text-[11px] text-slate-500">Konversi berhasil</div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs col-span-2 sm:col-span-1">
          <span class="text-xs font-medium uppercase tracking-wider text-amber-600">Conversion Rate</span>
          <div class="mt-2 text-2xl font-bold text-amber-700" data-testid="metric-conversion-rate">{{ leadMetrics.conversionRate }}%</div>
          <div class="mt-1 text-[11px] text-slate-500">Rasio Won / Total</div>
        </div>
      </div>

      <!-- Filters & Privacy Masking Bar -->
      <div class="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Source Filter -->
          <div class="flex items-center gap-1.5">
            <label for="lead-source-filter" class="text-xs font-medium text-slate-500">Sumber:</label>
            <select
              id="lead-source-filter"
              v-model="leadFilterSource"
              class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-slate-400 focus:outline-none"
            >
              <option value="all">Semua Sumber</option>
              <option value="budget_calculator">Kalkulator Anggaran</option>
              <option value="love_calculator">Kalkulator Cinta</option>
              <option value="custom_theme">Custom Theme Request</option>
              <option value="organic">Organik / Langsung</option>
            </select>
          </div>

          <!-- Stage Filter -->
          <div class="flex items-center gap-1.5">
            <label for="lead-stage-filter" class="text-xs font-medium text-slate-500">Tahap:</label>
            <select
              id="lead-stage-filter"
              v-model="leadFilterStage"
              class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-slate-400 focus:outline-none"
            >
              <option value="all">Semua Tahap</option>
              <option value="new">Baru</option>
              <option value="contacted">Dihubungi</option>
              <option value="qualified">Terkualifikasi</option>
              <option value="won">Closing (Won)</option>
              <option value="lost">Batal (Lost)</option>
            </select>
          </div>

          <!-- Search Input -->
          <div class="relative">
            <input
              v-model="leadSearch"
              type="search"
              placeholder="Cari prospek atau PIC..."
              class="w-44 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-700 placeholder-slate-400 focus:border-slate-400 focus:outline-none sm:w-56"
            />
            <i class="pi pi-search absolute left-2.5 top-2.5 text-xs text-slate-400"></i>
          </div>
        </div>

        <!-- Privacy Masking Toggle -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="maskPrivacy = !maskPrivacy"
            class="flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
            :class="
              maskPrivacy
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                : 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
            "
            data-testid="privacy-toggle"
            :title="maskPrivacy ? 'Klik untuk membuka sensor privasi' : 'Klik untuk menyamarkan kontak'"
          >
            <i :class="maskPrivacy ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            <span>{{ maskPrivacy ? 'Masking Privasi: Aktif' : 'Masking Privasi: Nonaktif' }}</span>
          </button>
        </div>
      </div>

      <!-- Leads Table -->
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-xs" data-testid="leads-table">
            <thead class="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th scope="col" class="px-4 py-3">Nama Prospek</th>
                <th scope="col" class="px-4 py-3">Kontak (HP / Email)</th>
                <th scope="col" class="px-4 py-3">Tanggal Acara</th>
                <th scope="col" class="px-4 py-3">Anggaran</th>
                <th scope="col" class="px-4 py-3">Tamu</th>
                <th scope="col" class="px-4 py-3">Sumber</th>
                <th scope="col" class="px-4 py-3">Tahap</th>
                <th scope="col" class="px-4 py-3">Owner PIC</th>
                <th scope="col" class="px-4 py-3">Due Date</th>
                <th scope="col" class="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="lead in filteredLeads"
                :key="lead.id"
                class="hover:bg-slate-50/70 transition-colors"
                :data-testid="`lead-row-${lead.id}`"
              >
                <td class="px-4 py-3">
                  <div class="font-bold text-slate-800">{{ lead.name }}</div>
                  <div class="text-[10px] text-slate-500">ID: #LD-{{ lead.id }}</div>
                </td>
                <td class="px-4 py-3">
                  <div class="font-mono text-slate-700" data-testid="lead-phone">
                    {{ maskPrivacy ? maskPhoneNumber(lead.phone) : lead.phone }}
                  </div>
                  <div class="text-[11px] text-slate-500" data-testid="lead-email">
                    {{ maskPrivacy ? maskEmailAddress(lead.email) : lead.email }}
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="font-medium text-slate-700">{{ formatDisplayDate(lead.weddingDate) }}</span>
                </td>
                <td class="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                  {{ formatCurrency(lead.budget) }}
                </td>
                <td class="px-4 py-3 text-slate-700">
                  {{ lead.guestCount ? `${lead.guestCount} pax` : '—' }}
                </td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                    :class="getSourceBadgeClass(lead.source)"
                  >
                    {{ formatSourceLabel(lead.source) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold"
                    :class="getStageBadgeClass(lead.stage)"
                  >
                    {{ formatStageLabel(lead.stage) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span v-if="lead.ownerPic" class="font-medium text-slate-700">{{ lead.ownerPic }}</span>
                  <span v-else class="text-slate-400 italic">Belum ada</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-slate-600">
                  {{ lead.dueDate ? formatDisplayDate(lead.dueDate) : '—' }}
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      @click="openLeadDetail(lead)"
                      class="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      title="Lihat Detail & Catatan"
                      :data-testid="`btn-detail-lead-${lead.id}`"
                    >
                      <i class="pi pi-file-edit mr-1"></i>
                      <span>Follow-up</span>
                    </button>
                    <button
                      type="button"
                      @click="handleDeleteLead(lead.id)"
                      class="rounded-lg border border-rose-200 bg-white p-1 text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus Lead"
                    >
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredLeads.length === 0">
                <td colspan="10" class="py-8 text-center text-slate-400">
                  Tidak ada prospek ditemukan untuk filter saat ini.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- TAB 2: ANTREAN BANTUAN (SUPPORT TICKETS) -->
    <!-- ========================================================================= -->
    <section
      v-show="currentTab === 'tickets'"
      id="panel-tickets"
      role="tabpanel"
      aria-labelledby="tab-tickets"
      data-testid="panel-tickets"
    >
      <!-- CS SLA Notice Banner -->
      <div
        class="mb-6 flex flex-col gap-3 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
        data-testid="sla-notice-banner"
      >
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs">
            <i class="pi pi-headphones text-lg"></i>
          </div>
          <div>
            <div class="font-bold text-blue-950" data-testid="sla-notice-text">
              Jam Operasional CS: 08:00 - 21:00 WIB • SLA Respon Pertama &lt; 15 Menit
            </div>
            <div class="text-xs text-blue-800">
              Dukungan penuh tim Helpdesk untuk kendala pembayaran, revisi undangan mendesak, dan koordinasi tamu.
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2 text-xs font-semibold text-blue-900">
          <span class="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>CS Sedang Bertugas (Live)</span>
        </div>
      </div>

      <!-- Urgent Tickets Warning Banner if Any -->
      <div
        v-if="urgentTicketCount > 0"
        class="mb-6 flex items-center justify-between rounded-2xl border border-rose-300 bg-rose-50 p-4 text-rose-900 shadow-2xs"
        data-testid="urgent-tickets-banner"
      >
        <div class="flex items-center gap-3">
          <i class="pi pi-exclamation-triangle text-xl text-rose-600"></i>
          <div>
            <div class="font-bold">
              Perhatian: Ada {{ urgentTicketCount }} Tiket Mendekati Hari H (&lt; 7 Hari ke Acara)
            </div>
            <div class="text-xs text-rose-800">
              Prioritaskan penanganan tiket ini agar acara pernikahan mempelai berlangsung lancar.
            </div>
          </div>
        </div>
        <button
          type="button"
          @click="ticketFilterPriority = 'urgent'"
          class="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-rose-700"
        >
          Lihat Tiket Mendesak
        </button>
      </div>

      <!-- Support Metrics Row -->
      <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4" data-testid="ticket-metrics-row">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-500">Rata-rata Respon Pertama</span>
          <div class="mt-2 text-2xl font-bold text-slate-900" data-testid="metric-first-response">
            {{ ticketMetrics.avgFirstResponseMinutes }} Menit
          </div>
          <div class="mt-1 text-[11px] text-slate-500">Target SLA &lt; 15 menit</div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-500">Rata-rata Penyelesaian</span>
          <div class="mt-2 text-2xl font-bold text-slate-900" data-testid="metric-resolution-time">
            {{ ticketMetrics.avgResolutionHours }} Jam
          </div>
          <div class="mt-1 text-[11px] text-slate-500">Waktu tiket ditutup</div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span class="text-xs font-medium uppercase tracking-wider text-amber-600">Backlog Antrean</span>
          <div class="mt-2 text-2xl font-bold text-amber-700" data-testid="metric-backlog-count">
            {{ ticketMetrics.backlogCount }} Tiket
          </div>
          <div class="mt-1 text-[11px] text-slate-500">Status Terbuka & Diproses</div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span class="text-xs font-medium uppercase tracking-wider text-rose-600">Tiket Mendesak (&lt; 7 Hari)</span>
          <div class="mt-2 text-2xl font-bold text-rose-700" data-testid="metric-urgent-count">
            {{ ticketMetrics.urgentCount }} Tiket
          </div>
          <div class="mt-1 text-[11px] text-slate-500">Hari H &lt; 7 hari lagi</div>
        </div>
      </div>

      <!-- Ticket Filters -->
      <div class="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Status Filter -->
          <div class="flex items-center gap-1.5">
            <label for="ticket-status-filter" class="text-xs font-medium text-slate-500">Status:</label>
            <select
              id="ticket-status-filter"
              v-model="ticketFilterStatus"
              class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="open">Terbuka (Open)</option>
              <option value="in_progress">Diproses (In Progress)</option>
              <option value="resolved">Selesai (Resolved)</option>
              <option value="closed">Ditutup (Closed)</option>
            </select>
          </div>

          <!-- Priority Filter -->
          <div class="flex items-center gap-1.5">
            <label for="ticket-priority-filter" class="text-xs font-medium text-slate-500">Prioritas:</label>
            <select
              id="ticket-priority-filter"
              v-model="ticketFilterPriority"
              class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">Semua Prioritas</option>
              <option value="urgent">Mendesak (Urgent)</option>
              <option value="high">Tinggi (High)</option>
              <option value="medium">Sedang (Medium)</option>
              <option value="low">Rendah (Low)</option>
            </select>
          </div>

          <!-- Category Filter -->
          <div class="flex items-center gap-1.5">
            <label for="ticket-category-filter" class="text-xs font-medium text-slate-500">Kategori:</label>
            <select
              id="ticket-category-filter"
              v-model="ticketFilterCategory"
              class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">Semua Kategori</option>
              <option value="order">Pesanan & Undangan</option>
              <option value="invitation">Editor & Fitur</option>
              <option value="payment">Pembayaran & Billing</option>
              <option value="technical">Teknis & Bug</option>
            </select>
          </div>

          <!-- Search -->
          <div class="relative">
            <input
              v-model="ticketSearch"
              type="search"
              placeholder="Cari no tiket / subjek / pemesan..."
              class="w-48 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-700 placeholder-slate-400 focus:outline-none sm:w-60"
            />
            <i class="pi pi-search absolute left-2.5 top-2.5 text-xs text-slate-400"></i>
          </div>
        </div>
      </div>

      <!-- Tickets Table -->
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-xs" data-testid="tickets-table">
            <thead class="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th scope="col" class="px-4 py-3">No. Tiket</th>
                <th scope="col" class="px-4 py-3">Subjek & Kategori</th>
                <th scope="col" class="px-4 py-3">Prioritas</th>
                <th scope="col" class="px-4 py-3">Status</th>
                <th scope="col" class="px-4 py-3">Pelanggan</th>
                <th scope="col" class="px-4 py-3">Tanggal Acara</th>
                <th scope="col" class="px-4 py-3">PIC CS</th>
                <th scope="col" class="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="ticket in filteredTickets"
                :key="ticket.id"
                class="hover:bg-slate-50/70 transition-colors"
                :class="isUrgentWedding(ticket.weddingDate) ? 'bg-rose-50/20' : ''"
                :data-testid="`ticket-row-${ticket.id}`"
              >
                <td class="px-4 py-3 font-mono font-bold text-slate-800">
                  {{ ticket.ticketNumber || `#TKT-${ticket.id}` }}
                </td>
                <td class="px-4 py-3">
                  <div class="font-bold text-slate-900">{{ ticket.subject }}</div>
                  <div class="text-[10px] uppercase font-semibold text-slate-500">{{ ticket.category }}</div>
                </td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase"
                    :class="getTicketPriorityBadgeClass(ticket.priority)"
                  >
                    {{ ticket.priority }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold"
                    :class="getTicketStatusBadgeClass(ticket.status)"
                  >
                    {{ formatTicketStatusLabel(ticket.status) }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="font-semibold text-slate-800">{{ ticket.customerName }}</div>
                  <div class="text-[11px] text-slate-500">
                    {{ maskPrivacy ? maskEmailAddress(ticket.customerEmail) : ticket.customerEmail }}
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center gap-1.5">
                    <span class="font-medium text-slate-700">{{ formatDisplayDate(ticket.weddingDate) }}</span>
                    <span
                      v-if="isUrgentWedding(ticket.weddingDate)"
                      class="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-700 animate-pulse"
                      data-testid="urgent-badge"
                    >
                      &lt; 7 Hari
                    </span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span v-if="ticket.assignedPic" class="font-medium text-slate-700">{{ ticket.assignedPic }}</span>
                  <span v-else class="text-slate-400 italic">Belum ada</span>
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    type="button"
                    @click="openTicketDetail(ticket)"
                    class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    :data-testid="`btn-open-ticket-${ticket.id}`"
                  >
                    <i class="pi pi-comments mr-1 text-blue-600"></i>
                    <span>Tanggapi</span>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredTickets.length === 0">
                <td colspan="8" class="py-8 text-center text-slate-400">
                  Tidak ada tiket bantuan yang sesuai dengan filter.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- TAB 3: DRILLDOWN TAMU & MODERASI -->
    <!-- ========================================================================= -->
    <section
      v-show="currentTab === 'guest_moderation'"
      id="panel-guest-moderation"
      role="tabpanel"
      aria-labelledby="tab-guest-moderation"
      data-testid="panel-guest_moderation"
    >
      <!-- Invitation Selector Header -->
      <div class="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <i class="pi pi-users text-lg"></i>
          </div>
          <div>
            <div class="font-bold text-slate-900">Drilldown Tamu & Moderasi Buku Ucapan</div>
            <div class="text-xs text-slate-500">Pilih undangan untuk melihat metrik sebaran tamu dan kelola moderasi ucapan publik</div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <label for="invitation-drilldown-select" class="text-xs font-semibold text-slate-600">Undangan:</label>
          <select
            id="invitation-drilldown-select"
            v-model="selectedInvitationId"
            @change="loadGuestData"
            class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            data-testid="invitation-select"
          >
            <option :value="101">Rina & Budi (rina-budi)</option>
            <option :value="102">Dimas & Annisa (dimas-annisa)</option>
            <option :value="103">Kevin & Jessica (kevin-jessica)</option>
          </select>
        </div>
      </div>

      <!-- Guest Drilldown KPI Cards -->
      <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" data-testid="guest-drilldown-cards">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-500">Total Tamu</span>
          <div class="mt-2 text-2xl font-bold text-slate-900" data-testid="metric-total-guests">{{ guestStats.totalGuests }}</div>
          <div class="mt-1 text-[11px] text-slate-500">Daftar buku tamu</div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span class="text-xs font-medium uppercase tracking-wider text-blue-600">Undangan Terkirim</span>
          <div class="mt-2 text-2xl font-bold text-blue-700" data-testid="metric-sent-invitations">{{ guestStats.sentInvitations }}</div>
          <div class="mt-1 text-[11px] text-slate-500">Tautan disebarkan</div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span class="text-xs font-medium uppercase tracking-wider text-emerald-600">Undangan Dibuka</span>
          <div class="mt-2 text-2xl font-bold text-emerald-700" data-testid="metric-opened-invitations">{{ guestStats.openedInvitations }}</div>
          <div class="mt-1 text-[11px] text-slate-500">Tamu telah membuka web</div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span class="text-xs font-medium uppercase tracking-wider text-purple-600">RSVP Hadir</span>
          <div class="mt-2 text-2xl font-bold text-purple-700" data-testid="metric-rsvp-attending">{{ guestStats.attendingRsvp }}</div>
          <div class="mt-1 text-[11px] text-slate-500">Konfirmasi datang</div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span class="text-xs font-medium uppercase tracking-wider text-amber-600">Total Pax Hadir</span>
          <div class="mt-2 text-2xl font-bold text-amber-700" data-testid="metric-total-pax">{{ guestStats.totalPax }}</div>
          <div class="mt-1 text-[11px] text-slate-500">Estimasi porsi katering</div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span class="text-xs font-medium uppercase tracking-wider text-rose-600">Ucapan Buku Tamu</span>
          <div class="mt-2 text-2xl font-bold text-rose-700" data-testid="metric-total-wishes">{{ guestStats.guestbookCount }}</div>
          <div class="mt-1 text-[11px] text-slate-500">Pesan doa masuk</div>
        </div>
      </div>

      <!-- Progress Bars for Opened and Attendance Rates -->
      <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2" data-testid="guest-rates-row">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div class="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Tingkat Undangan Dibuka (Opened Rate)</span>
            <span class="text-emerald-700 font-bold" data-testid="rate-opened">{{ openedRate }}%</span>
          </div>
          <div class="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              class="h-full rounded-full bg-emerald-500 transition-all duration-500"
              :style="{ width: `${Math.min(openedRate, 100)}%` }"
            ></div>
          </div>
          <div class="mt-1.5 text-[11px] text-slate-500">
            {{ guestStats.openedInvitations }} dari {{ guestStats.sentInvitations }} undangan terkirim telah dibuka
          </div>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div class="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Tingkat Kehadiran Tamu (Attendance Rate)</span>
            <span class="text-purple-700 font-bold" data-testid="rate-attendance">{{ attendanceRate }}%</span>
          </div>
          <div class="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              class="h-full rounded-full bg-purple-600 transition-all duration-500"
              :style="{ width: `${Math.min(attendanceRate, 100)}%` }"
            ></div>
          </div>
          <div class="mt-1.5 text-[11px] text-slate-500">
            {{ guestStats.attendingRsvp }} tamu konfirmasi hadir dari {{ guestStats.totalGuests }} total tamu tercatat
          </div>
        </div>
      </div>

      <!-- Guest Messages Moderation Table -->
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          <div class="flex items-center gap-2">
            <span class="font-bold text-slate-800 text-sm">Moderasi Ucapan Buku Tamu</span>
            <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{{ guestMessages.length }} Pesan</span>
          </div>
          <div class="flex items-center gap-2">
            <label for="msg-status-filter" class="text-xs text-slate-500">Filter Moderasi:</label>
            <select
              id="msg-status-filter"
              v-model="guestMsgFilterStatus"
              class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="published">Dipublikasikan (Published)</option>
              <option value="hidden">Disembunyikan (Hidden)</option>
              <option value="flagged_spam">Ditandai Spam</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-xs" data-testid="guest-messages-table">
            <thead class="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th scope="col" class="px-4 py-3">Pengirim</th>
                <th scope="col" class="px-4 py-3">Pesan & Doa</th>
                <th scope="col" class="px-4 py-3">RSVP</th>
                <th scope="col" class="px-4 py-3">Status Moderasi</th>
                <th scope="col" class="px-4 py-3 text-right">Aksi Moderasi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="msg in filteredGuestMessages"
                :key="msg.id"
                class="hover:bg-slate-50/70 transition-colors"
                :data-testid="`guest-msg-row-${msg.id}`"
              >
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="font-bold text-slate-800">{{ msg.senderName || msg.name }}</div>
                  <div class="text-[10px] text-slate-500">{{ msg.relation || 'Tamu Undangan' }}</div>
                </td>
                <td class="px-4 py-3">
                  <div class="text-slate-800 italic max-w-md break-words">"{{ msg.message }}"</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    class="inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-bold"
                    :class="getRsvpBadgeClass(msg.rsvpStatus)"
                  >
                    {{ formatRsvpLabel(msg.rsvpStatus) }} {{ msg.pax ? `(${msg.pax} pax)` : '' }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    class="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold"
                    :class="getModerationBadgeClass(msg.status)"
                    :data-testid="`moderation-status-${msg.id}`"
                  >
                    {{ formatModerationStatusLabel(msg.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      @click="handleModerateMessage(msg.id, 'published')"
                      class="rounded-lg border border-emerald-200 bg-white p-1.5 text-emerald-600 hover:bg-emerald-50 transition-colors"
                      title="Publikasikan Ucapan"
                      :data-testid="`btn-publish-${msg.id}`"
                    >
                      <i class="pi pi-check"></i>
                    </button>
                    <button
                      type="button"
                      @click="handleModerateMessage(msg.id, 'hidden')"
                      class="rounded-lg border border-amber-200 bg-white p-1.5 text-amber-600 hover:bg-amber-50 transition-colors"
                      title="Sembunyikan Ucapan"
                      :data-testid="`btn-hide-${msg.id}`"
                    >
                      <i class="pi pi-eye-slash"></i>
                    </button>
                    <button
                      type="button"
                      @click="handleModerateMessage(msg.id, 'flagged_spam')"
                      class="rounded-lg border border-rose-200 bg-white p-1.5 text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Tandai Sebagai Spam"
                      :data-testid="`btn-spam-${msg.id}`"
                    >
                      <i class="pi pi-flag"></i>
                    </button>
                    <button
                      type="button"
                      @click="handleDeleteGuestMessage(msg.id)"
                      class="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-100 transition-colors"
                      title="Hapus Pesan"
                    >
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredGuestMessages.length === 0">
                <td colspan="5" class="py-8 text-center text-slate-400">
                  Tidak ada pesan ucapan yang sesuai dengan filter moderasi.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- TAB 4: LEDGER KREDIT AI (NOVA) -->
    <!-- ========================================================================= -->
    <section
      v-show="currentTab === 'ai_credits'"
      id="panel-ai-credits"
      role="tabpanel"
      aria-labelledby="tab-ai-credits"
      data-testid="panel-ai_credits"
    >
      <!-- KPI Summary Cards -->
      <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" data-testid="ai-kpi-cards">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span class="text-xs font-medium uppercase tracking-wider text-slate-500">Total Kredit Dibeli</span>
          <div class="mt-2 text-2xl font-bold text-slate-900" data-testid="metric-ai-purchased">{{ aiStats.totalPurchased }}</div>
          <div class="mt-1 text-[11px] text-slate-500">Top-up oleh pengguna</div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span class="text-xs font-medium uppercase tracking-wider text-blue-600">Total Kredit Terpakai</span>
          <div class="mt-2 text-2xl font-bold text-blue-700" data-testid="metric-ai-used">{{ aiStats.totalUsed }}</div>
          <div class="mt-1 text-[11px] text-slate-500">Konsumsi generasi AI</div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span class="text-xs font-medium uppercase tracking-wider text-emerald-600">Sisa Saldo Kredit Sistem</span>
          <div class="mt-2 text-2xl font-bold text-emerald-700" data-testid="metric-ai-balance">{{ aiStats.balance }}</div>
          <div class="mt-1 text-[11px] text-slate-500">Saldo aktif pengguna</div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span class="text-xs font-medium uppercase tracking-wider text-purple-600">Total Request AI</span>
          <div class="mt-2 text-2xl font-bold text-purple-700" data-testid="metric-ai-requests">{{ aiStats.totalRequests }}</div>
          <div class="mt-1 text-[11px] text-slate-500">{{ aiStats.failedRequests || 0 }} gagal</div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs col-span-2 sm:col-span-1">
          <span class="text-xs font-medium uppercase tracking-wider text-amber-600">Biaya DeepSeek (IDR)</span>
          <div class="mt-2 text-2xl font-bold text-amber-700" data-testid="metric-ai-cost">
            {{ formatCurrency(aiStats.estimatedCostIdr) }}
          </div>
          <div class="mt-1 text-[11px] text-slate-500">Estimasi tagihan API</div>
        </div>
      </div>

      <!-- Ledger Filter Bar -->
      <div class="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-wrap items-center gap-2.5">
          <div class="flex items-center gap-1.5">
            <label for="ai-status-filter" class="text-xs font-medium text-slate-500">Status:</label>
            <select
              id="ai-status-filter"
              v-model="aiFilterStatus"
              class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="success">Sukses</option>
              <option value="failed">Gagal</option>
            </select>
          </div>

          <div class="flex items-center gap-1.5">
            <label for="ai-action-filter" class="text-xs font-medium text-slate-500">Aksi:</label>
            <select
              id="ai-action-filter"
              v-model="aiFilterAction"
              class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">Semua Aksi</option>
              <option value="deduct">Deduct (Pengurangan)</option>
              <option value="topup">Top-up (Penambahan)</option>
              <option value="refund">Refund</option>
            </select>
          </div>

          <div class="relative">
            <input
              v-model="aiSearch"
              type="search"
              placeholder="Cari user / fitur / model..."
              class="w-48 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-700 placeholder-slate-400 focus:outline-none sm:w-60"
            />
            <i class="pi pi-search absolute left-2.5 top-2.5 text-xs text-slate-400"></i>
          </div>
        </div>
      </div>

      <!-- AI Transaction Ledger Table -->
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-xs" data-testid="ai-ledger-table">
            <thead class="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th scope="col" class="px-4 py-3">Waktu (WIB)</th>
                <th scope="col" class="px-4 py-3">Pengguna</th>
                <th scope="col" class="px-4 py-3">Aksi</th>
                <th scope="col" class="px-4 py-3">Fitur AI</th>
                <th scope="col" class="px-4 py-3">Perubahan</th>
                <th scope="col" class="px-4 py-3">Sisa Saldo</th>
                <th scope="col" class="px-4 py-3">Model</th>
                <th scope="col" class="px-4 py-3">Tokens (P / C / Tot)</th>
                <th scope="col" class="px-4 py-3">Biaya (IDR)</th>
                <th scope="col" class="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="log in filteredAiLogs"
                :key="log.id"
                class="hover:bg-slate-50/70 transition-colors"
                :data-testid="`ai-log-row-${log.id}`"
              >
                <td class="px-4 py-3 whitespace-nowrap font-mono text-slate-600">
                  {{ formatDisplayDateTime(log.createdAt) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="font-bold text-slate-800">{{ log.userName || `User #${log.userId}` }}</div>
                  <div class="text-[10px] text-slate-500">ID: {{ log.userId }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    class="inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                    :class="getAiActionBadgeClass(log.action)"
                  >
                    {{ log.action }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="font-semibold text-slate-800">{{ log.feature }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap font-bold">
                  <span :class="log.creditDelta < 0 ? 'text-rose-600' : 'text-emerald-600'">
                    {{ log.creditDelta > 0 ? `+${log.creditDelta}` : log.creditDelta }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap font-mono text-slate-700">
                  {{ log.balanceAfter }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-600">
                  {{ log.model || '—' }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap font-mono text-[10px] text-slate-500">
                  <span v-if="log.totalTokens">{{ log.promptTokens }} / {{ log.completionTokens }} / <strong>{{ log.totalTokens }}</strong></span>
                  <span v-else>—</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap font-medium text-slate-700">
                  {{ formatCurrency(log.estimatedCostIdr || 0) }}
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <span
                    class="inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-bold"
                    :class="log.status === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'"
                  >
                    {{ log.status === 'success' ? 'Sukses' : 'Gagal' }}
                  </span>
                </td>
              </tr>
              <tr v-if="filteredAiLogs.length === 0">
                <td colspan="10" class="py-8 text-center text-slate-400">
                  Tidak ada catatan log transaksi AI untuk filter ini.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- DIALOG: LEAD DETAIL & FOLLOW-UP NOTES -->
    <!-- ========================================================================= -->
    <div
      v-if="activeLeadModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      data-testid="lead-detail-modal"
    >
      <div class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs" @click="activeLeadModal = null"></div>
      <div class="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        <div class="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 id="lead-modal-title" class="text-lg font-bold text-slate-900">
              Detail Prospek: {{ activeLeadModal.name }}
            </h3>
            <p class="text-xs text-slate-500">ID Prospek #LD-{{ activeLeadModal.id }} • Sumber: {{ formatSourceLabel(activeLeadModal.source) }}</p>
          </div>
          <button
            type="button"
            @click="activeLeadModal = null"
            class="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>

        <!-- Contact & Wedding Overview -->
        <div class="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-xs sm:grid-cols-4">
          <div>
            <div class="text-[10px] text-slate-500 uppercase font-semibold">Nomor Telepon</div>
            <div class="mt-0.5 font-bold text-slate-800">{{ activeLeadModal.phone || '—' }}</div>
          </div>
          <div>
            <div class="text-[10px] text-slate-500 uppercase font-semibold">Email</div>
            <div class="mt-0.5 font-bold text-slate-800 truncate">{{ activeLeadModal.email || '—' }}</div>
          </div>
          <div>
            <div class="text-[10px] text-slate-500 uppercase font-semibold">Tanggal Acara</div>
            <div class="mt-0.5 font-bold text-slate-800">{{ formatDisplayDate(activeLeadModal.weddingDate) }}</div>
          </div>
          <div>
            <div class="text-[10px] text-slate-500 uppercase font-semibold">Estimasi Anggaran</div>
            <div class="mt-0.5 font-bold text-slate-800">{{ formatCurrency(activeLeadModal.budget) }}</div>
          </div>
        </div>

        <!-- Editable Form: Stage & Owner PIC -->
        <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label for="modal-lead-stage" class="block text-xs font-semibold text-slate-700 mb-1">Tahap Lead</label>
            <select
              id="modal-lead-stage"
              v-model="activeLeadModal.stage"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option value="new">Baru (New)</option>
              <option value="contacted">Dihubungi (Contacted)</option>
              <option value="qualified">Terkualifikasi (Qualified)</option>
              <option value="won">Closing (Won)</option>
              <option value="lost">Batal (Lost)</option>
            </select>
          </div>
          <div>
            <label for="modal-lead-pic" class="block text-xs font-semibold text-slate-700 mb-1">Owner PIC</label>
            <input
              id="modal-lead-pic"
              v-model="activeLeadModal.ownerPic"
              type="text"
              placeholder="Nama PIC penanggung jawab"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none"
            />
          </div>
        </div>

        <!-- Follow-up Notes Timeline -->
        <div class="mt-6 border-t border-slate-100 pt-4">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Timeline Catatan & Follow-up</h4>
          <div class="space-y-2 mb-4 max-h-48 overflow-y-auto">
            <div
              v-for="(n, idx) in (activeLeadModal.notes || [])"
              :key="idx"
              class="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs"
            >
              <div class="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span class="font-semibold text-slate-600">{{ n.author || 'Staf Admin' }}</span>
                <span>{{ formatDisplayDateTime(n.createdAt) }}</span>
              </div>
              <p class="text-slate-700">{{ n.text }}</p>
            </div>
            <div v-if="!activeLeadModal.notes || activeLeadModal.notes.length === 0" class="text-xs text-slate-400 italic">
              Belum ada catatan follow-up.
            </div>
          </div>

          <!-- Add Note Input -->
          <div class="flex flex-col gap-2">
            <textarea
              v-model="newLeadNoteText"
              rows="2"
              placeholder="Tulis catatan follow-up prospek..."
              class="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-none"
            ></textarea>
            <div class="flex justify-end gap-2">
              <button
                type="button"
                @click="handleSaveLeadModal"
                class="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
                data-testid="btn-save-lead-modal"
              >
                Simpan Perubahan & Catatan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- DIALOG: TICKET DETAIL & REPLY THREAD -->
    <!-- ========================================================================= -->
    <div
      v-if="activeTicketModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-modal-title"
      data-testid="ticket-detail-modal"
    >
      <div class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs" @click="activeTicketModal = null"></div>
      <div class="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        <div class="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs font-bold text-blue-600">{{ activeTicketModal.ticketNumber || `#TKT-${activeTicketModal.id}` }}</span>
              <span
                class="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase"
                :class="getTicketPriorityBadgeClass(activeTicketModal.priority)"
              >
                {{ activeTicketModal.priority }}
              </span>
            </div>
            <h3 id="ticket-modal-title" class="text-base font-bold text-slate-900 mt-1">
              {{ activeTicketModal.subject }}
            </h3>
            <p class="text-xs text-slate-500">
              Pelanggan: {{ activeTicketModal.customerName }} ({{ activeTicketModal.customerEmail }})
            </p>
          </div>
          <button
            type="button"
            @click="activeTicketModal = null"
            class="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>

        <!-- Ticket Status & PIC Assignment Control -->
        <div class="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3 sm:grid-cols-3">
          <div>
            <label for="modal-tkt-status" class="block text-[10px] uppercase font-bold text-slate-500 mb-1">Status Tiket</label>
            <select
              id="modal-tkt-status"
              v-model="activeTicketModal.status"
              class="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800"
            >
              <option value="open">Terbuka (Open)</option>
              <option value="in_progress">Diproses (In Progress)</option>
              <option value="resolved">Selesai (Resolved)</option>
              <option value="closed">Ditutup (Closed)</option>
            </select>
          </div>
          <div>
            <label for="modal-tkt-pic" class="block text-[10px] uppercase font-bold text-slate-500 mb-1">PIC CS</label>
            <input
              id="modal-tkt-pic"
              v-model="activeTicketModal.assignedPic"
              type="text"
              class="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800"
            />
          </div>
          <div class="col-span-2 sm:col-span-1">
            <div class="text-[10px] uppercase font-bold text-slate-500">Tanggal Acara</div>
            <div class="mt-1 font-semibold text-slate-800 text-xs">
              {{ formatDisplayDate(activeTicketModal.weddingDate) }}
              <span v-if="isUrgentWedding(activeTicketModal.weddingDate)" class="text-rose-600 font-bold ml-1">(&lt; 7 Hari)</span>
            </div>
          </div>
        </div>

        <!-- Conversation Messages Thread -->
        <div class="mt-4 border-t border-slate-100 pt-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Riwayat Percakapan</h4>
          <div class="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
            <div
              v-for="(msg, idx) in (activeTicketModal.messages || [])"
              :key="idx"
              class="rounded-2xl p-3 text-xs"
              :class="msg.isStaff ? 'bg-blue-50/70 border border-blue-100 ml-6' : 'bg-slate-50 border border-slate-100 mr-6'"
            >
              <div class="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span class="font-bold" :class="msg.isStaff ? 'text-blue-700' : 'text-slate-700'">
                  {{ msg.sender || (msg.isStaff ? 'CS Support' : 'Pelanggan') }}
                </span>
                <span>{{ formatDisplayDateTime(msg.createdAt) }}</span>
              </div>
              <p class="text-slate-800">{{ msg.text }}</p>
            </div>
            <div v-if="!activeTicketModal.messages || activeTicketModal.messages.length === 0" class="text-xs text-slate-400 italic">
              Belum ada riwayat pesan dalam tiket ini.
            </div>
          </div>

          <!-- Reply Box -->
          <div class="flex flex-col gap-2">
            <textarea
              v-model="newTicketReplyText"
              rows="2"
              placeholder="Tulis balasan tiket untuk pelanggan..."
              class="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-none"
            ></textarea>
            <div class="flex items-center justify-between">
              <span class="text-[11px] text-slate-400">SLA Respon CS: &lt; 15 menit</span>
              <button
                type="button"
                @click="handleSaveTicketReply"
                class="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
                data-testid="btn-send-ticket-reply"
              >
                Kirim Balasan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminShell>
</template>

<script>
export function maskPhoneNumber(phone) {
  if (!phone) return '—'
  const clean = String(phone).trim()
  if (clean.length <= 6) return clean.replace(/.(?=.{2})/g, '*')
  const prefix = clean.slice(0, 4)
  const suffix = clean.slice(-3)
  return `${prefix}****${suffix}`
}

export function maskEmailAddress(email) {
  if (!email) return '—'
  const parts = String(email).trim().split('@')
  if (parts.length !== 2) return email
  const [user, domain] = parts
  const visiblePrefix = user.slice(0, 3)
  return `${visiblePrefix}***@${domain}`
}

export function isUrgentWedding(weddingDate) {
  if (!weddingDate) return false
  const target = new Date(weddingDate).getTime()
  if (isNaN(target)) return false
  const now = Date.now()
  const diffDays = (target - now) / (1000 * 60 * 60 * 24)
  return diffDays >= 0 && diffDays <= 7
}

export function formatCurrency(amount) {
  const num = Number(amount) || 0
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatDisplayDate(dateStr) {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return String(dateStr)
  }
}

export function formatDisplayDateTime(dateStr) {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return String(dateStr)
  }
}
</script>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminShell from '@/components/admin/AdminShell.vue'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

// API Clients
import { getLeads, updateLead, deleteLead } from '@/api/lead'
import { getSupportTickets, getSupportTicketMetrics, updateSupportTicket } from '@/api/supportTicket'
import { getGuestDrilldown, getAdminGuestMessages, moderateGuestMessage, deleteAdminGuestMessage } from '@/api/guestModeration'
import { getAiCreditStats, getAiCreditLogs } from '@/api/aiCredits'

const toast = useToast()
const loading = ref(false)

// Tabs configuration
const currentTab = ref('leads')
const tabs = [
  { key: 'leads', label: 'Inbox Prospek', icon: 'pi-user-plus' },
  { key: 'tickets', label: 'Antrean Bantuan', icon: 'pi-headphones' },
  { key: 'guest_moderation', label: 'Drilldown Tamu & Moderasi', icon: 'pi-comments' },
  { key: 'ai_credits', label: 'Ledger Kredit AI', icon: 'pi-bolt' },
]

// =============================================================================
// PRIVACY MASKING LOGIC
// =============================================================================
const maskPrivacy = ref(true)

// =============================================================================
// TAB 1: LEADS STATE & LOGIC
// =============================================================================
const leads = ref([
  {
    id: 1,
    name: 'Rina & Budi',
    phone: '08123456789',
    email: 'fauzan14072004@gmail.com',
    weddingDate: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString().split('T')[0],
    budget: 25000000,
    guestCount: 300,
    source: 'budget_calculator',
    stage: 'new',
    ownerPic: 'Sarah CS',
    dueDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
    notes: [{ author: 'System', text: 'Lead mengisi kalkulator anggaran.', createdAt: new Date().toISOString() }],
  },
  {
    id: 2,
    name: 'Dimas & Annisa',
    phone: '08139876543',
    email: 'dimas.annisa@gmail.com',
    weddingDate: '2026-11-20',
    budget: 15000000,
    guestCount: 150,
    source: 'love_calculator',
    stage: 'contacted',
    ownerPic: 'Fauzan',
    dueDate: '2026-11-01',
    notes: [{ author: 'Fauzan', text: 'Sudah dihubungi via WhatsApp, menanyakan paket Diamond.', createdAt: new Date().toISOString() }],
  },
  {
    id: 3,
    name: 'Kevin & Jessica',
    phone: '08561122334',
    email: 'kevin.j@yahoo.com',
    weddingDate: '2026-12-12',
    budget: 45000000,
    guestCount: 500,
    source: 'custom_theme',
    stage: 'qualified',
    ownerPic: 'Budi Sales',
    dueDate: '2026-11-05',
    notes: [{ author: 'Budi Sales', text: 'Membutuhkan custom ilustrasi 3D animasi cat.', createdAt: new Date().toISOString() }],
  },
  {
    id: 4,
    name: 'Aditya & Maya',
    phone: '08781234567',
    email: 'adit.maya@outlook.com',
    weddingDate: '2026-11-05',
    budget: 30000000,
    guestCount: 400,
    source: 'organic',
    stage: 'won',
    ownerPic: 'Sarah CS',
    dueDate: null,
    notes: [{ author: 'Sarah CS', text: 'Selesai checkout paket Royal Gold.', createdAt: new Date().toISOString() }],
  },
  {
    id: 5,
    name: 'Reza & Putri',
    phone: '08991234888',
    email: 'reza.p@gmail.com',
    weddingDate: '2026-10-15',
    budget: 10000000,
    guestCount: 100,
    source: 'budget_calculator',
    stage: 'lost',
    ownerPic: 'Fauzan',
    dueDate: null,
    notes: [{ author: 'Fauzan', text: 'Memilih undangan cetak fisik saja.', createdAt: new Date().toISOString() }],
  },
])

const leadFilterSource = ref('all')
const leadFilterStage = ref('all')
const leadSearch = ref('')
const activeLeadModal = ref(null)
const newLeadNoteText = ref('')

const filteredLeads = computed(() => {
  return leads.value.filter((item) => {
    if (leadFilterSource.value !== 'all' && item.source !== leadFilterSource.value) return false
    if (leadFilterStage.value !== 'all' && item.stage !== leadFilterStage.value) return false
    if (leadSearch.value.trim()) {
      const q = leadSearch.value.toLowerCase().trim()
      const matchName = item.name?.toLowerCase().includes(q)
      const matchEmail = item.email?.toLowerCase().includes(q)
      const matchPhone = item.phone?.includes(q)
      const matchPic = item.ownerPic?.toLowerCase().includes(q)
      if (!matchName && !matchEmail && !matchPhone && !matchPic) return false
    }
    return true
  })
})

const leadMetrics = computed(() => {
  const total = leads.value.length
  const newCount = leads.value.filter((l) => l.stage === 'new').length
  const qualifiedCount = leads.value.filter((l) => l.stage === 'qualified').length
  const wonCount = leads.value.filter((l) => l.stage === 'won').length
  const rate = total > 0 ? ((wonCount / total) * 100).toFixed(1) : '0.0'
  return {
    total,
    new: newCount,
    qualified: qualifiedCount,
    won: wonCount,
    conversionRate: rate,
  }
})

function getSourceBadgeClass(src) {
  switch (src) {
    case 'budget_calculator':
      return 'bg-emerald-50 text-emerald-700'
    case 'love_calculator':
      return 'bg-pink-50 text-pink-700'
    case 'custom_theme':
      return 'bg-purple-50 text-purple-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function formatSourceLabel(src) {
  switch (src) {
    case 'budget_calculator':
      return 'Kalkulator Anggaran'
    case 'love_calculator':
      return 'Kalkulator Cinta'
    case 'custom_theme':
      return 'Custom Theme'
    case 'organic':
      return 'Organik'
    default:
      return src || 'Umum'
  }
}

function getStageBadgeClass(stg) {
  switch (stg) {
    case 'new':
      return 'bg-blue-50 text-blue-700'
    case 'contacted':
      return 'bg-amber-50 text-amber-800'
    case 'qualified':
      return 'bg-purple-50 text-purple-700'
    case 'won':
      return 'bg-emerald-50 text-emerald-700'
    case 'lost':
      return 'bg-rose-50 text-rose-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function formatStageLabel(stg) {
  switch (stg) {
    case 'new':
      return 'Baru'
    case 'contacted':
      return 'Dihubungi'
    case 'qualified':
      return 'Terkualifikasi'
    case 'won':
      return 'Closing (Won)'
    case 'lost':
      return 'Batal (Lost)'
    default:
      return stg || 'Draft'
  }
}

function openLeadDetail(lead) {
  activeLeadModal.value = JSON.parse(JSON.stringify(lead))
  newLeadNoteText.value = ''
}

async function handleSaveLeadModal() {
  if (!activeLeadModal.value) return
  if (newLeadNoteText.value.trim()) {
    if (!activeLeadModal.value.notes) activeLeadModal.value.notes = []
    activeLeadModal.value.notes.push({
      author: 'Admin Staff',
      text: newLeadNoteText.value.trim(),
      createdAt: new Date().toISOString(),
    })
  }
  try {
    await updateLead(activeLeadModal.value.id, {
      stage: activeLeadModal.value.stage,
      ownerPic: activeLeadModal.value.ownerPic,
      notes: activeLeadModal.value.notes,
    })
  } catch {
    // Keep local change if endpoint is offline
  }
  const idx = leads.value.findIndex((l) => l.id === activeLeadModal.value.id)
  if (idx !== -1) {
    leads.value[idx] = { ...activeLeadModal.value }
  }
  toast.success('Data prospek berhasil diperbarui!')
  activeLeadModal.value = null
}

async function handleDeleteLead(id) {
  const res = await Swal.fire({
    title: 'Hapus Prospek?',
    text: 'Data prospek ini akan dihapus permanen dari sistem.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#cbd5e1',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
  })
  if (res.isConfirmed) {
    try {
      await deleteLead(id)
    } catch {
      // Offline fallback
    }
    leads.value = leads.value.filter((l) => l.id !== id)
    toast.success('Prospek berhasil dihapus')
  }
}

// =============================================================================
// TAB 2: SUPPORT TICKETS STATE & LOGIC
// =============================================================================
const tickets = ref([
  {
    id: 1,
    ticketNumber: 'TKT-1082',
    subject: 'Revisi Nama Orang Tua di Undangan',
    category: 'invitation',
    priority: 'urgent',
    status: 'open',
    customerName: 'Rina Kartika',
    customerEmail: 'rina.k@gmail.com',
    customerPhone: '08123456789',
    weddingDate: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString().split('T')[0],
    assignedPic: 'Fauzan CS',
    messages: [
      { sender: 'Rina Kartika', text: 'Halo CS, mohon bantu ubah nama ayah mempelai pria typo satu huruf.', isStaff: false, createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: 2,
    ticketNumber: 'TKT-1081',
    subject: 'Konfirmasi Bukti Transfer BCA Belum Terverifikasi',
    category: 'payment',
    priority: 'high',
    status: 'in_progress',
    customerName: 'Budi Santoso',
    customerEmail: 'budi.s@gmail.com',
    customerPhone: '08139876543',
    weddingDate: '2026-11-25',
    assignedPic: 'Dewi Billing',
    messages: [
      { sender: 'Budi Santoso', text: 'Sudah upload bukti transfer 2 jam lalu tapi status masih pending.', isStaff: false, createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
      { sender: 'Dewi Billing', text: 'Halo Kak Budi, sedang kami cek mutasi bank BCA ya.', isStaff: true, createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString() },
    ],
  },
  {
    id: 3,
    ticketNumber: 'TKT-1079',
    subject: 'Pertanyaan Fitur Buku Tamu & QR Check-in',
    category: 'order',
    priority: 'medium',
    status: 'resolved',
    customerName: 'Cindy Claudia',
    customerEmail: 'cindy@gmail.com',
    customerPhone: '08561122334',
    weddingDate: '2026-12-01',
    assignedPic: 'Sarah CS',
    messages: [
      { sender: 'Cindy Claudia', text: 'Apakah scanner QR bisa dipakai di 2 handphone penerima tamu bersamaan?', isStaff: false, createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString() },
      { sender: 'Sarah CS', text: 'Bisa sekali Kak Cindy, scan sinkron secara realtime.', isStaff: true, createdAt: new Date(Date.now() - 23 * 3600 * 1000).toISOString() },
    ],
  },
  {
    id: 4,
    ticketNumber: 'TKT-1075',
    subject: 'Kendala Membuka Link pada Perangkat iOS Lama',
    category: 'technical',
    priority: 'low',
    status: 'closed',
    customerName: 'Hendra Wijaya',
    customerEmail: 'hendra@gmail.com',
    customerPhone: '08781234567',
    weddingDate: '2026-12-30',
    assignedPic: 'Alex Tech',
    messages: [
      { sender: 'Hendra Wijaya', text: 'Layar putih di iPhone 7 Safari iOS 13.', isStaff: false, createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString() },
      { sender: 'Alex Tech', text: 'Sudah kami terapkan polyfill untuk legacy safari.', isStaff: true, createdAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString() },
    ],
  },
])

const ticketMetrics = ref({
  avgFirstResponseMinutes: 12,
  avgResolutionHours: 3.5,
  backlogCount: 2,
  urgentCount: 1,
})

const ticketFilterStatus = ref('all')
const ticketFilterPriority = ref('all')
const ticketFilterCategory = ref('all')
const ticketSearch = ref('')
const activeTicketModal = ref(null)
const newTicketReplyText = ref('')

const filteredTickets = computed(() => {
  return tickets.value.filter((t) => {
    if (ticketFilterStatus.value !== 'all' && t.status !== ticketFilterStatus.value) return false
    if (ticketFilterPriority.value !== 'all' && t.priority !== ticketFilterPriority.value) return false
    if (ticketFilterCategory.value !== 'all' && t.category !== ticketFilterCategory.value) return false
    if (ticketSearch.value.trim()) {
      const q = ticketSearch.value.toLowerCase().trim()
      const matchNum = t.ticketNumber?.toLowerCase().includes(q)
      const matchSub = t.subject?.toLowerCase().includes(q)
      const matchCust = t.customerName?.toLowerCase().includes(q) || t.customerEmail?.toLowerCase().includes(q)
      if (!matchNum && !matchSub && !matchCust) return false
    }
    return true
  })
})

const urgentTicketCount = computed(() => {
  return tickets.value.filter((t) => isUrgentWedding(t.weddingDate) || t.priority === 'urgent').length
})

function getTicketPriorityBadgeClass(prio) {
  switch (prio) {
    case 'urgent':
      return 'bg-rose-100 text-rose-800 font-black'
    case 'high':
      return 'bg-amber-100 text-amber-800'
    case 'medium':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function getTicketStatusBadgeClass(status) {
  switch (status) {
    case 'open':
      return 'bg-blue-50 text-blue-700'
    case 'in_progress':
      return 'bg-amber-50 text-amber-700'
    case 'resolved':
      return 'bg-emerald-50 text-emerald-700'
    case 'closed':
      return 'bg-slate-100 text-slate-600'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function formatTicketStatusLabel(st) {
  switch (st) {
    case 'open':
      return 'Terbuka'
    case 'in_progress':
      return 'Diproses'
    case 'resolved':
      return 'Selesai'
    case 'closed':
      return 'Ditutup'
    default:
      return st
  }
}

function openTicketDetail(ticket) {
  activeTicketModal.value = JSON.parse(JSON.stringify(ticket))
  newTicketReplyText.value = ''
}

async function handleSaveTicketReply() {
  if (!activeTicketModal.value) return
  if (newTicketReplyText.value.trim()) {
    if (!activeTicketModal.value.messages) activeTicketModal.value.messages = []
    activeTicketModal.value.messages.push({
      sender: activeTicketModal.value.assignedPic || 'CS Support',
      text: newTicketReplyText.value.trim(),
      isStaff: true,
      createdAt: new Date().toISOString(),
    })
  }
  try {
    await updateSupportTicket(activeTicketModal.value.id, {
      status: activeTicketModal.value.status,
      assignedPic: activeTicketModal.value.assignedPic,
      messages: activeTicketModal.value.messages,
    })
  } catch {
    // Offline fallback
  }
  const idx = tickets.value.findIndex((t) => t.id === activeTicketModal.value.id)
  if (idx !== -1) {
    tickets.value[idx] = { ...activeTicketModal.value }
  }
  toast.success('Balasan berhasil dikirim!')
  activeTicketModal.value = null
}

// =============================================================================
// TAB 3: DRILLDOWN TAMU & MODERASI STATE & LOGIC
// =============================================================================
const selectedInvitationId = ref(101)
const guestStats = ref({
  totalGuests: 250,
  sentInvitations: 210,
  openedInvitations: 185,
  attendingRsvp: 145,
  totalPax: 290,
  guestbookCount: 68,
})

const guestMessages = ref([
  {
    id: 1,
    senderName: 'Tante Mirna & Om Joko',
    message: 'Selamat menempuh hidup baru ya Rina & Budi, samawa selalu sampai maut memisahkan!',
    rsvpStatus: 'attending',
    pax: 2,
    status: 'published',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 2,
    senderName: 'Crypto Booster 99',
    message: 'Dapatkan profit 500% setiap hari klik bit.ly/spam-crypto-link segera!',
    rsvpStatus: 'not_attending',
    pax: 0,
    status: 'flagged_spam',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: 3,
    senderName: 'Teman Kantor Budi',
    message: 'Happy wedding brother! Maaf belum tentu bisa hadir tepat waktu karena ada dinas luar.',
    rsvpStatus: 'tentative',
    pax: 1,
    status: 'hidden',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
  },
  {
    id: 4,
    senderName: 'Keluarga Besar Surabaya',
    message: 'Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khair.',
    rsvpStatus: 'attending',
    pax: 4,
    status: 'published',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
])

const guestMsgFilterStatus = ref('all')

const filteredGuestMessages = computed(() => {
  if (guestMsgFilterStatus.value === 'all') return guestMessages.value
  return guestMessages.value.filter((m) => m.status === guestMsgFilterStatus.value)
})

const openedRate = computed(() => {
  if (!guestStats.value.sentInvitations) return 0
  return Number(((guestStats.value.openedInvitations / guestStats.value.sentInvitations) * 100).toFixed(1))
})

const attendanceRate = computed(() => {
  if (!guestStats.value.totalGuests) return 0
  return Number(((guestStats.value.attendingRsvp / guestStats.value.totalGuests) * 100).toFixed(1))
})

function getRsvpBadgeClass(st) {
  switch (st) {
    case 'attending':
      return 'bg-emerald-50 text-emerald-700'
    case 'not_attending':
      return 'bg-rose-50 text-rose-700'
    case 'tentative':
      return 'bg-amber-50 text-amber-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function formatRsvpLabel(st) {
  switch (st) {
    case 'attending':
      return 'Hadir'
    case 'not_attending':
      return 'Tidak Hadir'
    case 'tentative':
      return 'Ragu-ragu'
    default:
      return st || 'Belum Respon'
  }
}

function getModerationBadgeClass(st) {
  switch (st) {
    case 'published':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    case 'hidden':
      return 'bg-amber-50 text-amber-800 border border-amber-200'
    case 'flagged_spam':
      return 'bg-rose-50 text-rose-700 border border-rose-200'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function formatModerationStatusLabel(st) {
  switch (st) {
    case 'published':
      return 'Dipublikasikan'
    case 'hidden':
      return 'Disembunyikan'
    case 'flagged_spam':
      return 'Spam'
    default:
      return st
  }
}

async function handleModerateMessage(id, nextStatus) {
  try {
    await moderateGuestMessage(id, nextStatus)
  } catch {
    // Offline fallback
  }
  const target = guestMessages.value.find((m) => m.id === id)
  if (target) {
    target.status = nextStatus
    toast.success(`Status ucapan diubah menjadi ${formatModerationStatusLabel(nextStatus)}`)
  }
}

async function handleDeleteGuestMessage(id) {
  const res = await Swal.fire({
    title: 'Hapus Ucapan Buku Tamu?',
    text: 'Pesan doa dari tamu ini akan dihapus permanen.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#0f172a',
    cancelButtonColor: '#cbd5e1',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
  })
  if (res.isConfirmed) {
    try {
      await deleteAdminGuestMessage(id)
    } catch {
      // Offline fallback
    }
    guestMessages.value = guestMessages.value.filter((m) => m.id !== id)
    toast.success('Pesan ucapan berhasil dihapus')
  }
}

async function loadGuestData() {
  try {
    const drill = await getGuestDrilldown(selectedInvitationId.value)
    if (drill && typeof drill === 'object') {
      guestStats.value = { ...guestStats.value, ...drill }
    }
  } catch {
    // Keep seed data
  }
  try {
    const msgs = await getAdminGuestMessages({ invitationId: selectedInvitationId.value })
    if (Array.isArray(msgs)) {
      guestMessages.value = msgs
    } else if (msgs?.data && Array.isArray(msgs.data)) {
      guestMessages.value = msgs.data
    }
  } catch {
    // Keep seed data
  }
}

// =============================================================================
// TAB 4: LEDGER KREDIT AI (NOVA) STATE & LOGIC
// =============================================================================
const aiStats = ref({
  totalPurchased: 5000,
  totalUsed: 3650,
  balance: 1350,
  totalRequests: 2450,
  failedRequests: 18,
  estimatedCostIdr: 128500,
})

const aiLogs = ref([
  {
    id: 1,
    userId: 42,
    userName: 'Rina Kartika',
    action: 'deduct',
    feature: 'Nova Assistant - Wedding Theme Generator',
    creditDelta: -1,
    balanceAfter: 19,
    model: 'deepseek-chat',
    promptTokens: 350,
    completionTokens: 180,
    totalTokens: 530,
    estimatedCostIdr: 45,
    status: 'success',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    userId: 89,
    userName: 'Budi Santoso',
    action: 'deduct',
    feature: 'Love Story Auto-Writer',
    creditDelta: -2,
    balanceAfter: 15,
    model: 'deepseek-reasoner',
    promptTokens: 820,
    completionTokens: 640,
    totalTokens: 1460,
    estimatedCostIdr: 120,
    status: 'success',
    createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    userId: 105,
    userName: 'Dimas Wicaksono',
    action: 'topup',
    feature: 'Top-up Paket 50 Kredit AI',
    creditDelta: 50,
    balanceAfter: 55,
    model: '-',
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
    estimatedCostIdr: 0,
    status: 'success',
    createdAt: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    userId: 67,
    userName: 'Siti Rahmawati',
    action: 'deduct',
    feature: 'Buku Tamu Auto-Moderation (Spam Check)',
    creditDelta: -1,
    balanceAfter: 8,
    model: 'deepseek-chat',
    promptTokens: 150,
    completionTokens: 50,
    totalTokens: 200,
    estimatedCostIdr: 20,
    status: 'failed',
    createdAt: new Date(Date.now() - 210 * 60 * 1000).toISOString(),
  },
])

const aiFilterStatus = ref('all')
const aiFilterAction = ref('all')
const aiSearch = ref('')

const filteredAiLogs = computed(() => {
  return aiLogs.value.filter((log) => {
    if (aiFilterStatus.value !== 'all' && log.status !== aiFilterStatus.value) return false
    if (aiFilterAction.value !== 'all' && log.action !== aiFilterAction.value) return false
    if (aiSearch.value.trim()) {
      const q = aiSearch.value.toLowerCase().trim()
      const matchUser = log.userName?.toLowerCase().includes(q) || String(log.userId).includes(q)
      const matchFeat = log.feature?.toLowerCase().includes(q)
      const matchModel = log.model?.toLowerCase().includes(q)
      if (!matchUser && !matchFeat && !matchModel) return false
    }
    return true
  })
})

function getAiActionBadgeClass(act) {
  switch (act) {
    case 'deduct':
      return 'bg-amber-50 text-amber-800'
    case 'topup':
      return 'bg-emerald-50 text-emerald-800'
    case 'refund':
      return 'bg-blue-50 text-blue-800'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

// =============================================================================
// DATA FETCHING & LIFECYCLE
// =============================================================================
async function loadAllData() {
  loading.value = true
  try {
    // 1. Leads
    const leadsRes = await getLeads().catch(() => null)
    if (leadsRes) {
      if (Array.isArray(leadsRes)) leads.value = leadsRes
      else if (leadsRes.data && Array.isArray(leadsRes.data)) leads.value = leadsRes.data
    }

    // 2. Tickets & Metrics
    const [ticketsRes, metricsRes] = await Promise.all([
      getSupportTickets().catch(() => null),
      getSupportTicketMetrics().catch(() => null),
    ])
    if (ticketsRes) {
      if (Array.isArray(ticketsRes)) tickets.value = ticketsRes
      else if (ticketsRes.data && Array.isArray(ticketsRes.data)) tickets.value = ticketsRes.data
    }
    if (metricsRes && typeof metricsRes === 'object') {
      ticketMetrics.value = { ...ticketMetrics.value, ...metricsRes }
    }

    // 3. Guest drilldown & messages
    await loadGuestData()

    // 4. AI Stats & Logs
    const [aiStatsRes, aiLogsRes] = await Promise.all([
      getAiCreditStats().catch(() => null),
      getAiCreditLogs().catch(() => null),
    ])
    if (aiStatsRes && typeof aiStatsRes === 'object') {
      aiStats.value = { ...aiStats.value, ...aiStatsRes }
    }
    if (aiLogsRes) {
      if (Array.isArray(aiLogsRes)) aiLogs.value = aiLogsRes
      else if (aiLogsRes.data && Array.isArray(aiLogsRes.data)) aiLogs.value = aiLogsRes.data
    }
  } finally {
    loading.value = false
  }
}

function refreshCurrentTab() {
  loadAllData().then(() => toast.info('Data telah disegarkan'))
}

onMounted(() => {
  loadAllData()
})
</script>
