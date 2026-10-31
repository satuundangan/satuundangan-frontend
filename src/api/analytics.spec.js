import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const provider = vi.hoisted(() => ({ init: vi.fn(), track: vi.fn(), identify: vi.fn(), alias: vi.fn(), reset: vi.fn(), people: { set: vi.fn(), set_once: vi.fn() } }))
vi.mock('mixpanel-browser', () => ({ default: provider }))

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
  vi.stubEnv('PROD', true)
  vi.stubEnv('DEV', false)
  vi.stubEnv('VITE_ANALYTICS_ENABLED', 'true')
  window.gtag = vi.fn()
  window.history.replaceState({}, '', '/')
})
afterEach(() => vi.unstubAllEnvs())

const route = (path, name, pattern = path) => ({ path, fullPath: path, name, matched: [{ path: pattern }], meta: {} })

describe('canonical analytics measurement', () => {
  it('disables automatic Mixpanel pageviews and sends one manual pageview to each provider', async () => {
    const { analytics } = await import('./analytics.js')
    analytics.trackNavigation(route('/blog', 'blog-list'), route('/', 'home'))
    expect(provider.init).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ track_pageview: false, autocapture: false, save_referrer: false }))
    expect(provider.track.mock.calls.filter(([name]) => name === 'Page View')).toHaveLength(1)
    expect(window.gtag.mock.calls.filter(([type, name]) => type === 'event' && name === 'page_view')).toHaveLength(1)
  })

  it('ends the previous page duration before recording and timing the next page', async () => {
    vi.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(6500)
    const { analytics } = await import('./analytics.js')
    analytics.trackNavigation(route('/', 'home'), route('', undefined))
    analytics.trackNavigation(route('/templates', 'Templates'), route('/', 'home'))
    expect(provider.track.mock.calls.map(([name]) => name)).toEqual(['Page View', 'Time on Page', 'Page View'])
    expect(provider.track.mock.calls[1][1]).toMatchObject({ path: '/', duration_seconds: 5.5 })
    vi.restoreAllMocks()
  })

  it('suppresses admin and test activity and does not identify admins', async () => {
    const { analytics } = await import('./analytics.js')
    analytics.trackNavigation(route('/admin/payments', 'admin-payments'), route('/', 'home'), { isAdmin: true })
    analytics.identify(5, { role: 'admin', email: 'admin@example.com' })
    analytics.trackAction('Admin exported payments', { email: 'admin@example.com' })
    expect(provider.track).not.toHaveBeenCalled()
    expect(provider.identify).not.toHaveBeenCalled()
    expect(window.gtag).not.toHaveBeenCalled()
  })

  it('redacts invitation names, personal query fields and auth tokens from every outgoing provider payload', async () => {
    const { analytics } = await import('./analytics.js')
    analytics.trackNavigation(route('/inv/andi-siti/budi?token=secret&to=Budi', 'invitation.guest', '/inv/:slug/:guestSlug'), route('/auth/callback?token=jwt-secret', 'auth-callback'))
    analytics.identify(4, { email: 'budi@example.com', name: 'Budi', role: 'user' })
    analytics.trackAction('Studio Editor - Submitted', { invitationId: 99, title: 'Budi Wedding', email: 'budi@example.com', token: 'secret', path: '/inv/andi-siti/budi?token=secret', template_id: 3 })
    const sent = JSON.stringify([provider.track.mock.calls, provider.people.set.mock.calls, window.gtag.mock.calls])
    expect(sent).not.toMatch(/andi-siti|Budi|budi@example|jwt-secret|\?token|"secret"/)
    expect(provider.track.mock.calls[0][1]).toMatchObject({ site_area: 'guest', path: '/invitation' })
    expect(provider.people.set).toHaveBeenCalledWith({ role: 'user' })
  })

  it('retains only safe campaign fields and separates app, marketing, guest and demo routes', async () => {
    const { analytics, classifyAnalyticsRoute } = await import('./analytics.js')
    expect(classifyAnalyticsRoute(route('/checkout', 'checkout'))).toBe('app')
    expect(classifyAnalyticsRoute(route('/demo/royal-gold', 'demo'))).toBe('demo')
    expect(classifyAnalyticsRoute(route('/', 'invitation'))).toBe('guest')
    expect(classifyAnalyticsRoute(route('/', 'home'))).toBe('marketing')
    analytics.trackNavigation(route('/?utm_source=instagram&utm_campaign=nikah&email=person@example.com', 'home'), route('', undefined))
    expect(provider.track.mock.calls[0][1]).toMatchObject({ campaign_source: 'instagram', campaign_name: 'nikah' })
    expect(JSON.stringify(provider.track.mock.calls)).not.toContain('person@example.com')
  })
})
