// src/store/auth.js
import { defineStore } from 'pinia'
import { login, register, getProfile } from '@/api/auth'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    redirectPath: null,
  }),
  actions: {
    setRedirectPath(path) {
      this.redirectPath = path
    },
    clearRedirectPath() {
      this.redirectPath = null
    },
    async login(payload) {
      const res = await login(payload)
      this.token = res.access_token
      localStorage.setItem('token', res.access_token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.access_token}`
      await this.fetchProfile()
    },
    async register(payload) {
      const res = await register(payload)
      this.token = res.access_token
      localStorage.setItem('token', res.access_token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.access_token}`
      await this.fetchProfile()
    },
    async fetchProfile() {
      if (!this.token) return
      try {
        //console.log('Fetching profile with token:', this.token)
        const res = await getProfile(this.token)
        //console.log('fetchProfile result:', res) // harus object user
        this.user = res // tergantung apa yg dikembalikan API
      } catch (error) {
        console.error('Gagal mengambil profil:', error)
        this.logout()
        throw error
      }
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },
    async init() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        try {
          await this.fetchProfile()
        } catch (error) {
          console.error('Token tidak valid, logout otomatis', error)
          this.logout()
        }
      }
    },
    async handleLoginWithToken(token) {
      if (!token) return
      this.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      await this.fetchProfile()
    },
  },
})
