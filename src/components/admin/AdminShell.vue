<template>
  <div class="min-h-screen flex bg-slate-50 text-slate-900">
    <AdminSidebar class="hidden lg:flex" />

    <div class="flex-1 flex flex-col">
      <header class="border-b border-slate-200 bg-white">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4">
          <div>
            <h1 class="text-xl font-semibold">{{ title }}</h1>
            <p v-if="description" class="text-sm text-slate-500">{{ description }}</p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 sm:items-center w-full sm:w-auto">
            <div v-if="showSearch" class="relative flex-1 sm:flex-initial">
              <span class="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m21 21-3-3m-4 2a7 7 0 1 0-9.9-9.9 7 7 0 0 0 9.9 9.9z" />
                </svg>
              </span>
              <input
                :value="search"
                :placeholder="searchPlaceholder"
                @input="emit('update:search', $event.target.value)"
                class="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                type="text"
              />
            </div>

            <button
              v-if="actionLabel"
              @click="emit('action')"
              class="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
            >
              {{ actionLabel }}
            </button>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto px-6 py-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from './AdminSidebar.vue'

defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  showSearch: { type: Boolean, default: false },
  search: { type: String, default: '' },
  searchPlaceholder: { type: String, default: 'Search…' },
  actionLabel: { type: String, default: '' },
})

const emit = defineEmits(['update:search', 'action'])
</script>
