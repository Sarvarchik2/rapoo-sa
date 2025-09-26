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

      <label class="password-label">
        <img src="/assets/login/user.svg" alt="password">
        <input :type="showPassword ? 'text' : 'password'" placeholder="Password" v-model="form.password" :class="{ 'is-error': errors.password }" />
        <button type="button" @click="showPassword = !showPassword" class="eye-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <line v-if="!showPassword" x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </label>
      <NuxtLink class="login-link" to="/registration">
        У вас еще нет аккаунт? Зарегестрируйтесь!
      </NuxtLink>
       <NuxtLink class="login-link" to="/">
        Войти как гость
      </NuxtLink>
      <p v-if="errors.password" class="err">{{ errors.password }}</p>

      <p v-if="errors.common" class="err">{{ errors.common }}</p>

      <button class="login-page-wrapper-button" type="submit" :disabled="loading">{{ loading ? 'Проверяем…' : 'Войти' }}</button>
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
const showPassword = ref(false)

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
.password-label {
  position: relative;
}
.password-label input {
  padding-right: 40px;
}
.eye-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #666;
  transition: color 0.3s;
}
.eye-btn:hover {
  color: #333;
}
.eye-btn svg {
  transition: transform 0.3s;
}
.eye-btn:active svg {
  transform: scale(0.9);
}
.eye-btn svg line {
  transition: opacity 0.3s;
}
</style>
