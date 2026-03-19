import { describe, it, expect } from 'vitest'

describe('Invitation Name Decoding Logic', () => {
  const decodeGuestName = (encoded) => {
    try {
      const binaryString = atob(encoded)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      return new TextDecoder().decode(bytes)
    } catch (e) {
      return 'Tamu Undangan'
    }
  }

  it('should decode simple names correctly', () => {
    // 'Budi' in base64 is 'QnVkaQ=='
    expect(decodeGuestName('QnVkaQ==')).toBe('Budi')
  })

  it('should decode names with spaces correctly', () => {
    // 'Budi & Wati' in base64
    const encoded = btoa(unescape(encodeURIComponent('Budi & Wati')))
    expect(decodeGuestName(encoded)).toBe('Budi & Wati')
  })

  it('should decode UTF-8 characters correctly (Special Case)', () => {
    const originalName = 'Budi ❤️ Istri'
    // Encode to UTF-8 base64 (browser way)
    const encoded = btoa(unescape(encodeURIComponent(originalName)))
    
    expect(decodeGuestName(encoded)).toBe(originalName)
  })

  it('should return default name on invalid base64', () => {
    expect(decodeGuestName('invalid-base64!!!')).toBe('Tamu Undangan')
  })
})
