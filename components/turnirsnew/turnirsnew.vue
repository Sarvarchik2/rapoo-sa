<template>
  <section class="news-latest" v-if="displayItems.length">
    <div
      v-for="(t, idx) in displayItems.slice(0,2)"
      :key="t.id"
      :class="idx === 0 ? 'news-latest-left' : 'news-latest-right'"
    >
      <img :src="imgUrl(t.banner, t.logo)" :alt="t.name" />
      <h2>{{ t.name }}</h2>
      <template v-if="idx === 0">
        <div class="news-latest-left-text">
          <h3>{{ t.game?.title || t.short_description || t.description }}</h3>
          <NuxtLink :to="`/tournaments-more/${t.id}`">Подробнее</NuxtLink>
        </div>
      </template>
      <template v-else>
        <h3>{{ t.game?.title || t.short_description || t.description }}</h3>
        <NuxtLink :to="`/tournaments-more/${t.id}`">Подробнее</NuxtLink>
      </template>
    </div>
  </section>
  <section v-else class="news-latest empty">
    Нет турниров для отображения.
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRuntimeConfig } from '#imports'
import { $fetch } from 'ofetch'

const config = useRuntimeConfig()
const API_BASE = config.public?.apiBase || 'http://localhost:8000'

type FileObj = { file?: string; path?: string }
type Game = { title?: string }
type TournamentItem = {
  id: number
  name: string
  banner?: FileObj | string | number
  logo?: FileObj | string | number
  game?: Game
  tournament_start?: string
  tournament_end?: string
  status?: string
  short_description?: string
  description?: string
}

const tournaments = ref<TournamentItem[]>([])
const loading = ref(true)

function parse(s?: string) {
  if (!s) return undefined
  // Попробуйте new Date(s.replace(' ', 'T')) если сервер отдаёт с пробелом
  return new Date(s)
}
const now = () => new Date()

function imgUrl(banner?: FileObj | string | number, logo?: FileObj | string | number) {
  function fileToUrl(f?: FileObj | string | number): string | null {
    if (!f) return null
    if (typeof f === 'string') {
      if (/^https?:\/\//.test(f)) return f
      return `${API_BASE}${f}`
    }
    if (typeof f === 'number') return null
    const raw = f.file || f.path
    if (!raw) return null
    if (/^https?:\/\//.test(raw)) return raw
    return `${API_BASE}${raw}`
  }
  return fileToUrl(banner) || fileToUrl(logo) || '/assets/turnirs/tur1.png'
}

async function fetchTournaments() {
  loading.value = true
  try {
    // Попробуйте сначала с "tounaments", если не работает — с "tournaments"
    let url = `${API_BASE}/tournaments/page/tounaments/list/?page=1&ordering=tournament_start`
    let data: { results: TournamentItem[] } | null = null
    try {
      data = await $fetch(url)
    } catch {
      url = `${API_BASE}/tournaments/page/tournaments/list/?page=1&ordering=tournament_start`
      data = await $fetch(url)
    }
    tournaments.value = data?.results || []
  } catch {
    tournaments.value = []
  } finally {
    loading.value = false
  }
}
await fetchTournaments()

const upcomingSorted = computed(() =>
  [...tournaments.value]
    .filter(t => {
      const start = parse(t.tournament_start)
      return start && start > now()
    })
    .sort((a, b) => {
      const A = parse(a.tournament_start)?.getTime() ?? Number.MAX_SAFE_INTEGER
      const B = parse(b.tournament_start)?.getTime() ?? Number.MAX_SAFE_INTEGER
      return A - B // ближайшие сверху
    })
)

const activeSorted = computed(() =>
  [...tournaments.value]
    .filter(t => {
      const start = parse(t.tournament_start)
      const end = parse(t.tournament_end)
      return start && start <= now() && (!end || end >= now())
    })
    .sort((a, b) => {
      const A = parse(a.tournament_start)?.getTime() ?? 0
      const B = parse(b.tournament_start)?.getTime() ?? 0
      return B - A // новые активные сверху
    })
)

const pastSorted = computed(() =>
  [...tournaments.value]
    .filter(t => {
      const end = parse(t.tournament_end)
      return end && end < now()
    })
    .sort((a, b) => {
      const A = parse(a.tournament_end)?.getTime() ?? 0
      const B = parse(b.tournament_end)?.getTime() ?? 0
      return B - A // новые прошедшие сверху
    })
)

const displayItems = computed(() => {
  if (upcomingSorted.value.length) return upcomingSorted.value
  if (activeSorted.value.length) return activeSorted.value
  return pastSorted.value
})

console.log('upcomingSorted', upcomingSorted.value)
console.log('activeSorted', activeSorted.value)
</script>

<style scoped>
@import "./turnursnew.css";
</style>