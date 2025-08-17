<template>
    <transition name="overlay-fade">
      <div
        v-if="visible"
        class="route-overlay"
        role="status"
        aria-live="polite"
        aria-label="Загрузка страницы"
      >
        <img
          class="route-logo"
          :src="logo"
          alt="CYBER OLAM"
          draggable="false"
        />
      </div>
    </transition>
  </template>
  
  <script setup lang="ts">
  import { computed, watch, ref } from 'vue'
  
  const props = defineProps<{ logo?: string }>()
  const logo = computed(() => props.logo ?? '@/assets/logo.svg') // ← подставь свой путь
  
  const routeLoading = useState<boolean>('routeLoading', () => false)
  const visible = computed(() => routeLoading.value)
  
  // Блокируем прокрутку только пока открыт оверлей (восстанавливаем прежнее значение)
  const prevOverflow = ref('')
  watch(visible, (on) => {
    if (on) {
      prevOverflow.value = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = prevOverflow.value
    }
  })
  </script>
  
  <style scoped>
  .route-overlay{
    position: fixed;
    inset: 0;
    background: #fff;             /* Белый фон */
    display: grid;
    place-items: center;
    z-index: 9999;
    pointer-events: all;
  }
  
  /* Лого — плавное появление + мягкий пульс */
  .route-logo{
    width: clamp(120px, 16vw, 220px);
    height: auto;
    user-select: none;
    animation: logo-pop .35s ease both, logo-pulse 1.6s ease-in-out .35s infinite;
    will-change: transform, opacity;
  }
  
  /* Плавный fade всего оверлея */
  .overlay-fade-enter-active,
  .overlay-fade-leave-active{
    transition: opacity .28s ease;
  }
  .overlay-fade-enter-from,
  .overlay-fade-leave-to{
    opacity: 0;
  }
  
  /* Ключевые кадры логотипа */
  @keyframes logo-pop{
    from{ transform: scale(.85); opacity: 0 }
    60%{ transform: scale(1.04); opacity: 1 }
    to{ transform: scale(1) }
  }
  @keyframes logo-pulse{
    0%, 100% { transform: scale(1) }
    50%      { transform: scale(1.035) }
  }
  </style>
  