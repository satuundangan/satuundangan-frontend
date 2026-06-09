<template>
  <div>
    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-50 text-left font-medium text-slate-500 uppercase tracking-wider text-[10px]">
            <tr>
              <th v-for="header in headers" :key="header.key" class="px-4 py-4" :class="[header.class, header.sortable ? 'cursor-pointer hover:bg-slate-100 transition-colors' : '']" @click="header.sortable ? handleSort(header.key) : null">
                <div class="flex items-center gap-2">
                  {{ header.label }}
                  <span v-if="header.sortable" class="flex flex-col text-[8px] opacity-40">
                    <i class="fa-solid fa-chevron-up -mb-1" :class="sortBy === header.key && sortOrder === 'ASC' ? 'text-slate-900 opacity-100' : ''"></i>
                    <i class="fa-solid fa-chevron-down" :class="sortBy === header.key && sortOrder === 'DESC' ? 'text-slate-900 opacity-100' : ''"></i>
                  </span>
                </div>
              </th>
            </tr>
            <tr v-if="headers.some(h => h.filterable)" class="border-t border-slate-100">
              <th v-for="header in headers" :key="`filter-${header.key}`" class="px-4 py-2 bg-slate-50/50">
                <div v-if="header.filterable">
                  <slot :name="`filter(${header.key})`" :filter="filters[header.key]" :updateFilter="(val) => handleFilter(header.key, val)">
                    <input 
                      :value="filters[header.key]" 
                      @input="handleFilter(header.key, $event.target.value)"
                      type="text" 
                      class="w-full rounded border border-slate-200 bg-white px-2 py-1 text-[10px] font-normal lowercase outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-100"
                      :placeholder="`Filter ${header.label}...`"
                    />
                  </slot>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <template v-if="!loading && items.length">
              <tr v-for="(item, index) in items" :key="item.id || index" class="hover:bg-slate-50/50 transition-colors">
                <td v-for="header in headers" :key="header.key" class="px-4 py-3" :class="header.cellClass">
                  <slot :name="`cell(${header.key})`" :item="item" :value="item[header.key]">
                    <span class="text-slate-600">{{ item[header.key] !== null && item[header.key] !== undefined ? item[header.key] : '-' }}</span>
                  </slot>
                </td>
              </tr>
            </template>
            
            <tr v-if="!loading && !items.length">
              <td :colspan="headers.length" class="px-4 py-12 text-center">
                <div class="flex flex-col items-center justify-center text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-2 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <slot name="empty">Tidak ada data ditemukan</slot>
                </div>
              </td>
            </tr>

            <tr v-if="loading">
              <td :colspan="headers.length" class="px-4 py-12 text-center">
                <div class="flex flex-col items-center justify-center text-slate-400">
                  <div class="relative h-10 w-10 mb-2">
                    <div class="absolute inset-0 rounded-full border-2 border-slate-100"></div>
                    <div class="absolute inset-0 rounded-full border-2 border-slate-900 border-t-transparent animate-spin"></div>
                  </div>
                  <span>Memuat data…</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="total > limit" class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
      <p>Menampilkan <span class="text-slate-900">{{ startRange }}</span> - <span class="text-slate-900">{{ endRange }}</span> dari <span class="text-slate-900">{{ total }}</span> data</p>
      
      <div class="flex items-center gap-1">
        <button 
          class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors" 
          :disabled="page === 1" 
          @click="emit('update:page', page - 1)"
          title="Sebelumnya"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div class="flex items-center gap-1">
          <template v-for="(p, i) in displayedPages" :key="i">
            <button 
              v-if="typeof p === 'number'"
              @click="emit('update:page', p)"
              class="min-w-[32px] h-8 flex items-center justify-center rounded-lg border transition-all"
              :class="p === page ? 'bg-slate-900 border-slate-900 text-white shadow-sm shadow-slate-200' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
            >
              {{ p }}
            </button>
            <span v-else class="px-1 text-slate-300">...</span>
          </template>
        </div>

        <button 
          class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors" 
          :disabled="page === totalPages" 
          @click="emit('update:page', page + 1)"
          title="Berikutnya"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps({
  headers: { type: Array, required: true }, // [{ label: 'Name', key: 'name', class: '...', cellClass: '...', sortable: true, filterable: true }]
  items: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  total: { type: Number, default: 0 },
  page: { type: Number, default: 1 },
  limit: { type: Number, default: 10 },
  sortBy: { type: String, default: 'id' },
  sortOrder: { type: String, default: 'DESC' },
  filters: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:page', 'update:sortBy', 'update:sortOrder', 'update:sort', 'update:filters', 'filter'])

function handleSort(key) {
  let order = 'ASC'
  if (props.sortBy === key) {
    order = props.sortOrder === 'ASC' ? 'DESC' : 'ASC'
  }
  emit('update:sortBy', key)
  emit('update:sortOrder', order)
  emit('update:sort', { sortBy: key, sortOrder: order })
}

const debouncedFilter = useDebounceFn((key, value) => {
  const newFilters = { ...props.filters, [key]: value }
  emit('update:filters', newFilters)
  emit('filter', newFilters)
}, 500)

function handleFilter(key, value) {
  debouncedFilter(key, value)
}

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.limit)))

const startRange = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.limit + 1))
const endRange = computed(() => Math.min(props.page * props.limit, props.total))

const displayedPages = computed(() => {
  const current = props.page
  const last = totalPages.value
  const delta = 1
  const left = current - delta
  const right = current + delta + 1
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= left && i < right)) {
      range.push(i)
    }
  }

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  }

  return rangeWithDots
})
</script>
