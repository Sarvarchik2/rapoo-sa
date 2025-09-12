// plugins/auth.ts
import { $fetch } from 'ofetch'

export default defineNuxtPlugin(() => {
  const { public: pub } = useRuntimeConfig()
  const access = useCookie<string | null>('access_token')
  const refresh = useCookie<string | null>('refresh_token')

  // эти эндпоинты ВСЕГДА без токена
  const PUBLIC_ENDPOINTS = [
    '/register/',
    '/resend-verification/',
    '/verify-email/',
    '/auth/login/',
  ]

  async function refreshAccessToken() {
    try {
      const res = await $fetch(`${pub.apiBase}/auth/refresh/`, {
        method: 'POST',
        body: { refresh: refresh.value },
        credentials: 'include',
      })
      access.value = res.access
      return res.access
    } catch (e) {
      access.value = null
      refresh.value = null
      return null
    }
  }

  const auth = $fetch.create({
    baseURL: `${pub.apiBase}/auth`,   // → /api/v1/auth
    credentials: 'include',
    async onRequest({ request, options }) {
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
    async onResponseError(ctx) {
      const { request, response, options } = ctx
      // Если access истёк, пробуем обновить
      if (response?.status === 401 && refresh.value) {
        const newToken = await refreshAccessToken()
        if (newToken) {
          // Повторяем исходный запрос с новым токеном
          options.headers = { ...(options.headers || {}), Authorization: `Bearer ${newToken}` }
          return $fetch(request, options)
        } else {
          // Если refresh не сработал — удаляем токены и редиректим на логин
          access.value = null
          refresh.value = null
          window.location.href = '/login'
        }
      }
      console.error('AUTH error:', response?.status, typeof request === 'string' ? request : '', response?._data)
    }
  })

  return { provide: { auth } }
})
