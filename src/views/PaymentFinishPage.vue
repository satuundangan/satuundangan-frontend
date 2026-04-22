<template>
  <main class="min-h-screen bg-ivory font-montserrat px-4 py-10 text-text-dark">
    <section class="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-xl flex-col items-center justify-center">
      <div class="w-full space-y-6 rounded-lg border border-mocha/10 bg-white p-6 text-center shadow-[0_18px_55px_rgba(47,47,47,0.08)] sm:p-8">
        <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full" :class="state.iconWrap">
          <i :class="[state.icon, state.iconColor]" class="text-3xl"></i>
        </div>

        <div class="space-y-2">
          <p class="text-xs font-bold uppercase text-mocha/60">Status Pembayaran</p>
          <h1 class="font-alex text-4xl font-bold text-mocha sm:text-5xl">{{ state.title }}</h1>
          <p class="mx-auto max-w-md text-sm leading-6 text-gray-500">{{ state.description }}</p>
        </div>

        <div v-if="checking" class="flex items-center justify-center gap-2 text-sm font-semibold text-mocha/70">
          <span class="h-4 w-4 animate-spin rounded-full border-2 border-mocha/20 border-t-mocha"></span>
          Menyinkronkan status transaksi
        </div>

        <dl class="grid gap-3 rounded-lg bg-ivory/70 p-4 text-left text-sm">
          <div class="flex items-start justify-between gap-4">
            <dt class="text-gray-500">Order ID</dt>
            <dd class="break-all text-right font-semibold text-text-dark">{{ orderId || '-' }}</dd>
          </div>
          <div class="flex items-start justify-between gap-4">
            <dt class="text-gray-500">Status Midtrans</dt>
            <dd class="text-right font-semibold capitalize text-text-dark">{{ midtransStatusLabel }}</dd>
          </div>
          <div class="flex items-start justify-between gap-4">
            <dt class="text-gray-500">Status Sistem</dt>
            <dd class="text-right font-semibold capitalize text-text-dark">{{ statusLabel }}</dd>
          </div>
        </dl>

        <div class="grid gap-3 sm:grid-cols-2">
          <button
            v-if="status === 'success' && invitationSlug"
            @click="goToInvitation"
            class="btn-primary flex w-full items-center justify-center gap-2 !py-3"
          >
            <i class="fa-solid fa-envelope-open-text"></i>
            Lihat Undangan
          </button>

          <button
            v-if="status !== 'success'"
            @click="refreshStatus"
            :disabled="checking || !orderId"
            class="btn-outline flex w-full items-center justify-center gap-2 !py-3"
          >
            <i class="fa-solid fa-rotate"></i>
            Cek Ulang
          </button>

          <button
            @click="router.push('/dashboard')"
            class="btn-primary flex w-full items-center justify-center gap-2 !py-3"
            :class="{ 'sm:col-span-2': status !== 'success' || !invitationSlug }"
          >
            <i class="fa-solid fa-gauge"></i>
            Ke Dashboard
          </button>
        </div>
      </div>

      <router-link to="/" class="mt-6 text-xs font-semibold text-gray-400 transition-colors hover:text-mocha">
        Kembali ke Beranda
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
const status = ref('pending')
const statusSource = ref('midtrans')
const invitationSlug = ref(null)
const orderId = computed(() => String(route.query.order_id || ''))
const midtransTransactionStatus = computed(() => String(route.query.transaction_status || ''))
const midtransStatusCode = computed(() => String(route.query.status_code || ''))

const state = computed(() => {
  if (!orderId.value) {
    return {
      title: 'Data Pembayaran Tidak Lengkap',
      description: 'Kami tidak menerima Order ID dari Midtrans. Silakan kembali ke dashboard untuk melihat status undangan.',
      icon: 'fa-solid fa-triangle-exclamation',
      iconWrap: 'bg-red-100',
      iconColor: 'text-red-500',
    }
  }

  if (status.value === 'success') {
    return {
      title: 'Pembayaran Berhasil',
      description: 'Pembayaran sudah dikonfirmasi dan undangan kamu sudah aktif.',
      icon: 'fa-solid fa-check',
      iconWrap: 'bg-green-100',
      iconColor: 'text-green-500',
    }
  }

  if (['failure', 'failed', 'expired'].includes(status.value)) {
    return {
      title: status.value === 'expired' ? 'Pembayaran Kedaluwarsa' : 'Pembayaran Gagal',
      description: 'Transaksi tidak berhasil diproses. Kamu bisa kembali ke dashboard dan mencoba pembayaran ulang.',
      icon: 'fa-solid fa-xmark',
      iconWrap: 'bg-red-100',
      iconColor: 'text-red-500',
    }
  }

  return {
    title: 'Pembayaran Diproses',
    description: 'Midtrans sudah mengembalikan transaksi ini. Sistem akan mengaktifkan undangan setelah webhook pembayaran dikonfirmasi.',
    icon: 'fa-solid fa-clock',
    iconWrap: 'bg-yellow-100',
    iconColor: 'text-yellow-500',
  }
})

const midtransStatusLabel = computed(() => {
  const parts = [midtransTransactionStatus.value, midtransStatusCode.value].filter(Boolean)
  return parts.length ? parts.join(' / ') : '-'
})

const statusLabel = computed(() => {
  if (!orderId.value) return '-'
  return statusSource.value === 'backend'
    ? `${status.value} (terkonfirmasi)`
    : `${status.value} (menunggu konfirmasi)`
})

onMounted(() => {
  status.value = mapMidtransStatus()
  refreshStatus({ poll: true })
})

async function refreshStatus(options = {}) {
  if (!orderId.value) {
    checking.value = false
    status.value = 'failed'
    return
  }

  checking.value = true
  const maxAttempts = options.poll ? 5 : 1

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const res = await getPaymentStatus(orderId.value)
      const payload = res.data || res
      status.value = payload.status || status.value || 'pending'
      invitationSlug.value = payload.invitationSlug || null
      statusSource.value = 'backend'

      if (status.value !== 'pending' || attempt === maxAttempts) break
    } catch (err) {
      console.error('Gagal cek status pembayaran:', err)
      status.value = status.value || 'pending'
      if (attempt === maxAttempts) break
    }

    await wait(1500)
  }

  checking.value = false
}

function mapMidtransStatus() {
  const transactionStatus = midtransTransactionStatus.value
  if (['capture', 'settlement'].includes(transactionStatus)) return 'success'
  if (['deny', 'cancel', 'failure'].includes(transactionStatus)) return 'failure'
  if (transactionStatus === 'expire') return 'expired'

  if (route.name === 'payment-error') return 'failure'
  return 'pending'
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function goToInvitation() {
  if (invitationSlug.value) {
    router.push(`/${invitationSlug.value}`)
    return
  }

  router.push('/dashboard')
}
</script>
