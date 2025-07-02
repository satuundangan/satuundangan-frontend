const BASE_URL = 'https://api.satuundangan.id'

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'Something went wrong')
  }

  return res.json()
}
