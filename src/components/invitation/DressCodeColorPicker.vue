<template>
  <div class="dress-code-picker space-y-4 pt-2">
    <!-- Header & Counter -->
    <div class="flex items-center justify-between">
      <div>
        <label class="form-label mb-0.5 flex items-center gap-2">
          <i class="fa-solid fa-palette text-amber-600"></i>
          <span>Palet Warna Dress Code (Opsional)</span>
        </label>
        <p class="text-xs text-slate-500">
          Tampilkan panduan visual warna pakaian yang serasi bagi para tamu undangan.
        </p>
      </div>

      <span 
        class="text-[11px] font-bold px-2 py-0.5 rounded-full border"
        :class="colors.length > 0 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-500 border-slate-200'"
      >
        {{ colors.length }}/{{ MAX_DRESS_CODE_COLORS }} Warna
      </span>
    </div>

    <!-- Active Swatches Display -->
    <div 
      v-if="colors.length > 0"
      class="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2.5"
    >
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-slate-700">Warna Terpilih:</span>
        <button 
          type="button" 
          @click="clearAllColors"
          class="text-rose-600 hover:text-rose-700 text-[11px] font-bold hover:underline"
        >
          Hapus Semua
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <div 
          v-for="(hex, idx) in colors" 
          :key="idx"
          class="inline-flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs group transition-all"
        >
          <span 
            class="w-5 h-5 rounded-lg border shadow-2xs shrink-0"
            :style="{ backgroundColor: hex, borderColor: getContrastBorder(hex) }"
          ></span>
          <span class="text-[11px] font-mono font-medium text-slate-700 uppercase">{{ hex }}</span>
          <button 
            type="button"
            @click="removeColor(idx)"
            class="text-slate-400 hover:text-rose-600 transition-colors p-0.5 text-xs ml-0.5"
            :title="`Hapus ${hex}`"
            :aria-label="`Hapus ${hex}`"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Presets Section -->
    <div class="space-y-2">
      <span class="text-xs font-bold text-slate-700 block">Pilih dari Palet Rekomendasi:</span>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button 
          v-for="preset in DRESS_CODE_PRESETS" 
          :key="preset.id"
          type="button"
          @click="applyPreset(preset)"
          class="p-2.5 rounded-xl border text-left transition-all hover:scale-[1.02] flex flex-col justify-between gap-1.5 group relative"
          :class="isPresetActive(preset) ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'"
        >
          <div class="flex items-center justify-between w-full">
            <span class="text-[11px] font-bold text-slate-800 truncate">{{ preset.name }}</span>
            <i v-if="isPresetActive(preset)" class="fa-solid fa-circle-check text-amber-600 text-xs shrink-0"></i>
          </div>

          <!-- Color Dots -->
          <div class="flex items-center gap-1">
            <span 
              v-for="(hex, cIdx) in preset.colors" 
              :key="cIdx"
              class="w-3.5 h-3.5 rounded-full border shadow-2xs shrink-0"
              :style="{ backgroundColor: hex, borderColor: getContrastBorder(hex) }"
            ></span>
          </div>
        </button>
      </div>
    </div>

    <!-- Custom Color Input -->
    <div class="pt-2 border-t border-slate-100 space-y-2">
      <span class="text-xs font-bold text-slate-700 block">Atau Tambah Warna Kustom:</span>
      <div class="flex items-center gap-2 flex-wrap">
        <!-- Native Color Picker Swatch Input -->
        <div class="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shrink-0 cursor-pointer shadow-2xs hover:border-slate-400 transition-colors">
          <input 
            type="color" 
            v-model="colorPickerValue" 
            @input="handleColorPickerInput"
            class="absolute -top-2 -left-2 w-14 h-14 cursor-pointer border-0 p-0"
            title="Pilih warna kustom"
          />
        </div>

        <!-- Hex text input -->
        <div class="relative flex-1 min-w-[140px]">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">#</span>
          <input 
            type="text" 
            v-model="hexTextInput" 
            placeholder="8A9A5B" 
            maxlength="7"
            @keyup.enter="addCustomColor"
            class="form-input pl-7 text-xs font-mono uppercase"
          />
        </div>

        <button 
          type="button" 
          @click="addCustomColor"
          :disabled="!canAddCustomColor"
          class="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5"
        >
          <i class="fa-solid fa-plus text-[10px]"></i>
          <span>Tambah</span>
        </button>
      </div>

      <p v-if="colors.length >= MAX_DRESS_CODE_COLORS" class="text-[11px] text-amber-700">
        Maksimal {{ MAX_DRESS_CODE_COLORS }} warna dress code agar tampilan undangan tetap rapi dan mudah dibaca tamu.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  DRESS_CODE_PRESETS,
  MAX_DRESS_CODE_COLORS,
  normalizeHex,
  isValidHex,
  getContrastBorder
} from '@/utils/dressCodePresets'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const colorPickerValue = ref('#8A9A5B')
const hexTextInput = ref('')

const colors = computed(() => {
  if (!Array.isArray(props.modelValue)) return []
  return props.modelValue.map(c => normalizeHex(c)).filter(Boolean)
})

const canAddCustomColor = computed(() => {
  if (colors.value.length >= MAX_DRESS_CODE_COLORS) return false
  const testVal = hexTextInput.value.startsWith('#') ? hexTextInput.value : '#' + hexTextInput.value
  return isValidHex(testVal)
})

function updateColors(newList) {
  emit('update:modelValue', newList)
  emit('change', newList)
}

function applyPreset(preset) {
  if (!preset || !Array.isArray(preset.colors)) return
  updateColors([...preset.colors])
}

function isPresetActive(preset) {
  if (!preset || !Array.isArray(preset.colors)) return false
  if (preset.colors.length !== colors.value.length) return false
  return preset.colors.every((c, idx) => normalizeHex(c) === colors.value[idx])
}

function removeColor(index) {
  const next = [...colors.value]
  next.splice(index, 1)
  updateColors(next)
}

function clearAllColors() {
  updateColors([])
}

function handleColorPickerInput(e) {
  const hex = e.target.value
  if (hex) {
    hexTextInput.value = hex.replace('#', '')
  }
}

function addCustomColor() {
  if (!canAddCustomColor.value) return
  let val = hexTextInput.value.trim()
  if (!val.startsWith('#')) {
    val = '#' + val
  }
  const norm = normalizeHex(val)
  if (!norm) return

  // Prevent duplicate consecutive entries
  if (colors.value.includes(norm)) {
    hexTextInput.value = ''
    return
  }

  const next = [...colors.value, norm]
  updateColors(next)
  hexTextInput.value = ''
}
</script>
