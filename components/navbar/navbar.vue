<template>
    <div class="navbar">
      <NuxtLink to="/" class="navbar-logo">
        <img src="@/assets/logo.svg" alt="Cyber Olam" />
      </NuxtLink>
  
      <div class="navbar-center">
        <div class="navbar-search">
          <input type="text" placeholder="Search" />
          <img src="@/assets/icons/navbar/search.svg" alt="Search" />
        </div>
        <NuxtLink to="/market" class="navbar-shop-cart">
          Магазин
          <img src="@/assets/icons/navbar/shop.svg" alt="Shop Cart" />
        </NuxtLink>
      </div>
  
      <div class="navbar-right">
        <div class="navbar-right-item">
          <NuxtLink to="/notifications">
            <img src="@/assets/icons/navbar/notification.svg" alt="Notification" />
          </NuxtLink>
          <button>
            <img src="@/assets/icons/navbar/lang.svg" alt="Language" />
          </button>
        </div>
  
        <!-- Не авторизован: показать CTA -->
        <div v-if="!isAuthenticated" class="navbar-auth-ctas" style="display:flex; gap:10px;">
          <NuxtLink to="/login" class="navbar-login-btn"><img src="@/assets/icons/navbar/login.svg" alt="">Войти</NuxtLink>
          <!-- <NuxtLink to="/registration" class="navbar-shop-cart">Регистрация</NuxtLink> -->
        </div>
  
        <!-- Авторизован: показать аватар -->
        <NuxtLink
          v-else
          to="/profile"
          class="navbar-right-avatar"
          :title="displayName || 'Профиль'"
        >
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            class="avatar-img"
            alt="User avatar"
            @error="onAvatarError"
          />
          <div v-else class="avatar-fallback">
            <span v-if="initials">{{ initials }}</span>
            <img v-else :src="userIcon" alt="User" />
          </div>
        </NuxtLink>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import userIcon from '@/assets/icons/navbar/user.svg'
  
  const { $auth } = useNuxtApp()
  const { user, isAuthenticated } = useAuth()
  
  // лёгкая загрузка профиля только на клиенте
  const { data: prof } = await useAsyncData(
    'navbar-profile',
    () => (isAuthenticated.value ? $auth('/profile/') : null),
    { watch: [isAuthenticated], server: false }
  )
  
  const avatarBroken = ref(false)
  const avatarUrl = computed<string | null>(() => {
    if (avatarBroken.value) return null
    return (
      (prof.value as any)?.data?.avatar ||
      (user.value as any)?.avatar ||
      null
    )
  })
  function onAvatarError(){ avatarBroken.value = true }
  
  const displayName = computed(() => {
    const p = (prof.value as any)?.data?.user || {}
    return p.first_name && p.last_name
      ? `${p.first_name} ${p.last_name}`
      : (user.value as any)?.username || p.username || ''
  })
  
  const initials = computed(() => {
    const p = (prof.value as any)?.data?.user || {}
    const fn = p.first_name || (user.value as any)?.first_name || ''
    const ln = p.last_name  || (user.value as any)?.last_name  || ''
    const name = `${fn} ${ln}`.trim()
    if (!name) return ''
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((s: string) => s[0]?.toUpperCase())
      .join('')
  })
  
  </script>
  
  <style scoped>
  @import "./navbar.css";
  
  /* Аватар — оставил как было */
  .navbar-right-avatar {
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #0b1220;
    border: 1px solid var(--bg-blue);
  }
  .avatar-img {
    width: 100%;
    height: 100%;
    background: var(--bg-white);
    object-fit: cover;
  }
  .avatar-fallback {
    width: 100%;
    height: 100%;
    border-radius: 9999px;
    display: grid;
    place-items: center;
    background: var(--bg-white);
    color: #e5e7eb;
    font-weight: 700;
    letter-spacing: .5px;
  }
  .avatar-fallback img { width: 100%; height: 100%; opacity: .9; }
  .navbar-login-btn{
    padding: 10px 20px;
    background: var(--bg-blue);
    color: var(--text-white);
    border-radius: 40px;
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }
  </style>
  