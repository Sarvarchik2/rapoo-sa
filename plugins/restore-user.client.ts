// plugins/restore-user.client.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  const access = useCookie<string | null>('access_token')
  const { user } = useAuth()

  // Если есть токен и пользователь ещё не загружен — подтянем профиль
  if (access.value && !user.value) {
    try {
      const profile: any = await nuxtApp.$auth('/profile/')
      // Нормализуем объект пользователя для ролевых проверок
      const normalizedUser = {
        // базовые
        id: profile?.user_profile?.user?.id || profile?.user_profile?.user_id || profile?.user?.id || null,
        username: profile?.user_profile?.user?.username || profile?.user?.username || null,
        email: profile?.user_profile?.user?.email || profile?.user?.email || null,

        // роль/флаги
        user_role: profile?.user_role || profile?.role || null,
        profile_type: profile?.profile_type || null,
        is_organizer:
          profile?.profile_type === 'organizer' ||
          !!profile?.organization_profile ||
          !!profile?.organizer_data,

        // на всякий — прокинем исходные данные для других мест
        data: profile,
        profile: profile?.user_profile || null,
      }
      user.value = normalizedUser
    } catch (e) {
      // молча — не блокируем загрузку приложения
      // console.warn('[restore-user] failed to restore user', e)
    }
  }
})


