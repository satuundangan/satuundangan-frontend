// Pure, dependency-free helpers for deriving homepage filter chips from
// admin-curated `filterGroup` (style) and `category` (package tier) fields.
// No Vue imports here — must stay unit-testable in isolation.

export const ALL_ID = 'all'
export const MIN_GROUP_SIZE = 3
export const PACKAGE_ORDER = ['Basic', 'Premium', 'Exclusive']

function normalize(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function safeList(templates) {
  return Array.isArray(templates) ? templates : []
}

function groupBy(templates, keyFn) {
  const groups = new Map()
  for (const template of templates) {
    const key = normalize(keyFn(template))
    if (!key) continue
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(template)
  }
  return groups
}

function withLabel(entry) {
  return { ...entry, label: `${entry.name} (${entry.count})` }
}

export function buildStyleFilters(templates, minCount = MIN_GROUP_SIZE) {
  const list = safeList(templates)
  const groups = groupBy(list, (t) => t?.filterGroup)

  const entries = []
  for (const [name, items] of groups) {
    if (items.length < minCount) continue
    entries.push({ id: name, name, count: items.length })
  }
  entries.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'id'))

  const all = { id: ALL_ID, name: 'Semua', count: list.length }
  return [all, ...entries].map(withLabel)
}

export function buildPackageFilters(templates) {
  const list = safeList(templates)
  const groups = groupBy(list, (t) => t?.category)

  const entries = []
  for (const [name, items] of groups) {
    entries.push({ id: name, name, count: items.length })
  }
  entries.sort((a, b) => {
    const aIndex = PACKAGE_ORDER.indexOf(a.name)
    const bIndex = PACKAGE_ORDER.indexOf(b.name)
    if (aIndex === -1 && bIndex === -1) return a.name.localeCompare(b.name, 'id')
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    return aIndex - bIndex
  })

  const all = { id: ALL_ID, name: 'Semua Paket', count: list.length }
  return [all, ...entries].map(withLabel)
}

export function filterTemplates(templates, styleId, packageId) {
  const list = safeList(templates)
  const style = normalize(styleId).toLowerCase()
  const pkg = normalize(packageId).toLowerCase()

  return list.filter((template) => {
    const styleMatch =
      !style || style === ALL_ID || normalize(template?.filterGroup).toLowerCase() === style
    const pkgMatch =
      !pkg || pkg === ALL_ID || normalize(template?.category).toLowerCase() === pkg
    return styleMatch && pkgMatch
  })
}

export function resolveFilterId(candidate, options) {
  const value = normalize(candidate).toLowerCase()
  if (!value) return ALL_ID

  const list = Array.isArray(options) ? options : []
  const match = list.find((opt) => normalize(opt?.id).toLowerCase() === value)
  return match ? match.id : ALL_ID
}
