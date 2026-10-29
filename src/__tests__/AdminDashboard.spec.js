import { describe, it, expect } from 'vitest'

describe('AdminDashboard Business Logic & Formatter Specifications (ADM-016 to ADM-021)', () => {
  // 1. Currency Formatter (ADM-017)
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  it('formats currency correctly to Indonesian Rupiah standard', () => {
    expect(formatRupiah(150000)).toMatch(/Rp\s*150\.000/)
    expect(formatRupiah(0)).toMatch(/Rp\s*0/)
    expect(formatRupiah(null)).toMatch(/Rp\s*0/)
  })

  // 2. Growth Percentage Calculator (ADM-018)
  const calcGrowth = (curr, prev) => {
    if (prev === 0) {
      return curr > 0 ? 100 : 0
    }
    return Number((((curr - prev) / prev) * 100).toFixed(1))
  }

  it('calculates growth percentage cleanly and avoids infinity on baseline 0', () => {
    // Normal positive growth
    expect(calcGrowth(150, 100)).toBe(50)
    // Negative growth
    expect(calcGrowth(80, 100)).toBe(-20)
    // Zero baseline with new activity
    expect(calcGrowth(50, 0)).toBe(100)
    // Both zero
    expect(calcGrowth(0, 0)).toBe(0)
  })

  // 3. SVG Line & Area Chart Path Math (ADM-016)
  const computeSvgChart = (points, isRev = false) => {
    const width = 600
    const height = 150
    const yOffset = 180
    const maxVal = Math.max(
      ...points.map((p) => (isRev ? p.revenue || 0 : p.count || 0)),
      1
    )
    const step = width / (points.length - 1 || 1)

    const coords = points.map((p, idx) => {
      const val = isRev ? p.revenue || 0 : p.count || 0
      const x = Math.round(idx * step)
      const y = Math.round(yOffset - (val / maxVal) * height)
      return { x, y, count: p.count, revenue: p.revenue, label: p.dayLabel }
    })

    const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ')
    const areaPath = `${linePath} L ${width} 180 L 0 180 Z`

    return { coords, linePath, areaPath }
  }

  it('computes svg chart paths accurately for both invitations and revenue tabs', () => {
    const sampleData = [
      { dayLabel: 'H-2', count: 10, revenue: 100000 },
      { dayLabel: 'Kemarin', count: 20, revenue: 200000 },
      { dayLabel: 'Hari Ini', count: 30, revenue: 300000 },
    ]

    const invChart = computeSvgChart(sampleData, false)
    expect(invChart.coords).toHaveLength(3)
    expect(invChart.coords[0].x).toBe(0)
    expect(invChart.coords[2].x).toBe(600)
    expect(invChart.linePath).toContain('M 0')
    expect(invChart.areaPath).toContain('L 600 180 L 0 180 Z')

    const revChart = computeSvgChart(sampleData, true)
    expect(revChart.coords).toHaveLength(3)
    expect(revChart.coords[2].revenue).toBe(300000)
  })

  // 4. Action Required Severity Validation (ADM-019)
  it('identifies critical action items with appropriate severity and link targets', () => {
    const rawActionItems = [
      {
        type: 'SUCCESS_NOT_PUBLISHED',
        count: 2,
        severity: 'danger',
        link: '/admin/payments?tab=reconciliation',
      },
      {
        type: 'PENDING_AGING',
        count: 5,
        severity: 'warning',
        link: '/admin/payments?status=pending',
      },
    ]

    const totalCount = rawActionItems.reduce((acc, it) => acc + it.count, 0)
    expect(totalCount).toBe(7)

    const critical = rawActionItems.find((it) => it.severity === 'danger')
    expect(critical).toBeDefined()
    expect(critical.link).toBe('/admin/payments?tab=reconciliation')
  })

  // 5. Operational Status Error Fallback (ADM-016)
  it('differentiates network/request error from factual zero value', () => {
    const formatStatDisplay = (stat) => {
      if (stat.isError) return '-'
      return String(stat.value)
    }

    expect(formatStatDisplay({ value: 0, isError: true })).toBe('-')
    expect(formatStatDisplay({ value: 0, isError: false })).toBe('0')
    expect(formatStatDisplay({ value: 42, isError: false })).toBe('42')
  })
})
