<template>
  <div class="min-h-screen flex bg-slate-50 text-slate-900">
    <a
      href="#admin-main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:p-3 focus:text-blue-700 focus:shadow-lg"
      >Lewati navigasi</a
    >
    <AdminSidebar class="hidden lg:flex" :inert="isMobileMenuOpen || undefined" />
    <div class="flex-1 flex flex-col min-w-0" :inert="isMobileMenuOpen || undefined">
      <header class="border-b border-slate-200 bg-white">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-4 sm:px-6"
        >
          <div class="flex items-start gap-3">
            <button
              ref="menuTrigger"
              type="button"
              aria-label="Buka menu admin"
              aria-controls="admin-mobile-navigation"
              :aria-expanded="isMobileMenuOpen"
              @click="openMobileMenu"
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 lg:hidden"
            >
              <i class="pi pi-bars" aria-hidden="true"></i>
            </button>
            <div class="min-w-0">
              <nav
                aria-label="Breadcrumb"
                class="mb-1 flex flex-wrap items-center gap-x-2 text-xs text-slate-500"
              >
                <template v-for="(crumb, index) in breadcrumbs" :key="crumb.label + index">
                  <span v-if="index" aria-hidden="true">/</span>
                  <RouterLink
                    v-if="index < breadcrumbs.length - 1"
                    :to="crumb.to"
                    class="rounded hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >{{ crumb.label }}</RouterLink
                  >
                  <span v-else aria-current="page" class="font-medium text-slate-700">{{
                    crumb.label
                  }}</span>
                </template>
              </nav>
              <h1 class="text-xl font-semibold">{{ title }}</h1>
              <p v-if="description" class="text-sm text-slate-500">{{ description }}</p>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 sm:items-center w-full sm:w-auto">
            <div v-if="showSearch" class="relative flex-1 sm:flex-initial">
              <span
                class="absolute inset-y-0 left-3 flex items-center text-slate-400"
                aria-hidden="true"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="m21 21-3-3m-4 2a7 7 0 1 0-9.9-9.9 7 7 0 0 0 9.9 9.9z"
                  />
                </svg>
              </span>
              <input
                :value="search"
                :placeholder="searchPlaceholder"
                :aria-label="searchPlaceholder"
                @input="emit('update:search', $event.target.value)"
                class="min-h-11 w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                type="search"
              />
            </div>
            <button
              v-if="actionLabel"
              type="button"
              @click="emit('action')"
              class="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {{ actionLabel }}
            </button>
            <slot name="actions" />
          </div>
        </div>
      </header>
      <main id="admin-main-content" tabindex="-1" class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <slot />
      </main>
    </div>
    <div v-if="isMobileMenuOpen" class="fixed inset-0 z-50 lg:hidden">
      <div
        data-testid="admin-navigation-backdrop"
        class="absolute inset-0 bg-slate-950/50"
        aria-hidden="true"
        @click="closeMobileMenu"
      ></div>
      <div
        id="admin-mobile-navigation"
        ref="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-navigation-title"
        tabindex="-1"
        class="relative flex h-full w-[min(22rem,calc(100vw-2rem))] flex-col bg-white shadow-xl"
      >
        <div class="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-2">
          <h2 id="admin-navigation-title" class="text-sm font-semibold text-slate-800">
            Navigasi admin
          </h2>
          <button
            type="button"
            aria-label="Tutup menu admin"
            @click="closeMobileMenu"
            class="flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <i class="pi pi-times" aria-hidden="true"></i>
          </button>
        </div>
        <AdminSidebar mobile class="min-h-0 flex-1" @navigate="closeMobileMenu" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AdminSidebar, { findAdminNavigationItem } from './AdminSidebar.vue'

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  showSearch: { type: Boolean, default: false },
  search: { type: String, default: '' },
  searchPlaceholder: { type: String, default: 'Cari…' },
  actionLabel: { type: String, default: '' },
})
const emit = defineEmits(['update:search', 'action'])
const route = useRoute()
const menuTrigger = ref(null)
const drawer = ref(null)
const isMobileMenuOpen = ref(false)
let previousOverflow
let returnFocusTo
let desktopQuery

const breadcrumbs = computed(() => {
  const current = findAdminNavigationItem(route.path)
  const items = [{ label: 'Dashboard', to: '/admin' }]
  if (current && current.to !== '/admin') items.push({ label: current.label, to: current.to })
  if (!current || route.path !== current.to) items.push({ label: props.title })
  return items
})

const focusableElements = () =>
  [
    ...(drawer.value?.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ) || []),
  ].filter((element) => !element.closest('[hidden]'))

function handleDrawerKeydown(event) {
  if (!isMobileMenuOpen.value) return
  if (event.key === 'Escape') {
    event.preventDefault()
    closeMobileMenu()
    return
  }
  if (event.key !== 'Tab') return
  const elements = focusableElements()
  const first = elements[0]
  const last = elements.at(-1)
  if (!first) {
    event.preventDefault()
    drawer.value?.focus()
  } else if (
    event.shiftKey &&
    (document.activeElement === first || !drawer.value?.contains(document.activeElement))
  ) {
    event.preventDefault()
    last.focus()
  } else if (
    !event.shiftKey &&
    (document.activeElement === last || !drawer.value?.contains(document.activeElement))
  ) {
    event.preventDefault()
    first.focus()
  }
}

function containDrawerFocus(event) {
  if (isMobileMenuOpen.value && !drawer.value?.contains(event.target)) {
    const target = focusableElements()[0] || drawer.value
    target?.focus()
  }
}

async function openMobileMenu() {
  if (isMobileMenuOpen.value) return
  returnFocusTo = document.activeElement
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  isMobileMenuOpen.value = true
  await nextTick()
  if (!isMobileMenuOpen.value) return
  document.addEventListener('keydown', handleDrawerKeydown)
  document.addEventListener('focusin', containDrawerFocus)
  const target = focusableElements()[0] || drawer.value
  target?.focus()
}

function releaseDrawer() {
  document.removeEventListener('keydown', handleDrawerKeydown)
  document.removeEventListener('focusin', containDrawerFocus)
  if (previousOverflow !== undefined) {
    document.body.style.overflow = previousOverflow
    previousOverflow = undefined
  }
}

async function closeMobileMenu() {
  if (!isMobileMenuOpen.value) return
  isMobileMenuOpen.value = false
  releaseDrawer()
  await nextTick()
  if (returnFocusTo?.isConnected) returnFocusTo.focus()
  else menuTrigger.value?.focus()
}

async function handleDesktopChange(event) {
  if (event.matches && isMobileMenuOpen.value) {
    await closeMobileMenu()
    // The mobile opener is hidden at this width, so return to visible navigation.
    const target =
      document.querySelector('#admin-desktop-navigation-links [aria-current="page"]') ||
      document.getElementById('admin-main-content')
    target?.focus()
  }
}

watch(() => route.fullPath, closeMobileMenu)
onMounted(() => {
  if (typeof window.matchMedia === 'function') {
    desktopQuery = window.matchMedia('(min-width: 1024px)')
    desktopQuery.addEventListener('change', handleDesktopChange)
  }
})
onBeforeUnmount(() => {
  isMobileMenuOpen.value = false
  releaseDrawer()
  desktopQuery?.removeEventListener('change', handleDesktopChange)
})
</script>
