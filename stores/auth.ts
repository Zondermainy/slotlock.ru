import { defineStore } from 'pinia'

interface User {
  id: number
  email: string
  name: string
  role?: string
  strikes: number
  isBlocked: boolean
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isLoggedIn: false
  }),
  actions: {
    async login(email: string, password: string) {
      const user = await $fetch<User>('/api/login', {
        method: 'POST',
        body: { email, password }
      })
      
      if (user) {
        this.user = user
        this.isLoggedIn = true
        if (import.meta.client) {
          localStorage.setItem('userId', user.id.toString())
        }
      }
    },
    logout() {
      this.user = null
      this.isLoggedIn = false
      if (import.meta.client) {
        localStorage.removeItem('userId')
      }
    },
    async restoreSession() {
      if (import.meta.client) {
        const userId = localStorage.getItem('userId')
        if (userId) {
          const users = await $fetch<User[]>('/api/users')
          const user = users.find(u => u.id === parseInt(userId))
          if (user) {
            this.user = user
            this.isLoggedIn = true
          } else {
            localStorage.removeItem('userId')
          }
        }
      }
    }
  },
  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    userName: (state) => state.user?.name || '',
    userId: (state) => state.user?.id || null
  }
})
