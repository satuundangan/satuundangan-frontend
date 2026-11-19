import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiFetch } from './client'

describe('apiFetch (client.js)', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('returns { notModified: true, status: 304, headers } when res.status === 304', async () => {
    const mockHeaders = new Headers({
      etag: '"sample-etag"',
    })
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 304,
      ok: false,
      headers: mockHeaders,
    })

    const res = await apiFetch('/test-endpoint', {
      headers: { 'If-None-Match': '"sample-etag"' },
    })

    expect(res).toEqual({
      notModified: true,
      status: 304,
      headers: mockHeaders,
    })
  })

  it('parses JSON and attaches etag from headers if present on 200 response', async () => {
    const mockHeaders = new Headers({
      'content-type': 'application/json',
      etag: '"v2-etag"',
    })
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      headers: mockHeaders,
      json: vi.fn().mockResolvedValue({ coupleName: 'Romeo & Juliet' }),
    })

    const data = await apiFetch('/invitation/slug/romeo-juliet/live-feed')
    expect(data).toEqual({
      coupleName: 'Romeo & Juliet',
      etag: '"v2-etag"',
    })
  })

  it('throws error when res.ok is false and status is not 304', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 404,
      ok: false,
      json: vi.fn().mockResolvedValue({ message: 'Not found' }),
    })

    await expect(apiFetch('/non-existent')).rejects.toThrow('Not found')
  })
})
