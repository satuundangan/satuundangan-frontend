import mixpanel from 'mixpanel-browser'

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN || '6930e65c99814590474a355354a87d03'
const SCHEMA_VERSION = '2'
const PUBLIC_PATHS = /^\/(?:$|blog(?:\/|$)|templates$|tema(?:\/|$)|tools\/love-calculator$|wedding-planner$|tentang-kami$|terms$|privacy$|syarat-ketentuan$|kebijakan-privasi$)/
const SAFE_KEYS = new Set(['template_id', 'templateId', 'invitation_id', 'invitationId', 'package', 'step', 'step_index', 'section_count', 'selected_count', 'total_sections', 'currency', 'value', 'amount', 'payment_purpose', 'transaction_id', 'duration_seconds', 'role', 'method', 'source', 'success', 'error_code'])
let initialized = false
let adminIdentity = false
let current = null
const timers = new Map()

function environmentEnabled() {
  if (import.meta.env.VITE_ANALYTICS_ENABLED === 'false') return false
  if (import.meta.env.VITE_ANALYTICS_ENABLED === 'true') return true
  const host = window.location.hostname
  return import.meta.env.PROD && !/^(localhost|127\.|\[?::1\]?|development\.|preview\.)/.test(host)
}

export function classifyAnalyticsRoute(route = {}) {
  const path = String(route.path || route.fullPath || '/').split(/[?#]/)[0]
  const name = String(route.name || '')
  if (path.startsWith('/admin') || name.startsWith('admin-')) return 'admin'
  if (route.meta?.analytics === false || /^\/(?:pantau-anak-krakatau|smoke-studio)(?:\/|$)/.test(path)) return 'test'
  if (name === 'demo' || name === 'preview' || path.startsWith('/demo/')) return 'demo'
  if (name.startsWith('invitation') && name !== 'invitation.edit') return 'guest'
  if (/^\/inv\//.test(path)) return 'guest'
  if (PUBLIC_PATHS.test(path) || name === 'home') return 'marketing'
  if (/^\/(?:create|invitation|checkout|payment|auth|reset-password|dashboard|settings|guests|guestbook|invitations|planner|affiliate|legal-consent)(?:\/|$)/.test(path)) return 'app'
  return 'guest'
}

export function analyticsRouteContext(route = {}) {
  const area = classifyAnalyticsRoute(route)
  const rawPath = String(route.path || route.fullPath || '/').split(/[?#]/)[0]
  const matchedPath = route.matched?.at(-1)?.path
  let path = matchedPath || rawPath
  if (area === 'guest') path = '/invitation'
  else if (area === 'admin') path = '/admin'
  else if (/^\/invitation\//.test(path)) path = '/invitation/:id/edit'
  else if (!PUBLIC_PATHS.test(path) && area === 'app') {
    path = rawPath.replace(/\/(?:\d+)(?=\/|$)/g, '/:id')
  }
  if (/[?@#]/.test(path)) path = '/' + area
  return {
    site_area: area,
    page_type: String(route.name || area).replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 80),
    path,
    page_location: window.location.origin + path,
  }
}

function canTrack(context = current) {
  if (adminIdentity || !environmentEnabled()) return false
  const area = context?.site_area || classifyAnalyticsRoute({ path: window.location.pathname })
  return area !== 'admin' && area !== 'test'
}

function initialize() {
  if (initialized) return
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: false, track_pageview: false, autocapture: false, save_referrer: false,
    stop_utm_persistence: true,
    persistence: 'localStorage',
    property_blacklist: ['$current_url', '$referrer', '$initial_referrer', '$initial_referring_domain', '$email', '$name', 'mp_keyword', ...['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id'].flatMap((key) => [key, 'initial_' + key])],
  })
  initialized = true
}

function safeProperties(properties = {}) {
  const result = {}
  for (const [key, value] of Object.entries(properties)) {
    if (!SAFE_KEYS.has(key)) continue
    if (typeof value === 'number' && Number.isFinite(value)) result[key] = value
    else if (typeof value === 'boolean') result[key] = value
    else if (typeof value === 'string' && value.length <= 100 && !/[@?#]/.test(value)) result[key] = value
  }
  return result
}

function campaignProperties(fullPath) {
  const search = new URL(String(fullPath || '/'), window.location.origin).searchParams
  const result = {}
  for (const [utm, key] of Object.entries({ utm_source: 'campaign_source', utm_medium: 'campaign_medium', utm_campaign: 'campaign_name', utm_content: 'campaign_content', utm_term: 'campaign_term' })) {
    const value = search.get(utm)
    if (value && value.length <= 100 && /^[a-zA-Z0-9 _.-]+$/.test(value) && !/\d{7,}/.test(value)) result[key] = value
  }
  return result
}

function emit(mixpanelName, ga4Name, properties = {}, context = current) {
  if (!canTrack(context)) return
  initialize()
  const payload = {
    ...safeProperties(properties),
    ...(context || analyticsRouteContext({ path: window.location.pathname })),
    event_schema_version: SCHEMA_VERSION,
    environment: import.meta.env.PROD ? 'production' : 'development',
  }
  mixpanel.track(mixpanelName, payload)
  window.gtag?.('event', ga4Name, payload)
}

function gaEventName(name) {
  return ({ 'Login Success': 'login', 'Registration Success': 'sign_up', 'Studio Editor - Submitted': 'draft_saved', Logout: 'logout' })[name]
    || String(name).toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').slice(0, 40)
}

export const analytics = {
  identify(userId, properties = {}) {
    adminIdentity = properties.role === 'admin'
    if (!userId || !canTrack()) return
    initialize()
    mixpanel.identify(String(userId))
    const safe = safeProperties({ role: properties.role })
    if (Object.keys(safe).length) mixpanel.people.set(safe)
  },
  setOnce(properties = {}) {
    if (!canTrack()) return
    const date = properties['Signup Date']
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(date)) return
    initialize()
    mixpanel.people.set_once({ 'Signup Date': date })
  },
  trackPage(pageName, properties = {}) {
    const context = properties.path ? analyticsRouteContext({ path: properties.path, name: properties.name }) : current
    emit('Page View', 'page_view', properties, context)
  },
  trackNavigation(to, from, identity = {}) {
    adminIdentity = Boolean(identity.isAdmin)
    const next = analyticsRouteContext(to)
    const now = Date.now()
    if (current && canTrack(current)) {
      const started = timers.get('Time on Page')
      if (started != null) emit('Time on Page', 'page_duration', { duration_seconds: Math.max(0, (now - started) / 1000) }, current)
    }
    timers.delete('Time on Page')
    current = next
    if (!canTrack(next)) return next
    initialize()
    if (identity.userId) mixpanel.identify(String(identity.userId))
    const previous = analyticsRouteContext(from)
    const referrer = from?.name ? previous.page_location : externalReferrer()
    const campaign = campaignProperties(to.fullPath || to.path)
    window.gtag?.('set', { page_location: next.page_location, page_referrer: referrer, page_title: next.page_type, ...campaign })
    const payload = { ...next, page_referrer: referrer, page_title: next.page_type, ...campaign, event_schema_version: SCHEMA_VERSION, environment: import.meta.env.PROD ? 'production' : 'development' }
    mixpanel.track('Page View', payload)
    window.gtag?.('event', 'page_view', payload)
    timers.set('Time on Page', now)
    return next
  },
  trackAction(actionName, properties = {}) { emit(actionName, gaEventName(actionName), properties) },
  startTimer(eventName) { if (canTrack()) timers.set(eventName, Date.now()) },
  stopTimer(eventName, properties = {}) {
    const started = timers.get(eventName)
    timers.delete(eventName)
    if (started != null) emit(eventName, gaEventName(eventName), { ...properties, duration_seconds: Math.max(0, (Date.now() - started) / 1000) })
  },
  alias(userId) { if (userId && canTrack()) { initialize(); mixpanel.alias(String(userId)) } },
  reset() { if (initialized) mixpanel.reset(); adminIdentity = false; timers.clear() },
}

function externalReferrer() {
  try { return document.referrer ? new URL(document.referrer).origin : '' } catch { return '' }
}
