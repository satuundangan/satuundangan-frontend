// Pure, dependency-free normalization + derivation utilities for the theme-builder
// `designConfig` payload. No Vue imports, no DOM access — must run under jsdom/node.
//
// Consumed by `src/templates/dynamic-theme.vue`. Schema documented in
// `src/templates/dynamic-theme.schema.md` (source of truth for the stage 2 builder UI).

export const THEME_SECTION_KEYS = [
  'hero',
  'quote',
  'couple',
  'event',
  'love-story',
  'gallery',
  'gift',
  'rsvp',
  'wishes',
  'footer',
]

const HERO_VARIANTS = ['classic', 'full-photo', 'framed']

const GENERIC_FAMILIES = new Set([
  'serif',
  'sans-serif',
  'monospace',
  'cursive',
  'fantasy',
  'system-ui',
  'ui-serif',
  'ui-sans-serif',
  'ui-monospace',
  'ui-rounded',
  'arial',
  'helvetica',
  'times',
  'times new roman',
  'georgia',
  'courier',
  'courier new',
  'verdana',
])

export const THEME_DEFAULTS = {
  version: 1,
  colors: {
    primary: '#8a6f52',
    secondary: '#c4a882',
    accent: '#b08d57',
    background: '#faf7f2',
    surface: '#ffffff',
    text: '#3a332c',
    textMuted: '#8a8178',
  },
  fonts: {
    heading: { family: 'Cormorant Garamond', weights: [400, 600], fallback: 'serif' },
    script: { family: 'Great Vibes', weights: [400], fallback: 'cursive' },
    body: { family: 'Inter', weights: [300, 400, 600], fallback: 'sans-serif' },
  },
  hero: {
    variant: 'classic',
    backgroundImage: '',
    overlayColor: '#000000',
    overlayOpacity: 0.35,
  },
  sections: {},
  ornaments: { corner: '', divider: '', frame: '' },
  decor: { borderRadius: '1.5rem', patternUrl: '', patternOpacity: 0.08 },
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function deepClone(value) {
  if (Array.isArray(value)) return value.map(deepClone)
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, deepClone(v)]))
  }
  return value
}

function deepMerge(base, patch) {
  if (!isPlainObject(patch)) return deepClone(base)
  const result = deepClone(base)
  for (const [key, value] of Object.entries(patch)) {
    if (isPlainObject(value) && isPlainObject(result[key])) {
      result[key] = deepMerge(result[key], value)
    } else {
      result[key] = deepClone(value)
    }
  }
  return result
}

function clampOpacity(value, fallback) {
  const n = typeof value === 'string' ? Number(value) : value
  if (typeof n !== 'number' || Number.isNaN(n)) return fallback
  if (n < 0) return 0
  if (n > 1) return 1
  return n
}

function defaultSectionEntry() {
  return {
    background: { type: 'color', value: THEME_DEFAULTS.colors.surface },
    ornamentTop: '',
    ornamentBottom: '',
  }
}

function camelToKebab(value) {
  return String(value).replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
}

/**
 * Parse + deep-merge a raw designConfig (string | object | nullish | garbage) against
 * THEME_DEFAULTS. Total function: never throws, never returns an incomplete config.
 */
export function normalizeThemeConfig(raw) {
  let parsed = raw

  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw)
    } catch {
      parsed = undefined
    }
  }

  if (!isPlainObject(parsed)) {
    parsed = undefined
  }

  // Seed every section key with a default entry before merging user overrides so
  // sectionStyle() never sees a hole.
  const seededDefaults = deepMerge(THEME_DEFAULTS, {
    sections: Object.fromEntries(THEME_SECTION_KEYS.map((key) => [key, defaultSectionEntry()])),
  })

  const merged = parsed ? deepMerge(seededDefaults, parsed) : deepClone(seededDefaults)

  // Re-seed any section keys the user override may have omitted entirely.
  for (const key of THEME_SECTION_KEYS) {
    if (!isPlainObject(merged.sections[key])) {
      merged.sections[key] = defaultSectionEntry()
    }
  }

  if (!HERO_VARIANTS.includes(merged.hero.variant)) {
    merged.hero.variant = 'classic'
  }

  merged.hero.overlayOpacity = clampOpacity(
    merged.hero.overlayOpacity,
    THEME_DEFAULTS.hero.overlayOpacity,
  )
  merged.decor.patternOpacity = clampOpacity(
    merged.decor.patternOpacity,
    THEME_DEFAULTS.decor.patternOpacity,
  )

  return merged
}

/**
 * Flatten a normalized config into a CSS custom-property map keyed `--dt-*`.
 */
export function themeCssVars(config) {
  const cfg = isPlainObject(config) ? config : normalizeThemeConfig(config)
  const vars = {}

  for (const [key, value] of Object.entries(cfg.colors || {})) {
    vars[`--dt-color-${camelToKebab(key)}`] = value
  }

  for (const [key, font] of Object.entries(cfg.fonts || {})) {
    if (!isPlainObject(font)) continue
    vars[`--dt-font-${key}`] = `'${font.family}', ${font.fallback}`
  }

  vars['--dt-radius'] = cfg.decor?.borderRadius ?? THEME_DEFAULTS.decor.borderRadius
  vars['--dt-overlay-color'] = cfg.hero?.overlayColor ?? THEME_DEFAULTS.hero.overlayColor
  vars['--dt-overlay-opacity'] = String(
    cfg.hero?.overlayOpacity ?? THEME_DEFAULTS.hero.overlayOpacity,
  )

  return vars
}

/**
 * Build a single Google Fonts CSS2 stylesheet URL for every non-generic family
 * configured, or null if every configured family is a generic/system stack.
 */
export function googleFontsUrl(config) {
  const cfg = isPlainObject(config) ? config : normalizeThemeConfig(config)
  const seen = new Set()
  const segments = []

  for (const font of Object.values(cfg.fonts || {})) {
    if (!isPlainObject(font) || !font.family) continue
    const family = String(font.family).trim()
    if (!family || GENERIC_FAMILIES.has(family.toLowerCase())) continue
    if (seen.has(family)) continue
    seen.add(family)

    const weights = Array.isArray(font.weights) && font.weights.length ? font.weights : [400]
    const encodedFamily = family.replace(/\s+/g, '+')
    segments.push(`family=${encodedFamily}:wght@${weights.join(';')}`)
  }

  if (!segments.length) return null

  return `https://fonts.googleapis.com/css2?${segments.join('&')}&display=swap`
}

/**
 * Vue-style-object background for a given THEME_SECTION_KEYS entry. Unknown keys
 * or missing entries fall back to the default surface background.
 */
export function sectionStyle(config, key) {
  const cfg = isPlainObject(config) ? config : normalizeThemeConfig(config)
  const entry = cfg.sections?.[key]
  const background = isPlainObject(entry?.background)
    ? entry.background
    : { type: 'color', value: cfg.colors?.surface ?? THEME_DEFAULTS.colors.surface }

  if (background.type === 'gradient' && background.from && background.to) {
    return {
      backgroundImage: `linear-gradient(${background.direction || '180deg'}, ${background.from}, ${background.to})`,
    }
  }

  if (background.type === 'image' && background.url) {
    return {
      backgroundImage: `url("${background.url}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }

  return {
    backgroundColor: background.value || cfg.colors?.surface || THEME_DEFAULTS.colors.surface,
  }
}
