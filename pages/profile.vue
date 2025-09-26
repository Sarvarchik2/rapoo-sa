<template>
  <div class="profile-page">
    <div v-if="pending" class="state">Загрузка…</div>
    <div v-else-if="error" class="state error">Не удалось загрузить профиль</div>

    <template v-else>
      <!-- ===== Верхняя карточка пользователя ===== -->
      <div class="profile-user-card">
        <div class="profile-user-avatar">
          <img :src="avatar || AvatarUserDefault" alt="User Avatar" />
        </div>
        <div class="profile-user-info">
          <h2 class="profile-user-name">{{ displayName }}</h2>
          <p class="profile-user-username" v-if="username">@{{ username }}</p>
          <p class="profile-user-date" v-if="createdAt">Дата регистрации: {{ createdAt }}</p>
        </div>

        <NuxtLink to="/settings" class="profile-user-edit" @click="goEdit">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M11.7167 7.51667L12.4833 8.28333L4.93333 15.8333H4.16667V15.0667L11.7167 7.51667ZM14.7167 2.5C14.5083 2.5 14.2917 2.58333 14.1333 2.74167L12.6083 4.26667L15.7333 7.39167L17.2583 5.86667C17.5833 5.54167 17.5833 5.01667 17.2583 4.69167L15.3083 2.74167C15.1417 2.575 14.9333 2.5 14.7167 2.5ZM11.7167 5.15833L2.5 14.375V17.5H5.625L14.8417 8.28333L11.7167 5.15833Z"
              fill="white" />
          </svg>
          Изменить
        </NuxtLink>
      </div>

      <!-- ===== Только для ORGANIZER: Мои турниры ===== -->
      <div v-if="isOrganizer" class="profile-sections profile-sections-organizer">
        <div class="profile-section profile-sections-organizer-wrapper">
          <div class="profile-section-title profile-section-title-organizer" style="display:flex;align-items:center;justify-content:space-between;">
            <h3 class="profile-section-title">Мои турниры</h3>
            <NuxtLink to="/create-tournament" class="profile-team-create profile-team-create2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="#4285F4" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              <span>Создать турнир</span>
            </NuxtLink>
          </div>

          <div v-if="myTournaments.length" class="profile-section-wrapper2">
            <div v-for="t in myTournaments" :key="t.id" class="profile-achievement-item">
              <div class="place-badge first">
                <img src="@/assets/main/kubokwhite.svg" alt="tournament" />
                <span>{{ formatTournamentFormat(t.format) }}</span>
              </div>
              <div class="profile-achievement-logo">
                <img 
                  v-if="getTournamentLogo(t.logo, t.banner)" 
                  :src="getTournamentLogo(t.logo, t.banner) || ''" 
                  :alt="t.name || 'tournament'" 
                  class="profile-achievement-logo-img"
                />
                <img 
                  v-else 
                  class="profile-achievement-logo-bg" 
                  src="@/assets/logo-team.svg" 
                  alt="default logo" 
                />
              </div>
              <div class="profile-achievement-text">
                <NuxtLink :to="`/mytournament/${t.id}`" class="profile-achievement-team">{{ t.name }}</NuxtLink>
                <span class="profile-achievement-tournament">
                  {{ formatTournamentDates(t.tournament_start, t.tournament_end) }} · {{ feeText(t) }}
                </span>
                <span class="profile-achievement-status" :class="getStatusClass(t.status)">
                  {{ formatTournamentStatus(t.status) }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="state">Пока нет турниров</div>
        </div>
      </div>

      <!-- ===== Все НЕ-организаторы ===== -->
      <div v-else class="profile-sections">
        <!-- Личные данные -->
        <div class="profile-section profile-personal-data">
          <h3 class="profile-section-title">Личные данные</h3>
          <p v-if="bio" style="opacity:.9">{{ bio }}</p>
          <p v-else class="state">Пока пусто</p>
        </div>

        <!-- Команда (верхний правый блок) -->
        <div class="profile-section profile-team">
          <h3 class="profile-section-title">Команда</h3>

          <template v-if="isInTeam">
            <div class="profile-is-in-team">
              <!-- левая часть: лого + название + тег + игра/состав -->
              <div class="profile-is-in-team-team">
           
                <div class="profile-is-in-team-text">
                  <h4>
                    {{ teamName || 'Моя команда' }}
                
                  </h4>
                  <span v-if="teamTag">
                      #{{ teamTag }}
                    </span>
                  <p v-if="primaryGame || membersCount">
                    {{ primaryGame || '—' }}<span v-if="membersCount">&nbsp;·&nbsp;{{ membersCount }} участника</span>
                  </p>
                </div>
                <div v-if="teamLogo" class="profile-is-in-team-logo">
                  <img :src="teamLogo" alt="team logo">
                </div>
              </div>

              <!-- правая часть: кнопки -->
                <NuxtLink v-if="isCaptain" to="/create-team" class="profile-team-create" title="Настройки команды">
                  Настройки
                </NuxtLink>

                <!-- кнопку «Покинуть команду» показываем ТОЛЬКО для обычного участника -->
                <button v-if="isMember && !isCaptain" type="button" class="profile-team-create" @click="leaveTeam"
                  title="Покинуть команду">
                  Покинуть команду
                </button>

            </div>
          </template>

          <template v-else>
            <NuxtLink to="/create-team" class="profile-team-create">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="#4285F4" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              <span>Создать команду</span>
            </NuxtLink>
          </template>
        </div>

        <!-- Достижения -->
        <div class="profile-section profile-achievements">
          <h3 class="profile-section-title">Достижения</h3>

          <div v-if="achievementsList.length" class="profile-achievements-list">
            <div v-for="(a, i) in achievementsList" :key="i" class="profile-achievement-item">
              <div class="place-badge first">
                <img src="@/assets/main/kubokwhite.svg" alt="Trophy" />
                <span>{{ a.place || '1st' }}</span>
              </div>
              <div class="profile-achievement-logo">
                <img class="profile-achievement-logo-bg" src="@/assets/logo-team.svg" alt="logo" />
              </div>
              <div class="profile-achievement-text">
                <span class="profile-achievement-team">{{ a.team_name || '—' }}</span>
                <span class="profile-achievement-tournament">{{ a.tournament || '—' }}</span>
              </div>
            </div>
          </div>
          <div v-else class="state">Пока нет достижений</div>
        </div>
      </div>

      <!-- ===== Игровые секции — только когда пользователь в команде ===== -->
      <template v-if="isInTeam">
        <div class="players-section">
          <h2 class="section-title">Моя команда</h2>

          <!-- бренд-командный блок -->
          <!-- <div style="display:flex; align-items:center; gap:12px; margin:8px 0 14px;">
            <div v-if="teamLogo" style="width:44px;height:44px;border-radius:10px;overflow:hidden;background:#0f1522;display:grid;place-items:center;">
              <img :src="teamLogo" alt="team logo" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <h3 style="margin:0;">{{ teamName || 'Моя команда' }}</h3>
                <span v-if="teamTag" style="padding:2px 8px;border-radius:999px;background:#111827;border:1px solid #334155;font-size:12px;">
                  #{{ teamTag }}
                </span>
              </div>
              <div style="opacity:.8; font-size:13px; margin-top:2px;">
                {{ primaryGame || '—' }}<span v-if="membersCount">&nbsp;·&nbsp;{{ membersCount }} участника</span>
              </div>
            </div>
          </div> -->

          <div class="players-grid">
            <div class="player-card" v-for="(p, i) in teammates" :key="p.id || i">
             

              <div class="player-avatar">
                <img :src="p.avatar || '/user.png'" :alt="p.username || 'player'" />
              </div>

              <div class="player-info">
                <span class="player-username">{{ p.username || '—' }}</span>
                <div class="player-badges">
                  <div class="badge verified" v-if="p.is_captain">
                    <img src="@/assets/icons/status.svg" alt="captain">
                  </div>
                </div>
              </div>

              <div class="player-stats">
                <div class="stat-pill">
                  <div class="stat-circle">
                    <svg class="stat-progress" width="24" height="24" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="#e0e0e0" stroke-width="2" fill="none" />
                      <circle cx="12" cy="12" r="10" stroke="#FF9800" stroke-width="2" fill="none"
                        stroke-dasharray="47.1" stroke-dashoffset="11.8" transform="rotate(-90 12 12)" />
                    </svg>
                  </div>
                  <span class="stat-value">{{ formatNumber(p.rating ?? 1440) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Интересные матчи (демо) -->
        <section class="main-interest">
          <h2>Интересные матчи</h2>
        </section>
      </template>
    </template>

    <!-- Модал передачи капитана и выхода -->
    <div v-if="leaveModalOpen" class="modal-backdrop" @click="!leaveLoading && (leaveModalOpen = false)">
      <div class="modal" @click.stop>
        <h3 class="modal-title">Передать капитана и выйти</h3>
        <p class="modal-text">Вы — капитан. Сначала передайте капитанство другому игроку, затем сможете выйти из
          команды.
        </p>

        <label class="settings-lbl" style="display:block; margin:12px 0;">
          Новый капитан
          <select v-model="newCaptainId" class="team-name-input" :disabled="leaveLoading" style="margin-top:8px;">
            <option :value="null" disabled>Выберите игрока</option>
            <option v-for="m in captainCandidates" :key="memberUUID(m) || m.id" :value="memberUUID(m)">
              {{ m.username || '—' }}
            </option>
          </select>
        </label>

        <div class="modal-actions">
          <button class="btn btn-secondary" :disabled="leaveLoading" @click="leaveModalOpen = false">Отмена</button>
          <button class="btn btn-danger" :disabled="leaveLoading || !newCaptainId" @click="confirmTransferAndLeave">
            {{ leaveLoading ? 'Обрабатываем…' : 'Передать и выйти' }}
          </button>
        </div>
      </div>
    </div>
    <!-- /Модал -->
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
import AvatarUserDefault from '@/assets/user.png'


import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const { $auth, $api } = useNuxtApp()

/** ===== загрузка профиля ===== */
const { data: raw, pending, error } = await useAsyncData('profile', () => $auth('/profile/'))
if (process.client) {
  watch(raw, v => { if (v) console.log('[profile] response', v) }, { immediate: true })
  watch(error, e => { if (e) console.error('[profile] error', e) }, { immediate: true })
}

/** ===== нормализация данных под разные типы ===== */
const profile = computed<any>(() => raw.value || null)
const profileType = computed<string>(() => profile.value?.profile_type || 'individual_user')

const baseData = computed<any>(() => {
  if (profileType.value === 'organizer') return profile.value?.user_profile || {}
  return profile.value?.data || {}
})
const baseUser = computed<any>(() => baseData.value?.user || {})

/** ===== шапка ===== */
const avatar = computed<string | null>(() => baseData.value?.avatar || null)
const username = computed<string | null>(() => baseUser.value?.username || null)
const displayName = computed(() => {
  const first = baseUser.value?.first_name || ''
  const last = baseUser.value?.last_name || ''
  const full = `${first} ${last}`.trim()
  return full || username.value || baseUser.value?.email || 'Пользователь'
})
const createdAt = computed(() => formatDate(baseData.value?.created_at))

/** ===== типы пользователя ===== */
const isOrganizer = computed(() => profileType.value === 'organizer')
const isCaptain = computed(() =>
  profileType.value === 'team_captain' || baseData.value?.is_team_captain === true
)
const isMember = computed(() =>
  profileType.value === 'team_member' || baseData.value?.is_team_member === true
)
const isInTeam = computed(() => isCaptain.value || isMember.value)

/** ===== статистика ===== */
const stats = computed(() => {
  if (isOrganizer.value) return { wins: 0, current_rating: 0 }
  const p = profile.value || {}
  const s1 = p.statistics || {}
  const s2 = p.team_statistics || {}
  const bd = baseData.value || {}
  const wins =
    (typeof s1.wins === 'number' ? s1.wins : undefined) ??
    (typeof s2.team_wins === 'number' ? s2.team_wins : undefined) ?? 0
  const rating =
    (typeof s1.current_rating === 'number' ? s1.current_rating : undefined) ??
    (typeof s1.individual_rating === 'number' ? s1.individual_rating : undefined) ??
    (typeof bd.current_rating === 'number' ? bd.current_rating : undefined) ?? 1440
  return { wins, current_rating: rating }
})

/** ===== данные НЕ-организатора ===== */
const bio = computed<string>(() => baseData.value?.bio || '')

/** ===== нормализуем команду ===== */
const team = computed<any>(() => {
  if (isCaptain.value) {
    const t = (profile.value?.captained_teams || [])[0]
    if (!t) return null

    const rawMembers = Array.isArray(t.members) ? t.members
      : Array.isArray(t.memberships) ? t.memberships
        : []

    const members = rawMembers.map((m: any) => ({
      id: m.user_id ?? m.id,
      username: m.username ?? m.display_name ?? '—',
      avatar: m.avatar ?? null,
      rating: typeof m.rating === 'number' ? m.rating : 1440,
      is_captain: !!(m.is_captain || /CAPTAIN/i.test(String(m.role || '')))
    }))

    return {
      id: t.team_id ?? t.id ?? null,
      name: t.team_name ?? t.name ?? 'Моя команда',
      tag: t.tag ?? t.team_tag ?? null,
      members,
      members_count: t.members_count ?? members.length,
      logo: t.logo?.file ?? t.logo ?? null,
      gameTitle: t.game?.title ?? t.game_type?.title ?? null,
    }
  }

  if (isMember.value) {
    // team_memberships[0] — вся команда
    const tm = (profile.value?.team_memberships || [])[0]
    if (!tm) return null

    const rawMembers = Array.isArray(tm.members)
      ? tm.members
      : (Array.isArray(tm.memberships) ? tm.memberships : [])

    const members = rawMembers.map((m: any) => ({
      id: m.user?.id ?? m.user_id ?? m.id,
      username: m.user?.username ?? m.username ?? m.display_name ?? '—',
      avatar: m.user?.avatar ?? m.avatar ?? null,
      rating: typeof m.rating === 'number' ? m.rating : 1440,
      is_captain: !!(m.is_captain || /CAPTAIN/i.test(String(m.role || ''))),
      joined_at: m.joined_at ?? m.joined_date ?? null,
    }))

    return {
      id: tm.id ?? tm.team_id ?? null,
      name: tm.name ?? tm.team_name ?? 'Моя команда',
      tag: tm.tag ?? tm.team_tag ?? null,
      members,
      members_count: tm.members_count ?? members.length,
      logo: (typeof tm.logo === 'object' ? tm.logo?.file : tm.logo) ?? null,
      gameTitle: tm.game_type?.title ?? tm.game?.title ?? null,
    }
  }

  return null
})

const teamName = computed<string | null>(() => team.value?.name ?? null)
const teamTag = computed<string | null>(() => team.value?.tag ?? null)
const teamLogo = computed<string | null>(() => team.value?.logo ?? null)
const teammates = computed<any[]>(() => team.value?.members ?? [])
const membersCount = computed<number>(() => team.value?.members_count ?? (teammates.value?.length ?? 0))
const primaryGame = computed<string | null>(() => team.value?.gameTitle ?? null)

/* достижения */
const achievementsList = computed<any[]>(() =>
  Array.isArray(profile.value?.achievements) ? profile.value.achievements : []
)

/** ===== organizer ===== */
const myTournaments = computed<any[]>(() =>
  Array.isArray(profile.value?.my_tournaments) ? profile.value.my_tournaments : []
)

/** ===== helpers для выхода/капитана ===== */
const currentUserId = computed<string | null>(() =>
  baseUser.value?.id || baseData.value?.user?.id || null
)
const UUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
function memberUUID(m: any): string | null {
  const c = [m?.id, m?.user_id, m?.user?.id].filter(Boolean)
  for (const x of c) { const s = String(x); if (UUID_RX.test(s)) return s }
  return null
}

/** ===== UI ===== */
const activePlayerMenu = ref<number | null>(null)
function togglePlayerMenu(i: number) { activePlayerMenu.value = activePlayerMenu.value === i ? null : i }
function goEdit() { /* роут на /settings или др. */ }

/** ===== модал передачи капитана/выход ===== */
const leaveModalOpen = ref(false)
const leaveLoading = ref(false)
const newCaptainId = ref<string | null>(null)
const captainCandidates = computed(() =>
  (teammates.value || []).filter(m => memberUUID(m) && memberUUID(m) !== currentUserId.value)
)

function leaveTeam() {
  if (isCaptain.value) {
    if (!captainCandidates.value.length) {
      alert('Невозможно выйти: назначьте нового капитана (в команде должен быть ещё хотя бы один игрок)')
      return
    }
    newCaptainId.value = null
    leaveModalOpen.value = true
  } else {
    leaveAsMember()
  }
}

async function leaveAsMember() {
  leaveLoading.value = true
  try {
    await $api('/teams/leave/', { method: 'POST' })
    if (process.client) router.go(0)
  } finally {
    leaveLoading.value = false
  }
}

async function confirmTransferAndLeave() {
  if (!newCaptainId.value) return
  leaveLoading.value = true
  try {
    // 1) передаём капитана
    await $api(`/teams/capitain/${encodeURIComponent(newCaptainId.value)}/change/`, {
      method: 'PATCH',
      body: {} // по вашей схеме тело не требуется
    })
    // 2) выходим из команды
    await $api('/teams/leave/', { method: 'POST' })
    leaveModalOpen.value = false
    if (process.client) router.go(0)
  } catch (e: any) {
    console.error('[captain leave] error', e)
    alert(e?.data?.detail || e?.message || 'Не удалось передать капитана/выйти')
  } finally {
    leaveLoading.value = false
  }
}

/** ===== утилиты ===== */
function feeText(t: any) {
  if (!t) return ''
  const fee = t.entry_fee
  const cur = t.entry_fee_currency || ''
  if (fee === '0' || fee === '0.00' || Number(fee) === 0) return 'Free'
  return `${fee}${cur ? ' ' + cur : ''}`
}
function formatDate(iso?: string | null) {
  if (!iso) return ''
  try { return new Date(iso).toLocaleDateString('ru-RU') } catch { return '' }
}
function formatNumber(n: number) {
  try { return new Intl.NumberFormat('ru-RU').format(n ?? 0) } catch { return String(n ?? 0) }
}

/** ===== турнирные утилиты ===== */
function getTournamentLogo(logoLike: any, fallbackBanner?: any) {
  // Поддержка разных форматов из API
  // 1) Объект { file: 'https://...' }
  if (logoLike && typeof logoLike === 'object') {
    if (typeof logoLike.file === 'string' && logoLike.file.startsWith('http')) return logoLike.file
    if (typeof logoLike.url === 'string' && logoLike.url.startsWith('http')) return logoLike.url
  }
  // 2) Прямая строка-URL
  if (typeof logoLike === 'string' && /^https?:\/\//i.test(logoLike)) return logoLike
  // 3) Fallback: баннер, если передан
  if (fallbackBanner && typeof fallbackBanner === 'object' && typeof fallbackBanner.file === 'string') {
    return fallbackBanner.file
  }
  // 4) Числовые идентификаторы больше не используем без явного эндпоинта хранения
  return null
}

function formatTournamentFormat(format: string) {
  const formatMap: Record<string, string> = {
    'SINGLE_ELIMINATION': 'Single Elim',
    'DOUBLE_ELIMINATION': 'Double Elim',
    'ROUND_ROBIN': 'Round Robin',
    'SWISS': 'Swiss',
    'BRACKET': 'Bracket'
  }
  return formatMap[format] || format || '—'
}

function formatTournamentDates(startDate: string, endDate: string) {
  if (!startDate) return '—'
  try {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : null
    
    const startStr = start.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit',
      year: '2-digit'
    })
    
    if (!end || start.getTime() === end.getTime()) {
      return startStr
    }
    
    const endStr = end.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit',
      year: '2-digit'
    })
    
    // Если в том же году, показываем только даты
    if (start.getFullYear() === end.getFullYear()) {
      return `${startStr} - ${endStr}`
    }
    
    return `${startStr} - ${endStr}`
  } catch {
    return '—'
  }
}

function formatTournamentStatus(status: string) {
  const statusMap: Record<string, string> = {
    'REGISTRATION_OPEN': 'Регистрация открыта',
    'REGISTRATION_CLOSED': 'Регистрация закрыта',
    'IN_PROGRESS': 'Идёт турнир',
    'COMPLETED': 'Завершён',
    'CANCELLED': 'Отменён',
    'UPCOMING': 'Скоро'
  }
  return statusMap[status] || status || '—'
}

function getStatusClass(status: string | null) {
  if (!status) return 'status-default'
  const classMap: Record<string, string> = {
    'REGISTRATION_OPEN': 'status-open',
    'REGISTRATION_CLOSED': 'status-closed',
    'IN_PROGRESS': 'status-active',
    'COMPLETED': 'status-completed',
    'CANCELLED': 'status-cancelled',
    'UPCOMING': 'status-upcoming'
  }
  return classMap[status] || 'status-default'
}
</script>

<style>
@import './profile.css';
@import './match/[tournamentId]/match.css';
@import './create-team.css';
@import './rate-player.css';

.state {
  text-align: center;
  margin: 20px 0;
  opacity: .8
}

.state.error {
  color: #e11d48
}

/* Стили для логотипов турниров */
.profile-achievement-logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* Стили для статусов турниров */
.profile-achievement-status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  margin-top: 4px;
}

.status-open {
  background: #dcfce7;
  color: #166534;
}

.status-closed {
  background: #fef3c7;
  color: #92400e;
}

.status-active {
  background: #dbeafe;
  color: #1e40af;
}

.status-completed {
  background: #e5e7eb;
  color: #374151;
}

.status-cancelled {
  background: #fee2e2;
  color: #dc2626;
}

.status-upcoming {
  background: #f3e8ff;
  color: #7c3aed;
}

.status-default {
  background: #f1f5f9;
  color: #64748b;
}
@media (max-width: 520px) {
  .profile-section-title-organizer{
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
