// utils/upload.ts
export async function uploadFileReturnId(file: File, token: string): Promise<number> {
    const { $api, $auth } = useNuxtApp()
  
    const form = new FormData()
    form.append('file', file)
    // НЕ выставляйте Content-Type — браузер сам поставит multipart boundary
  
    try {
      // Если ваш $api уже добавляет Bearer — заголовок можно убрать
      const res: any = await $api('/files/upload/', {
        method: 'POST',
        body: form,
        headers: { Authorization: `Bearer ${token}` }, // оставьте, если $api не подставляет
      })
      return res?.id ?? res?.data?.id
    } catch (e: any) {
      // Фолбэк, если $api не авторизует
      if (e?.status === 401 && $auth) {
        const res: any = await $auth('/files/upload/', { method: 'POST', body: form })
        return res?.id ?? res?.data?.id
      }
      throw e
    }
  }
  