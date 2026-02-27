import { join } from 'path'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  ssr: false,
  nitro: {
    storage: {
      data: {
        driver: 'fs',
        base: process.env.NODE_ENV === 'production' 
          ? join(process.cwd(), 'server', 'data')
          : './server/data'
      }
    }
  }
})
