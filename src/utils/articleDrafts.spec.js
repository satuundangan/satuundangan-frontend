import { describe, expect, it } from 'vitest'
import { getArticleDraftKey, saveArticleDraft, readArticleDraft, clearArticleDraft, fromWibDateTimeInput, toWibDateTimeInput } from './articleDrafts.js'

const memoryStorage = () => {
  const values = new Map()
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) }
}

describe('admin article draft recovery', () => {
  it('isolates drafts by authenticated admin and article/new scope', () => {
    const storage = memoryStorage()
    expect(getArticleDraftKey(null, 10)).toBeNull()
    expect(getArticleDraftKey(1, 10)).not.toBe(getArticleDraftKey(2, 10))
    expect(getArticleDraftKey(1, 10)).not.toBe(getArticleDraftKey(1, null))
    expect(saveArticleDraft(storage, { userId: 1, articleId: 10, serverVersion: 3, data: { title: 'Draft satu', content: '<p>Isi</p>', token: 'must-not-save', editorialReviewed: true } }).ok).toBe(true)
    expect(readArticleDraft(storage, 2, 10).draft).toBeNull()
    const recovered = readArticleDraft(storage, 1, 10).draft
    expect(recovered.data).toEqual({ title: 'Draft satu', content: '<p>Isi</p>' })
    expect(recovered.serverVersion).toBe(3)
    clearArticleDraft(storage, 1, 10)
    expect(readArticleDraft(storage, 1, 10).draft).toBeNull()
  })

  it('reports corrupted or unavailable storage without throwing away server editing', () => {
    const storage = memoryStorage()
    storage.setItem(getArticleDraftKey(1, 10), '{bad')
    expect(readArticleDraft(storage, 1, 10)).toMatchObject({ draft: null, error: expect.any(String) })
    expect(saveArticleDraft({ setItem() { throw new Error('quota') } }, { userId: 1, articleId: 10, data: { title: 'Isi' } })).toMatchObject({ ok: false, error: expect.any(String) })
  })

  it('converts Jakarta input explicitly regardless of the machine timezone', () => {
    expect(fromWibDateTimeInput('2026-10-30T08:00')).toBe('2026-10-30T01:00:00.000Z')
    expect(toWibDateTimeInput('2026-10-30T01:00:00Z')).toBe('2026-10-30T08:00')
    expect(() => fromWibDateTimeInput('2026-02-30T08:00')).toThrow()
    expect(() => fromWibDateTimeInput('2026-10-30T08:00Z')).toThrow()
  })
})
