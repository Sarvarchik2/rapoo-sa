<template>
  <div class="login-page">
    <form class="login-page-wrapper" @submit.prevent="handleLogin" novalidate>
      <img src="/assets/logo.svg" alt="logo">
      <h1>Вход</h1>

      <label>
        <img src="/assets/login/mail.svg" alt="email">
        <input type="text" placeholder="Email" v-model.trim="form.email" :class="{ 'is-error': errors.email }" />
      </label>
      <p v-if="errors.email" class="err">{{ errors.email }}</p>

      <label>
        <img src="/assets/login/user.svg" alt="password">
        <input type="password" placeholder="Password" v-model="form.password" :class="{ 'is-error': errors.password }" />
      </label>
      <NuxtLink class="login-link" to="/registration">
        У вас еще нет аккаунт? Зарегестрируйтесь!
      </NuxtLink>
      <p v-if="errors.password" class="err">{{ errors.password }}</p>

      <p v-if="errors.common" class="err">{{ errors.common }}</p>

      <button type="submit" :disabled="loading">{{ loading ? 'Проверяем…' : 'Войти' }}</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
const router = useRouter()
const { login } = useAuth()

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '', common: '' })
const loading = ref(false)

function validate() {
  errors.email = errors.password = errors.common = ''
  if (!form.email) errors.email = 'Введите email'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Некорректный email'
  if (!form.password) errors.password = 'Введите пароль'
  return !errors.email && !errors.password
}

async function handleLogin() {
  if (!validate()) return
  loading.value = true
  try {
    await login({ email: form.email, password: form.password })
    router.push('/profile')
  } catch (e) {
    console.error(e)
    errors.common = e?.data?.detail || 'Неверный email или пароль'
  } finally {
    loading.value = false
  }
}
</script>

<style>
@import './login.css';
.err { color:#e53935; font-size:12px; margin-top:-8px; align-self:flex-start }
.is-error { border:1px solid #e53935!important }
</style>
