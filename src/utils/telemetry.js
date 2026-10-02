/**
 * SatuUndangan Client Telemetry & Activity Logger
 * Safely reports page views, user interactions, and client-side errors to backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.satuundangan.id'
const EXCLUDE_STORAGE_KEY = 'exclude_telemetry'
let isSending = false
const eventQueue = []

/**
 * Check if current browser / device should be excluded from telemetry tracking
 */
export function isTelemetryExcluded() {
  if (typeof window === 'undefined') return true

  try {
    // 1. Quick URL parameter switch (e.g. https://satuundangan.id/?dev=1 or ?exclude_tracking=1)
    if (window.location && window.location.search) {
      const params = new URLSearchParams(window.location.search)
      if (params.get('dev') === '1' || params.get('exclude_tracking') === '1') {
        localStorage.setItem(EXCLUDE_STORAGE_KEY, 'true')
        return true
      }
      if (params.get('dev') === '0' || params.get('enable_tracking') === '1') {
        localStorage.removeItem(EXCLUDE_STORAGE_KEY)
        return false
      }
    }

    // 2. Check localStorage opt-out
    if (localStorage.getItem(EXCLUDE_STORAGE_KEY) === 'true') {
      return true
    }

    // 3. Check window global override flag
    if (window.__EXCLUDE_TELEMETRY__ === true) {
      return true
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }

  return false
}

/**
 * Enable or disable telemetry exclusion for this browser
 */
export function setTelemetryExcluded(excluded = true) {
  try {
    if (excluded) {
      localStorage.setItem(EXCLUDE_STORAGE_KEY, 'true')
      console.info('[Telemetry] 🛡️ Developer Mode: Tracking DISABLED for this browser.')
    } else {
      localStorage.removeItem(EXCLUDE_STORAGE_KEY)
      console.info('[Telemetry] 👁️ Tracking ENABLED for this browser.')
    }
  } catch (e) {
    console.warn('[Telemetry] Storage error:', e)
  }
  return isTelemetryExcluded()
}

// Expose global helper in browser DevTools console for developers
if (typeof window !== 'undefined') {
  window.setTelemetryExcluded = setTelemetryExcluded
  window.isTelemetryExcluded = isTelemetryExcluded
  window.toggleTelemetry = () => setTelemetryExcluded(!isTelemetryExcluded())
}

// Flush queued telemetry events to backend
async function flushQueue() {
  if (isTelemetryExcluded()) {
    eventQueue.length = 0
    return
  }

  if (isSending || eventQueue.length === 0) return
  isSending = true

  const event = eventQueue.shift()

  try {
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token')
    const headers = {
      'Content-Type': 'application/json',
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    await fetch(`${API_BASE_URL}/telemetry/log`, {
      method: 'POST',
      headers,
      body: JSON.stringify(event),
      keepalive: true,
    })
  } catch (err) {
    // Non-blocking, do not crash app on network drops
    console.debug('[Telemetry] log failed:', err?.message)
  } finally {
    isSending = false
    if (eventQueue.length > 0) {
      setTimeout(flushQueue, 150)
    }
  }
}

function queueEvent(event) {
  // Never queue or send if excluded
  if (isTelemetryExcluded()) {
    return
  }
  // Prevent unbounded queue growth if network is offline
  if (eventQueue.length > 30) {
    eventQueue.shift()
  }
  eventQueue.push(event)
  setTimeout(flushQueue, 50)
}

/**
 * Log page navigation
 */
export function trackPageView(path, title = '', metadata = {}) {
  // Ignore tracking for internal vite/dev assets
  if (!path || path.startsWith('/@') || path.startsWith('/node_modules')) return

  queueEvent({
    action: 'PAGE_VIEW',
    level: 'INFO',
    path,
    method: 'PAGE',
    details: {
      title: title || document.title,
      referrer: document.referrer || null,
      screen: `${window.innerWidth}x${window.innerHeight}`,
      ...metadata,
    },
  })
}

/**
 * Log specific user action (e.g. download QR, save draft, checkout)
 */
export function trackAction(action, details = {}, path = window.location.pathname) {
  queueEvent({
    action,
    level: 'ACTION',
    path,
    method: 'ACTION',
    details,
  })
}

/**
 * Log client-side error
 */
export function trackError(error, context = {}) {
  const message = error?.message || String(error)
  const stack = error?.stack || null

  queueEvent({
    action: 'CLIENT_ERROR',
    level: 'ERROR',
    path: window.location.pathname,
    method: 'ERROR',
    details: {
      message,
      stack: stack ? stack.split('\n').slice(0, 10).join('\n') : null,
      context,
      url: window.location.href,
    },
  })
}
