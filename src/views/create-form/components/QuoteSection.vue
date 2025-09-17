<template>
  <section class="space-y-2">
    <label class="block text-mocha font-semibold">Quote Ayat</label>
    <div class="space-y-2">
      <div class="flex items-center gap-4">
        <label class="flex items-center gap-2">
          <input type="radio" value="default" v-model="formData.quoteType" />
          Default
        </label>
        <label class="flex items-center gap-2">
          <input type="radio" value="custom" v-model="formData.quoteType" />
          Custom
        </label>
      </div>
      <textarea
        v-if="formData.quoteType === 'custom'"
        v-model="formData.quote"
        rows="3"
        class="w-full resize-none rounded-xl border border-gray-300 p-2"
        placeholder="Tulis ayat pilihanmu..."
      />
      <p v-else class="text-sm italic text-gray-500">
        “Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu...”
      </p>
    </div>
  </section>
</template>

<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  formData: { type: Object, required: true },
})

const { formData } = toRefs(props)
</script>
