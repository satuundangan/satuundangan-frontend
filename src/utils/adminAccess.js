// Mirrors the server's role matrix only for hiding what a role cannot use.
// The server enforces every rule; this file never grants anything.
const ALWAYS_OPEN = new Set(['security', 'totp'])
const SUPERADMIN_ONLY = new Set(['social-studio', 'system', 'logs'])
const PATH_TO_RESOURCE = { templates: 'template-designs', system: 'health' }

export function adminResourceFromPath(path = '') {
  if (path === '/admin' || path === '/admin/') return 'dashboard'
  const match = /^\/admin\/([^/?#]+)/.exec(path)
  if (!match) return null
  return PATH_TO_RESOURCE[match[1]] || match[1]
}

export function canOpenAdminPath(access, path) {
  const resource = adminResourceFromPath(path)
  if (!resource) return true
  const segment = /^\/admin\/([^/?#]+)/.exec(path)?.[1]
  if (ALWAYS_OPEN.has(segment)) return true
  // Unknown access (endpoint unreachable) hides nothing; the server still enforces every rule.
  if (!access) return true
  if (access.adminRole === 'superadmin') return true
  if (SUPERADMIN_ONLY.has(segment) || SUPERADMIN_ONLY.has(resource)) return false
  return (access.allowedResources || []).includes(resource)
}

export function filterNavigationGroups(groups, access) {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canOpenAdminPath(access, item.to)),
    }))
    .filter((group) => group.items.length)
}
