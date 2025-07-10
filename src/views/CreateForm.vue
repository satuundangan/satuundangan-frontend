<template>
  <div class="min-h-screen bg-[#FFFDF8] font-sans px-6 py-10">
    <h1 class="text-3xl font-bold text-mocha text-center mb-10">Langkah 3: Isi Data Undangan</h1>

    <div class="max-w-6xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-300 space-y-8">

      <!-- Data Mempelai -->
      <div class="space-y-6">
        <h2 class="text-xl font-bold text-center text-mocha border-b pb-2">Data Mempelai</h2>
        <div class="mt-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Mempelai Wanita -->
            <div class="space-y-4">
              <h3 class="text-mocha font-semibold">Mempelai Wanita</h3>
              <input v-model="formData.brideName" type="text" placeholder="Nama Lengkap Wanita"
                class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
              <input v-model="formData.brideParents" type="text" placeholder="Nama Orang Tua Wanita"
                class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
            </div>

            <!-- Mempelai Pria -->
            <div class="space-y-4">
              <h3 class="text-mocha font-semibold">Mempelai Pria</h3>
              <input v-model="formData.groomName" type="text" placeholder="Nama Lengkap Pria"
                class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
              <input v-model="formData.groomParents" type="text" placeholder="Nama Orang Tua Pria"
                class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-mocha font-semibold mb-2">Judul Undangan</label>
        <input v-model="formData.title" type="text" placeholder="Contoh: The Wedding of..."
          class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
      </div>

      <!-- Quote Ayat -->
      <div v-if="sections.quote">
        <label class="block text-mocha font-semibold mb-2">Quote Ayat</label>
        <div class="space-y-2">
          <div class="flex gap-4 items-center">
            <label class="flex items-center gap-2">
              <input type="radio" value="default" v-model="formData.quoteType" /> Default
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" value="custom" v-model="formData.quoteType" /> Custom
            </label>
          </div>
          <textarea v-if="formData.quoteType === 'custom'" v-model="formData.quote" rows="3"
            class="w-full p-2 border border-gray-300 rounded-xl resize-none"
            placeholder="Tulis ayat pilihanmu..."></textarea>
          <p v-else class="text-sm text-gray-500 italic">
            “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu...”
          </p>
        </div>
      </div>

      <div class="mb-6" v-if="sections.loveStory">
        <label class="block text-mocha font-semibold mb-4">Love Story</label>

        <div v-if="!loveStories.length" class="text-gray-400 italic text-sm mb-4">Belum ada story yang ditambahkan.
        </div>

        <div v-for="(story, index) in loveStories" :key="index"
          class="mb-4 border border-gray-300 rounded-xl bg-white shadow-sm overflow-hidden transition-all duration-300">

          <!-- Header (Click to toggle) -->
          <div @click="story.isOpen = !story.isOpen"
            class="cursor-pointer flex justify-between items-center px-4 py-3 bg-mocha/10 hover:bg-mocha/20">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-mocha">{{ story.title || 'Story ' + (index + 1) }}</span>
              <span class="text-xs text-gray-400">{{ story.date }}</span>
            </div>
            <div class="text-mocha text-sm">{{ story.isOpen ? '−' : '+' }}</div>
          </div>

          <!-- Collapsible Content -->
          <transition name="fade">
            <div v-show="story.isOpen" class="p-4 space-y-4">

              <!-- Title -->
              <div>
                <label class="block text-sm font-semibold text-mocha mb-1">Judul Cerita</label>
                <input v-model="story.title" type="text"
                  class="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring focus:ring-gray-500"
                  placeholder="Contoh: Awal Bertemu">
              </div>



              <!-- Foto -->
              <div>
                <label class="block text-sm font-semibold text-mocha mb-1">Upload Foto</label>
                <input type="file" @change="handleFileUploadLoveStory($event, index)" accept="image/*"
                  class="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring focus:ring-gray-500">
                <div v-if="story.photo" class="mt-2">
                  <img :src="story.photo" alt="Preview" class="h-48 object-cover rounded-lg shadow-md" />
                </div>
              </div>

              <!-- Deskripsi -->
              <div>
                <label class="block text-sm font-semibold text-mocha mb-1">Deskripsi</label>
                <textarea v-model="story.description" rows="3"
                  class="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring focus:ring-gray-500 resize-none"
                  placeholder="Ceritakan kisahnya..."></textarea>
              </div>
              <!-- Delete -->
              <div class="text-right">
                <button @click="removeLoveStory(index)"
                  class="text-xs px-4 py-2 bg-red-500 rounded-full text-white hover:underline">
                  Hapus
                </button>
              </div>
            </div>
          </transition>
        </div>

        <div class="text mt-4">
          <button @click="addLoveStory"
            class="text-sm text-white bg-mocha hover:bg-mocha/90 px-4 py-2 rounded-full transition-all">
            + Tambah Cerita
          </button>
        </div>
      </div>


      <!-- Foto Mempelai -->
      <div v-if="sections.photoCouple">
        <label class="block text-mocha font-semibold mb-2">Foto Mempelai (Background Awal)</label>
        <input type="file" accept="image/*" @change="handleCouplePhotoUpload"
          class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
        <img v-if="formData.photoCouple" :src="formData.photoCouple" class="mt-2 rounded-xl h-48 object-cover shadow" />
      </div>

      <!-- Musik -->
      <div v-if="sections.music">
        <label class="block text-mocha font-semibold mb-2">Musik Latar</label>
        <select v-model="formData.music" class="w-full p-2 border border-gray-300 rounded-xl bg-white">
          <option disabled value="">Pilih Musik</option>
          <option value="romantic">Romantic Instrumental</option>
          <option value="acoustic">Acoustic Vibes</option>
          <option value="classic">Classic Wedding</option>
          <option value="custom">Custom (Premium Only)</option>
        </select>

        <div v-if="formData.music === 'custom' && isPremiumTemplate" class="mt-3">
          <label class="block text-sm font-semibold text-mocha mb-1">Upload File Musik</label>
          <input type="file" accept="audio/*" @change="handleMusicUpload"
            class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
          <p v-if="formData.musicFileName" class="text-sm text-gray-500 mt-1">{{ formData.musicFileName }}</p>
        </div>
        <p v-if="formData.music === 'custom' && !isPremiumTemplate" class="text-sm text-red-500 mt-2 italic">
          Upload musik hanya tersedia di template Premium
        </p>
      </div>

      <!-- Lokasi -->
      <div v-if="sections.map">
        <label class="block text-mocha font-semibold mb-2">Apakah Acara Digabung?</label>

        <div class="flex gap-4 items-center">
          <label class="flex items-center gap-2">
            <input type="radio" :value="true" v-model="formData.isSingleEvent" /> Ya, satu lokasi
          </label>
          <label class="flex items-center gap-2">
            <input type="radio" :value="false" v-model="formData.isSingleEvent" /> Tidak, Akad & Resepsi dipisah
          </label>
        </div>

        <div v-if="formData.isSingleEvent != null">
          <!-- Gabungan -->
          <div v-if="formData.isSingleEvent">
            <label class="block font-medium mt-4 mb-1">Link Google Maps</label>
            <input v-model="formData.map" type="link" placeholder="https://maps.google.com/..."
              class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
            <!-- Tanggal -->
            <div>
              <label class="block text-sm font-semibold text-mocha mb-1">Tanggal</label>
              <input v-model="formData.date" type="date"
                class="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring focus:ring-gray-500">
            </div>
            <input v-model="formData.mapDesc" type="text" placeholder="Keterangan Lokasi"
              class="w-full p-2 mt-2 border border-gray-300 rounded-xl bg-white" />
          </div>

          <!-- Akad & Resepsi -->
          <div v-else>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block font-medium mt-4 mb-1">Link Maps Akad</label>
                <input v-model="formData.akadMap" type="link" placeholder="https://maps.google.com/..."
                  class="w-full p-2 border border-gray-300 rounded-xl bg-white" />

                <input v-model="formData.akadDesc" type="text" placeholder="Keterangan Lokasi Akad"
                  class="w-full p-2 mt-2 border border-gray-300 rounded-xl bg-white" />
                <label class="block text-sm font-semibold text-mocha  my-1">Tanggal Akad</label>
                <input v-model="formData.akadDateTime" type="date"
                  class="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring focus:ring-gray-500">

              </div>
              <div>
                <label class="block font-medium mt-4 mb-1">Link Maps Resepsi</label>
                <input v-model="formData.resepsiMap" type="link" placeholder="https://maps.google.com/..."
                  class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
                <input v-model="formData.resepsiDesc" type="text" placeholder="Keterangan Lokasi Resepsi"
                  class="w-full p-2 mt-2 border border-gray-300 rounded-xl bg-white" />
                <label class="block text-sm font-semibold text-mocha my-1">Tanggal Resepsi</label>
                <input v-model="formData.resepsiDateTime" type="date"
                  class="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring focus:ring-gray-500">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tanggal & Waktu -->
      <div v-if="sections.countdown">
        <label class="block text-mocha font-semibold mb-2">Tanggal & Waktu Acara</label>
        <input v-model="formData.date" type="datetime-local"
          class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
      </div>

      <!-- Nama Tamu Enkripsi -->
      <div v-if="sections.encryptedGuest">
        <label class="block text-mocha font-semibold mb-2">Nama Tamu Terenkripsi?</label>
        <select v-model="formData.encryptedGuest" class="w-full p-2 border border-gray-300 rounded-xl bg-white">
          <option value="ya">Ya</option>
          <option value="tidak">Tidak</option>
        </select>
      </div>

      <!-- Galeri -->
      <div v-if="sections.gallery">
        <label class="block text-mocha font-semibold mb-2">Galeri Foto Mempelai</label>
        <input type="file" accept="image/*" multiple @change="handleGalleryUpload"
          class="w-full p-2 border border-gray-300 rounded-xl bg-white" />

        <div v-if="formData.gallery?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          <div v-for="(img, i) in formData.gallery" :key="i" class="relative group">
            <img :src="img" class="w-full h-40 object-cover rounded-lg shadow" />
            <button @click="removeGalleryImage(i)"
              class="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition">
              ✕
            </button>
          </div>
        </div>
      </div>


      <!-- DENAH RUANGAN (Upload File) -->
      <div class="mb-6" v-if="sections.denah">
        <label class="block text-mocha font-semibold mb-2">Gambar Denah Ruangan</label>
        <input type="file" accept="image/*" @change="handleDenahUpload"
          class="w-full p-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring focus:ring-gray-500" />
        <div v-if="formData.denah" class="mt-2">
          <img :src="formData.denah" alt="Denah" class="h-48 object-cover rounded-xl shadow-md" />
        </div>
      </div>

      <!-- DAFTAR MENU MAKANAN -->
      <div class="mb-6" v-if="sections.foodList">
        <label class="block text-mocha font-semibold mb-2">Daftar Menu Makanan</label>
        <div v-for="(item, index) in foodList" :key="index" class="flex items-center gap-2 mb-2">
          <input v-model="foodList[index]" type="text"
            class="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-500"
            placeholder="Contoh: Nasi Kebuli" />
          <button @click="removeFood(index)" class="text-red-500 text-sm hover:underline">Hapus</button>
        </div>
        <button @click="addFood"
          class="text-sm text-white bg-mocha hover:bg-mocha/90 px-4 py-2 rounded-full transition-all">
          + Tambah Menu
        </button>
      </div>


      <!-- ALAMAT KADO -->
      <div class="mb-6" v-if="sections.gift">
        <label class="block text-mocha font-semibold mb-2">Alamat Kirim Kado</label>
        <div v-for="(gift, index) in giftAddresses" :key="index" class="flex gap-2 items-center mb-2">
          <input v-model="giftAddresses[index]" type="text"
            class="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-gray-500"
            placeholder="Contoh: Jl. Melati No. 99" />
          <button @click="removeGift(index)" class="text-red-500 text-sm hover:underline">Hapus</button>
        </div>
        <button @click="addGift"
          class="text-sm text-white bg-mocha hover:bg-mocha/90 px-4 py-2 rounded-full transition-all">
          + Tambah Alamat Kado
        </button>
      </div>

      <!-- E-WALLET -->
      <div class="mb-6" v-if="sections.gift">
        <label class="block text-mocha font-semibold mb-2">QRIS / E-Wallet</label>

        <div v-for="(wallet, index) in formData.eWalletLink" :key="index"
          class="mb-4 border border-gray-300 rounded-xl bg-white p-4 relative">

          <button @click="removeWallet(index)"
            class="absolute top-2 right-3 text-xs text-red-500 hover:underline">Hapus</button>

          <!-- Nama Provider -->
          <div class="mb-2">
            <label class="block text-sm font-medium text-mocha mb-1">Nama E-Wallet (Contoh: DANA, OVO, Gopay)</label>
            <input v-model="wallet.wallet_provider" type="text"
              class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500" />
          </div>

          <!-- Nomor atau ID -->
          <div class="mb-2">
            <label class="block text-sm font-medium text-mocha mb-1">Nomor</label>
            <input v-model="wallet.wallet_number" type="text"
              class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500"
              placeholder="Contoh: 08123456789" />
          </div>

          <!-- Screenshot QRIS -->
          <div class="mb-2">
            <label class="block text-sm font-medium text-mocha mb-1">Upload Gambar QRIS / Screenshot</label>
            <input type="file" accept="image/*" @change="handleWalletImageUpload($event, index)"
              class="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring focus:ring-gray-500" />
            <div v-if="wallet.wallet_image" class="mt-3">
              <img :src="wallet.wallet_image" alt="QRIS" class="h-48 w-full object-contain rounded-lg shadow" />
            </div>
          </div>
        </div>

        <button @click="addWallet"
          class="text-sm text-white bg-mocha hover:bg-mocha/90 px-4 py-2 rounded-full transition-all">
          + Tambah QRIS / E-Wallet
        </button>
      </div>

      <!-- Sosial Media -->
      <div class="mb-6">
        <label class="block text-black font-semibold mb-4">Sosial Media Mempelai</label>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Bride -->
          <div>
            <h3 class="font-semibold text-mocha mb-2">Mempelai Wanita</h3>
            <div class="space-y-2">
              <input v-model="formData.sosmedBride.instagram" type="text" placeholder="Instagram"
                class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
              <input v-model="formData.sosmedBride.tiktok" type="text" placeholder="TikTok"
                class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
              <input v-model="formData.sosmedBride.youtube" type="text" placeholder="YouTube"
                class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
              <input v-model="formData.sosmedBride.other" type="text"
                placeholder="Link lainnya (Linktree, Website, dll)"
                class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
            </div>
          </div>

          <!-- Groom -->
          <div>
            <h3 class="font-semibold text-mocha mb-2">Mempelai Pria</h3>
            <div class="space-y-2">
              <input v-model="formData.sosmedGroom.instagram" type="text" placeholder="Instagram"
                class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
              <input v-model="formData.sosmedGroom.tiktok" type="text" placeholder="TikTok"
                class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
              <input v-model="formData.sosmedGroom.youtube" type="text" placeholder="YouTube"
                class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
              <input v-model="formData.sosmedGroom.other" type="text"
                placeholder="Link lainnya (Linktree, Website, dll)"
                class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Live Stream -->
      <div>
        <label class="block text-mocha font-semibold mb-2">Link Live Streaming</label>
        <input v-model="formData.liveLink" type="text" placeholder="https://youtube.com/..."
          class="w-full p-2 border border-gray-300 rounded-xl bg-white" />
      </div>

      <div class="text-center pt-6">
        <button @click="saveAndPreview"
          class="bg-mocha text-white font-semibold py-3 px-8 rounded-full hover:bg-mocha/90 shadow">
          Lihat Preview
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// ==== Router ====
const router = useRouter()

// ==== Global States ====
const isPremiumTemplate = ref(false) // set true jika template premium

// ==== Reactive Data ====
const formData = ref({
  // Data Umum
  title: '',
  brideName: '',
  groomName: '',
  templateName: '',
  isPublished: false,
  quote: '',
  quoteSource: 'bebas',
  quoteType: '',

  // Musik
  music: '',
  musicFile: null,
  musicFileName: '',

  // Foto & Gallery
  photoCouple: '',
  gallery: [],

  // Lokasi & Tanggal
  isSingleEvent: null,
  akadMap: '',
  akadDesc: '',
  akadDateTime: '',
  resepsiMap: '',
  resepsiDesc: '',
  resepsiDateTime: '',
  map: '',
  mapDesc: '',
  date: '',

  // Fitur Tambahan
  denah: '',
  encryptedGuest: 'ya',
  rsvp: 'ya',
  wishes: 'ya',

  // Sosmed & Live
  sosmedBride: {
    instagram: '',
    tiktok: '',
    youtube: '',
    other: ''
  },
  sosmedGroom: {
    instagram: '',
    tiktok: '',
    youtube: '',
    other: ''
  },
  liveStreamingLink: '',

  // Orang Tua
  brideParents: '',
  groomParents: '',

  // Wallet
  eWalletLink: []
})

// ==== Section Checklist ====
const sections = ref({
  quote: 'Quote Ayat',
  loveStory: 'Love Story',
  photoCouple: 'Foto Mempelai',
  music: 'Musik Latar',
  map: 'Google Map',
  rsvp: 'RSVP',
  wishes: 'Ucapan untuk Mempelai',
  likes: 'Like Count',
  countdown: 'Hitung Mundur',
  gallery: 'Gallery',
  denah: 'Denah Ruangan',
  encryptedGuest: 'Enkripsi Nama Tamu',
  foodList: 'List Makanan/Minuman',
  gift: 'Amplop Digital & Alamat Kado',
})

// ==== Nested States ====
const loveStories = ref([])
const foodList = ref([])
const giftAddresses = ref([])

// ==== Love Story ====
const addLoveStory = () => {
  loveStories.value.push({
    title: '',
    date: '',
    photo: '',
    description: '',
    isOpen: true
  })
}

const removeLoveStory = (index) => loveStories.value.splice(index, 1)
const handleFileUploadLoveStory = (event, index) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => loveStories.value[index].photo = reader.result
  reader.readAsDataURL(file)
}

// ==== Gallery ====
const handleGalleryUpload = (e) => {
  const files = Array.from(e.target.files)
  if (!files.length) return
  const readers = files.map(file => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  }))
  Promise.all(readers).then(images => {
    formData.value.gallery.push(...images)
  }).catch(console.error)
}
const removeGalleryImage = (index) => formData.value.gallery.splice(index, 1)

// ==== Mempelai Photo ====
const handleCouplePhotoUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => formData.value.photoCouple = reader.result
  reader.readAsDataURL(file)
}

// ==== Musik ====
const handleMusicUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    formData.value.musicFile = reader.result
    formData.value.musicFileName = file.name
  }
  reader.readAsDataURL(file)
}

// ==== Denah ====
const handleDenahUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => formData.value.denah = reader.result
  reader.readAsDataURL(file)
}

// ==== Food List ====
const addFood = () => foodList.value.push('')
const removeFood = (index) => foodList.value.splice(index, 1)

// ==== Alamat Kado ====
const addGift = () => giftAddresses.value.push('')
const removeGift = (index) => giftAddresses.value.splice(index, 1)

// ==== E-Wallet ====
const addWallet = () => {
  formData.value.eWalletLink.push({
    wallet_provider: '',
    wallet_image: '',
    wallet_number: ''
  })
}
const removeWallet = (index) => formData.value.eWalletLink.splice(index, 1)
const handleWalletImageUpload = (event, index) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => formData.value.eWalletLink[index].wallet_image = reader.result
  reader.readAsDataURL(file)
}

// ==== Generate Payload ====
function generatePayload() {
  const payload = {
    title: formData.value.title,
    slug: formData.value.title.toLowerCase().replace(/\s+/g, '-'),
    brideName: formData.value.brideName,
    groomName: formData.value.groomName,
    templateName: formData.value.templateName,
    isPublished: formData.value.isPublished,
    quoteSource: formData.value.quoteSource,
    quoteText: formData.value.quote,

    loveStory: loveStories.value.map(story => ({
      title: story.title,
      images: story.photo,
      content: story.description,
      date: story.date
    })),

    musicChoice: isPremiumTemplate.value && formData.value.music === 'custom'
      ? formData.value.musicFileName
      : formData.value.music,
    isCustomMusic: isPremiumTemplate.value && formData.value.music === 'custom',
    bridePhotoUrl: formData.value.photoCouple,

    akadLocation: formData.value.isSingleEvent ? null : {
      mapUrl: formData.value.akadMap,
      description: formData.value.akadDesc,
      dateTime: formData.value.akadDateTime
    },
    resepsiLocation: formData.value.isSingleEvent ? null : {
      mapUrl: formData.value.resepsiMap,
      description: formData.value.resepsiDesc,
      dateTime: formData.value.resepsiDateTime
    },
    mergeEvents: formData.value.isSingleEvent,
    encryptedGuestName: formData.value.encryptedGuest === 'ya',
    floorPlanImageUrl: formData.value.denah,

    menu: {
      title: 'Menu Makanan',
      items: foodList.value
    },
    galleryImages: formData.value.gallery,
    giftDeliveryAddress: giftAddresses.value,
    eWalletLink: formData.value.eWalletLink,

    socialMediaBrides: {
      instagram: formData.value.sosmedBride.instagram,
      tiktok: formData.value.sosmedBride.tiktok,
      youtube: formData.value.sosmedBride.youtube,
      lainnya: formData.value.sosmedBride.otherSocial
    },
    socialMediaGroom: {
      instagram: formData.value.sosmedGroom.instagram,
      tiktok: formData.value.sosmedGroom.tiktok,
      youtube: formData.value.sosmedGroom.youtube,
      lainnya: formData.value.sosmedGroom.otherSocial
    },
    parents: {
      brideParents: formData.value.brideParents,
      groomParents: formData.value.groomParents
    },
    liveStreamingLink: formData.value.liveStreamingLink,
    selectedSections: Object.keys(sections.value).filter(k => !!sections.value[k]),
    enableGuestMessage: formData.value.wishes === 'ya'
  }

  localStorage.setItem('finalPayload', JSON.stringify(payload))
  console.log('[Payload Generated]', payload)
}

// ==== Action ====
function saveAndPreview() {
  generatePayload()
  router.push('/preview')
}

// ==== Lifecycle ====
onMounted(() => {
  // const stored = localStorage.getItem('selectedTemplate')
  // if (!stored) return router.push('/create')
  // const selected = JSON.parse(stored)
  // const activeSections = selected.sectionOptions || []
  // sections.value = activeSections.reduce((obj, key) => {
  //   obj[key] = true
  //   return obj
  // }, {})
})
</script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  max-height: 999px;
}
</style>
