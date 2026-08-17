// Pure DOM helper (no Vue) for managing the single Google Fonts <link> that a
// dynamic-theme config needs. Replaces the mount-only injection stage 1 shipped —
// that version never updated once inserted, so a font change in the builder never
// visibly changed the rendered typeface. This one finds-or-creates and keeps the
// href in sync with whatever config is passed in.

import { googleFontsUrl } from './themeConfig'

export const THEME_FONTS_LINK_ATTR = 'data-dynamic-theme-fonts'

/**
 * Ensure exactly one `link[data-dynamic-theme-fonts]` exists in `doc.head` with
 * an href matching `googleFontsUrl(config)`. If the config resolves to no URL
 * (every family generic/system), the link is removed instead. Never throws.
 */
export function applyThemeFonts(config, doc = document) {
  if (typeof doc === 'undefined' || !doc) return null

  const url = googleFontsUrl(config)
  if (!url) {
    removeThemeFonts(doc)
    return null
  }

  let link = doc.head.querySelector(`link[${THEME_FONTS_LINK_ATTR}]`)
  if (!link) {
    link = doc.createElement('link')
    link.rel = 'stylesheet'
    link.setAttribute(THEME_FONTS_LINK_ATTR, '')
    doc.head.appendChild(link)
  }
  link.href = url
  return link
}

/**
 * Remove every `link[data-dynamic-theme-fonts]` from `doc.head`. Safe to call
 * repeatedly — a no-op when none exist.
 */
export function removeThemeFonts(doc = document) {
  if (typeof doc === 'undefined' || !doc) return
  doc.head.querySelectorAll(`link[${THEME_FONTS_LINK_ATTR}]`).forEach((el) => el.remove())
}
