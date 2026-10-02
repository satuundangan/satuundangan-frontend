/**
 * SatuUndangan Client Telemetry & Activity Logger
 * Safely reports page views, user interactions, and client-side errors to backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.satuundangan.id'
let isSending = false
const eventQueue = []

// Flush queued telemetry events to backend
async function flushQueue() {
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
