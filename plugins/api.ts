import { $fetch } from 'ofetch'

export default defineNuxtPlugin(() => {
  const { public: pub } = useRuntimeConfig()
  const access = useCookie<string | null>('access_token')

  const api = $fetch.create({
    baseURL: pub.apiBase,         
    credentials: 'include',
    onRequest({ options }) {
      if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        options.headers = { ...(options.headers || {}), 'Content-Type': 'application/json' }
      }
      if (access.value) {
        options.headers = { ...(options.headers || {}), Authorization: `Bearer ${access.value}` }
      }
    },
    onResponseError({ request, response }) {
      console.error('API error:', response?.status, request, response?._data)
    }
  })

  return { provide: { api } }
})
