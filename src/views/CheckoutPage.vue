<template>
  <div class="min-h-screen bg-ivory font-montserrat py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      
      <!-- Header & Stepper -->
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold text-mocha mb-8 font-alex tracking-wide">Checkout</h1>
        
        <nav aria-label="Progress" class="flex justify-center">
          <ol class="flex items-center gap-2 md:gap-4">
            <li class="flex items-center gap-2 group">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-sage/20 text-sage text-xs font-bold border border-sage/30">
                <i class="fa-solid fa-check"></i>
              </span>
              <span class="text-xs md:text-sm font-medium text-sage">Detail</span>
            </li>
            <li class="h-[2px] w-4 md:w-8 bg-sage/30"></li>
            <li class="flex items-center gap-2">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-sage/20 text-sage text-xs font-bold border border-sage/30">
                <i class="fa-solid fa-check"></i>
              </span>
              <span class="text-xs md:text-sm font-medium text-sage">Desain</span>
            </li>
            <li class="h-[2px] w-4 md:w-8 bg-mocha/30"></li>
            <li class="flex items-center gap-2">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-mocha text-white text-xs font-bold ring-4 ring-mocha/10">3</span>
              <span class="text-xs md:text-sm font-bold text-mocha">Pembayaran</span>
            </li>
          </ol>
        </nav>
      </div>

      <div v-if="loading && !invitation" class="flex flex-col items-center justify-center py-20">
        <div class="w-16 h-16 border-4 border-mocha/20 border-t-mocha rounded-full animate-spin mb-6"></div>
        <p class="text-mocha/60 font-medium animate-pulse">Menyiapkan rincian pembayaran...</p>
      </div>

      <div v-else-if="ownershipError" class="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
        <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <i class="fa-solid fa-lock text-red-400 text-2xl"></i>
        </div>
        <h2 class="text-xl font-bold text-mocha mb-3">Akses Ditolak</h2>
        <p class="text-gray-500 text-sm mb-8 leading-relaxed">{{ ownershipError }}</p>
        <div class="flex gap-3">
          <button @click="authStore.logout(); router.push('/')"
            class="px-6 py-3 bg-mocha text-white rounded-xl font-bold text-sm hover:bg-mocha/90 transition-all">
            Login Ulang
          </button>
          <router-link to="/dashboard"
            class="px-6 py-3 border border-mocha/20 text-mocha rounded-xl font-bold text-sm hover:bg-mocha/5 transition-all">
            Dashboard
          </router-link>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <!-- Left Column: Invitation Preview -->
        <div class="lg:col-span-7 space-y-8">
          <div class="card overflow-hidden !p-0 border-none group">
            <div class="relative aspect-[16/10] overflow-hidden">
              <img
                :src="invitation?.content?.photoCoupleUrl || invitation?.content?.bridePhotoUrl || invitation?.content?.groomPhotoUrl || '/default-thumbnail.jpg'"
                class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                alt="Couple Preview"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
              
              <!-- Plan Badge -->
              <div class="absolute top-6 right-6">
                <div class="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border"
                  :class="invitation?.is_premium ? 'border-accent-gold/30' : 'border-sage/30'">
                  <i :class="invitation?.is_premium ? 'fa-solid fa-gem text-accent-gold animate-pulse' : 'fa-solid fa-star text-sage'"></i>
                  <span class="text-xs font-bold text-mocha uppercase tracking-widest">{{ planName }}</span>
                </div>
              </div>

              <!-- Title Overlay -->
              <div class="absolute bottom-8 left-8 text-white">
                <p class="text-accent-gold font-alex text-2xl mb-1">The Wedding of</p>
                <h2 class="text-4xl font-bold font-alex leading-tight">
                  {{ invitation?.content?.coupleName || invitation?.title || 'Mempelai' }}
                </h2>
              </div>
            </div>

            <div class="p-8 bg-white">
              <div class="grid grid-cols-2 gap-6">
                <div class="space-y-1">
                  <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Tanggal Acara</p>
                  <p class="text-mocha font-semibold flex items-center gap-2">
                    <i class="fa-regular fa-calendar-check text-accent-gold"></i>
                    {{ formatDate(invitation?.content?.akadLocation?.dateTime || invitation?.content?.dateTime) }}
                  </p>
                </div>
                <div class="space-y-1 text-right">
                  <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Custom Slug</p>
                  <p class="text-mocha font-semibold">/{{ invitation?.slug }}</p>
                </div>
              </div>
              
              <div class="mt-8 pt-8 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
                <div class="space-y-2">
                  <i class="fa-solid fa-music text-sage/60"></i>
                  <p class="text-[10px] text-gray-500 font-medium">Background Music</p>
                </div>
                <div class="space-y-2">
                  <i class="fa-solid fa-images text-sage/60"></i>
                  <p class="text-[10px] text-gray-500 font-medium">Gallery Photos</p>
                </div>
                <div class="space-y-2">
                  <i class="fa-solid fa-comments text-sage/60"></i>
                  <p class="text-[10px] text-gray-500 font-medium">Guest Messages</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Trust Signals -->
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-white/50 border border-white p-4 rounded-2xl text-center space-y-2">
              <div class="w-10 h-10 bg-sage/10 text-sage rounded-full flex items-center justify-center mx-auto">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <p class="text-[10px] font-bold text-gray-600 uppercase">Secure</p>
            </div>
            <div class="bg-white/50 border border-white p-4 rounded-2xl text-center space-y-2">
              <div class="w-10 h-10 bg-accent-gold/10 text-accent-gold rounded-full flex items-center justify-center mx-auto">
                <i class="fa-solid fa-bolt"></i>
              </div>
              <p class="text-[10px] font-bold text-gray-600 uppercase">Instant</p>
            </div>
            <div class="bg-white/50 border border-white p-4 rounded-2xl text-center space-y-2">
              <div class="w-10 h-10 bg-mocha/10 text-mocha rounded-full flex items-center justify-center mx-auto">
                <i class="fa-solid fa-headset"></i>
              </div>
              <p class="text-[10px] font-bold text-gray-600 uppercase">24/7 Help</p>
            </div>
          </div>
        </div>

        <!-- Right Column: Order Summary -->
        <div class="lg:col-span-5 sticky top-8">
          <div class="card bg-white shadow-2xl border-none relative overflow-hidden">
            <!-- Decorative Element -->
            <div class="absolute -right-16 -top-16 w-48 h-48 bg-ivory rounded-full opacity-50"></div>
            
            <div class="relative">
              <h3 class="text-2xl font-bold text-mocha mb-8 flex items-center gap-3">
                <i class="fa-solid fa-receipt text-accent-gold"></i>
                Ringkasan Pesanan
              </h3>

              <div class="space-y-6 mb-8">
                <div class="flex justify-between items-start group">
                  <div>
                    <p class="font-bold text-gray-800">{{ planName }} Invitation</p>
                    <p class="text-xs text-gray-400 mt-1 capitalize">{{ invitation?.template_slug?.replace('-', ' ') || 'Dark Elegant' }}</p>
                  </div>
                  <p class="font-bold text-mocha">{{ formatCurrency(planPrice) }}</p>
                </div>

                <!-- Promo Code Input -->
                <div class="py-4 border-y border-dashed border-gray-100 space-y-3">
                  <div v-if="!appliedPromo" class="flex gap-2">
                    <div class="relative flex-1">
                      <i class="fa-solid fa-ticket absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                      <input
                        v-model="promoCode"
                        type="text"
                        placeholder="Kode Promo"
                        :disabled="promoLoading"
                        @keyup.enter="applyPromo"
                        class="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-mocha uppercase tracking-wider disabled:opacity-50"
                      />
                    </div>
                    <button
                      @click="applyPromo"
                      :disabled="promoLoading || !promoCode.trim()"
                      class="px-4 py-2 bg-accent-gold text-white text-xs font-bold rounded-lg hover:bg-accent-gold/90 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider whitespace-nowrap"
                    >
                      {{ promoLoading ? '...' : 'Pakai' }}
                    </button>
                  </div>

                  <!-- Applied Promo -->
                  <div v-if="appliedPromo" class="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <div class="flex items-center gap-2">
                      <i class="fa-solid fa-circle-check text-green-500 text-sm"></i>
                      <span class="text-sm font-bold text-green-700 uppercase tracking-wider">{{ appliedPromo.code }}</span>
                    </div>
                    <button @click="removePromo" class="text-xs text-gray-400 hover:text-red-500 font-medium">Hapus</button>
                  </div>

                  <!-- Promo Error -->
                  <p v-if="promoError" class="text-xs text-red-500 flex items-center gap-1">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    {{ promoError }}
                  </p>
                </div>

                <div class="space-y-3">
                  <div class="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>{{ formatCurrency(planPrice) }}</span>
                  </div>
                  <div v-if="appliedPromo" class="flex justify-between text-sm">
                    <span class="text-green-600">
                      Diskon
                      <span v-if="appliedPromo.discount_type === 'percentage'">({{ appliedPromo.discount_value }}%)</span>
                    </span>
                    <span class="text-green-600 font-medium">- {{ formatCurrency(appliedPromo.discount_amount) }}</span>
                  </div>
                  <div class="flex justify-between text-sm text-gray-500">
                    <span>Admin Fee</span>
                    <span class="text-sage font-medium">Free</span>
                  </div>
                </div>
              </div>

              <!-- Grand Total -->
              <div class="bg-ivory/50 rounded-2xl p-6 mb-8 border border-mocha/5">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-sm font-bold text-mocha uppercase tracking-widest">Total Bayar</span>
                  <div class="text-right">
                    <p v-if="appliedPromo" class="text-xs text-gray-400 line-through">{{ formatCurrency(planPrice) }}</p>
                    <span class="text-3xl font-extrabold" :class="finalPrice === 0 ? 'text-green-600' : 'text-mocha'">
                      {{ finalPrice === 0 ? 'GRATIS' : formatCurrency(finalPrice) }}
                    </span>
                  </div>
                </div>
                <p class="text-[10px] text-gray-400 text-right">Termasuk PPN 11% (jika ada)</p>
              </div>

              <!-- Action -->
              <div class="space-y-4">
                <button
                  :disabled="loading"
                  @click="handleCheckout"
                  class="btn-primary w-full !py-5 flex items-center justify-center gap-3 group text-lg shadow-xl shadow-mocha/20"
                >
                  <i v-if="loading" class="fa-solid fa-circle-notch animate-spin"></i>
                  <span v-else>Bayar Sekarang</span>
                  <i v-if="!loading" class="fa-solid fa-arrow-right transition-transform group-hover:translate-x-2"></i>
                </button>

                <!-- Payment Simulation (Dev only) -->
                <button
                  v-if="isDevelopment"
                  @click="simulatePaymentSuccess"
                  class="w-full py-3 border-2 border-dashed border-sage text-sage font-bold rounded-xl hover:bg-sage/5 transition-all text-sm"
                >
                  <i class="fa-solid fa-vial mr-2"></i> Simulasi Bayar Berhasil (Dev Only)
                </button>
                
                <p class="text-[10px] text-center text-gray-400 leading-relaxed px-4">
                  Dengan mengklik tombol di atas, Anda setuju dengan <a href="#" class="underline hover:text-mocha">Syarat & Ketentuan</a> serta <a href="#" class="underline hover:text-mocha">Kebijakan Privasi</a> kami.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Back Link -->
          <div class="mt-8 text-center animate-fade-in delay-300">
             <router-link :to="invitation?.id ? `/invitation/${invitation.id}/edit` : '/create/form'"
                class="text-sm font-bold text-mocha/40 hover:text-mocha transition-all flex items-center justify-center gap-2 group">
                <i class="fa-solid fa-chevron-left text-[10px] transition-transform group-hover:-translate-x-1"></i>
                <span>Kembali Edit Undangan</span>
             </router-link>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMyInvitationBySlug, updateInvitation } from '@/api/invitation'
import { createPayment } from '@/api/payment'
import { validatePromoCode } from '@/api/promo'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const invitation = ref(null)
const loading = ref(false)
const ownershipError = ref('')
const isDevelopment = computed(() => import.meta.env.DEV)

const loadSnapScript = () => {
  return new Promise((resolve, reject) => {
    if (window.snap) return resolve(true)

    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY
    if (!clientKey) {
      return reject('Konfigurasi pembayaran tidak lengkap. Hubungi admin.')
    }

    const isProductionEnv = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION
    const isProduction =
      isProductionEnv === undefined
        ? !clientKey.startsWith('SB-')
        : isProductionEnv === 'true'
    const script = document.createElement('script')
    script.src = isProduction
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', clientKey)
    script.onload = () => resolve(true)
    script.onerror = () => reject('Snap.js gagal dimuat')
    document.body.appendChild(script)
  })
}

const planName = computed(() => invitation.value?.is_premium ? 'Premium Plan' : 'Basic Plan')
const planPrice = computed(() => invitation.value?.price ?? 0)

// Promo Code
const promoCode = ref('')
const promoLoading = ref(false)
const promoError = ref('')
const appliedPromo = ref(null)

const finalPrice = computed(() => appliedPromo.value ? appliedPromo.value.final_price : planPrice.value)

async function applyPromo() {
  const code = promoCode.value.trim().toUpperCase()
  if (!code || !invitation.value?.id) return

  promoLoading.value = true
  promoError.value = ''
  try {
    const res = await validatePromoCode(code, invitation.value.id)
    if (res.success) {
      appliedPromo.value = res.data
      promoCode.value = ''
    } else {
      promoError.value = res.message || 'Kode promo tidak valid'
    }
  } catch (err) {
    promoError.value = err.message || 'Kode promo tidak valid atau sudah tidak berlaku'
  } finally {
    promoLoading.value = false
  }
}

function removePromo() {
  appliedPromo.value = null
  promoError.value = ''
  promoCode.value = ''
}

onMounted(async () => {
  const slug = route.query.slug
  if (!slug) return

  try {
    loading.value = true
    const response = await getMyInvitationBySlug(slug)
    const invData = response.data || response
    
    // Safety Guard: If already published, redirect away
    if (invData.is_published || invData.isPublished) {
      toast.info("Undangan Anda sudah aktif/published.")
      router.push('/invitations')
      return
    }

    invitation.value = invData
  } catch (err) {
    if (err.message?.includes('not the owner') || err.message?.includes('403') || err.message?.includes('Forbidden')) {
      ownershipError.value = 'Undangan ini bukan milik akun Anda yang sedang aktif. Silakan login dengan akun yang benar.'
    } else if (err.message?.includes('401') || err.message?.includes('Unauthorized') || err.message?.includes('token')) {
      ownershipError.value = 'Sesi Anda sudah berakhir. Silakan login ulang untuk melanjutkan pembayaran.'
    } else {
      ownershipError.value = 'Gagal memuat undangan. Silakan coba lagi.'
    }
    console.error('Gagal memuat undangan:', err)
  } finally {
    loading.value = false
  }
})

const simulatePaymentSuccess = async () => {
  if (!invitation.value) return
  loading.value = true
  try {
    // Sending both to be 100% sure about backend compatibility
    await updateInvitation(invitation.value.id, { 
       isPublished: true,
       is_published: true 
    })

    loading.value = false
    toast.success("Simulasi pembayaran berhasil! Undangan Anda kini aktif.")
    router.push('/invitations')
  } catch (err) {
    console.error("Gagal aktivasi simulasi:", err)
    toast.error("Simulasi pembayaran gagal di sisi server")
    loading.value = false
  }
}

const handleCheckout = async () => {
  if (!invitation.value) return

  if (!authStore.user?.email) {
    alert("Mohon login terlebih dahulu")
    return
  }

  loading.value = true
  try {
    const payload = { invitation_id: invitation.value.id }
    if (appliedPromo.value) payload.promo_code = appliedPromo.value.code
    const data = await createPayment(payload)

    if (data.is_free) {
      router.push(`/${invitation.value.slug}`)
      return
    }

    if (data.token) {
      try {
        await loadSnapScript()
        window.snap.pay(data.token, {
          onSuccess: (result) => {
            router.push(buildPaymentResultPath('/payment/finish', result, data.order_id))
          },
          onPending: (result) => {
            router.push(buildPaymentResultPath('/payment/pending', result, data.order_id))
          },
          onError: (result) => {
            console.error('Payment error:', result)
            router.push(buildPaymentResultPath('/payment/error', result, data.order_id))
          },
          onClose: () => {
            console.log('Payment popup closed')
          }
        })
        return
      } catch (err) {
        console.error('Snap error:', err)
        if (data.redirect_url) {
          window.location.href = data.redirect_url
          return
        }
      }
    }

    // Redirect fallback when Snap popup cannot be used
    if (data.redirect_url) {
      window.location.href = data.redirect_url
      return
    }
  } catch (err) {
    console.error("Checkout gagal:", err)
    alert('Terjadi kesalahan pembayaran: ' + (err.response?.data?.message || err.message))
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => {
  if (!date || date === "") return '-'
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

function buildPaymentResultPath(path, result = {}, fallbackOrderId = '') {
  const params = new URLSearchParams()
  const orderId = result?.order_id || fallbackOrderId

  if (orderId) params.set('order_id', orderId)
  if (result?.status_code) params.set('status_code', result.status_code)
  if (result?.transaction_status) params.set('transaction_status', result.transaction_status)

  const query = params.toString()
  return query ? `${path}?${query}` : path
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.card {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent; 
}
::-webkit-scrollbar-thumb {
  background-color: rgba(164, 113, 72, 0.2); /* bg-mocha/20 */
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(164, 113, 72, 0.4); /* bg-mocha/40 */
}
</style>
