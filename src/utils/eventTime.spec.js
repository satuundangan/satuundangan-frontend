import { describe, it, expect, afterEach } from 'vitest'
import { EVENT_TIME_ZONE, toEventDate, getEventDateParts } from './eventTime'

const ORIGINAL_TZ = process.env.TZ
// 11.00 WIB on Saturday 2 January 2027
const STORED = '2027-01-02T04:00:00.000Z'

function formatLikeTemplates(value) {
  const date = toEventDate(value)
  const day = date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: EVENT_TIME_ZONE,
  })
  const time = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: EVENT_TIME_ZONE,
  })
  return `${day} ${time}`
}

describe('eventTime', () => {
  afterEach(() => {
    process.env.TZ = ORIGINAL_TZ
  })

  it.each(['Asia/Jakarta', 'Australia/Sydney', 'America/Los_Angeles', 'UTC'])(
    'renders the WIB date and time for a guest in %s',
    (tz) => {
      process.env.TZ = tz
      expect(formatLikeTemplates(STORED)).toBe('Sabtu, 2 Januari 2027 11.00')
      expect(getEventDateParts(STORED)).toEqual({
        year: 2027,
        month: 0,
        day: 2,
        weekday: 6,
        hours: 11,
        minutes: 0,
      })
    },
  )

  it('treats zone-less date-times as WIB wall-clock time', () => {
    process.env.TZ = 'America/Los_Angeles'
    expect(toEventDate('2027-01-02T11:00').toISOString()).toBe(STORED)
    expect(toEventDate('2027-01-02T11:00:00').toISOString()).toBe(STORED)
    expect(toEventDate('2027-01-02T11:00:00+07:00').toISOString()).toBe(STORED)
    expect(toEventDate(new Date(STORED)).toISOString()).toBe(STORED)
  })

  it('keeps the WIB calendar day when UTC is still on the previous day', () => {
    process.env.TZ = 'America/Los_Angeles'
    // 01.30 WIB on 2 January is 18.30 UTC on 1 January
    expect(getEventDateParts('2027-01-01T18:30:00.000Z')).toMatchObject({ month: 0, day: 2 })
  })

  it('returns an invalid date / null for unparseable values', () => {
    expect(isNaN(toEventDate('bukan tanggal').getTime())).toBe(true)
    expect(getEventDateParts('bukan tanggal')).toBeNull()
    expect(getEventDateParts(undefined)).toBeNull()
  })
})
