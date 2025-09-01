<script setup lang="ts" async>
import { ref, computed, watch } from 'vue'
import { useRuntimeConfig } from '#imports'

/** ---------- CONFIG ---------- */
const config = useRuntimeConfig()
const API_BASE = (config.public?.apiBase as string) || 'http://localhost:8000' // поменяй при необходимости

/** ---------- UI STATE ---------- */
const activeTab = ref<'active' | 'past' | 'upcoming'>('upcoming') // по умолчанию будущие
const sortBy = ref<'start_asc' | 'start_desc' | 'prize_desc' | 'views_desc'>('start_asc')
const page = ref(1)

const loading = ref(true)
const error = ref<string | null>(null)

/** ---------- TYPES ---------- */
type FileObj = {
  id: number
  file?: string
  path?: string
  description?: string
  main?: number
}
type UserLite = {
  id: string
  email?: string
  phone?: string
  username?: string
  first_name?: string
  last_name?: string
  role?: string
  region?: string
  language?: string
  is_active?: boolean
}
type Game = {
  id: number
  title?: string
  description?: string
  short_description?: string
  logo?: number
  cover_image?: number
  banner_image?: number
  release_year?: number
  latest_version?: string
  official_website?: string
  max_players?: number
  is_integrated?: boolean
  is_featured?: boolean
  is_active?: boolean
}
type TournamentItem = {
  id: number
  name: string
  description?: string
  short_description?: string
  status?: string
  tournament_start?: string
  tournament_end?: string
  total_prize_pool?: string | number
  view_count?: number
  organizer?: UserLite | string
  logo?: FileObj | string | number
  banner?: FileObj | string | number
  game?: Game
}
type PageResp = {
  count: number
  next: string | null
  previous: string | null
  results: TournamentItem[]
}

/** ---------- DATA ---------- */
const list = ref<TournamentItem[]>([])
const count = ref(0)
const pageSize = ref(10) // обновим с фактической длиной results, если придёт

/** ---------- HELPERS ---------- */
const tz = 'Asia/Tashkent'
const now = () => new Date()
const parse = (s?: string) => (s ? new Date(s) : undefined)
const fmtDate = (s?: string) =>
  s ? new Date(s).toLocaleDateString('ru-RU', { timeZone: tz }) : '—'

const moneyNum = (v?: string | number) => {
  if (v == null) return 0
  const n = typeof v === 'string' ? Number(v) : v
  return Number.isFinite(n) ? n : 0
}

/** Картинка: поддерживаем объект {file|path}, относительные/абсолютные пути, ID и дефолт */
function fileToUrl(f?: FileObj | string | number): string | null {
  if (!f) return null
  if (typeof f === 'string') {
    if (/^https?:\/\//.test(f)) return f
    return `${API_BASE}${f}`
  }
  if (typeof f === 'number') {
    // тут можно прикрутить резолвер по id, пока ставим плейсхолдер
    return null
  }
  // FileObj
  const raw = f.file || f.path
  if (!raw) return null
  if (/^https?:\/\//.test(raw)) return raw
  return `${API_BASE}${raw}`
}

const imgUrl = (banner?: FileObj | string | number, logo?: FileObj | string | number) =>
  fileToUrl(banner) || fileToUrl(logo) || '/assets/turnirs/tur1.png'

function organizerName(o?: UserLite | string): string {
  if (!o) return 'CYBER OLAM'
  if (typeof o === 'string') return o
  const full = [o.first_name, o.last_name].filter(Boolean).join(' ').trim()
  return full || o.username || o.email || 'CYBER OLAM'
}

/** ---------- FETCH ---------- */
function mapOrdering(o: typeof sortBy.value) {
  // серверная сортировка: если не поддерживается — просто проигнорируется
  switch (o) {
    case 'start_desc': return '-tournament_start'
    case 'prize_desc': return '-total_prize_pool'
    case 'views_desc': return '-view_count'
    case 'start_asc':
    default: return 'tournament_start'
  }
}

async function fetchPage(p = 1) {
  loading.value = true
  error.value = null
  try {
    const ordering = mapOrdering(sortBy.value)
    // 1) путь с опечаткой как в твоих доках
    const urlBad = `${API_BASE}/tournaments/page/tounaments/list/?page=${p}&ordering=${encodeURIComponent(ordering)}`
    // 2) «правильный» путь — на будущее
    const urlGood = `${API_BASE}/tournaments/page/tournaments/list/?page=${p}&ordering=${encodeURIComponent(ordering)}`
    let data: PageResp | null = null
    try { data = await $fetch<PageResp>(urlBad) } catch { data = await $fetch<PageResp>(urlGood) }

    list.value = data?.results || []
    count.value = data?.count || 0
    if (Array.isArray(data?.results) && data!.results.length > 0) {
      pageSize.value = data!.results.length
    }
  } catch (e:any) {
    error.value = e?.message || 'Ошибка загрузки'
  } finally {
    loading.value = false
  }
}

/** Первичная загрузка */
await fetchPage(page.value)

/** Релоад при смене страницы/сортировки */
watch(page, (p) => { fetchPage(p) })
watch(sortBy, () => { page.value = 1; fetchPage(1) })

/** ---------- FILTER (по табам) + клиентский фолбэк сортировки ---------- */
const filtered = computed(() => {
  const n = now()
  return list.value.filter(t => {
    const start = parse(t.tournament_start)
    const end = parse(t.tournament_end)

    if (activeTab.value === 'active') {
      if (start && start <= n && (!end || end >= n)) return true
      if (!start && t.status?.toUpperCase() === 'PUBLISHED') return true
      return false
    }
    if (activeTab.value === 'past') {
      if (end && end < n) return true
      if (!end && t.status?.toUpperCase() === 'FINISHED') return true
      return false
    }
    // upcoming
    if (start && start > n) return true
    if (!start && t.status?.toUpperCase() === 'DRAFT') return true
    return false
  })
})

const sorted = computed(() => {
  // если сервер уже отсортировал — порядок, скорее всего, правильный.
  // но оставим клиентский фолбэк на всякий случай.
  const arr = [...filtered.value]
  switch (sortBy.value) {
    case 'start_desc':
      return arr.sort((a, b) => {
        const A = parse(a.tournament_start)?.getTime() ?? 0
        const B = parse(b.tournament_start)?.getTime() ?? 0
        return B - A
      })
    case 'prize_desc':
      return arr.sort((a, b) => moneyNum(b.total_prize_pool) - moneyNum(a.total_prize_pool))
    case 'views_desc':
      return arr.sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0))
    case 'start_asc':
    default:
      return arr.sort((a, b) => {
        const A = parse(a.tournament_start)?.getTime() ?? Number.MAX_SAFE_INTEGER
        const B = parse(b.tournament_start)?.getTime() ?? Number.MAX_SAFE_INTEGER
        return A - B
      })
  }
})

/** ---------- PAGINATION (UI) ---------- */
const totalPages = computed(() => Math.max(1, Math.ceil(count.value / Math.max(1, pageSize.value))))
function prevPage() { if (page.value > 1) page.value-- }
function nextPage() { if (page.value < totalPages.value) page.value++ }
</script>

<template>
  <div class="tournaments">
    <!-- switcher -->
    <div class="tournaments-switcher">
      <div class="switcher-container" :data-active="activeTab">
        <button
          class="switcher-item"
          :class="{ active: activeTab === 'active' }"
          @click="activeTab = 'active'"
        >
          Активные
        </button>
        <button
          class="switcher-item"
          :class="{ active: activeTab === 'past' }"
          @click="activeTab = 'past'"
        >
          Прошедшие
        </button>
        <button
          class="switcher-item"
          :class="{ active: activeTab === 'upcoming' }"
          @click="activeTab = 'upcoming'"
        >
          Ближайшие
        </button>
      </div>
    </div>

    <!-- твой блок -->
    <Turnirsnew />

    <!-- состояния -->
    <div v-if="loading" class="state">Загрузка…</div>
    <div v-else-if="error" class="state error">Ошибка: {{ error }}</div>

    <!-- СПИСОК — карточки твоего дизайна -->
    <div v-else class="tournaments-wrapper">
      <div
        v-for="t in sorted"
        :key="t.id"
        class="tournaments-wrapper-item"
      >
        <div class="tournaments-wrapper-item-img">
          <img :src="imgUrl(t.banner, t.logo)" :alt="t.name">
        </div>
        <div class="tournaments-wrapper-item-text">
          <h2>{{ t.name }}</h2>
          <p>{{ organizerName(t.organizer) }}</p>
          <!-- ссылка оставляю как ты просил -->
          <NuxtLink :to="`/tournaments-more/${t.id}`">
            Подробнее
          </NuxtLink>
        </div>
      </div>

      <div v-if="!sorted.length" class="empty">
        Нет турниров для выбранного фильтра.
      </div>
    </div>

    <!-- пагинация -->
    <div v-if="!loading && totalPages > 1" class="pagination">
      <button @click="prevPage" :disabled="page === 1">Назад</button>
      <span>{{ page }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="page === totalPages">Вперёд</button>
    </div>
  </div>
</template>

<style scoped>
@import './tournaments.css';

/* Вспомогательные элементы (карточки — твой исходный дизайн) */
.state { padding: 16px; opacity: .8; }
.state.error { color: #ff6b6b; }

.pagination{
  margin: 18px 0;
  display: flex; gap: 12px; align-items: center; justify-content: center;
}
.pagination button{
  padding: 8px 12px; border-radius: 10px; border: 1px solid #2a2a2a; background: transparent;
}

.empty{ opacity: .7; padding: 16px; text-align: center; }
</style>
