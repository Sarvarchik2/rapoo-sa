import { $fetch } from 'ofetch'

export default defineNuxtPlugin(() => {
  const { public: pub } = useRuntimeConfig()
  const access = useCookie<string | null>('access_token')
  const refresh = useCookie<string | null>('refresh_token')

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

  const api = $fetch.create({
    baseURL: pub.apiBase,         
    credentials: 'include',
    async onRequest({ options }) {
      if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        // @ts-ignore
        options.headers = { ...(options.headers || {}), 'Content-Type': 'application/json' }
      }
      if (access.value) {
        // @ts-ignore
        options.headers = { ...(options.headers || {}), Authorization: `Bearer ${access.value}` }
      }
    },
    // @ts-ignore
    async onResponseError(ctx) {
      const { request, response, options } = ctx
      // Если access истёк, пробуем обновить
      if (response?.status === 401 && refresh.value) {
        const newToken = await refreshAccessToken()
        if (newToken) {
          // Повторяем исходный запрос с новым токеном
          // @ts-ignore
          options.headers = { ...(options.headers || {}), Authorization: `Bearer ${newToken}` }
          return $fetch(request, options)
        } else {
          // Если refresh не сработал — удаляем токены и редиректим на логин
          access.value = null
          refresh.value = null
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
      }
      console.error('API error:', response?.status, request, response?._data)
    }
  })

  return { provide: { api } }
})
