// composables/useAuth.ts
export const useAuth = () => {
    const nuxtApp = useNuxtApp()
    const user = useState<any | null>('auth:user', () => null)
    const session = useState<string | null>('auth:session', () => null)
  
    const access  = useCookie<string | null>('access_token',  { sameSite:'lax', secure:process.env.NODE_ENV==='production', maxAge:60*60*24*7 })
    const refresh = useCookie<string | null>('refresh_token', { sameSite:'lax', secure:process.env.NODE_ENV==='production', maxAge:60*60*24*30 })
    const isAuthenticated = computed(() => !!access.value)
  
    // REGISTER  => POST /api/v1/auth/register/
    async function register(payload: {
      email:string; username:string; first_name:string; last_name:string;
      password:string; password_confirm?:string; role?:string; phone?:string; region?:string; language?:string;
    }) {
      const body:any = {
        email: payload.email,
        username: payload.username,
        first_name: payload.first_name,
        last_name: payload.last_name,
        password: payload.password,
        password_confirm: payload.password_confirm ?? payload.password,
        role: payload.role ?? 'REGULAR'
      }
      if (payload.phone)    body.phone    = payload.phone
      if (payload.region)   body.region   = payload.region
      if (payload.language) body.language = payload.language
  
      const res:any = await nuxtApp.$auth('/register/', { method:'POST', body })
      session.value = res?.session_id || null
      return res
    }
  
    // RESEND OTP => POST /api/v1/auth/resend-verification/
    async function resendVerification() {
      if (!session.value) throw new Error('Нет session_id')
      return await nuxtApp.$auth('/resend-verification/', { method:'POST', body:{ session_id: session.value } })
    }
  
    // VERIFY OTP => POST /api/v1/auth/verify-email/
    async function verifyEmail(otp:string) {
      if (!session.value) throw new Error('Нет session_id')
      const res:any = await nuxtApp.$auth('/verify-email/', { method:'POST', body:{ otp, session_id: session.value } })
      access.value  = res.access  || null
      refresh.value = res.refresh || null
      user.value    = res.user    || null
      session.value = null
      return res
    }
  
    // LOGIN => POST /api/v1/auth/auth/login/  (см. swagger)
    async function login(payload:{ email?:string; username?:string; password:string }) {
      const body = payload.email
        ? { email: payload.email, password: payload.password }
        : { username: payload.username, password: payload.password }
  
      const res:any = await nuxtApp.$auth('/login/', { method:'POST', body })
      access.value  = res.access  || null
      refresh.value = res.refresh || null
      user.value    = res.user    || null
      return res
    }
  
    function logout() {
      access.value = null
      refresh.value = null
      user.value = null
      session.value = null
    }
  
    return { user, access, refresh, isAuthenticated, session, register, resendVerification, verifyEmail, login, logout }
  }
  