<template>
  <div class="space-y-4">
    <!-- View Mode: Desktop Table (when viewMode === 'table') -->
    <div
      v-if="viewMode === 'table'"
      class="hidden md:block bg-white rounded-xl border border-stone-200/80 overflow-hidden"
    >
      <table class="w-full text-left border-collapse">
        <thead class="bg-stone-50/90 text-stone-500 text-[11px] font-semibold border-b border-stone-200/80">
          <tr>
            <th class="px-5 py-3.5">Undangan & Acara</th>
            <th class="px-5 py-3.5">Tautan Undangan</th>
            <th class="px-5 py-3.5">Statistik & Respon</th>
            <th class="px-5 py-3.5">Status</th>
            <th class="px-5 py-3.5 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-stone-100 text-xs">
          <tr
            v-for="invite in invitations"
            :key="invite.id"
            class="hover:bg-stone-50/60 transition-colors group"
          >
            <!-- 1. Undangan & Info -->
            <td class="px-5 py-4">
              <div class="flex items-center gap-3.5">
                <div class="relative w-12 h-14 rounded-lg overflow-hidden bg-stone-100 border border-stone-200/80 shrink-0 flex items-center justify-center">
                  <img
                    v-if="getThumbnailUrl(invite) && !failedImages.has(invite.id)"
                    :src="getThumbnailUrl(invite)"
                    :alt="invite.title || 'Thumbnail'"
                    class="w-full h-full object-cover"
                    loading="lazy"
                    @error="handleImageError(invite.id)"
                  />
                  <div v-else class="text-stone-300 flex items-center justify-center w-full h-full bg-stone-50">
                    <i class="fa-solid fa-heart text-[#a47148]/40 text-base"></i>
                  </div>
                </div>

                <div class="min-w-0 space-y-1">
                  <div class="font-semibold text-stone-900 text-sm truncate max-w-xs group-hover:text-[#8f5e38] transition-colors">
                    {{ invite.title || 'Undangan Tanpa Judul' }}
                  </div>
                  <div v-if="getCoupleNames(invite)" class="text-xs font-medium text-[#8f5e38] flex items-center gap-1.5 truncate max-w-xs">
                    <i class="fa-solid fa-heart text-[9px] text-[#a47148]/70"></i>
                    <span>{{ getCoupleNames(invite) }}</span>
                  </div>
                  <div class="flex items-center gap-2 flex-wrap text-[11px] text-stone-500">
                    <span class="font-medium text-stone-600">
                      {{ invite.templateDesign?.name || invite.templateName || 'Template Standar' }}
                    </span>
                    <template v-if="formatDate(invite.akadLocation?.dateTime || invite.dateTime) !== '-'">
                      <span class="text-stone-300">·</span>
                      <span class="flex items-center gap-1 tabular-nums">
                        <i class="fa-regular fa-calendar text-[10px] text-stone-400"></i>
                        <span>{{ formatDate(invite.akadLocation?.dateTime || invite.dateTime) }}</span>
                        <span v-if="getDaysUntil(invite.akadLocation?.dateTime || invite.dateTime)" class="ml-0.5 text-[10px] font-semibold" :class="getDaysUntilTextClass(invite.akadLocation?.dateTime || invite.dateTime)">
                          ({{ getDaysUntil(invite.akadLocation?.dateTime || invite.dateTime) }})
                        </span>
                      </span>
                    </template>
                  </div>
                </div>
              </div>
            </td>

            <!-- 2. Public Slug Link -->
            <td class="px-5 py-4">
              <div class="space-y-0.5 max-w-[210px]">
                <div class="flex items-center gap-1.5 text-stone-800 font-medium">
                  <a
                    :href="getInvitationPublicUrl(invite)"
                    target="_blank"
                    class="truncate hover:underline hover:text-[#8f5e38] transition-colors text-xs"
                    title="Buka Undangan di Tab Baru"
                  >
                    {{ getInvitationPublicUrl(invite) }}
                  </a>
                  <button
                    @click="copyLink(invite)"
                    class="p-1 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors shrink-0 cursor-pointer"
                    title="Salin Link"
                  >
                    <i class="fa-solid fa-copy text-[11px]"></i>
                  </button>
                </div>
                <div class="text-[11px] text-stone-400 font-mono">
                  /inv/{{ invite.slug }}
                </div>
              </div>
            </td>

            <!-- 3. Key Wedding Stats (Clean Tabular Alignment — No Rainbow Pills) -->
            <td class="px-5 py-4">
              <div class="space-y-1 text-[11px] tabular-nums">
                <div class="flex items-center gap-3 text-stone-700">
                  <router-link
                    v-if="invite.isPublished"
                    :to="`/guests?invitationId=${invite.id}`"
                    class="inline-flex items-center gap-1.5 hover:text-[#8f5e38] font-medium transition-colors"
                    title="Daftar Tamu"
                  >
                    <i class="fa-solid fa-users text-[10px] text-stone-400"></i>
                    <span>{{ invite.guestCount ?? 0 }} Tamu</span>
                  </router-link>
                  <span v-else class="inline-flex items-center gap-1.5 text-stone-400">
                    <i class="fa-solid fa-users text-[10px]"></i>
                    <span>{{ invite.guestCount ?? 0 }} Tamu</span>
                  </span>

                  <span class="text-stone-300">·</span>

                  <span class="inline-flex items-center gap-1 text-stone-700 font-medium">
                    <i class="fa-solid fa-user-check text-[10px] text-emerald-600"></i>
                    <span>{{ invite.confirmedGuestCount ?? 0 }} Hadir</span>
                  </span>
                </div>

                <div class="flex items-center gap-3 text-stone-500">
                  <span class="inline-flex items-center gap-1.5">
                    <i class="fa-regular fa-eye text-[10px] text-stone-400"></i>
                    <span>{{ Number(invite.views || 0).toLocaleString('id-ID') }} tayangan</span>
                  </span>

                  <span class="text-stone-300">·</span>

                  <router-link
                    v-if="invite.isPublished"
                    :to="`/guestbook?invitationId=${invite.id}`"
                    class="inline-flex items-center gap-1 hover:text-[#8f5e38] transition-colors"
                    title="Buku Tamu"
                  >
                    <i class="fa-regular fa-comment-dots text-[10px] text-stone-400"></i>
                    <span>{{ invite.wishesCount ?? 0 }} Ucapan</span>
                  </router-link>
                  <span v-else class="inline-flex items-center gap-1 text-stone-400">
                    <i class="fa-regular fa-comment-dots text-[10px]"></i>
                    <span>{{ invite.wishesCount ?? 0 }} Ucapan</span>
                  </span>
                </div>
              </div>
            </td>

            <!-- 4. Status & Paket -->
            <td class="px-5 py-4">
              <div class="space-y-1">
                <span :class="getStatusBadgeClass(invite)" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold border">
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(invite)"></span>
                  <span>{{ getStatusText(invite) }}</span>
                </span>
                <p v-if="invite.isPublished" class="text-[11px] text-stone-400 tabular-nums">
                  Aktif s.d. {{ getExpiryLabel(invite) }}
                </p>
                <p v-else-if="isPendingPayment(invite)" class="text-[11px] text-amber-700 font-medium">
                  Menunggu pembayaran
                </p>
                <p v-else class="text-[11px] text-stone-400">
                  Belum dipublikasikan
                </p>
              </div>
            </td>

            <!-- 5. Actions -->
            <td class="px-5 py-4 text-right">
              <div class="flex items-center justify-end gap-1.5 flex-wrap">
                <router-link
                  v-if="invite.isPublished"
                  :to="`/guests?invitationId=${invite.id}`"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-[11px] font-semibold transition-colors"
                  title="Daftar Tamu"
                >
                  <i class="fa-solid fa-users text-[10px]"></i>
                  <span>Kelola Tamu</span>
                </router-link>

                <router-link
                  v-else-if="isPendingPayment(invite)"
                  :to="getPendingLink(invite)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-semibold transition-colors"
                  title="Lanjutkan atau Cek Pembayaran"
                >
                  <i class="fa-solid fa-credit-card text-[10px]"></i>
                  <span>Lanjut Bayar</span>
                </router-link>

                <router-link
                  v-else
                  :to="`/checkout?slug=${invite.slug}`"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8f5e38] hover:bg-[#734a2b] text-white rounded-lg text-[11px] font-semibold transition-colors"
                  title="Publish & Aktifkan Undangan"
                >
                  <i class="fa-solid fa-rocket text-[10px]"></i>
                  <span>Publish</span>
                </router-link>

                <router-link
                  v-if="invite.isPublished"
                  :to="`/live-screen/${invite.slug}`"
                  class="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                  title="Live Screen"
                >
                  <i class="fa-solid fa-desktop text-xs"></i>
                </router-link>

                <router-link
                  v-if="invite.isPublished"
                  :to="`/guestbook?invitationId=${invite.id}`"
                  class="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                  title="Buku Tamu"
                >
                  <i class="fa-solid fa-book-open text-xs"></i>
                </router-link>

                <router-link
                  v-if="invite.isPublished && (invite.latestOrderId || invite.payments?.length)"
                  :to="`/payment/finish?order_id=${invite.latestOrderId || invite.payments[0]?.orderId}`"
                  class="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="Lihat Bukti Bayar"
                >
                  <i class="fa-solid fa-receipt text-xs"></i>
                </router-link>

                <button
                  @click="$emit('preview', invite)"
                  class="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                  title="Preview Live"
                >
                  <i class="fa-solid fa-eye text-xs"></i>
                </button>

                <button
                  @click="$emit('edit', invite.id)"
                  class="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-[#8f5e38] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                  title="Edit Studio"
                >
                  <i class="fa-solid fa-pen-to-square text-xs"></i>
                </button>

                <button
                  @click="$emit('delete', invite.id)"
                  class="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Hapus"
                >
                  <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="invitations.length === 0">
            <td colspan="5" class="px-6 py-10 text-center text-stone-400 italic">Belum ada undangan.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- View Mode: Modern Editorial Card Grid (Desktop & Tablet when viewMode === 'grid') -->
    <div
      v-if="viewMode === 'grid'"
      class="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      <div
        v-for="invite in invitations"
        :key="invite.id"
        class="bg-white rounded-xl border border-stone-200/80 hover:border-stone-300 transition-colors flex flex-col overflow-hidden group"
      >
        <!-- Cover Image Header -->
        <div class="relative h-44 bg-stone-100 overflow-hidden border-b border-stone-100">
          <img
            v-if="getThumbnailUrl(invite) && !failedImages.has(invite.id)"
            :src="getThumbnailUrl(invite)"
            :alt="invite.title || 'Thumbnail'"
            class="w-full h-full object-cover"
            loading="lazy"
            @error="handleImageError(invite.id)"
          />
          <div v-else class="w-full h-full bg-[#FAF8F5] flex items-center justify-center">
            <i class="fa-solid fa-envelope-open-text text-3xl text-stone-300"></i>
          </div>

          <div class="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent flex flex-col justify-between p-3.5">
            <div class="flex items-center justify-between gap-2">
              <span :class="getStatusBadgeClass(invite)" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold border bg-white/95">
                <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(invite)"></span>
                <span>{{ getStatusText(invite) }}</span>
              </span>
              <span v-if="getDaysUntil(invite.akadLocation?.dateTime || invite.dateTime)" class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-stone-900/80 text-white tabular-nums">
                {{ getDaysUntil(invite.akadLocation?.dateTime || invite.dateTime) }}
              </span>
            </div>

            <div class="text-white">
              <span class="text-[11px] font-medium text-white/90">
                {{ invite.templateDesign?.name || invite.templateName || 'Template Undangan' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div class="space-y-2.5">
            <div>
              <h3 class="font-serif font-semibold text-stone-900 text-lg leading-snug group-hover:text-[#8f5e38] transition-colors truncate">
                {{ invite.title || 'Undangan Tanpa Judul' }}
              </h3>
              <p v-if="getCoupleNames(invite)" class="text-xs font-medium text-[#8f5e38] flex items-center gap-1.5 mt-0.5 truncate">
                <i class="fa-solid fa-heart text-[9px]"></i>
                <span>{{ getCoupleNames(invite) }}</span>
              </p>
            </div>

            <!-- Slug Link Row -->
            <div class="flex items-center justify-between bg-[#FAF8F5] px-2.5 py-1.5 rounded-lg border border-stone-200/70 text-xs">
              <div class="truncate text-stone-700 font-mono text-[11px] max-w-[85%]">
                <a :href="getInvitationPublicUrl(invite)" target="_blank" class="hover:underline hover:text-[#8f5e38]">
                  {{ getInvitationPublicUrl(invite) }}
                </a>
              </div>
              <button
                @click="copyLink(invite)"
                class="p-1 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
                title="Salin Link"
              >
                <i class="fa-solid fa-copy text-xs"></i>
              </button>
            </div>

            <!-- Single Divided Hairline Metric Strip (Anti-Slop: No nested colored cards) -->
            <div class="grid grid-cols-4 divide-x divide-stone-200/70 border-y border-stone-200/70 py-2.5 text-center tabular-nums">
              <router-link
                v-if="invite.isPublished"
                :to="`/guests?invitationId=${invite.id}`"
                class="px-1 hover:text-[#8f5e38] transition-colors"
                title="Daftar Tamu"
              >
                <div class="text-sm font-semibold text-stone-900">{{ invite.guestCount ?? 0 }}</div>
                <div class="text-[10px] text-stone-500">Tamu</div>
              </router-link>
              <div v-else class="px-1">
                <div class="text-sm font-semibold text-stone-700">{{ invite.guestCount ?? 0 }}</div>
                <div class="text-[10px] text-stone-400">Tamu</div>
              </div>

              <div class="px-1">
                <div class="text-sm font-semibold text-stone-900">{{ invite.confirmedGuestCount ?? 0 }}</div>
                <div class="text-[10px] text-stone-500">Hadir</div>
              </div>

              <div class="px-1">
                <div class="text-sm font-semibold text-stone-900">{{ Number(invite.views || 0).toLocaleString('id-ID') }}</div>
                <div class="text-[10px] text-stone-500">Tayangan</div>
              </div>

              <router-link
                v-if="invite.isPublished"
                :to="`/guestbook?invitationId=${invite.id}`"
                class="px-1 hover:text-[#8f5e38] transition-colors"
                title="Buku Tamu"
              >
                <div class="text-sm font-semibold text-stone-900">{{ invite.wishesCount ?? 0 }}</div>
                <div class="text-[10px] text-stone-500">Ucapan</div>
              </router-link>
              <div v-else class="px-1">
                <div class="text-sm font-semibold text-stone-700">{{ invite.wishesCount ?? 0 }}</div>
                <div class="text-[10px] text-stone-400">Ucapan</div>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="space-y-2.5">
            <router-link
              v-if="invite.isPublished"
              :to="`/guests?invitationId=${invite.id}`"
              class="w-full py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              title="Daftar Tamu"
            >
              <i class="fa-solid fa-users text-xs"></i>
              <span>Kelola Tamu & Sebar WhatsApp</span>
            </router-link>
            <router-link
              v-else-if="isPendingPayment(invite)"
              :to="getPendingLink(invite)"
              class="w-full py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              title="Lanjutkan atau Cek Pembayaran"
            >
              <i class="fa-solid fa-credit-card text-xs"></i>
              <span>Lanjut Bayar</span>
            </router-link>
            <router-link
              v-else
              :to="`/checkout?slug=${invite.slug}`"
              class="w-full py-2 px-3 bg-[#8f5e38] hover:bg-[#734a2b] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              title="Publish & Aktifkan Undangan"
            >
              <i class="fa-solid fa-rocket text-xs"></i>
              <span>Publish Undangan</span>
            </router-link>

            <div class="flex items-center justify-between text-stone-500 pt-1">
              <div class="flex items-center gap-1">
                <button
                  @click="$emit('preview', invite)"
                  class="p-1.5 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
                  title="Preview Live"
                >
                  <i class="fa-solid fa-eye text-xs"></i>
                </button>
                <button
                  @click="$emit('edit', invite.id)"
                  class="p-1.5 rounded-lg hover:bg-stone-100 hover:text-[#8f5e38] transition-colors cursor-pointer"
                  title="Edit Studio"
                >
                  <i class="fa-solid fa-pen-to-square text-xs"></i>
                </button>
                <router-link
                  v-if="invite.isPublished"
                  :to="`/guestbook?invitationId=${invite.id}`"
                  class="p-1.5 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors"
                  title="Buku Tamu"
                >
                  <i class="fa-solid fa-book-open text-xs"></i>
                </router-link>
                <router-link
                  v-if="invite.isPublished"
                  :to="`/live-screen/${invite.slug}`"
                  class="p-1.5 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors"
                  title="Live Screen"
                >
                  <i class="fa-solid fa-desktop text-xs"></i>
                </router-link>
                <router-link
                  v-if="invite.isPublished && (invite.latestOrderId || invite.payments?.length)"
                  :to="`/payment/finish?order_id=${invite.latestOrderId || invite.payments[0]?.orderId}`"
                  class="p-1.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  title="Lihat Bukti Bayar"
                >
                  <i class="fa-solid fa-receipt text-xs"></i>
                </router-link>
              </div>

              <button
                @click="$emit('delete', invite.id)"
                class="p-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
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
        class="bg-white p-4 rounded-xl border border-stone-200/80 space-y-3"
      >
        <div class="flex items-start gap-3">
          <div class="relative w-12 h-14 rounded-lg overflow-hidden bg-stone-100 border border-stone-200/80 shrink-0 flex items-center justify-center">
            <img
              v-if="getThumbnailUrl(invite) && !failedImages.has(invite.id)"
              :src="getThumbnailUrl(invite)"
              :alt="invite.title || 'Thumbnail'"
              class="w-full h-full object-cover"
              loading="lazy"
              @error="handleImageError(invite.id)"
            />
            <div v-else class="text-stone-300 flex items-center justify-center w-full h-full bg-stone-50">
              <i class="fa-solid fa-heart text-[#a47148]/40 text-base"></i>
            </div>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex justify-between items-start gap-2">
              <div class="min-w-0 flex-1">
                <div class="font-semibold text-stone-900 text-sm truncate">{{ invite.title || 'Undangan Tanpa Judul' }}</div>
                <div v-if="getCoupleNames(invite)" class="text-xs font-medium text-[#8f5e38] flex items-center gap-1 truncate">
                  <i class="fa-solid fa-heart text-[8px] text-[#a47148]/70"></i>
                  <span>{{ getCoupleNames(invite) }}</span>
                </div>
                <div class="text-[11px] text-stone-400 mt-0.5 truncate">
                  {{ invite.templateDesign?.name || invite.templateName || 'Template Standar' }}
                </div>
              </div>
              <span :class="getStatusBadgeClass(invite)" class="px-2 py-0.5 rounded-md text-[9px] font-semibold border shrink-0">
                {{ getStatusText(invite) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Divided Hairline Metrics Row -->
        <div class="grid grid-cols-4 divide-x divide-stone-200/70 py-2 border-y border-stone-100 text-center tabular-nums">
          <div>
            <div class="text-xs font-semibold text-stone-900">{{ invite.guestCount ?? 0 }}</div>
            <div class="text-[10px] text-stone-500">Tamu</div>
          </div>
          <div>
            <div class="text-xs font-semibold text-stone-900">{{ invite.confirmedGuestCount ?? 0 }}</div>
            <div class="text-[10px] text-stone-500">Hadir</div>
          </div>
          <div>
            <div class="text-xs font-semibold text-stone-900">{{ Number(invite.views || 0).toLocaleString('id-ID') }}</div>
            <div class="text-[10px] text-stone-500">Views</div>
          </div>
          <div>
            <div class="text-xs font-semibold text-stone-900">{{ invite.wishesCount ?? 0 }}</div>
            <div class="text-[10px] text-stone-500">Ucapan</div>
          </div>
        </div>

        <!-- Mobile Direct Management Shortcuts -->
        <div v-if="invite.isPublished" class="grid grid-cols-3 gap-2 text-[11px] font-medium">
          <router-link
            :to="`/guests?invitationId=${invite.id}`"
            class="py-1.5 px-2 rounded-lg bg-stone-900 text-white text-center flex items-center justify-center gap-1"
            title="Daftar Tamu"
          >
            <i class="fa-solid fa-users text-[10px]"></i>
            <span class="truncate">Daftar Tamu</span>
          </router-link>
          <router-link
            :to="`/guestbook?invitationId=${invite.id}`"
            class="py-1.5 px-2 rounded-lg bg-stone-50 text-stone-700 text-center flex items-center justify-center gap-1 border border-stone-200/80"
            title="Buku Tamu"
          >
            <i class="fa-solid fa-book-open text-[10px] text-stone-500"></i>
            <span class="truncate">Buku Tamu</span>
          </router-link>
          <router-link
            :to="`/live-screen/${invite.slug}`"
            class="py-1.5 px-2 rounded-lg bg-stone-50 text-stone-700 text-center flex items-center justify-center gap-1 border border-stone-200/80"
            title="Live Screen"
          >
            <i class="fa-solid fa-desktop text-[10px] text-stone-500"></i>
            <span class="truncate">Live Screen</span>
          </router-link>
        </div>

        <!-- Slug & Date Details -->
        <div class="grid grid-cols-2 gap-3 py-2 border-y border-stone-100 text-xs">
          <div>
            <div class="text-[10px] text-stone-400 font-medium mb-0.5">Slug</div>
            <div class="text-stone-800 font-mono text-[11px] truncate flex items-center gap-1">
              <a :href="getInvitationPublicUrl(invite)" target="_blank" class="truncate hover:underline">
                {{ getInvitationPublicUrl(invite) }}
              </a>
              <button @click="copyLink(invite)" class="text-stone-400 hover:text-stone-800 shrink-0" title="Salin Link">
                <i class="fa-solid fa-copy text-[10px]"></i>
              </button>
            </div>
          </div>
          <div>
            <div class="text-[10px] text-stone-400 font-medium mb-0.5">
              {{ invite.isPublished ? 'Masa Aktif' : 'Tanggal Acara' }}
            </div>
            <div class="text-stone-700 font-medium truncate tabular-nums">
              {{ invite.isPublished ? getExpiryLabel(invite) : formatDate(invite.akadLocation?.dateTime || invite.dateTime) }}
            </div>
            <div v-if="getDaysUntil(invite.akadLocation?.dateTime || invite.dateTime)" class="text-[10px] font-medium mt-0.5 text-[#8f5e38]">
              {{ getDaysUntil(invite.akadLocation?.dateTime || invite.dateTime) }}
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-between pt-0.5">
          <div class="flex gap-2 items-center">
            <router-link
              v-if="isPendingPayment(invite)"
              :to="getPendingLink(invite)"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-lg text-[11px] font-semibold transition-colors"
              title="Lanjutkan atau Cek Pembayaran"
            >
              <i class="fa-solid fa-credit-card text-[9px]"></i>
              <span>Lanjut Bayar</span>
            </router-link>

            <router-link
              v-else-if="!invite.isPublished"
              :to="`/checkout?slug=${invite.slug}`"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-[#8f5e38] text-white rounded-lg text-[11px] font-semibold transition-colors"
              title="Publish & Aktifkan Undangan"
            >
              <i class="fa-solid fa-rocket text-[9px]"></i>
              <span>Publish</span>
            </router-link>

            <router-link
              v-if="invite.isPublished && (invite.latestOrderId || invite.payments?.length)"
              :to="`/payment/finish?order_id=${invite.latestOrderId || invite.payments[0]?.orderId}`"
              class="w-8 h-8 flex items-center justify-center text-stone-600 bg-stone-50 border border-stone-200/80 rounded-lg transition-colors"
              title="Bukti Bayar"
            >
              <i class="fa-solid fa-receipt text-xs"></i>
            </router-link>

            <button
              @click="$emit('preview', invite)"
              class="w-8 h-8 flex items-center justify-center text-stone-600 bg-stone-50 border border-stone-200/80 rounded-lg transition-colors"
              title="Preview Live"
            >
              <i class="fa-solid fa-eye text-xs"></i>
            </button>
            <button
              @click="$emit('edit', invite.id)"
              class="w-8 h-8 flex items-center justify-center text-stone-600 bg-stone-50 border border-stone-200/80 rounded-lg transition-colors"
              title="Edit Studio"
            >
              <i class="fa-solid fa-pen-to-square text-xs"></i>
            </button>
          </div>
          <button
            @click="$emit('delete', invite.id)"
            class="w-8 h-8 flex items-center justify-center text-rose-500 bg-rose-50/70 border border-rose-200/60 rounded-lg transition-colors"
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

defineProps({
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
  toast.success('Link undangan berhasil disalin')
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
  if (invite.isPublished) return 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
  if (isPendingPayment(invite)) return 'bg-amber-50 text-amber-800 border-amber-200/80'
  return 'bg-stone-100 text-stone-600 border-stone-200/80'
}

function getStatusDotClass(invite) {
  if (invite.isPublished) return 'bg-emerald-600'
  if (isPendingPayment(invite)) return 'bg-amber-600'
  return 'bg-stone-400'
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
    if (diffDays === 0) return 'Hari ini'
    if (diffDays > 0) return `${diffDays} hari lagi`
    return 'Selesai'
  } catch {
    return null
  }
}

function getDaysUntilTextClass(date) {
  const str = getDaysUntil(date)
  if (!str) return ''
  if (str === 'Hari ini') return 'text-rose-700'
  if (str === 'Selesai') return 'text-stone-400'
  return 'text-[#8f5e38]'
}
</script>
