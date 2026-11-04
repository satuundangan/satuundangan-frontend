// The API stores guest text HTML-escaped (xss filter), so "&" arrives as "&amp;".
// Vue escapes on render, so decode the handful of entities the filter produces.
const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&#x27;': "'" }

export function decodeEntities(value) {
  return String(value ?? '').replace(/&(?:amp|lt|gt|quot|#39|#x27);/g, (match) => ENTITIES[match])
}
