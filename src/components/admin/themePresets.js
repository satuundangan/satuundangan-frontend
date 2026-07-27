// Curated starter `designConfig` presets for the theme builder. Pure data — no Vue,
// no DOM, no async. Each preset is a complete, schema-valid config (colors/fonts/hero/
// sections/ornaments/decor) that round-trips through `normalizeThemeConfig` unchanged.
//
// No image URLs: no assets exist for these presets yet, so `hero.backgroundImage`,
// every `ornaments.*`, `decor.patternUrl` and every section `background.url` stay ''.

import { THEME_SECTION_KEYS } from '@/utils/themeConfig'
import { FONT_CATALOGUE } from './themeBuilderOptions'

/**
 * Look up a font family in the shared catalogue and restate its exact
 * { family, weights, fallback } shape. Keeps preset font entries in sync with
 * the builder's curated lists instead of duplicating weight/fallback by hand.
 */
function font(role, family) {
  const entry = FONT_CATALOGUE[role].find((f) => f.family === family)
  return { family: entry.family, weights: [...entry.weights], fallback: entry.fallback }
}

/**
 * Seed every THEME_SECTION_KEYS entry with a preset-owned color background,
 * alternating `surface`/`alt` by index for visible separation between
 * consecutive sections. Without this, `normalizeThemeConfig` would seed every
 * section with the hardcoded '#ffffff' default surface, ignoring the preset's
 * own palette entirely (fatal for a dark preset like Midnight Elegant).
 */
function sectionsFrom(surface, alt) {
  return Object.fromEntries(
    THEME_SECTION_KEYS.map((key, i) => [
      key,
      {
        background: { type: 'color', value: i % 2 === 0 ? surface : alt },
        ornamentTop: '',
        ornamentBottom: '',
      },
    ]),
  )
}

export const THEME_PRESETS = [
  {
    key: 'gorga-batak',
    label: 'Gorga Batak',
    description: 'Tema merah marun dan emas terinspirasi ukiran Gorga Batak.',
    config: {
      version: 1,
      colors: {
        primary: '#7b1f1f',
        secondary: '#4a2f22',
        accent: '#c9a227',
        background: '#f7f1e6',
        surface: '#fdf6ec',
        text: '#2b1a12',
        textMuted: '#6e5b4a',
      },
      fonts: {
        heading: font('heading', 'Cinzel'),
        script: font('script', 'Pinyon Script'),
        body: font('body', 'Lato'),
      },
      hero: {
        variant: 'framed',
        backgroundImage: '',
        overlayColor: '#000000',
        overlayOpacity: 0.4,
      },
      sections: sectionsFrom('#fdf6ec', '#f7f1e6'),
      ornaments: { corner: '', divider: '', frame: '' },
      decor: { borderRadius: '0.5rem', patternUrl: '', patternOpacity: 0.08 },
    },
  },
  {
    key: 'jawa-earthy',
    label: 'Jawa Earthy',
    description: 'Palet soga cokelat dan emas antik bernuansa Jawa klasik.',
    config: {
      version: 1,
      colors: {
        primary: '#6b4423',
        secondary: '#8a6a4a',
        accent: '#b08d57',
        background: '#f6efe3',
        surface: '#fbf7ef',
        text: '#3b2a1a',
        textMuted: '#7a6a58',
      },
      fonts: {
        heading: font('heading', 'Cormorant Garamond'),
        script: font('script', 'Parisienne'),
        body: font('body', 'Karla'),
      },
      hero: {
        variant: 'classic',
        backgroundImage: '',
        overlayColor: '#000000',
        overlayOpacity: 0.35,
      },
      sections: sectionsFrom('#fbf7ef', '#f6efe3'),
      ornaments: { corner: '', divider: '', frame: '' },
      decor: { borderRadius: '1rem', patternUrl: '', patternOpacity: 0.08 },
    },
  },
  {
    key: 'minang-rangkiang',
    label: 'Minang Rangkiang',
    description: 'Merah dan emas berani terinspirasi rumah adat Rangkiang Minang.',
    config: {
      version: 1,
      colors: {
        primary: '#9b1c1c',
        secondary: '#1c1917',
        accent: '#d4af37',
        background: '#faf6ef',
        surface: '#fffdf9',
        text: '#1c1917',
        textMuted: '#6b625c',
      },
      fonts: {
        heading: font('heading', 'Marcellus'),
        script: font('script', 'Alex Brush'),
        body: font('body', 'Jost'),
      },
      hero: {
        variant: 'full-photo',
        backgroundImage: '',
        overlayColor: '#000000',
        overlayOpacity: 0.4,
      },
      sections: sectionsFrom('#fffdf9', '#faf6ef'),
      ornaments: { corner: '', divider: '', frame: '' },
      decor: { borderRadius: '0.5rem', patternUrl: '', patternOpacity: 0.08 },
    },
  },
  {
    key: 'bali-tropis',
    label: 'Bali Tropis',
    description: 'Hijau tropis dan emas terinspirasi keindahan alam Bali.',
    config: {
      version: 1,
      colors: {
        primary: '#2f5d50',
        secondary: '#1f3d34',
        accent: '#c9a227',
        background: '#f5f3ec',
        surface: '#fbfaf5',
        text: '#233c34',
        textMuted: '#6d7b74',
      },
      fonts: {
        heading: font('heading', 'Prata'),
        script: font('script', 'Sacramento'),
        body: font('body', 'Mulish'),
      },
      hero: {
        variant: 'classic',
        backgroundImage: '',
        overlayColor: '#000000',
        overlayOpacity: 0.35,
      },
      sections: sectionsFrom('#fbfaf5', '#f5f3ec'),
      ornaments: { corner: '', divider: '', frame: '' },
      decor: { borderRadius: '1.5rem', patternUrl: '', patternOpacity: 0.08 },
    },
  },
  {
    key: 'rustic-sage',
    label: 'Rustic Sage',
    description: 'Hijau sage lembut dan taupe hangat bernuansa pedesaan.',
    config: {
      version: 1,
      colors: {
        primary: '#87977f',
        secondary: '#a99985',
        accent: '#c2a878',
        background: '#f4f1ea',
        surface: '#faf8f3',
        text: '#3f4238',
        textMuted: '#767d6e',
      },
      fonts: {
        heading: font('heading', 'Lora'),
        script: font('script', 'Dancing Script'),
        body: font('body', 'Nunito Sans'),
      },
      hero: {
        variant: 'framed',
        backgroundImage: '',
        overlayColor: '#000000',
        overlayOpacity: 0.3,
      },
      sections: sectionsFrom('#faf8f3', '#f4f1ea'),
      ornaments: { corner: '', divider: '', frame: '' },
      decor: { borderRadius: '2rem', patternUrl: '', patternOpacity: 0.06 },
    },
  },
  {
    key: 'midnight-elegant',
    label: 'Midnight Elegant',
    description: 'Tema gelap elegan dengan aksen champagne keemasan.',
    config: {
      version: 1,
      colors: {
        primary: '#c8b273',
        secondary: '#334155',
        accent: '#c8b273',
        background: '#0f172a',
        surface: '#0f172a',
        text: '#e8e6e1',
        textMuted: '#9aa2b1',
      },
      fonts: {
        heading: font('heading', 'Bodoni Moda'),
        script: font('script', 'Italianno'),
        body: font('body', 'DM Sans'),
      },
      hero: {
        variant: 'full-photo',
        backgroundImage: '',
        overlayColor: '#000000',
        overlayOpacity: 0.5,
      },
      sections: sectionsFrom('#0f172a', '#1e293b'),
      ornaments: { corner: '', divider: '', frame: '' },
      decor: { borderRadius: '1rem', patternUrl: '', patternOpacity: 0.08 },
    },
  },
]

export default THEME_PRESETS
