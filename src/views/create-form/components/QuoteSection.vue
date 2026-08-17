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
        <!-- Default Option View -->
        <div v-if="formData.quoteType === 'default'" class="space-y-3">
          <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 italic text-muted text-sm leading-relaxed">
            "{{ DEFAULT_ISLAMIC_QUOTE_TEXT }}"
            <span class="block mt-2 font-bold not-italic text-mocha text-xs">— {{ DEFAULT_ISLAMIC_QUOTE_SOURCE }}</span>
          </div>
        </div>

        <!-- Preset Option View -->
        <div v-else-if="formData.quoteType === 'preset'" class="space-y-4">
          <div class="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <div>
              <label class="form-label mb-2">Kategori / Agama</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="cat in categories"
                  :key="cat.id"
                  type="button"
                  @click="selectedCategory = cat.id"
                  class="px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5"
                  :class="selectedCategory === cat.id 
                    ? 'bg-mocha text-white border-mocha shadow-sm' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-mocha/30 hover:bg-mocha/5'"
                >
                  <span>{{ cat.icon }}</span>
                  <span>{{ cat.name }}</span>
                </button>
              </div>
            </div>

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

const props = defineProps({
  formData: { type: Object, required: true },
  defaultQuote: { type: String, default: '' }
})

const { formData } = toRefs(props)

const DEFAULT_ISLAMIC_QUOTE_TEXT = "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir."
const DEFAULT_ISLAMIC_QUOTE_SOURCE = "QS. Ar-Rum: 21"

const categories = [
  { id: 'islam', name: 'Islam', icon: '🕌' },
  { id: 'kristen', name: 'Kristen', icon: '⛪' },
  { id: 'katolik', name: 'Katolik', icon: '✝️' },
  { id: 'hindu', name: 'Hindu', icon: '🕉️' },
  { id: 'budha', name: 'Buddha', icon: '☸️' },
  { id: 'umum', name: 'Umum', icon: '📜' }
]

const PRESETS = {
  islam: [
    {
      text: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
      source: "QS. Ar-Rum: 21"
    },
    {
      text: "Maha Suci Allah yang telah menciptakan semuanya berpasang-pasangan, baik dari apa yang ditumbuhkan oleh bumi dan dari diri mereka sendiri, maupun dari apa yang tidak mereka ketahui.",
      source: "QS. Yasin: 36"
    },
    {
      text: "Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).",
      source: "QS. Az-Zariyat: 49"
    }
  ],
  kristen: [
    {
      text: "Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong. Ia tidak melakukan yang tidak sopan dan tidak mencari keuntungan diri sendiri. Ia tidak pemarah dan tidak menyimpan kesalahan orang lain.",
      source: "1 Korintus 13:4-5"
    },
    {
      text: "Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.",
      source: "Matius 19:6"
    },
    {
      text: "Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan.",
      source: "Kolose 3:14"
    }
  ],
  katolik: [
    {
      text: "Sehati sepikirlah kamu, dan hiduplah dalam perdamaian; maka Allah sumber kasih dan damai sejahtera akan menyertai kamu.",
      source: "2 Korintus 13:11"
    },
    {
      text: "Hendaklah kamu selalu rendah hati, lemah lembut, dan sabar. Tunjukkanlah kasihmu dalam saling membantu.",
      source: "Efesus 4:2"
    },
    {
      text: "Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan.",
      source: "Kolose 3:14"
    }
  ],
  hindu: [
    {
      text: "Moga-moga saja kalian (suami-istri) menghayati cinta kasih yang mesra, tidak pernah berpisah, dan moga-moga saja kalian berdua panjang umur dan hidup bahagia bersama anak-anak serta cucu-cucu kalian di rumah kalian sendiri.",
      source: "Rigveda Samhita, X. 85. 42"
    },
    {
      text: "Aku menerima engkau sebagai istriku demi kemakmuran dan kebahagiaan kita bersama. Moga-moga engkau hidup bersamaku sampai hari tua atas restu para Dewa.",
      source: "Rigveda Samhita, X. 85. 36"
    },
    {
      text: "Ya Tuhan Yang Maha Pengasih, ikatlah kami (suami-istri) dalam ikatan pernikahan yang teguh, agar kami selalu hidup bersama dalam kesetiaan dan kebahagiaan.",
      source: "Atharvaveda, XIV. 1. 50"
    }
  ],
  budha: [
    {
      text: "Bila dua orang memiliki keyakinan (Saddha), kemoralan (Sila), kemurahan hati (Caga), dan kebijaksanaan (Panna) yang setara, maka mereka akan dapat saling memahami dan hidup bahagia bersama, baik di kehidupan ini maupun kehidupan selanjutnya.",
      source: "Anguttara Nikaya 4.55"
    },
    {
      text: "Saling mencintai, saling menghormati, dan saling membantu dalam kesukaran adalah jalan menuju kebahagiaan sejati dalam kehidupan berumah tangga.",
      source: "Dhammapada"
    }
  ],
  umum: [
    {
      text: "Aku ingin mencintaimu dengan sederhana: dengan kata yang tak sempat diucapkan kayu kepada api yang menjadikannya abu. Aku ingin mencintaimu dengan sederhana: dengan isyarat yang tak sempat disampaikan awan kepada hujan yang menjadikannya tiada.",
      source: "Sapardi Djoko Damono"
    },
    {
      text: "Cinta tidak terlihat dengan mata, tetapi dengan hati.",
      source: "William Shakespeare"
    },
    {
      text: "Dalam cinta sejati, jarak terkecil pun terlalu jauh, dan jarak terjauh pun bisa dijembatani.",
      source: "Hans Nouwens"
    }
  ]
}

const selectedCategory = ref('islam')
const selectedPresetIndex = ref(0)

const currentPresets = computed(() => PRESETS[selectedCategory.value] || [])

const updateFromPreset = () => {
  const presets = currentPresets.value
  if (presets && presets[selectedPresetIndex.value]) {
    const p = presets[selectedPresetIndex.value]
    formData.value.quote = p.text
    formData.value.quoteSource = p.source
  }
}

// Find if currently stored quote matches any preset
const findMatchingPreset = () => {
  const qText = formData.value.quote
  
  if (!qText) return null
  
  for (const category of Object.keys(PRESETS)) {
    const list = PRESETS[category]
    const idx = list.findIndex(p => p.text === qText || (qText && p.text.includes(qText)))
    if (idx !== -1) {
      return { category, index: idx }
    }
  }
  return null
}

// Watch category selection
watch(selectedCategory, () => {
  selectedPresetIndex.value = 0
  updateFromPreset()
})

// Watch preset index selection
watch(selectedPresetIndex, () => {
  updateFromPreset()
})

// Watch external quoteType changes
watch(() => formData.value.quoteType, (newType) => {
  if (newType === 'default') {
    formData.value.quote = DEFAULT_ISLAMIC_QUOTE_TEXT
    formData.value.quoteSource = DEFAULT_ISLAMIC_QUOTE_SOURCE
  } else if (newType === 'preset') {
    const match = findMatchingPreset()
    if (match) {
      selectedCategory.value = match.category
      selectedPresetIndex.value = match.index
    } else {
      updateFromPreset()
    }
  }
})

onMounted(() => {
  if (formData.value.quoteType === 'preset') {
    const match = findMatchingPreset()
    if (match) {
      selectedCategory.value = match.category
      selectedPresetIndex.value = match.index
    } else {
      selectedCategory.value = 'islam'
      selectedPresetIndex.value = 0
      if (!formData.value.quote) {
        updateFromPreset()
      }
    }
  } else if (formData.value.quoteType === 'default') {
    if (!formData.value.quote) {
      formData.value.quote = DEFAULT_ISLAMIC_QUOTE_TEXT
      formData.value.quoteSource = DEFAULT_ISLAMIC_QUOTE_SOURCE
    }
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