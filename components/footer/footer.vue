<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Логотип по центру -->
      <div class="footer-logo">
        <img src="@/assets/logo.svg" alt="CYBER OLAM">
      </div>
      
      <div class="footer-main">
        <!-- Социальные сети слева -->
        <div class="footer-social">
          <div class="social-item">
            <div class="social-icon">
              <img src="@/assets/icons/sidebar/telegram.svg" alt="Telegram">
            </div>
            <img class="social-arrow" src="@/assets/footer/right.svg" alt="arrow-right">
          </div>
          <div class="social-item">
            <div class="social-icon">
              <img src="@/assets/icons/sidebar/discrod.svg" alt="Discord">
            </div>
            <img class="social-arrow" src="@/assets/footer/right.svg" alt="arrow-right">
          </div>
          <div class="social-item">
            <div class="social-icon">
              <img src="@/assets/icons/sidebar/instagram.svg" alt="Instagram">
            </div>
            <img class="social-arrow" src="@/assets/footer/right.svg" alt="arrow-right">
                
            
          </div>
        </div>

        <!-- Навигационные колонки справа -->
        <!-- <div class="footer-nav"> -->
          <ul class="footer-item">
            <h2>Главная</h2>
            <li><NuxtLink to="/">Lorem ipsum dolor</NuxtLink></li>
            <li><NuxtLink to="/">Lorem ipsum dolor</NuxtLink></li>
            <li><NuxtLink to="/">Lorem ipsum dolor</NuxtLink></li>
            <li><NuxtLink to="/">Lorem ipsum dolor</NuxtLink></li>
          </ul>
          <ul class="footer-item">
            <h2>О нас</h2>
            <li><NuxtLink to="/">Lorem ipsum dolor</NuxtLink></li>
            <li><NuxtLink to="/">Lorem ipsum dolor</NuxtLink></li>
            <li><NuxtLink to="/">Lorem ipsum dolor</NuxtLink></li>
            <li><NuxtLink to="/">Lorem ipsum dolor</NuxtLink></li>
          </ul>
          <ul class="footer-item">
            <h2>Магазин</h2>
            <li><NuxtLink to="/">Lorem ipsum dolor</NuxtLink></li>
            <li><NuxtLink to="/">Lorem ipsum dolor</NuxtLink></li>
            <li><NuxtLink to="/">Lorem ipsum dolor</NuxtLink></li>
            <li><NuxtLink to="/">Lorem ipsum dolor</NuxtLink></li>
          </ul>
          <ul class="footer-item">
            <h2>Конфиденциальность</h2>
            <li><NuxtLink to="/">Lorem ipsum dolor</NuxtLink></li>
            <li><NuxtLink to="/">Lorem ipsum dolor</NuxtLink></li>
            <li><NuxtLink to="/">Lorem ipsum dolor</NuxtLink></li>
            <li><NuxtLink to="/">Lorem ipsum dolor</NuxtLink></li>
          </ul>
        <!-- </div> -->
      </div>
    </div>
  </footer>
</template>

<style scoped>
@import './footer.css';
</style>