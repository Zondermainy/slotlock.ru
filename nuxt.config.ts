export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  ssr: false,
  nitro: {
    storage: {
      data: {
        driver: 'fs',
        base: './server/data'
      }
    }
  }
})
