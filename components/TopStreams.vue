<template>
  <div class="top-streams"> 
    <div class="main-title-wrap">
      <h2>Топ трансляций</h2>
      <NuxtLink to="/streams">
        Все
        <img src="@/assets/main/arrow-right.svg" alt="live" />
      </NuxtLink>
    </div>
    <section class="main-live">
      <div v-if="pending" class="state">Загрузка…</div>
      <div v-else-if="error" class="state error">Не удалось загрузить стримы</div>
      <div class="main-live" v-else>
        <NuxtLink
          v-for="s in topStreams"
          :key="s.id"
          :to="`/streams-more/${s.id}`"
          class="main-live-item"
        >
          <div class="main-live-item-top">
            <img :src="streamCover(s)" alt="live" />
            <span>
              <img src="@/assets/live/play.svg" alt="live" />
              {{ liveBadge(s) }}
            </span>
            <span>{{ viewersText(s) }}</span>
          </div>
          <div class="main-live-item-bottom">
            <img src="@/assets/live/comand.svg" alt="live" />
            <div class="main-live-item-bottom-text">
              <h3>{{ s.title || 'Без названия' }}</h3>
              <h4>{{ s.game?.title || '—' }}</h4>
              <span>{{ s.language?.name || 'EN' }}</span>
            </div>
          </div>
        </NuxtLink>
        <div v-if="topStreams.length === 0" class="tournaments-teams-empty">Пока нет стримов.</div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'
import { $fetch } from 'ofetch'

const pending = ref(true)
const error = ref(null)
const categoriesData = ref([])

const config = useRuntimeConfig()
const API_BASE = (config.public?.apiBase || '').toString()

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
  }
}
onMounted(fetchStreams)

// Вспомогательные функции для картинок и текста
const PLACEHOLDER = '/assets/live/cs.png'
function extractYoutubeId(url) {
  try {
    const u = new URL(String(url))
    if (u.hostname.includes('youtu.be')) return u.pathname.split('/')[1] || null
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

// Логика выбора топ-3 трансляций
const topStreams = computed(() => {
  const cats = categoriesData.value || []
  let result = []

  // Собираем по одной из каждой категории
  for (let i = 0; i < cats.length && result.length < 3; i++) {
    const streams = Array.isArray(cats[i]?.category_streams) ? cats[i].category_streams : []
    if (streams.length) result.push(streams[0])
  }

  // Если меньше 3 — добираем из остальных (по порядку)
  if (result.length < 3) {
    let extra = []
    for (let i = 0; i < cats.length; i++) {
      const streams = Array.isArray(cats[i]?.category_streams) ? cats[i].category_streams : []
      extra = extra.concat(streams.slice(1))
    }
    for (let i = 0; i < extra.length && result.length < 3; i++) {
      result.push(extra[i])
    }
  }

  // Если только одна категория — берём 3 из неё
  if (cats.length === 1) {
    const streams = Array.isArray(cats[0]?.category_streams) ? cats[0].category_streams : []
    result = streams.slice(0, 3)
  }

  // Если всё равно меньше 3 — просто возвращаем что есть
  return result.slice(0, 3)
})
</script>


<style>
.top-streams {
    width: 100%;
}
</style>