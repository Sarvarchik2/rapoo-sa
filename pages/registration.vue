<template>
    <div class="login-page">
      <form
        v-if="step === 'registration'"
        class="login-page-wrapper"
        @submit.prevent="goToVerification"
        novalidate
      >
        <div class="login-page-wrapper-content">
          <img src="@/assets/logo.svg" alt="logo" />
          <h1>Регистрация</h1>
  
          <label>
            <img src="@/assets/login/user.svg" alt="Name" />
            <input
              v-model.trim="form.name"
              type="text"
              placeholder="Name"
              :class="{ 'is-error': errors.name }"
            />
          </label>
          <p v-if="errors.name" class="err">{{ errors.name }}</p>
  
          <label>
            <img src="@/assets/login/user.svg" alt="Surname" />
            <input
              v-model.trim="form.surname"
              type="text"
              placeholder="Surname"
              :class="{ 'is-error': errors.surname }"
            />
          </label>
          <p v-if="errors.surname" class="err">{{ errors.surname }}</p>
  
          <label>
            <img src="@/assets/login/user.svg" alt="Username" />
            <input
              v-model.trim="form.username"
              type="text"
              placeholder="Username"
              :class="{ 'is-error': errors.username }"
            />
          </label>
          <p v-if="errors.username" class="err">{{ errors.username }}</p>
  
          <label>
            <img src="@/assets/login/mail.svg" alt="Email" />
            <input
              v-model.trim="form.email"
              type="email"
              placeholder="Email"
              :class="{ 'is-error': errors.email }"
            />
          </label>
          <p v-if="errors.email" class="err">{{ errors.email }}</p>
  
          <label>
            <img src="@/assets/login/user.svg" alt="Password" />
            <input
              v-model="form.password"
              type="password"
              placeholder="Password"
              :class="{ 'is-error': errors.password }"
            />
          </label>
          <p v-if="errors.password" class="err">{{ errors.password }}</p>
  
          <button type="submit" :disabled="loading">
            {{ loading ? 'Проверяем…' : 'Продолжить' }}
          </button>
        </div>
      </form>
  
      <div
        v-else-if="step === 'verification'"
        class="login-email-verification-wrapper"
        @keydown.enter.prevent="submitCode"
      >
        <img src="@/assets/logo.svg" alt="logo" class="verification-logo" />
        <h2 class="verification-title">Код подтверждения</h2>
        <p class="verification-subtitle">
          Введите код подтверждения, который был отправлен на ваш email или смс кодом на телефон
        </p>
  
        <div class="code-inputs">
          <input
            v-for="(n, index) in 6"
            :key="index"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="1"
            autocomplete="one-time-code"
            v-model="code[index]"
            :ref="el => setInputRef(el, index)"
            @input="onInput(index, $event)"
            @keydown="onKeydown(index, $event)"
            @paste="onPaste($event)"
            :class="{ 'is-error': otpError }"
          />
        </div>
        <p v-if="otpError" class="err">{{ otpError }}</p>
  
        <div class="timer">
          {{ timer ? `${timer} секунд` : 'Код можно запросить снова' }}
        </div>
  
        <button
          class="resend"
          type="button"
          @click="resendCode"
          :disabled="timer>0 || loading"
        >
          Запросить еще раз
        </button>
  
        <button class="submit" type="button" @click="submitCode" :disabled="loading">
          {{ loading ? 'Проверяем…' : 'Зарегистрироваться' }}
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        step: 'registration',
        loading: false,
  
        form: {
          name: '',
          surname: '',
          username: '',
          email: '',
          password: ''
        },
        errors: {},
  
        // otp
        code: Array(6).fill(''),
        inputs: [],
        timer: 60,
        interval: null,
        otpError: ''
      }
    },
    methods: {
      validateRegistration() {
        const e = {}
  
        if (!this.form.name) e.name = 'Введите имя'
        if (!this.form.surname) e.surname = 'Введите фамилию'
  
        if (!this.form.username) e.username = 'Введите имя пользователя'
        else if (!/^[a-zA-Z0-9_]{3,20}$/.test(this.form.username))
          e.username = 'От 3 до 20 латинских символов/цифр/нижнее подчеркивание'
  
        if (!this.form.email) e.email = 'Введите email'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email))
          e.email = 'Некорректный email'
  
        if (!this.form.password) e.password = 'Введите пароль'
        else if (this.form.password.length < 6)
          e.password = 'Минимум 6 символов'
  
        this.errors = e
        return Object.keys(e).length === 0
      },
  
      async goToVerification() {
        if (!this.validateRegistration()) return
        this.loading = true
        try {
          this.step = 'verification'
          this.$nextTick(() => this.inputs[0]?.focus())
          this.startTimer()
        } finally {
          this.loading = false
        }
      },
  
      startTimer() {
        this.timer = 60
        clearInterval(this.interval)
        this.interval = setInterval(() => {
          if (this.timer > 0) this.timer--
          else clearInterval(this.interval)
        }, 1000)
      },
  
      setInputRef(el, i) {
        if (el) this.inputs[i] = el
      },
  
      onInput(index, e) {
        const val = e.target.value.replace(/\D/g, '')
        this.code.splice(index, 1, val)
        if (val && index < 5) this.inputs[index + 1]?.focus()
        this.otpError = ''
        if (this.code.join('').length === 6) this.submitCode()
      },
  
      onKeydown(index, e) {
        const key = e.key
        if (key === 'Backspace') {
          if (!this.code[index] && index > 0) {
            this.inputs[index - 1]?.focus()
            this.code.splice(index - 1, 1, '')
          }
          return
        }
        if (key === 'ArrowLeft' && index > 0) {
          e.preventDefault(); this.inputs[index - 1]?.focus()
        }
        if (key === 'ArrowRight' && index < 5) {
          e.preventDefault(); this.inputs[index + 1]?.focus()
        }
      },
  
      onPaste(e) {
        const text = (e.clipboardData || window.clipboardData).getData('text')
        if (!text) return
        const digits = text.replace(/\D/g, '').slice(0, 6).split('')
        if (!digits.length) return
        e.preventDefault()
        for (let i = 0; i < 6; i++) this.code[i] = digits[i] || ''
        const firstEmpty = this.code.findIndex(c => !c)
        if (firstEmpty === -1) this.submitCode()
        else this.inputs[firstEmpty]?.focus()
      },
  
      async resendCode() {
        if (this.timer > 0) return
        this.loading = true
        try {
          this.startTimer()
        } finally {
          this.loading = false
        }
      },
  
      // ==== Сабмит OTP ====
      async submitCode() {
        const otp = this.code.join('')
        if (otp.length !== 6) {
          this.otpError = 'Введите 6 цифр'
          return
        }
        this.loading = true
        try {
          const ok = true 
          if (!ok) {
            this.otpError = 'Неверный код. Попробуйте ещё раз.'
            return
          }
          // успех — редирект
          this.$router.push('/profile')
        } finally {
          this.loading = false
        }
      }
    },
    beforeUnmount() { 
      clearInterval(this.interval)
    }
  }
  </script>
  
  <style>
  @import './login.css';
  @import './registration.css';
  
  .err { color: #e53935; font-size: 12px; margin-top: -8px; align-self: flex-start; }
  .is-error { border: 1px solid #e53935 !important; }
  
 
  .verification-title { font-size: 22px; font-weight: 600; color: var(--text-blue); }
  .verification-subtitle { font-size: 14px; color: var(--text-secondary); text-align: center; }
  .code-inputs { display: flex; gap: 10px; }
  .code-inputs input { width: 50px; height: 60px; font-size: 22px; text-align: center;
    border-radius: 8px; border: 1px solid #ccc; }
  .timer { font-size: 14px; color: gray; }
  .resend { background: none; border: none; color: var(--text-blue); cursor: pointer; }
  .submit { background: var(--bg-blue); color: white; padding: 10px 25px; border-radius: 25px;
    font-size: 16px; border: none; cursor: pointer; }
  </style>
  