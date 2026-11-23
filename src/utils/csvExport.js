const MAX_ROWS = 5000
const PAGE_SIZE = 100

/** Cells that start with a formula character are neutralised so a spreadsheet never runs them. */
export function csvCell(value) {
  if (value === null || value === undefined) return ''
  let text =
    value instanceof Date
      ? value.toISOString()
      : typeof value === 'object'
        ? JSON.stringify(value)
        : String(value)
  if (/^[=+\-@\t\r]/.test(text)) text = "'" + text
  return /[",\n\r]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text
}

export function toCsv(columns, rows) {
  const header = columns.map((column) => csvCell(column.label)).join(',')
  const lines = rows.map((row, idx) => columns.map((column) => csvCell(column.value(row, idx))).join(','))
  return [header, ...lines].join('\r\n')
}

export const guestExportColumns = [
  { label: 'No', value: (r, idx) => (idx !== undefined ? idx + 1 : r.no || '') },
  { label: 'Nama Tamu', value: (r) => r.name || '' },
  { label: 'Nomor WhatsApp', value: (r) => r.phoneNumber || '' },
  { label: 'Kategori', value: (r) => r.group || 'Umum' },
  { label: 'Sesi', value: (r) => r.sessionName || r.session || '-' },
  { label: 'No. Meja', value: (r) => r.tableNumber || '-' },
  { label: 'Status Kirim', value: (r) => (r.statusSend === 'sent' ? 'Sudah Terkirim' : 'Belum Terkirim') },
  { label: 'Status RSVP', value: (r) => r.rsvpStatus || 'Belum' },
  { label: 'Souvenir Diberikan', value: (r) => (r.souvenirGiven ? 'Sudah' : 'Belum') },
  { label: 'Kado Fisik/Amplop', value: (r) => r.physicalGiftNotes || '-' },
]

export function formatGuestExportRow(guest, idx = 0) {
  return {
    No: idx + 1,
    'Nama Tamu': guest.name || '',
    'Nomor WhatsApp': guest.phoneNumber || '',
    Kategori: guest.group || 'Umum',
    Sesi: guest.sessionName || guest.session || '-',
    'No. Meja': guest.tableNumber || '-',
    'Status Kirim': guest.statusSend === 'sent' ? 'Sudah Terkirim' : 'Belum Terkirim',
    'Status RSVP': guest.rsvpStatus || 'Belum',
    'Souvenir Diberikan': guest.souvenirGiven ? 'Sudah' : 'Belum',
    'Kado Fisik/Amplop': guest.physicalGiftNotes || '-',
  }
}

/**
 * Walks every page of a list endpoint with the current filters, so the export is not limited to the
 * page on screen. Stops at MAX_ROWS and says so instead of silently truncating.
 */
export async function fetchAllRows(fetchPage, params = {}) {
  const rows = []
  let total = 0
  for (let page = 1; rows.length < MAX_ROWS; page++) {
    const response = await fetchPage({ ...params, page, limit: PAGE_SIZE })
    const items = response?.data ?? response?.items ?? []
    total = Number(response?.total ?? items.length)
    rows.push(...items)
    if (!items.length || rows.length >= total) break
  }
  return { rows: rows.slice(0, MAX_ROWS), total, truncated: total > MAX_ROWS }
}

export function downloadCsv(filename, csv) {
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
