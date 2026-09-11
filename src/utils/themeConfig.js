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

export const COUPLE_PHOTO_FALLBACKS = ['hide', 'ornament']
export const ORNAMENT_MOTION_PRESETS = ['none', 'float', 'drift', 'sway', 'twinkle', 'pulse']
export const ORNAMENT_MOTION_SPEEDS = ['slow', 'normal', 'fast']

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
  couple: { photoFallback: 'hide' },
  sections: {},
  ornaments: { corner: '', divider: '', frame: '' },
  decor: {
    borderRadius: '1.5rem',
    patternUrl: '',
    patternOpacity: 0.08,
    ornamentMotion: 'none',
    ornamentMotionSpeed: 'normal',
    motionDensity: 8,
    motionOpacity: 0.22,
  },
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
    ornamentTopMotion: 'none',
    ornamentBottomMotion: 'none',
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
      continue
    }
    if (!isPlainObject(merged.sections[key].background)) {
      merged.sections[key].background = deepClone(defaultSectionEntry().background)
    }
    if (!ORNAMENT_MOTION_PRESETS.includes(merged.sections[key].ornamentTopMotion)) {
      merged.sections[key].ornamentTopMotion = 'none'
    }
    if (!ORNAMENT_MOTION_PRESETS.includes(merged.sections[key].ornamentBottomMotion)) {
      merged.sections[key].ornamentBottomMotion = 'none'
    }
  }

  if (!HERO_VARIANTS.includes(merged.hero.variant)) {
    merged.hero.variant = 'classic'
  }

  // `couple` may arrive as null/string/array via stored JSON or a partial override —
  // re-seed it as a plain object BEFORE reading `photoFallback`, or the property
  // access below would throw on `couple: null`.
  if (!isPlainObject(merged.couple)) {
    merged.couple = deepClone(THEME_DEFAULTS.couple)
  }
  if (!COUPLE_PHOTO_FALLBACKS.includes(merged.couple.photoFallback)) {
    merged.couple.photoFallback = 'hide'
  }

  merged.hero.overlayOpacity = clampOpacity(
    merged.hero.overlayOpacity,
    THEME_DEFAULTS.hero.overlayOpacity,
  )
  if (!isPlainObject(merged.decor)) {
    merged.decor = deepClone(THEME_DEFAULTS.decor)
  }
  merged.decor.patternOpacity = clampOpacity(
    merged.decor.patternOpacity,
    THEME_DEFAULTS.decor.patternOpacity,
  )
  if (!ORNAMENT_MOTION_PRESETS.includes(merged.decor.ornamentMotion)) {
    merged.decor.ornamentMotion = THEME_DEFAULTS.decor.ornamentMotion
  }
  if (!ORNAMENT_MOTION_SPEEDS.includes(merged.decor.ornamentMotionSpeed)) {
    merged.decor.ornamentMotionSpeed = THEME_DEFAULTS.decor.ornamentMotionSpeed
  }
  const density = Number(merged.decor.motionDensity)
  merged.decor.motionDensity = Number.isFinite(density)
    ? Math.min(16, Math.max(0, Math.round(density)))
    : THEME_DEFAULTS.decor.motionDensity
  merged.decor.motionOpacity = clampOpacity(
    merged.decor.motionOpacity,
    THEME_DEFAULTS.decor.motionOpacity,
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
  const motionDurations = { slow: '14s', normal: '8s', fast: '4s' }
  vars['--dt-motion-duration'] =
    motionDurations[cfg.decor?.ornamentMotionSpeed] || motionDurations.normal

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

/**
 * Decide how one couple slot (groom or bride) should render. Pure, never throws.
 * @param {object|string|null} config  raw or normalized designConfig
 * @param {string} photoUrl            already-resolved url, e.g. groomPhotoUrl || photoCoupleUrl
 * @returns {{ mode: 'photo'|'ornament'|'hide', src: string, patternUrl: string }}
 */
export function resolveCouplePhoto(config, photoUrl) {
  const cfg = isPlainObject(config) ? config : normalizeThemeConfig(config)
  const trimmedPhoto = typeof photoUrl === 'string' ? photoUrl.trim() : ''

  if (trimmedPhoto) {
    return { mode: 'photo', src: trimmedPhoto, patternUrl: '' }
  }

  const fallback = COUPLE_PHOTO_FALLBACKS.includes(cfg.couple?.photoFallback)
    ? cfg.couple.photoFallback
    : 'hide'

  const trimmedPattern =
    typeof cfg.decor?.patternUrl === 'string' ? cfg.decor.patternUrl.trim() : ''

  if (fallback === 'ornament' && trimmedPattern) {
    return { mode: 'ornament', src: '', patternUrl: trimmedPattern }
  }

  return { mode: 'hide', src: '', patternUrl: '' }
}

// --- Hero backdrop luminance helpers ---
// Pure, dependency-free (no Vue, no DOM, no window) so they run under jsdom/node
// exactly like the rest of this file. Consumed by resolveHeroInk() below and by
// `src/templates/dynamic-theme.vue`'s `heroInk` computed.

const HEX_RE = /^([0-9a-f]{3}|[0-9a-f]{6})$/i

/**
 * Parse a 3- or 6-digit hex color string (with or without a leading '#') into an
 * { r, g, b } object. Total function: any non-string or malformed input returns null.
 */
export function hexToRgb(hex) {
  if (typeof hex !== 'string') return null
  const trimmed = hex.trim().replace(/^#/, '')
  if (!HEX_RE.test(trimmed)) return null

  const full =
    trimmed.length === 3
      ? trimmed
          .split('')
          .map((c) => c + c)
          .join('')
      : trimmed

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

/**
 * WCAG 2.x relative luminance of an { r, g, b } color, in [0, 1]. Total function:
 * malformed input (not a plain object with three finite numeric channels) returns 0.
 */
export function relativeLuminance(rgb) {
  if (!isPlainObject(rgb)) return 0
  const { r, g, b } = rgb
  if (![r, g, b].every((v) => typeof v === 'number' && Number.isFinite(v))) return 0

  const channel = (v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/**
 * Blend an overlay color at a given alpha over a background color, both as hex
 * strings, returning the resulting { r, g, b }. Total function: an unparsable
 * overlay hex forces alpha to 0 (returns the background unchanged); an unparsable
 * background hex falls back to THEME_DEFAULTS.colors.background.
 */
export function blendOverBackground(overlayHex, alpha, backgroundHex) {
  const bg = hexToRgb(backgroundHex) ?? hexToRgb(THEME_DEFAULTS.colors.background)
  const fg = hexToRgb(overlayHex)
  const effectiveAlpha = fg ? Math.min(1, Math.max(0, typeof alpha === 'number' ? alpha : 0)) : 0
  const safeFg = fg ?? { r: 0, g: 0, b: 0 }

  return {
    r: Math.round(safeFg.r * effectiveAlpha + bg.r * (1 - effectiveAlpha)),
    g: Math.round(safeFg.g * effectiveAlpha + bg.g * (1 - effectiveAlpha)),
    b: Math.round(safeFg.b * effectiveAlpha + bg.b * (1 - effectiveAlpha)),
  }
}

// We deliberately use a mid-luminance 0.5 cut rather than the WCAG white-vs-black
// crossover (~0.179) because the blend ignores any `hero.backgroundImage` photo
// sitting on top. A conservative 0.5 flips to dark ink ONLY when the backdrop is
// unambiguously light — which keeps all six 30-50%-black-overlay presets on their
// current light-ink look and flips only `islami-emas` (blended luminance ~0.83).
// Do not "tighten" this to 0.179 without re-reviewing every preset visually.
export const HERO_DARK_LUMINANCE_THRESHOLD = 0.5

/**
 * Decide the hero/gate ink treatment (light-ink-on-dark-backdrop vs.
 * dark-ink-on-light-backdrop) from a config's blended hero overlay + background
 * luminance. Accepts raw or normalized config, never throws.
 * @returns {{ isDark: boolean, heading: string, eyebrow: string, scrim: string }}
 */
export function resolveHeroInk(config) {
  const cfg = isPlainObject(config) ? config : normalizeThemeConfig(config)
  const bgHex = cfg.colors?.background ?? THEME_DEFAULTS.colors.background
  const blended = blendOverBackground(cfg.hero?.overlayColor, cfg.hero?.overlayOpacity, bgHex)
  const isDark = relativeLuminance(blended) < HERO_DARK_LUMINANCE_THRESHOLD

  const scrimRgb = isDark
    ? { r: 0, g: 0, b: 0 }
    : (hexToRgb(bgHex) ?? hexToRgb(THEME_DEFAULTS.colors.background))
  const { r, g, b } = scrimRgb
  const stops = isDark ? [0.55, 0.3, 0] : [0.9, 0.65, 0]
  const scrim =
    `radial-gradient(ellipse 120% 80% at 50% 50%, ` +
    `rgba(${r}, ${g}, ${b}, ${stops[0]}) 0%, ` +
    `rgba(${r}, ${g}, ${b}, ${stops[1]}) 45%, ` +
    `rgba(${r}, ${g}, ${b}, ${stops[2]}) 78%)`

  return {
    isDark,
    // On a light backdrop, colors.textMuted beats colors.primary/accent. For
    // islami-emas, textMuted #7A6C52 on the cream #FAF6EC backdrop is ~4.75:1
    // (passes WCAG AA for normal text — the eyebrow is text-xs uppercase), while
    // primary/accent #BD9B2D gold is only ~2.5:1 and would still fail. Using
    // textMuted also keeps the eyebrow visually subordinate to the heading, which
    // is the original design intent, and matches the countdown-label treatment.
    heading: isDark ? 'var(--dt-color-surface)' : 'var(--dt-color-text)',
    eyebrow: isDark ? 'var(--dt-color-accent)' : 'var(--dt-color-text-muted)',
    scrim,
  }
}
