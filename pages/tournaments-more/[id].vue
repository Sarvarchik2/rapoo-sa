<!-- pages/tournaments-more/[id].vue -->
<script setup lang="ts" async>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'
import { useAuth } from '~/composables/useAuth'

/* ---------------- base/auth ---------------- */
const route  = useRoute()
const config = useRuntimeConfig()
const { user, access, isAuthenticated } = useAuth()
const API_BASE = (config.public?.apiBase as string) || 'http://localhost:8000/api/v1'

const authHeaders = computed(() =>
  access.value ? ({ Authorization: `Bearer ${access.value}` }) : ({} as Record<string,string>)
)
async function $req<T>(url:string, opts:any={}) {
  const final = { ...opts, headers:{ ...(opts.headers||{}), ...authHeaders.value } }
  return await $fetch<T>(url, final)
}
async function tryReq<T>(urls:string[], opts:any={}) {
  let last:any=null
  for (const u of urls) {
    try { return await $req<T>(u, opts) } catch(e:any){ last=e }
  }
  throw last
}

/* ---------------- types ---------------- */
type FileObj = { id:number; file?:string; path?:string|null }
type Game = { id:number; title?:string }
type Tournament = {
  id:number; name:string; status?:string; format?:string; game?:Game; banner?:FileObj;
  tournament_start?:string; tournament_end?:string; total_prize_pool?:string|number;
  location?: { name?:string } | string; venue?: string;
}
type Team = { id:number; name:string; logo?:FileObj }
type ParticipantItem = { id:number; team:Team }
type Paginated<T> = { count:number; next:string|null; previous:string|null; results:T[] }

/* ---------------- state ---------------- */
const loading   = ref(true)
const error     = ref<string|null>(null)
const hydrated  = ref(false)
const t         = ref<Tournament|null>(null)
const participants = ref<ParticipantItem[]>([])

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
  return Number.isFinite(n) ? new Intl.NumberFormat('en-US', { maximumFractionDigits:0 }).format(n) : String(v)
}
const fmtDate = (s?: string) =>
  s ? new Date(s).toLocaleDateString('ru-RU', { timeZone:'Asia/Tashkent' }) : null

/* ---------------- derived ---------------- */
const bannerUrl = computed(() =>
  fileToUrl(t.value?.banner) || 'https://via.placeholder.com/1200x400?text=Tournament'
)
const nameText     = computed(() => t.value?.name || 'Без названия')
const subTitleText = computed(() => t.value?.game?.title || 'Турнир')
const statusText   = computed(() => String(t.value?.status || '').toUpperCase())
const formatText   = computed(() => String(t.value?.format || '').toUpperCase())

/* инфо-блоки: дата, место, призовой */
const startText = computed(() => fmtDate(t.value?.tournament_start))
const endText   = computed(() => fmtDate(t.value?.tournament_end))
const dateRangeText = computed(() => {
  const s = startText.value, e = endText.value
  if (!s && !e) return 'Дата уточняется'
  if (s && e)   return `${s} — ${e}`
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
async function fetchParticipants(tid:number|string) {
  const url = `${API_BASE}/tournaments/page/${tid}/participants/`
  const data = await $req<Paginated<ParticipantItem>>(url)
  console.groupCollapsed('[API][PARTICIPANTS]', url); console.log(data); console.groupEnd()
  participants.value = data?.results || []
}
const teamLogoById = computed(() => {
  const m = new Map<number,string>()
  for (const p of participants.value) {
    const id = Number(p.team?.id)
    const logo = fileToUrl(p.team?.logo)
    if (id && logo) m.set(id, logo)
  }
  return m
})

/* ---------------- details ---------------- */
async function fetchDetails(tid:string) {
  const urls = [
    `${API_BASE}/tournaments/page/${tid}/details/`,
    `${API_BASE}/tournaments/${tid}/`,
  ]
  const raw:any = await tryReq(urls)
  console.groupCollapsed('[API][DETAILS]'); console.log(raw); console.groupEnd()
  t.value = Array.isArray(raw?.results) ? (raw.results[0] || null) : raw
}

/* ---------------- bracket ---------------- */
const bracketRaw = ref<any|null>(null)
async function fetchBracket(tid:number|string){
  const url = `${API_BASE}/tournaments/page/${tid}/bracket/`
  const raw:any = await $req(url)
  console.groupCollapsed('[API][BRACKET]', url); console.log(raw); console.groupEnd()
  bracketRaw.value = raw
}

type RoundItem = { round_name:string; matches:any[] }
const bracket = computed(()=> bracketRaw.value?.data?.bracket || bracketRaw.value?.bracket || null)
const roundsRaw = computed(()=> bracket?.value?.rounds )

function normalizeTeam(x:any){
  if (!x) return null
  if (typeof x === 'string') {
    if (x.toUpperCase() === 'TBD') return null
    return { id:null, name:x, logo_url:null }
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

function normalizeRounds(r:any): RoundItem[] {
  if (Array.isArray(r)) {
    return r.map((R:any)=>({
      round_name: R.round_name || R.name || '',
      matches: (Array.isArray(R.matches) ? R.matches : []).map((m:any)=>({
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
    const order = ['WB Semi Final','WB Final','Semi Final','Final','Grand Final'] as const
    const entries = Object
      .entries(r as Record<string, unknown>)
      .map(([k, v]) => [k, Array.isArray(v) ? (v as any[]) : []] as [string, any[]])
      .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
    return entries.map(([round_name, arr]) => ({
      round_name,
      matches: arr.map((m:any)=>({
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
const rounds = computed<RoundItem[]>(()=> normalizeRounds(roundsRaw.value))

/* SINGLE / 4 detection */
const isSingle4Ready = computed(()=>{
  const fmt = formatText.value || String(bracket.value?.format || '').toUpperCase()
  if (!fmt.includes('SINGLE')) return false
  const tm = Number(bracket.value?.total_matches ?? 0)
  const rp = rounds.value.length
  const cp = Number(bracketRaw.value?.data?.tournament?.current_participants ?? 0)
  const mx = Number(bracketRaw.value?.data?.tournament?.max_teams ?? 0)
  return (tm === 3) || (rp === 2) || (cp === 4) || (mx === 4) || (participants.value.length === 4)
})

/* map to S4 props */
type TeamUI = { name?:string|null; logo?:string|null }
type MatchUI = { t1:TeamUI; t2:TeamUI }
function toTeamUI(ti:any): TeamUI {
  if (!ti) return {}
  const id   = ti.id ?? null
  const name = ti.name ?? null
  let logo   = ti.logo_url ?? null
  if (!logo && id && teamLogoById.value.has(Number(id))) {
    logo = teamLogoById.value.get(Number(id))!
  }
  return { name, logo }
}
function toMatchUI(m:any): MatchUI {
  return { t1: toTeamUI(m?.team1), t2: toTeamUI(m?.team2) }
}
const semiUI = computed<MatchUI[]>(()=>{
  const r0 = rounds.value[0]
  const ms = Array.isArray(r0?.matches) ? r0.matches : []
  return [ toMatchUI(ms[0]), toMatchUI(ms[1]) ]
})
const finalUI = computed<MatchUI>(()=>{
  const r1 = rounds.value[1]
  const m  = Array.isArray(r1?.matches) ? r1.matches[0] : null
  return toMatchUI(m)
})
const winnerUI = computed<TeamUI>(()=> {
  const r1 = rounds.value[1]
  const m  = Array.isArray(r1?.matches) ? r1.matches[0] : null
  if (m?.winner?.id && (m?.team1?.id || m?.team2?.id)) {
    const w = (m.winner.id === m.team1?.id) ? m.team1 : (m.winner.id === m.team2?.id ? m.team2 : null)
    return toTeamUI(w)
  }
  return {}
})

/* ---------------- join / profile ---------------- */
type TeamLite = { id:number; team?:TeamLite }
function getCaptainedTeams(u:any):TeamLite[]{
  if (Array.isArray(u?.captained_teams)) return u.captained_teams
  if (Array.isArray(u?.data?.captained_teams)) return u.data.captained_teams
  if (Array.isArray(u?.profile?.captained_teams)) return u.profile.captained_teams
  return []
}
const myTeamId = computed<number|null>(() => {
  const tt = getCaptainedTeams(user.value || {})[0]
  const id = tt?.id ?? tt?.team?.id
  return id!=null ? Number(id) : null
})
const isCaptain = computed(()=>{
  const u:any = user.value || {}
  const pt = (u?.profile_type ?? u?.data?.profile_type ?? u?.profile?.type)
  const ptStr = typeof pt === 'string' ? pt.toLowerCase() : ''
  const cnt = Number(u?.data?.captained_teams_count) || 0
  return ptStr.includes('captain') || u?.data?.is_team_captain === true || getCaptainedTeams(u).length>0 || cnt>0 || !!myTeamId.value
})
const registrationOpen = computed(()=>{
  if (statusText.value) {
    if (['REGISTRATION_OPEN','OPEN','UPCOMING'].some(s=>statusText.value.includes(s))) return true
    if (['REGISTRATION_CLOSED','CLOSED','STARTED','ACTIVE','LIVE','IN_PROGRESS'].some(s=>statusText.value.includes(s))) return false
  }
  const ts = t.value?.tournament_start
  return !ts || new Date() < new Date(ts)
})
const isAlreadyJoined = computed(()=> !!myTeamId.value && participants.value.some(p => Number(p.team.id) === myTeamId.value))
const showJoinButton = computed(()=> hydrated.value && isAuthenticated.value && isCaptain.value && registrationOpen.value && !isAlreadyJoined.value)

const submitting = ref(false); const submitErr = ref<string|null>(null)
async function onRegisterClick(){
  if (!t.value?.id) return
  submitting.value = true; submitErr.value = null
  try {
    const body = { tournament: Number(t.value.id), registration_message:'Заявка от капитана', payment_reference:'' }
    const url  = `${API_BASE}/tournaments/actions/register/`
    const res:any = await $req(url, { method:'POST', body })
    console.groupCollapsed('[API][REGISTER]'); console.log(res); console.groupEnd()
    await fetchParticipants(t.value.id)
    alert('Заявка отправлена!')
  } catch(e:any){
    submitErr.value = e?.data?.detail || e?.message || 'Не удалось отправить заявку'
    alert(submitErr.value)
  } finally {
    submitting.value = false
  }
}

/* ---------------- start tour ---------------- */
const ALLOW_START = new Set(['REGISTRATION_CLOSED','READY','SCHEDULED'])
const isOrganizer = computed(()=>{
  const u:any = user.value || {}
  const role = String(u?.user_role || u?.role || '').toUpperCase()
  const flags = [u?.data?.is_organizer, u?.is_organizer, u?.profile?.is_organizer].some(Boolean)
  const ownerMatch =
    (t.value?.organizer?.user?.id && t.value.organizer.user.id === u?.id) ||
    (t.value?.organizer_id && t.value.organizer_id === u?.id)
  return role.includes('ADMIN') || role.includes('STAFF') || role.includes('ORGANIZER') || flags || !!ownerMatch
})
const isStarted = computed(()=>{
  const s = statusText.value
  return ['STARTED','ACTIVE','ONGOING','IN_PROGRESS','LIVE'].includes(s) || (Array.isArray(rounds.value) && rounds.value.length>0 && s!=='REGISTRATION_OPEN')
})
const showStartButton = computed(()=> isOrganizer.value && !isStarted.value && ALLOW_START.has(statusText.value))
const canStart = computed(()=> showStartButton.value && participants.value.length >= 2)
const startHint = computed(()=>{
  if (!ALLOW_START.has(statusText.value)) return 'Старт доступен после закрытия регистрации'
  if (isStarted.value) return 'Турнир уже запущен'
  if (participants.value.length < 2) return 'Нужно минимум 2 участника'
  return 'Готово к старту'
})
const starting = ref(false); const startOk = ref(false); const startErr = ref<string|null>(null)
async function onStart(){
  if (!t.value?.id) return
  starting.value=true; startOk.value=false; startErr.value=null
  try{
    const url = `${API_BASE}/tournaments/actions/${t.value.id}/start/`
    const res:any = await $req(url, { method:'POST', body:{} })
    console.groupCollapsed('[API][START]'); console.log(res); console.groupEnd()
    startOk.value = true
    await Promise.all([ fetchDetails(String(t.value.id)), fetchParticipants(t.value.id), fetchBracket(t.value.id) ])
  }catch(e:any){
    startErr.value = e?.data?.detail || e?.message || 'Не удалось запустить турнир'
  }finally{
    starting.value=false
  }
}

/* ---------------- init ---------------- */
const id = route.params.id as string
try{
  await fetchDetails(id)
  if (t.value?.id){
    await Promise.all([
      fetchParticipants(t.value.id),
      fetchBracket(t.value.id),
    ])
  }
} catch(e:any){
  error.value = e?.message || 'Ошибка при загрузке'
} finally {
  loading.value = false
}
onMounted(()=>{ hydrated.value = true; nextTick(()=>{}) })
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
        <div class="t-summary__item">
          <div class="t-summary__label">Формат</div>
          <div class="t-summary__val">{{ formatText }}</div>
        </div>
        <div class="t-summary__item">
          <div class="t-summary__label">Статус</div>
          <div class="t-summary__val">{{ statusText }}</div>
        </div>
        <div class="t-summary__start" v-if="showStartButton">
          <button class="t-start-btn" :disabled="starting || !canStart" @click="onStart" :title="!canStart ? startHint : 'Начать турнир'">
            {{ starting ? 'Запускаем…' : (isStarted ? 'Турнир запущен' : 'Начать турнир') }}
          </button>
          <div v-if="startOk" class="t-note t-note--ok">Сетка сгенерирована ✅</div>
          <div v-if="startErr" class="t-note t-note--err">Ошибка: {{ startErr }}</div>
        </div>
      </div>

      <!-- Сетка (Single / 4) -->
      <div class="main-title-wrap"><h2>Турнирная сетка</h2></div>
      <S-4
        v-if="isSingle4Ready"
        :semi="semiUI"
        :finalMatch="finalUI"
        :winner="winnerUI"
      />
      <div v-else class="tournaments-teams-empty">Сетка появится после генерации или формат/размер иной.</div>

      <!-- Участники -->
      <div class="main-title-wrap"><h2>Участники ({{ participants.length }})</h2></div>
      <div v-if="participants.length" class="tournaments-teams">
        <div class="tournaments-teams-item" v-for="p in participants" :key="p.id">
          <img :src="fileToUrl(p.team.logo) || 'https://via.placeholder.com/120x120?text=Logo'" :alt="p.team.name" />
          <h2>{{ p.team.name }}</h2>
        </div>
      </div>
      <div v-else class="tournaments-teams-empty">Пока нет участников.</div>

      <!-- Кнопка «Стать участником» -->
      <div class="participants-actions">
        <div v-if="isAlreadyJoined" class="note ok">Ваша команда уже участвует ✅</div>
        <button v-else-if="showJoinButton" class="broadcast-register-btn" :disabled="submitting" @click="onRegisterClick">
          {{ submitting ? 'Отправляем…' : 'Стать участником' }}
        </button>
        <div v-else class="note" />
      </div>
    </template>
  </div>
</template>

<style scoped>
@import './tournaments-more.css';
.state{padding:16px;opacity:.8}
.state.error{color:#ff6262}

.t-summary{display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin:12px 0}
.t-summary__item{padding:8px 12px;border-radius:10px;background:#0f1115;border:1px solid #1b1f27}
.t-summary__label{opacity:.6;font-size:12px}
.t-summary__val{font-weight:600}
.t-summary__start{margin-left:auto;display:flex;align-items:center;gap:12px}
.t-start-btn{padding:10px 16px;border-radius:10px;font-weight:600;background:#3b82f6;color:#fff;border:none;cursor:pointer}
.t-start-btn[disabled]{opacity:.5;cursor:not-allowed}
.t-note{font-size:14px}.t-note--ok{color:#16a34a}.t-note--err{color:#ef4444}

.tournaments-teams-empty{opacity:.8;padding:12px 0}
.participants-actions{margin:12px 0 20px}
.note{display:flex;justify-content:center}
</style>
