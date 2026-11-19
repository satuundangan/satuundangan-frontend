import { describe, it, expect, beforeEach } from 'vitest'
import { loadGoogleFont, _resetLoadedFonts } from './fontLoader'

describe('fontLoader', () => {
  beforeEach(() => {
    _resetLoadedFonts()
    document.head.querySelectorAll('link[rel="stylesheet"]').forEach((el) => {
      if (el.href.includes('fonts.googleapis.com')) {
        el.remove()
      }
    })
  })

  it('injects a link element into document.head with correct attributes', () => {
    const url = 'https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap'
    loadGoogleFont(url)

    const link = Array.from(document.head.querySelectorAll('link')).find(
      (el) => el.getAttribute('href') === url
    )
    expect(link).toBeDefined()
    expect(link?.rel).toBe('stylesheet')
  })

  it('does not duplicate link tags if called multiple times with the same url', () => {
    const url = 'https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap'
    loadGoogleFont(url)
    loadGoogleFont(url)

    const links = Array.from(document.head.querySelectorAll('link')).filter(
      (el) => el.getAttribute('href') === url
    )
    expect(links.length).toBe(1)
  })

  it('ignores empty or falsy urls without throwing error', () => {
    expect(() => loadGoogleFont('')).not.toThrow()
    expect(() => loadGoogleFont(null)).not.toThrow()
    expect(() => loadGoogleFont(undefined)).not.toThrow()
  })
})
