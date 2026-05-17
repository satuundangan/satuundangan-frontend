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
          <div class="aspect-square w-full max-h-[50vh] overflow-hidden rounded-3xl bg-slate-100">
            <cropper
              ref="cropperRef"
              class="w-full h-full"
              :src="imageSrc"
              :stencil-props="{
                aspectRatio: stencilAspectRatio
              }"
            />
          </div>

          <div class="mt-8 flex gap-4">
            <button 
              @click="emit('close')" 
              class="flex-1 py-4 rounded-2xl border-2 border-slate-100 font-bold text-slate-500 hover:bg-slate-50 transition-all"
            >
              Batal
            </button>
            <button 
              @click="cropImage" 
              class="flex-1 py-4 rounded-2xl bg-mocha text-white font-bold shadow-xl shadow-mocha/20 hover:bg-dark transition-all"
            >
              Simpan & Gunakan
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
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

const cropImage = () => {
  const { canvas } = cropperRef.value.getResult()
  if (canvas) {
    canvas.toBlob((blob) => {
      emit('crop', {
        blob: blob,
        preview: canvas.toDataURL()
      })
    }, 'image/jpeg', 0.9)
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95) translateY(20px); }
</style>
