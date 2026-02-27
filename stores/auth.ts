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
    async login(userId: number) {
      const users = await $fetch<User[]>('/api/users')
      const user = users.find(u => u.id === userId)
      if (user) {
        this.user = user
        this.isLoggedIn = true
        if (import.meta.client) {
          localStorage.setItem('userId', userId.toString())
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
          await this.login(parseInt(userId))
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
