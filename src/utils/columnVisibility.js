import { ref } from 'vue'

/**
 * Per-table column choice kept in this browser only. Storage can be missing or blocked, in which case
 * every column simply stays visible.
 */
export function useColumnVisibility(storageKey, columns) {
  const key = `admin-columns:${storageKey}`
  const all = columns.map((column) => column.key)
  const hidden = ref(new Set())

  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]')
    if (Array.isArray(saved)) {
      hidden.value = new Set(
        saved.filter((name) => all.includes(name) && !columns.find((c) => c.key === name)?.required),
      )
    }
  } catch {
    hidden.value = new Set()
  }

  const persist = () => {
    try {
      localStorage.setItem(key, JSON.stringify([...hidden.value]))
    } catch {
      // not persisted; the choice still applies for this visit
    }
  }

  return {
    columns,
    hidden,
    isVisible: (name) => !hidden.value.has(name),
    toggle(name) {
      if (columns.find((column) => column.key === name)?.required) return
      const next = new Set(hidden.value)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      hidden.value = next
      persist()
    },
    reset() {
      hidden.value = new Set()
      persist()
    },
  }
}
