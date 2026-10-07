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

const THUMB_VERSION = 'v=20261007g'

const LOCAL_TEMPLATE_THUMBNAILS = {
  'azure-shores': `/assets/templates/azure-shores.png?${THUMB_VERSION}`,
  'bali-payas-agung': `/assets/templates/bali-payas-agung.png?${THUMB_VERSION}`,
  'batak-ragi-hotang': `/assets/templates/batak-ragi-hotang.png?${THUMB_VERSION}`,
  'betawi-palang-pintu': `/assets/templates/betawi-palang-pintu.png?${THUMB_VERSION}`,
  'botanical-watercolor': `/assets/templates/botanical-watercolor.png?${THUMB_VERSION}`,
  'bugis-saoraja': `/assets/templates/bugis-saoraja.png?${THUMB_VERSION}`,
  'celestial-sparkle': `/assets/templates/celestial-sparkle.png?${THUMB_VERSION}`,
  'cyberpunk-neon': `/assets/templates/cyberpunk-neon.png?${THUMB_VERSION}`,
  'dark-elegant': `/assets/templates/dark-elegant.png?${THUMB_VERSION}`,
  'dayak-ngaju-benang-bintik': `/assets/templates/dayak-ngaju-benang-bintik.png?${THUMB_VERSION}`,
  'editorial-magazine': `/assets/templates/editorial-magazine.png?${THUMB_VERSION}`,
  'islami-emas': `/assets/templates/islami-emas.png?${THUMB_VERSION}`,
  'jawa-truntum': `/assets/templates/jawa-truntum.png?${THUMB_VERSION}`,
  'kimi-no-na-wa': `/assets/templates/kimi-no-na-wa.png?${THUMB_VERSION}`,
  'light-modern': `/assets/templates/light-modern.png?${THUMB_VERSION}`,
  'meowly-married': `/assets/templates/meowly-married.png?${THUMB_VERSION}`,
  'minang-suntiang-emas': `/assets/templates/minang-suntiang-emas.png?${THUMB_VERSION}`,
  'minimalist-terra': `/assets/templates/minimalist-terra.png?${THUMB_VERSION}`,
  'modern-noir': `/assets/templates/modern-noir.png?${THUMB_VERSION}`,
  'moroccan-marrakech-gold': `/assets/templates/moroccan-marrakech-gold.png?${THUMB_VERSION}`,
  'naruto': `/assets/templates/naruto.png?${THUMB_VERSION}`,
  'old-money-monogram': `/assets/templates/old-money-monogram.png?${THUMB_VERSION}`,
  'one-piece': `/assets/templates/one-piece.png?${THUMB_VERSION}`,
  'palembang-aesan-gede': `/assets/templates/palembang-aesan-gede.png?${THUMB_VERSION}`,
  'pixel-quest': `/assets/templates/pixel-quest.png?${THUMB_VERSION}`,
  'retro-nostalgia': `/assets/templates/retro-nostalgia.png?${THUMB_VERSION}`,
  'royal-emerald': `/assets/templates/royal-emerald.png?${THUMB_VERSION}`,
  'royal-gold': `/assets/templates/royal-gold.png?${THUMB_VERSION}`,
  'sakura-blossom': `/assets/templates/sakura-blossom.png?${THUMB_VERSION}`,
  'strawberry-matcha': `/assets/templates/strawberry-matcha.png?${THUMB_VERSION}`,
  'sunda-sabilulungan': `/assets/templates/sunda-sabilulungan.png?${THUMB_VERSION}`,
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

