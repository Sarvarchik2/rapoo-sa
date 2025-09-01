// middleware/organizer-only.ts
import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from '#app'
import { useAuth } from '~/composables/useAuth'

function hasOrganizerSignals(u: any): boolean {
  if (!u) return false
  const role  = String(u?.user_role || u?.role || '').toUpperCase()
  const ptype = String(u?.profile_type || u?.profile?.type || '').toLowerCase()
  const flags = [u?.data?.is_organizer, u?.is_organizer, u?.profile?.is_organizer].some(Boolean)
  const hasOrgProfile = !!u?.organization_profile || !!u?.organizer_data
  return (
    role.includes('ADMIN') ||
    role.includes('STAFF') ||
    role.includes('ORGANIZER') ||
    ptype === 'organizer' ||
    flags ||
    hasOrgProfile
  )
}

async function tryFetchProfile(API_BASE:string, token:string) {
  // Можно переопределить списком в runtimeConfig.public.profileEndpoints
  const defaults = [
    '/users/profile/',
    '/auth/profile/',
    '/account/profile/',
    '/users/me/',
    '/auth/me/',
    '/profile/',              // в конце, чтобы не спамить 404
  ]
  const endpoints:string[] =
    (globalThis?.__NUXT__?.config?.public?.profileEndpoints as string[]) ||
    defaults

  for (const path of endpoints) {
    const url = `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`
    try {
      const prof:any = await $fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (prof) return prof
    } catch (e:any) {
      // молча пропускаем 404/401/403 и идём дальше
      continue
    }
  }
  return null
}

export default defineNuxtRouteMiddleware(async (to) => {
  const { user, access } = useAuth()
  const config   = useRuntimeConfig()
  const API_BASE = (config.public?.apiBase as string) || '/api/v1'

  // нет токена — на список турниров
  if (!access.value) return navigateTo('/tournaments')

  // если уже знаем, что организатор — пускаем
  if (!hasOrganizerSignals(user.value)) {
    // пробуем подгрузить профиль (не спамим конкретным /profile/)
    const prof = await tryFetchProfile(API_BASE, access.value)
    if (prof && !user.value) user.value = prof
    if (!hasOrganizerSignals(user.value)) return navigateTo('/tournaments')
  }

  // если у профиля есть my_tournaments — пускаем только в свои турниры
  if (to.params?.id && Array.isArray((user.value as any)?.my_tournaments)) {
    const tid  = Number(to.params.id)
    const mine = (user.value as any).my_tournaments.some(
      (t:any) => Number(t?.id ?? t) === tid
    )
    if (!mine) return navigateTo('/tournaments')
  }
})
