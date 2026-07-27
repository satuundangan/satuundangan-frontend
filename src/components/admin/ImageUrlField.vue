<template>
  <div>
    <label v-if="label" class="text-sm font-medium text-slate-600">{{ label }}</label>
    <div class="mt-2 flex gap-2">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="url"
        :placeholder="placeholder"
        class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
      />
      <button
        type="button"
        :disabled="uploading"
        @click="triggerUpload"
        class="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-60"
      >
        {{ uploading ? 'Mengunggah...' : 'Upload' }}
      </button>
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
    </div>
    <div
      v-if="modelValue"
      class="relative mt-2 h-20 w-32 overflow-hidden rounded-lg border border-slate-200"
    >
      <img :src="modelValue" class="h-full w-full object-cover" />
      <button
        type="button"
        @click="$emit('update:modelValue', '')"
        class="absolute top-1 right-1 rounded-full bg-white/80 p-0.5 text-rose-500 hover:text-rose-700"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { uploadFileApi } from '@/api/file.js'

defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: 'https://example.com/image.jpg' },
})
const emit = defineEmits(['update:modelValue'])

const toast = useToast()
const fileInput = ref(null)
const uploading = ref(false)

function triggerUpload() {
  fileInput.value?.click()
}

async function handleFileChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const res = await uploadFileApi(file)
    emit('update:modelValue', res.fileUrl)
  } catch {
    toast.error('Gagal mengupload gambar')
  } finally {
    uploading.value = false
    event.target.value = ''
  }
}
</script>
