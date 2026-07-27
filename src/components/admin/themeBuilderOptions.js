// Pure, dependency-free (no Vue, no DOM) data + helpers for the admin ThemeBuilder form.
// Consumed by `ThemeBuilder.vue`. Font catalogues, section labels, and background-type
// switching all live here so they stay unit-testable without mounting a component.

import { THEME_SECTION_KEYS } from '@/utils/themeConfig'
import { demoData } from '@/api/demoData'

export const HEADING_FONTS = [
  { family: 'Cormorant Garamond', weights: [400, 600], fallback: 'serif' },
  { family: 'Playfair Display', weights: [400, 700], fallback: 'serif' },
  { family: 'Cinzel', weights: [400, 600], fallback: 'serif' },
  { family: 'Libre Baskerville', weights: [400, 700], fallback: 'serif' },
  { family: 'EB Garamond', weights: [400, 600], fallback: 'serif' },
  { family: 'Lora', weights: [400, 600], fallback: 'serif' },
  { family: 'Marcellus', weights: [400], fallback: 'serif' },
  { family: 'Prata', weights: [400], fallback: 'serif' },
  { family: 'Spectral', weights: [400, 600], fallback: 'serif' },
  { family: 'Crimson Text', weights: [400, 600], fallback: 'serif' },
  { family: 'Bodoni Moda', weights: [400, 700], fallback: 'serif' },
  { family: 'DM Serif Display', weights: [400], fallback: 'serif' },
  { family: 'Italiana', weights: [400], fallback: 'serif' },
  { family: 'Gilda Display', weights: [400], fallback: 'serif' },
  { family: 'Tenor Sans', weights: [400], fallback: 'serif' },
]

export const SCRIPT_FONTS = [
  { family: 'Great Vibes', weights: [400], fallback: 'cursive' },
  { family: 'Parisienne', weights: [400], fallback: 'cursive' },
  { family: 'Dancing Script', weights: [400], fallback: 'cursive' },
  { family: 'Sacramento', weights: [400], fallback: 'cursive' },
  { family: 'Allura', weights: [400], fallback: 'cursive' },
  { family: 'Pinyon Script', weights: [400], fallback: 'cursive' },
  { family: 'Petit Formal Script', weights: [400], fallback: 'cursive' },
  { family: 'Alex Brush', weights: [400], fallback: 'cursive' },
  { family: 'Tangerine', weights: [400], fallback: 'cursive' },
  { family: 'Yellowtail', weights: [400], fallback: 'cursive' },
  { family: 'Cookie', weights: [400], fallback: 'cursive' },
  { family: 'Marck Script', weights: [400], fallback: 'cursive' },
  { family: 'Italianno', weights: [400], fallback: 'cursive' },
  { family: 'Mrs Saint Delafield', weights: [400], fallback: 'cursive' },
  { family: 'Herr Von Muellerhoff', weights: [400], fallback: 'cursive' },
]

export const BODY_FONTS = [
  { family: 'Inter', weights: [300, 400, 600], fallback: 'sans-serif' },
  { family: 'Poppins', weights: [300, 400, 600], fallback: 'sans-serif' },
  { family: 'Montserrat', weights: [300, 400, 600], fallback: 'sans-serif' },
  { family: 'Lato', weights: [300, 400, 600], fallback: 'sans-serif' },
  { family: 'Nunito Sans', weights: [300, 400, 600], fallback: 'sans-serif' },
  { family: 'Work Sans', weights: [300, 400, 600], fallback: 'sans-serif' },
  { family: 'Karla', weights: [300, 400, 600], fallback: 'sans-serif' },
  { family: 'Raleway', weights: [300, 400, 600], fallback: 'sans-serif' },
  { family: 'Open Sans', weights: [300, 400, 600], fallback: 'sans-serif' },
  { family: 'Source Sans 3', weights: [300, 400, 600], fallback: 'sans-serif' },
  { family: 'Jost', weights: [300, 400, 600], fallback: 'sans-serif' },
  { family: 'DM Sans', weights: [300, 400, 600], fallback: 'sans-serif' },
  { family: 'Manrope', weights: [300, 400, 600], fallback: 'sans-serif' },
  { family: 'Rubik', weights: [300, 400, 600], fallback: 'sans-serif' },
  { family: 'Mulish', weights: [300, 400, 600], fallback: 'sans-serif' },
]

export const FONT_CATALOGUE = {
  heading: HEADING_FONTS,
  script: SCRIPT_FONTS,
  body: BODY_FONTS,
}

export const HERO_VARIANTS = [
  { value: 'classic', label: 'Klasik' },
  { value: 'full-photo', label: 'Foto Penuh' },
  { value: 'framed', label: 'Berbingkai' },
]

export const BACKGROUND_TYPES = ['color', 'gradient', 'image']

export const SECTION_LABELS = {
  hero: 'Hero/Sampul',
  quote: 'Kutipan',
  couple: 'Mempelai',
  event: 'Acara',
  'love-story': 'Kisah Cinta',
  gallery: 'Galeri',
  gift: 'Hadiah',
  rsvp: 'RSVP',
  wishes: 'Ucapan',
  footer: 'Footer',
}

const BACKGROUND_TYPE_DEFAULTS = {
  color: { value: '#ffffff' },
  gradient: { from: '#ffffff', to: '#ffffff', direction: '180deg' },
  image: { url: '' },
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Replace `section.background` with a well-formed object for the requested
 * `type`, carrying over any already-set values and filling in defaults for
 * whatever is missing. Mutates `section` in place (and returns it) so it can
 * be used directly as a `@change` handler against a reactive section entry.
 * Never drops sibling keys (`ornamentTop`/`ornamentBottom`).
 */
export function applyBackgroundType(section, type) {
  const target = isPlainObject(section) ? section : {}
  const current = isPlainObject(target.background) ? target.background : {}
  const defaults = BACKGROUND_TYPE_DEFAULTS[type] || BACKGROUND_TYPE_DEFAULTS.color
  const nextBackground = { type }

  for (const key of Object.keys(defaults)) {
    nextBackground[key] = current[key] !== undefined ? current[key] : defaults[key]
  }

  target.background = nextBackground
  return target
}

/**
 * Build the postMessage payload sent to the live-preview iframe. Uses demoData
 * as the content base (the builder previews the theme visuals, not real
 * invitation content) with every section forced visible and no music.
 */
export function buildPreviewMessage(config) {
  return {
    type: 'LIVE_PREVIEW_UPDATE',
    data: {
      ...demoData,
      template_slug: 'dynamic-theme',
      designConfig: config,
      selectedSections: [...THEME_SECTION_KEYS],
      title: 'Preview Tema',
      slug: 'live-preview',
      musicChoice: '',
    },
  }
}

/**
 * Decide what `designConfig` a template design payload should persist.
 * Only `dynamic-theme` designs carry a designConfig — everything else (or a
 * missing/empty config) saves `null`.
 */
export function designConfigForPayload(componentKey, config) {
  if (componentKey !== 'dynamic-theme') return null
  if (!isPlainObject(config)) return null
  return config
}
