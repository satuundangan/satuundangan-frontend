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

const LOCAL_TEMPLATE_THUMBNAILS = {
  'azure-shores': '/assets/templates/azure-shores.png',
  'batak-ragi-hotang': '/assets/templates/batak-ragi-hotang.png',
  'botanical-watercolor': '/assets/templates/botanical-watercolor.png',
  'celestial-sparkle': '/assets/templates/celestial-sparkle.png',
  'cyberpunk-neon': '/assets/templates/cyberpunk-neon.png',
  'dark-elegant': '/assets/templates/dark-elegant.png',
  'dayak-ngaju-benang-bintik': '/assets/templates/dayak-ngaju-benang-bintik.png',
  'editorial-magazine': '/assets/templates/editorial-magazine.png',
  'jawa-truntum': '/assets/templates/jawa-truntum.png',
  'kimi-no-na-wa': '/assets/templates/kimi-no-na-wa.png',
  'light-modern': '/assets/templates/light-modern.png',
  'meowly-married': '/assets/templates/meowly-married.png',
  'minimalist-terra': '/assets/templates/minimalist-terra.png',
  'modern-noir': '/assets/templates/modern-noir.png',
  'naruto': '/assets/templates/naruto.png',
  'one-piece': '/assets/templates/one-piece.png',
  'pixel-quest': '/assets/templates/pixel-quest.png',
  'retro-nostalgia': '/assets/templates/retro-nostalgia.png',
  'royal-emerald': '/assets/templates/royal-emerald.png',
  'royal-gold': '/assets/templates/royal-gold.png',
  'sakura-blossom': '/assets/templates/sakura-blossom.png',
  'strawberry-matcha': '/assets/templates/strawberry-matcha.png',
  'sunda-sabilulungan': '/assets/templates/sunda-sabilulungan.png',
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

