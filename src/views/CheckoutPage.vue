<template>
  <div class="min-h-screen bg-ivory px-4 py-10">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-mocha">Checkout Undangan</h1>
        <p class="text-gray-600 text-sm">Cek ulang detail undangan sebelum dipublish!</p>
      </div>

      <!-- Checkout Card -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 space-y-6">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Thumbnail -->
          <img :src="invitation?.photoCouple || '/default-thumbnail.jpg'"
            class="w-full md:w-48 h-48 object-cover rounded-xl shadow" />

          <!-- Detail -->
          <div class="flex-1 space-y-2">
            <h2 class="text-xl font-semibold text-mocha">{{ invitation?.title || 'Judul Undangan' }}</h2>
            <p class="text-gray-700">{{ invitation?.coupleName || '-' }}</p>
            <p class="text-gray-500 text-sm">{{ formatDate(invitation?.date) }}</p>

            <!-- Slug Preview -->
            <p class="text-sm text-gray-500">
              Link Undangan:
              <span class="text-blue-600 underline">{{ `undangdong.com/${invitation?.slug || 'nama-kamu'}` }}</span>
            </p>

            <!-- Template Badge -->
            <div class="mt-2">
              <span class="inline-block px-3 py-1 text-xs rounded-full cursor-help"
                :class="invitation?.isPremium ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-700'" :title="invitation?.isPremium
                  ? 'Template Premium memiliki desain eksklusif dan fitur lengkap.'
                  : 'Template gratis dengan fitur standar.'">
                {{ invitation?.isPremium ? 'Template Premium' : 'Template Gratis' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Harga -->
        <div class="flex justify-between items-center border-t pt-4">
          <p class="text-gray-600">Total Pembayaran</p>
          <p class="text-xl font-bold text-mocha">
            {{ invitation?.isPremium ? 'Rp 49.000' : 'Gratis' }}
          </p>
        </div>

        <!-- Metode Pembayaran -->
        <div v-if="invitation?.isPremium">
          <label class="block text-sm text-mocha font-semibold mb-1">Metode Pembayaran</label>
          <select v-model="paymentMethod" class="w-full p-3 border border-gray-300 rounded-xl bg-white">
            <option disabled value="">Pilih Metode</option>
            <option value="qris">📱 QRIS</option>
            <option value="gopay">💙 GoPay</option>
            <option value="dana">🔵 DANA</option>
            <option value="manual">🏦 Transfer Manual</option>
          </select>

          <!-- Note -->
          <p class="text-xs text-gray-400 mt-2" v-if="paymentMethod === 'manual'">
            Setelah klik, kamu akan diarahkan ke halaman instruksi transfer manual.
          </p>
        </div>

        <!-- CTA -->
        <div class="pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <router-link :to="`/edit/${invitation?.id}`" class="text-sm text-gray-500 hover:underline">
            ← Kembali Edit Undangan
          </router-link>
          <button :disabled="loading" @click="handleCheckout"
            class="bg-mocha text-white font-semibold py-3 px-6 rounded-full hover:bg-mocha/90 transition-all w-full md:w-auto disabled:opacity-50">
            {{ loading ? 'Memproses...' : (invitation?.isPremium ? 'Bayar & Publish' : 'Publish Undangan') }}
          </button>
        </div>
      </div>

      <!-- Footer Hint -->
      <div class="text-center text-sm text-gray-400 mt-10">
        Setelah publish, undanganmu langsung bisa dibagikan 🎉
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const invitation = ref({
  id: '123',
  title: 'Undangan Pernikahan Fauzan & Ayu',
  coupleName: 'Fauzan & Ayu',
  date: '2025-07-20',
  slug: 'fauzan-ayu',
  photoCouple: '/img/foto-couple.jpg',
  isPremium: true
})

const paymentMethod = ref('')
const loading = ref(false)

onMounted(() => {
  // Kalau belum login / invitation kosong, redirect dulu
  if (!invitation.value?.id) {
    router.push('/login')
  }
})

const handleCheckout = () => {
  if (invitation.value.isPremium && !paymentMethod.value) {
    alert('Silakan pilih metode pembayaran!')
    return
  }

  loading.value = true
  setTimeout(() => {
    loading.value = false
    if (invitation.value.isPremium) {
      router.push(`/payment/${invitation.value.id}?method=${paymentMethod.value}`)
    } else {
      router.push(`/success/${invitation.value.id}`)
    }
  }, 1000)
}

const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
