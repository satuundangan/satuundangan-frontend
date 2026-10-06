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
  'kimi-no-na-wa': '/assets/templates/kimi-no-na-wa.png',
  'meowly-married': '/assets/templates/meowly-married.png',
  'pixel-quest': '/assets/templates/pixel-quest.png',
  'dayak-ngaju-benang-bintik': '/assets/templates/dayak-ngaju-benang-bintik.png',
  'batak-ragi-hotang': '/assets/templates/batak-ragi-hotang.png',
  'sunda-sabilulungan': '/assets/templates/sunda-sabilulungan.png',
  'jawa-truntum': '/assets/templates/jawa-truntum.png',
  'naruto': '/assets/images/naruto/naruto-cover.webp',
  'one-piece': '/assets/images/one-piece/one-piece-cover.png',
  'strawberry-matcha': '/assets/templates/strawberry-matcha.png',
}

export function resolveTemplateThumbnail(template) {
  if (!template) return ''
  const slug = normalizeTemplateKey(template.slug)
  const thumb = template.thumbnailUrl || template.previewUrl

  // If thumbnail points to known dead or stale CDN location for meowly-married / pixel-quest
  if (
    slug &&
    LOCAL_TEMPLATE_THUMBNAILS[slug] &&
    (!thumb ||
      thumb.includes('cdn.satuundangan.id/templates/meowly-married.jpg') ||
      thumb.includes('cdn.satuundangan.id/templates/pixel-quest.jpg') ||
      thumb.startsWith('/demo/'))
  ) {
    return LOCAL_TEMPLATE_THUMBNAILS[slug]
  }

  if (thumb && !thumb.startsWith('/demo/')) {
    return thumb
  }

  return (slug && LOCAL_TEMPLATE_THUMBNAILS[slug]) || thumb || ''
}

