// export default defineNuxtPlugin(() => {
//     const config = useRuntimeConfig()
//     const baseURL = config.public.API_BASE // например: 'http://147.93.155.49/api/v1'
  
//     const access = useCookie<string | null>('access_token', { sameSite: 'lax' })
//     const refresh = useCookie<string | null>('refresh_token', { sameSite: 'lax' })
  
//     async function refreshAccess() {
//       if (!refresh.value) throw new Error('No refresh')
//       // подставь свой эндпоинт:
//       const r: any = await $fetch('/auth/jwt/refresh/', {
//         baseURL,
//         method: 'POST',
//         body: { refresh: refresh.value },
//         credentials: 'include',
//       })
//       // подставь точное поле, которое возвращает бэк:
//       access.value = r.access || r.token || r.data?.access || null
//       if (!access.value) throw new Error('No access returned')
//       return access.value
//     }
  
//     const api = $fetch.create({
//       baseURL,
//       credentials: 'include', // чтобы куки ездили, если сервер их сетит
//       onRequest({ options }) {
//         if (access.value) {
//           options.headers = { ...(options.headers as any), Authorization: `Bearer ${access.value}` }
//         }
//       },
//       async onResponseError({ response, request, options }) {
//         // если access протух — пробуем обновить и повторить запрос один раз
//         if (response.status === 401 && refresh.value) {
//           try {
//             const newAccess = await refreshAccess()
//             const newHeaders = { ...(options.headers as any), Authorization: `Bearer ${newAccess}` }
//             return await $fetch(request as any, { ...(options as any), headers: newHeaders })
//           } catch {
//             // refresh тоже не сработал — выходим из учётки
//             access.value = null
//             refresh.value = null
//             try { await navigateTo('/login') } catch {}
//           }
//         }
//         // пробрасываем исходную ошибку
//         throw response._data ?? response
//       }
//     })
  
//     return { provide: { api } }
//   })
  