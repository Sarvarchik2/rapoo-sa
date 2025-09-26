<!-- pages/tournaments-more/[id].vue -->
<script setup lang="ts" async>
import { ref, computed, onMounted, nextTick, watchEffect } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'
import { useAuth } from '~/composables/useAuth'

/* ---------------- base/auth ---------------- */
const route = useRoute()
const config = useRuntimeConfig()
const { user, access, isAuthenticated } = useAuth()
const nuxtApp = useNuxtApp()

const API_BASE = (config.public?.apiBase as string) || 'http://localhost:8000/api/v1'

const authHeaders = computed(() =>
  access.value ? ({ Authorization: `Bearer ${access.value}` }) : ({} as Record<string, string>)
)
async function $req<T>(url: string, opts: any = {}) {
  const final = { ...opts, headers: { ...(opts.headers || {}), ...authHeaders.value } }
  return await $fetch<T>(url, final)
}
async function tryReq<T>(urls: string[], opts: any = {}) {
  let last: any = null
  for (const u of urls) {
    try { return await $req<T>(u, opts) } catch (e: any) { last = e }
  }
  throw last
}

/* ---------------- types ---------------- */
type FileObj = { id: number; file?: string; path?: string | null }
type Game = { id: number; title?: string }
type Tournament = {
  id: number; name: string; status?: string; format?: string; game?: Game; banner?: FileObj;
  tournament_start?: string; tournament_end?: string; total_prize_pool?: string | number;
  location?: { name?: string } | string; venue?: string;
  organizer?: { user?: { id?: number | string | null } } | null;
  organizer_id?: number | string | null;
}
type Team = { id: number; name: string; logo?: FileObj }
type ParticipantItem = { id: number; team: Team }
type Paginated<T> = { count: number; next: string | null; previous: string | null; results: T[] }

/* ---------------- state ---------------- */
const loading = ref(true)
const error = ref<string | null>(null)
const hydrated = ref(false)
const t = ref<Tournament | null>(null)
const participants = ref<ParticipantItem[]>([])

/* ---------- PROFILE (важно для «присоединиться») ---------- */
const profile = ref<any>(null)
async function fetchProfile() {
  if (!isAuthenticated.value) { profile.value = null; return null }
  try { profile.value = await nuxtApp.$auth('/profile/') } catch { profile.value = null }
  return profile.value
}

/* ---------------- helpers ---------------- */
function fileToUrl(f?: FileObj | string | number): string | null {
  if (!f) return null
  if (typeof f === 'string') return /^https?:\/\//.test(f) ? f : `${API_BASE}${f}`
  if (typeof f === 'number') return null
  const raw = f.file ?? f.path
  return raw ? (/^https?:\/\//.test(raw) ? raw : `${API_BASE}${raw}`) : null
}
const money = (v?: string | number) => {
  if (v == null) return '—'
  const n = typeof v === 'string' ? Number(v) : v
  return Number.isFinite(n) ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n) : String(v)
}
const fmtDate = (s?: string) =>
  s ? new Date(s).toLocaleDateString('ru-RU', { timeZone: 'Asia/Tashkent' }) : null

/* ---------------- derived ---------------- */
const bannerUrl = computed(() => fileToUrl(t.value?.banner) || 'https://via.placeholder.com/1200x400?text=Tournament')
const nameText = computed(() => t.value?.name || 'Без названия')
const subTitleText = computed(() => t.value?.game?.title || 'Турнир')
const statusText = computed(() => String(t.value?.status || '').toUpperCase())
const formatText = computed(() => String(t.value?.format || '').toUpperCase())

/* инфо-блоки: дата, место, призовой */
const startText = computed(() => fmtDate(t.value?.tournament_start))
const endText = computed(() => fmtDate(t.value?.tournament_end))
const dateRangeText = computed(() => {
  const s = startText.value, e = endText.value
  if (!s && !e) return 'Дата уточняется'
  if (s && e) return `${s} — ${e}`
  return s || e || 'Дата уточняется'
})
const prizeText = computed(() =>
  `${money(t.value?.total_prize_pool)}${t.value?.total_prize_pool ? ' $' : ''}`
)
const locationText = computed(() =>
  (typeof t.value?.location === 'string'
    ? t.value?.location
    : t.value?.location?.name) || t.value?.venue || 'Узбекистан, Ташкент'
)

/* ---------------- participants ---------------- */
async function fetchParticipants(tid: number | string) {
  const url = `${API_BASE}/tournaments/page/${tid}/participants/`
  const data = await $req<Paginated<ParticipantItem>>(url)
  console.groupCollapsed('[API][PARTICIPANTS]', url); console.log(data); console.groupEnd()
  participants.value = data?.results || []
}
const teamLogoById = computed(() => {
  const m = new Map<number, string>()
  for (const p of participants.value) {
    const id = Number(p.team?.id)
    const logo = fileToUrl(p.team?.logo)
    if (id && logo) m.set(id, logo)
  }
  return m
})

/* ---------------- details ---------------- */
async function fetchDetails(tid: string) {
  const urls = [
    `${API_BASE}/tournaments/page/${tid}/details/`,
    `${API_BASE}/tournaments/${tid}/`,
  ]
  const raw: any = await tryReq(urls)
  console.groupCollapsed('[API][DETAILS]'); console.log(raw); console.groupEnd()
  t.value = Array.isArray(raw?.results) ? (raw.results[0] || null) : raw
}

/* ---------------- bracket ---------------- */
const bracketRaw = ref<any | null>(null)
async function fetchBracket(tid: number | string) {
  const url = `${API_BASE}/tournaments/page/${tid}/bracket/`
  const raw: any = await $req(url)
  console.groupCollapsed('[API][BRACKET]', url); console.log(raw); console.groupEnd()
  bracketRaw.value = raw
}

type RoundItem = { round_name: string; matches: any[] }
const bracket = computed(() => bracketRaw.value?.data?.bracket || bracketRaw.value?.bracket || null)
const roundsRaw = computed(() => bracket?.value?.rounds)

function normalizeTeam(x: any) {
  if (!x) return null
  if (typeof x === 'string') {
    if (x.toUpperCase() === 'TBD') return null
    return { id: null, name: x, logo_url: null }
  }
  if (typeof x === 'object') {
    return {
      id: x.id ?? x.team_id ?? x.team?.id ?? null,
      name: x.name ?? x.team?.name ?? null,
      logo_url: x.logo_url ?? x.logo?.file ?? x.logo?.path ?? x.logo ?? null
    }
  }
  return null
}

function normalizeRounds(r: any): RoundItem[] {
  if (Array.isArray(r)) {
    return r.map((R: any) => ({
      round_name: R.round_name || R.name || '',
      matches: (Array.isArray(R.matches) ? R.matches : []).map((m: any) => ({
        id: m.id ?? m.match_id ?? m.matchId ?? null,
        match_number: m.match_number ?? m.number ?? null,
        team1: normalizeTeam(m.team1),
        team2: normalizeTeam(m.team2),
        winner: m.winner ?? null,
        status: m.status ?? null
      }))
    }))
  }
  if (r && typeof r === 'object') {
    const order = ['WB Semi Final', 'WB Final', 'Semi Final', 'Final', 'Grand Final'] as const
    const entries = Object
      .entries(r as Record<string, unknown>)
      .map(([k, v]) => [k, Array.isArray(v) ? (v as any[]) : []] as [string, any[]])
      .sort((a, b) => order.indexOf(a[0] as any) - order.indexOf(b[0] as any))
    return entries.map(([round_name, arr]) => ({
      round_name,
      matches: arr.map((m: any) => ({
        id: m?.id ?? m?.match_id ?? null,
        match_number: m?.match_number ?? null,
        team1: normalizeTeam(m?.team1),
        team2: normalizeTeam(m?.team2),
        winner: m?.winner ?? null,
        status: m?.status ?? null
      }))
    }))
  }
  return []
}
const rounds = computed<RoundItem[]>(() => normalizeRounds(roundsRaw.value))

/* ---------------- UI mapping for S-4 ---------------- */
type TeamUI = { name?: string | null; logo?: string | null }
type MatchUI = { id?: number | null; status?: string | null; t1: TeamUI; t2: TeamUI }

function toTeamUI(x: any): TeamUI {
  if (!x) return {}
  const id = Number((x.id ?? x.team_id ?? null) as any)
  const logoRaw = x.logo_url ?? x.logo?.file ?? x.logo?.path ?? x.logo ?? null
  const logo = logoRaw ? fileToUrl(logoRaw) : (Number.isFinite(id) ? (teamLogoById.value.get(id) || null) : null)
  return { name: x.name ?? x.team?.name ?? null, logo }
}

const semiUI = computed<MatchUI[]>(() => {
  const firstRound = rounds.value?.[0]
  const arr = Array.isArray(firstRound?.matches) ? firstRound.matches : []
  return [0, 1].map(i => {
    const m: any = arr[i] || {}
    return { id: m.id ?? null, status: m.status ?? null, t1: toTeamUI(m.team1), t2: toTeamUI(m.team2) }
  })
})

const finalUI = computed<MatchUI>(() => {
  const fr = rounds.value?.[1]
  const m: any = Array.isArray(fr?.matches) && fr!.matches.length ? fr!.matches[0] : {}
  return { id: m.id ?? null, status: m.status ?? null, t1: toTeamUI(m.team1), t2: toTeamUI(m.team2) }
})

const winnerUI = computed<TeamUI>(() => {
  // 1) Победитель из API, если доступен
  const w =
    (bracketRaw.value?.data?.tournament?.winner) ||
    (bracketRaw.value?.tournament?.winner) ||
    (t.value as any)?.tournament?.winner ||
    (t.value as any)?.winner

  if (w && typeof w === 'object') {
    const name = w.name || w.team_name || null
    const rawLogo = (w.logo && (w.logo.file || w.logo.path || w.logo)) || w.avatar || null
    const logo = rawLogo ? fileToUrl(rawLogo) : null
    if (name || logo) return { name, logo }
  }

  // 2) Fallback: на основе финального матча
  const fr = rounds.value?.[1]
  const m: any = Array.isArray(fr?.matches) && fr!.matches.length ? fr!.matches[0] : null
  const wv = (m && m.winner) ? String(m.winner).toUpperCase() : ''
  if (wv === 'TEAM1' || wv === '1') return toTeamUI(m?.team1)
  if (wv === 'TEAM2' || wv === '2') return toTeamUI(m?.team2)
  return { name: null, logo: null }
})

/* SINGLE / 4 detection */
const isSingle4Ready = computed(() => {
  const fmt = formatText.value || String(bracket.value?.format || '').toUpperCase()
  if (!fmt.includes('SINGLE')) return false
  const tm = Number(bracket.value?.total_matches ?? 0)
  const rp = rounds.value.length
  const cp = Number(bracketRaw.value?.data?.tournament?.current_participants ?? 0)
  const mx = Number(bracketRaw.value?.data?.tournament?.max_teams ?? 0)
  return (tm === 3) || (rp === 2) || (cp === 4) || (mx === 4) || (participants.value.length === 4)
})

/* ---------------- join / profile ---------------- */
/* Команды, которыми вы капитан (из профиля) */
function asNumber(x: any) { return x == null ? null : Number(x) }
function getCaptainTeamsFromProfile(p: any) {
  const arr = [
    ...(Array.isArray(p?.captained_teams) ? p.captained_teams : []),
    ...(Array.isArray(p?.data?.captained_teams) ? p.data.captained_teams : []),
  ]
  return arr.map((it: any) => {
    const id =
      asNumber(it?.id) ??
      asNumber(it?.team_id) ??
      asNumber(it?.team?.id)
    const name = it?.team?.name || it?.name || (id != null ? `Команда #${id}` : 'Команда')
    return (id != null) ? { id, name } : null
  }).filter(Boolean) as { id: number; name: string }[]
}
const captainTeams = computed(() => getCaptainTeamsFromProfile(profile.value || {}))
const selectedTeamId = ref<string | number | null>(null)

watchEffect(() => {
  const arr = captainTeams.value || []
  if (!selectedTeamId.value && arr.length) {
    selectedTeamId.value = arr[0]?.id as any
  }
})

const isCaptain = computed(() => {
  const p = profile.value || {}
  const pt = String(p?.profile_type || p?.data?.profile_type || '').toLowerCase()
  const flag = p?.data?.is_team_captain === true
  return captainTeams.value.length > 0 || flag || pt.includes('captain')
})

const registrationOpen = computed(() => {
  if (statusText.value) {
    if (['REGISTRATION_OPEN', 'OPEN', 'UPCOMING'].some(s => statusText.value.includes(s))) return true
    if (['REGISTRATION_CLOSED', 'CLOSED', 'STARTED', 'ACTIVE', 'LIVE', 'IN_PROGRESS'].some(s => statusText.value.includes(s))) return false
  }
  const ts = t.value?.tournament_start
  return !ts || new Date() < new Date(ts)
})

/* Участвует ли уже какая-либо из моих капитанских команд */
const isAlreadyJoined = computed(() => {
  if (!participants.value?.length) return false
  const ids = new Set(captainTeams.value.map(t => t.id))
  return participants.value.some(p => ids.has(Number(p.team?.id)))
})

const showJoinButton = computed(() =>
  hydrated.value &&
  isAuthenticated.value &&
  registrationOpen.value &&
  !isAlreadyJoined.value &&
  !isFull.value
)

const canSubmitJoin = computed(() =>
  isAuthenticated.value && registrationOpen.value && !!selectedTeamId.value && !isAlreadyJoined.value
)

const submitting = ref(false); const submitErr = ref<string | null>(null)

function asTeamId(v: unknown) {
  const n = Number(v)
  return Number.isFinite(n) ? n : v // '12' → 12, UUID остаётся строкой
}

async function onRegisterClick() {
  if (!t.value?.id) return
  if (!selectedTeamId.value) { alert('Выберите команду'); return }

  submitting.value = true; submitErr.value = null
  try {
    const body = {
      tournament: Number(t.value.id),
      team: asTeamId(selectedTeamId.value),   // <-- важно
      registration_message: 'Заявка от капитана',
      payment_reference: ''
    }
    const url = `${API_BASE}/tournaments/actions/register/`
    const res: any = await $req(url, { method: 'POST', body })
    console.groupCollapsed('[API][REGISTER]'); console.log(res); console.groupEnd()
    await fetchParticipants(t.value.id)
    alert('Заявка отправлена!')
  } catch (e: any) {
    submitErr.value = e?.data?.detail || e?.message || 'Не удалось отправить заявку'
    alert(submitErr.value)
  } finally {
    submitting.value = false
  }
}

/* заполненность турнира */
const maxTeams = computed<number | null>(() => {
  const b = bracketRaw.value?.data?.tournament
  const direct = (t.value as any)?.max_teams
  const n = Number(b?.max_teams ?? direct)
  return Number.isFinite(n) ? n : null
})
const isFull = computed(() => {
  if (!maxTeams.value) return false
  return participants.value.length >= maxTeams.value
})


/* ---------------- start tour ---------------- */
const ALLOW_START = new Set(['REGISTRATION_CLOSED', 'READY', 'SCHEDULED'])
const isOrganizer = computed(() => {
  const u: any = user.value || {}
  const role = String(u?.user_role || u?.role || '').toUpperCase()
  const flags = [u?.data?.is_organizer, u?.is_organizer, u?.profile?.is_organizer].some(Boolean)
  const ownerMatch =
    (!!(t.value as any)?.organizer?.user?.id && (t.value as any).organizer.user.id === u?.id) ||
    (!!(t.value as any)?.organizer_id && (t.value as any).organizer_id === u?.id)
  return role.includes('ADMIN') || role.includes('STAFF') || role.includes('ORGANIZER') || flags || !!ownerMatch
})
const isStarted = computed(() => {
  const s = statusText.value
  return ['STARTED', 'ACTIVE', 'ONGOING', 'IN_PROGRESS', 'LIVE'].includes(s) || (Array.isArray(rounds.value) && rounds.value.length > 0 && s !== 'REGISTRATION_OPEN')
})
const formatDisplay = computed(() => {
  const f = t.value?.format
  if (f === 'SINGLE_ELIMINATION') return 'Одиночное выбытие'
  if (f === 'DOUBLE_ELIMINATION') return 'Двойное выбытие'
  return f || 'Не указан'
})
const showStartButton = computed(() => isOrganizer.value && !isStarted.value && ALLOW_START.has(statusText.value))
const canStart = computed(() => showStartButton.value && participants.value.length >= 2)
const startHint = computed(() => {
  if (!ALLOW_START.has(statusText.value)) return 'Старт доступен после закрытия регистрации'
  if (isStarted.value) return 'Турнир уже запущен'
  if (participants.value.length < 2) return 'Нужно минимум 2 участника'
  return 'Готово к старту'
})
const starting = ref(false); const startOk = ref(false); const startErr = ref<string | null>(null)
async function onStart() {
  if (!t.value?.id) return
  starting.value = true; startOk.value = false; startErr.value = null
  try {
    const url = `${API_BASE}/tournaments/actions/${t.value.id}/start/`
    const res: any = await $req(url, { method: 'POST', body: {} })
    console.groupCollapsed('[API][START]'); console.log(res); console.groupEnd()
    startOk.value = true
    await Promise.all([fetchDetails(String(t.value.id)), fetchParticipants(t.value.id), fetchBracket(t.value.id)])
  } catch (e: any) {
    startErr.value = e?.data?.detail || e?.message || 'Не удалось запустить турнир'
  } finally {
    starting.value = false
  }
}

/* ---------------- init ---------------- */
const id = route.params.id as string
try {
  // сначала профиль — чтобы сразу знать команды/капитана
  await fetchProfile()

  await fetchDetails(id)
  if (t.value?.id) {
    await Promise.all([
      fetchParticipants(t.value.id),
      fetchBracket(t.value.id),
    ])
  }
} catch (e: any) {
  error.value = e?.message || 'Ошибка при загрузке'
} finally {
  loading.value = false
}
onMounted(() => { hydrated.value = true; nextTick(() => { }) })

onMounted(() => {
  console.log('[JOIN STATE]', {
    isAuthenticated: isAuthenticated.value,
    isCaptain: isCaptain.value,
    registrationOpen: registrationOpen.value,
    isAlreadyJoined: isAlreadyJoined.value,
    captainTeams: captainTeams.value,
    selectedTeamId: selectedTeamId.value,
  })
})
</script>

<template>
  <div class="tournaments-more">
    <NuxtLink class="tournaments-more-back" to="/tournaments">
      <img src="@/assets/footer/right.svg" alt="arrow-left" />
      Назад
    </NuxtLink>

    <div v-if="loading" class="state">Загрузка…</div>
    <div v-else-if="error" class="state error">Ошибка: {{ error }}</div>

    <template v-else>
      <div class="tournament-main-card">
        <div class="tournament-main-image">
          <img :src="bannerUrl" :alt="nameText" />
          <div class="tournament-main-overlay">
            <div class="tournament-main-text">
              <h1>{{ nameText }}</h1>
              <h2>{{ subTitleText }}</h2>
            </div>
          </div>
        </div>
      </div>

      <!-- Инфо-блоки (дата, призовой, место) -->
      <div class="tournament-info-blocks">
        <div class="info-block">
          <div class="info-content">
            <div class="info-text">
              <h3>Дата проведения:</h3>
              <p>{{ dateRangeText }}</p>
            </div>
            <div class="info-icon"><img src="@/assets/icons/navbar/calendar.svg" alt="calendar" /></div>
          </div>
        </div>

        <div class="info-block">
          <div class="info-content">
            <div class="info-text">
              <h3>Призовой фонд:</h3>
              <p>{{ prizeText }}</p>
            </div>
            <div class="info-icon"><img src="@/assets/icons/navbar/kubok.svg" alt="trophy" /></div>
          </div>
        </div>

        <div class="info-block">
          <div class="info-content">
            <div class="info-text">
              <h3>Место проведения:</h3>
              <p>{{ locationText }}</p>
            </div>
            <div class="info-icon"><img src="@/assets/icons/navbar/map.svg" alt="location" /></div>
          </div>
        </div>
      </div>

      <!-- Панель статуса и старта -->
      <div class="t-summary">
        <div class="t-summary__start" v-if="showStartButton">
          <button class="t-start-btn" :disabled="starting || !canStart" @click="onStart"
            :title="!canStart ? startHint : 'Начать турнир'">
            {{ starting ? 'Запускаем…' : (isStarted ? 'Турнир запущен' : 'Начать турнир') }}
          </button>
          <div v-if="startOk" class="t-note t-note--ok">Сетка сгенерирована ✅</div>
          <div v-if="startErr" class="t-note t-note--err">Ошибка: {{ startErr }}</div>
        </div>
      </div>

      <!-- Сетка -->
      <div class="main-title-wrap">
        <h2>Турнирная сетка</h2>
      </div>
      <div v-if="!isStarted || !rounds.length" class="bracket-placeholder">
        <div class="bracket-placeholder-content">
          <div class="bracket-placeholder-icon">🏆</div>
          <h3>Сетка еще не сгенерирована</h3>
          <p>Формат турнира: <strong>{{ formatDisplay }}</strong></p>
          <p>Сетка появится после запуска турнира организатором.</p>
        </div>
      </div>
      <div v-else-if="t?.format === 'SINGLE_ELIMINATION' && rounds.length > 0">
        <TurnamentSingelCsGo 
          :endpoint="`${API_BASE}/tournaments/page/${t?.id || id}/bracket/`" 
          :tournamentId="t?.id || id" 
          clickAction="navigate"
          :key="`single-${t?.id}`" 
        />
      </div>
      <div v-else-if="t?.format === 'DOUBLE_ELIMINATION' && rounds.length > 0">
        <TurnamentDouble 
          :endpoint="`${API_BASE}/tournaments/page/${t?.id || id}/bracket/`" 
          :tournamentId="t?.id || id" 
          clickAction="navigate"
          :key="`double-${t?.id}`" />
      </div>
      <div v-else class="tournaments-teams-empty">Формат турнира не поддерживается.</div>

      <!-- Участники -->
      <div class="main-title-wrap">
        <h2>Участники ({{ participants.length }})</h2>
      </div>
      <div v-if="participants.length" class="tournaments-teams">
        <div class="tournaments-teams-item" v-for="p in participants" :key="p.id">
          <img :src="fileToUrl(p.team.logo) || 'https://via.placeholder.com/120x120?text=Logo'" :alt="p.team.name" />
          <h2>{{ p.team.name }}</h2>
        </div>
      </div>
      <div v-else class="tournaments-teams-empty">Пока нет участников.</div>

      <ClientOnly v-if="!isOrganizer">
        <div class="participants-actions">
          <div v-if="isAlreadyJoined" class="note ok">Ваша команда уже участвует ✅</div>
          <div v-else-if="isFull" class="note">Набор завершён — все места заняты</div>

          <template v-else-if="registrationOpen">
            <div v-if="isAuthenticated" style="display:flex;flex-direction:column;gap:8px;align-items:center">
              <!-- Выбор команды, если их несколько -->
              <select v-if="captainTeams.length > 1" v-model="selectedTeamId" class="t-input" style="min-width:260px">
                <option v-for="ct in captainTeams" :key="ct.id" :value="ct.id">
                  {{ ct.name }}
                </option>
              </select>

              <button class="broadcast-register-btn" :disabled="submitting || !canSubmitJoin" @click="onRegisterClick"
                :title="!selectedTeamId ? 'Выберите команду' : 'Подать заявку на участие'">
                {{ submitting ? 'Отправляем…' : 'Присоединиться' }}
              </button>

              <div v-if="!isCaptain" class="note">
                Ваш профиль не отмечен как капитан — заявка может быть отклонена организатором.
              </div>
            </div>

            <NuxtLink v-else class="broadcast-register-btn" to="/login">
              Войти, чтобы присоединиться
            </NuxtLink>

            <!-- исправил битый роут -->
            <div v-if="isAuthenticated && captainTeams.length === 0" class="note" style="margin-top:8px;">
              Нет команды для подачи заявки. <NuxtLink to="/create-team">Создать команду</NuxtLink>
            </div>
          </template>

          <div v-else class="note">Регистрация закрыта</div>
        </div>
      </ClientOnly>
    </template>
  </div>
</template>

<style scoped>
@import './tournaments-more.css';

.state {
  padding: 16px;
  opacity: .8
}

.state.error {
  color: #ff6262
}

.t-summary {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
  margin: 12px 0
}

.t-summary__start {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px
}

.t-start-btn {
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  background: var(--bg-blue);
  color: #fff;
  border: none;
  cursor: pointer
}

.t-start-btn[disabled] {
  opacity: .5;
  cursor: not-allowed
}

.t-note {
  font-size: 14px
}

.t-note--ok {
  color: #16a34a
}

.t-note--err {
  color: #ef4444
}

.tournaments-teams-empty {
  opacity: .8;
  padding: 12px 0;
  width: 100%;
  text-align: center;
  background: var(--bg-blue);
  color: #fff;
  border-radius: 10px;
}

.participants-actions {
  margin: 12px 0 20px;
  width: 100%;
  text-align: center;
}

.note {
  display: flex;
  justify-content: center;
  padding: 12px 0;
  width: 100%;
  text-align: center;
  background: var(--bg-blue);
  color: #fff;
  border-radius: 10px;
}

.bracket-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 15px;
  margin: 20px 0;
  border: 2px dashed #cbd5e0;
}

.bracket-placeholder-content {
  text-align: center;
  color: #4a5568;
}

.bracket-placeholder-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.bracket-placeholder-content h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.bracket-placeholder-content p {
  font-size: 1rem;
  margin: 0.5rem 0;
  color: #718096;
}

.bracket-placeholder-content strong {
  color: #3182ce;
}
</style>
