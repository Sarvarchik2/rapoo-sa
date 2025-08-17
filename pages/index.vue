<template>
  <div class="cyber-olam-main">
    <section class="cyber-olam-main-top">
      <div class="cyber-olam-main-top-left">
        <Swiper />
      </div>
      <div class="cyber-olam-main-top-right">
        <div class="right-content-tur">
          <h2>Текущие турниры</h2>
          <div class="right-content-tur-link-wrap">
                <NuxtLink to="/">
              RAVE Valorant
            </NuxtLink>
            <NuxtLink to="/">
              EMAE Qualification
          </NuxtLink>
          <NuxtLink to="/">
            cis
          </NuxtLink>
          </div>
        
          <NuxtLink to="/" class="turnament-link">
            <img src="@/assets/main/fire.svg" alt="arrow-right">
            Перейти
            <img src="@/assets/main/fire.svg" alt="arrow-right">
          </NuxtLink>
          <img class="right-content-tur-img" src="@/assets/main/turnamenttoday.svg" alt="turnamenttoday">
        </div>
        <div class="right-content-live">
          <h2>В ПРЯМОМ ЭФИРЕ</h2>
          <NuxtLink to="/">
            Все
            <img src="@/assets/main/arrow-right.svg" alt="live">

          </NuxtLink>

          <iframe class="right-content-live-iframe" src="https://www.youtube.com/embed/Wal8amej3rA?si=FIAhunGoebbOGZX8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          
        </div>
      </div>

    </section>
    <section class="cyber-olam-main-top cyber-olam-main-top-next">
      <div class="cyber-olam-main-top-left cyber-olam-main-top-left-next">
        <div class="cyber-olam-main-top-left-top">
          <h2>БЛИЖАЙШИЕ ТУРНИРЫ</h2>
          <NuxtLink to="/">
            Все
            <img src="@/assets/main/arrow-right.svg" alt="live">
          </NuxtLink>
        </div>
        <div class="cyber-olam-main-top-left-bottom">
          <div class="cyber-olam-main-top-left-bottom-item">
            <img src="@/assets/main/arcreed.svg" alt="turnamenttoday">
            <div class="cyber-olam-main-top-left-bottom-item-text">
              <h3>Arcreed</h3>
            </div>
          </div>
          <h4 class="cyber-olam-main-top-left-bottom-item-line">
            <img src="@/assets/main/cslogo.svg" alt="clock">
            12:44:67
          </h4>
          <div class="cyber-olam-main-top-left-bottom-item">
            <img src="@/assets/main/virtus.svg" alt="turnamenttoday">
            <div class="cyber-olam-main-top-left-bottom-item-text">
              <h3>Virtus</h3>
            </div>
          </div>
        </div>
        <button>ПОДРОБНЕЕ</button>
      </div>
      <div class="cyber-olam-main-top-right cyber-olam-main-top-right-next">
       <h2>БЛИЖАЙШЕЕ СОБЫТИЕ</h2>
       <h4 class="cyber-olam-main-top-right-line">
          Время до начала:
          <br>
            12:44:67
          </h4>
        
        <NuxtLink to="/" class="next-turnament-link">
            <img src="@/assets/main/btn-right.svg" alt="arrow-right">
            Перейти
            <img src="@/assets/main/btn-left.svg" alt="arrow-right">
          </NuxtLink>
          <img class="right-content-tur-img-next" src="@/assets/main/nextbg.svg" alt="turnamenttoday">
      </div>

    </section>
    <section class="main-interest">
      <h2>Интересные матчи</h2>
      <NuxtLink to="/" class="main-interest-link">
        Все
        <img src="@/assets/main/arrow-right.svg" alt="live">
      </NuxtLink>
      <div class="main-interest-wrapper">
        <div class="main-interest-item">
          <img class="main-interest-item-img" src="@/assets/main/cslogo.svg" alt="interest">
          <div class="main-interest-item-info">
            <div class="main-interest-item-info-text">
              <img src="@/assets/main/arcreed.svg" alt="clock">
              <h3>Arcreed</h3>
            </div>
            <h4 class="main-interest-item-info-line">12/4</h4>
             
            <div class="main-interest-item-info-text">
              <img src="@/assets/main/virtus.svg" alt="clock">
              <h3>Virtus</h3>
            </div>
          </div>
          <NuxtLink to="/" class="main-interest-item-link">
            Перейти
          </NuxtLink>
        </div>
        <div class="main-interest-item">
          <img class="main-interest-item-img" src="@/assets/main/cslogo.svg" alt="interest">
          <div class="main-interest-item-info">
            <div class="main-interest-item-info-text">
              <img src="@/assets/main/arcreed.svg" alt="clock">
              <h3>Arcreed</h3>
            </div>
            <h4 class="main-interest-item-info-line">12/4</h4>
             
            <div class="main-interest-item-info-text">
              <img src="@/assets/main/virtus.svg" alt="clock">
              <h3>Virtus</h3>
            </div>
          </div>
          <NuxtLink to="/" class="main-interest-item-link">
            Перейти
          </NuxtLink>
        </div>
        <div class="main-interest-item">
          <img class="main-interest-item-img" src="@/assets/main/cslogo.svg" alt="interest">
          <div class="main-interest-item-info">
            <div class="main-interest-item-info-text">
              <img src="@/assets/main/arcreed.svg" alt="clock">
              <h3>Arcreed</h3>
            </div>
            <h4 class="main-interest-item-info-line">12/4</h4>
             
            <div class="main-interest-item-info-text">
              <img src="@/assets/main/virtus.svg" alt="clock">
              <h3>Virtus</h3>
            </div>
          </div>
          <NuxtLink to="/" class="main-interest-item-link">
            Перейти
          </NuxtLink>
        </div>
      </div>
    </section>
    <div class="main-title-wrap">
      <h2>Турниры</h2>
      <NuxtLink to="/">
        Все
        <img src="@/assets/main/arrow-right.svg" alt="live">
      </NuxtLink>
    </div>
    <Turnirsnew />
    <div class="main-title-wrap">
      <h2>Новости</h2>
      <NuxtLink to="/">
        Все
        <img src="@/assets/main/arrow-right.svg" alt="live">
      </NuxtLink>
    </div>
    <section class="main-news">
      <div class="main-news-top">
        <span>

          <img src="@/assets/news/view.svg" alt="virtus">
          23k
        </span>
        <span>
          12.04.2025
        </span>
      </div>
      <h2 class="news-center">
         Borem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent. ectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis 
      </h2>
      <img class="main-news-img" src="@/assets/news/news3.svg" alt="news">
      <div class="news-bottom">
       
        <h3>Qorem ipsum dolor sit </h3>
        <div class="news-bottom-right">
          <span>213 <img src="@/assets/news/fire.svg" alt="fire" ></span>
          <span>213 <img src="@/assets/news/heart.svg" alt="fire" ></span>
          <span>213 <img src="@/assets/news/like.svg" alt="fire" ></span>
          <span>213 <img src="@/assets/news/dislike.svg" alt="fire" ></span>
        </div>
      </div>
    </section>
    <div class="main-title-wrap">
      <h2>Топ трансляций</h2>
      <NuxtLink to="/">
        Все
        <img src="@/assets/main/arrow-right.svg" alt="live">
      </NuxtLink>
    </div>

    <section class="main-live">
      <div class="main-live-item">
        <div class="main-live-item-top">
          <img src="@/assets/live/cs.png" alt="live">
          <span>
            <img src="@/assets/live/play.svg" alt="live">
            ПРЯОМЙ ЭФИР
          </span>
          <span>
            2,5 тыс. зрителей
          </span>
        </div>
        <div class="main-live-item-bottom">
          <img src="@/assets/live/comand.svg" alt="live">
          <div class="main-live-item-bottom-text">
            <h3>Gorem ipsum dolor sit amet, consectetur adip odio mattis.</h3>
            <h4>Deko <img src="@/assets/live/verif.svg" alt="live"></h4>
            <h4>CS 2</h4>
            <span >
              Английский
            </span>
          </div>
          <button class="main-live-item-bottom-option">
            <img src="@/assets/live/option.svg" alt="live">
          </button>
        </div>
      </div>
      <div class="main-live-item">
        <div class="main-live-item-top">
          <img src="@/assets/live/cs.png" alt="live">
          <span>
            <img src="@/assets/live/play.svg" alt="live">
            ПРЯОМЙ ЭФИР
          </span>
          <span>
            2,5 тыс. зрителей
          </span>
        </div>
        <div class="main-live-item-bottom">
          <img src="@/assets/live/comand.svg" alt="live">
          <div class="main-live-item-bottom-text">
            <h3>Gorem ipsum dolor sit amet, consectetur adip odio mattis.</h3>
            <h4>Deko <img src="@/assets/live/verif.svg" alt="live"></h4>
            <h4>CS 2</h4>
            <span >
              Английский
            </span>
          </div>
          <button class="main-live-item-bottom-option">
            <img src="@/assets/live/option.svg" alt="live">
          </button>
        </div>
      </div>
      <div class="main-live-item">
        <div class="main-live-item-top">
          <img src="@/assets/live/cs.png" alt="live">
          <span>
            <img src="@/assets/live/play.svg" alt="live">
            ПРЯОМЙ ЭФИР
          </span>
          <span>
            2,5 тыс. зрителей
          </span>
        </div>
        <div class="main-live-item-bottom">
          <img src="@/assets/live/comand.svg" alt="live">
          <div class="main-live-item-bottom-text">
            <h3>Gorem ipsum dolor sit amet, consectetur adip odio mattis.</h3>
            <h4>Deko <img src="@/assets/live/verif.svg" alt="live"></h4>
            <h4>CS 2</h4>
            <span >
              Английский
            </span>
          </div>
          <button class="main-live-item-bottom-option">
            <img src="@/assets/live/option.svg" alt="live">
          </button>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import Turnirsnew from '@/components/turnirsnew/turnirsnew.vue'
</script>

<style scoped>
@import "./index.css";
</style>