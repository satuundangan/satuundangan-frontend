import slugify from 'slugify'

/**
 * Default words per minute for reading estimation (standard average adult reading speed).
 */
export const DEFAULT_WPM = 200

/**
 * Strips HTML tags and entities from an HTML string safely.
 *
 * @param {string} html
 * @returns {string}
 */
export function stripHtml(html) {
  if (!html || typeof html !== 'string') return ''
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Counts total words in a given text or HTML content.
 *
 * @param {string} content
 * @returns {number}
 */
export function countWords(content) {
  if (!content || typeof content !== 'string') return 0
  const plainText = stripHtml(content)
  if (!plainText) return 0
  const matches = plainText.match(/[\p{L}\p{N}_\-]+/gu)
  return matches ? matches.length : 0
}

/**
 * Calculates estimated reading time in minutes based on words-per-minute formula.
 *
 * @param {string} content - HTML or plain text string
 * @param {number} [wordsPerMinute=DEFAULT_WPM] - Reading speed in WPM (~200 wpm)
 * @returns {number} Estimated minutes (0 if empty/no words, >= 1 otherwise)
 */
export function calculateReadingTime(content, wordsPerMinute = DEFAULT_WPM) {
  const wpm = typeof wordsPerMinute === 'number' && wordsPerMinute > 0 ? wordsPerMinute : DEFAULT_WPM
  const words = countWords(content)
  if (words === 0) return 0
  return Math.ceil(words / wpm)
}

/**
 * Formats reading time into a human-friendly Indonesian label.
 *
 * @param {number} minutes
 * @returns {string}
 */
export function formatReadingTime(minutes) {
  if (!minutes || minutes <= 0) return 'Kurang dari 1 menit baca'
  return `${minutes} menit baca`
}

/**
 * Returns reading time statistics (minutes, word count, formatted label).
 *
 * @param {string} content
 * @param {number} [wordsPerMinute=DEFAULT_WPM]
 * @returns {{ minutes: number, words: number, text: string }}
 */
export function getReadingTimeStats(content, wordsPerMinute = DEFAULT_WPM) {
  const words = countWords(content)
  const minutes = calculateReadingTime(content, wordsPerMinute)
  return {
    minutes,
    words,
    text: formatReadingTime(minutes),
  }
}

/**
 * Extracts h2 and h3 headings from HTML content to build a Table of Contents (TOC).
 * Generates unique slug IDs for anchors and handles empty or heading-less content safely.
 *
 * @param {string} htmlContent
 * @returns {Array<{ id: string, slug: string, text: string, level: number, tag: string }>}
 */
export function parseTableOfContents(htmlContent) {
  if (!htmlContent || typeof htmlContent !== 'string') return []

  const headingRegex = /<h([23])(?:\s+([^>]*))?>(.*?)<\/h\1>/gis
  const results = []
  const usedSlugs = new Set()
  let match
  let index = 0

  while ((match = headingRegex.exec(htmlContent)) !== null) {
    index++
    const level = parseInt(match[1], 10)
    const attributes = match[2] || ''
    const innerHtml = match[3] || ''

    // Clean plain text
    const text = stripHtml(innerHtml)
    if (!text) continue

    // Check if an existing id was defined in attributes
    let customId = null
    const idMatch = attributes.match(/\bid=["']([^"']+)["']/i)
    if (idMatch && idMatch[1]) {
      customId = idMatch[1].trim()
    }

    // Generate unique slug
    let baseSlug = customId || slugify(text, { lower: true, strict: true }) || `heading-${index}`
    let slug = baseSlug
    let counter = 1

    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter}`
      counter++
    }
    usedSlugs.add(slug)

    results.push({
      id: slug,
      slug,
      text,
      level,
      tag: `h${level}`,
    })
  }

  return results
}

// Alias for convenience
export const extractHeadings = parseTableOfContents

/**
 * Filters articles by search query (matching title or excerpt) and category.
 *
 * @param {Array<Object>} articles - List of article objects
 * @param {Object} [options]
 * @param {string} [options.search=''] - Keyword to match in title or excerpt
 * @param {string} [options.category=''] - Category name or slug ('all' / 'semua' to ignore)
 * @returns {Array<Object>}
 */
export function filterArticles(articles, { search = '', category = '' } = {}) {
  if (!Array.isArray(articles)) return []

  const query = (typeof search === 'string' ? search.trim().toLowerCase() : '')
  const rawCategory = typeof category === 'string' ? category.trim().toLowerCase() : ''
  const isAllCategory = !rawCategory || rawCategory === 'all' || rawCategory === 'semua'

  return articles.filter((article) => {
    if (!article || typeof article !== 'object') return false

    // Category match
    if (!isAllCategory) {
      const artCat = typeof article.category === 'string' 
        ? article.category.trim().toLowerCase() 
        : (article.category?.name || article.category?.slug || '').toString().toLowerCase()
      if (artCat !== rawCategory) {
        return false
      }
    }

    // Search query match (title or excerpt)
    if (query) {
      const title = (article.title || '').toString().toLowerCase()
      const excerpt = (article.excerpt || stripHtml(article.content || '')).toString().toLowerCase()
      const matchesTitle = title.includes(query)
      const matchesExcerpt = excerpt.includes(query)
      if (!matchesTitle && !matchesExcerpt) {
        return false
      }
    }

    return true
  })
}

// Alias for convenience
export const searchAndFilterArticles = filterArticles

/**
 * Curated contextual cover image mapping for wedding articles.
 * Resolves contextually accurate high-res imagery based on article topic, title, and keyword.
 *
 * @param {Object} article
 * @param {string} [fallbackUrl]
 * @returns {string}
 */
export function getArticleCover(article, fallbackUrl = 'https://images.unsplash.com/photo-1737749685390-0959c05aecbb?auto=format&fit=crop&w=1200&q=80') {
  if (!article) return fallbackUrl

  const rawCover = article.coverImage || article.ogImage
  const isGenericPlaceholder = rawCover && rawCover.includes('photo-1519741497674-611481863552')

  // If article has a customized, non-generic image, preserve it
  if (rawCover && !isGenericPlaceholder) {
    return rawCover
  }

  // Resolve contextually based on title, category, and keyword
  const text = `${article.title || ''} ${article.focusKeyword || ''} ${article.category || ''}`.toLowerCase()

  if (text.includes('kristen') || text.includes('alkitab') || text.includes('gereja') || text.includes('matrimony')) {
    return 'https://images.unsplash.com/photo-1561345806-a2a89814df7a?auto=format&fit=crop&w=1200&q=80'
  }
  if (text.includes('katolik') || text.includes('sakramen')) {
    return 'https://images.unsplash.com/photo-1769374072596-cec462031154?auto=format&fit=crop&w=1200&q=80'
  }
  if (text.includes('quran') || text.includes('ar rum') || text.includes('ayat')) {
    return 'https://images.unsplash.com/photo-1665306376180-3349308d5a38?auto=format&fit=crop&w=1200&q=80'
  }
  if (text.includes('islami') || text.includes('sunnah') || text.includes('walimatul') || text.includes('akad')) {
    return 'https://images.unsplash.com/photo-1653137790376-8f7f92afe14e?auto=format&fit=crop&w=1200&q=80'
  }
  if (text.includes('turut mengundang') || text.includes('teks undangan') || text.includes('kata mutiara')) {
    return 'https://images.unsplash.com/photo-1647470224844-054e5023ebf9?auto=format&fit=crop&w=1200&q=80'
  }
  if (text.includes('panitia') || text.includes('checklist') || text.includes('tugas')) {
    return 'https://images.unsplash.com/photo-1759661937582-0ccd5dacf20f?auto=format&fit=crop&w=1200&q=80'
  }
  if (text.includes('rundown') || text.includes('susunan acara') || text.includes('resepsi') || text.includes('mc')) {
    return 'https://images.unsplash.com/photo-1677768061409-3d4fbd0250d1?auto=format&fit=crop&w=1200&q=80'
  }
  if (text.includes('budget') || text.includes('biaya') || text.includes('hemat') || text.includes('seserahan')) {
    return 'https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=1200&q=80'
  }
  if (text.includes('jawa') || text.includes('panggih') || text.includes('siraman')) {
    return 'https://images.unsplash.com/photo-1551843326-629cf58c42a5?auto=format&fit=crop&w=1200&q=80'
  }
  if (text.includes('sunda') || text.includes('siger')) {
    return 'https://images.unsplash.com/photo-1610425303802-f09737e52e28?auto=format&fit=crop&w=1200&q=80'
  }
  if (text.includes('anime') || text.includes('jepang')) {
    return 'https://images.unsplash.com/photo-1519882189396-71f93cb4714b?auto=format&fit=crop&w=1200&q=80'
  }
  if (text.includes('lagu') || text.includes('musik')) {
    return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80'
  }

  return rawCover || fallbackUrl
}

