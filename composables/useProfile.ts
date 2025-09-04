// composables/useProfile.ts
export const useProfile = () => {
    const { $auth } = useNuxtApp()
    const { access } = useAuth()
  
    const profile = useState<any>('profile:data', () => null)
    const loaded  = useState<boolean>('profile:loaded', () => false)
    const pending = useState<boolean>('profile:pending', () => false)
  
    async function fetchProfile(force = false) {
      if (loaded.value && !force) return profile.value
      if (!access.value) { profile.value = null; loaded.value = true; return null }
      pending.value = true
      try {
        profile.value = await $auth('/profile/')
      } catch {
        profile.value = null
      } finally {
        pending.value = false
        loaded.value  = true
      }
      return profile.value
    }
  
    async function ensureProfile() {
      if (!loaded.value) await fetchProfile()
    }
  
    // если токен сменился — перезагрузить профиль
    watch(access, (tok) => {
      if (!tok) { profile.value = null; loaded.value = true }
      else { loaded.value = false; fetchProfile(true) }
    })
  
    return { profile, loaded, pending, fetchProfile, ensureProfile }
  }
  