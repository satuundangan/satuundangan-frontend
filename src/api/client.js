export const BASE_URL = import.meta.env.VITE_API_URL

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token')

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
  }

  // If body is not FormData, set Content-Type to application/json
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Something went wrong' }))
    const errorObject = new Error(err.message || 'Something went wrong')
    errorObject.status = res.status
    throw errorObject
  }

  // Handle empty response
  const contentType = res.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    return res
  }

  return res.json().catch(() => res)
}
