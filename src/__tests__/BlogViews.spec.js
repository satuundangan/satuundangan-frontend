import { describe, it, expect, vi } from 'vitest'
import { fetchArticles } from '@/api/article'
import * as client from '@/api/client'

describe('Blog API & View Helpers', () => {
  it('fetchArticles forwards page, limit, and q parameters correctly', async () => {
    const spy = vi.spyOn(client, 'apiFetch').mockResolvedValue({ items: [], total: 0 })

    await fetchArticles({ page: 2, limit: 12, q: 'panduan' })
    expect(spy).toHaveBeenCalledWith('/articles?page=2&limit=12&q=panduan')

    await fetchArticles({ q: 'akad nikah' })
    expect(spy).toHaveBeenCalledWith('/articles?q=akad+nikah')

    spy.mockRestore()
  })

  it('generates WhatsApp share URL with encoded text and current link', () => {
    const title = 'Panduan Memilih Undangan Digital Pernikahan'
    const url = 'https://www.satuundangan.id/blog/panduan-memilih-undangan'
    const shareText = `${title}\n\nBaca artikel selengkapnya di Satu Undangan:`
    const waUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${url}`)}`

    expect(waUrl).toContain('https://wa.me/?text=')
    expect(waUrl).toContain(encodeURIComponent(title))
    expect(waUrl).toContain(encodeURIComponent(url))
  })

  it('correctly maps articles to smart categories', () => {
    const getCategory = (article) => {
      if (!article) return 'Panduan & Tips'
      if (article.category) return article.category
      const text = `${article.title || ''} ${article.excerpt || ''} ${article.focusKeyword || ''}`.toLowerCase()
      if (/adat|jawa|sunda|bali|batak|minang|tradisi|konsep|tema|modern|rustic|vintage/.test(text)) return 'Konsep & Adat'
      if (/susunan|rundown|akad|resepsi|acara|jadwal|tata urutan|mc/.test(text)) return 'Susunan Acara'
      if (/doa|ayat|mutiara|kutipan|quote|kata|ucapan|ar-rum|berkah|islami/.test(text)) return 'Kata Mutiara & Doa'
      if (/budget|biaya|katering|catering|hemat|anggaran|vendor|souvenir|harga/.test(text)) return 'Budget & Katering'
      return 'Panduan & Tips'
    }

    expect(getCategory({ title: 'Rundown Susunan Acara Akad dan Resepsi' })).toBe('Susunan Acara')
    expect(getCategory({ title: 'Koleksi Doa dan Kata Mutiara Undangan' })).toBe('Kata Mutiara & Doa')
    expect(getCategory({ title: 'Tips Menekan Budget Katering Pernikahan' })).toBe('Budget & Katering')
    expect(getCategory({ title: 'Inspirasi Konsep Adat Jawa Modern' })).toBe('Konsep & Adat')
    expect(getCategory({ title: 'Etika Menyebarkan Undangan Online' })).toBe('Panduan & Tips')
  })
})
