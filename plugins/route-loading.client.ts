// plugins/route-loading.client.ts
export default defineNuxtPlugin((nuxtApp) => {
    const loading = useState('routeLoading', () => false)
  
    const MIN_MS = 600
    let startAt = 0
    let hideTimer: number | null = null
    let active = false
  
    const addCls = () => document.documentElement.classList.add('is-route-loading')
    const rmCls  = () => document.documentElement.classList.remove('is-route-loading')
  
    const start = () => {
      if (active) return
      active = true
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
      startAt = performance.now()
      addCls()               // ← мгновенно показывает оверлей (без реактивности)
      loading.value = true   // для компонента, если нужно
    }
  
    const finish = () => {
      if (!active) return
      const dt = performance.now() - startAt
      const left = Math.max(0, MIN_MS - dt)
      hideTimer = window.setTimeout(() => {
        loading.value = false
        rmCls()
        active = false
      }, left)
    }
  
    // Используем только Nuxt-хуки, чтобы не конфликтовать с middleware/redirect'ами
    nuxtApp.hook('page:start', start)
    nuxtApp.hook('page:finish', finish)
    nuxtApp.hook('vue:error', finish)
    nuxtApp.hook('app:error', finish)
  })
  