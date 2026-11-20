import { ref } from 'vue'

export const isSidebarOpen = ref(
  typeof window !== 'undefined' ? window.innerWidth >= 768 : true,
)

export function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

export function closeSidebar() {
  isSidebarOpen.value = false
}

export function openSidebar() {
  isSidebarOpen.value = true
}

export function useDashboardSidebar() {
  return {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar,
  }
}
