import slugify from 'slugify'

const clean = (value) => String(value ?? '').trim()
const normalize = (value) => clean(value).toLowerCase().replace(/\s+/g, ' ')

function contentText(content) {
  const html = String(content ?? '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
  const decoded =
    typeof DOMParser !== 'undefined'
      ? new DOMParser().parseFromString(html, 'text/html').body.textContent
      : html.replace(/&nbsp;|&#160;/gi, ' ').replace(/&amp;/gi, '&')
  return normalize(decoded)
}

/** A shared content checklist; this measures completeness, not search ranking. */
export function getArticleSeoChecklist(article = {}) {
  const keyword = normalize(article.focusKeyword)
  const metaTitle = clean(article.metaTitle)
  const metaDescription = clean(article.metaDescription)
  const content = contentText(article.content)
  const keywordSlug = slugify(keyword, { lower: true, strict: true })
  const matches = (value) => Boolean(keyword) && normalize(value).includes(keyword)

  return [
    { id: 'keyword', label: 'Focus keyword diisi', passed: Boolean(keyword) },
    {
      id: 'meta-title',
      label: 'Meta title diisi (30–70 karakter)',
      passed: metaTitle.length >= 30 && metaTitle.length <= 70,
    },
    {
      id: 'meta-description',
      label: 'Meta description diisi (80–160 karakter)',
      passed: metaDescription.length >= 80 && metaDescription.length <= 160,
    },
    { id: 'excerpt', label: 'Excerpt / ringkasan diisi', passed: Boolean(clean(article.excerpt)) },
    {
      id: 'image',
      label: 'Cover image atau OG image diisi',
      passed: Boolean(clean(article.coverImage) || clean(article.ogImage)),
    },
    { id: 'keyword-title', label: 'Keyword ada di meta title', passed: matches(metaTitle) },
    {
      id: 'keyword-description',
      label: 'Keyword ada di meta description',
      passed: matches(metaDescription),
    },
    {
      id: 'keyword-slug',
      label: 'Slug mengandung keyword',
      passed: Boolean(keywordSlug) && normalize(article.slug).includes(keywordSlug),
    },
    {
      id: 'content-length',
      label: 'Konten minimal 300 kata',
      passed: Boolean(content) && content.split(/\s+/).length >= 300,
    },
    { id: 'keyword-content', label: 'Keyword ada di konten', passed: matches(content) },
  ]
}

export function getArticleSeoScore(article) {
  const checks = getArticleSeoChecklist(article)
  return Math.round((checks.filter((check) => check.passed).length / checks.length) * 100)
}
