<template>
  <div class="cyber-olam">
    <Navbar />
    <BottomNavbar />
    <div class="cyber-olam-content">
      <Sidebar />
      <div class="cyber-olam-content-wrapper">
        <RouteOverlay :logo="LogoSrc" />
        <NuxtPage />
        <Footer />
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import LogoSrc from '@/assets/logo.svg'   
const route = useRoute()

const updateBodyOverflow = () => {
  if (['login', 'registration'].includes(route.name)) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

onMounted(() => {
  updateBodyOverflow()
})

// Следим за изменением маршрута
watch(() => route.name, () => {
  updateBodyOverflow()
})
</script>

<style>
@import "./variables.css";
@import "./app.css";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.is-route-loading body { overflow: hidden !important; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
  padding: 30px 50px;
}
@media (max-width: 769px) {
  body {
    padding: 15px;
  }
}
#__nuxt {
  min-height: 100vh;
}
</style> 