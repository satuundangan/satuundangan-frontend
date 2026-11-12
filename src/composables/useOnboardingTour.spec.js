import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  isStudioTourDone,
  isDashboardTourDone,
  setStudioTourDone,
  setDashboardTourDone,
  resetTourState,
  startStudioTour,
  startDashboardTour,
  useOnboardingTour,
  STORAGE_KEY_STUDIO,
  STORAGE_KEY_DASHBOARD,
} from './useOnboardingTour'

// Mock driver.js
const mockDrive = vi.fn()
const mockDestroy = vi.fn()
vi.mock('driver.js', () => ({
  driver: vi.fn((config) => ({
    drive: mockDrive,
    destroy: mockDestroy,
    config,
  })),
}))

vi.mock('driver.js/dist/driver.css', () => ({}))

describe('useOnboardingTour Composable', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    resetTourState()
  })

  it('correctly tracks and updates Studio tour state in localStorage', () => {
    expect(isStudioTourDone()).toBe(false)
    setStudioTourDone(true)
    expect(isStudioTourDone()).toBe(true)
    expect(localStorage.getItem(STORAGE_KEY_STUDIO)).toBe('true')

    setStudioTourDone(false)
    expect(isStudioTourDone()).toBe(false)
  })

  it('correctly tracks and updates Dashboard tour state in localStorage', () => {
    expect(isDashboardTourDone()).toBe(false)
    setDashboardTourDone(true)
    expect(isDashboardTourDone()).toBe(true)
    expect(localStorage.getItem(STORAGE_KEY_DASHBOARD)).toBe('true')

    setDashboardTourDone(false)
    expect(isDashboardTourDone()).toBe(false)
  })

  it('resets all tour state keys via resetTourState()', () => {
    setStudioTourDone(true)
    setDashboardTourDone(true)
    expect(isStudioTourDone()).toBe(true)
    expect(isDashboardTourDone()).toBe(true)

    resetTourState()
    expect(isStudioTourDone()).toBe(false)
    expect(isDashboardTourDone()).toBe(false)
  })

  it('startStudioTour skips execution if already completed and force is false', async () => {
    setStudioTourDone(true)
    const result = await startStudioTour({ force: false })
    expect(result).toBeNull()
    expect(mockDrive).not.toHaveBeenCalled()
  })

  it('startStudioTour runs when forced or when not yet completed', async () => {
    setStudioTourDone(true)
    const result = await startStudioTour({ force: true })
    expect(result).not.toBeNull()
    expect(mockDrive).toHaveBeenCalledTimes(1)
  })

  it('startDashboardTour skips execution if already completed and force is false', async () => {
    setDashboardTourDone(true)
    const result = await startDashboardTour({ force: false })
    expect(result).toBeNull()
    expect(mockDrive).not.toHaveBeenCalled()
  })

  it('startDashboardTour runs when forced or when not yet completed', async () => {
    const result = await startDashboardTour({ force: true })
    expect(result).not.toBeNull()
    expect(mockDrive).toHaveBeenCalledTimes(1)
  })

  it('provides convenient access through useOnboardingTour() helper', () => {
    const tour = useOnboardingTour()
    expect(typeof tour.startStudioTour).toBe('function')
    expect(typeof tour.startDashboardTour).toBe('function')
    expect(typeof tour.resetTourState).toBe('function')
    expect(tour.isStudioTourDone()).toBe(false)
  })
})
