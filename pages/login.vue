<template>
    <div class="login-page">
      <form
        class="login-page-wrapper"
        @submit.prevent="handleLogin"
        @keydown.enter.prevent="handleLogin"
        novalidate
      >
        <img src="@/assets/logo.svg" alt="logo">
        <h1>Вход</h1>
  
        <label>
          <img src="@/assets/login/mail.svg" alt="email">
          <input
            type="text"
            placeholder="Email"
            v-model.trim="form.email"
            :class="{ 'is-error': errors.email }"
          />
        </label>
        <p v-if="errors.email" class="err">{{ errors.email }}</p>
  
        <label>
          <img src="@/assets/login/user.svg" alt="password">
          <input
            type="password"
            placeholder="Password"
            v-model="form.password"
            :class="{ 'is-error': errors.password }"
          />
        </label>
        <p v-if="errors.password" class="err">{{ errors.password }}</p>
  
        <button type="submit" :disabled="loading">
          {{ loading ? 'Проверяем…' : 'Войти' }}
        </button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        form: {
          email: '',
          password: ''
        },
        errors: {},
        loading: false
      }
    },
    methods: {
      validateForm() {
        const e = {}
        if (!this.form.email) {
          e.email = 'Введите email'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
          e.email = 'Некорректный email'
        }
  
        if (!this.form.password) {
          e.password = 'Введите пароль'
        } else if (this.form.password.length < 6) {
          e.password = 'Минимум 6 символов'
        }
  
        this.errors = e
        return Object.keys(e).length === 0
      },
      async handleLogin() {
        if (!this.validateForm()) return
        this.loading = true
        try {
          this.$router.push('/profile') 
        } finally {
          this.loading = false
        }
      }
    }
  }
  </script>
  
  <style>
  @import './login.css';
  
  .err {
    color: #e53935;
    font-size: 12px;
    margin-top: -8px;
    align-self: flex-start;
  }
  .is-error {
    border: 1px solid #e53935 !important;
  }
  </style>
  