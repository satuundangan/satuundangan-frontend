import { describe, it, expect, vi, beforeEach } from 'vitest'

const { apiFetch } = vi.hoisted(() => ({ apiFetch: vi.fn() }))
vi.mock('./client', () => ({ apiFetch }))

import { getLiveScreenFeed } from './invitation'

describe('getLiveScreenFeed (invitation.js)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls live-feed with default empty options', () => {
    getLiveScreenFeed('romeo-juliet')
    expect(apiFetch).toHaveBeenCalledWith('/invitation/slug/romeo-juliet/live-feed', {
      headers: {},
    })
  })

  it('calls live-feed with preview query when options.preview is true', () => {
    getLiveScreenFeed('romeo-juliet', { preview: true })
    expect(apiFetch).toHaveBeenCalledWith('/invitation/slug/romeo-juliet/live-feed?preview=true', {
      headers: {},
    })
  })

  it('passes If-None-Match header when options.etag is provided', () => {
    getLiveScreenFeed('romeo-juliet', { etag: '"etag-12345"' })
    expect(apiFetch).toHaveBeenCalledWith('/invitation/slug/romeo-juliet/live-feed', {
      headers: {
        'If-None-Match': '"etag-12345"',
      },
    })
  })

  it('supports both preview and etag together', () => {
    getLiveScreenFeed('romeo-juliet', { preview: true, etag: '"etag-67890"' })
    expect(apiFetch).toHaveBeenCalledWith('/invitation/slug/romeo-juliet/live-feed?preview=true', {
      headers: {
        'If-None-Match': '"etag-67890"',
      },
    })
  })
})
