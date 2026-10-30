import { describe, expect, it, vi } from 'vitest'
import { csvCell, fetchAllRows, toCsv } from './csvExport'
import { useColumnVisibility } from './columnVisibility'

describe('csv export', () => {
  it('quotes separators and neutralises spreadsheet formulas', () => {
    expect(csvCell('a,b')).toBe('"a,b"')
    expect(csvCell('say "hi"')).toBe('"say ""hi"""')
    expect(csvCell('=HYPERLINK("http://x")')).toBe('"\'=HYPERLINK(""http://x"")"')
    expect(csvCell('+62812')).toBe("'+62812")
    expect(csvCell(null)).toBe('')
    expect(csvCell({ a: 1 })).toBe('"{""a"":1}"')
  })

  it('builds a header and rows', () => {
    const csv = toCsv([{ label: 'ID', value: (r) => r.id }, { label: 'Nama', value: (r) => r.name }], [{ id: 1, name: 'Rani' }])
    expect(csv).toBe('ID,Nama\r\n1,Rani')
  })

  it('collects every page with the active filters, not only the visible one', async () => {
    const fetchPage = vi.fn(async ({ page, limit }) => ({
      data: Array.from({ length: Math.min(limit, 250 - (page - 1) * limit) }, (_, i) => ({ id: (page - 1) * limit + i })),
      total: 250,
    }))
    const { rows, total, truncated } = await fetchAllRows(fetchPage, { q: 'rani' })
    expect(rows).toHaveLength(250)
    expect(total).toBe(250)
    expect(truncated).toBe(false)
    expect(fetchPage).toHaveBeenCalledTimes(3)
    expect(fetchPage).toHaveBeenCalledWith(expect.objectContaining({ q: 'rani', page: 1, limit: 100 }))
  })

  it('says so when the export is truncated at the cap', async () => {
    const fetchPage = vi.fn(async ({ limit }) => ({ data: Array.from({ length: limit }, (_, i) => ({ id: i })), total: 9000 }))
    const { rows, truncated } = await fetchAllRows(fetchPage)
    expect(rows).toHaveLength(5000)
    expect(truncated).toBe(true)
  })
})

describe('column visibility', () => {
  const columns = [{ key: 'name', label: 'Nama', required: true }, { key: 'email', label: 'Email' }]

  it('hides a column, keeps required ones, and remembers the choice', () => {
    localStorage.clear()
    const first = useColumnVisibility('t1', columns)
    first.toggle('email')
    first.toggle('name')
    expect(first.isVisible('email')).toBe(false)
    expect(first.isVisible('name')).toBe(true)
    expect(useColumnVisibility('t1', columns).isVisible('email')).toBe(false)
    first.reset()
    expect(useColumnVisibility('t1', columns).isVisible('email')).toBe(true)
  })

  it('shows every column when storage is unavailable or corrupt', () => {
    localStorage.setItem('admin-columns:t2', '{not json')
    expect(useColumnVisibility('t2', columns).isVisible('email')).toBe(true)
  })
})
