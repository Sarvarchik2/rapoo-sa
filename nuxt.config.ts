export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://147.93.155.49/api/v1', // для $api
      apiBaseRoot: process.env.NUXT_PUBLIC_API_BASE_ROOT || 'http://147.93.155.49/api/v1' // для $auth
    }
  },
  typescript: { strict: true },
  devtools: { enabled: true }
})

