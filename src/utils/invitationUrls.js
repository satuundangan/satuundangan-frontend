const PRODUCTION_ROOT_HOSTS = new Set(['satuundangan.id', 'www.satuundangan.id'])

export function getInvitationPublicUrl(invitation, location = window.location) {
  const slug = encodeURIComponent(invitation?.slug || '')
  const subdomain = String(invitation?.subdomain || '').trim().toLowerCase()
  const isPublished = Boolean(invitation?.isPublished ?? invitation?.is_published)

  if (
    isPublished &&
    subdomain &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(subdomain) &&
    PRODUCTION_ROOT_HOSTS.has(location.hostname.toLowerCase())
  ) {
    return `https://${subdomain}.satuundangan.id`
  }

  return new URL(`/inv/${slug}`, location.origin).toString()
}

export function getInvitationPreviewUrl(invitation, location = window.location) {
  const url = new URL(getInvitationPublicUrl(invitation, location))
  url.searchParams.set('preview', 'true')
  return url.toString()
}
