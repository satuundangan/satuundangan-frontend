<template>
  <section class="space-y-6 pt-8 border-t border-gray-100">
    <div class="flex items-center gap-4 pb-4 border-b border-gray-100">
      <div class="w-10 h-10 bg-mocha/10 rounded-full flex items-center justify-center text-mocha text-xl">📜</div>
      <h2 class="text-xl font-bold text-dark">Quote / Ayat</h2>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <div class="md:col-span-1 space-y-3">
        <label
          class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition"
          :class="formData.quoteType === 'default' ? 'border-mocha bg-mocha/5' : 'border-gray-200'"
        >
          <input
            type="radio"
            value="default"
            v-model="formData.quoteType"
            class="text-mocha focus:ring-mocha"
          />
          <span class="font-medium">Quote Default</span>
        </label>
        <label
          class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition"
          :class="formData.quoteType === 'custom' ? 'border-mocha bg-mocha/5' : 'border-gray-200'"
        >
          <input
            type="radio"
            value="custom"
            v-model="formData.quoteType"
            class="text-mocha focus:ring-mocha"
          />
          <span class="font-medium">Tulis Sendiri</span>
        </label>
      </div>

      <div class="md:col-span-2 space-y-4">
        <div v-if="formData.quoteType === 'custom'" class="space-y-3">
          <div>
            <label class="form-label">Isi Quote / Ayat</label>
            <textarea
              v-model="formData.quote"
              rows="4"
              class="form-input"
              placeholder="Tulis ayat atau kata-kata mutiara pilihanmu..."
            ></textarea>
          </div>
          <div>
            <label class="form-label">Sumber (Opsional)</label>
            <input
              v-model="formData.quoteSource"
              type="text"
              class="form-input"
              placeholder="Contoh: QS. Ar-Rum: 21 atau Jalaluddin Rumi"
            />
          </div>
        </div>
        <div v-else class="bg-gray-50 p-4 rounded-xl border border-gray-200 italic text-muted text-sm leading-relaxed">
          "{{ defaultQuote }}"
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  formData: { type: Object, required: true },
  defaultQuote: { type: String, default: '' }
})

const { formData } = toRefs(props)
</script>

<style scoped>
.form-label {
  display: block;
  font-weight: 600;
  color: #a47148; /* mocha */
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background-color: white;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.form-input:focus {
  outline: none;
  border-color: #a47148;
  box-shadow: 0 0 0 3px rgba(164, 113, 72, 0.1);
}
</style>