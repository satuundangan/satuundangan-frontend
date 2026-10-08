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

// Levenshtein distance for typo-tolerant fuzzy matching (e.g. "kcing" -> "kucing", "naruto" -> "narutto")
export function levenshteinDistance(a, b) {
  if (a === b) return 0
  const al = a.length
  const bl = b.length
  if (al === 0) return bl
  if (bl === 0) return al

  const matrix = Array.from({ length: al + 1 }, () => new Array(bl + 1).fill(0))
  for (let i = 0; i <= al; i++) matrix[i][0] = i
  for (let j = 0; j <= bl; j++) matrix[0][j] = j

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost, // substitution
      )
    }
  }
  return matrix[al][bl]
}

// Indonesian wedding search synonym map for instant intuitive discovery
const SEARCH_SYNONYMS = {
  kucing: ['cat', 'meow', 'paw', 'purrfect', 'anabul', 'feline', 'pet'],
  cat: ['kucing', 'meow', 'paw', 'purrfect', 'anabul'],
  adat: ['tradisional', 'heritage', 'nusantara', 'budaya', 'jawa', 'sunda', 'minang', 'bali', 'batak', 'betawi', 'palembang', 'bugis', 'dayak'],
  jawa: ['truntum', 'keraton', 'solo', 'jogja', 'javanese'],
  sunda: ['sabilulungan', 'siger', 'priangan'],
  minang: ['padang', 'suntiang', 'marapulai', 'gadang'],
  bali: ['hindu', 'payas', 'kori', 'agung'],
  batak: ['gorga', 'ulos', 'ragi', 'hotang'],
  betawi: ['jakarta', 'palang', 'pintu'],
  palembang: ['sriwijaya', 'limas', 'aesan', 'gede'],
  bugis: ['makassar', 'saoraja', 'sulawesi'],
  dayak: ['kalimantan', 'ngaju', 'benang', 'bintik'],
  anime: ['wibu', 'jepang', 'naruto', 'one piece', 'luffy', 'kimi no na wa', 'demon slayer', 'kimetsu', 'tanjiro'],
  wibu: ['anime', 'jepang', 'manga', 'naruto', 'one piece', 'demon slayer'],
  islami: ['arab', 'muslim', 'moroccan', 'marrakech', 'hijab', 'syari', 'walimah', 'gold'],
  mewah: ['luxury', 'royal', 'gold', 'emerald', 'exclusive', 'old money', 'glamour'],
  elegan: ['mewah', 'dark', 'noir', 'royal', 'editorial'],
  vintage: ['retro', 'nostalgia', 'jadul', 'klasik', 'old money'],
  pink: ['strawberry', 'matcha', 'sakura', 'rose', 'blossom', 'romantis'],
  game: ['pixel', 'quest', 'retro', '8bit', 'arcade'],
}

/**
 * Score a template against search tokens:
 * - Exact substring matches in name / slug / filterGroup / description / tags give highest weight
 * - Synonym expansions give high weight
 * - Fuzzy Levenshtein distance (<= 2 edits) allows typo-tolerance
 */
export function scoreTemplateMatch(template, query) {
  const q = normalize(query).toLowerCase()
  if (!q) return 1

  const name = normalize(template?.name).toLowerCase()
  const slug = normalize(template?.slug).toLowerCase()
  const filterGroup = normalize(template?.filterGroup).toLowerCase()
  const category = normalize(template?.category).toLowerCase()
  const desc = normalize(template?.description).toLowerCase()

  let tagsText = ''
  try {
    if (typeof template?.tags === 'string') {
      tagsText = JSON.parse(template.tags).join(' ').toLowerCase()
    } else if (Array.isArray(template?.tags)) {
      tagsText = template.tags.join(' ').toLowerCase()
    }
  } catch {
    tagsText = String(template?.tags || '').toLowerCase()
  }

  const searchableText = `${name} ${slug} ${filterGroup} ${category} ${tagsText} ${desc}`

  // 1. Exact full phrase match
  if (name.includes(q) || slug.includes(q)) return 100
  if (searchableText.includes(q)) return 80

  // 2. Tokenize user query
  const tokens = q.split(/\s+/).filter(Boolean)
  let totalScore = 0

  for (const token of tokens) {
    if (token.length < 2) continue

    // Direct token substring match
    if (name.includes(token)) {
      totalScore += 50
      continue
    }
    if (filterGroup.includes(token) || category.includes(token) || tagsText.includes(token)) {
      totalScore += 35
      continue
    }
    if (desc.includes(token)) {
      totalScore += 20
      continue
    }

    // Synonym match
    const syns = SEARCH_SYNONYMS[token] || []
    let matchedSyn = false
    for (const syn of syns) {
      if (searchableText.includes(syn)) {
        totalScore += 30
        matchedSyn = true
        break
      }
    }
    if (matchedSyn) continue

    // Fuzzy typo match across template words
    const allWords = `${name} ${slug} ${filterGroup} ${tagsText}`.split(/[\s-_]+/).filter(Boolean)
    let bestDist = 99
    for (const word of allWords) {
      if (Math.abs(word.length - token.length) > 2) continue
      const dist = levenshteinDistance(token, word)
      if (dist < bestDist) bestDist = dist
    }

    if (bestDist === 1) {
      totalScore += 25 // 1 typo (e.g. narutto -> naruto)
    } else if (bestDist === 2 && token.length >= 4) {
      totalScore += 15 // 2 typos on longer words
    }
  }

  return totalScore
}

export function filterTemplates(templates, styleId, packageId, searchQuery = '') {
  const list = safeList(templates)
  const style = normalize(styleId).toLowerCase()
  const pkg = normalize(packageId).toLowerCase()
  const query = normalize(searchQuery).toLowerCase()

  // First apply category & package filter
  const baseFiltered = list.filter((template) => {
    const styleMatch =
      !style || style === ALL_ID || normalize(template?.filterGroup).toLowerCase() === style
    const pkgMatch =
      !pkg || pkg === ALL_ID || normalize(template?.category).toLowerCase() === pkg
    return styleMatch && pkgMatch
  })

  if (!query) return baseFiltered

  // Score matches
  const scored = baseFiltered
    .map((template) => ({
      template,
      score: scoreTemplateMatch(template, query),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  if (scored.length > 0) {
    return scored.map((item) => item.template)
  }

  // If filtered by style/package returned 0 hits, try searching across all templates
  // to give smart recommendations
  const allScored = list
    .map((template) => ({
      template,
      score: scoreTemplateMatch(template, query),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  return allScored.map((item) => item.template)
}

export function resolveFilterId(candidate, options) {
  const value = normalize(candidate).toLowerCase()
  if (!value) return ALL_ID

  const list = Array.isArray(options) ? options : []
  const match = list.find((opt) => normalize(opt?.id).toLowerCase() === value)
  return match ? match.id : ALL_ID
}
