<template>
  <div class="min-h-screen bg-ivory font-sans pt-24 pb-12 px-4 md:px-8">
    <div class="max-w-4xl mx-auto">
      
      <!-- Stepper -->
      <div class="flex justify-center mb-10">
         <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-sage/20 text-sage font-bold flex items-center justify-center">1</div>
            <div class="w-12 h-1 bg-sage/20 rounded-full"></div>
            <div class="w-10 h-10 rounded-full bg-mocha text-white font-bold flex items-center justify-center shadow-lg shadow-mocha/20">2</div>
            <div class="w-12 h-1 bg-gray-200 rounded-full"></div>
            <div class="w-10 h-10 rounded-full bg-gray-200 text-gray-500 font-bold flex items-center justify-center">3</div>
         </div>
      </div>

      <div class="text-center mb-10">
         <h1 class="text-3xl md:text-4xl font-serif font-bold text-mocha mb-3">Personalisasi Undanganmu</h1>
         <p class="text-muted text-lg">Pilih fitur yang ingin kamu tampilkan di undangan.</p>
      </div>

      <div class="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
        <!-- Decor -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-sage/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

        <div class="grid md:grid-cols-12 gap-10 relative z-10">
           
           <!-- Left: Template Info -->
           <div class="md:col-span-5 space-y-6">
              <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                 <h2 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Template Terpilih</h2>
                 
                 <div class="relative rounded-xl overflow-hidden shadow-md mb-4 group cursor-pointer">
                    <img :src="selectedTemplate.previewUrl || 'https://via.placeholder.com/400x300'" class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                 </div>

                 <h3 class="text-xl font-serif font-bold text-mocha mb-1">{{ selectedTemplate.name }}</h3>
                 <p class="text-sm text-muted mb-4 leading-relaxed">{{ selectedTemplate.desc || selectedTemplate.description }}</p>
                 
                 <div class="flex gap-2">
                    <span v-for="color in selectedTemplate.paletteColor" :key="color"
                      class="w-6 h-6 rounded-full border border-gray-200 shadow-sm" :style="{ backgroundColor: color }"></span>
                 </div>
              </div>

              <!-- Note -->
              <div class="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3 items-start">
                 <span class="text-amber-500 text-xl">💡</span>
                 <p class="text-xs text-amber-800 leading-relaxed">
                    Tips: Jangan khawatir, kamu bisa mengubah pilihan fitur ini nanti di dashboard jika berubah pikiran.
                 </p>
              </div>
           </div>

           <!-- Right: Selection -->
           <div class="md:col-span-7">
              <h2 class="font-serif font-bold text-2xl text-dark mb-6">Pilih Fitur</h2>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <template v-for="(section, key) in sectionOptions" :key="key">
                  <label class="group relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300"
                         :class="selectedSections.includes(key) 
                           ? 'border-mocha bg-mocha/5 shadow-sm' 
                           : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'">
                    
                    <input type="checkbox" v-model="selectedSections" :value="key" class="hidden" />
                    
                    <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                         :class="selectedSections.includes(key) ? 'border-mocha bg-mocha text-white' : 'border-gray-300 text-transparent group-hover:border-gray-400'">
                       <i class="fa-solid fa-check text-xs"></i>
                    </div>

                    <span class="font-medium text-dark group-hover:text-mocha transition-colors select-none">
                       {{ section }}
                    </span>
                  </label>
                </template>
              </div>

              <div class="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                 <button @click="goToForm" class="btn-primary px-8 py-3 rounded-xl shadow-lg shadow-mocha/20 hover:shadow-mocha/40 hover:-translate-y-1 transition-all flex items-center gap-2">
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

const router = useRouter()
const selectedTemplate = ref({})
const selectedSections = ref([])
const sectionOptions = ref({})
const showLogin = ref(false)
const auth = useAuthStore()
const userName = computed(() => auth.user?.name || null)
const authMode = ref('login')

const sectionOptionsLabelMap = {
  quote: 'Quote Ayat / Mutiara',
  loveStory: 'Love Story (Cerita Cinta)',
  photoCouple: 'Foto Utama Pasangan',
  music: 'Musik Latar',
  map: 'Peta Lokasi (Google Maps)',
  rsvp: 'Konfirmasi Kehadiran (RSVP)',
  wishes: 'Kolom Ucapan & Doa',
  // likes: 'Like Count',
  countdown: 'Hitung Mundur Acara',
  denah: 'Denah Lokasi / Ruangan',
  encryptedGuest: 'Enkripsi Nama Tamu',
  foodList: 'Daftar Menu Makanan',
  gift: 'Amplop Digital & Kado'
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

onMounted(() => {
  const template = localStorage.getItem('selectedTemplate')
  const selectedSectionsLocalStorage = localStorage.getItem('selectedSections')
  
  if (!template) {
    router.push('/')
  } else {
    try {
       selectedTemplate.value = JSON.parse(template)

       if (selectedTemplate.value.sectionOptions) {
         let options = selectedTemplate.value.sectionOptions;
         
         if (typeof options === 'string') {
            try {
               options = JSON.parse(options);
            } catch (e) {
               // Fallback: if not JSON, maybe comma separated?
               if(options.includes(',')) options = options.split(',').map(s => s.trim());
               else options = [options];
            }
         }

         if (Array.isArray(options) && options.length > 0) {
             sectionOptions.value = {}
             options.forEach(label => {
               const key = getKeyFromLabel(label)
               if (key) {
                 sectionOptions.value[key] = sectionOptionsLabelMap[key]
               }
             })
         } else {
             // Fallback if array is empty or invalid
             sectionOptions.value = { ...sectionOptionsLabelMap }
         }
       } else {
         sectionOptions.value = { ...sectionOptionsLabelMap }
       }
       
       if (selectedSectionsLocalStorage) {
         selectedSections.value = JSON.parse(selectedSectionsLocalStorage)
       } else {
         // Default selection logic: check if key exists in available options
         selectedSections.value = defaultCommonSections.filter(s => sectionOptions.value[s])
       }
    } catch(e) {
       console.error("Error parsing template data", e)
       router.push('/')
    }
  }
})

function getKeyFromLabel(label) {
  // Simple check
  return Object.keys(sectionOptionsLabelMap).find(key => sectionOptionsLabelMap[key] === label)
}


function goToForm() {
  if (!userName.value) {
    showLogin.value = true
    return
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