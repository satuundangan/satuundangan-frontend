const templateModules = import.meta.glob('../templates/*.vue')

export const FALLBACK_TEMPLATE_KEY = 'dark-elegant'

export const templateLoaders = Object.fromEntries(
  Object.entries(templateModules).map(([path, loader]) => [
    path.split('/').pop().replace(/\.vue$/, ''),
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
