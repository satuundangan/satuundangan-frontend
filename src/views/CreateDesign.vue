<template>
  <div class="min-h-screen bg-gray-50 font-sans pt-6 md:pt-12 pb-24 px-4 md:px-8">
    <div class="max-w-5xl mx-auto">
      
      <!-- Top Navigation / Header -->
      <div class="flex items-center justify-between mb-8">
         <button @click="goBackToGallery" class="flex items-center gap-2 text-gray-500 hover:text-dark transition-colors font-bold text-sm">
            <i class="fa-solid fa-chevron-left text-xs"></i> 
            <span class="hidden md:inline">Ganti Template</span>
            <span class="md:hidden">Kembali</span>
         </button>
         
         <div class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
            <span class="w-2 h-2 rounded-full bg-mocha animate-pulse"></span>
            <span class="text-[10px] font-bold text-dark uppercase tracking-widest">Langkah 1/2</span>
         </div>

         <div class="w-20 hidden md:block"></div> <!-- Spacer for balance -->
      </div>

      <div class="text-center mb-10 md:mb-12">
         <h1 class="text-2xl md:text-4xl font-serif font-bold text-dark mb-3">Personalisasi Undanganmu</h1>
         <p class="text-muted text-sm md:text-lg">Pilih komponen yang ingin kamu tampilkan di halaman undangan.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         
         <!-- Left Column: Template Summary (Compact on Mobile) -->
         <div class="lg:col-span-5 space-y-6">
            <div class="bg-white p-5 md:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
               <div class="absolute -top-12 -right-12 w-40 h-40 bg-mocha/5 rounded-full blur-3xl transition-transform group-hover:scale-125"></div>
               
               <h2 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Template Terpilih</h2>
               
               <div class="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg mb-6 bg-gray-100 ring-4 ring-white">
                  <img :src="templateImageUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div class="absolute left-4 top-4">
                     <span class="rounded-xl bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase text-mocha shadow-xl border border-mocha/5">
                        {{ selectedTemplate.isPremium ? '💎 Premium' : '✨ Gratis' }}
                     </span>
                  </div>
               </div>

               <div class="space-y-2 relative z-10">
                  <h3 class="text-xl md:text-2xl font-serif font-bold text-dark">{{ selectedTemplate.name }}</h3>
                  <div class="flex items-center justify-between">
                     <p class="text-sm font-bold text-mocha">{{ templatePrice }}</p>
                     <div class="flex gap-1.5">
                        <span v-for="color in paletteColors" :key="color"
                          class="w-4 h-4 rounded-full border border-white shadow-sm ring-1 ring-gray-100" :style="{ backgroundColor: color }"></span>
                     </div>
                  </div>
               </div>
            </div>

            <!-- Note -->
            <div class="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 flex gap-3 items-center">
               <div class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-500 flex-shrink-0">
                  <i class="fa-solid fa-lightbulb"></i>
               </div>
               <p class="text-[10px] md:text-xs text-amber-900 leading-relaxed font-medium">
                  Jangan khawatir, kamu bisa mengubah pilihan komponen ini kapan saja melalui dashboard.
               </p>
            </div>
         </div>

         <!-- Right Column: Section Selection -->
         <div class="lg:col-span-7">
            <div class="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 h-full">
               <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <h2 class="font-serif font-bold text-xl md:text-2xl text-dark">Komponen Undangan</h2>
                  <div class="flex items-center gap-2">
                     <button @click="selectAll" class="px-3 py-1.5 rounded-full bg-mocha/10 text-mocha text-[10px] font-bold uppercase tracking-wider hover:bg-mocha hover:text-white transition-all flex items-center gap-1.5">
                        <i class="fa-solid fa-check-double"></i>
                        Pilih Semua
                     </button>
                     <button @click="deselectAll" class="px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider hover:bg-red-50 hover:text-red-500 transition-all flex items-center gap-1.5">
                        <i class="fa-solid fa-xmark"></i>
                        Hapus Semua
                     </button>
                  </div>
               </div>
               
               <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar p-1">
                 <template v-for="(section, key) in sectionOptions" :key="key">
                   <label class="group relative flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300"
                          :class="selectedSections.includes(key) 
                            ? 'border-mocha bg-mocha/5 shadow-md shadow-mocha/5' 
                            : 'border-gray-50 bg-gray-50/50 hover:border-mocha/20 hover:bg-white'">
                     
                     <input type="checkbox" v-model="selectedSections" :value="key" class="hidden" />
                     
                     <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                          :class="selectedSections.includes(key) ? 'bg-mocha text-white shadow-lg shadow-mocha/20' : 'bg-white text-gray-400 group-hover:text-mocha border border-gray-100'">
                        <i :class="['fa-solid', getIcon(key), 'text-sm']"></i>
                     </div>

                     <div class="flex-1 pt-1">
                        <span class="text-xs md:text-sm font-bold text-dark group-hover:text-mocha transition-colors select-none leading-tight block">
                           {{ section }}
                        </span>
                     </div>

                     <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 mt-1"
                          :class="selectedSections.includes(key) ? 'border-mocha bg-mocha text-white scale-110' : 'border-gray-200 text-transparent scale-90 group-hover:border-mocha/30'">
                        <i class="fa-solid fa-check text-[8px]"></i>
                     </div>
                   </label>
                 </template>
               </div>

               <!-- Bottom Action -->
               <div class="mt-10 pt-6 border-t border-gray-50">
                  <button @click="goToForm" :disabled="selectedSections.length === 0"
                     class="w-full py-4 bg-mocha text-white rounded-2xl shadow-xl shadow-mocha/20 hover:shadow-mocha/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 font-bold text-sm md:text-base disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none disabled:cursor-not-allowed">
                     <span>Lanjut Lengkapi Data</span>
                     <i class="fa-solid fa-arrow-right"></i>
                  </button>
                  <p v-if="selectedSections.length === 0" class="text-center text-[10px] text-red-400 font-bold uppercase tracking-widest mt-3 animate-pulse">
                     Pilih minimal satu komponen untuk melanjutkan
                  </p>
               </div>
            </div>
         </div>

      </div>
    </div>
  </div>

  <AuthModal v-if="showLogin" :show="showLogin" :authMode="authMode" @close="showLogin = false"
    @update:authMode="authMode = $event" />
</template>

<script setup>
import AuthModal from '@/components/modal/AuthModal.vue'
import { useAuthStore } from '@/stores/auth'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getSections } from '@/api/master' 
import { analytics } from '@/api/analytics'

const router = useRouter()
const selectedTemplate = ref({})
const selectedSections = ref([])
const sectionOptions = ref({})
const showLogin = ref(false)
const auth = useAuthStore()
const userName = computed(() => auth.user?.name || null)
const authMode = ref('login')

const selectAll = () => {
  selectedSections.value = Object.keys(sectionOptions.value)
  analytics.trackAction('Template Personalization - Select All', {
    template_name: selectedTemplate.value.name,
    sections_count: selectedSections.value.length
  })
}

const deselectAll = () => {
  selectedSections.value = []
  analytics.trackAction('Template Personalization - Deselect All', {
    template_name: selectedTemplate.value.name
  })
}

const getIcon = (key) => {
  const iconMap = {
    quote: 'fa-quote-left',
    loveStory: 'fa-book-heart',
    photoCouple: 'fa-image',
    music: 'fa-music',
    map: 'fa-map-location-dot',
    rsvp: 'fa-clipboard-check',
    wishes: 'fa-comment-dots',
    countdown: 'fa-clock',
    denah: 'fa-map',
    encryptedGuest: 'fa-user-lock',
    foodList: 'fa-utensils',
    gift: 'fa-gift',
    cover: 'fa-book-open',
    gallery: 'fa-images',
    'live-stream': 'fa-video',
    'health-protocol': 'fa-shield-virus',
    'event-details': 'fa-calendar-day',
    'likes': 'fa-thumbs-up',
    'footer': 'fa-scroll',
    'turut-mengundang': 'fa-users',
    'video-prewedding': 'fa-clapperboard'
  }
  return iconMap[key] || 'fa-star'
}

const templateImageUrl = computed(() => (
  selectedTemplate.value.thumbnailUrl ||
  selectedTemplate.value.previewImageUrl ||
  selectedTemplate.value.previewUrl ||
  'https://via.placeholder.com/400x300?text=Template'
))

const paletteColors = computed(() => (
  selectedTemplate.value.paletteColor ||
  selectedTemplate.value.paletteColors ||
  selectedTemplate.value.palette?.colors ||
  []
))

const templatePrice = computed(() => {
  const price = Number(selectedTemplate.value.price || 0)
  if (!price) return 'Gratis'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
})

const sectionOptionsLabelMap = {
  quote: 'Quote Ayat / Mutiara',
  loveStory: 'Love Story (Cerita Cinta)',
  photoCouple: 'Foto Utama Pasangan',
  music: 'Musik Latar',
  map: 'Peta Lokasi (Google Maps)',
  rsvp: 'Konfirmasi Kehadiran (RSVP)',
  wishes: 'Kolom Ucapan & Doa',
  countdown: 'Hitung Mundur Acara',
  denah: 'Denah Lokasi / Ruangan',
  encryptedGuest: 'Enkripsi Nama Tamu',
  foodList: 'Daftar Menu Makanan',
  gift: 'Amplop Digital & Kado',
  cover: 'Halaman Sampul (Cover)',
  gallery: 'Galeri Foto',
  'live-stream': 'Live Streaming Link',
  'health-protocol': 'Protokol Kesehatan',
  'event-details': 'Detail Acara Lengkap',
  'likes': 'Fitur Like / Suka',
  'footer': 'Halaman Penutup',
  'turut-mengundang': 'Turut Mengundang',
  'video-prewedding': 'Video Prewedding'
}

const defaultCommonSections = [
  'quote',
  'photoCouple',
  'loveStory',
  'countdown',
  'rsvp',
  'wishes',
  'map'
]

onMounted(async () => {
  const template = localStorage.getItem('selectedTemplate')
  const selectedSectionsLocalStorage = localStorage.getItem('selectedSections')
  
  if (!template) {
    router.push('/templates')
  } else {
    // Logic Resume Draft dari Main
    if (selectedSectionsLocalStorage) {
       const userWantsResume = confirm("Anda memiliki draft undangan sebelumnya. Lanjutkan edit? \nKlik 'Cancel' untuk buat undangan baru.")
       if (!userWantsResume) {
          localStorage.removeItem('selectedTemplate')
          localStorage.removeItem('selectedSections')
          localStorage.removeItem('finalPayload')
          localStorage.removeItem('editInvitationId')
          router.push('/templates')
          return
       }
    }

    try {
       selectedTemplate.value = JSON.parse(template)
       
       if (selectedTemplate.value.sections && Array.isArray(selectedTemplate.value.sections) && selectedTemplate.value.sections.length > 0) {
          const newOptions = {}
          const enabledKeys = []
          
          selectedTemplate.value.sections.forEach(s => {
             if (s.is_enabled) {
                newOptions[s.key] = s.label || sectionOptionsLabelMap[s.key] || s.key
                enabledKeys.push(s.key)
             }
          })
          sectionOptions.value = newOptions
          
          if (!selectedSectionsLocalStorage) {
             selectedSections.value = enabledKeys
          }
       } else {
          try {
             const apiSections = await getSections()
             if (Array.isArray(apiSections) && apiSections.length > 0) {
                const newOptions = {}
                apiSections.forEach(s => {
                   newOptions[s.key] = s.label || sectionOptionsLabelMap[s.key] || s.key
                })
                sectionOptions.value = newOptions
             } else {
                sectionOptions.value = { ...sectionOptionsLabelMap }
             }
          } catch (e) {
             console.error("Gagal ambil master sections, using fallback", e)
             sectionOptions.value = { ...sectionOptionsLabelMap }
          }

          if (!selectedSectionsLocalStorage) {
             selectedSections.value = defaultCommonSections.filter(s => sectionOptions.value[s])
          }
       }

       if (selectedSectionsLocalStorage) {
         selectedSections.value = JSON.parse(selectedSectionsLocalStorage)
       }
    } catch(e) {
       console.error("Error parsing template data", e)
       router.push('/templates')
    }
  }
})

function goBackToGallery() {
   if (confirm("Ganti template akan mengulang pengaturan fitur. Lanjutkan?")) {
      analytics.trackAction('Template Personalization - Change Template', {
        from_template: selectedTemplate.value.name
      })
      localStorage.removeItem('selectedTemplate')
      localStorage.removeItem('selectedSections')
      router.back()
   }
}

function goToForm() {
  if (!userName.value) {
    analytics.trackAction('Template Personalization - Login Required', {
      template_name: selectedTemplate.value.name
    })
    showLogin.value = true
    return
  }
  if (!localStorage.getItem('finalPayload')) {
    localStorage.removeItem('editInvitationId')
  }
  localStorage.setItem('selectedSections', JSON.stringify(selectedSections.value))
  
  analytics.trackAction('Template Personalization - Continue', {
    template_name: selectedTemplate.value.name,
    selected_sections: selectedSections.value,
    sections_count: selectedSections.value.length
  })

  router.push('/create/form')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 20px;
}
</style>
