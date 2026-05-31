import mixpanel from 'mixpanel-browser'

// Initialize Mixpanel
const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN || '6930e65c99814590474a355354a87d03'

mixpanel.init(MIXPANEL_TOKEN, {
  debug: import.meta.env.DEV,
  track_pageview: true,
  persistence: 'localStorage',
})

export const analytics = {
  // Identify user
  identify(userId, userProps = {}) {
    if (userId) {
      mixpanel.identify(userId)
      if (Object.keys(userProps).length > 0) {
        // Map common props to Mixpanel reserved props
        const mappedProps = {
          $email: userProps.$email || userProps.email,
          $name: userProps.$name || userProps.name,
          ...userProps,
        }
        mixpanel.people.set(mappedProps)
      }
    }
  },

  // Set properties that should only be set once (e.g. Signup Date)
  setOnce(properties = {}) {
    mixpanel.people.set_once(properties)
  },

  // Track page view
  trackPage(pageName, properties = {}) {
    mixpanel.track('Page View', {
      page: pageName,
      ...properties,
    })
  },

  // Track specific action
  trackAction(actionName, properties = {}) {
    mixpanel.track(actionName, properties)
  },

  // Start timing an event
  startTimer(eventName) {
    mixpanel.time_event(eventName)
  },

  // End timing and track
  stopTimer(eventName, properties = {}) {
    mixpanel.track(eventName, properties)
  },

  // Alias user (on signup)
  alias(userId) {
    mixpanel.alias(userId)
  },

  // Reset on logout
  reset() {
    mixpanel.reset()
  },
}
