<template>
  <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
    <div class="space-y-4">
      <!-- Warna -->
      <div class="rounded-lg border border-slate-200 p-4">
        <h3 class="mb-3 text-sm font-semibold text-slate-700">Warna</h3>
        <div data-testid="colors-group" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div v-for="field in colorFields" :key="field.key" class="space-y-1">
            <label class="text-xs font-medium text-slate-500">{{ field.label }}</label>
            <div class="flex items-center gap-2">
              <input
                type="color"
                v-model="config.colors[field.key]"
                class="h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded border-0 bg-transparent"
              />
              <input
                type="text"
                v-model="config.colors[field.key]"
                :data-testid="`color-${field.key}-hex`"
                class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-mono outline-none focus:border-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Font -->
      <div class="rounded-lg border border-slate-200 p-4">
        <h3 class="mb-3 text-sm font-semibold text-slate-700">Font</h3>
        <div data-testid="fonts-group" class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div v-for="role in fontRoles" :key="role.key" class="space-y-1">
            <label class="text-xs font-medium text-slate-500">{{ role.label }}</label>
            <select
              :value="config.fonts[role.key].family"
              @change="onFontChange(role.key, $event.target.value)"
              :data-testid="`font-${role.key}-select`"
              class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-slate-400"
            >
              <option v-for="f in FONT_CATALOGUE[role.key]" :key="f.family" :value="f.family">
                {{ f.family }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Hero -->
      <div class="rounded-lg border border-slate-200 p-4">
        <h3 class="mb-3 text-sm font-semibold text-slate-700">Hero</h3>
        <div class="space-y-3">
          <div>
            <label class="text-xs font-medium text-slate-500">Varian</label>
            <select
              v-model="config.hero.variant"
              class="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-slate-400"
            >
              <option v-for="v in HERO_VARIANTS" :key="v.value" :value="v.value">{{ v.label }}</option>
            </select>
          </div>
          <ImageUrlField v-model="config.hero.backgroundImage" label="Gambar Latar Belakang" />
          <div>
            <label class="text-xs font-medium text-slate-500">Warna Overlay</label>
            <div class="mt-1 flex items-center gap-2">
              <input
                type="color"
                v-model="config.hero.overlayColor"
                class="h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded border-0 bg-transparent"
              />
              <input
                type="text"
                v-model="config.hero.overlayColor"
                class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-mono outline-none focus:border-slate-400"
              />
            </div>
          </div>
          <div>
            <label class="text-xs font-medium text-slate-500">
              Opasitas Overlay ({{ config.hero.overlayOpacity }})
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              v-model.number="config.hero.overlayOpacity"
              class="mt-1 w-full"
            />
          </div>
        </div>
      </div>

      <!-- Section -->
      <div class="rounded-lg border border-slate-200 p-4">
        <h3 class="mb-3 text-sm font-semibold text-slate-700">Section</h3>
        <div class="space-y-2">
          <details
            v-for="key in THEME_SECTION_KEYS"
            :key="key"
            :data-testid="`section-${key}`"
            class="rounded-lg border border-slate-200 p-3"
          >
            <summary class="cursor-pointer text-sm font-medium text-slate-700">
              {{ SECTION_LABELS[key] }}
            </summary>
            <div class="mt-3 space-y-3">
              <div>
                <label class="text-xs font-medium text-slate-500">Tipe Background</label>
                <select
                  :value="config.sections[key].background.type"
                  @change="onBackgroundTypeChange(key, $event.target.value)"
                  :data-testid="`section-bg-type-${key}`"
                  class="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-slate-400"
                >
                  <option v-for="t in BACKGROUND_TYPES" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>

              <div
                v-if="config.sections[key].background.type === 'color'"
                :data-testid="`section-bg-color-${key}`"
                class="flex items-center gap-2"
              >
                <input
                  type="color"
                  v-model="config.sections[key].background.value"
                  class="h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded border-0 bg-transparent"
                />
                <input
                  type="text"
                  v-model="config.sections[key].background.value"
                  class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-mono outline-none focus:border-slate-400"
                />
              </div>

              <div
                v-else-if="config.sections[key].background.type === 'gradient'"
                :data-testid="`section-bg-gradient-${key}`"
                class="space-y-2"
              >
                <div class="flex items-center gap-2">
                  <label class="w-10 text-[10px] uppercase text-slate-400">Dari</label>
                  <input
                    type="color"
                    v-model="config.sections[key].background.from"
                    class="h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    v-model="config.sections[key].background.from"
                    class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-mono outline-none focus:border-slate-400"
                  />
                </div>
                <div class="flex items-center gap-2">
                  <label class="w-10 text-[10px] uppercase text-slate-400">Ke</label>
                  <input
                    type="color"
                    v-model="config.sections[key].background.to"
                    class="h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    v-model="config.sections[key].background.to"
                    class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-mono outline-none focus:border-slate-400"
                  />
                </div>
                <input
                  type="text"
                  v-model="config.sections[key].background.direction"
                  placeholder="180deg"
                  class="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-slate-400"
                />
              </div>

              <div v-else-if="config.sections[key].background.type === 'image'">
                <ImageUrlField
                  v-model="config.sections[key].background.url"
                  label="URL Gambar Background"
                  :data-testid="`section-bg-image-${key}`"
                />
              </div>

              <ImageUrlField v-model="config.sections[key].ornamentTop" label="Ornamen Atas" />
              <ImageUrlField v-model="config.sections[key].ornamentBottom" label="Ornamen Bawah" />
            </div>
          </details>
        </div>
      </div>

      <!-- Ornamen -->
      <div class="rounded-lg border border-slate-200 p-4">
        <h3 class="mb-3 text-sm font-semibold text-slate-700">Ornamen</h3>
        <div data-testid="ornaments-group" class="space-y-3">
          <ImageUrlField v-model="config.ornaments.corner" label="Sudut (Corner)" />
          <ImageUrlField v-model="config.ornaments.divider" label="Pembatas (Divider)" />
          <ImageUrlField v-model="config.ornaments.frame" label="Bingkai (Frame)" />
        </div>
      </div>

      <!-- Dekorasi -->
      <div class="rounded-lg border border-slate-200 p-4">
        <h3 class="mb-3 text-sm font-semibold text-slate-700">Dekorasi</h3>
        <div data-testid="decor-group" class="space-y-3">
          <div>
            <label class="text-xs font-medium text-slate-500">Border Radius</label>
            <input
              type="text"
              v-model="config.decor.borderRadius"
              list="dt-border-radius-options"
              class="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-slate-400"
            />
            <datalist id="dt-border-radius-options">
              <option value="0" />
              <option value="0.5rem" />
              <option value="1rem" />
              <option value="1.5rem" />
              <option value="2rem" />
            </datalist>
          </div>
          <ImageUrlField v-model="config.decor.patternUrl" label="URL Pola (Pattern)" />
          <div>
            <label class="text-xs font-medium text-slate-500">
              Opasitas Pola ({{ config.decor.patternOpacity }})
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              v-model.number="config.decor.patternOpacity"
              class="mt-1 w-full"
            />
          </div>
        </div>
      </div>

      <!-- Version -->
      <p class="text-xs text-slate-400">Versi skema: {{ config.version }} (tetap)</p>
    </div>

    <div>
      <button
        type="button"
        class="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 lg:hidden"
        @click="showPreview = !showPreview"
      >
        {{ showPreview ? 'Sembunyikan Preview' : 'Tampilkan Preview' }}
      </button>
      <div :class="showPreview ? '' : 'hidden lg:block'" class="lg:sticky lg:top-4">
        <iframe
          ref="previewIframe"
          :src="previewSrc"
          class="h-[70vh] w-full rounded-lg border border-slate-200 bg-white"
        />
        <p class="mt-1 text-[10px] text-slate-400">Preview memakai data contoh.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { normalizeThemeConfig, THEME_SECTION_KEYS } from '@/utils/themeConfig'
import ImageUrlField from './ImageUrlField.vue'
import {
  FONT_CATALOGUE,
  HERO_VARIANTS,
  BACKGROUND_TYPES,
  SECTION_LABELS,
  applyBackgroundType,
  buildPreviewMessage,
} from './themeBuilderOptions'

const props = defineProps({
  modelValue: { type: [Object, String], default: null },
})
const emit = defineEmits(['update:modelValue'])

const config = ref(normalizeThemeConfig(props.modelValue))

watch(
  () => props.modelValue,
  (v) => {
    if (JSON.stringify(v) !== JSON.stringify(config.value)) {
      config.value = normalizeThemeConfig(v)
    }
  },
)

watch(
  config,
  () => {
    emit('update:modelValue', JSON.parse(JSON.stringify(config.value)))
  },
  { deep: true },
)

const colorFields = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'accent', label: 'Accent' },
  { key: 'background', label: 'Background' },
  { key: 'surface', label: 'Surface' },
  { key: 'text', label: 'Text' },
  { key: 'textMuted', label: 'Text Muted' },
]

const fontRoles = [
  { key: 'heading', label: 'Heading' },
  { key: 'script', label: 'Script' },
  { key: 'body', label: 'Body' },
]

function onFontChange(role, family) {
  const entry = FONT_CATALOGUE[role].find((f) => f.family === family)
  if (!entry) return
  config.value.fonts[role] = {
    family: entry.family,
    weights: [...entry.weights],
    fallback: entry.fallback,
  }
}

function onBackgroundTypeChange(key, type) {
  applyBackgroundType(config.value.sections[key], type)
}

// --- Live preview iframe ---
const previewSrc = '/live-preview?mode=live&preview=true&templateId=dynamic-theme&frame=true'
const previewIframe = ref(null)
const previewReady = ref(false)
const showPreview = ref(false)
let debounceTimer = null

function postPreview() {
  try {
    previewIframe.value?.contentWindow?.postMessage(buildPreviewMessage(config.value), '*')
  } catch {
    // never let a preview error break the form
  }
}

function onWindowMessage(event) {
  if (event.data?.type === 'PREVIEW_READY') {
    previewReady.value = true
    postPreview()
  }
}

watch(
  config,
  () => {
    if (!previewReady.value) return
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(postPreview, 300)
  },
  { deep: true },
)

onMounted(() => {
  window.addEventListener('message', onWindowMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', onWindowMessage)
  clearTimeout(debounceTimer)
})
</script>
