<template>
  <div>
    <!-- Desktop Table -->
    <div class="hidden md:block bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50/80 text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-100">
          <tr>
            <th class="px-6 py-4">Judul Undangan</th>
            <th class="px-6 py-4">Link Unique Slug</th>
            <th class="px-6 py-4">Status & Paket</th>
            <th class="px-6 py-4">Tanggal Acara</th>
            <th class="px-6 py-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-xs">
          <tr v-for="invite in invitations" :key="invite.id" class="hover:bg-slate-50/60 transition-colors">
            <td class="px-6 py-4">
              <div class="font-extrabold text-slate-900">{{ invite.title || 'Undangan Tanpa Judul' }}</div>
              <div class="text-[10px] text-slate-400 font-semibold uppercase tracking-tight mt-0.5">
                {{ invite.templateDesign?.name || 'Default Template' }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-1.5 text-blue-600 font-bold">
                <span>{{ invitationBaseUrl }}/inv/{{ invite.slug }}</span>
                <button @click="copyLink(invite.slug)" class="p-1 text-slate-400 hover:text-blue-600 transition-colors" title="Salin Link">
                  <i class="fa-solid fa-copy text-xs"></i>
                </button>
              </div>
            </td>
            <td class="px-6 py-4">
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
              </div>
            </td>
            <td class="px-6 py-4 text-slate-600 font-medium">
              {{ formatDate(invite.akadLocation?.dateTime || invite.dateTime) }}
            </td>
            <td class="px-6 py-4 text-right flex justify-end items-center gap-2">
              <!-- Pending: Lanjutkan Bayar -->
              <router-link
                v-if="isPendingPayment(invite)"
                :to="getPendingLink(invite)"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-xl text-[10px] font-extrabold shadow-sm hover:bg-amber-700 transition-all"
                title="Lanjutkan atau Cek Pembayaran"
              >
                <i class="fa-solid fa-credit-card text-[9px]"></i> Lanjut Bayar
              </router-link>

              <!-- Draft: Publish Button -->
              <router-link
                v-else-if="!invite.isPublished"
                :to="`/checkout?slug=${invite.slug}`"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-extrabold shadow-sm hover:bg-slate-800 transition-all"
                title="Publish & Aktifkan Undangan"
              >
                <i class="fa-solid fa-rocket text-[9px]"></i> Publish
              </router-link>

              <!-- Receipt Button (for settled invitations) -->
              <router-link
                v-if="invite.isPublished && (invite.latestOrderId || invite.payments?.length)"
                :to="`/payment/finish?order_id=${invite.latestOrderId || invite.payments[0]?.orderId}`"
                class="w-8 h-8 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                title="Lihat Bukti Bayar"
              >
                <i class="fa-solid fa-receipt"></i>
              </router-link>

              <button @click="$emit('preview', invite.slug)" class="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Preview Live">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button @click="$emit('edit', invite.id)" class="w-8 h-8 flex items-center justify-center text-amber-600 hover:bg-amber-50 rounded-xl transition-colors" title="Edit Studio">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button @click="$emit('delete', invite.id)" class="w-8 h-8 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" title="Hapus">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </td>
          </tr>
          <tr v-if="invitations.length === 0">
            <td colspan="5" class="px-6 py-10 text-center text-slate-400 italic">Belum ada undangan.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Card Layout -->
    <div class="md:hidden space-y-3">
      <div v-for="invite in invitations" :key="invite.id" class="bg-white p-4 rounded-2xl shadow-xs border border-slate-100 space-y-3">
        <div class="flex justify-between items-start gap-2">
          <div class="min-w-0 flex-1">
            <div class="font-extrabold text-slate-900 text-sm truncate">{{ invite.title || 'Undangan Tanpa Judul' }}</div>
            <div class="text-[10px] text-slate-400 font-semibold uppercase tracking-tight">{{ invite.templateDesign?.name || 'Default Template' }}</div>
          </div>
          <span :class="getStatusBadgeClass(invite)" class="px-2 py-0.5 rounded-md text-[9px] font-black border uppercase shrink-0">
            {{ getStatusText(invite) }}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-3 py-2.5 border-y border-slate-100 text-xs">
          <div>
            <div class="text-[9px] text-slate-400 uppercase font-black mb-0.5">Slug</div>
            <div class="text-blue-600 font-bold truncate">/{{ invite.slug }}</div>
          </div>
          <div>
            <div class="text-[9px] text-slate-400 uppercase font-black mb-0.5">
              {{ invite.isPublished ? 'Masa Aktif (WIB)' : 'Tanggal Acara' }}
            </div>
            <div class="text-slate-700 font-medium truncate">
              {{ invite.isPublished ? getExpiryLabel(invite) : formatDate(invite.akadLocation?.dateTime || invite.dateTime) }}
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-1">
          <div class="flex gap-2 items-center">
            <!-- Pending Payment CTA -->
            <router-link
              v-if="isPendingPayment(invite)"
              :to="getPendingLink(invite)"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white rounded-xl text-[10px] font-extrabold shadow-sm active:scale-95 transition-all"
            >
              <i class="fa-solid fa-credit-card text-[9px]"></i> Lanjut Bayar
            </router-link>

            <!-- Draft CTA -->
            <router-link
              v-else-if="!invite.isPublished"
              :to="`/checkout?slug=${invite.slug}`"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-extrabold shadow-sm active:scale-95 transition-all"
            >
              <i class="fa-solid fa-rocket text-[9px]"></i> Publish
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

            <button @click="$emit('preview', invite.slug)" class="w-9 h-9 flex items-center justify-center text-blue-600 bg-blue-50 rounded-xl transition-all" title="Preview">
              <i class="fa-solid fa-eye text-xs"></i>
            </button>
            <button @click="$emit('edit', invite.id)" class="w-9 h-9 flex items-center justify-center text-amber-600 bg-amber-50 rounded-xl transition-all" title="Edit">
              <i class="fa-solid fa-pen-to-square text-xs"></i>
            </button>
          </div>
          <button @click="$emit('delete', invite.id)" class="w-9 h-9 flex items-center justify-center text-rose-500 bg-rose-50 active:bg-rose-100 rounded-xl transition-all" title="Delete">
            <i class="fa-solid fa-trash-can text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'vue-toastification'

const toast = useToast()
const invitationBaseUrl = window.location.origin

defineProps({
  invitations: { type: Array, required: true },
})

defineEmits(['edit', 'delete', 'preview'])

function copyLink(slug) {
  const fullUrl = `${window.location.origin}/inv/${slug}`
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
</script>
