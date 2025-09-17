<template>
  <section class="space-y-2" data-field="title">
    <label class="block text-mocha font-semibold">Judul Undangan <span class="text-red-500">*</span></label>
    <input
      v-model="formData.title"
      @input="emit('validate', 'title')"
      type="text"
      placeholder="Contoh: The Wedding of..."
      :class="inputClass(validationErrors.title)"
    />
    <p v-if="validationErrors.title" class="text-sm text-red-500">{{ validationErrors.title }}</p>
    <p v-if="suggestedTitle && formData.title !== suggestedTitle" class="mt-1 text-sm italic text-gray-400">
      Saran: {{ suggestedTitle }}
      <button type="button" class="ml-2 text-blue-600 underline" @click="formData.title = suggestedTitle">Gunakan</button>
    </p>
  </section>
</template>

<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  formData: { type: Object, required: true },
  validationErrors: { type: Object, required: true },
  suggestedTitle: { type: String, default: '' },
})

const emit = defineEmits(['validate'])

const { formData, validationErrors, suggestedTitle } = toRefs(props)

function inputClass(error) {
  return [
    'w-full rounded-xl border bg-white p-2 outline-none focus:border-mocha focus:ring focus:ring-mocha/20',
    error ? 'border-red-500' : 'border-gray-300',
  ]
}
</script>
