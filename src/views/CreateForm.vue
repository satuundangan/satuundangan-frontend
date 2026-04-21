<template>
   <div class="min-h-screen bg-gray-50 font-sans pt-6 md:pt-12 pb-24 px-4 md:px-8">
      <div class="max-w-5xl mx-auto">

         <!-- Top Navigation -->
         <div class="flex items-center justify-between mb-8">
            <button @click="router.back()" class="flex items-center gap-2 text-gray-500 hover:text-dark transition-colors font-bold text-sm">
               <i class="fa-solid fa-chevron-left text-xs"></i> 
               <span>Kembali</span>
            </button>
            
            <div class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
               <span class="w-2 h-2 rounded-full bg-mocha animate-pulse"></span>
               <span class="text-[10px] font-bold text-dark uppercase tracking-widest">Langkah 2/2</span>
            </div>

            <div class="w-16 hidden md:block"></div>
         </div>

         <div class="text-center mb-10 md:mb-12">
            <h1 class="text-2xl md:text-4xl font-serif font-bold text-dark mb-3">Lengkapi Data Undangan</h1>
            <p class="text-muted text-sm md:text-lg">Isi detail acaramu dengan lengkap agar undangan terlihat sempurna.</p>
         </div>

         <div class="bg-white rounded-[2.5rem] shadow-xl shadow-mocha/5 border border-gray-100 overflow-hidden relative">
            <!-- Smooth Progress Bar -->
            <div class="h-1.5 bg-gray-50 w-full">
               <div class="h-full bg-mocha transition-all duration-700 ease-out" :style="{ width: progressPercentage + '%' }">
               </div>
            </div>

            <div class="p-6 md:p-12 space-y-12 md:space-y-16">

               <!-- Section: Data Mempelai -->
               <section class="space-y-6">
                  <div class="flex items-center gap-4 pb-4 border-b border-gray-50">
                     <div class="w-12 h-12 bg-mocha/10 rounded-2xl flex items-center justify-center text-mocha text-2xl">
                        <i class="fa-solid fa-heart"></i>
                     </div>
                     <div>
                        <h2 class="text-xl font-bold text-dark">Data Mempelai</h2>
                        <p class="text-[10px] text-muted uppercase tracking-widest font-bold mt-1">Informasi Pasangan</p>
                     </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                     <!-- Wanita -->
                     <div class="space-y-6">
                        <h3 class="font-serif font-bold text-lg text-mocha flex items-center gap-2">
                           <span class="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-sm border border-mocha/10">👰‍♀️</span> 
                           Mempelai Wanita
                        </h3>

                        <div class="space-y-5">
                           <div data-field="brideName">
                              <label class="form-label">Nama Lengkap <span class="text-red-500">*</span></label>
                              <input v-model="formData.brideName" @input="validateField('brideName')" type="text"
                                 placeholder="Putri Diana" class="form-input"
                                 :class="{ 'border-red-500 bg-red-50/30': validationErrors.brideName }" />
                              <p v-if="validationErrors.brideName" class="form-error">{{ validationErrors.brideName }}</p>
                           </div>

                           <div data-field="brideParents">
                              <label class="form-label">Nama Orang Tua</label>
                              <input v-model="formData.brideParents" type="text"
                                 placeholder="Bpk. ... & Ibu ..." class="form-input" />
                           </div>

                           <div data-field="bridePhoto">
                              <label class="form-label">Foto Mempelai Wanita <span class="text-red-500">*</span></label>
                              <div class="relative group max-w-[200px]">
                                 <input type="file" accept="image/*" @change="handleBridePhotoUpload" class="hidden" id="bridePhoto" />
                                 <label for="bridePhoto"
                                    class="flex flex-col items-center justify-center w-full aspect-[3/4] border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:border-mocha hover:bg-mocha/5 transition-all overflow-hidden relative bg-gray-50">
                                    <img v-if="formData.bridePhoto" :src="formData.bridePhoto" class="w-full h-full object-cover" />
                                    <div v-else class="flex flex-col items-center text-gray-400">
                                       <i class="fa-solid fa-camera text-2xl mb-2"></i>
                                       <span class="text-[10px] font-bold uppercase tracking-widest">Pilih Foto</span>
                                    </div>
                                    <div v-if="formData.bridePhoto" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                       <span class="text-white text-[10px] font-bold uppercase tracking-widest">Ganti</span>
                                    </div>
                                 </label>
                              </div>
                              <p v-if="validationErrors.bridePhoto" class="form-error">{{ validationErrors.bridePhoto }}</p>
                           </div>
                        </div>
                     </div>

                     <!-- Pria -->
                     <div class="space-y-6">
                        <h3 class="font-serif font-bold text-lg text-mocha flex items-center gap-2">
                           <span class="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-sm border border-mocha/10">🤵‍♂️</span> 
                           Mempelai Pria
                        </h3>

                        <div class="space-y-5">
                           <div data-field="groomName">
                              <label class="form-label">Nama Lengkap <span class="text-red-500">*</span></label>
                              <input v-model="formData.groomName" @input="validateField('groomName')" type="text"
                                 placeholder="Pangeran Charles" class="form-input"
                                 :class="{ 'border-red-500 bg-red-50/30': validationErrors.groomName }" />
                              <p v-if="validationErrors.groomName" class="form-error">{{ validationErrors.groomName }}</p>
                           </div>

                           <div data-field="groomParents">
                              <label class="form-label">Nama Orang Tua</label>
                              <input v-model="formData.groomParents" type="text"
                                 placeholder="Bpk. ... & Ibu ..." class="form-input" />
                           </div>

                           <div data-field="groomPhoto">
                              <label class="form-label">Foto Mempelai Pria <span class="text-red-500">*</span></label>
                              <div class="relative group max-w-[200px]">
                                 <input type="file" accept="image/*" @change="handleGroomPhotoUpload" class="hidden" id="groomPhoto" />
                                 <label for="groomPhoto"
                                    class="flex flex-col items-center justify-center w-full aspect-[3/4] border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:border-mocha hover:bg-mocha/5 transition-all overflow-hidden relative bg-gray-50">
                                    <img v-if="formData.groomPhoto" :src="formData.groomPhoto" class="w-full h-full object-cover" />
                                    <div v-else class="flex flex-col items-center text-gray-400">
                                       <i class="fa-solid fa-camera text-2xl mb-2"></i>
                                       <span class="text-[10px] font-bold uppercase tracking-widest">Pilih Foto</span>
                                    </div>
                                    <div v-if="formData.groomPhoto" class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                       <span class="text-white text-[10px] font-bold uppercase tracking-widest">Ganti</span>
                                    </div>
                                 </label>
                              </div>
                              <p v-if="validationErrors.groomPhoto" class="form-error">{{ validationErrors.groomPhoto }}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div data-field="title" class="pt-6 border-t border-gray-50">
                     <label class="form-label">Judul Undangan (Slug) <span class="text-red-500">*</span></label>
                     <div class="flex flex-col sm:flex-row gap-3">
                        <div class="flex-1">
                           <input v-model="formData.title" @input="validateField('title')" type="text"
                              placeholder="Contoh: The Wedding of Putri & Pangeran" class="form-input font-bold"
                              :class="{ 'border-red-500': validationErrors.title }" />
                           <p v-if="validationErrors.title" class="form-error">{{ validationErrors.title }}</p>
                        </div>
                        <button v-if="suggestedTitle && formData.title !== suggestedTitle"
                           @click="formData.title = suggestedTitle"
                           class="px-4 py-3 bg-mocha/5 text-mocha rounded-xl font-bold text-xs hover:bg-mocha hover:text-white transition-all whitespace-nowrap">
                           Gunakan Saran
                        </button>
                     </div>
                  </div>
               </section>

               <!-- Section: Quote -->
               <QuoteSection v-if="sections.quote" :formData="formData" :defaultQuote="DEFAULT_QUOTE" />

               <!-- Section: Acara -->
               <section class="space-y-8">
                  <div class="flex items-center gap-4 pb-4 border-b border-gray-50">
                     <div class="w-12 h-12 bg-mocha/10 rounded-2xl flex items-center justify-center text-mocha text-2xl">
                        <i class="fa-solid fa-calendar-day"></i>
                     </div>
                     <div>
                        <h2 class="text-xl font-bold text-dark">Detail Acara</h2>
                        <p class="text-[10px] text-muted uppercase tracking-widest font-bold mt-1">Waktu & Lokasi</p>
                     </div>
                  </div>

                  <div data-field="isSingleEvent">
                     <label class="form-label mb-4 block">Format Acara <span class="text-red-500">*</span></label>
                     <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label class="flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer hover:bg-white hover:shadow-md transition-all group"
                           :class="formData.isSingleEvent === true ? 'border-mocha bg-mocha/5' : 'border-gray-50 bg-gray-50/50'">
                           <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                                :class="formData.isSingleEvent === true ? 'border-mocha bg-mocha text-white scale-110' : 'border-gray-300 bg-white group-hover:border-mocha/30'">
                              <i class="fa-solid fa-check text-[10px]" v-if="formData.isSingleEvent === true"></i>
                           </div>
                           <input type="radio" :value="true" v-model="formData.isSingleEvent" class="hidden" />
                           <div>
                              <span class="font-bold block text-dark text-sm">Satu Lokasi</span>
                              <span class="text-[10px] text-muted font-medium">Akad & Resepsi digabung</span>
                           </div>
                        </label>
                        <label class="flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer hover:bg-white hover:shadow-md transition-all group"
                           :class="formData.isSingleEvent === false ? 'border-mocha bg-mocha/5' : 'border-gray-50 bg-gray-50/50'">
                           <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                                :class="formData.isSingleEvent === false ? 'border-mocha bg-mocha text-white scale-110' : 'border-gray-300 bg-white group-hover:border-mocha/30'">
                              <i class="fa-solid fa-check text-[10px]" v-if="formData.isSingleEvent === false"></i>
                           </div>
                           <input type="radio" :value="false" v-model="formData.isSingleEvent" class="hidden" />
                           <div>
                              <span class="font-bold block text-dark text-sm">Acara Terpisah</span>
                              <span class="text-[10px] text-muted font-medium">Akad & Resepsi beda tempat</span>
                           </div>
                        </label>
                     </div>
                     <p v-if="validationErrors.isSingleEvent" class="form-error mt-2">{{ validationErrors.isSingleEvent }}</p>
                  </div>

                  <!-- Event Forms -->
                  <div v-if="formData.isSingleEvent" class="bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-100 space-y-6 animate-fade-in shadow-inner">
                     <div class="grid md:grid-cols-2 gap-6">
                        <div data-field="dateTime">
                           <label class="form-label">Tanggal & Waktu <span class="text-red-500">*</span></label>
                           <input v-model="formData.dateTime" type="datetime-local" class="form-input"
                              :class="{ 'border-red-500': validationErrors.dateTime }" />
                           <p v-if="validationErrors.dateTime" class="form-error">{{ validationErrors.dateTime }}</p>
                        </div>
                        <div data-field="map">
                           <label class="form-label">Link Google Maps <span class="text-red-500">*</span></label>
                           <input v-model="formData.map" @input="validateField('map')" type="text"
                              placeholder="https://maps.app.goo.gl/..." class="form-input" />
                           <p v-if="validationErrors.map" class="form-error">{{ validationErrors.map }}</p>
                        </div>
                     </div>
                     <div>
                        <label class="form-label">Alamat Lengkap Lokasi</label>
                        <textarea v-model="formData.mapDesc" placeholder="Gedung Serbaguna, Jl. Mawar No. 1" class="form-input h-24 resize-none"></textarea>
                     </div>
                  </div>

                  <div v-if="formData.isSingleEvent === false" class="grid md:grid-cols-2 gap-8 animate-fade-in">
                     <div class="bg-white p-6 md:p-8 rounded-3xl border-2 border-gray-50 shadow-sm relative group hover:border-mocha/20 transition-all">
                        <div class="absolute -top-3 left-6 px-4 py-1 bg-sage text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">Akad Nikah</div>
                        <div class="space-y-5 mt-4">
                           <div data-field="akadDateTime">
                              <label class="form-label">Waktu Akad <span class="text-red-500">*</span></label>
                              <input v-model="formData.akadDateTime" type="datetime-local" class="form-input" />
                           </div>
                           <div data-field="akadMap">
                              <label class="form-label">Maps Akad <span class="text-red-500">*</span></label>
                              <input v-model="formData.akadMap" type="text" class="form-input" />
                           </div>
                           <div>
                              <label class="form-label">Lokasi Akad</label>
                              <input v-model="formData.akadDesc" type="text" class="form-input" />
                           </div>
                        </div>
                     </div>
                     <div class="bg-white p-6 md:p-8 rounded-3xl border-2 border-gray-50 shadow-sm relative group hover:border-mocha/20 transition-all">
                        <div class="absolute -top-3 left-6 px-4 py-1 bg-mocha text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">Resepsi</div>
                        <div class="space-y-5 mt-4">
                           <div data-field="resepsiDateTime">
                              <label class="form-label">Waktu Resepsi <span class="text-red-500">*</span></label>
                              <input v-model="formData.resepsiDateTime" type="datetime-local" class="form-input" />
                           </div>
                           <div data-field="resepsiMap">
                              <label class="form-label">Maps Resepsi <span class="text-red-500">*</span></label>
                              <input v-model="formData.resepsiMap" type="text" class="form-input" />
                           </div>
                           <div>
                              <label class="form-label">Lokasi Resepsi</label>
                              <input v-model="formData.resepsiDesc" type="text" class="form-input" />
                           </div>
                        </div>
                     </div>
                  </div>
               </section>

               <!-- Section: Media -->
               <section class="space-y-8">
                  <div class="flex items-center gap-4 pb-4 border-b border-gray-50">
                     <div class="w-12 h-12 bg-mocha/10 rounded-2xl flex items-center justify-center text-mocha text-2xl">
                        <i class="fa-solid fa-images"></i>
                     </div>
                     <div>
                        <h2 class="text-xl font-bold text-dark">Galeri & Media</h2>
                        <p class="text-[10px] text-muted uppercase tracking-widest font-bold mt-1">Foto & Video</p>
                     </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div data-field="photoCouple">
                        <label class="form-label">Foto Sampul Utama (Hero) <span class="text-red-500">*</span></label>
                        <div class="flex gap-4 items-end">
                           <label class="w-32 h-32 flex-shrink-0 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-mocha hover:bg-mocha/5 bg-gray-50 group">
                              <input type="file" accept="image/*" @change="handleCouplePhotoUpload" class="hidden" />
                              <i class="fa-solid fa-plus text-gray-300 group-hover:text-mocha"></i>
                           </label>
                           <div v-if="formData.photoCouple" class="relative group">
                              <img :src="formData.photoCouple" class="w-32 h-40 object-cover rounded-2xl shadow-xl ring-4 ring-white" />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div data-field="gallery" class="pt-4">
                     <label class="form-label">Galeri Foto (Maksimal 10)</label>
                     <div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
                        <label class="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-mocha hover:bg-mocha/5 bg-gray-50 transition-all group">
                           <input type="file" accept="image/*" multiple @change="handleGalleryUpload" class="hidden" />
                           <i class="fa-solid fa-plus text-gray-300 group-hover:text-mocha"></i>
                        </label>
                        <div v-for="(img, i) in formData.gallery" :key="i" class="aspect-square relative group">
                           <img :src="img.preview" class="w-full h-full object-cover rounded-2xl" />
                           <button @click="removeGalleryImage(i)" class="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">×</button>
                        </div>
                     </div>
                  </div>
               </section>

               <!-- Footer Sticky UI -->
               <div class="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40 md:static md:border-none md:p-0 md:bg-transparent flex justify-between items-center">
                  <button @click="router.back()" class="text-gray-400 font-bold hover:text-dark px-6 py-3 text-xs uppercase tracking-widest">
                     <i class="fa-solid fa-arrow-left mr-2"></i> Kembali
                  </button>

                  <button @click="saveAndPreview" :disabled="isUploading"
                     class="bg-mocha text-white font-bold py-3 px-8 md:py-4 md:px-12 rounded-2xl hover:bg-dark shadow-xl shadow-mocha/20 transition-all disabled:opacity-70 flex items-center gap-3 text-sm">
                     <span v-if="isUploading" class="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
                     <span v-else>{{ route.params.id ? 'Simpan Perubahan' : 'Lanjut Preview' }}</span>
                     <i v-if="!isUploading" class="fa-solid fa-wand-magic-sparkles"></i>
                  </button>
               </div>

            </div>
         </div>
         <div class="h-24 md:hidden"></div>
      </div>
   </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { uploadFileApi } from '@/api/file'
import { getInvitationById, createInvitation, updateInvitation } from '@/api/invitation'
import { fetchPublicAudio } from '@/api/master'
import QuoteSection from './create-form/components/QuoteSection.vue'

const route = useRoute()
const router = useRouter()
const isUploading = ref(false)
const selectedTemplateRef = ref(JSON.parse(localStorage.getItem('selectedTemplate') || '{}'))
const audioList = ref([])

const isPremiumTemplate = computed(() => {
   return selectedTemplateRef.value.isPremium === true || selectedTemplateRef.value.isPremium === 'true'
})

const formData = ref({
   title: '', brideName: '', groomName: '', bridePhoto: '', bridePhotoFile: null,
   groomPhoto: '', groomPhotoFile: null, photoCouple: '', photoCoupleFile: null,
   gallery: [], isSingleEvent: null, dateTime: '', map: '', mapDesc: '',
   akadDateTime: '', akadMap: '', akadDesc: '', resepsiDateTime: '', resepsiMap: '', resepsiDesc: '',
   music: '', youtubeUrl: '', denah: '', denahFile: null,
   wishes: 'ya', rsvp: 'ya', encryptedGuest: 'ya',
   brideParents: '', groomParents: '', bankAccounts: []
})

const sections = ref({})
const validationErrors = ref({})

const progressPercentage = computed(() => {
   let filled = 0; const total = 7
   if (formData.value.brideName) filled++
   if (formData.value.groomName) filled++
   if (formData.value.title) filled++
   if (formData.value.isSingleEvent !== null) filled++
   if (formData.value.photoCouple) filled++
   if (formData.value.dateTime || (formData.value.akadDateTime && formData.value.resepsiDateTime)) filled++
   if (formData.value.map || (formData.value.akadMap && formData.value.resepsiMap)) filled++
   return (filled / total) * 100
})

const suggestedTitle = computed(() => {
   const groom = (formData.value.groomName || '').split(' ')[0]
   const bride = (formData.value.brideName || '').split(' ')[0]
   return groom && bride ? `${groom} & ${bride}` : ''
})

const DEFAULT_QUOTE = "Dan di antara tanda-tanda (kebesaran)-Nya..."

onMounted(async () => {
   const res = await fetchPublicAudio()
   audioList.value = Array.isArray(res) ? res : (res?.data || [])
   
   const stored = localStorage.getItem('selectedSections')
   if (!route.params.id && !stored) {
      router.push('/create')
      return
   }
   
   if (stored) {
      const active = JSON.parse(stored)
      sections.value = active.reduce((acc, k) => { acc[k] = true; return acc }, {})
   }

   if (route.params.id) {
      const resInv = await getInvitationById(route.params.id)
      mapPayloadToFormData(resInv.data || resInv)
   }
})

function validateField(f) { /* Basic validation logic */ return true }

function handleBridePhotoUpload(e) {
   const file = e.target.files?.[0]; if (!file) return
   const reader = new FileReader(); reader.onload = () => { formData.value.bridePhoto = reader.result; formData.value.bridePhotoFile = file }; reader.readAsDataURL(file)
}
function handleGroomPhotoUpload(e) {
   const file = e.target.files?.[0]; if (!file) return
   const reader = new FileReader(); reader.onload = () => { formData.value.groomPhoto = reader.result; formData.value.groomPhotoFile = file }; reader.readAsDataURL(file)
}
function handleCouplePhotoUpload(e) {
   const file = e.target.files?.[0]; if (!file) return
   const reader = new FileReader(); reader.onload = () => { formData.value.photoCouple = reader.result; formData.value.photoCoupleFile = file }; reader.readAsDataURL(file)
}
function handleGalleryUpload(e) {
   const files = Array.from(e.target.files || [])
   files.forEach(file => {
      const reader = new FileReader(); reader.onload = () => formData.value.gallery.push({ preview: reader.result, file }); reader.readAsDataURL(file)
   })
}
function removeGalleryImage(i) { formData.value.gallery.splice(i, 1) }

async function saveAndPreview() {
   isUploading.value = true
   try {
      // In real app, we upload files first
      const payload = { ...formData.value, selectedSections: Object.keys(sections.value) }
      let res
      if (route.params.id) res = await updateInvitation(route.params.id, payload)
      else res = await createInvitation(payload)
      const result = res.data || res
      router.push({ path: '/preview', query: { slug: result.slug } })
   } catch (err) {
      console.error(err)
      alert("Gagal menyimpan!")
   } finally { isUploading.value = false }
}

function mapPayloadToFormData(p) {
   formData.value.title = p.title || ''
   formData.value.brideName = p.brideName || ''
   formData.value.groomName = p.groomName || ''
   formData.value.bridePhoto = p.bridePhotoUrl || ''
   formData.value.groomPhoto = p.groomPhotoUrl || ''
}
</script>

<style scoped>
.form-label { display: block; font-weight: 700; color: #2D3748; margin-bottom: 0.6rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
.form-input { width: 100%; padding: 0.9rem 1.25rem; border-radius: 1.25rem; border: 2px solid #F7FAFC; background-color: #F7FAFC; transition: all 0.3s ease; font-size: 0.95rem; }
.form-input:focus { outline: none; border-color: #a47148; background-color: white; }
.form-error { color: #E53E3E; font-size: 0.7rem; font-weight: 600; margin-top: 0.5rem; }
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
