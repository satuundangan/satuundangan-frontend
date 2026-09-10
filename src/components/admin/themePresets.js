// Curated starter `designConfig` presets for the theme builder. Pure data — no Vue,
// no DOM, no async. Each preset is a complete, schema-valid config (colors/fonts/hero/
// sections/ornaments/decor) that round-trips through `normalizeThemeConfig` unchanged.
//
// Asset state: the six original presets remain asset-free — `hero.backgroundImage`,
// every `ornaments.*` and `decor.patternUrl` stay '' — while `islami-emas` carries real
// Cloudflare R2 CDN URLs on `hero.backgroundImage`, `ornaments.corner`,
// `ornaments.divider` and `decor.patternUrl`. No preset — asset-free or not — uses an
// image-type section background; every section `background` is always `{ type: 'color' }`.
// `ornaments.frame` is intentionally left '' on every preset, including `islami-emas`,
// because the renderer applies it as `border-image: url(...) 30 stretch` against a 6px
// `border-width`, which squeezes 30px of source art into 6px and renders as mush.
// Every preset explicitly sets `couple.photoFallback`: 'hide' on the six asset-free
// presets, and 'ornament' only on `islami-emas` — it is the only preset carrying a real
// `decor.patternUrl`, so it is the only one where 'ornament' resolves to a tiled pattern
// instead of silently degrading back to 'hide'.

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
      couple: { photoFallback: 'hide' },
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
      couple: { photoFallback: 'hide' },
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
      couple: { photoFallback: 'hide' },
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
      couple: { photoFallback: 'hide' },
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
      couple: { photoFallback: 'hide' },
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
      couple: { photoFallback: 'hide' },
      sections: sectionsFrom('#0f172a', '#1e293b'),
      ornaments: { corner: '', divider: '', frame: '' },
      decor: { borderRadius: '1rem', patternUrl: '', patternOpacity: 0.08 },
    },
  },
  {
    key: 'arabian-night',
    label: 'Arabian Night',
    description: 'Nuansa dongeng malam gurun dengan biru tengah malam dan aksen emas hangat.',
    config: {
      version: 1,
      colors: {
        primary: '#e9c46a',
        secondary: '#6d4c41',
        accent: '#f4a261',
        background: '#0e1a3a',
        surface: '#16264f',
        text: '#f8f1de',
        textMuted: '#c8bfa7',
      },
      fonts: {
        heading: font('heading', 'Cinzel'),
        script: font('script', 'Great Vibes'),
        body: font('body', 'Manrope'),
      },
      hero: {
        variant: 'classic',
        backgroundImage: '',
        overlayColor: '#050b1d',
        overlayOpacity: 0.35,
      },
      couple: { photoFallback: 'hide' },
      sections: sectionsFrom('#16264f', '#0e1a3a'),
      ornaments: { corner: '', divider: '', frame: '' },
      decor: { borderRadius: '1rem', patternUrl: '', patternOpacity: 0.08 },
    },
  },
  {
    key: 'islami-emas',
    label: 'Islami Emas',
    description: 'Emas dan krem lembut dengan motif geometris mihrab islami.',
    config: {
      version: 1,
      colors: {
        // Dark antique-gold tokens keep headings, buttons and active states
        // readable on the cream surfaces (the previous bright gold was too low
        // contrast outside the hero).
        primary: '#8A6A22',
        secondary: '#A17C32',
        accent: '#8A6A22',
        background: '#FAF6EC',
        surface: '#FEFBF4',
        text: '#2E2517',
        textMuted: '#7A6C52',
      },
      fonts: {
        heading: font('heading', 'Marcellus'),
        script: font('script', 'Italianno'),
        body: font('body', 'Raleway'),
      },
      hero: {
        variant: 'classic',
        backgroundImage: 'https://cdn.satuundangan.id/themes/islam/hero.jpg',
        overlayColor: '#000000',
        overlayOpacity: 0.05,
      },
      couple: { photoFallback: 'ornament' },
      sections: sectionsFrom('#FEFBF4', '#FAF6EC'),
      ornaments: {
        corner: 'https://cdn.satuundangan.id/themes/islam/corner.png',
        divider: 'https://cdn.satuundangan.id/themes/islam/divider.png',
        frame: '',
      },
      decor: {
        borderRadius: '0.5rem',
        patternUrl: 'https://cdn.satuundangan.id/themes/islam/pattern.png',
        patternOpacity: 0.12,
      },
    },
  },
]

export default THEME_PRESETS
