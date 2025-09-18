<template>
  <div class="min-h-screen bg-[#FFFDF8] px-6 py-10 font-sans">
    <h1 class="mb-10 text-center text-3xl font-bold text-mocha">Langkah 3: Isi Data Undangan</h1>

    <div class="mx-auto space-y-8 rounded-3xl border border-gray-300 bg-white p-8 shadow-xl">
      <CoupleSection
        :form-data="formData"
        :validation-errors="validationErrors"
        @validate="validateField"
        @upload-bride="handleBridePhotoUpload"
        @upload-groom="handleGroomPhotoUpload"
      />

      <InvitationTitleSection
        :form-data="formData"
        :validation-errors="validationErrors"
        :suggested-title="suggestedTitle"
        @validate="validateField"
      />

      <QuoteSection v-if="sections.quote" :form-data="formData" />

      <LoveStorySection
        v-if="sections.loveStory"
        :love-stories="loveStories"
        :love-story-errors="validationErrors.loveStories"
        @add="addLoveStory"
        @remove="removeLoveStory"
        @upload="handleFileUploadLoveStory"
      />

      <MediaSection
        :form-data="formData"
        :validation-errors="validationErrors"
        :sections="sections"
        :is-premium-template="isPremiumTemplate"
        @upload-couple="handleCouplePhotoUpload"
        @upload-gallery="handleGalleryUpload"
        @remove-gallery="removeGalleryImage"
        @upload-denah="handleDenahUpload"
        @upload-music="handleMusicUpload"
      />

      <EventSection
        :form-data="formData"
        :validation-errors="validationErrors"
        :sections="sections"
        @validate="validateField"
      />

      <GiftSection
        :sections="sections"
        :food-list="foodList"
        :gift-addresses="giftAddresses"
        :form-data="formData"
        @add-food="addFood"
        @remove-food="removeFood"
        @add-gift="addGift"
        @remove-gift="removeGift"
        @add-wallet="addWallet"
        @remove-wallet="removeWallet"
        @wallet-upload="handleWalletImageUpload"
        @add-bank="addBankAccount"
        @remove-bank="removeBankAccount"
        @bank-upload="handleBankLogoUpload"
      />

      <SocialSection :form-data="formData" />

      <div class="pt-6 text-center">
        <button
          @click="saveAndPreview"
          :disabled="isUploading"
          class="rounded-full bg-mocha px-8 py-3 font-semibold text-white shadow transition hover:bg-mocha/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span v-if="!isUploading">Lihat Preview</span>
          <span v-else>Mengupload...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { uploadFileApi } from '@/api/file'
import CoupleSection from './create-form/components/CoupleSection.vue'
import InvitationTitleSection from './create-form/components/InvitationTitleSection.vue'
import QuoteSection from './create-form/components/QuoteSection.vue'
import LoveStorySection from './create-form/components/LoveStorySection.vue'
import MediaSection from './create-form/components/MediaSection.vue'
import EventSection from './create-form/components/EventSection.vue'
import GiftSection from './create-form/components/GiftSection.vue'
import SocialSection from './create-form/components/SocialSection.vue'

const router = useRouter()
const isUploading = ref(false)
const isPremiumTemplate = ref(false)

const formData = ref({
  title: '',
  brideName: '',
  groomName: '',
  templateName: '',
  isPublished: false,
  quote: '',
  quoteSource: 'bebas',
  quoteType: '',
  music: '',
  musicFile: null,
  musicFileName: '',
  bridePhoto: '',
  bridePhotoFile: null,
  groomPhoto: '',
  groomPhotoFile: null,
  photoCouple: '',
  photoCoupleFile: null,
  gallery: [],
  isSingleEvent: null,
  akadMap: '',
  akadDesc: '',
  akadDateTime: '',
  resepsiMap: '',
  resepsiDesc: '',
  resepsiDateTime: '',
  map: '',
  mapDesc: '',
  dateTime: '',
  denah: '',
  denahFile: null,
  encryptedGuest: 'ya',
  rsvp: 'ya',
  wishes: 'ya',
  sosmedBride: {
    instagram: '',
    tiktok: '',
    youtube: '',
    otherSocial: '',
  },
  sosmedGroom: {
    instagram: '',
    tiktok: '',
    youtube: '',
    otherSocial: '',
  },
  liveStreamingLink: '',
  brideParents: '',
  groomParents: '',
  eWalletLink: [],
  bankAccounts: [],
})

const sections = ref({})
const loveStories = ref([])
const foodList = ref([])
const giftAddresses = ref([])
const finalPayload = ref(null)

const validationErrors = ref({
  brideName: '',
  groomName: '',
  brideParents: '',
  groomParents: '',
  bridePhoto: '',
  groomPhoto: '',
  title: '',
  photoCouple: '',
  isSingleEvent: '',
  map: '',
  dateTime: '',
  akadMap: '',
  resepsiMap: '',
  akadDateTime: '',
  resepsiDateTime: '',
  gallery: '',
  denah: '',
  music: '',
  loveStories: [],
})

const suggestedTitle = computed(() => {
  const groom = formData.value.groomName.trim()
  const bride = formData.value.brideName.trim()
  return groom && bride ? `The Wedding of ${groom} & ${bride}` : ''
})

watch(
  () => formData.value.isSingleEvent,
  () => {
    validateField('isSingleEvent')
    if (formData.value.isSingleEvent) {
      validateField('map')
      validateField('dateTime')
    } else if (formData.value.isSingleEvent === false) {
      ;['akadMap', 'akadDateTime', 'resepsiMap', 'resepsiDateTime'].forEach(validateField)
    }
  }
)

watch(
  loveStories,
  () => {
    validateLoveStories()
  },
  { deep: true }
)

function addLoveStory() {
  loveStories.value.push({
    title: '',
    photo: '',
    photoFile: null,
    description: '',
    isOpen: true,
  })
  validateLoveStories()
}

function removeLoveStory(index) {
  loveStories.value.splice(index, 1)
  validateLoveStories()
}

function handleCouplePhotoUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    formData.value.photoCouple = reader.result
    formData.value.photoCoupleFile = file
    validateField('photoCouple')
  }
  reader.readAsDataURL(file)
}

function handleFileUploadLoveStory(event, index) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    loveStories.value[index].photo = reader.result
    loveStories.value[index].photoFile = file
    validateLoveStories()
  }
  reader.readAsDataURL(file)
}

function handleBridePhotoUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    formData.value.bridePhoto = reader.result
    formData.value.bridePhotoFile = file
    validateField('bridePhoto')
  }
  reader.readAsDataURL(file)
}

function handleGroomPhotoUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    formData.value.groomPhoto = reader.result
    formData.value.groomPhotoFile = file
    validateField('groomPhoto')
  }
  reader.readAsDataURL(file)
}

function handleGalleryUpload(event) {
  const files = Array.from(event.target.files || [])
  if (!files.length) return
  files.forEach((file) => {
    const reader = new FileReader()
    reader.onload = () => {
      formData.value.gallery.push({ preview: reader.result, file })
      validateField('gallery')
    }
    reader.readAsDataURL(file)
  })
}

function removeGalleryImage(index) {
  formData.value.gallery.splice(index, 1)
  validateField('gallery')
}

function handleDenahUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    formData.value.denah = reader.result
    formData.value.denahFile = file
    validateField('denah')
  }
  reader.readAsDataURL(file)
}

function handleWalletImageUpload(event, index) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    formData.value.eWalletLink[index].wallet_image = reader.result
    formData.value.eWalletLink[index].wallet_imageFile = file
  }
  reader.readAsDataURL(file)
}

function handleMusicUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    formData.value.musicFile = reader.result
    formData.value.musicFileName = file.name
    validateField('music')
  }
  reader.readAsDataURL(file)
}

const addFood = () => {
  foodList.value.push('')
}
const removeFood = (index) => {
  foodList.value.splice(index, 1)
}
const addGift = () => {
  giftAddresses.value.push('')
}
const removeGift = (index) => {
  giftAddresses.value.splice(index, 1)
}
const addWallet = () => {
  formData.value.eWalletLink.push({ wallet_provider: '', wallet_image: '', wallet_imageFile: null, wallet_number: '' })
}
const removeWallet = (index) => {
  formData.value.eWalletLink.splice(index, 1)
}
function addBankAccount() {
  formData.value.bankAccounts.push({ bankName: '', accountNumber: '', accountName: '', bankLogo: '', bankLogoFile: null })
}
function removeBankAccount(index) {
  formData.value.bankAccounts.splice(index, 1)
}
function handleBankLogoUpload(event, index) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    formData.value.bankAccounts[index].bankLogo = reader.result
    formData.value.bankAccounts[index].bankLogoFile = file
  }
  reader.readAsDataURL(file)
}

function generatePayload() {
  const payload = {
    title: formData.value.title,
    slug: formData.value.title.toLowerCase().replace(/\s+/g, '-'),
    brideName: formData.value.brideName,
    groomName: formData.value.groomName,
    bridePhotoUrl: formData.value.bridePhotoUrl || formData.value.bridePhoto,
    groomPhotoUrl: formData.value.groomPhotoUrl || formData.value.groomPhoto,
    templateName: formData.value.templateName,
    isPublished: formData.value.isPublished,
    quoteSource: formData.value.quoteSource,
    quoteType: formData.value.quoteType,
    quoteText: formData.value.quote,
    dateTime: formData.value.dateTime,
    photoCoupleUrl: formData.value.photoCoupleUrl || formData.value.photoCouple,
    loveStory: loveStories.value.map((story) => ({
      title: story.title,
      images: story.photoUrl || story.photo,
      content: story.description,
      date: story.date,
    })),
    galleryImages: formData.value.gallery.map((img) => img.url || img.preview),
    floorPlanImageUrl: formData.value.denahUrl || formData.value.denah,
    eWalletLink: formData.value.eWalletLink.map((wallet) => ({
      wallet_provider: wallet.wallet_provider,
      wallet_image: wallet.wallet_imageUrl || wallet.wallet_image,
      wallet_number: wallet.wallet_number,
    })),
    bankAccounts: formData.value.bankAccounts.map((account) => ({
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      accountName: account.accountName,
      bankLogo: account.bankLogoUrl || account.bankLogo,
    })),
    musicChoice:
      isPremiumTemplate.value && formData.value.music === 'custom'
        ? formData.value.musicFileName
        : formData.value.music,
    isSingleEvent: formData.value.isSingleEvent,
    isCustomMusic: isPremiumTemplate.value && formData.value.music === 'custom',
    akadLocation: formData.value.isSingleEvent
      ? null
      : {
          mapUrl: formData.value.akadMap,
          description: formData.value.akadDesc,
          dateTime: formData.value.akadDateTime,
        },
    resepsiLocation: formData.value.isSingleEvent
      ? null
      : {
          mapUrl: formData.value.resepsiMap,
          description: formData.value.resepsiDesc,
          dateTime: formData.value.resepsiDateTime,
        },
    mergeEvents: formData.value.isSingleEvent,
    encryptedGuestName: formData.value.encryptedGuest === 'ya',
    menu: {
      title: 'Menu Makanan',
      items: foodList.value,
    },
    giftDeliveryAddress: giftAddresses.value,
    socialMediaBrides: {
      instagram: formData.value.sosmedBride.instagram,
      tiktok: formData.value.sosmedBride.tiktok,
      youtube: formData.value.sosmedBride.youtube,
      lainnya: formData.value.sosmedBride.otherSocial,
    },
    socialMediaGroom: {
      instagram: formData.value.sosmedGroom.instagram,
      tiktok: formData.value.sosmedGroom.tiktok,
      youtube: formData.value.sosmedGroom.youtube,
      lainnya: formData.value.sosmedGroom.otherSocial,
    },
    parents: {
      brideParents: formData.value.brideParents,
      groomParents: formData.value.groomParents,
    },
    liveStreamingLink: formData.value.liveStreamingLink,
    selectedSections: Object.keys(sections.value).filter((key) => !!sections.value[key]),
    enableGuestMessage: formData.value.wishes === 'ya',
  }
  localStorage.setItem('finalPayload', JSON.stringify(payload))
}

function resetValidationErrors() {
  Object.keys(validationErrors.value).forEach((key) => {
    validationErrors.value[key] = key === 'loveStories' ? [] : ''
  })
}

function isValidUrl(value) {
  if (!value) return false
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

function validateField(field) {
  let message = ''
  const data = formData.value
  switch (field) {
    case 'brideName':
      if (!data.brideName?.trim()) message = 'Nama mempelai wanita wajib diisi'
      else if (data.brideName.trim().length < 3) message = 'Minimal 3 karakter'
      break
    case 'groomName':
      if (!data.groomName?.trim()) message = 'Nama mempelai pria wajib diisi'
      else if (data.groomName.trim().length < 3) message = 'Minimal 3 karakter'
      break
    case 'brideParents':
      if (!data.brideParents?.trim()) message = 'Nama orang tua wanita wajib diisi'
      break
    case 'groomParents':
      if (!data.groomParents?.trim()) message = 'Nama orang tua pria wajib diisi'
      break
    case 'bridePhoto':
      if (!data.bridePhoto && !data.bridePhotoFile) message = 'Foto mempelai wanita wajib diupload'
      break
    case 'groomPhoto':
      if (!data.groomPhoto && !data.groomPhotoFile) message = 'Foto mempelai pria wajib diupload'
      break
    case 'title':
      if (!data.title?.trim()) message = 'Judul undangan wajib diisi'
      else if (data.title.trim().length < 5) message = 'Judul minimal 5 karakter'
      break
    case 'photoCouple':
      if (sections.value.photoCouple && !data.photoCouple && !data.photoCoupleFile) message = 'Foto utama pasangan wajib diupload'
      break
    case 'music':
      if (sections.value.music) {
        if (!data.music) message = 'Pilih musik latar'
        else if (data.music === 'custom' && !isPremiumTemplate.value) message = 'Musik custom hanya tersedia di template premium'
      }
      break
    case 'isSingleEvent':
      if (data.isSingleEvent !== true && data.isSingleEvent !== false) message = 'Pilih jenis acara (digabung atau dipisah)'
      break
    case 'map':
      if (data.isSingleEvent) {
        if (!data.map?.trim()) message = 'Link Google Maps wajib diisi'
        else if (!isValidUrl(data.map)) message = 'Link Google Maps harus diawali http/https'
      }
      break
    case 'dateTime':
      if (data.isSingleEvent) {
        if (!data.dateTime) message = 'Tanggal dan waktu acara wajib diisi'
        else if (Number.isNaN(new Date(data.dateTime).getTime())) message = 'Format tanggal tidak valid'
      }
      break
    case 'akadMap':
      if (data.isSingleEvent === false) {
        if (!data.akadMap?.trim()) message = 'Link Google Maps akad wajib diisi'
        else if (!isValidUrl(data.akadMap)) message = 'Link Google Maps akad harus diawali http/https'
      }
      break
    case 'resepsiMap':
      if (data.isSingleEvent === false) {
        if (!data.resepsiMap?.trim()) message = 'Link Google Maps resepsi wajib diisi'
        else if (!isValidUrl(data.resepsiMap)) message = 'Link Google Maps resepsi harus diawali http/https'
      }
      break
    case 'akadDateTime':
      if (data.isSingleEvent === false) {
        if (!data.akadDateTime) message = 'Tanggal dan waktu akad wajib diisi'
        else if (Number.isNaN(new Date(data.akadDateTime).getTime())) message = 'Format tanggal akad tidak valid'
      }
      break
    case 'resepsiDateTime':
      if (data.isSingleEvent === false) {
        if (!data.resepsiDateTime) message = 'Tanggal dan waktu resepsi wajib diisi'
        else if (Number.isNaN(new Date(data.resepsiDateTime).getTime())) message = 'Format tanggal resepsi tidak valid'
      }
      break
    case 'gallery':
      if (!data.gallery.length) message = 'Minimal upload 1 foto untuk galeri'
      break
    case 'denah':
      if (sections.value.denah && !data.denah && !data.denahFile) message = 'Denah ruangan wajib diupload'
      break
    default:
      break
  }
  validationErrors.value[field] = message
  return !message
}

function validateLoveStories() {
  if (!sections.value.loveStory || loveStories.value.length === 0) {
    validationErrors.value.loveStories = []
    return true
  }
  const errors = loveStories.value.map((story) => ({
    title: story.title?.trim() ? '' : 'Judul cerita wajib diisi',
    description: story.description?.trim() ? '' : 'Deskripsi cerita wajib diisi',
    photo: story.photo ? '' : 'Foto cerita wajib diupload',
  }))
  validationErrors.value.loveStories = errors
  return errors.every((item) => !item.title && !item.description && !item.photo)
}

function validateForm() {
  resetValidationErrors()
  const fieldsToValidate = [
    'brideName',
    'groomName',
    'brideParents',
    'groomParents',
    'bridePhoto',
    'groomPhoto',
    'title',
    'photoCouple',
    'isSingleEvent',
    'map',
    'dateTime',
    'akadMap',
    'akadDateTime',
    'resepsiMap',
    'resepsiDateTime',
    'gallery',
    'denah',
    'music',
  ]
  const results = fieldsToValidate.map((field) => validateField(field))
  const loveStoryValid = validateLoveStories()
  return results.every(Boolean) && loveStoryValid
}

function findFirstErrorField() {
  const order = [
    'brideName',
    'brideParents',
    'bridePhoto',
    'groomName',
    'groomParents',
    'groomPhoto',
    'title',
    'photoCouple',
    'isSingleEvent',
    'map',
    'dateTime',
    'akadMap',
    'akadDateTime',
    'resepsiMap',
    'resepsiDateTime',
    'gallery',
    'denah',
    'music',
  ]
  const sectionMap = {
    brideParents: 'brideName',
    bridePhoto: 'brideName',
    groomParents: 'brideName',
    groomPhoto: 'brideName',
  }
  for (const key of order) {
    if (validationErrors.value[key]) {
      return sectionMap[key] || key
    }
  }
  if (validationErrors.value.loveStories.some((story) => story.title || story.description || story.photo)) {
    return 'loveStories'
  }
  return ''
}

async function saveAndPreview() {
  if (!validateForm()) {
    const target = findFirstErrorField()
    if (target) {
      const element = document.querySelector(`[data-field="${target}"]`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
    return
  }

  isUploading.value = true
  try {
    await uploadAllFiles()
    generatePayload()
    router.push('/preview')
  } catch (error) {
    console.error(error)
    alert('Upload gagal, silakan coba lagi')
  } finally {
    isUploading.value = false
  }
}

async function uploadAllFiles() {
  const uploads = []
  if (formData.value.bridePhotoFile) {
    uploads.push(
      uploadFileToBackend(formData.value.bridePhotoFile).then((url) => {
        formData.value.bridePhotoUrl = url
      })
    )
  }
  if (formData.value.groomPhotoFile) {
    uploads.push(
      uploadFileToBackend(formData.value.groomPhotoFile).then((url) => {
        formData.value.groomPhotoUrl = url
      })
    )
  }
  if (formData.value.photoCoupleFile) {
    uploads.push(
      uploadFileToBackend(formData.value.photoCoupleFile).then((url) => {
        formData.value.photoCoupleUrl = url
      })
    )
  }
  loveStories.value.forEach((story, index) => {
    if (story.photoFile) {
      uploads.push(
        uploadFileToBackend(story.photoFile).then((url) => {
          loveStories.value[index].photoUrl = url
        })
      )
    }
  })
  formData.value.gallery.forEach((image, index) => {
    if (image.file) {
      uploads.push(
        uploadFileToBackend(image.file).then((url) => {
          formData.value.gallery[index].url = url
        })
      )
    }
  })
  if (formData.value.denahFile) {
    uploads.push(
      uploadFileToBackend(formData.value.denahFile).then((url) => {
        formData.value.denahUrl = url
      })
    )
  }
  formData.value.eWalletLink.forEach((wallet, index) => {
    if (wallet.wallet_imageFile) {
      uploads.push(
        uploadFileToBackend(wallet.wallet_imageFile).then((url) => {
          formData.value.eWalletLink[index].wallet_imageUrl = url
        })
      )
    }
  })
  formData.value.bankAccounts.forEach((account, index) => {
    if (account.bankLogoFile) {
      uploads.push(
        uploadFileToBackend(account.bankLogoFile).then((url) => {
          formData.value.bankAccounts[index].bankLogoUrl = url
        })
      )
    }
  })
  await Promise.all(uploads)
}

async function uploadFileToBackend(file) {
  const data = await uploadFileApi(file)
  if (!data.fileUrl) throw new Error('Upload failed')
  return data.fileUrl
}

onMounted(() => {
  const stored = localStorage.getItem('selectedSections')
  const finalPayloadStored = localStorage.getItem('finalPayload')
  if (!stored) {
    router.push('/create')
    return
  }
  finalPayload.value = finalPayloadStored ? JSON.parse(finalPayloadStored) : null
  if (finalPayload.value) {
    mapPayloadToFormData(finalPayload.value)
  }
  const activeSections = JSON.parse(stored) || []
  sections.value = activeSections.reduce((acc, key) => {
    acc[key] = true
    return acc
  }, {})
})

function mapPayloadToFormData(payload) {
  formData.value.title = payload.title || ''
  formData.value.brideName = payload.brideName || ''
  formData.value.groomName = payload.groomName || ''
  formData.value.bridePhoto = payload.bridePhotoUrl || ''
  formData.value.groomPhoto = payload.groomPhotoUrl || ''
  formData.value.templateName = payload.templateName || ''
  formData.value.isPublished = payload.isPublished || false
  formData.value.quote = payload.quoteText || ''
  formData.value.quoteSource = payload.quoteSource || 'bebas'
  formData.value.quoteType = payload.quoteType || ''
  formData.value.dateTime = payload.dateTime || ''
  formData.value.music = payload.isCustomMusic ? 'custom' : payload.musicChoice || ''
  formData.value.musicFileName = payload.isCustomMusic ? payload.musicChoice : ''
  formData.value.photoCouple = payload.photoCoupleUrl || ''
  formData.value.gallery = payload.galleryImages ? payload.galleryImages.map((img) => ({ preview: img })) : []
  formData.value.isSingleEvent = payload.mergeEvents ?? null
  formData.value.akadMap = payload.akadLocation?.mapUrl || ''
  formData.value.akadDesc = payload.akadLocation?.description || ''
  formData.value.akadDateTime = payload.akadLocation?.dateTime || ''
  formData.value.resepsiMap = payload.resepsiLocation?.mapUrl || ''
  formData.value.resepsiDesc = payload.resepsiLocation?.description || ''
  formData.value.resepsiDateTime = payload.resepsiLocation?.dateTime || ''
  formData.value.map = payload.mergeEvents ? payload.resepsiLocation?.mapUrl || payload.akadLocation?.mapUrl || '' : ''
  formData.value.mapDesc = payload.mergeEvents ? payload.resepsiLocation?.description || payload.akadLocation?.description || '' : ''
  formData.value.denah = payload.floorPlanImageUrl || ''
  formData.value.encryptedGuest = payload.encryptedGuestName ? 'ya' : 'tidak'
  formData.value.wishes = payload.enableGuestMessage ? 'ya' : 'tidak'
  formData.value.sosmedBride = {
    instagram: payload.socialMediaBrides?.instagram || '',
    tiktok: payload.socialMediaBrides?.tiktok || '',
    youtube: payload.socialMediaBrides?.youtube || '',
    otherSocial: payload.socialMediaBrides?.lainnya || '',
  }
  formData.value.sosmedGroom = {
    instagram: payload.socialMediaGroom?.instagram || '',
    tiktok: payload.socialMediaGroom?.tiktok || '',
    youtube: payload.socialMediaGroom?.youtube || '',
    otherSocial: payload.socialMediaGroom?.lainnya || '',
  }
  formData.value.liveStreamingLink = payload.liveStreamingLink || ''
  formData.value.brideParents = payload.parents?.brideParents || ''
  formData.value.groomParents = payload.parents?.groomParents || ''
  formData.value.eWalletLink = payload.eWalletLink
    ? payload.eWalletLink.map((wallet) => ({
        wallet_provider: wallet.wallet_provider || '',
        wallet_image: wallet.wallet_image || '',
        wallet_number: wallet.wallet_number || '',
        wallet_imageFile: null,
      }))
    : []
  formData.value.bankAccounts = payload.bankAccounts
    ? payload.bankAccounts.map((account) => ({
        bankName: account.bankName || '',
        accountNumber: account.accountNumber || '',
        accountName: account.accountName || '',
        bankLogo: account.bankLogo || '',
        bankLogoFile: null,
      }))
    : []
  if (payload.loveStory) {
    loveStories.value = payload.loveStory.map((story) => ({
      title: story.title || '',
      photo: story.images || '',
      photoFile: null,
      description: story.content || '',
      date: story.date || '',
      isOpen: false,
    }))
  }
  if (payload.giftDeliveryAddress) {
    giftAddresses.value = payload.giftDeliveryAddress
  }
  if (payload.menu?.items) {
    foodList.value = payload.menu.items
  }
}
</script>
