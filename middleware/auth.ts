// // middleware/auth.ts
// export default defineNuxtRouteMiddleware((to) => {
//     const { isAuthenticated } = useAuth()
//     if (!isAuthenticated.value) {
//       return navigateTo(`/login?next=${encodeURIComponent(to.fullPath)}`)
//     }
//   })
  // middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  // Разрешаем публичные роуты
  const PUBLIC_ROUTES = new Set<string>([
    '/login', '/register', '/forgot', '/reset' // дополни по необходимости
  ])
  if (PUBLIC_ROUTES.has(to.path)) return

  // Проверяем access_token из cookie (SSR/CSR ок)
  const access = useCookie<string | null>('access_token', { sameSite: 'lax' })
  if (!access.value) {
    const next = encodeURIComponent(to.fullPath)
    return navigateTo(`/login?next=${next}`)
  }
})
