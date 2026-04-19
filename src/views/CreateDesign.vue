<template>
  <div class="min-h-screen bg-ivory font-sans pt-20 md:pt-24 pb-8 md:pb-12 px-4 md:px-8">
    <div class="max-w-4xl mx-auto">
      
      <!-- Stepper -->
      <div class="flex justify-center mb-8 md:mb-10">
         <div class="flex items-center gap-2 md:gap-4">
            <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-sage/20 text-sage text-sm md:text-base font-bold flex items-center justify-center">1</div>
            <div class="w-8 md:w-12 h-1 bg-sage/20 rounded-full"></div>
            <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-mocha text-white text-sm md:text-base font-bold flex items-center justify-center shadow-lg shadow-mocha/20">2</div>
            <div class="w-8 md:w-12 h-1 bg-gray-200 rounded-full"></div>
            <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 text-gray-500 text-sm md:text-base font-bold flex items-center justify-center">3</div>
         </div>
      </div>

      <div class="text-center mb-8 md:mb-10">
         <h1 class="text-2xl md:text-4xl font-serif font-bold text-mocha mb-2 md:mb-3">Personalisasi Undanganmu</h1>
         <p class="text-muted text-sm md:text-lg">Pilih fitur yang ingin kamu tampilkan di undangan.</p>
      </div>

      <div class="bg-white p-5 md:p-10 rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
        <!-- Decor -->
        <div class="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-sage/5 rounded-full blur-2xl md:blur-3xl -translate-y-1/2 translate-x-1/3"></div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 relative z-10">
           
           <!-- Left: Template Info -->
           <div class="md:col-span-5 space-y-4 md:space-y-6">
              <div class="bg-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100">
                 <h2 class="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 md:mb-4">Template Terpilih</h2>
                 
                 <div class="relative rounded-lg md:rounded-xl overflow-hidden shadow-md mb-3 md:mb-4 group cursor-pointer bg-gray-100">
                    <img :src="templateImageUrl" class="w-full h-40 md:h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                    <div class="absolute left-3 top-3 flex flex-wrap gap-2">
                       <span class="rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold uppercase text-mocha shadow-sm">
                          {{ selectedTemplate.isPremium ? 'Premium' : 'Gratis' }}
                       </span>
                       <span v-if="selectedTemplate.category" class="rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold uppercase text-gray-600 shadow-sm">
                          {{ selectedTemplate.category }}
                       </span>
                    </div>
                 </div>

                 <h3 class="text-lg md:text-xl font-serif font-bold text-mocha mb-1">{{ selectedTemplate.name }}</h3>
                 <p class="text-xs font-bold text-dark mb-2">{{ templatePrice }}</p>
                 <p class="text-xs md:text-sm text-muted mb-4 leading-relaxed line-clamp-3 md:line-clamp-none">{{ selectedTemplate.desc || selectedTemplate.description }}</p>
                 
                 <div v-if="templateTags.length" class="flex flex-wrap gap-2 mb-4">
                    <span v-for="tag in templateTags" :key="tag" class="rounded-md bg-mocha/10 px-2 py-1 text-[10px] font-bold uppercase text-mocha">
                       {{ tag }}
                    </span>
                 </div>

                 <div class="flex gap-2">
                    <span v-for="color in paletteColors" :key="color"
                      class="w-5 h-5 md:w-6 md:h-6 rounded-full border border-gray-200 shadow-sm" :style="{ backgroundColor: color }"></span>
                 </div>
              </div>

              <!-- Note -->
              <div class="bg-amber-50 p-3 md:p-4 rounded-xl border border-amber-100 flex gap-2 md:gap-3 items-start">
                 <span class="text-amber-500 text-lg md:text-xl">💡</span>
                 <p class="text-[10px] md:text-xs text-amber-800 leading-relaxed">
                    Tips: Jangan khawatir, kamu bisa mengubah pilihan fitur ini nanti di dashboard jika berubah pikiran.
                 </p>
              </div>
           </div>

           <!-- Right: Selection -->
           <div class="md:col-span-7 flex flex-col">
              <h2 class="font-serif font-bold text-xl md:text-2xl text-dark mb-4 md:mb-6 text-center md:text-left">Pilih Fitur</h2>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 max-h-[350px] md:max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <template v-for="(section, key) in sectionOptions" :key="key">
                  <label class="group relative flex items-center gap-3 p-3 md:p-4 rounded-lg md:rounded-xl border-2 cursor-pointer transition-all duration-300"
                         :class="selectedSections.includes(key) 
                           ? 'border-mocha bg-mocha/5 shadow-sm' 
                           : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'">
                    
                    <input type="checkbox" v-model="selectedSections" :value="key" class="hidden" />
                    
                    <div class="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                         :class="selectedSections.includes(key) ? 'border-mocha bg-mocha text-white' : 'border-gray-300 text-transparent group-hover:border-gray-400'">
                       <i class="fa-solid fa-check text-[10px] md:text-xs"></i>
                    </div>

                    <span class="text-sm md:text-base font-medium text-dark group-hover:text-mocha transition-colors select-none">
                       {{ section }}
                    </span>
                  </label>
                </template>
              </div>

              <div class="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-end">
                 <button @click="goToForm" class="w-full md:w-auto btn-primary px-8 py-3.5 md:py-3 rounded-xl shadow-lg shadow-mocha/20 hover:shadow-mocha/40 md:hover:-translate-y-1 transition-all flex items-center justify-center gap-2 font-bold text-sm md:text-base">
                    <span>Lanjut Isi Data</span>
                    <i class="fa-solid fa-arrow-right"></i>
                 </button>
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
import { getSections } from '@/api/master' // Import API

const router = useRouter()
const selectedTemplate = ref({})
const selectedSections = ref([])
const sectionOptions = ref({})
const showLogin = ref(false)
const auth = useAuthStore()
const userName = computed(() => auth.user?.name || null)
const authMode = ref('login')

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

const templateTags = computed(() => {
  const tags = selectedTemplate.value.tags
  if (Array.isArray(tags)) return tags
  if (typeof tags === 'string') return tags.split(',').map(tag => tag.trim()).filter(Boolean)
  return []
})

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
  // Additional from API
  cover: 'Halaman Sampul (Cover)',
  gallery: 'Galeri Foto',
  'live-stream': 'Live Streaming Link',
  'health-protocol': 'Protokol Kesehatan',
  'digital-envelope': 'Amplop Digital (QRIS/Bank)',
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
    router.push('/')
  } else {
    // Check for existing draft if coming directly (not just switched template)
    if (selectedSectionsLocalStorage) {
       const userWantsResume = confirm("Anda memiliki draft undangan sebelumnya. Lanjutkan edit? \nKlik 'Cancel' untuk buat undangan baru (Pilih Template).")
       if (!userWantsResume) {
          localStorage.removeItem('selectedTemplate')
          localStorage.removeItem('selectedSections')
          localStorage.removeItem('finalPayload')
          localStorage.removeItem('editInvitationId')
          router.push('/')
          return
       }
    }

    try {
       selectedTemplate.value = JSON.parse(template)
       
       // 1. Determine Section Options based on Template
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
          
          // Default selection for NEW invitation: all enabled sections from template
          if (!selectedSectionsLocalStorage) {
             selectedSections.value = enabledKeys
          }
       } else {
          // Fallback to fetch ALL if template doesn't have sections defined (old data)
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

       // 2. Override with localStorage if exists (resuming draft)
       if (selectedSectionsLocalStorage) {
         selectedSections.value = JSON.parse(selectedSectionsLocalStorage)
       }
    } catch(e) {
       console.error("Error parsing template data", e)
       router.push('/')
    }
  }
})

function getKeyFromLabel(input) {
  if (!input) return null;
  
  // 1. Direct key match (case insensitive)
  const directKey = Object.keys(sectionOptionsLabelMap).find(
    key => key.toLowerCase() === input.toLowerCase()
  );
  if (directKey) return directKey;

  // 2. Normalization (e.g. 'Love Story' -> 'loveStory' or 'love-story' -> 'loveStory')
  const normalizedInput = input.toLowerCase().replace(/[^a-z0-9]/g, '');
  const normalizedKey = Object.keys(sectionOptionsLabelMap).find(
    key => key.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedInput
  );
  if (normalizedKey) return normalizedKey;

  // 3. Label match
  const labelKey = Object.keys(sectionOptionsLabelMap).find(
    key => sectionOptionsLabelMap[key].toLowerCase().includes(input.toLowerCase())
  );
  return labelKey || null;
}


function goToForm() {
  if (!userName.value) {
    showLogin.value = true
    return
  }
  if (!localStorage.getItem('finalPayload')) {
    localStorage.removeItem('editInvitationId')
  }
  localStorage.setItem('selectedSections', JSON.stringify(selectedSections.value))
  router.push('/create/form')
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d6d3d1;
  border-radius: 10px;
}
</style>
