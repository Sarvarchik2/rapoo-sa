<template>
  <div class="t-page">
    <NuxtLink to="/tournaments" class="t-back">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M15 10H5M5 10L10 5M5 10L10 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
      Назад
    </NuxtLink>

    <div class="t-tabs" :style="{ '--tab-left': tabLeft + 'px', '--tab-w': tabW + 'px' }">
      <button ref="tab0" :class="['t-tab', { active: activeTab === 'grid' }]" @click="setTab('grid')">Сетка</button>
      <button ref="tab1" :class="['t-tab', { active: activeTab === 'participants' }]"
        @click="setTab('participants')">Участники</button>
      <button ref="tab2" :class="['t-tab', { active: activeTab === 'settings' }]"
        @click="setTab('settings')">Настройки</button>
      <span class="t-tabs__indicator"></span>
    </div>

    <!-- Сводка + Старт турнира -->
    <div class="t-summary">
      <div class="t-summary__item">
        <div class="t-summary__label">Участники</div>
        <div class="t-summary__val">{{ participants.length }}</div>
      </div>
      <div class="t-summary__item">
        <div class="t-summary__label">Формат</div>
        <div class="t-summary__val">{{ formatLabel }}</div>
      </div>
      <div class="t-summary__item">
        <div class="t-summary__label">Игра</div>
        <div class="t-summary__val">{{ gameTitle }}</div>
      </div>
      <div class="t-summary__item">
        <div class="t-summary__label">Время</div>
        <div class="t-summary__val">{{ startDate }}&nbsp;&nbsp;{{ startTime }}</div>
      </div>
      <!-- <div class="t-summary__item"><div class="t-summary__label">Место</div><div class="t-summary__val">{{ locationText }}</div></div> -->
      <div class="t-summary__item">
        <div class="t-summary__label">Призовой фонд</div>
        <div class="t-summary__val">{{ prizeText }}</div>
      </div>
      <!-- <div class="t-summary__item"><div class="t-summary__label">Организатор</div><div class="t-summary__val">{{ organizer }}</div></div> -->

      <div class="t-summary__start" v-if="showStartButton">
        <button class="t-start-btn" :disabled="starting || !canStart" @click="onStart"
          :title="!canStart ? startHint : 'Сгенерировать сетку и запустить турнир'">
          {{ starting ? 'Запускаем…' : (isStarted ? 'Турнир запущен' : 'Начать турнир') }}
        </button>
        <div v-if="startOk" class="t-note t-note--ok">Сетка сгенерирована ✅</div>
        <div v-if="startErr" class="t-note t-note--err">Ошибка: {{ startErr }}</div>
      </div>
    </div>

    <div class="t-content">
      <section v-show="activeTab === 'grid'">
        <div class="main-title-wrap">
          <h2>Турнирная сетка</h2>
        </div>
        <div v-if="!isStarted || !bracketRounds.length" class="bracket-placeholder">
          <div class="bracket-placeholder-content">
            <div class="bracket-placeholder-icon">🏆</div>
            <h3>Сетка еще не сгенерирована</h3>
            <p>Формат турнира: <strong>{{ formatDisplay }}</strong></p>
            <p>Сетка появится после запуска турнира организатором.</p>
          </div>
        </div>
        <div v-else-if="fmt === 'SINGLE_ELIMINATION' && bracketRounds.length > 0">
          <TurnamentSingelCsGo 
            :endpoint="`${API_BASE}/tournaments/page/${id || route.params.id}/bracket/`" 
            :tournamentId="id || route.params.id" 
            clickAction="popup"
            :adminControls="isOrganizer"
            :key="`single-${id || route.params.id}`" 
          />
        </div>
        <div v-else-if="fmt === 'DOUBLE_ELIMINATION' && bracketRounds.length > 0">
          <TurnamentDouble 
            :endpoint="`${API_BASE}/tournaments/page/${id || route.params.id}/bracket/`" 
            :tournamentId="id || route.params.id" 
            clickAction="popup"
            :adminControls="isOrganizer"
            :key="`double-${id || route.params.id}`" />
        </div>
        <div v-else class="tournaments-teams-empty">Формат турнира не поддерживается.</div>
      </section>

      <section v-show="activeTab === 'participants'" class="t-participants">
        <div class="t-card" v-for="tm in participants" :key="tm.id || tm.name">
          <img class="t-card__logo" :src="tm.logo || defaultLogo" alt="">
          <div class="t-card__name">{{ tm.name }}</div>
        </div>
        <div v-if="!participants.length" class="t-empty">Пока нет участников.</div>
      </section>

      <section v-show="activeTab === 'settings'" class="t-settings">
        <div class="t-field">
          <label>Ссылка на трансляцию</label>
          <input class="t-input" type="url" :value="streamUrl" readonly>
        </div>

        <div v-if="streamUrl" class="t-embed">
          <iframe v-if="isYouTube(streamUrl)" :src="toYTEmbed(streamUrl)" title="Stream" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen />
          <iframe v-else-if="isTwitch(streamUrl)" :src="toTwitchEmbed(streamUrl)" title="Stream" frameborder="0"
            allowfullscreen />
          <div v-else class="t-embed__hint">Неподдерживаемая ссылка. Поддерживаем YouTube и Twitch.</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue'
import { useNuxtApp, useRoute, useRuntimeConfig, navigateTo, definePageMeta } from '#imports'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ middleware: 'organizer-only' })

const { $api } = useNuxtApp()
const config = useRuntimeConfig()
const { user, access } = useAuth()
const API_BASE = (config.public?.apiBase as string) || '/api/v1'

const authHeaders = computed(() =>
  access.value ? ({ Authorization: `Bearer ${access.value}` }) : ({} as Record<string, string>)
)
async function tryApi<T>(urls: string[], opts: any = {}): Promise<T> {
  let last: any = null
  const final = { ...opts, headers: { ...(opts.headers || {}), ...authHeaders.value } }
  for (const u of urls) { try { return await $api(u, final) } catch (e: any) { last = e } }
  throw last
}

const route = useRoute()
const id = computed<number | null>(() => {
  const raw = route.params.id || route.query.id
  return raw ? Number(raw) : null
})

const t = ref<any>(null)
const defaultLogo = '/assets/logo.svg'
const loading = ref(true)
const errorMsg = ref('')

const isOrganizer = computed(() => {
  const u: any = user.value || {}
  const role = String(u?.user_role || u?.role || '').toUpperCase()
  const ptype = String(u?.profile_type || u?.profile?.type || '').toLowerCase()
  const flags = [u?.data?.is_organizer, u?.is_organizer, u?.profile?.is_organizer].some(Boolean)
  const hasOrgProfile = !!u?.organization_profile || !!u?.organizer_data
  const roleOk = role.includes('ADMIN') || role.includes('STAFF') || role.includes('ORGANIZER')
  return roleOk || ptype === 'organizer' || flags || hasOrgProfile
})

/* ==== details ==== */
async function fetchTournament() {
  if (!id.value) return
  const urls = [
    `${API_BASE}/tournaments/page/${id.value}/details/`,
    `${API_BASE}/tournaments/${id.value}/`,
  ]
  const raw: any = await tryApi(urls)
  console.groupCollapsed('[API][DETAILS]'); console.log(raw); console.groupEnd()
  t.value = Array.isArray(raw?.results) ? (raw.results[0] || null) : raw
}

/* ==== participants ==== */
const participantsRaw = ref<any[]>([])
async function fetchParticipants() {
  if (!id.value) return
  const url = `${API_BASE}/tournaments/page/${id.value}/participants/`
  const raw: any = await tryApi([url])
  console.groupCollapsed('[API][PARTICIPANTS]'); console.log(raw); console.groupEnd()
  participantsRaw.value = raw?.results || []
}
const participants = computed<any[]>(() => {
  if (participantsRaw.value?.length) {
    return participantsRaw.value.map((r: any, i: number) => ({
      id: r.team?.id ?? r.id ?? i,
      name: r.team?.name ?? r.name ?? `Team ${i + 1}`,
      logo: r.team?.logo?.file || r.team?.logo?.path || r.team?.logo || r.logo || null
    }))
  }
  const raw = t.value?.teams || t.value?.participants || []
  return raw.map((r: any, i: number) => ({
    id: r.id ?? i, name: r.name ?? r.title ?? r.username ?? `Player ${i + 1}`,
    logo: r.logo?.file || r.logo || r.avatar || null
  }))
})
const teamLogoById = computed(() => {
  const m = new Map<number, string>()
  for (const p of participants.value) {
    const id = Number(p.id); const logo = p.logo
    if (id && logo) m.set(id, logo)
  }
  return m
})

/* ==== bracket ==== */
const bracketRaw = ref<any | null>(null)
const bracket = computed(() => bracketRaw.value?.data?.bracket || bracketRaw.value?.bracket || null)
const roundsRaw = computed(() => bracket.value?.rounds)
async function fetchBracket() {
  if (!id.value) return
  const url = `${API_BASE}/tournaments/page/${id.value}/bracket/`
  const raw: any = await tryApi([url])
  console.groupCollapsed('[API][BRACKET]'); console.log(raw); console.groupEnd()
  bracketRaw.value = raw
}

/* server id из /bracket */
const serverId = computed<number | undefined>(() => {
  const v =
    bracketRaw.value?.data?.server ??
    bracketRaw.value?.server ??
    t.value?.server ??
    t.value?.server_id ??
    t.value?.game_server ??
    t.value?.game_server_id ??
    t.value?.server?.id ??
    t.value?.game_server?.id
  return v != null ? Number(v) : undefined
})

/* ==== normalize rounds/teams ==== */
type RoundItem = { round_name: string; matches: any[] }
function normalizeTeam(x: any) {
  if (!x) return null
  if (typeof x === 'string') {
    if (x.toUpperCase() === 'TBD') return null
    return { id: null, name: x, logo_url: null }
  }
  if (typeof x === 'object') {
    const id = x.id ?? x.team_id ?? x.team?.id ?? null
    const name = x.name ?? x.team?.name ?? null
    let logo_url = x.logo_url ?? x.logo?.file ?? x.logo?.path ?? x.logo ?? null
    if (!logo_url && id && teamLogoById.value.has(Number(id))) {
      logo_url = teamLogoById.value.get(Number(id))!
    }
    return { id, name, logo_url }
  }
  return null
}
function normalizeRounds(r: any): RoundItem[] {
  if (Array.isArray(r)) {
    return r.map((R: any) => ({
      round_name: R.round_name || R.name || '',
      matches: (Array.isArray(R.matches) ? R.matches : []).map((m: any) => ({
        id: m.id ?? m.match_id ?? null,
        match_number: m.match_number ?? null,
        team1: normalizeTeam(m.team1),
        team2: normalizeTeam(m.team2),
        winner: m.winner ?? null,
        status: m.status ?? null,
        can_start: m.can_start ?? null,
        is_ready: m.is_ready ?? null
      }))
    }))
  }
  if (r && typeof r === 'object') {
    const order: string[] = ['WB Semi Final', 'WB Final', 'Semi Final', 'Final', 'Grand Final']
    const entries = Object.entries(r as Record<string, unknown>)
      .map(([k, v]) => [k, Array.isArray(v) ? (v as any[]) : []] as [string, any[]])
      .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
    return entries.map(([round_name, arr]) => ({
      round_name,
      matches: arr.map((m: any) => ({
        id: m?.id ?? m?.match_id ?? null,
        match_number: m?.match_number ?? null,
        team1: normalizeTeam(m?.team1),
        team2: normalizeTeam(m?.team2),
        winner: m?.winner ?? null,
        status: m?.status ?? null,
        can_start: m?.can_start ?? null,
        is_ready: m?.is_ready ?? null
      }))
    }))
  }
  return []
}
const bracketRounds = computed<RoundItem[]>(() => normalizeRounds(roundsRaw.value))
const bracketFormat = computed(() => String(bracket.value?.format || t.value?.format || '').toLowerCase())

/* map -> S4 props */
type TeamUI = { name?: string | null; logo?: string | null }
type MatchUI = { id?: number | null; canStart?: boolean | null; isReady?: boolean | null; status?: string | null; t1: TeamUI; t2: TeamUI }
const mapTeam = (tm?: any): TeamUI => ({ name: tm?.name ?? null, logo: tm?.logo_url || null })
const mapMatch = (m?: any): MatchUI => ({ id: m?.id ?? null, canStart: m?.can_start ?? null, isReady: m?.is_ready ?? null, status: m?.status ?? null, t1: mapTeam(m?.team1), t2: mapTeam(m?.team2) })

const semiUI = computed<MatchUI[]>(() => {
  const r0 = bracketRounds.value[0]; const ms = Array.isArray(r0?.matches) ? r0.matches : []
  return [mapMatch(ms[0]), mapMatch(ms[1])]
})
const finalUI = computed<MatchUI>(() => {
  const r1 = bracketRounds.value[1]; const m = Array.isArray(r1?.matches) ? r1.matches[0] : null
  return mapMatch(m)
})
const winnerUI = computed<TeamUI>(() => {
  // 1) Пытаемся взять победителя из API: bracketRaw.data.tournament.winner
  const w =
    (bracketRaw.value?.data?.tournament?.winner) ||
    (bracketRaw.value?.tournament?.winner) ||
    (t.value?.tournament?.winner) ||
    (t.value?.winner)

  if (w && typeof w === 'object') {
    const name = w.name || w.team_name || null
    const logo = (w.logo && (w.logo.file || w.logo.path || w.logo)) || w.avatar || null
    if (name || logo) return { name, logo }
  }

  // 2) Fallback: вычисляем на основе финального матча
  const r1 = bracketRounds.value[1]; const m = Array.isArray(r1?.matches) ? r1.matches[0] : null
  if (m?.winner?.id && (m?.team1?.id || m?.team2?.id)) {
    const w2 = (m.winner.id === m.team1?.id) ? m.team1 : (m.winner.id === m.team2?.id ? m.team2 : null)
    return mapTeam(w2 || null)
  }
  return {}
})

/* SINGLE + 4 */
const isSingle4Ready = computed(() => {
  if (
    bracketFormat.value !== 'single_elimination' &&
    bracketFormat.value !== 'single elimination' &&
    String(t.value?.format || '').toLowerCase() !== 'single_elimination'
  ) return false
  const tm = Number(bracket.value?.total_matches ?? 0)
  const rp = bracketRounds.value.length
  const cp = Number(bracketRaw.value?.data?.tournament?.current_participants ?? 0)
  const mx = Number(bracketRaw.value?.data?.tournament?.max_teams ?? 0)
  return (tm === 3) || (rp === 2) || (cp === 4) || (mx === 4) || (participants.value.length === 4)
})

/* labels */
const fmt = computed<string>(() => (t.value?.format || t.value?.tournament?.format || 'SINGLE_ELIMINATION') as string)
const formatLabel = computed(() => ({ SINGLE_ELIMINATION: 'Одиночное выбывание', DOUBLE_ELIMINATION: 'Двойное выбывание', ROUND_ROBIN: 'Круговой Робин' }[fmt.value] || '—'))
const formatDisplay = computed(() => {
  const f = fmt.value
  if (f === 'SINGLE_ELIMINATION') return 'Одиночное выбытие'
  if (f === 'DOUBLE_ELIMINATION') return 'Двойное выбытие'
  return f || 'Не указан'
})
const gameTitle = computed(() => t.value?.game?.title || t.value?.game_title || '—')
function formatDt(d?: string) { if (!d) return { d: '—', t: '—' }; const dt = new Date(d); const pad = (n: number) => String(n).padStart(2, '0'); return { d: `${pad(dt.getDate())}.${pad(dt.getMonth() + 1)}.${dt.getFullYear()}`, t: `${pad(dt.getHours())}:${pad(dt.getMinutes())}` } }
const startDate = computed(() => formatDt(t.value?.tournament_start || t.value?.start_at).d)
const startTime = computed(() => formatDt(t.value?.tournament_start || t.value?.start_at).t)
const organizer = computed(() => t.value?.organizer?.name || t.value?.organizer || '—')
const locationText = computed(() =>
  t.value?.location || t.value?.venue || t.value?.city || '—'
)
const prizeText = computed(() => {
  const v = t.value?.total_prize_pool
  if (v == null) return '—'
  const n = typeof v === 'string' ? Number(v) : v
  return Number.isFinite(n) ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n) + ' $' : String(v)
})
const streamUrl = computed<string>(() => t.value?.stream_url || t.value?.link || t.value?.tournament_link || '')
const isYouTube = (u: string) => /youtu\.?be/.test(u)
const isTwitch = (u: string) => /twitch\.tv/.test(u)
function toYTEmbed(u: string) { const id = (u.match(/(?:v=|\.be\/|embed\/)([^&?\/]+)/) || [, ''])[1]; return id ? `https://www.youtube.com/embed/${id}` : u }
function toTwitchEmbed(u: string) { const ch = (u.match(/twitch\.tv\/([^\/\?]+)/) || [, ''])[1]; const parent = location.hostname; return ch ? `https://player.twitch.tv/?channel=${ch}&parent=${parent}` : u }

/* старт турнира */
const status = computed(() => String(t.value?.status || '').toUpperCase())
const ALLOW_START = new Set(['REGISTRATION_CLOSED', 'READY', 'SCHEDULED'])
const isStarted = computed(() => {
  const s = status.value
  return ['STARTED', 'ACTIVE', 'ONGOING', 'IN_PROGRESS', 'LIVE'].includes(s) || t.value?.started === true || !!t.value?.bracket?.length
})
const showStartButton = computed(() => isOrganizer.value && !isStarted.value && ALLOW_START.has(status.value))
const canStart = computed(() => showStartButton.value && participants.value.length >= 2)
const startHint = computed(() => {
  if (!ALLOW_START.has(status.value)) return 'Старт доступен после закрытия регистрации'
  if (isStarted.value) return 'Турнир уже запущен'
  if (participants.value.length < 2) return 'Нужно минимум 2 участника'
  return 'Готово к старту'
})
const starting = ref(false); const startOk = ref(false); const startErr = ref<string | null>(null)
async function onStart() {
  if (!id.value) return
  starting.value = true; startOk.value = false; startErr.value = null
  try {
    const url = `${API_BASE}/tournaments/actions/${id.value}/start/`
    const res: any = await tryApi([url], { method: 'POST', body: {} })
    console.groupCollapsed('[API][START]'); console.log(res); console.groupEnd()
    startOk.value = true
    await Promise.all([fetchTournament(), fetchParticipants(), fetchBracket()])
  } catch (e: any) {
    // Сервер может вернуть ошибку, но турнир фактически уже запущен.
    // Перезагружаем данные и проверяем статус/брекет.
    await Promise.allSettled([fetchTournament(), fetchParticipants(), fetchBracket()])
    const startedNow = isStarted.value || !!(bracket.value && (Array.isArray(bracket.value?.rounds) ? bracket.value.rounds.length : 0))
    if (startedNow) {
      startOk.value = true
      startErr.value = null
    } else {
      startErr.value = e?.data?.detail || e?.message || 'Не удалось запустить турнир'
    }
  } finally { starting.value = false }
}

/* === утилиты для проверки статуса матча === */
function findMatch(matchId: number) {
  for (const R of bracketRounds.value) {
    const m = (R?.matches || []).find((x: any) => Number(x?.id) === Number(matchId))
    if (m) return m
  }
  return null
}
function getMatchStatus(matchId: number) {
  const m = findMatch(matchId)
  return String(m?.status || '').toUpperCase()
}

/* старт одного матча (устойчиво к 500/LIVE) */
const startingMatch = ref<number | null>(null)
async function startMatch(matchId: number, opts?: { force?: boolean }) {
  if (!matchId || startingMatch.value) return
  const pre = getMatchStatus(matchId)
  if (pre === 'LIVE') { alert('Матч уже идёт (LIVE).'); return }

  startingMatch.value = matchId
  const url = `${API_BASE}/game/servers/matches/${matchId}/start/`
  const sid = serverId.value
  const bodies = [
    // sid != null ? { server: sid,            force_start: !!opts?.force || true } : null,
    sid != null ? { server_id: String(sid), force_start: !!opts?.force || true } : null,
    { force_start: !!opts?.force || true }
  ].filter(Boolean) as any[]

  let lastErr: any = null
  try {
    for (const body of bodies) {
      try {
        const res: any = await $api(url, { method: 'POST', headers: { ...(authHeaders.value) }, body })
        console.groupCollapsed('[API][MATCH START]', matchId); console.log('body:', body, 'res:', res); console.groupEnd()
        await fetchBracket()
        const st = getMatchStatus(matchId)
        if (st === 'LIVE') { alert(`Матч #${matchId} запущен`); return }
      } catch (e: any) {
        lastErr = e
        const msg = String(e?.data?.detail || e?.message || '')
        if (/status:\s*LIVE/i.test(msg) || /already.*live/i.test(msg)) {
          await fetchBracket(); alert('Матч уже идёт (LIVE).'); return
        }
        if ((e?.status === 500) || /Failed to start match/i.test(msg)) {
          await fetchBracket()
          const st = getMatchStatus(matchId)
          if (st === 'LIVE') { alert('Матч запущен (сервер вернул 500, но статус LIVE).'); return }
          continue
        }
        if (/server/i.test(msg)) continue
        throw e
      }
    }
    const st = getMatchStatus(matchId)
    if (st === 'LIVE') { alert(`Матч #${matchId} уже идёт.`); return }
    throw lastErr || new Error('Не удалось запустить матч')
  } catch (e: any) {
    console.error('[MATCH START][error]', e)
    alert(e?.data?.detail || e?.message || 'Не удалось запустить матч')
  } finally {
    startingMatch.value = null
  }
}

/* ==== tabs ==== */
const activeTab = ref<'grid' | 'participants' | 'settings'>('grid')
const tab0 = ref<HTMLButtonElement | null>(null)
const tab1 = ref<HTMLButtonElement | null>(null)
const tab2 = ref<HTMLButtonElement | null>(null)
const tabLeft = ref(0); const tabW = ref(0)
function setTab(k: 'grid' | 'participants' | 'settings') { activeTab.value = k; recalcIndicator() }
function recalcIndicator() {
  const el = activeTab.value === 'grid' ? tab0.value : activeTab.value === 'participants' ? tab1.value : tab2.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const parent = el.parentElement!.getBoundingClientRect()
  tabLeft.value = rect.left - parent.left
  tabW.value = rect.width
}

/* ==== load ==== */
onMounted(async () => {
  try {
    await fetchTournament()
    if (!isOrganizer.value) return navigateTo('/tournaments')
    await Promise.all([fetchParticipants(), fetchBracket()])
  } catch (e: any) {
    errorMsg.value = e?.data?.detail || e?.message || 'Не удалось загрузить турнир'
  } finally {
    loading.value = false
    await nextTick(); recalcIndicator()
  }
})
</script>

<style>
@import './mytournament.css';

.t-summary__start {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-left: auto
}

.t-start-btn {
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  background: #3b82f6;
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

.t-empty {
  opacity: .7
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
