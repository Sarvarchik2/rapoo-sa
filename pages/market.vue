<template>
    <div class="cyber-market">
      <button class="cyber-market-back" type="button" @click="goBack">
        <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M15 10H5M5 10L10 15M5 10L10 5" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Назад
      </button>
  
      <section class="cyber-promos-grid">
        <article class="cyber-promo-card cyber-promo-steam">
          <div class="cyber-promo-text">
            <h3>Пополнение Steam</h3>
            <p>Моментально и безопасно</p>
          </div>
          <img class="cyber-promo-img-right" src="@/assets/market/cyberolam.png" alt="" loading="lazy" />
          <span class="cyber-promo-arrow" aria-hidden="true">↗</span>
        </article>
  
        <article class="cyber-promo-card cyber-promo-codes">
          <div class="cyber-promo-text">
            <h3>Коды активации</h3>
          </div>
          <img class="cyber-promo-img-cover" src="@/assets/market/codes.svg" alt="" loading="lazy" />
          <span class="cyber-promo-arrow" aria-hidden="true">↗</span>
        </article>
  
        <article class="cyber-promo-card cyber-promo-fc25">
          <img class="cyber-promo-img-cover" src="@/assets/market/fc.svg" alt="" loading="lazy" />
          <div class="cyber-promo-text cyber-promo-text--shadow">
            <h3>Пополнение PS и XBox игр выгодно и быстро</h3>
          </div>
          <span class="cyber-promo-arrow" aria-hidden="true">↗</span>
        </article>
  
        <article class="cyber-promo-card cyber-promo-gifts">
          <img class="cyber-promo-img-right" src="@/assets/market/super.svg" alt="" loading="lazy" />
          <div class="cyber-promo-text">
            <h3>Подарки от Steam</h3>
          </div>
          <span class="cyber-promo-arrow" aria-hidden="true">↗</span>
        </article>
      </section>
  
      <!-- игры -->
      <section class="cyber-games">
        <div class="cyber-games-grid">
          <div v-for="g in games" :key="g.slug" class="cyber-game-card">
            <img :src="g.img" :alt="g.title" loading="lazy" />
            <div class="cyber-game-label">
              <span>{{ g.title }}</span>
              <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M7 13L13 7M9 7h4v4" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  import imgPromo from '~/assets/market/pubg.svg'
  import imgPromo2 from '~/assets/market/dota.svg'
  import imgPromo3 from '~/assets/market/cs.svg'
  import imgPromo4 from '~/assets/market/valorant.svg'
  
  const router = useRouter()
  const goBack = () => router.back()
  
  const games = [
    { slug: 'cs2',       title: 'CS 2',      img: imgPromo3 },
    { slug: 'pubg',      title: 'PUBG',      img: imgPromo },
    { slug: 'valorant',  title: 'VALORANT',  img: imgPromo4 },
    { slug: 'dota2',     title: 'DOTA 2',    img: imgPromo2 },
    { slug: 'cs2-2',     title: 'CS 2',      img: imgPromo3 },
    { slug: 'pubg-2',    title: 'PUBG',      img: imgPromo },
    { slug: 'valorant-2',title: 'VALORANT',  img: imgPromo4 },
    { slug: 'dota2-2',   title: 'DOTA 2',    img: imgPromo3 },
  ]
  </script>
  
<style>
    @import './market.css'
</style>
  