import { join } from 'path'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  ssr: false,
  runtimeConfig: {
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || 5432,
    dbName: process.env.DB_NAME || 'slotlock',
    dbUser: process.env.DB_USER || 'slotlock',
    dbPassword: process.env.DB_PASSWORD || ''
  },
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
