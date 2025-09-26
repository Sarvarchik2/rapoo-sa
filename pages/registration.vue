<template>
  <div class="login-page">
    <!-- REGISTRATION -->
    <form v-if="step === 'registration'" class="login-page-wrapper" @submit.prevent="goToVerification" novalidate>
      <div class="login-page-wrapper-content">
        <img src="/assets/logo.svg" alt="logo" />
        <h1>Регистрация</h1>

        <label>
          <img src="/assets/login/user.svg" alt="Name" />
          <input v-model.trim="form.name" type="text" placeholder="Name" :class="{ 'is-error': errors.name }" />
        </label>
        <p v-if="errors.name" class="err">{{ errors.name }}</p>

        <label>
          <img src="/assets/login/user.svg" alt="Surname" />
          <input v-model.trim="form.surname" type="text" placeholder="Surname"
            :class="{ 'is-error': errors.surname }" />
        </label>
        <p v-if="errors.surname" class="err">{{ errors.surname }}</p>

        <label>
          <img src="/assets/login/user.svg" alt="Username" />
          <input v-model.trim="form.username" type="text" placeholder="Username"
            :class="{ 'is-error': errors.username }" />
        </label>
        <p v-if="errors.username" class="err">{{ errors.username }}</p>

        <label>
          <img src="/assets/login/mail.svg" alt="Email" />
          <input v-model.trim="form.email" type="email" placeholder="Email" :class="{ 'is-error': errors.email }" />
        </label>
        <p v-if="errors.email" class="err">{{ errors.email }}</p>
        <label>
          <img src="/assets/login/mail.svg" alt="Phone" />
          <input v-model.trim="form.phone" type="tel" placeholder="Phone (необязательно)"
            :class="{ 'is-error': errors.phone }" />
        </label>
        <p v-if="errors.phone" class="err">{{ errors.phone }}</p>


        <label class="password-label">
          <img src="/assets/login/user.svg" alt="Password" />
          <input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="Password"
            :class="{ 'is-error': errors.password }" />
          <button type="button" @click="showPassword = !showPassword" class="eye-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              <line v-if="!showPassword" x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </label>
        <p v-if="errors.password" class="err">{{ errors.password }}</p>
        <NuxtLink class="login-link" to="/login">
        У вас уже есть аккаунт? Войти!
      </NuxtLink>
         <NuxtLink class="login-link" to="/">
        Войти как гость
      </NuxtLink>
        <button class="login-page-wrapper-button" type="submit" :disabled="loading">{{ loading ? 'Проверяем…' : 'Продолжить' }}</button>
   
      </div>
    </form>

    <!-- VERIFICATION -->
    <div v-else-if="step === 'verification'" class="login-email-verification-wrapper" @keydown.enter.prevent="submitCode">
      <img src="/assets/logo.svg" alt="logo" class="verification-logo" />
      <h2 class="verification-title">Код подтверждения</h2>
      <p class="verification-subtitle">Введите 6-значный код из письма/смс</p>

      <div class="code-inputs">
        <input v-for="(n, index) in 6" :key="index" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="1"
          autocomplete="one-time-code" v-model="code[index]" :ref="el => setInputRef(el, index)"
          @input="onInput(index, $event)" @keydown="onKeydown(index, $event)" @paste="onPaste($event)"
          :class="{ 'is-error': otpError }" />
      </div>
      <p v-if="otpError" class="err">{{ otpError }}</p>

      <div class="timer">{{ timer ? `${timer} секунд` : 'Код можно запросить снова' }}</div>
      <button class="resend" type="button" @click="resendCode" :disabled="timer > 0 || loading">Запросить ещё раз</button>

      <button class="submit" type="button" @click="submitCode" :disabled="loading">{{ loading ? 'Проверяем…' :
        'Зарегистрироваться' }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
const router = useRouter()
const auth = useAuth()

const step = ref('registration')     
const loading = ref(false)
const showPassword = ref(false)

const form = reactive({ name: '', surname: '', username: '', email: '', phone: '', password: '' })
const errors = reactive({})         

// validateRegistration()
function validateRegistration() {
  const e = {}
  if (!form.name) e.name = 'Введите имя'
  if (!form.surname) e.surname = 'Введите фамилию'

  if (!form.username) e.username = 'Введите имя пользователя'
  else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username))
    e.username = 'От 3 до 20 латинских символов/цифр/_'

  if (!form.email) e.email = 'Введите email'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    e.email = 'Некорректный email'

  if (form.phone) {
    if (!/^\+?[0-9\s\-()]{7,20}$/.test(form.phone)) {
      e.phone = 'Некорректный номер'
    }
  }

  if (!form.password) e.password = 'Введите пароль'
  else if (form.password.length < 6) e.password = 'Минимум 6 символов'

  Object.assign(errors, e)
  return Object.keys(e).length === 0
}

async function goToVerification() {
  if (!validateRegistration()) return
  loading.value = true
  try {
    const payload = {
      email: form.email,
      username: form.username,
      first_name: form.name,
      last_name: form.surname,
      password: form.password,
      password_confirm: form.password,
      role: 'REGULAR'
    }
    if (form.phone)  payload.phone  = form.phone
    if (form.region) payload.region = form.region
    // если хочешь язык, тоже условно:
    // if (form.language) payload.language = form.language

    await auth.register(payload)

    step.value = 'verification'
    startTimer()
    focusInput(0)
  } catch (e) {
    console.error('register error', e)
  } finally {
    loading.value = false
  }
}


/* ---- OTP ---- */
const code = ref(Array(6).fill(''))
const inputs = ref([])
const timer = ref(60)
let interval = null
const otpError = ref('')

function setInputRef(el, i) { if (el) inputs.value[i] = el }
function focusInput(i) { inputs.value[i]?.focus() }
function startTimer() {
  timer.value = 60
  clearInterval(interval)
  interval = setInterval(() => {
    if (timer.value > 0) timer.value--
    else clearInterval(interval)
  }, 1000)
}
function onInput(index, e) {
  const val = e.target.value.replace(/\D/g, '')
  code.value.splice(index, 1, val)
  if (val && index < 5) focusInput(index + 1)
  otpError.value = ''
}
function onKeydown(index, e) {
  if (e.key === 'Backspace') {
    if (!code.value[index] && index > 0) { focusInput(index - 1); code.value.splice(index - 1, 1, '') }
    return
  }
  if (e.key === 'ArrowLeft' && index > 0) { e.preventDefault(); focusInput(index - 1) }
  if (e.key === 'ArrowRight' && index < 5) { e.preventDefault(); focusInput(index + 1) }
}
function onPaste(e) {
  const text = (e.clipboardData || window.clipboardData).getData('text') || ''
  const digits = text.replace(/\D/g, '').slice(0, 6).split('')
  if (!digits.length) return
  e.preventDefault()
  for (let i = 0; i < 6; i++) code.value[i] = digits[i] || ''
  const firstEmpty = code.value.findIndex(c => !c)
  if (firstEmpty === -1) submitCode()
  else focusInput(firstEmpty)
}
async function resendCode() {
  if (timer.value > 0) return
  loading.value = true
  try { await auth.resendVerification(); startTimer() }
  finally { loading.value = false }
}
async function submitCode() {
  const otp = code.value.join('')
  if (otp.length !== 6) { otpError.value = 'Введите 6 цифр'; return }
  loading.value = true
  try {
    await auth.verifyEmail(otp)
    router.push('/profile')
  } catch (e) {
    otpError.value = 'Неверный код'
    console.error('verify error', e)
  } finally {
    loading.value = false
  }
}

onUnmounted(() => clearInterval(interval))
</script>


<style>
@import './login.css';
@import './registration.css';

.err {
  color: #e53935;
  font-size: 12px;
  margin-top: -8px;
  align-self: flex-start;
}

.is-error {
  border: 1px solid #e53935 !important;
}


.verification-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-blue);
}

.verification-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  text-align: center;
}

.code-inputs {
  display: flex;
  gap: 10px;
}

.code-inputs input {
  width: 50px;
  height: 60px;
  font-size: 22px;
  text-align: center;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.timer {
  font-size: 14px;
  color: gray;
}

.resend {
  background: none;
  border: none;
  color: var(--text-blue);
  cursor: pointer;
}

.submit {
  background: var(--bg-blue);
  color: white;
  padding: 10px 25px;
  border-radius: 25px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.password-label {
  position: relative;
}
.password-label input {
  padding-right: 40px;
}
.eye-btn {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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