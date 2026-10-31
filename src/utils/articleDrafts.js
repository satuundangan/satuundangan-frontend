const FIELDS = ['title', 'slug', 'content', 'excerpt', 'coverImage', 'status', 'metaTitle', 'metaDescription', 'focusKeyword', 'ogImage', 'canonicalUrl', 'sourceUrls', 'reviewNotes', 'generatedByAi', 'scheduledPublishAt']
const identity = (value) => /^\d+$/.test(String(value ?? '')) && Number(value) > 0 ? String(value) : null
const articleIdentity = (value) => value == null || value === '' ? 'new' : identity(value)
const pickData = (data) => Object.fromEntries(FIELDS.filter((field) => Object.hasOwn(data || {}, field)).map((field) => [field, field === 'sourceUrls' ? (Array.isArray(data[field]) ? data[field].filter((value) => typeof value === 'string') : []) : data[field]]))

export function getArticleDraftKey(userId, articleId) {
  const owner = identity(userId)
  const article = articleIdentity(articleId)
  return owner && article ? `admin-article-draft:v1:${owner}:${article}` : null
}

export function saveArticleDraft(storage, { userId, articleId, data, serverVersion = null }) {
  const key = getArticleDraftKey(userId, articleId)
  if (!key) return { ok: false, error: 'Identitas admin belum tersedia untuk menyimpan draft perangkat.' }
  const draft = { schemaVersion: 1, userId: identity(userId), articleId: articleIdentity(articleId), savedAt: new Date().toISOString(), serverVersion, data: pickData(data) }
  try {
    const payload = JSON.stringify(draft)
    if (payload.length > 2_000_000) throw new Error('Draft terlalu besar untuk penyimpanan perangkat.')
    storage.setItem(key, payload)
    return { ok: true, draft }
  } catch {
    return { ok: false, error: 'Draft belum tersimpan di perangkat. Penyimpanan mungkin penuh atau tidak tersedia; simpan ke server sebelum keluar.' }
  }
}

export function readArticleDraft(storage, userId, articleId) {
  const key = getArticleDraftKey(userId, articleId)
  if (!key) return { draft: null, error: '' }
  try {
    const value = storage.getItem(key)
    if (!value) return { draft: null, error: '' }
    const draft = JSON.parse(value)
    if (draft?.schemaVersion !== 1 || draft.userId !== identity(userId) || draft.articleId !== articleIdentity(articleId) || !draft.data || typeof draft.data !== 'object' || Array.isArray(draft.data) || !Number.isFinite(Date.parse(draft.savedAt))) throw new Error('Invalid draft')
    return { draft: { ...draft, data: pickData(draft.data) }, error: '' }
  } catch {
    return { draft: null, error: 'Draft perangkat tidak dapat dibaca. Konten dari server tetap tersedia.' }
  }
}

export function clearArticleDraft(storage, userId, articleId) {
  const key = getArticleDraftKey(userId, articleId)
  try {
    if (key) storage.removeItem(key)
    return { ok: true }
  } catch {
    return { ok: false, error: 'Draft perangkat belum dapat dihapus.' }
  }
}

export function toWibDateTimeInput(value) {
  if (!value) return ''
  const millis = Date.parse(value)
  return Number.isFinite(millis) ? new Date(millis + 7 * 60 * 60 * 1000).toISOString().slice(0, 16) : ''
}

export function fromWibDateTimeInput(value) {
  if (!value) return null
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new Error('Tanggal dan jam jadwal tidak valid.')
  const millis = Date.parse(`${value}:00+07:00`)
  if (!Number.isFinite(millis) || toWibDateTimeInput(new Date(millis).toISOString()) !== value) throw new Error('Tanggal dan jam jadwal tidak valid.')
  return new Date(millis).toISOString()
}
