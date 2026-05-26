<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="emit('close')"></div>
      
      <div class="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl transition-all">
        <div class="bg-mocha p-6 text-white flex items-center justify-between">
          <h2 class="text-xl font-bold">Sesuaikan Foto</h2>
          <button @click="emit('close')" class="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>

        <div class="p-6 md:p-8">
          <div class="aspect-square w-full max-h-[50vh] overflow-hidden rounded-3xl bg-slate-100 mb-6">
            <cropper
              ref="cropperRef"
              class="w-full h-full"
              :src="imageSrc"
              :debounce="false"
              image-restriction="fit-area"
              :stencil-props="{
                aspectRatio: selectedRatio
              }"
            />
          </div>

          <!-- Ratio Selector -->
          <div class="mb-8">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Pilih Ukuran Potong</p>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="opt in ratioOptions" 
                :key="opt.label"
                @click="selectedRatio = opt.value"
                :class="[
                  'px-4 py-2 rounded-xl text-xs font-bold transition-all border',
                  selectedRatio === opt.value 
                    ? 'bg-mocha text-white border-mocha shadow-md shadow-mocha/20' 
                    : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
                ]"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <div class="flex gap-4">
            <button 
              @click="emit('close')" 
              class="flex-1 py-4 rounded-2xl border-2 border-slate-100 font-bold text-slate-500 hover:bg-slate-50 transition-all"
            >
              Batal
            </button>
            <button 
              @click="cropImage" 
              :disabled="isProcessing"
              class="flex-1 py-4 rounded-2xl bg-mocha text-white font-bold shadow-xl shadow-mocha/20 hover:bg-dark transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <template v-if="isProcessing">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </template>
              <template v-else>
                Simpan & Gunakan
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const props = defineProps({
  show: Boolean,
  imageSrc: String,
  stencilAspectRatio: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['close', 'crop'])
const cropperRef = ref(null)
const isProcessing = ref(false)
const selectedRatio = ref(props.stencilAspectRatio)

const ratioOptions = [
  { label: 'Square (1:1)', value: 1 },
  { label: 'Portrait (3:4)', value: 3/4 },
  { label: 'Classic (4:3)', value: 4/3 },
  { label: 'Wide (16:9)', value: 16/9 },
  { label: 'Cinema (21:9)', value: 21/9 },
  { label: 'Dynamic', value: 0 } // 0 usually means free-form in many croppers, but here we might need null
]

watch(() => props.stencilAspectRatio, (newVal) => {
  selectedRatio.value = newVal
})

const cropImage = () => {
  if (isProcessing.value) return
  isProcessing.value = true
  
  setTimeout(() => {
    try {
      const { canvas } = cropperRef.value.getResult()
      if (canvas) {
        canvas.toBlob((blob) => {
          emit('crop', {
            blob: blob,
            preview: canvas.toDataURL('image/jpeg', 0.8)
          })
          isProcessing.value = false
        }, 'image/jpeg', 0.8)
      } else {
        isProcessing.value = false
      }
    } catch (err) {
      console.error(err)
      isProcessing.value = false
    }
  }, 100)
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95) translateY(20px); }
</style>
