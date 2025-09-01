<template>
  <div class="notifications">
    <!-- Навигация назад -->
    <NuxtLink to="/rate" class="back-nav">
      <button class="back-btn">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M15 10H5M5 10L10 15M5 10L10 5" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Назад
      </button>
    </NuxtLink>

    <h1 class="ntf-title">Уведомления</h1>

    <!-- Фильтры/поиск (опционально) -->
    <div class="ntf-filters" style="display:none;gap:10px;flex-wrap:wrap;margin-bottom:16px;">
      <input
        class="team-name-input"
        style="max-width:320px"
        type="text"
        placeholder="Поиск по названию команды…"
        v-model.trim="search"
        @keydown.enter.prevent="resetAndLoad"
      />
      <button class="create-team-button" style="padding:8px 14px" @click="resetAndLoad" :disabled="loading">
        Найти
      </button>
    </div>

    <div class="notifications-wrapper">
      <!-- <h2 class="ntf-section">Приглашения в команды</h2> -->

      <!-- Состояния -->
      <div v-if="loading && items.length === 0" class="state">Загрузка…</div>
      <div v-else-if="errorText && items.length === 0" class="state error">{{ errorText }}</div>
      <div v-else-if="!loading && items.length === 0" class="state">Пока нет приглашений</div>

      <!-- Список приглашений -->
      <div v-for="inv in items" :key="inv.id" class="notif-card">
        <div class="notif-left">
          <img
            class="notif-avatar"
            :src="teamLogo(inv) || '/assets/icons/navbar/user.svg'"
            :alt="teamName(inv) || 'team'"
          />
          <div class="notif-id">
            <div class="notif-name" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <span>{{ teamName(inv) }}</span>
              <span v-if="teamTag(inv)" class="badge-flag" style="font-weight:600;">#{{ teamTag(inv) }}</span>
            </div>
            <div class="notif-sub" style="opacity:.8; font-size:13px; margin-top:2px;">
              Роль: {{ roleLabel(inv.role) }}
              <span v-if="inv.expires_at"> · до {{ formatDate(inv.expires_at) }}</span>
            </div>
          </div>
        </div>

        <div class="notif-msg">
          Приглашение в команду <b>{{ teamName(inv) }}</b>
          <template v-if="inv.message"> — «{{ inv.message }}»</template>
        </div>

        <div class="notif-right">
          <div class="notif-actions">
            <button
              class="btn btn-accept"
              :disabled="actionBusy[inv.id]"
              @click="accept(inv)"
            >
              {{ actionBusy[inv.id] === 'accept' ? 'Принимаем…' : 'Принять' }}
            </button>
            <button
              class="btn btn-decline"
              :disabled="actionBusy[inv.id]"
              @click="decline(inv)"
            >
              {{ actionBusy[inv.id] === 'decline' ? 'Отклоняем…' : 'Отклонить' }}
            </button>
          </div>
          <time class="notif-time">{{ timeAgo(inv.created_at) }}</time>
        </div>
      </div>

      <!-- Пагинация -->
      <div v-if="nextPage" style="display:flex;justify-content:center;margin-top:16px;">
        <button class="create-team-button" @click="loadMore" :disabled="loading">
          {{ loading ? 'Загружаем…' : 'Показать ещё' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const { $api } = useNuxtApp()

/** ====== Состояния списка ====== */
const items     = ref<any[]>([])
const count     = ref<number>(0)
const nextPage  = ref<number|null>(1)      // начинаем со стр. 1
const ordering  = ref<string>('-created_at')
const search    = ref<string>('')
const loading   = ref<boolean>(false)
const errorText = ref<string>('')

/** map «id приглашения → 'accept' | 'decline' | true» */
const actionBusy = ref<Record<number, 'accept'|'decline'|true>>({})

/** ====== Загрузка ====== */
async function fetchPage(page: number) {
  loading.value = true
  errorText.value = ''
  try {
    const res = await $api('/teams/invitation/list/', {
      query: {
        page,
        ordering: ordering.value || undefined,
        search: search.value || undefined,
      }
    })
    const results = Array.isArray(res?.results) ? res.results : []
    if (page === 1) {
      items.value = results
    } else {
      items.value = [...items.value, ...results]
    }
    count.value = Number(res?.count ?? results.length)
    // есть ли следующая страница
    const nextUrl: string | null = res?.next || null
    if (nextUrl && /[?&]page=(\d+)/.test(nextUrl)) {
      const m = nextUrl.match(/[?&]page=(\d+)/)
      nextPage.value = m ? Number(m[1]) : null
    } else {
      nextPage.value = null
    }
  } catch (e: any) {
    console.error('[invites] list error', e)
    errorText.value = e?.statusMessage || e?.message || 'Не удалось загрузить приглашения'
  } finally {
    loading.value = false
    
  }
}

function resetAndLoad() {
  nextPage.value = 1
  fetchPage(1)
}
function loadMore() {
  if (!nextPage.value || loading.value) return
  fetchPage(nextPage.value)
}

/** ====== Действия: принять / отклонить ====== */
async function accept(inv: any) {
  if (!inv?.id) return
  actionBusy.value[inv.id] = 'accept'
  try {
    await $api(`/teams/invitation/${inv.id}/accept/`, { method: 'POST' })
    // убрать из списка
    items.value = items.value.filter(i => i.id !== inv.id)
  } catch (e: any) {
    console.error('[invites] accept error', e)
    alert(e?.data?.detail || e?.message || 'Не удалось принять приглашение')
  } finally {
    delete actionBusy.value[inv.id]
  }
}
async function decline(inv: any) {
  if (!inv?.id) return
  actionBusy.value[inv.id] = 'decline'
  try {
    await $api(`/teams/invitation/${inv.id}/decline/`, { method: 'POST' })
    items.value = items.value.filter(i => i.id !== inv.id)
  } catch (e: any) {
    console.error('[invites] decline error', e)
    alert(e?.data?.detail || e?.message || 'Не удалось отклонить приглашение')
  } finally {
    delete actionBusy.value[inv.id]
  }
}

/** ====== Хелперы представления ====== */
function teamName(inv: any) {
  return inv?.team?.name || 'Без названия'
}
function teamTag(inv: any) {
  return inv?.team?.tag || ''
}
function teamLogo(inv: any) {
  const l = inv?.team?.logo
  if (!l) return null
  if (typeof l === 'string') return l
  return l.file || null
}
function roleLabel(r: string) {
  switch (r) {
    case 'MAIN_PLAYER': return 'Основной игрок'
    case 'SUBSTITUTE':  return 'Запасной'
    case 'COACH':       return 'Тренер'
    default:            return r || 'Игрок'
  }
}
function formatDate(iso?: string) {
  if (!iso) return ''
  try { return new Date(iso).toLocaleString('ru-RU') } catch { return '' }
}
function timeAgo(iso?: string) {
  if (!iso) return ''
  const t = new Date(iso).getTime()
  const s = Math.max(0, (Date.now() - t) / 1000)
  if (s < 60) return 'только что'
  if (s < 3600) return `${Math.floor(s/60)} мин назад`
  if (s < 86400) return `${Math.floor(s/3600)} ч назад`
  return new Date(iso).toLocaleDateString('ru-RU')
}

/** ====== init ====== */
await fetchPage(1)
</script>

<style>
@import './notifications.css';
@import './rate-team.css';

.state { text-align:center; margin: 20px 0; opacity:.8 }
.state.error { color:#e11d48 }
</style>
