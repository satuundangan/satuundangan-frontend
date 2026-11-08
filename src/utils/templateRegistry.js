const templateModules = import.meta.glob('../templates/*.vue')

export const FALLBACK_TEMPLATE_KEY = 'dark-elegant'

// The generic config-driven renderer — any admin-created design row can bind to
// this key via componentKey and re-skin entirely via designConfig (theme builder).
export const DYNAMIC_THEME_KEY = 'dynamic-theme'

export const templateLoaders = Object.fromEntries(
  Object.entries(templateModules).map(([path, loader]) => [
    path
      .split('/')
      .pop()
      .replace(/\.vue$/, ''),
    loader,
  ]),
)

export const templateComponentKeys = Object.keys(templateLoaders).sort()

export function normalizeTemplateKey(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
}

export function resolveTemplateKey(slug, componentKey, registry = templateLoaders) {
  const bySlug = normalizeTemplateKey(slug)
  if (bySlug && registry[bySlug]) return bySlug
  const byComponent = normalizeTemplateKey(componentKey)
  if (byComponent && registry[byComponent]) return byComponent
  return FALLBACK_TEMPLATE_KEY
}

const THUMB_VERSION = 'v=20261108'

const LOCAL_TEMPLATE_THUMBNAILS = {
  'azure-shores': `/assets/templates/azure-shores.webp?${THUMB_VERSION}`,
  'bali-payas-agung': `/assets/templates/bali-payas-agung.webp?${THUMB_VERSION}`,
  'batak-ragi-hotang': `/assets/templates/batak-ragi-hotang.webp?${THUMB_VERSION}`,
  'betawi-palang-pintu': `/assets/templates/betawi-palang-pintu.webp?${THUMB_VERSION}`,
  'botanical-watercolor': `/assets/templates/botanical-watercolor.webp?${THUMB_VERSION}`,
  'bugis-saoraja': `/assets/templates/bugis-saoraja.webp?${THUMB_VERSION}`,
  'celestial-sparkle': `/assets/templates/celestial-sparkle.webp?${THUMB_VERSION}`,
  'cyberpunk-neon': `/assets/templates/cyberpunk-neon.webp?${THUMB_VERSION}`,
  'dark-elegant': `/assets/templates/dark-elegant.webp?${THUMB_VERSION}`,
  'dayak-ngaju-benang-bintik': `/assets/templates/dayak-ngaju-benang-bintik.webp?${THUMB_VERSION}`,
  'doodle-sage-love': `/assets/templates/doodle-sage-love.webp?${THUMB_VERSION}`,
  'demon-slayer': `/assets/templates/demon-slayer.webp?${THUMB_VERSION}`,
  'editorial-magazine': `/assets/templates/editorial-magazine.webp?${THUMB_VERSION}`,
  'elysian-parallax': `/assets/templates/elysian-parallax.webp?${THUMB_VERSION}`,
  'islami-emas': `/assets/templates/islami-emas.webp?${THUMB_VERSION}`,
  'jawa-truntum': `/assets/templates/jawa-truntum.webp?${THUMB_VERSION}`,
  'kimi-no-na-wa': `/assets/templates/kimi-no-na-wa.webp?${THUMB_VERSION}`,
  'light-modern': `/assets/templates/light-modern.webp?${THUMB_VERSION}`,
  'love-line': `/assets/templates/love-line.webp?${THUMB_VERSION}`,
  'meowly-married': `/assets/templates/meowly-married.webp?${THUMB_VERSION}`,
  'minang-suntiang-emas': `/assets/templates/minang-suntiang-emas.webp?${THUMB_VERSION}`,
  'minimalist-terra': `/assets/templates/minimalist-terra.webp?${THUMB_VERSION}`,
  'modern-noir': `/assets/templates/modern-noir.webp?${THUMB_VERSION}`,
  'moroccan-marrakech-gold': `/assets/templates/moroccan-marrakech-gold.webp?${THUMB_VERSION}`,
  'naruto': `/assets/templates/naruto.webp?${THUMB_VERSION}`,
  'old-money-monogram': `/assets/templates/old-money-monogram.webp?${THUMB_VERSION}`,
  'one-piece': `/assets/templates/one-piece.webp?${THUMB_VERSION}`,
  'palembang-aesan-gede': `/assets/templates/palembang-aesan-gede.webp?${THUMB_VERSION}`,
  'pixel-quest': `/assets/templates/pixel-quest.webp?${THUMB_VERSION}`,
  'purrfect-match': `/assets/templates/purrfect-match.webp?${THUMB_VERSION}`,
  'retro-nostalgia': `/assets/templates/retro-nostalgia.webp?${THUMB_VERSION}`,
  'royal-emerald': `/assets/templates/royal-emerald.webp?${THUMB_VERSION}`,
  'royal-gold': `/assets/templates/royal-gold.webp?${THUMB_VERSION}`,
  'sakura-blossom': `/assets/templates/sakura-blossom.webp?${THUMB_VERSION}`,
  'strawberry-matcha': `/assets/templates/strawberry-matcha.webp?${THUMB_VERSION}`,
  'sunda-sabilulungan': `/assets/templates/sunda-sabilulungan.webp?${THUMB_VERSION}`,
}

export function resolveTemplateThumbnail(template) {
  if (!template) return ''
  const slug = normalizeTemplateKey(template.slug)

  // Prioritize crisp local screenshots captured from latest live demo templates
  if (slug && LOCAL_TEMPLATE_THUMBNAILS[slug]) {
    return LOCAL_TEMPLATE_THUMBNAILS[slug]
  }

  const thumb = template.thumbnailUrl || template.previewUrl
  if (thumb && !thumb.startsWith('/demo/')) {
    return thumb
  }

  return (slug && LOCAL_TEMPLATE_THUMBNAILS[slug]) || thumb || ''
}

