/**
 * Curated wedding dress code color palette presets and utility functions.
 * Designed for Indonesian wedding ceremonies, modern receptions, and traditional motifs.
 */

export const DRESS_CODE_PRESETS = [
  {
    id: 'sage-terracotta',
    name: 'Sage & Terracotta',
    category: 'Earthy Warm',
    colors: ['#8A9A5B', '#DDA15E', '#BC6C25', '#283618', '#FEFAE0']
  },
  {
    id: 'emerald-gold',
    name: 'Emerald & Gold',
    category: 'Royal Luxury',
    colors: ['#046A38', '#D4AF37', '#1B4332', '#E8C15A', '#2D6A4F']
  },
  {
    id: 'dusty-blue-silver',
    name: 'Dusty Blue & Silver',
    category: 'Serene Blue',
    colors: ['#778DA9', '#415A77', '#E0E1DD', '#1B263B', '#A9BCD0']
  },
  {
    id: 'rose-gold-champagne',
    name: 'Rose Gold & Champagne',
    category: 'Romantic Glam',
    colors: ['#B76E79', '#F4C2C2', '#E6C280', '#5E503F', '#FDF0ED']
  },
  {
    id: 'earth-tone-nude',
    name: 'Earth Tone & Nude',
    category: 'Modern Neutral',
    colors: ['#8C6D58', '#C3A995', '#D8C7B8', '#5E4A3E', '#F7EDE2']
  },
  {
    id: 'monochrome-noir',
    name: 'Monochrome Noir',
    category: 'Black Tie',
    colors: ['#0F0F0F', '#333333', '#777777', '#C0C0C0', '#FFFFFF']
  },
  {
    id: 'heritage-sogan',
    name: 'Heritage Sogan & Maroon',
    category: 'Traditional Culture',
    colors: ['#582F0E', '#7F4F24', '#936639', '#660708', '#D4A373']
  },
  {
    id: 'pastel-lilac-blush',
    name: 'Pastel Lilac & Blush',
    category: 'Dreamy Pastel',
    colors: ['#9C8EB9', '#C8B6FF', '#B8C0FF', '#E7C6FF', '#FDE2E4']
  }
]

export const MAX_DRESS_CODE_COLORS = 6

/**
 * Checks if a string is a valid 3 or 6 digit hex color code.
 * @param {string} hex
 * @returns {boolean}
 */
export function isValidHex(hex) {
  if (!hex || typeof hex !== 'string') return false
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex.trim())
}

/**
 * Normalizes hex code (adds # if omitted, trims whitespace, standardizes casing).
 * @param {string} raw
 * @returns {string|null}
 */
export function normalizeHex(raw) {
  if (!raw || typeof raw !== 'string') return null
  let val = raw.trim()
  if (!val.startsWith('#')) {
    val = '#' + val
  }
  if (!isValidHex(val)) return null
  if (val.length === 4) {
    // Expand #RGB to #RRGGBB
    val = '#' + val[1] + val[1] + val[2] + val[2] + val[3] + val[3]
  }
  return val.toUpperCase()
}

/**
 * Calculates adaptive border color based on color brightness.
 * Prevents light colors (e.g. #FFFFFF) from disappearing on white backgrounds,
 * and dark colors from disappearing on dark backgrounds.
 * @param {string} hex
 * @returns {string} RGBA border string
 */
export function getContrastBorder(hex) {
  const norm = normalizeHex(hex)
  if (!norm) return 'rgba(0, 0, 0, 0.12)'

  const r = parseInt(norm.slice(1, 3), 16)
  const g = parseInt(norm.slice(3, 5), 16)
  const b = parseInt(norm.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  // Very light color: add dark subtle border
  if (brightness > 220) return 'rgba(0, 0, 0, 0.18)'
  // Very dark color: add light subtle border
  if (brightness < 45) return 'rgba(255, 255, 255, 0.28)'
  return 'rgba(0, 0, 0, 0.08)'
}

/**
 * Returns a gentle colored shadow for color swatches.
 * @param {string} hex
 * @returns {string} CSS box-shadow string
 */
export function getSwatchShadow(hex) {
  const norm = normalizeHex(hex)
  if (!norm) return '0 1px 3px rgba(0,0,0,0.1)'
  return `0 2px 6px ${norm}33`
}
