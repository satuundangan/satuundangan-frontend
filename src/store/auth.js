// src/store/auth.js
import { defineStore } from 'pinia'
import { login, register, getProfile } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    async login(payload) {
      const res = await login(payload)
      console.log(res);

      this.token = res.access_token
      localStorage.setItem('token', res.access_token)
      await this.fetchProfile()
    },
    async register(payload) {
      const res = await register(payload)
      this.token = res.access_token
      localStorage.setItem('token', res.access_token)
      await this.fetchProfile()
    },
    async fetchProfile() {
      if (!this.token) return
      const res = await getProfile()
      this.user = res
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },
    async init() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        await this.fetchProfile()
      }
    },
  },
})
