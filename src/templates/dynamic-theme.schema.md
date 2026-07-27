# `designConfig` v1 schema

This is the schema for the `designConfig` JSON blob stored on a `template_designs` row
(backend: `TemplateDesign.designConfig`, a nullable `text` column serialized as JSON).
It is consumed by `src/templates/dynamic-theme.vue` via
`src/utils/themeConfig.js` (`normalizeThemeConfig`, `themeCssVars`, `googleFontsUrl`,
`sectionStyle`).

**Every field below is optional.** `normalizeThemeConfig(raw)` deep-merges whatever is
provided on top of `THEME_DEFAULTS` — missing keys, a missing `designConfig` entirely,
or a malformed JSON string all resolve to a complete, renderable config. **Unknown
fields are ignored** (silently dropped on the next merge; they are never validated or
rejected).

This document is the source of truth stage 2's admin builder UI will generate its form
from — one section per top-level key.

---

## `version`

| Field     | Type   | Default | Notes                                   |
| --------- | ------ | ------- | ---------------------------------------- |
| `version` | number | `1`     | Schema version tag. Not yet enforced. |

---

## `colors`

Flat hex color tokens. Every key maps 1:1 to a CSS custom property
`--dt-color-<kebab-case-key>` (see `themeCssVars`).

| Field       | Type            | Default     | Controls                                                        |
| ----------- | --------------- | ----------- | ---------------------------------------------------------------- |
| `primary`   | hex color string | `#8a6f52`  | Headings, primary buttons, accents, active states                |
| `secondary` | hex color string | `#c4a882`  | Secondary buttons, subheadings, borders                          |
| `accent`    | hex color string | `#b08d57`  | Highlights, dividers, icon accents                                |
| `background`| hex color string | `#faf7f2`  | Page background (outside sections with an explicit override)     |
| `surface`   | hex color string | `#ffffff`  | Card/panel background, default section background                |
| `text`      | hex color string | `#3a332c`  | Body copy color                                                   |
| `textMuted` | hex color string | `#8a8178`  | Secondary/muted copy (dates, captions, helper text)               |

---

## `fonts`

Three font roles, each an object of `{ family, weights, fallback }`.
`themeCssVars` exposes each as `--dt-font-<role>` = `"'<family>', <fallback>"`.
`googleFontsUrl` builds one Google Fonts CSS2 URL from all three (deduped by family;
families matching a common generic/system stack — `serif`, `sans-serif`, `Arial`,
etc. — are skipped, and the whole function returns `null` if nothing remains).

| Role      | Field      | Type              | Default                                      | Controls                          |
| --------- | ---------- | ----------------- | --------------------------------------------- | ---------------------------------- |
| `heading` | `family`   | string            | `Cormorant Garamond`                          | Section titles, couple names       |
|           | `weights`  | number[]          | `[400, 600]`                                  | Loaded font weights                |
|           | `fallback` | string            | `serif`                                       | CSS fallback stack                 |
| `script`  | `family`   | string            | `Great Vibes`                                 | Decorative/cursive accents (e.g. couple names on the cover) |
|           | `weights`  | number[]          | `[400]`                                       | Loaded font weights                |
|           | `fallback` | string            | `cursive`                                     | CSS fallback stack                 |
| `body`    | `family`   | string            | `Inter`                                       | Paragraph text, form labels        |
|           | `weights`  | number[]          | `[300, 400, 600]`                             | Loaded font weights                |
|           | `fallback` | string            | `sans-serif`                                  | CSS fallback stack                 |

---

## `hero`

The cover/hero visual treatment.

| Field             | Type   | Allowed values                            | Default     | Controls                                                    |
| ----------------- | ------ | ------------------------------------------ | ----------- | -------------------------------------------------------------- |
| `variant`         | string | `classic` \| `full-photo` \| `framed`      | `classic`   | Layout: unknown value silently falls back to `classic`         |
| `backgroundImage` | string (URL) | any                                   | `''`        | Hero background image; falls back to `data.photoCoupleUrl` when empty |
| `overlayColor`    | hex color string | any                                  | `#000000`   | Color of the dark/tint overlay atop the hero image              |
| `overlayOpacity`  | number  | `0..1` (clamped; non-numeric -> default)   | `0.35`      | Overlay strength                                                |

**Variants:**
- `classic` — names centered over `backgroundImage`/`photoCoupleUrl`.
- `full-photo` — edge-to-edge photo, names bottom-anchored.
- `framed` — inset photo inside a bordered frame, names below.

---

## `sections`

Per-section-key overrides. Keys come from `THEME_SECTION_KEYS`:

```
hero, quote, couple, event, love-story, gallery, gift, rsvp, wishes, footer
```

A section key missing from `sections` gets a seeded default entry
(`{ background: { type: 'color', value: colors.surface }, ornamentTop: '', ornamentBottom: '' }`)
before any merge — `sectionStyle(config, key)` never sees a hole, even for an
unrecognized key (it falls back to the same surface-color default).

Each entry:

| Field            | Type   | Default                                    | Controls                                              |
| ---------------- | ------ | -------------------------------------------- | -------------------------------------------------------- |
| `background`     | object | `{ type: 'color', value: colors.surface }`   | See below                                                |
| `ornamentTop`    | string (URL) | `''`                                   | Decorative image strip absolutely positioned at the section's top edge |
| `ornamentBottom` | string (URL) | `''`                                   | Same, at the bottom edge                                  |

`background.type` — one of:

| `type`     | Extra fields                       | Rendered as                                                       |
| ---------- | ----------------------------------- | -------------------------------------------------------------------- |
| `color`    | `value` (hex string)                | `{ backgroundColor: value }`                                          |
| `gradient` | `from`, `to`, optional `direction` (CSS angle, default `180deg`) | `{ backgroundImage: 'linear-gradient(<direction>, <from>, <to>)' }` |
| `image`    | `url`                               | `{ backgroundImage: 'url("<url>")', backgroundSize: 'cover', backgroundPosition: 'center' }` |

---

## `ornaments`

Global decorative image URLs (not per-section).

| Field     | Type (URL) | Default | Controls                                                        |
| --------- | ---------- | ------- | ------------------------------------------------------------------ |
| `corner`  | string     | `''`    | Rendered in all four corners of the cover gate (empty = hidden)    |
| `divider` | string     | `''`    | Rendered between the couple and event sections (empty = hidden)   |
| `frame`   | string     | `''`    | Frames the couple photos in the `couple` section (empty = plain)  |

---

## `decor`

Global surface texture/shape tokens.

| Field           | Type    | Default    | Controls                                                             |
| --------------- | ------- | ---------- | ------------------------------------------------------------------------ |
| `borderRadius`  | CSS length string | `1.5rem` | `--dt-radius` — corner rounding on cards/buttons/images across the theme |
| `patternUrl`    | string (URL) | `''`  | Fixed, repeating background texture behind the whole invitation (empty = none) |
| `patternOpacity`| number  | `0.08` (`0..1`, clamped; non-numeric -> default) | Opacity of `patternUrl`             |

---

## Derived CSS custom properties (`themeCssVars`)

`themeCssVars(config)` flattens the normalized config into a Vue `:style` object,
all keys prefixed `--dt-`:

```
--dt-color-primary, --dt-color-secondary, --dt-color-accent,
--dt-color-background, --dt-color-surface, --dt-color-text, --dt-color-text-muted,
--dt-font-heading, --dt-font-script, --dt-font-body,
--dt-radius, --dt-overlay-color, --dt-overlay-opacity
```

`dynamic-theme.vue` applies this object to its root element and consumes every value
via `var(--dt-*)` — zero hardcoded hex colors in that file.

---

## Complete example — "Tema Batak" (ulos/gorga motif)

Copy-pasteable `designConfig` for a `POST /admin/template-designs` payload with
`componentKey: 'dynamic-theme'`:

```json
{
  "version": 1,
  "colors": {
    "primary": "#7a1620",
    "secondary": "#c9a227",
    "accent": "#1c1c1c",
    "background": "#f5efe1",
    "surface": "#fffaf0",
    "text": "#2a1a12",
    "textMuted": "#7a6a58"
  },
  "fonts": {
    "heading": { "family": "Playfair Display", "weights": [400, 700], "fallback": "serif" },
    "script": { "family": "Great Vibes", "weights": [400], "fallback": "cursive" },
    "body": { "family": "Inter", "weights": [400, 600], "fallback": "sans-serif" }
  },
  "hero": {
    "variant": "full-photo",
    "backgroundImage": "https://cdn.satuundangan.id/themes/batak/hero-ulos.jpg",
    "overlayColor": "#1c1c1c",
    "overlayOpacity": 0.45
  },
  "sections": {
    "hero": {
      "background": { "type": "color", "value": "#1c1c1c" },
      "ornamentTop": "",
      "ornamentBottom": ""
    },
    "couple": {
      "background": {
        "type": "gradient",
        "from": "#f5efe1",
        "to": "#e8dcc4",
        "direction": "180deg"
      },
      "ornamentTop": "https://cdn.satuundangan.id/themes/batak/gorga-strip.png",
      "ornamentBottom": ""
    },
    "event": {
      "background": { "type": "image", "url": "https://cdn.satuundangan.id/themes/batak/ulos-pattern.jpg" },
      "ornamentTop": "",
      "ornamentBottom": ""
    }
  },
  "ornaments": {
    "corner": "https://cdn.satuundangan.id/themes/batak/gorga-corner.png",
    "divider": "https://cdn.satuundangan.id/themes/batak/ulos-divider.png",
    "frame": "https://cdn.satuundangan.id/themes/batak/gorga-frame.png"
  },
  "decor": {
    "borderRadius": "0.5rem",
    "patternUrl": "https://cdn.satuundangan.id/themes/batak/ulos-tile.png",
    "patternOpacity": 0.1
  }
}
```
