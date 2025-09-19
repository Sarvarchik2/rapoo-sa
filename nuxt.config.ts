export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://homey.uz/api/v1', // для $api
      apiBaseRoot: process.env.NUXT_PUBLIC_API_BASE_ROOT || 'https://homey.uz/api/v1' // для $auth
    }
    
  },
  
  typescript: { strict: true },
  devtools: { enabled: true }
})


