const loadedFonts = new Set()

export function loadGoogleFont(fontUrl) {
  if (typeof document === 'undefined' || !fontUrl) return
  if (loadedFonts.has(fontUrl)) return
  loadedFonts.add(fontUrl)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = fontUrl
  document.head.appendChild(link)
}

// For test suites / environment cleanup if needed
export function _resetLoadedFonts() {
  loadedFonts.clear()
}
