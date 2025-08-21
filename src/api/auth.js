import { apiFetch } from './client'
// import axios from 'axios'

export const login = (data) =>
  apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const register = (data) =>
  apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const getProfile = () => apiFetch('/user/me')

// export async function getProfile(token) {
//   const res = await axios.get('/api/me', {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   })
//   return res.data
// }