<template>
  <section class="space-y-8">
    <div class="space-y-2">
      <label class="block text-mocha font-semibold">Daftar Menu Makanan</label>
      <div v-for="(item, index) in foodList" :key="`food-${index}`" class="flex items-center gap-2">
        <input
          v-model="foodList[index]"
          type="text"
          class="flex-1 rounded-lg border border-gray-300 p-2"
          placeholder="Contoh: Nasi Kebuli"
        />
        <button type="button" class="text-sm text-red-500 hover:underline" @click="emit('remove-food', index)">
          Hapus
        </button>
      </div>
      <button type="button" class="rounded-full bg-mocha px-4 py-2 text-sm text-white hover:bg-mocha/90" @click="emit('add-food')">
        + Tambah Menu
      </button>
    </div>

    <div v-if="sections.gift" class="space-y-6">
      <div class="space-y-2">
        <label class="block text-mocha font-semibold">Alamat Kirim Kado</label>
        <div v-for="(gift, index) in giftAddresses" :key="`gift-${index}`" class="flex items-center gap-2">
          <input
            v-model="giftAddresses[index]"
            type="text"
            class="flex-1 rounded-lg border border-gray-300 p-2"
            placeholder="Contoh: Jl. Melati No. 99"
          />
          <button type="button" class="text-sm text-red-500 hover:underline" @click="emit('remove-gift', index)">
            Hapus
          </button>
        </div>
        <button type="button" class="rounded-full bg-mocha px-4 py-2 text-sm text-white hover:bg-mocha/90" @click="emit('add-gift')">
          + Tambah Alamat Kado
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <div class="space-y-4">
        <label class="block text-mocha font-semibold">QRIS / E-Wallet</label>
        <div v-for="(wallet, index) in formData.eWalletLink" :key="`wallet-${index}`" class="relative space-y-3 rounded-xl border border-gray-300 bg-white p-4">
          <button type="button" class="absolute right-3 top-2 text-xs text-red-500 hover:underline" @click="emit('remove-wallet', index)">
            Hapus
          </button>
          <div>
            <label class="block text-sm font-medium text-mocha">Nama E-Wallet</label>
            <input v-model="wallet.wallet_provider" type="text" class="w-full rounded-md border border-gray-300 p-2" placeholder="Contoh: DANA, OVO" />
          </div>
          <div>
            <label class="block text-sm font-medium text-mocha">Nomor</label>
            <input v-model="wallet.wallet_number" type="text" class="w-full rounded-md border border-gray-300 p-2" placeholder="Contoh: 08123456789" />
          </div>
          <div>
            <label class="block text-sm font-medium text-mocha">Upload Gambar QRIS / Screenshot</label>
            <input type="file" accept="image/*" class="w-full rounded-md border border-gray-300 p-2" @change="emit('wallet-upload', $event, index)" />
            <div v-if="wallet.wallet_image" class="pt-2 relative group inline-block rounded-lg overflow-hidden">
              <img :src="wallet.wallet_image" alt="QRIS" class="h-48 w-full rounded-lg object-contain shadow bg-gray-50" />
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" @click="emit('wallet-crop', index)" class="px-3 py-1.5 bg-white text-dark rounded-lg text-xs font-bold shadow hover:bg-mocha hover:text-white transition-all flex items-center gap-1">
                  <i class="fa-solid fa-crop-simple"></i> Edit Crop
                </button>
                <button type="button" @click="wallet.wallet_image = ''; wallet.wallet_image_file = null" class="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold shadow hover:bg-red-600 transition-all flex items-center gap-1">
                  <i class="fa-solid fa-trash"></i> Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="rounded-full bg-mocha px-4 py-2 text-sm text-white hover:bg-mocha/90" @click="emit('add-wallet')">
          + Tambah QRIS / E-Wallet
        </button>
      </div>

      <div class="space-y-4">
        <label class="block text-mocha font-semibold">Rekening Bank</label>
        <div v-for="(account, index) in formData.bankAccounts" :key="`bank-${index}`" class="relative space-y-3 rounded-xl border border-gray-300 bg-white p-4">
          <button type="button" class="absolute right-3 top-2 text-xs text-red-500 hover:underline" @click="emit('remove-bank', index)">
            Hapus
          </button>
          <div>
            <label class="block text-sm font-medium text-mocha">Nama Bank</label>
            <input v-model="account.bankName" type="text" class="w-full rounded-md border border-gray-300 p-2" placeholder="Contoh: BCA, Mandiri" />
          </div>
          <div>
            <label class="block text-sm font-medium text-mocha">Nomor Rekening</label>
            <input v-model="account.accountNumber" type="text" class="w-full rounded-md border border-gray-300 p-2" placeholder="Contoh: 1234567890" />
          </div>
          <div>
            <label class="block text-sm font-medium text-mocha">Atas Nama</label>
            <input v-model="account.accountName" type="text" class="w-full rounded-md border border-gray-300 p-2" placeholder="Nama pemilik rekening" />
          </div>
          <div>
            <label class="block text-sm font-medium text-mocha">Logo Bank (Opsional)</label>
            <input type="file" accept="image/*" class="w-full rounded-md border border-gray-300 p-2" @change="emit('bank-upload', $event, index)" />
            <div v-if="account.bankLogo" class="pt-2 relative group inline-block rounded-lg overflow-hidden">
              <img :src="account.bankLogo" alt="Bank Logo" class="h-24 w-24 rounded-lg object-contain shadow bg-gray-50" />
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" @click="emit('bank-crop', index)" class="px-2 py-1 bg-white text-dark rounded text-[10px] font-bold shadow hover:bg-mocha hover:text-white transition-all flex items-center gap-1">
                  <i class="fa-solid fa-crop-simple"></i> Crop
                </button>
                <button type="button" @click="account.bankLogo = ''; account.bankLogoFile = null" class="px-2 py-1 bg-red-500 text-white rounded text-[10px] font-bold shadow hover:bg-red-600 transition-all flex items-center gap-1">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="rounded-full bg-mocha px-4 py-2 text-sm text-white hover:bg-mocha/90" @click="emit('add-bank')">
          + Tambah Rekening Bank
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  sections: { type: Object, required: true },
  foodList: { type: Array, required: true },
  giftAddresses: { type: Array, required: true },
  formData: { type: Object, required: true },
})

const emit = defineEmits([
  'add-food',
  'remove-food',
  'add-gift',
  'remove-gift',
  'add-wallet',
  'remove-wallet',
  'wallet-upload',
  'add-bank',
  'remove-bank',
  'bank-upload',
  'wallet-crop',
  'bank-crop',
])

const { sections, foodList, giftAddresses, formData } = toRefs(props)
</script>
