import { DYNAMIC_THEME_KEY, templateComponentKeys } from '@/utils/templateRegistry'

const ALL_REGISTERED_RENDERERS = new Set([...templateComponentKeys, DYNAMIC_THEME_KEY])

// These section anchors were checked in each renderer. The reference-only
// renderer is intentionally excluded where it has no corresponding section.
const ALL_WITH_COMMON_ANCHORS = new Set(templateComponentKeys)
const WITHOUT_REFERENCE_RENDERERS = new Set(
  templateComponentKeys.filter((key) => !['robby-tsabita-reference'].includes(key)),
)
const ANCHOR_RENDERERS = {
  couple: ALL_WITH_COMMON_ANCHORS,
  gallery: ALL_WITH_COMMON_ANCHORS,
  rsvp: ALL_WITH_COMMON_ANCHORS,
  event: WITHOUT_REFERENCE_RENDERERS,
  gift: WITHOUT_REFERENCE_RENDERERS,
  story: new Set(
    templateComponentKeys.filter((key) => !['dynamic-theme', 'robby-tsabita-reference'].includes(key)),
  ),
  quote: new Set([
    'demon-slayer',
    'elysian-parallax',
    'purrfect-match',
    'doodle-sage-love',
    'refda-tiara-noir',
    'robby-tsabita-reference',
  ]),
  'dress-code': new Set(['love-line', 'purrfect-match', 'robby-tsabita-reference']),
  wishes: new Set(['doodle-sage-love']),
}

const SECTION_ANCHORS = {
  couple: 'couple',
  event: 'event',
  gallery: 'gallery',
  gift: 'gift',
  rsvp: 'rsvp',
  story: 'story',
  'love-story': 'story',
  quote: 'quote',
  'dress-code': 'dress-code',
  wishes: 'rsvp',
}

function normalizeKey(value) {
  return String(value ?? '')
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
}

function anchorForRenderer(sectionKey, renderer) {
  if (renderer === DYNAMIC_THEME_KEY) {
    const dynamicAnchors = {
      couple: 'couple',
      event: 'event',
      gallery: 'gallery',
      gift: 'gift',
      rsvp: 'rsvp',
      'love-story': 'love-story',
      quote: 'quote',
      'dress-code': 'dress-code',
    }
    return dynamicAnchors[sectionKey] ?? null
  }

  if (!ALL_REGISTERED_RENDERERS.has(renderer)) return null
  if (!ANCHOR_RENDERERS[sectionKey]?.has(renderer)) return null
  if (sectionKey === 'event' && renderer === 'doodle-sage-love') return 'calendar'
  return SECTION_ANCHORS[sectionKey] ?? null
}

export function sampleSectionPreviewHref(item) {
  const template = item?.samplePreviewTemplate
  const slug = String(template?.slug ?? '').trim()
  const sectionKey = normalizeKey(item?.key)
  const renderer = normalizeKey(template?.componentKey || slug)
  const anchor = anchorForRenderer(sectionKey, renderer)

  if (!slug || !anchor) return null

  return `/demo/${encodeURIComponent(slug)}#${encodeURIComponent(anchor)}`
}
