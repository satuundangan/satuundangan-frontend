<template>
  <div class="mb-3" data-testid="table-status">
    <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
      <p v-if="updatedAt && !error" data-testid="table-updated">
        Diperbarui {{ updatedLabel }} WIB
      </p>
      <span v-else></span>
      <div class="flex flex-wrap items-center gap-2">
        <slot name="actions" />
        <details v-if="columns.length" class="relative">
          <summary class="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700">
            Kolom
          </summary>
          <div class="absolute right-0 z-20 mt-1 w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
            <label v-for="column in columns" :key="column.key" class="flex items-center gap-2 py-1 text-xs text-slate-700">
              <input
                type="checkbox"
                :checked="visibility.isVisible(column.key)"
                :disabled="column.required"
                @change="visibility.toggle(column.key)"
              />
              {{ column.label }}
            </label>
            <button type="button" class="mt-2 text-xs underline" @click="visibility.reset()">Tampilkan semua</button>
          </div>
        </details>
        <button
          v-if="exportable"
          type="button"
          class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 disabled:opacity-50"
          :disabled="exporting"
          @click="$emit('export')"
        >
          {{ exporting ? 'Menyiapkan…' : 'Ekspor CSV (semua hasil)' }}
        </button>
      </div>
    </div>

    <div v-if="error" role="alert" class="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800" data-testid="table-error">
      <p class="font-semibold">Data gagal dimuat</p>
      <p class="mt-1">{{ error }}</p>
      <p class="mt-1 text-xs">Ini bukan berarti datanya kosong. Coba muat ulang.</p>
      <button type="button" class="mt-2 rounded-lg bg-rose-700 px-3 py-1.5 text-xs font-semibold text-white" @click="$emit('retry')">
        Coba lagi
      </button>
    </div>

    <div
      v-else-if="!loading && count === 0 && filtered"
      role="status"
      class="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"
      data-testid="table-filtered-empty"
    >
      Tidak ada hasil untuk filter yang aktif.
      <button type="button" class="ml-1 underline" @click="$emit('reset')">Reset filter</button>
    </div>
    <p v-if="exportNote" class="mt-2 text-xs text-amber-800" role="status">{{ exportNote }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  error: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  count: { type: Number, default: 0 },
  filtered: { type: Boolean, default: false },
  updatedAt: { type: [Date, String, Number], default: null },
  exportable: { type: Boolean, default: false },
  exporting: { type: Boolean, default: false },
  exportNote: { type: String, default: '' },
  visibility: { type: Object, default: null },
})
defineEmits(['retry', 'reset', 'export'])

const columns = computed(() => (props.visibility ? props.visibility.columns : []))
const updatedLabel = computed(() =>
  props.updatedAt
    ? new Date(props.updatedAt).toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        dateStyle: 'medium',
        timeStyle: 'medium',
      })
    : '',
)
</script>
