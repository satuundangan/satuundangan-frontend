export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)

  const backendUrl =
    url.hostname === 'dev.satuundangan.id'
      ? 'https://api-dev.satuundangan.id'
      : 'https://api.satuundangan.id'

  const path = url.pathname.replace(/^\/api/, '') || '/'
  const targetUrl = backendUrl + path + url.search

  const headers = new Headers(request.headers)
  headers.set('host', new URL(backendUrl).hostname)

  const proxied = new Request(targetUrl, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    redirect: 'follow',
  })

  return fetch(proxied)
}
