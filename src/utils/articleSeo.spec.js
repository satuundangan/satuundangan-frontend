import { describe, expect, it } from 'vitest'
import { getArticleSeoChecklist, getArticleSeoScore } from './articleSeo.js'

const completeArticle = () => ({
  focusKeyword: 'undangan digital',
  metaTitle: 'Panduan Undangan Digital Pernikahan Modern',
  metaDescription:
    'Panduan undangan digital untuk merencanakan pernikahan dengan mudah, lengkap dengan informasi tamu dan acara.',
  excerpt: 'Panduan membuat undangan.',
  coverImage: '/cover.jpg',
  slug: 'panduan-undangan-digital',
  content: `<h2>Undangan digital</h2><p>${'pernikahan '.repeat(300)}</p>`,
})

describe('article SEO completeness', () => {
  it('uses the same ten checks for a complete article', () => {
    expect(getArticleSeoChecklist(completeArticle())).toHaveLength(10)
    expect(getArticleSeoScore(completeArticle())).toBe(100)
  })

  it('does not treat blank keywords or whitespace fields as present or matched', () => {
    const article = { ...completeArticle(), focusKeyword: '   ', excerpt: '  ', coverImage: ' ' }
    const checks = getArticleSeoChecklist(article)
    expect(checks.find((check) => check.id === 'keyword').passed).toBe(false)
    expect(
      checks.filter((check) => check.id.startsWith('keyword-')).every((check) => !check.passed),
    ).toBe(true)
    expect(checks.find((check) => check.id === 'excerpt').passed).toBe(false)
    expect(checks.find((check) => check.id === 'image').passed).toBe(false)
  })

  it('counts rendered words and ignores markup, scripts, and styles', () => {
    const article = {
      ...completeArticle(),
      content: `<style>${'word '.repeat(400)}</style><script>${'word '.repeat(400)}</script><p>undangan&nbsp;digital</p>`,
    }
    const checks = getArticleSeoChecklist(article)
    expect(checks.find((check) => check.id === 'content-length').passed).toBe(false)
    expect(checks.find((check) => check.id === 'keyword-content').passed).toBe(true)
  })

  it('normalizes HTML entities and punctuation for keyword slug checks', () => {
    const article = {
      ...completeArticle(),
      focusKeyword: 'Undangan Digital!',
      slug: 'panduan-undangan-digital',
    }
    expect(
      getArticleSeoChecklist(article).find((check) => check.id === 'keyword-slug').passed,
    ).toBe(true)
  })

  it('documents the actual title and description bounds', () => {
    const checks = getArticleSeoChecklist({
      metaTitle: 'a'.repeat(30),
      metaDescription: 'a'.repeat(80),
    })
    expect(checks.find((check) => check.id === 'meta-title')).toMatchObject({
      passed: true,
      label: expect.stringContaining('30–70'),
    })
    expect(checks.find((check) => check.id === 'meta-description')).toMatchObject({
      passed: true,
      label: expect.stringContaining('80–160'),
    })
  })
})
