import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
  }),
  actions: {
    async login({ email, password }) {
      const res = await fetch('https://api.satuundangan.id/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) throw new Error('Login failed')

      const data = await res.json()
      this.token = data.access_token
      localStorage.setItem('token', this.token)
      await this.fetchUser()
    },
    async fetchUser() {
      const res = await fetch('https://api.satuundangan.id/user/me', {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      this.user = await res.json()
    },
  },
})
