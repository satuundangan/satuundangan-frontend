import { describe, it, expect, beforeEach } from 'vitest'
import {
  isSidebarOpen,
  toggleSidebar,
  closeSidebar,
  openSidebar,
  useDashboardSidebar,
} from './useDashboardSidebar'

describe('useDashboardSidebar composable', () => {
  beforeEach(() => {
    // Reset to open by default for deterministic test starting state
    isSidebarOpen.value = true
  })

  it('provides a module-level reactive isSidebarOpen ref', () => {
    const instanceA = useDashboardSidebar()
    const instanceB = useDashboardSidebar()

    expect(instanceA.isSidebarOpen.value).toBe(true)
    expect(instanceB.isSidebarOpen.value).toBe(true)

    // Mutate through instance A
    instanceA.isSidebarOpen.value = false

    // Should reflect across instance B and direct export
    expect(instanceB.isSidebarOpen.value).toBe(false)
    expect(isSidebarOpen.value).toBe(false)
  })

  it('toggles sidebar state with toggleSidebar', () => {
    const { isSidebarOpen: state, toggleSidebar: toggle } = useDashboardSidebar()

    expect(state.value).toBe(true)
    toggle()
    expect(state.value).toBe(false)
    toggle()
    expect(state.value).toBe(true)

    // Also works with direct export
    toggleSidebar()
    expect(state.value).toBe(false)
  })

  it('closes sidebar with closeSidebar', () => {
    const { isSidebarOpen: state, closeSidebar: close } = useDashboardSidebar()

    state.value = true
    close()
    expect(state.value).toBe(false)

    // Idempotent
    close()
    expect(state.value).toBe(false)

    // Direct export
    state.value = true
    closeSidebar()
    expect(state.value).toBe(false)
  })

  it('opens sidebar with openSidebar', () => {
    const { isSidebarOpen: state, openSidebar: open } = useDashboardSidebar()

    state.value = false
    open()
    expect(state.value).toBe(true)

    // Idempotent
    open()
    expect(state.value).toBe(true)

    // Direct export
    state.value = false
    openSidebar()
    expect(state.value).toBe(true)
  })

  it('shares operations across separate caller instances', () => {
    const caller1 = useDashboardSidebar()
    const caller2 = useDashboardSidebar()

    caller1.openSidebar()
    expect(caller2.isSidebarOpen.value).toBe(true)

    caller2.closeSidebar()
    expect(caller1.isSidebarOpen.value).toBe(false)

    caller1.toggleSidebar()
    expect(caller2.isSidebarOpen.value).toBe(true)
  })
})
