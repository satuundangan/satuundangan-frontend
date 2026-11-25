<template>
  <div class="space-y-4">
    <!-- View Mode: Desktop Table (when viewMode === 'table') -->
    <div
      v-if="viewMode === 'table'"
      class="hidden md:block bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden"
    >
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50/80 text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-100">
          <tr>
            <th class="px-5 py-4">Undangan & Acara</th>
            <th class="px-5 py-4">Link Undangan</th>
            <th class="px-5 py-4">Statistik Tamu & Respon</th>
            <th class="px-5 py-4">Status & Paket</th>
            <th class="px-5 py-4 text-right">Aksi & Kelola</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-xs">
          <tr
            v-for="invite in invitations"
            :key="invite.id"
            class="hover:bg-slate-50/70 transition-colors group"
          >
            <!-- 1. Undangan & Info -->
            <td class="px-5 py-4">
              <div class="flex items-center gap-3.5">
                <!-- Preview Thumbnail with Template Badge -->
                <div class="relative w-14 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 flex items-center justify-center shadow-2xs group-hover:shadow-sm transition-all">
                  <img
                    v-if="getThumbnailUrl(invite) && !failedImages.has(invite.id)"
                    :src="getThumbnailUrl(invite)"
                    :alt="invite.title || 'Thumbnail'"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    @error="handleImageError(invite.id)"
                  />
                  <div v-else class="text-slate-300 flex items-center justify-center w-full h-full bg-slate-50">
                    <i class="fa-solid fa-heart text-[#a47148]/40 text-lg"></i>
                  </div>
                </div>

                <!-- Info -->
                <div class="min-w-0 space-y-1">
                  <div class="font-extrabold text-slate-900 text-sm truncate max-w-xs group-hover:text-[#a47148] transition-colors">
                    {{ invite.title || 'Undangan Tanpa Judul' }}
                  </div>
                  <div v-if="getCoupleNames(invite)" class="text-xs font-semibold text-[#a47148] flex items-center gap-1.5 truncate max-w-xs">
                    <i class="fa-solid fa-heart text-[9px] text-[#a47148]/70"></i>
                    <span>{{ getCoupleNames(invite) }}</span>
                  </div>
                  <div class="flex items-center gap-2 flex-wrap text-[10px]">
                    <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold uppercase tracking-tight">
                      {{ invite.templateDesign?.name || invite.templateName || 'Default Template' }}
                    </span>
                    <span v-if="formatDate(invite.akadLocation?.dateTime || invite.dateTime) !== '-'" class="text-slate-400 font-medium flex items-center gap-1">
                      <i class="fa-regular fa-calendar text-[9px]"></i>
                      <span>{{ formatDate(invite.akadLocation?.dateTime || invite.dateTime) }}</span>
                      <span v-if="getDaysUntil(invite.akadLocation?.dateTime || invite.dateTime)" class="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold" :class="getDaysUntilClass(invite.akadLocation?.dateTime || invite.dateTime)">
                        {{ getDaysUntil(invite.akadLocation?.dateTime || invite.dateTime) }}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </td>

            <!-- 2. Public Slug Link -->
            <td class="px-5 py-4">
              <div class="space-y-1 max-w-[200px]">
                <div class="flex items-center gap-1.5 text-blue-600 font-bold">
                  <a
                    :href="getInvitationPublicUrl(invite)"
                    target="_blank"
                    class="truncate hover:underline hover:text-blue-700 transition-colors text-xs"
                    title="Buka Undangan di Tab Baru"
                  >
                    {{ getInvitationPublicUrl(invite) }}
                  </a>
                  <button
                    @click="copyLink(invite)"
                    class="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors shrink-0 cursor-pointer"
                    title="Salin Link"
                  >
                    <i class="fa-solid fa-copy text-xs"></i>
                  </button>
                </div>
                <div class="text-[10px] text-slate-400">
                  <span class="font-mono">/inv/{{ invite.slug }}</span>
                </div>
              </div>
            </td>

            <!-- 3. Key Wedding Stats Strip -->
            <td class="px-5 py-4">
              <div class="space-y-1.5">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <!-- Guest Count Badge -->
                  <router-link
                    v-if="invite.isPublished"
                    :to="`/guests?invitationId=${invite.id}`"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold hover:bg-emerald-100 transition-colors"
                    title="Daftar Tamu"
                  >
                    <i class="fa-solid fa-users text-[9px]"></i>
                    <span>{{ invite.guestCount ?? 0 }} Tamu</span>
                  </router-link>
                  <span
                    v-else
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-50 text-slate-500 border border-slate-200/60 text-[10px] font-semibold"
                  >
                    <i class="fa-solid fa-users text-[9px]"></i>
                    <span>{{ invite.guestCount ?? 0 }} Tamu</span>
                  </span>

                  <!-- Confirmed Attending -->
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200/60 text-[10px] font-bold">
                    <i class="fa-solid fa-user-check text-[9px]"></i>
                    <span>{{ invite.confirmedGuestCount ?? 0 }} Hadir</span>
                  </span>
                </div>

                <div class="flex items-center gap-1.5 flex-wrap">
                  <!-- Views Count -->
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60 text-[10px] font-bold">
                    <i class="fa-regular fa-eye text-[9px]"></i>
                    <span>{{ Number(invite.views || 0).toLocaleString('id-ID') }} tayangan</span>
                  </span>

                  <!-- Wishes Count -->
                  <router-link
                    v-if="invite.isPublished"
                    :to="`/guestbook?invitationId=${invite.id}`"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/60 text-[10px] font-bold hover:bg-purple-100 transition-colors"
                    title="Buku Tamu"
                  >
                    <i class="fa-regular fa-comment-dots text-[9px]"></i>
                    <span>{{ invite.wishesCount ?? 0 }} Ucapan</span>
                  </router-link>
                  <span
                    v-else
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-50 text-slate-500 border border-slate-200/60 text-[10px] font-semibold"
                  >
                    <i class="fa-regular fa-comment-dots text-[9px]"></i>
                    <span>{{ invite.wishesCount ?? 0 }} Ucapan</span>
                  </span>
                </div>
              </div>
            </td>

            <!-- 4. Status & Paket -->
            <td class="px-5 py-4">
              <div class="space-y-1">
                <span :class="getStatusBadgeClass(invite)" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[9px] font-black border uppercase">
                  <i :class="getStatusIcon(invite)" class="text-[8px]"></i>
                  {{ getStatusText(invite) }}
                </span>
                <p v-if="invite.isPublished" class="text-[10px] text-slate-400 font-medium">
                  Aktif s.d. {{ getExpiryLabel(invite) }}
                </p>
                <p v-else-if="isPendingPayment(invite)" class="text-[10px] text-amber-600 font-semibold">
                  Menunggu verifikasi pembayaran
                </p>
                <p v-else class="text-[10px] text-slate-400">
                  Belum dipublikasikan
                </p>
              </div>
            </td>

            <!-- 5. Actions & Management -->
            <td class="px-5 py-4 text-right">
              <div class="flex items-center justify-end gap-1.5 flex-wrap">
                <!-- Active: Primary Kelola Tamu CTA -->
                <router-link
                  v-if="invite.isPublished"
                  :to="`/guests?invitationId=${invite.id}`"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-[11px] font-extrabold shadow-xs hover:shadow-md transition-all"
                  title="Daftar Tamu"
                >
                  <i class="fa-solid fa-users text-[10px]"></i>
                  <span>Kelola Tamu</span>
                </router-link>

                <!-- Pending: Lanjutkan Bayar -->
                <router-link
                  v-else-if="isPendingPayment(invite)"
                  :to="getPendingLink(invite)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-xl text-[11px] font-extrabold shadow-xs hover:shadow-md transition-all"
                  title="Lanjutkan atau Cek Pembayaran"
                >
                  <i class="fa-solid fa-credit-card text-[10px]"></i>
                  <span>Lanjut Bayar</span>
                </router-link>

                <!-- Draft: Publish Button -->
                <router-link
                  v-else
                  :to="`/checkout?slug=${invite.slug}`"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-xl text-[11px] font-extrabold shadow-xs hover:shadow-md transition-all"
                  title="Publish & Aktifkan Undangan"
                >
                  <i class="fa-solid fa-rocket text-[10px]"></i>
                  <span>Publish</span>
                </router-link>

                <!-- Secondary Action Icons -->
                <!-- Live Screen Link -->
                <router-link
                  v-if="invite.isPublished"
                  :to="`/live-screen/${invite.slug}`"
                  class="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  title="Live Screen"
                >
                  <i class="fa-solid fa-desktop text-xs"></i>
                </router-link>

                <!-- Guestbook Link -->
                <router-link
                  v-if="invite.isPublished"
                  :to="`/guestbook?invitationId=${invite.id}`"
                  class="w-8 h-8 flex items-center justify-center text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                  title="Buku Tamu"
                >
                  <i class="fa-solid fa-book-open text-xs"></i>
                </router-link>

                <!-- Receipt Button (for settled invitations) -->
                <router-link
                  v-if="invite.isPublished && (invite.latestOrderId || invite.payments?.length)"
                  :to="`/payment/finish?order_id=${invite.latestOrderId || invite.payments[0]?.orderId}`"
                  class="w-8 h-8 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                  title="Lihat Bukti Bayar"
                >
                  <i class="fa-solid fa-receipt text-xs"></i>
                </router-link>

                <!-- Preview Live Button -->
                <button
                  @click="$emit('preview', invite)"
                  class="w-8 h-8 flex items-center justify-center text-sky-600 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer"
                  title="Preview Live"
                >
                  <i class="fa-solid fa-eye text-xs"></i>
                </button>

                <!-- Edit Studio Button -->
                <button
                  @click="$emit('edit', invite.id)"
                  class="w-8 h-8 flex items-center justify-center text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                  title="Edit Studio"
                >
                  <i class="fa-solid fa-pen-to-square text-xs"></i>
                </button>

                <!-- Delete Button -->
                <button
                  @click="$emit('delete', invite.id)"
                  class="w-8 h-8 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Hapus"
                >
                  <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="invitations.length === 0">
            <td colspan="5" class="px-6 py-10 text-center text-slate-400 italic">Belum ada undangan.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- View Mode: Modern Card Grid (Desktop & Tablet when viewMode === 'grid') -->
    <div
      v-if="viewMode === 'grid'"
      class="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      <div
        v-for="invite in invitations"
        :key="invite.id"
        class="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
      >
        <!-- Card Top Banner / Thumbnail -->
        <div class="relative h-44 bg-slate-100 overflow-hidden">
          <img
            v-if="getThumbnailUrl(invite) && !failedImages.has(invite.id)"
            :src="getThumbnailUrl(invite)"
            :alt="invite.title || 'Thumbnail'"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            @error="handleImageError(invite.id)"
          />
          <div v-else class="w-full h-full bg-gradient-to-br from-amber-50 via-slate-100 to-rose-50 flex items-center justify-center">
            <i class="fa-solid fa-envelope-open-text text-4xl text-[#a47148]/30"></i>
          </div>

          <!-- Floating Badges on Cover -->
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex flex-col justify-between p-3.5">
            <div class="flex items-center justify-between gap-2">
              <span :class="getStatusBadgeClass(invite)" class="px-2.5 py-0.5 rounded-md text-[9px] font-black border uppercase shadow-2xs backdrop-blur-xs">
                <i :class="getStatusIcon(invite)" class="text-[8px] mr-1"></i>
                {{ getStatusText(invite) }}
              </span>
              <span v-if="getDaysUntil(invite.akadLocation?.dateTime || invite.dateTime)" class="px-2 py-0.5 rounded-full text-[9px] font-extrabold shadow-2xs backdrop-blur-xs" :class="getDaysUntilClass(invite.akadLocation?.dateTime || invite.dateTime)">
                {{ getDaysUntil(invite.akadLocation?.dateTime || invite.dateTime) }}
              </span>
            </div>

            <div class="text-white">
              <span class="text-[10px] uppercase font-bold text-white/80 tracking-wide">
                {{ invite.templateDesign?.name || invite.templateName || 'Template Undangan' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <div>
              <h3 class="font-black text-slate-900 text-base leading-snug group-hover:text-[#a47148] transition-colors truncate">
                {{ invite.title || 'Undangan Tanpa Judul' }}
              </h3>
              <p v-if="getCoupleNames(invite)" class="text-xs font-semibold text-[#a47148] flex items-center gap-1 mt-0.5 truncate">
                <i class="fa-solid fa-heart text-[9px]"></i>
                <span>{{ getCoupleNames(invite) }}</span>
              </p>
            </div>

            <!-- Slug Link with Copy -->
            <div class="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200/70 text-xs">
              <div class="truncate text-blue-600 font-bold max-w-[80%]">
                <a :href="getInvitationPublicUrl(invite)" target="_blank" class="hover:underline">
                  {{ getInvitationPublicUrl(invite) }}
                </a>
              </div>
              <button
                @click="copyLink(invite)"
                class="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                title="Salin Link"
              >
                <i class="fa-solid fa-copy text-xs"></i>
              </button>
            </div>

            <!-- 4-Grid Wedding Metrics -->
            <div class="grid grid-cols-4 gap-1.5 pt-1 text-center">
              <router-link
                v-if="invite.isPublished"
                :to="`/guests?invitationId=${invite.id}`"
                class="p-2 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-100 transition-colors"
                title="Daftar Tamu"
              >
                <div class="text-xs font-black text-emerald-700">{{ invite.guestCount ?? 0 }}</div>
                <div class="text-[9px] font-bold text-emerald-600/90 uppercase tracking-tight">Tamu</div>
              </router-link>
              <div v-else class="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div class="text-xs font-black text-slate-600">{{ invite.guestCount ?? 0 }}</div>
                <div class="text-[9px] font-semibold text-slate-400 uppercase tracking-tight">Tamu</div>
              </div>

              <div class="p-2 rounded-xl bg-teal-50/70 border border-teal-100">
                <div class="text-xs font-black text-teal-700">{{ invite.confirmedGuestCount ?? 0 }}</div>
                <div class="text-[9px] font-bold text-teal-600/90 uppercase tracking-tight">Hadir</div>
              </div>

              <div class="p-2 rounded-xl bg-blue-50/70 border border-blue-100">
                <div class="text-xs font-black text-blue-700">{{ Number(invite.views || 0).toLocaleString('id-ID') }}</div>
                <div class="text-[9px] font-bold text-blue-600/90 uppercase tracking-tight">Views</div>
              </div>

              <router-link
                v-if="invite.isPublished"
                :to="`/guestbook?invitationId=${invite.id}`"
                class="p-2 rounded-xl bg-purple-50/70 hover:bg-purple-100/70 border border-purple-100 transition-colors"
                title="Buku Tamu"
              >
                <div class="text-xs font-black text-purple-700">{{ invite.wishesCount ?? 0 }}</div>
                <div class="text-[9px] font-bold text-purple-600/90 uppercase tracking-tight">Ucapan</div>
              </router-link>
              <div v-else class="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div class="text-xs font-black text-slate-600">{{ invite.wishesCount ?? 0 }}</div>
                <div class="text-[9px] font-semibold text-slate-400 uppercase tracking-tight">Ucapan</div>
              </div>
            </div>
          </div>

          <!-- Card Footer & Action Buttons -->
          <div class="pt-3 border-t border-slate-100 space-y-2">
            <!-- Primary Action Button -->
            <div>
              <router-link
                v-if="invite.isPublished"
                :to="`/guests?invitationId=${invite.id}`"
                class="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-all"
                title="Daftar Tamu"
              >
                <i class="fa-solid fa-users text-xs"></i>
                <span>Kelola Tamu & WhatsApp</span>
              </router-link>
              <router-link
                v-else-if="isPendingPayment(invite)"
                :to="getPendingLink(invite)"
                class="w-full py-2 px-3 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-all"
                title="Lanjutkan atau Cek Pembayaran"
              >
                <i class="fa-solid fa-credit-card text-xs"></i>
                <span>Lanjutkan Pembayaran</span>
              </router-link>
              <router-link
                v-else
                :to="`/checkout?slug=${invite.slug}`"
                class="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-all"
                title="Publish & Aktifkan Undangan"
              >
                <i class="fa-solid fa-rocket text-xs"></i>
                <span>Publish Undangan</span>
              </router-link>
            </div>

            <!-- Quick Action Toolbar -->
            <div class="flex items-center justify-between text-slate-500 pt-1">
              <div class="flex items-center gap-1">
                <button
                  @click="$emit('preview', invite)"
                  class="p-2 rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
                  title="Preview Live"
                >
                  <i class="fa-solid fa-eye text-xs"></i>
                </button>
                <button
                  @click="$emit('edit', invite.id)"
                  class="p-2 rounded-lg hover:bg-amber-50 hover:text-amber-600 transition-colors"
                  title="Edit Studio"
                >
                  <i class="fa-solid fa-pen-to-square text-xs"></i>
                </button>
                <router-link
                  v-if="invite.isPublished"
                  :to="`/guestbook?invitationId=${invite.id}`"
                  class="p-2 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors"
                  title="Buku Tamu"
                >
                  <i class="fa-solid fa-book-open text-xs"></i>
                </router-link>
                <router-link
                  v-if="invite.isPublished"
                  :to="`/live-screen/${invite.slug}`"
                  class="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  title="Live Screen"
                >
                  <i class="fa-solid fa-desktop text-xs"></i>
                </router-link>
                <router-link
                  v-if="invite.isPublished && (invite.latestOrderId || invite.payments?.length)"
                  :to="`/payment/finish?order_id=${invite.latestOrderId || invite.payments[0]?.orderId}`"
                  class="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                  title="Lihat Bukti Bayar"
                >
                  <i class="fa-solid fa-receipt text-xs"></i>
                </router-link>
              </div>

              <button
                @click="$emit('delete', invite.id)"
                class="p-2 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors"
                title="Hapus"
              >
                <i class="fa-solid fa-trash-can text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Card Layout (< md screens) -->
    <div class="md:hidden space-y-3.5">
      <div
        v-for="invite in invitations"
        :key="invite.id"
        class="bg-white p-4 rounded-2xl shadow-xs border border-slate-100 space-y-3"
      >
        <!-- Header with Thumbnail -->
        <div class="flex items-start gap-3">
          <div class="relative w-14 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 flex items-center justify-center shadow-2xs">
            <img
              v-if="getThumbnailUrl(invite) && !failedImages.has(invite.id)"
              :src="getThumbnailUrl(invite)"
              :alt="invite.title || 'Thumbnail'"
              class="w-full h-full object-cover"
              loading="lazy"
              @error="handleImageError(invite.id)"
            />
            <div v-else class="text-slate-300 flex items-center justify-center w-full h-full bg-slate-50">
              <i class="fa-solid fa-heart text-[#a47148]/40 text-base"></i>
            </div>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex justify-between items-start gap-2">
              <div class="min-w-0 flex-1">
                <div class="font-extrabold text-slate-900 text-sm truncate">{{ invite.title || 'Undangan Tanpa Judul' }}</div>
                <div v-if="getCoupleNames(invite)" class="text-xs font-semibold text-[#a47148] flex items-center gap-1 truncate">
                  <i class="fa-solid fa-heart text-[8px] text-[#a47148]/70"></i>
                  <span>{{ getCoupleNames(invite) }}</span>
                </div>
                <div class="text-[10px] text-slate-400 font-semibold uppercase tracking-tight mt-0.5">
                  {{ invite.templateDesign?.name || invite.templateName || 'Default Template' }}
                </div>
              </div>
              <span :class="getStatusBadgeClass(invite)" class="px-2 py-0.5 rounded-md text-[9px] font-black border uppercase shrink-0">
                {{ getStatusText(invite) }}
              </span>
            </div>
          </div>
        </div>

        <!-- 4-Grid Wedding Metrics on Mobile -->
        <div class="grid grid-cols-4 gap-1.5 py-1 text-center bg-slate-50/70 p-2 rounded-xl border border-slate-100">
          <div>
            <div class="text-xs font-black text-emerald-700">{{ invite.guestCount ?? 0 }}</div>
            <div class="text-[8px] font-bold text-slate-500 uppercase">Tamu</div>
          </div>
          <div>
            <div class="text-xs font-black text-teal-700">{{ invite.confirmedGuestCount ?? 0 }}</div>
            <div class="text-[8px] font-bold text-slate-500 uppercase">Hadir</div>
          </div>
          <div>
            <div class="text-xs font-black text-blue-700">{{ Number(invite.views || 0).toLocaleString('id-ID') }}</div>
            <div class="text-[8px] font-bold text-slate-500 uppercase">Views</div>
          </div>
          <div>
            <div class="text-xs font-black text-purple-700">{{ invite.wishesCount ?? 0 }}</div>
            <div class="text-[8px] font-bold text-slate-500 uppercase">Ucapan</div>
          </div>
        </div>

        <!-- Mobile Direct Management Shortcuts for Active Invitations -->
        <div v-if="invite.isPublished" class="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-[11px] font-bold">
          <router-link
            :to="`/guests?invitationId=${invite.id}`"
            class="py-1.5 px-2 rounded-xl bg-emerald-50 text-emerald-700 text-center transition-colors flex items-center justify-center gap-1 border border-emerald-200/60 font-black"
            title="Daftar Tamu"
          >
            <i class="fa-solid fa-users text-[10px]"></i>
            <span class="truncate">Daftar Tamu</span>
          </router-link>
          <router-link
            :to="`/guestbook?invitationId=${invite.id}`"
            class="py-1.5 px-2 rounded-xl bg-purple-50 text-purple-700 text-center transition-colors flex items-center justify-center gap-1 border border-purple-200/60 font-black"
            title="Buku Tamu"
          >
            <i class="fa-solid fa-book-open text-[10px]"></i>
            <span class="truncate">Buku Tamu</span>
          </router-link>
          <router-link
            :to="`/live-screen/${invite.slug}`"
            class="py-1.5 px-2 rounded-xl bg-blue-50 text-blue-700 text-center transition-colors flex items-center justify-center gap-1 border border-blue-200/60 font-black"
            title="Live Screen"
          >
            <i class="fa-solid fa-desktop text-[10px]"></i>
            <span class="truncate">Live Screen</span>
          </router-link>
        </div>

        <!-- Slug & Date Details -->
        <div class="grid grid-cols-2 gap-3 py-2 border-y border-slate-100 text-xs">
          <div>
            <div class="text-[9px] text-slate-400 uppercase font-black mb-0.5">Slug</div>
            <div class="text-blue-600 font-bold truncate flex items-center gap-1">
              <a :href="getInvitationPublicUrl(invite)" target="_blank" class="truncate hover:underline">
                {{ getInvitationPublicUrl(invite) }}
              </a>
              <button @click="copyLink(invite)" class="text-slate-400 hover:text-blue-600 shrink-0" title="Salin Link">
                <i class="fa-solid fa-copy text-[10px]"></i>
              </button>
            </div>
          </div>
          <div>
            <div class="text-[9px] text-slate-400 uppercase font-black mb-0.5">
              {{ invite.isPublished ? 'Masa Aktif' : 'Tanggal Acara' }}
            </div>
            <div class="text-slate-700 font-medium truncate">
              {{ invite.isPublished ? getExpiryLabel(invite) : formatDate(invite.akadLocation?.dateTime || invite.dateTime) }}
            </div>
            <div v-if="getDaysUntil(invite.akadLocation?.dateTime || invite.dateTime)" class="text-[10px] font-bold mt-0.5 text-amber-700">
              {{ getDaysUntil(invite.akadLocation?.dateTime || invite.dateTime) }}
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-between pt-1">
          <div class="flex gap-2 items-center">
            <!-- Pending Payment CTA -->
            <router-link
              v-if="isPendingPayment(invite)"
              :to="getPendingLink(invite)"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-xl text-[10px] font-extrabold shadow-sm active:scale-95 transition-all"
              title="Lanjutkan atau Cek Pembayaran"
            >
              <i class="fa-solid fa-credit-card text-[9px]"></i>
              <span>Lanjut Bayar</span>
            </router-link>

            <!-- Draft CTA -->
            <router-link
              v-else-if="!invite.isPublished"
              :to="`/checkout?slug=${invite.slug}`"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-extrabold shadow-sm active:scale-95 transition-all"
              title="Publish & Aktifkan Undangan"
            >
              <i class="fa-solid fa-rocket text-[9px]"></i>
              <span>Publish</span>
            </router-link>

            <!-- Receipt Link (Mobile) -->
            <router-link
              v-if="invite.isPublished && (invite.latestOrderId || invite.payments?.length)"
              :to="`/payment/finish?order_id=${invite.latestOrderId || invite.payments[0]?.orderId}`"
              class="w-9 h-9 flex items-center justify-center text-emerald-600 bg-emerald-50 rounded-xl transition-all"
              title="Bukti Bayar"
            >
              <i class="fa-solid fa-receipt text-xs"></i>
            </router-link>

            <button
              @click="$emit('preview', invite)"
              class="w-9 h-9 flex items-center justify-center text-blue-600 bg-blue-50 rounded-xl transition-all"
              title="Preview Live"
            >
              <i class="fa-solid fa-eye text-xs"></i>
            </button>
            <button
              @click="$emit('edit', invite.id)"
              class="w-9 h-9 flex items-center justify-center text-amber-600 bg-amber-50 rounded-xl transition-all"
              title="Edit Studio"
            >
              <i class="fa-solid fa-pen-to-square text-xs"></i>
            </button>
          </div>
          <button
            @click="$emit('delete', invite.id)"
            class="w-9 h-9 flex items-center justify-center text-rose-500 bg-rose-50 active:bg-rose-100 rounded-xl transition-all"
            title="Hapus"
          >
            <i class="fa-solid fa-trash-can text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { getInvitationPublicUrl } from '@/utils/invitationUrls'
import { resolveTemplateThumbnail } from '@/utils/templateRegistry'

const toast = useToast()

const props = defineProps({
  invitations: { type: Array, required: true },
  viewMode: { type: String, default: 'table' },
})

defineEmits(['edit', 'delete', 'preview'])

const failedImages = ref(new Set())

function handleImageError(id) {
  failedImages.value.add(id)
}

function getThumbnailUrl(invite) {
  if (invite.templateDesign) {
    const reg = resolveTemplateThumbnail(invite.templateDesign)
    if (reg) return reg
  }
  if (invite.templateName || invite.template) {
    const reg = resolveTemplateThumbnail({ slug: invite.template || invite.templateName })
    if (reg) return reg
  }
  return invite.bridePhotoUrl || invite.photoCoupleUrl || ''
}

function getCoupleNames(invite) {
  if (invite.coupleName) return invite.coupleName
  const groom = invite.groomNickname || invite.groomName
  const bride = invite.brideNickname || invite.brideName
  if (groom && bride) return `${groom} & ${bride}`
  if (groom) return groom
  if (bride) return bride
  return ''
}

function copyLink(invitation) {
  const fullUrl = getInvitationPublicUrl(invitation)
  navigator.clipboard.writeText(fullUrl)
  toast.success('Link undangan berhasil disalin!')
}

function isPendingPayment(invite) {
  if (invite.isPublished) return false
  return (
    invite.paymentStatus === 'pending' ||
    invite.latestPaymentStatus === 'pending' ||
    Boolean(invite.latestOrderId && !invite.isPublished)
  )
}

function getStatusBadgeClass(invite) {
  if (invite.isPublished) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (isPendingPayment(invite)) return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-slate-100 text-slate-600 border-slate-200'
}

function getStatusIcon(invite) {
  if (invite.isPublished) return 'fa-solid fa-circle-check text-emerald-600'
  if (isPendingPayment(invite)) return 'fa-solid fa-clock text-amber-600'
  return 'fa-regular fa-file-lines text-slate-500'
}

function getStatusText(invite) {
  const pkgName = invite.package ? String(invite.package).toUpperCase() : 'BASIC'
  if (invite.isPublished) {
    return `${pkgName} · AKTIF`
  }
  if (isPendingPayment(invite)) {
    return 'MENUNGGU PEMBAYARAN'
  }
  return 'DRAFT (BELUM AKTIF)'
}

function getExpiryLabel(invite) {
  if (!invite.isPublished) return '-'
  const expiryDate = invite.expiresAt || calculateFallbackExpiry(invite)
  try {
    const d = new Date(expiryDate)
    if (isNaN(d.getTime())) return '-'
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return '-'
  }
}

function calculateFallbackExpiry(invite) {
  const base = invite.updatedAt || invite.createdAt || new Date()
  return new Date(new Date(base).getTime() + 366 * 24 * 60 * 60 * 1000).toISOString()
}

function getPendingLink(invite) {
  if (invite.latestOrderId) {
    return `/payment/finish?order_id=${encodeURIComponent(invite.latestOrderId)}`
  }
  return `/checkout?slug=${encodeURIComponent(invite.slug)}`
}

function formatDate(date) {
  if (!date) return '-'
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return '-'
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return '-'
  }
}

function getDaysUntil(date) {
  if (!date) return null
  try {
    const event = new Date(date)
    if (isNaN(event.getTime())) return null
    const now = new Date()
    event.setHours(0, 0, 0, 0)
    now.setHours(0, 0, 0, 0)
    const diffDays = Math.round((event - now) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Hari ini!'
    if (diffDays > 0) return `${diffDays} hari lagi`
    return 'Selesai'
  } catch {
    return null
  }
}

function getDaysUntilClass(date) {
  const str = getDaysUntil(date)
  if (!str) return ''
  if (str === 'Hari ini!') return 'bg-rose-50 text-rose-700 border border-rose-200'
  if (str === 'Selesai') return 'bg-slate-100 text-slate-500 border border-slate-200'
  return 'bg-amber-50 text-amber-700 border border-amber-200'
}
</script>
