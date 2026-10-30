<template>
  <main class="min-h-screen bg-ivory font-montserrat px-4 py-8 text-text-dark">
    <section class="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl flex-col items-center justify-center">
      <!-- Main Status Card -->
      <div
        class="w-full space-y-6 rounded-2xl border border-mocha/10 bg-white p-6 text-center shadow-[0_18px_55px_rgba(47,47,47,0.08)] sm:p-8 transition-all print:shadow-none print:border-none print:p-0"
      >
        <!-- Icon Badge (Hidden in Print) -->
        <div class="print:hidden mx-auto flex h-20 w-20 items-center justify-center rounded-full" :class="state.iconWrap">
          <i :class="[state.icon, state.iconColor]" class="text-3xl"></i>
        </div>

        <!-- Title & Subtitle -->
        <div class="space-y-2">
          <p class="text-xs font-bold uppercase tracking-wider text-mocha/60 print:hidden">Konfirmasi Transaksi</p>
          <h1 class="font-alex text-4xl font-bold text-mocha sm:text-5xl print:text-3xl">{{ state.title }}</h1>
          <p class="mx-auto max-w-md text-sm leading-6 text-gray-600 print:text-xs">{{ state.description }}</p>
        </div>

        <!-- Polling Indicator -->
        <div v-if="checking" class="print:hidden flex items-center justify-center gap-2 text-sm font-semibold text-mocha/70 bg-mocha/5 py-2.5 px-4 rounded-xl">
          <span class="h-4 w-4 animate-spin rounded-full border-2 border-mocha/20 border-t-mocha"></span>
          <span>Memverifikasi status transaksi... (Percobaan {{ pollAttempt }} dari {{ maxPollAttempts }})</span>
        </div>

        <!-- API Connection Warning (Distinct from Pending) -->
        <div v-if="apiError" class="print:hidden text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-xl p-3 text-left flex items-start gap-2.5">
          <i class="fa-solid fa-triangle-exclamation text-amber-600 mt-0.5 text-sm shrink-0"></i>
          <div>
            <p class="font-bold">Koneksi verifikasi terkendala</p>
            <p class="text-amber-700 mt-0.5">Sistem belum dapat memastikan respons perbankan saat ini. Jika Anda sudah menyelesaikan pembayaran, silakan klik tombol Cek Ulang atau hubungi kami.</p>
          </div>
        </div>

        <!-- Official Printable Receipt Card (ADM-096) -->
        <div
          v-if="isConfirmedSuccess"
          id="official-receipt"
          class="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 text-left text-sm print:border print:border-gray-300 print:bg-white print:p-6"
        >
          <div class="flex items-center justify-between border-b border-emerald-100 pb-3 mb-4 print:border-gray-200">
            <div class="flex items-center gap-2">
              <span class="h-6 w-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold font-serif">S</span>
              <span class="font-bold text-slate-800 text-sm">SatuUndangan.id</span>
            </div>
            <span class="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full print:border print:border-emerald-600">
              <i class="fa-solid fa-circle-check text-[10px]"></i> Lunas Terverifikasi
            </span>
          </div>

          <dl class="grid gap-3 text-xs sm:text-sm">
            <div class="flex items-start justify-between gap-4">
              <dt class="text-gray-500">Nomor Pesanan (Order ID)</dt>
              <dd class="font-mono font-semibold text-text-dark break-all text-right">{{ orderId || '-' }}</dd>
            </div>
            <div v-if="paymentData.customerName" class="flex items-start justify-between gap-4">
              <dt class="text-gray-500">Nama Pelanggan</dt>
              <dd class="font-semibold text-text-dark text-right">{{ paymentData.customerName }}</dd>
            </div>
            <div v-if="paymentData.customerEmail" class="flex items-start justify-between gap-4">
              <dt class="text-gray-500">Email Akun</dt>
              <dd class="font-semibold text-text-dark text-right">{{ paymentData.customerEmail }}</dd>
            </div>
            <div class="flex items-start justify-between gap-4">
              <dt class="text-gray-500">Paket Undangan</dt>
              <dd class="font-bold capitalize text-mocha text-right">{{ packageLabel }}</dd>
            </div>
            <div v-if="paymentData.paymentMethod" class="flex items-start justify-between gap-4">
              <dt class="text-gray-500">Metode Pembayaran</dt>
              <dd class="font-semibold text-text-dark uppercase text-right">{{ String(paymentData.paymentMethod).toUpperCase() }}</dd>
            </div>
            <div class="flex items-start justify-between gap-4">
              <dt class="text-gray-500">Waktu Pembayaran</dt>
              <dd class="font-semibold text-text-dark text-right">{{ formattedTime }}</dd>
            </div>
            <div class="flex items-start justify-between gap-4 border-t border-emerald-100 pt-3 mt-1 print:border-gray-200">
              <dt class="font-bold text-gray-700">Total Dibayar</dt>
              <dd class="text-base sm:text-lg font-black text-emerald-700 text-right">{{ formattedAmount }}</dd>
            </div>
          </dl>

          <p class="mt-4 text-[10px] text-gray-400 italic text-center print:block hidden">
            Bukti pembayaran resmi ini diterbitkan secara otomatis oleh sistem SatuUndangan.id dan sah tanpa tanda tangan basah.
          </p>
        </div>

        <!-- Pending Order Summary (ADM-096) -->
        <dl
          v-else
          class="grid gap-3 rounded-2xl bg-ivory/70 p-4 text-left text-sm border border-mocha/5 print:hidden"
        >
          <div class="flex items-start justify-between gap-4">
            <dt class="text-gray-500">Order ID</dt>
            <dd class="break-all text-right font-mono font-semibold text-text-dark">{{ orderId || '-' }}</dd>
          </div>
          <div v-if="paymentData.package" class="flex items-start justify-between gap-4">
            <dt class="text-gray-500">Paket</dt>
            <dd class="text-right font-semibold capitalize text-mocha">{{ packageLabel }}</dd>
          </div>
          <div v-if="paymentData.amount" class="flex items-start justify-between gap-4">
            <dt class="text-gray-500">Nominal</dt>
            <dd class="text-right font-bold text-text-dark">{{ formattedAmount }}</dd>
          </div>
          <div class="flex items-start justify-between gap-4">
            <dt class="text-gray-500">Status Pembayaran</dt>
            <dd class="text-right font-semibold text-text-dark">
              <span
                class="inline-block px-2 py-0.5 rounded-md text-xs font-bold"
                :class="statusBadgeClass"
              >
                {{ statusFriendlyLabel }}
              </span>
            </dd>
          </div>
        </dl>

        <!-- Actions Row (Hidden in Print) -->
        <div class="print:hidden space-y-3 pt-2">
          <!-- Success Actions -->
          <div v-if="isConfirmedSuccess" class="grid gap-3 sm:grid-cols-2">
            <button
              v-if="invitationSlug"
              @click="goToInvitation"
              class="btn-primary flex w-full items-center justify-center gap-2 !py-3 font-bold"
            >
              <i class="fa-solid fa-envelope-open-text"></i>
              Lihat Undangan Aktif
            </button>

            <button
              @click="goToGuests"
              class="btn-outline flex w-full items-center justify-center gap-2 !py-3 font-bold"
            >
              <i class="fa-solid fa-users"></i>
              Kelola Tamu & Bagikan
            </button>

            <button
              @click="printReceipt"
              class="flex w-full items-center justify-center gap-2 !py-3 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-sm transition-all shadow-xs"
            >
              <i class="fa-solid fa-print"></i>
              Cetak / Simpan Bukti Bayar
            </button>

            <button
              @click="router.push('/dashboard')"
              class="btn-outline flex w-full items-center justify-center gap-2 !py-3 font-bold"
            >
              <i class="fa-solid fa-gauge"></i>
              Ke Dashboard
            </button>
          </div>

          <!-- Pending Actions -->
          <div v-else-if="status === 'pending'" class="space-y-3">
            <div class="grid gap-3 sm:grid-cols-2">
              <a
                v-if="paymentData.redirectUrl"
                :href="paymentData.redirectUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-primary flex w-full items-center justify-center gap-2 !py-3 font-bold"
              >
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                Lanjutkan Pembayaran
              </a>

              <button
                @click="refreshStatus({ poll: false })"
                :disabled="checking || !orderId"
                class="btn-outline flex w-full items-center justify-center gap-2 !py-3 font-bold"
                :class="{ 'sm:col-span-2': !paymentData.redirectUrl }"
              >
                <i class="fa-solid fa-rotate" :class="{ 'animate-spin': checking }"></i>
                Cek Ulang Status
              </button>
            </div>

            <a
              :href="whatsappSupportUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex w-full items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <i class="fa-brands fa-whatsapp text-lg"></i>
              Butuh Bantuan? Hubungi WhatsApp Support
            </a>

            <button
              @click="router.push('/dashboard')"
              class="w-full text-xs font-semibold text-gray-500 hover:text-mocha py-2 transition-colors"
            >
              Kembali ke Dashboard
            </button>
          </div>

          <!-- Failed / Expired Actions -->
          <div v-else class="space-y-3">
            <div class="grid gap-3 sm:grid-cols-2">
              <router-link
                v-if="invitationSlug"
                :to="`/checkout?slug=${invitationSlug}`"
                class="btn-primary flex w-full items-center justify-center gap-2 !py-3 font-bold"
              >
                <i class="fa-solid fa-credit-card"></i>
                Ulangi Pembayaran
              </router-link>

              <button
                @click="router.push('/dashboard')"
                class="btn-outline flex w-full items-center justify-center gap-2 !py-3 font-bold"
                :class="{ 'sm:col-span-2': !invitationSlug }"
              >
                <i class="fa-solid fa-gauge"></i>
                Ke Dashboard
              </button>
            </div>

            <a
              :href="whatsappSupportUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex w-full items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors"
            >
              <i class="fa-brands fa-whatsapp text-base text-emerald-600"></i>
              Bantuan Kendala Pembayaran
            </a>
          </div>
        </div>
      </div>

      <!-- Footer Link (Hidden in Print) -->
      <router-link to="/" class="print:hidden mt-6 text-xs font-semibold text-gray-400 transition-colors hover:text-mocha">
        Kembali ke Beranda SatuUndangan
      </router-link>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPaymentStatus } from '@/api/payment'

const route = useRoute()
const router = useRouter()

const checking = ref(true)
const apiError = ref(false)
const pollAttempt = ref(1)
const maxPollAttempts = 5

const status = ref('pending')
const statusSource = ref('midtrans')
const invitationSlug = ref(null)
const paymentData = ref({
  amount: null,
  package: null,
  paymentMethod: null,
  customerName: '',
  customerEmail: '',
  settlementTime: null,
  createdAt: null,
  redirectUrl: null,
  snapToken: null,
})

const orderId = computed(() => String(route.query.order_id || ''))
const midtransTransactionStatus = computed(() => String(route.query.transaction_status || ''))

const isConfirmedSuccess = computed(() => {
  return (status.value === 'success' || status.value === 'settlement' || status.value === 'capture') && statusSource.value === 'backend'
})

const state = computed(() => {
  if (!orderId.value) {
    return {
      title: 'Data Transaksi Tidak Ditemukan',
      description: 'Nomor pesanan (Order ID) tidak terdeteksi. Silakan kembali ke dashboard untuk melihat status undangan Anda.',
      icon: 'fa-solid fa-triangle-exclamation',
      iconWrap: 'bg-red-100',
      iconColor: 'text-red-500',
    }
  }

  if (isConfirmedSuccess.value) {
    return {
      title: 'Pembayaran Berhasil',
      description: 'Terima kasih! Pembayaran kamu telah berhasil diverifikasi dan seluruh fitur undangan telah aktif.',
      icon: 'fa-solid fa-check',
      iconWrap: 'bg-green-100',
      iconColor: 'text-green-600',
    }
  }

  if (['failure', 'failed', 'deny', 'cancel'].includes(status.value)) {
    return {
      title: 'Pembayaran Tidak Berhasil',
      description: 'Transaksi tidak dapat diproses oleh bank atau telah dibatalkan. Kamu dapat mengulangi checkout dengan metode lain.',
      icon: 'fa-solid fa-xmark',
      iconWrap: 'bg-red-100',
      iconColor: 'text-red-500',
    }
  }

  if (status.value === 'expired' || status.value === 'expire') {
    return {
      title: 'Batas Waktu Pembayaran Habis',
      description: 'Waktu pembayaran untuk pesanan ini telah kedaluwarsa. Silakan lakukan checkout ulang untuk mendapatkan kode pembayaran baru.',
      icon: 'fa-solid fa-hourglass-end',
      iconWrap: 'bg-amber-100',
      iconColor: 'text-amber-600',
    }
  }

  return {
    title: 'Menunggu Pembayaran',
    description: 'Pembayaran kamu sedang menunggu penyelesaian atau konfirmasi dari pihak bank/e-wallet.',
    icon: 'fa-solid fa-clock',
    iconWrap: 'bg-amber-100',
    iconColor: 'text-amber-600',
  }
})

const statusFriendlyLabel = computed(() => {
  if (isConfirmedSuccess.value) return 'Lunas (Terkonfirmasi)'
  if (['failure', 'failed', 'deny', 'cancel'].includes(status.value)) return 'Gagal'
  if (['expired', 'expire'].includes(status.value)) return 'Kedaluwarsa'
  return 'Menunggu Pembayaran'
})

const statusBadgeClass = computed(() => {
  if (isConfirmedSuccess.value) return 'bg-emerald-100 text-emerald-800'
  if (['failure', 'failed', 'deny', 'cancel', 'expired', 'expire'].includes(status.value)) return 'bg-rose-100 text-rose-800'
  return 'bg-amber-100 text-amber-800'
})

const packageLabel = computed(() => {
  const pkg = paymentData.value.package || route.query.package || 'Basic'
  return String(pkg).toLowerCase() === 'eksklusif' ? 'Eksklusif' : String(pkg).toLowerCase() === 'premium' ? 'Premium' : 'Basic'
})

const formattedAmount = computed(() => {
  const num = Number(paymentData.value.amount || route.query.amount || 0)
  if (!num) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num)
})

const formattedTime = computed(() => {
  const time = paymentData.value.settlementTime || paymentData.value.createdAt || new Date()
  try {
    const d = new Date(time)
    return d.toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB'
  } catch {
    return '-'
  }
})

const whatsappSupportUrl = computed(() => {
  const phone = '6281284488383'
  const text = encodeURIComponent(
    `Halo Admin SatuUndangan, saya butuh bantuan mengenai pembayaran dengan Order ID: ${orderId.value || '-'}. Mohon bantuannya. Terima kasih.`
  )
  return `https://wa.me/${phone}?text=${text}`
})

onMounted(() => {
  status.value = mapInitialStatus()
  refreshStatus({ poll: true })
})

async function refreshStatus(options = {}) {
  if (!orderId.value) {
    checking.value = false
    status.value = 'failed'
    return
  }

  checking.value = true
  apiError.value = false
  const shouldPoll = options.poll !== false

  for (let attempt = 1; attempt <= (shouldPoll ? maxPollAttempts : 1); attempt += 1) {
    pollAttempt.value = attempt
    try {
      const res = await getPaymentStatus(orderId.value)
      const payload = res.data || res

      status.value = payload.status || status.value || 'pending'
      invitationSlug.value = payload.invitationSlug || null
      statusSource.value = 'backend'
      paymentData.value = {
        amount: payload.amount ?? null,
        package: payload.package ?? null,
        paymentMethod: payload.paymentMethod ?? null,
        customerName: payload.customerName ?? '',
        customerEmail: payload.customerEmail ?? '',
        settlementTime: payload.settlementTime ?? null,
        createdAt: payload.createdAt ?? null,
        redirectUrl: payload.redirectUrl ?? null,
        snapToken: payload.snapToken ?? null,
      }

      if (['success', 'settlement', 'capture', 'expire', 'expired', 'failure', 'deny', 'cancel'].includes(status.value)) {
        break
      }
    } catch (err) {
      console.error('Gagal verifikasi status pembayaran:', err)
      apiError.value = true
      if (attempt === (shouldPoll ? maxPollAttempts : 1)) break
    }

    if (shouldPoll && attempt < maxPollAttempts) {
      await wait(1800)
    }
  }

  checking.value = false
}

function mapInitialStatus() {
  const transactionStatus = midtransTransactionStatus.value
  if (['capture', 'settlement', 'success'].includes(transactionStatus)) return 'success'
  if (['deny', 'cancel', 'failure'].includes(transactionStatus)) return 'failure'
  if (['expire', 'expired'].includes(transactionStatus)) return 'expired'
  if (route.name === 'payment-error') return 'failure'
  return 'pending'
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function printReceipt() {
  window.print()
}

function goToInvitation() {
  if (invitationSlug.value) {
    router.push(`/${invitationSlug.value}`)
    return
  }
  router.push('/dashboard')
}

function goToGuests() {
  router.push({ path: '/guests', query: invitationSlug.value ? { slug: invitationSlug.value } : {} })
}
</script>

<style scoped>
@media print {
  body {
    background-color: white !important;
  }
  #official-receipt {
    display: block !important;
    border: 1px solid #cbd5e1 !important;
    box-shadow: none !important;
  }
}
</style>
