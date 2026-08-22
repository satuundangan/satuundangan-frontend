<template>
  <section class="space-y-6 pt-8 border-t border-gray-100">
    <div class="flex items-center gap-4 pb-4 border-b border-gray-100">
      <div class="w-10 h-10 bg-mocha/10 rounded-full flex items-center justify-center text-mocha text-xl">📜</div>
      <h2 class="text-xl font-bold text-dark">Quote / Ayat</h2>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <!-- Left Column: Quote Options -->
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
          <span class="font-medium text-sm">Quote Default</span>
        </label>

        <label
          class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition"
          :class="formData.quoteType === 'preset' ? 'border-mocha bg-mocha/5' : 'border-gray-200'"
        >
          <input
            type="radio"
            value="preset"
            v-model="formData.quoteType"
            class="text-mocha focus:ring-mocha"
          />
          <span class="font-medium text-sm">Pilih Contoh Ayat</span>
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
          <span class="font-medium text-sm">Tulis Sendiri</span>
        </label>
      </div>

      <!-- Right Column: Quote Inputs / Preview -->
      <div class="md:col-span-2 space-y-4">
        <!-- Religion chips: shared between default and preset modes -->
        <div
          v-if="formData.quoteType === 'default' || formData.quoteType === 'preset'"
          class="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100"
        >
          <div>
            <label class="form-label mb-2">Kategori / Agama</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="cat in RELIGIONS"
                :key="cat.id"
                type="button"
                @click="selectReligion(cat.id)"
                class="px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5"
                :class="activeReligion === cat.id
                  ? 'bg-mocha text-white border-mocha shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-mocha/30 hover:bg-mocha/5'"
              >
                <span>{{ cat.icon }}</span>
                <span>{{ cat.name }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Default Option View -->
        <div v-if="formData.quoteType === 'default'" class="space-y-3">
          <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 italic text-muted text-sm leading-relaxed">
            "{{ defaultQuoteEntry.text }}"
            <span class="block mt-2 font-bold not-italic text-mocha text-xs">— {{ defaultQuoteEntry.source }}</span>
          </div>
        </div>

        <!-- Preset Option View -->
        <div v-else-if="formData.quoteType === 'preset'" class="space-y-4">
          <div class="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <div class="pt-2">
              <label class="form-label mb-1.5">Pilih Ayat / Kutipan</label>
              <select
                v-model="selectedPresetIndex"
                class="form-input bg-white text-sm"
              >
                <option v-for="(item, idx) in currentPresets" :key="idx" :value="idx">
                  {{ item.source }} - {{ item.text.substring(0, 45) }}...
                </option>
              </select>
            </div>
          </div>

          <div class="space-y-3 pt-2">
            <div>
              <label class="form-label">Isi Quote / Ayat (Bisa disesuaikan)</label>
              <textarea
                v-model="formData.quote"
                rows="4"
                class="form-input text-sm"
                placeholder="Pilih ayat di atas atau sesuaikan langsung di sini..."
              ></textarea>
            </div>
            <div>
              <label class="form-label">Sumber</label>
              <input
                v-model="formData.quoteSource"
                type="text"
                class="form-input text-sm"
                placeholder="Sumber kutipan..."
              />
            </div>
          </div>
        </div>

        <!-- Custom Option View -->
        <div v-else-if="formData.quoteType === 'custom'" class="space-y-3">
          <div>
            <label class="form-label">Isi Quote / Ayat</label>
            <textarea
              v-model="formData.quote"
              rows="4"
              class="form-input text-sm"
              placeholder="Tulis ayat atau kata-kata mutiara pilihanmu..."
            ></textarea>
          </div>
          <div>
            <label class="form-label">Sumber (Opsional)</label>
            <input
              v-model="formData.quoteSource"
              type="text"
              class="form-input text-sm"
              placeholder="Contoh: QS. Ar-Rum: 21 atau Jalaluddin Rumi"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, toRefs } from 'vue'
import { RELIGIONS, normalizeReligion, presetsFor, defaultQuoteFor } from './quotePresets'

const props = defineProps({
  formData: { type: Object, required: true },
  defaultQuote: { type: String, default: '' }
})

const { formData } = toRefs(props)

// Display-only fallback: derived from formData.religion, never written back.
const activeReligion = computed(() => normalizeReligion(formData.value.religion))

const currentPresets = computed(() => presetsFor(activeReligion.value))
const defaultQuoteEntry = computed(() => defaultQuoteFor(activeReligion.value))

const selectedPresetIndex = ref(0)

const updateFromPreset = () => {
  const presets = currentPresets.value
  if (presets && presets[selectedPresetIndex.value]) {
    const p = presets[selectedPresetIndex.value]
    formData.value.quote = p.text
    formData.value.quoteSource = p.source
  }
}

/**
 * The ONLY writer of formData.religion — explicit user intent via chip click.
 * In default mode this must not touch quote/quoteSource: the preview is a
 * pure computed off defaultQuoteEntry, and the actual save-time value comes
 * from resolveQuoteForSave() in the parent view.
 */
function selectReligion(id) {
  formData.value.religion = id
  if (formData.value.quoteType === 'preset') {
    selectedPresetIndex.value = 0
    updateFromPreset()
  }
}

// Watch preset index selection
watch(selectedPresetIndex, () => {
  updateFromPreset()
})

// Preset-mode dropdown position on mount: exact match only, scoped to the
// already-known religion, never writes formData.religion/quote/quoteSource.
onMounted(() => {
  if (formData.value.quoteType === 'preset') {
    const presets = presetsFor(activeReligion.value)
    const idx = presets.findIndex((p) => p.text === formData.value.quote)
    selectedPresetIndex.value = idx !== -1 ? idx : 0
  }
})
</script>

<style scoped>
.form-label {
  display: block;
  font-weight: 600;
  color: #a47148; /* mocha */
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background-color: white;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #a47148;
  box-shadow: 0 0 0 3px rgba(164, 113, 72, 0.1);
}
</style>