<template>
  <div class="live">
    <!-- Switcher -->
    <div class="switcher">
      <div class="switcher-container">
        <button
          v-for="(category, index) in categoryNames"
          :key="index"
          :class="['switcher-btn', { active: activeCategory === index }]"
          @click="setActiveCategory(index)"
          :ref="el => { if (el) buttonRefs[index] = el }"
        >
          {{ category }}
        </button>
        <div
          class="switcher-slider"
          :style="{
            transform: `translateX(${getSliderPosition()}px)`,
            width: `${getSliderWidth()}px`
          }"
        ></div>
      </div>
    </div>

    <div class="main-title-wrap">
      <h2>{{ categoryNames[activeCategory] || 'Стримы' }}</h2>
    </div>

    <div v-if="pending" class="state">Загрузка…</div>
    <div v-else-if="error" class="state error">Не удалось загрузить стримы</div>

    <section v-else class="main-live">
      <div v-if="activeStreams.length === 0" class="tournaments-teams-empty">Пока нет стримов.</div>

      <NuxtLink
        v-for="s in activeStreams"
        :key="s.id"
        to="/streams-more"
        class="main-live-item"
      >
        <div class="main-live-item-top">
          <img :src="streamCover(s)" alt="live">
          <span>
            <img src="@/assets/live/play.svg" alt="live">
            {{ liveBadge(s) }}
          </span>
          <span>
            {{ viewersText(s) }}
          </span>
        </div>
        <div class="main-live-item-bottom">
          <img src="@/assets/live/comand.svg" alt="live">
          <div class="main-live-item-bottom-text">
            <h3>{{ s.title || 'Без названия' }}</h3>
            <h4>{{ s.game?.title || '—' }}</h4>
            <span>
              {{ s.language?.name || '—' }}
            </span>
          </div>
          <!-- <button class="main-live-item-bottom-option" type="button">
            <img src="@/assets/live/option.svg" alt="live">
          </button> -->
        </div>
      </NuxtLink>
    </section>
  </div>
  </template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRuntimeConfig } from '#imports'

const activeCategory = ref(0)
const buttonRefs = ref([])
const buttonWidths = ref([])

// API fetch
const config = useRuntimeConfig()
const API_BASE = (config.public?.apiBase || '').toString()

const pending = ref(true)
const error = ref(null)
const categoriesData = ref([]) // [{ id, name, category_streams: [...] }]

async function fetchStreams() {
  pending.value = true; error.value = null
  try {
    const url = `${API_BASE}/streaming/main/`
    const res = await $fetch(url)
    categoriesData.value = Array.isArray(res?.results) ? res.results : []
  } catch (e) {
    error.value = e
  } finally {
    pending.value = false
    calculateButtonWidths()
  }
}

onMounted(() => { fetchStreams() })

const categoryNames = computed(() => (categoriesData.value || []).map(c => c?.name || 'Категория'))
const activeStreams = computed(() => {
  const cat = categoriesData.value?.[activeCategory.value]
  return Array.isArray(cat?.category_streams) ? cat.category_streams : []
})

const setActiveCategory = (index) => {
  activeCategory.value = index
  calculateButtonWidths()
}

const getSliderPosition = () => {
  if (buttonWidths.value.length === 0) return 0
  let position = 0
  const gap = window.innerWidth <= 768 ? 6 : 8
  for (let i = 0; i < activeCategory.value; i++) {
    position += (buttonWidths.value[i] || 120) + gap
  }
  return position
}

const getSliderWidth = () => {
  return buttonWidths.value[activeCategory.value] || 120
}

const calculateButtonWidths = async () => {
  await nextTick()
  buttonWidths.value = buttonRefs.value.map(button => button?.offsetWidth || 120)
}

// UI helpers
const PLACEHOLDER = '/assets/live/cs.png'

function extractYoutubeId(url) {
  try {
    const u = new URL(String(url))
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.split('/')[1] || null
    }
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.includes('/embed/')) return u.pathname.split('/embed/')[1] || null
      const v = u.searchParams.get('v')
      return v || null
    }
  } catch {}
  return null
}

function extractTwitchChannel(url) {
  try {
    const u = new URL(String(url))
    if (u.hostname.includes('twitch.tv')) {
      if (u.searchParams.get('channel')) return u.searchParams.get('channel')
      const parts = u.pathname.split('/').filter(Boolean)
      return parts[0] || null
    }
    if (u.hostname.includes('player.twitch.tv')) {
      const ch = u.searchParams.get('channel')
      return ch || null
    }
  } catch {}
  return null
}

const streamCover = (s) => {
  const url = s?.hls_url || s?.rtmp_url || s?.embed_url || s?.url || ''
  const yid = extractYoutubeId(url)
  if (yid) return `https://img.youtube.com/vi/${yid}/hqdefault.jpg`
  const tch = extractTwitchChannel(url)
  if (tch) return `https://static-cdn.jtvnw.net/previews-ttv/live_user_${tch}-640x360.jpg`
  return PLACEHOLDER
}
const liveBadge = (s) => (String(s?.status || s?.is_live || '').toUpperCase().includes('LIVE') ? 'ПРЯМОЙ ЭФИР' : 'ОФФЛАЙН')
const viewersText = (s) => s?.viewers ? `${s.viewers} зрителей` : ''
</script>


<style>
@import './index.css';
@import './streams.css';
</style>