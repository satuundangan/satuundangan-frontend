/**
 * Event date/time helpers for invitation templates.
 *
 * Templates label event times "WIB", so dates and times must be rendered in Jakarta time for
 * every guest, wherever their device is. Formatting in the device timezone shows an 11.00 WIB
 * ceremony as 15.00 in Sydney, or even the previous day in the US.
 */

export const EVENT_TIME_ZONE = 'Asia/Jakarta'

// Asia/Jakarta has no DST, so WIB is always UTC+7.
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000

// "YYYY-MM-DDTHH:mm[:ss[.sss]]" without Z or an offset, e.g. a datetime-local value or a demo default.
const ZONELESS_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/

/**
 * Parses a stored event value into a Date. Zone-less date-times are WIB wall-clock times, not
 * device-local ones. Returns an invalid Date (check with isNaN) when the value can't be parsed.
 */
export function toEventDate(value) {
  if (value instanceof Date) return new Date(value.getTime())
  if (typeof value === 'string' && ZONELESS_DATE_TIME.test(value.trim())) {
    return new Date(`${value.trim()}+07:00`)
  }
  return new Date(value)
}

/**
 * Calendar parts of an event in WIB, for templates that build dates from getDate()/getMonth().
 * `month` is 0-based and `weekday` is 0 = Sunday, like the Date getters. Null when invalid.
 */
export function getEventDateParts(value) {
  const date = toEventDate(value)
  if (isNaN(date.getTime())) return null
  const wib = new Date(date.getTime() + WIB_OFFSET_MS)
  return {
    year: wib.getUTCFullYear(),
    month: wib.getUTCMonth(),
    day: wib.getUTCDate(),
    weekday: wib.getUTCDay(),
    hours: wib.getUTCHours(),
    minutes: wib.getUTCMinutes(),
  }
}
