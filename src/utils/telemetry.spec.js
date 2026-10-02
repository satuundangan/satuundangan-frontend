import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  isTelemetryExcluded,
  setTelemetryExcluded,
  trackPageView,
  trackAction,
  trackError,
} from './telemetry.js'

describe('Telemetry & Dev Mode Exclusion', () => {
  beforeEach(() => {
    localStorage.clear()
    delete window.__EXCLUDE_TELEMETRY__
    // Reset window location search
    delete window.location
    window.location = new URL('https://satuundangan.id/dashboard')
    vi.restoreAllMocks()
  })

  it('defaults to not excluded when no flag or dev param is present', () => {
    expect(isTelemetryExcluded()).toBe(false)
  })

  it('is excluded when localStorage flag is set', () => {
    localStorage.setItem('exclude_telemetry', 'true')
    expect(isTelemetryExcluded()).toBe(true)
  })

  it('can be toggled using setTelemetryExcluded', () => {
    expect(setTelemetryExcluded(true)).toBe(true)
    expect(localStorage.getItem('exclude_telemetry')).toBe('true')

    expect(setTelemetryExcluded(false)).toBe(false)
    expect(localStorage.getItem('exclude_telemetry')).toBeNull()
  })

  it('automatically enables exclusion when URL has ?dev=1', () => {
    window.location = new URL('https://satuundangan.id/admin/logs?dev=1')
    expect(isTelemetryExcluded()).toBe(true)
    expect(localStorage.getItem('exclude_telemetry')).toBe('true')
  })

  it('automatically enables exclusion when URL has ?exclude_tracking=1', () => {
    window.location = new URL('https://satuundangan.id/?exclude_tracking=1')
    expect(isTelemetryExcluded()).toBe(true)
    expect(localStorage.getItem('exclude_telemetry')).toBe('true')
  })

  it('automatically disables exclusion when URL has ?dev=0', () => {
    localStorage.setItem('exclude_telemetry', 'true')
    window.location = new URL('https://satuundangan.id/?dev=0')
    expect(isTelemetryExcluded()).toBe(false)
    expect(localStorage.getItem('exclude_telemetry')).toBeNull()
  })

  it('does not send network request when tracking is excluded', () => {
    setTelemetryExcluded(true)
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    trackPageView('/test-page')
    trackAction('TEST_ACTION')
    trackError(new Error('test error'))

    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
