// plugins/auth.ts
import { $fetch } from 'ofetch'

export default defineNuxtPlugin(() => {
  const { public: pub } = useRuntimeConfig()
  const access = useCookie<string | null>('access_token')

  // эти эндпоинты ВСЕГДА без токена
  const PUBLIC_ENDPOINTS = [
    '/register/',
    '/resend-verification/',
    '/verify-email/',
    '/auth/login/',
  ]

  const auth = $fetch.create({
    baseURL: `${pub.apiBase}/auth`,   // → /api/v1/auth
    credentials: 'include',
    onRequest({ request, options }) {
      const path = typeof request === 'string' ? request : (request as any)?.url || ''

      // JSON по умолчанию
      if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        options.headers = { ...(options.headers || {}), 'Content-Type': 'application/json' }
      }

      // токен — только на НЕ публичные пути
      const isPublic = PUBLIC_ENDPOINTS.some(p => path.endsWith(p))
      if (!isPublic && access.value) {
        options.headers = { ...(options.headers || {}), Authorization: `Bearer ${access.value}` }
      }
    },
    onResponseError({ request, response }) {
      console.error('AUTH error:', response?.status, typeof request === 'string' ? request : '', response?._data)
    }
  })

  return { provide: { auth } }
})
