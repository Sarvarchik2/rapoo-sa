<template>
  <div class="singelcsgo-bracket-wrapper">
    <div class="zoom-controls">
      <button @click="zoomIn" class="zoom-btn zoom-plus">+</button>
      <button @click="zoomOut" class="zoom-btn zoom-minus">-</button>
      <span>Scale: {{ currentScale.toFixed(1) }}</span>
    </div>
    <div class="singelcsgo-bracket-scroll " :style="scaleStyle">
      <div class="singelcsgo-bracket-container" ref="bracketContainer">
        <div v-for="(round, roundIndex) in tournamentData.rounds" :key="`round-${roundIndex}`" class="singelcsgo-round"
          :class="`singelcsgo-round-${roundIndex + 1}`" :style="getRoundStyle(roundIndex)">
          <div v-for="(match, matchIndex) in round" :key="`match-${roundIndex}-${matchIndex}`"
            class="singelcsgo-match-wrapper">
            <div class="singelcsgo-match" @click="openMatchPopup(match, roundIndex, matchIndex)">
              <div class="singelcsgo-team" :class="{ winner: isWinner(roundIndex, matchIndex, 0) }">
                <div v-if="hasTeam(match.team1)" :class="`singelcsgo-team-logo ${match.team1.logo || ''}`">
                  {{ (match.team1.logo || '') === 'navi' ? '🏆' : '🦅' }}
                </div>
                <div class="team-info">
                  <span class="team-name">{{ teamName(match.team1) }}</span>
                </div>
              </div>
              <div class="singelcsgo-team" :class="{ winner: isWinner(roundIndex, matchIndex, 1) }">
                <div v-if="hasTeam(match.team2)" :class="`singelcsgo-team-logo ${match.team2?.logo || ''}`">
                  {{ (match.team2?.logo || '') === 'navi' ? '🏆' : '🦅' }}
                </div>
                <div class="team-info">
                  <span class="team-name">{{ teamName(match.team2) }}</span>
                </div>
              </div>
            </div>

            <div v-if="roundIndex < tournamentData.rounds.length - 1" class="singelcsgo-connector-horizontal"></div>
          </div>
        </div>

        <div v-for="connector in allConnectors.vertical" :key="connector.id" class="singelcsgo-connector-vertical" :style="{
          left: `${connector.left}px`,
          top: `${connector.top}px`,
          height: `${connector.height}px`
        }"></div>

        <div v-for="connector in allConnectors.horizontal" :key="connector.id"
          class="singelcsgo-connector-horizontal-bridge" :style="{
            left: `${connector.left}px`,
            top: `${connector.top}px`,
            width: `${connector.width}px`
          }"></div>

        <div class="singelcsgo-round singelcsgo-winner-round" :style="getRoundStyle(tournamentData.rounds.length)">
          <div class="singelcsgo-match-wrapper" ref="winnerBlock">
            <div class="singelcsgo-match singelcsgo-match-winner">
              <div class="singelcsgo-team winner">
                <div v-if="winnerTeam" class="singelcsgo-team-logo">🏆</div>
                <span>{{ winnerName }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="winnerConnector" class="singelcsgo-connector-horizontal-bridge"
          :style="{ left: `${winnerConnector.left}px`, top: `${winnerConnector.top}px`, width: `${winnerConnector.width}px` }"></div>
      </div>
    </div>

    <!-- Match Control Popup -->
    <div v-if="showMatchPopup" class="match-popup-overlay" @click="closeMatchPopup">
      <div class="match-popup" @click.stop>
        <div class="match-popup-header">
          <h3>{{ isMatchStarted ? 'Управление матчем' : 'Матч еще не начался' }}</h3>
          <button @click="closeMatchPopup" class="close-btn">×</button>
        </div>
        
        <div class="match-popup-content">
          <div class="match-info">
            <div class="match-teams">
              <div class="team">
                <span class="team-name">{{ selectedMatch?.team1?.name || 'Команда 1' }}</span>
                <span v-if="selectedMatch?.team1?.tag" class="team-tag">{{ selectedMatch.team1.tag }}</span>
              </div>
              <div class="vs">VS</div>
              <div class="team">
                <span class="team-name">{{ selectedMatch?.team2?.name || 'Команда 2' }}</span>
                <span v-if="selectedMatch?.team2?.tag" class="team-tag">{{ selectedMatch.team2.tag }}</span>
              </div>
            </div>
            
            <div v-if="isMatchStarted" class="match-status">
              <span class="status-label">Статус:</span>
              <span class="status-value" :class="getStatusClass(selectedMatch?.status)">
                {{ getStatusText(selectedMatch?.status) }}
              </span>
            </div>
            <div v-else class="match-notification">
              <p>Матч еще не начался. Вы сможете просмотреть подробную информацию после начала матча.</p>
            </div>
            <div v-if="selectedMatch?.scheduled_time" class="scheduled-time">
              <span class="info-label">Запланировано:</span>
              <span class="info-value">{{ formatDate(selectedMatch.scheduled_time) }}</span>
            </div>
          </div>
          
          <div v-if="isMatchStarted || adminControls" class="match-controls">
            <button 
              v-if="canStartMatch" 
              @click="startMatch" 
              :disabled="isLoading"
              class="control-btn start-btn"
            >
              {{ isLoading ? 'Запуск...' : 'Запустить матч' }}
            </button>
            
            <button 
              v-if="canStopMatch" 
              @click="stopMatch" 
              :disabled="isLoading"
              class="control-btn stop-btn"
            >
              {{ isLoading ? 'Остановка...' : 'Остановить матч' }}
            </button>
            
            <button @click="refreshMatchStatus" :disabled="isLoading" class="control-btn refresh-btn">
              {{ isLoading ? 'Обновление...' : 'Обновить статус' }}
            </button>
          </div>
          
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { safeGetBoundingClientRect, safeQuerySelector, safeQuerySelectorAll } from '@/utils/dom'
import { useRuntimeConfig } from '#imports'
import { $fetch } from 'ofetch'

// Props
const props = defineProps({
  data: {
    type: Object,
    default: null
  },
  // Если известен id турнира — можно передать его, и компонент сам получит сетку
  tournamentId: {
    type: [String, Number],
    default: null
  },
  // Или можно напрямую передать endpoint для получения сетки
  endpoint: {
    type: String,
    default: null
  },
  // Как реагировать на клик по матчу: 'auto' | 'navigate' | 'popup'
  //  - auto: если матч запущен → перейти, иначе показать попап (поведение по умолчанию раньше)
  //  - navigate: всегда переходить на страницу матча (если есть ID)
  //  - popup: всегда показывать попап
  clickAction: {
    type: String,
    default: 'auto'
  },
  // Показывать административные контролы даже до старта матча
  adminControls: {
    type: Boolean,
    default: false
  }
})

// Reactive references
const bracketContainer = ref(null)
const winnerBlock = ref(null)
const connectorData = ref({ vertical: [], horizontal: [] })
const winnerConnector = ref(null)
const currentScale = ref(1.0)

// Match popup state
const showMatchPopup = ref(false)
const selectedMatch = ref(null)
const selectedMatchCoords = ref({ roundIndex: 0, matchIndex: 0 })
const isLoading = ref(false)
const errorMessage = ref('')
// Permissions for controls (can be disabled after 403)
const canStartPermission = ref(true)
const canStopPermission = ref(true)

// Tournament data
const tournamentData = ref(props.data || { rounds: [], teams: [] })
// Meta from API (e.g., declared winner)
const bracketMeta = ref({ winner: null })
// Tournament status
const tournamentStatus = ref(null)

// Runtime config for API base
const config = useRuntimeConfig()
const API_BASE = (config.public?.apiBase || '').toString()
const { $api } = useNuxtApp()
// --- Error helpers ---
function extractError(e) {
  const status = e?.status || e?.statusCode || e?.response?.status || e?.response?.statusCode || null
  const data = e?.data || e?.response?._data || {}
  const msg = data?.detail || data?.message || data?.error || e?.message || 'Ошибка запроса'
  return { status, message: msg }
}

// Generate single-elimination bracket with byes for any number of teams
function highestPowerOfTwoLE(n) { let p = 1; while (p * 2 <= n) { p *= 2; } return p; }
function generateSingleEliminationWithPrelims(teams) {
  const n = Array.isArray(teams) ? teams.length : 0
  if (n === 0) return { rounds: [], teams: [] }
  const base = highestPowerOfTwoLE(n)
  const prelimMatches = n - base
  const prelimTeamsCount = prelimMatches * 2
  const byesCount = n - prelimTeamsCount

  // Fix: Best teams get byes, worst play prelim
  const byesTeams = teams.slice(0, byesCount)
  const prelimTeams = teams.slice(byesCount)

  const rounds = []
  // Preliminary round (if needed)
  if (prelimMatches > 0) {
    const r0 = []
    for (let i = 0; i < prelimTeamsCount; i += 2) {
      const a = prelimTeams[i] ? { name: prelimTeams[i].name, logo: prelimTeams[i].logo } : null
      const b = prelimTeams[i + 1] ? { name: prelimTeams[i + 1].name, logo: prelimTeams[i + 1].logo } : null
      r0.push({ team1: a, team2: b })
    }
    rounds.push(r0)
  }

  // Main bracket: byes + prelim winners
  const entrants = []
  const placeholders = Array(prelimMatches).fill({})
  const totalNeeded = base
  let iByes = 0, iPH = 0
  while (entrants.length < totalNeeded) {
    if (iByes < byesCount) { entrants.push(byesTeams[iByes++] || {}) }
    if (entrants.length < totalNeeded && iPH < placeholders.length) { entrants.push(placeholders[iPH++]) }
  }
  while (entrants.length < totalNeeded) entrants.push({})

  const r1 = []
  for (let i = 0; i < entrants.length; i += 2) {
    const a = entrants[i]
    const b = entrants[i + 1]
    r1.push({
      team1: a && a.name ? { name: a.name, logo: a.logo } : a,
      team2: b && b.name ? { name: b.name, logo: b.logo } : b,
    })
  }
  rounds.push(r1)

  // Subsequent rounds
  let matches = r1.length
  while (matches > 1) {
    const round = []
    for (let i = 0; i < matches; i += 2) { round.push({ team1: {}, team2: {} }) }
    rounds.push(round)
    matches = Math.floor(matches / 2)
  }

  return { rounds, teams }
}

// --- Normalization helpers (API -> { rounds, teams }) ---
function normalizeTeam(val) {
  if (!val) return {}
  if (typeof val === 'string') return { name: val }
  if (typeof val === 'object') {
    return {
      id: val.id,
      name: val.name || val.title || val.team_name || '',
      tag: val.tag,
      logo: val.logo || val.logo_url || ''
    }
  }
  return {}
}

function normalizeMatch(match) {
  return {
    id: match.id,
    match_number: match.match_number,
    round_name: match.round_name,
    status: match.status,
    can_start: match.can_start,
    team1: normalizeTeam(match.team1),
    team2: normalizeTeam(match.team2),
    winner: match.winner,
    scheduled_time: match.scheduled_time,
    actual_start_time: match.actual_start_time,
    duration: match.duration,
    team1_score: match.team1_score || 0,
    team2_score: match.team2_score || 0
  }
}

function groupByRound(matches = []) {
  const g = {}
  matches.forEach(m => {
    const r = Number(m.round ?? m.round_index ?? 0)
    if (!g[r]) g[r] = []
    g[r].push(m)
  })
  return g
}

function buildTeamMap(res) {
  const m = {}
  if (Array.isArray(res?.teams)) {
    res.teams.forEach(t => { m[String(t.id ?? t.team_id ?? t.name)] = t })
  }
  if (Array.isArray(res?.matches)) {
    res.matches.forEach(mm => {
      if (mm.team1) { m[String(mm.team1.id ?? mm.team1_id ?? mm.team1.name)] = mm.team1 }
      if (mm.team2) { m[String(mm.team2.id ?? mm.team2_id ?? mm.team2.name)] = mm.team2 }
    })
  }
  return m
}

function normalizeBracket(res) {
  // Handle the new API structure directly
  if (res?.data?.bracket?.rounds && Array.isArray(res.data.bracket.rounds)) {
    const rounds = res.data.bracket.rounds.map(round =>
      round.matches ? round.matches.map(normalizeMatch) : []
    )
    return { rounds, teams: res.data.bracket.teams || [] }
  }

  // Handle the bracket structure directly
  if (res?.bracket?.rounds && Array.isArray(res.bracket.rounds)) {
    const rounds = res.bracket.rounds.map(round =>
      round.matches ? round.matches.map(normalizeMatch) : []
    )
    return { rounds, teams: res.bracket.teams || [] }
  }

  // Unwrap common nesting
  const bracketNode = (res && (res.data?.bracket || res.bracket)) || null
  const tournamentNode = (res && (res.data?.tournament || res.tournament)) || null
  if (tournamentNode?.winner) {
    bracketMeta.value.winner = normalizeTeam(tournamentNode.winner)
  }
  if (tournamentNode?.status) {
    tournamentStatus.value = tournamentNode.status
  }

  // data.bracket.rounds may be an object keyed by round names
  if (bracketNode && bracketNode.rounds) {
    const r = bracketNode.rounds
    if (Array.isArray(r)) {
      const rounds = r.map(arr => (Array.isArray(arr) ? arr : (arr?.matches || []))).map(marr =>
        marr.map(normalizeMatch)
      )
      return { rounds, teams: res.teams || [] }
    }
    if (r && typeof r === 'object') {
      const order = ['WB Semi Final', 'Semi Final', 'WB Final', 'Final', 'Grand Final']
      const entries = Object.entries(r)
        .map(([name, arr]) => ({ name, arr: Array.isArray(arr) ? arr : [] }))
        .sort((a, b) => {
          const ia = order.indexOf(a.name)
          const ib = order.indexOf(b.name)
          if (ia === -1 && ib === -1) return a.name.localeCompare(b.name)
          if (ia === -1) return 1
          if (ib === -1) return -1
          return ia - ib
        })
      const rounds = entries.map(e => e.arr.map(normalizeMatch))
      return { rounds, teams: res.teams || [] }
    }
  }

  // 1) Уже готовые раунды [{ team1, team2 }, ...]
  if (Array.isArray(res?.rounds)) {
    const rounds = res.rounds.map(r => r.map(normalizeMatch))
    return { rounds, teams: res.teams || [] }
  }
  // 2) Описание матчей + round (+ teams)
  if (Array.isArray(res?.matches)) {
    const tmap = buildTeamMap(res)
    const grouped = groupByRound(res.matches)
    const rounds = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b)
      .map(k => grouped[k].map(normalizeMatch))
    return { rounds, teams: Object.values(tmap) }
  }
  // 3) Только список команд
  if (Array.isArray(res?.teams)) {
    return generateSingleEliminationWithPrelims(res.teams.map(normalizeTeam))
  }
  // 4) Фолбэк: массив как список команд
  if (Array.isArray(res)) {
    return generateSingleEliminationWithPrelims(res.map(normalizeTeam))
  }
  return { rounds: [], teams: [] }
}

// Example initialization — только если нет props/endpoint/id
if (!tournamentData.value.rounds.length && !props.data && !props.endpoint && !props.tournamentId) {
  const sampleTeams = [
    { name: 'Team1', logo: 'team1' },
    { name: 'Team2', logo: 'team2' },
    { name: 'Team3', logo: 'team3' },
    { name: 'Team4', logo: 'team4' },
    { name: 'Team5', logo: 'team5' },
    { name: 'Team6', logo: 'team6' },
    { name: 'Team7', logo: 'team7' },
    { name: 'Team8', logo: 'team8' },
    { name: 'Team9', logo: 'team9' },
    { name: 'Team10', logo: 'team10' },
  ]
  tournamentData.value = generateSingleEliminationWithPrelims(sampleTeams)
}

// --- API fetch ---
const pending = ref(false)
const error = ref(null)

async function fetchBracket() {
  // Если явно переданы данные — нормализуем и показываем
  if (props.data) {
    tournamentData.value = normalizeBracket(props.data)
    // Save tournament status if available
    const tournamentNode = (props.data && (props.data.data?.tournament || props.data.tournament)) || null
    if (tournamentNode?.status) {
      tournamentStatus.value = tournamentNode.status
    }
    await nextTick(); setTimeout(calculateConnectors, 50)
    return
  }
  // Если нет источника — ничего не делаем
  if (!props.endpoint && !props.tournamentId) return

  pending.value = true; error.value = null
  try {
    const endpoint = props.endpoint || `/tournaments/${props.tournamentId}/bracket/`
    const res = await $api(endpoint)
    tournamentData.value = normalizeBracket(res)
    // Save tournament status if available
    const tournamentNode = (res && (res.data?.tournament || res.tournament)) || null
    if (tournamentNode?.status) {
      tournamentStatus.value = tournamentNode.status
    }
    await nextTick(); setTimeout(calculateConnectors, 50)
  } catch (e) {
    error.value = e?.message || 'Ошибка загрузки'
  } finally {
    pending.value = false
  }
}

// Computed property for all connectors
const allConnectors = computed(() => connectorData.value)

// Helper functions
const hasTeam = (t) => !!(t && (t.name || t.logo))
const teamName = (t) => hasTeam(t) ? (t.name || '—') : 'ожидание'

// Winner helpers
const isWinner = (roundIndex, matchIndex, teamIndex) => {
  const match = tournamentData.value.rounds[roundIndex]?.[matchIndex]
  if (!match) return false

  // Check winner field first
  if (match.winner) {
    const winnerId = match.winner.id
    if (teamIndex === 0 && match.team1?.id === winnerId) return true
    if (teamIndex === 1 && match.team2?.id === winnerId) return true
  }

  // Check result field
  if (match.result) {
    if (match.result === 'TEAM1_WIN' && teamIndex === 0) return true
    if (match.result === 'TEAM2_WIN' && teamIndex === 1) return true
  }

  // Fallback: if only one team is present, that team is winner
  return teamIndex === 0 ? !hasTeam(match.team2) : !hasTeam(match.team1)
}
const finalMatchRef = computed(() => {
  const rounds = tournamentData.value?.rounds || []
  const last = rounds[rounds.length - 1] || []
  return Array.isArray(last) && last.length ? last[0] : null
})
const winnerTeam = computed(() => {
  // 1) Победитель из API, если доступен
  const w = bracketMeta.value?.winner
  if (w && (w.name || w.logo)) {
    return w
  }

  // 2) Fallback: на основе финального матча
  const fm = finalMatchRef.value
  if (!fm) return null

  // Check winner field
  if (fm.winner) {
    return fm.winner
  }

  // Check result field
  if (fm.result === 'TEAM1_WIN') return fm.team1
  if (fm.result === 'TEAM2_WIN') return fm.team2

  // Fallback to old logic
  const t1 = fm.team1, t2 = fm.team2
  const h1 = hasTeam(t1), h2 = hasTeam(t2)
  if (h1 && !h2) return t1
  if (h2 && !h1) return t2
  return null
})
const winnerName = computed(() => {
  const wt = winnerTeam.value
  return wt ? (wt.name || '—') : 'Ожидание'
})

// Get round style for proper spacing
const getRoundStyle = (roundIndex) => {
  if (roundIndex === 0) {
    return { gap: '20px' }
  }
  const isWinnerRound = roundIndex === tournamentData.value.rounds.length
  const baseGap = isWinnerRound ? 40 : (55 * (roundIndex ** 2) + 50 * roundIndex + 20)
  if (isWinnerRound) {
    return { gap: `${baseGap}px`, marginLeft: '80px' }
  }
  return { gap: `${baseGap}px` }
}

// Calculate connectors
const calculateConnectors = async () => {
  await nextTick()

  if (!bracketContainer.value || !bracketContainer.value.parentNode) return

  const verticalConnectors = []
  const horizontalConnectors = []
  const rounds = safeQuerySelectorAll(bracketContainer.value, '.singelcsgo-round')
  const containerRect = safeGetBoundingClientRect(bracketContainer.value)
  if (!containerRect) return

  rounds.forEach((round, roundIndex) => {
    if (roundIndex === rounds.length - 1) return

    const matches = safeQuerySelectorAll(round, '.singelcsgo-match-wrapper')
    const nextRound = rounds[roundIndex + 1]
    const nextMatches = nextRound ? safeQuerySelectorAll(nextRound, '.singelcsgo-match-wrapper') : []

    for (let i = 0; i < matches.length; i += 2) {
      const match1 = matches[i]
      const match2 = matches[i + 1]

      if (!match1 || !match2) continue

      const rect1 = safeGetBoundingClientRect(safeQuerySelector(match1, '.singelcsgo-match'))
      const rect2 = safeGetBoundingClientRect(safeQuerySelector(match2, '.singelcsgo-match'))

      if (!rect1 || !rect2) continue

      const x = rect1.right - containerRect.left + 50
      const y1 = rect1.top + rect1.height / 2 - containerRect.top
      const y2 = rect2.top + rect2.height / 2 - containerRect.top
      const midY = (y1 + y2) / 2

      verticalConnectors.push({
        id: `v-${roundIndex}-${i}`,
        left: x,
        top: Math.min(y1, y2),
        height: Math.abs(y2 - y1)
      })

      const nextMatchIndex = Math.floor(i / 2)
      if (nextMatches[nextMatchIndex]) {
        const nextRect = safeGetBoundingClientRect(safeQuerySelector(nextMatches[nextMatchIndex], '.singelcsgo-match'))

        if (nextRect) {
        horizontalConnectors.push({
          id: `h-${roundIndex}-${i}`,
          left: x,
          top: midY - 1,
          width: nextRect.left - containerRect.left - x
        })
        }
      }
    }
  })

  connectorData.value = {
    vertical: verticalConnectors,
    horizontal: horizontalConnectors
  }

  try {
    const lastRound = rounds.length > 1 ? rounds[rounds.length - 2] : rounds[rounds.length - 1]
    const finalMatch = safeQuerySelector(lastRound, '.singelcsgo-match')
    const wb = winnerBlock.value
    if (finalMatch && wb && wb.parentNode) {
      const fmRect = safeGetBoundingClientRect(finalMatch)
      const wbRect = safeGetBoundingClientRect(wb)
      if (fmRect && wbRect) {
        const x = fmRect.right - containerRect.left
        const y = fmRect.top + fmRect.height / 2 - containerRect.top
        const width = wbRect.left - containerRect.left - x
        winnerConnector.value = { left: x, top: y - 1, width: Math.max(0, width) }
      } else {
        winnerConnector.value = null
      }
    } else {
      winnerConnector.value = null
    }
  } catch {
    winnerConnector.value = null
  }
}

// Zoom functions
const zoomIn = () => {
  if (currentScale.value < 1) {
    currentScale.value = Math.min(1, currentScale.value + 0.1)
  }
}
const zoomOut = () => {
  currentScale.value = Math.max(0.1, currentScale.value - 0.1)
}
const scaleStyle = computed(() => ({
  transform: `scale(${currentScale.value})`,
  transition: 'transform 0.3s ease'
}))

// Lifecycle hooks
onMounted(() => {
  fetchBracket()
  setTimeout(calculateConnectors, 100)
  window.addEventListener('resize', calculateConnectors)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateConnectors)
})

// Watch for data changes
watch(() => props.data, () => {
  if (props.data) {
    tournamentData.value = normalizeBracket(props.data)
    // Save tournament status if available
    const tournamentNode = (props.data && (props.data.data?.tournament || props.data.tournament)) || null
    if (tournamentNode?.status) {
      tournamentStatus.value = tournamentNode.status
    }
  } else {
    tournamentData.value = { rounds: [], teams: [] }
    tournamentStatus.value = null
  }
  nextTick(() => { setTimeout(calculateConnectors, 50) })
}, { deep: true })

watch(() => [props.tournamentId, props.endpoint], () => {
  fetchBracket()
})

// Match popup functions
const openMatchPopup = async (match, roundIndex, matchIndex) => {
  if (!match || (!hasTeam(match.team1) && !hasTeam(match.team2))) return

  // Check if match has started
  const hasStarted = match.status && ['IN_PROGRESS', 'LIVE', 'running', 'COMPLETED', 'finished', 'FINISHED'].includes(match.status)

  // clickAction === 'navigate' → всегда переход
  if (props.clickAction === 'navigate' && match.id) {
    await navigateTo(`/match/${props.tournamentId}/${match.id}`)
    return
  }
  // clickAction === 'auto' → переход только если матч начался
  if (props.clickAction === 'auto' && hasStarted && match.id) {
    await navigateTo(`/match/${props.tournamentId}/${match.id}`)
    return
  }

  // Show notification popup for matches that haven't started
  selectedMatch.value = match
  selectedMatchCoords.value = { roundIndex, matchIndex }
  showMatchPopup.value = true
  errorMessage.value = ''
}

const closeMatchPopup = () => {
  showMatchPopup.value = false
  selectedMatch.value = null
  errorMessage.value = ''
}

const startMatch = async () => {
  if (!selectedMatch.value?.id) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await $api(`/game/servers/matches/${selectedMatch.value.id}/start/`, {
      method: 'POST',
      body: {
        force_start: false
      }
    })
    // Обновим локальный статус, чтобы сразу показать в UI
    if (selectedMatch.value) {
      selectedMatch.value.status = selectedMatch.value.status || 'IN_PROGRESS'
      // Нормализуем в "IN_PROGRESS" для подсветки
      selectedMatch.value.status = 'IN_PROGRESS'
    }
    // Подтянем актуальные данные сетки
    await refreshMatchStatus()
    // Одноразовое обновление страницы (по просьбе)
    if (typeof window !== 'undefined') {
      setTimeout(() => { try { window.location.reload() } catch {} }, 500)
    }
  } catch (error) {
  const err = extractError(error)
  errorMessage.value = `Ошибка запуска матча: ${err.message}`
  if (err.status === 403) canStartPermission.value = false
  } finally {
    isLoading.value = false
  }
}

const stopMatch = async () => {
  if (!selectedMatch.value?.id) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await $api(`/game/servers/matches/${selectedMatch.value.id}/stop/`, {
      method: 'POST',
      body: {
        reason: 'Stopped by admin'
      }
    })
    
  } catch (error) {
  const err = extractError(error)
  errorMessage.value = `Ошибка остановки матча: ${err.message}`
  if (err.status === 403) canStopPermission.value = false
  } finally {
    isLoading.value = false
  }
}

const refreshMatchStatus = async () => {
  if (props.tournamentId) {
    await fetchBracket()
  }
}

// Status helpers
const getStatusText = (status) => {
  const statusMap = {
    'SCHEDULED': 'Запланирован',
    'READY': 'Готов к запуску',
    'IN_PROGRESS': 'В процессе',
    'LIVE': 'В процессе',
    'COMPLETED': 'Завершен',
    'FINISHED': 'Завершен',
    'CANCELLED': 'Отменен',
    'pending': 'Ожидание',
    'running': 'Идет',
    'finished': 'Завершен'
  }
  return statusMap[status] || status || 'Неизвестно'
}

const getStatusClass = (status) => {
  if (['SCHEDULED', 'pending'].includes(status)) return 'status-scheduled'
  if (['READY'].includes(status)) return 'status-ready'
  if (['IN_PROGRESS', 'LIVE', 'running'].includes(status)) return 'status-running'
  if (['COMPLETED', 'finished', 'FINISHED'].includes(status)) return 'status-completed'
  if (['CANCELLED'].includes(status)) return 'status-cancelled'
  return 'status-unknown'
}

const canStartMatch = computed(() => {
  // Админам можно пытаться запускать по статусам
  const status = selectedMatch.value?.status
  if (props.adminControls && canStartPermission.value) {
    return status && ['SCHEDULED', 'READY', 'pending'].includes(status)
  }

  // If tournament is ongoing, matches can be started regardless of scheduled time
  if (tournamentStatus.value === 'ONGOING') {
    return status && ['SCHEDULED', 'READY', 'pending'].includes(status)
  }
  
  // Otherwise, check the match's can_start field if available
  if (selectedMatch.value?.can_start !== undefined) {
    return canStartPermission.value && selectedMatch.value.can_start
  }
  
  // Fallback to status-based logic
  return canStartPermission.value && (status && ['SCHEDULED', 'READY', 'pending'].includes(status))
})

const canStopMatch = computed(() => {
  const status = selectedMatch.value?.status
  return canStopPermission.value && (status && ['IN_PROGRESS', 'LIVE', 'running'].includes(status))
})

const isMatchStarted = computed(() => {
  const status = selectedMatch.value?.status
  return status && ['IN_PROGRESS', 'LIVE', 'running', 'COMPLETED', 'finished', 'FINISHED'].includes(status)
})

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Expose methods
defineExpose({
  updateBracket: (newData) => {
    if (newData?.rounds) {
      tournamentData.value = newData
    } else if (Array.isArray(newData?.teams) ) {
      tournamentData.value = generateSingleEliminationWithPrelims(newData.teams)
    } else {
      tournamentData.value = generateSingleEliminationWithPrelims(newData || [])
    }
    nextTick(() => {
      setTimeout(calculateConnectors, 50)
    })
  },
  getTeams: () => (tournamentData.value?.teams || []),
})
</script>

<style scoped>
.zoom-controls {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  color: #fff;
  font-size: 14px;
  position: absolute;
  right: 50px;
  z-index: 2;
}

.zoom-btn {
  font-size: 24px;
  width: 50px;
  height: 50px;
  border: 2px solid #fff;
  background: #6bb6ff;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.zoom-btn:hover {
  background: #ddd;
}

.singelcsgo-bracket-wrapper {
  height: 75vh;
  width: 100%;
  background: #fff;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  overflow: auto;
}

.singelcsgo-bracket-container {
  display: inline-flex;
  align-items: center;
  gap: 100px;
  position: relative;
  min-width: 100%;
  min-height: 100%;
}

.singelcsgo-bracket-scroll {
  width: 100%;
  height: 100%;
  /* overflow: auto; */
}

.singelcsgo-round {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.singelcsgo-match-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.singelcsgo-match {
  display: flex;
  flex-direction: column;
  background: #1c1f26;
  border: 2px solid #2a2d36;
  border-radius: 10px;
  overflow: hidden;
  min-width: 184px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 10;
  cursor: pointer;
  transition: all 0.3s ease;
}

.singelcsgo-team {
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: #1c1f26;
  transition: background-color 0.3s ease;
  min-height: 40px;
}

.singelcsgo-team:not(:last-child) {
  border-bottom: 1px solid #2a2d36;
}

.singelcsgo-team.winner {
  background: #6bb6ff;
  color: #fff;
}

.singelcsgo-team:hover {
  background: #fff;
  color: #6bb6ff;
}

.singelcsgo-team-logo {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.team-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.team-info .team-name {
  font-size: 14px;
  font-weight: 600;
  color: inherit;
}

.team-info .team-tag {
  font-size: 10px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
}

.singelcsgo-team-logo.navi {
  color: #6bb6ff;
  font-weight: bold;
}

.singelcsgo-team-logo.spirit {
  color: #6bb6ff;
}

/* Connectors */
.singelcsgo-connector-horizontal {
  position: absolute;
  right: -50px;
  top: 50%;
  width: 50px;
  height: 2px;
  background: #6bb6ff;
  z-index: 1;
  transform: translateY(-50%);
}

.singelcsgo-connector-vertical {
  position: absolute;
  width: 2px;
  background: #6bb6ff;
  z-index: 1;
}

.singelcsgo-connector-horizontal-bridge {
  position: absolute;
  height: 2px;
  background: #6bb6ff;
  z-index: 1;
}

.singelcsgo-winner-round {
  margin-left: 80px;
}

.match-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.match-popup {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.match-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e5e5;
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

.match-popup-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e5e5e5;
  color: #333;
}

.match-popup-content {
  padding: 20px;
}

.match-info {
  margin-bottom: 20px;
}

.match-teams {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.team {
  flex: 1;
  text-align: center;
}

.team .team-name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
  display: block;
}

.team .team-tag {
  font-size: 12px;
  color: #666;
  font-weight: 500;
  margin-top: 2px;
  display: block;
}

.team-tag {
  font-size: 12px;
  color: #666;
  font-weight: 500;
  margin-top: 2px;
  display: block;
}

.vs {
  font-weight: bold;
  color: #6bb6ff;
  font-size: 18px;
}

.match-status, .server-info, .match-duration {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.match-status:last-child, .server-info:last-child, .match-duration:last-child {
  border-bottom: none;
}

.status-label, .info-label {
  font-weight: 600;
  color: #666;
}

.status-value, .info-value {
  font-weight: 500;
}

.status-scheduled { color: #ffa500; }
.status-ready { color: #28a745; }
.status-running { color: #17a2b8; }
.status-completed { color: #6c757d; }
.status-cancelled { color: #dc3545; }
.status-unknown { color: #6c757d; }

.match-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.control-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.control-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.start-btn {
  background: #28a745;
  color: white;
}

.start-btn:hover:not(:disabled) {
  background: #218838;
}

.stop-btn {
  background: #dc3545;
  color: white;
}

.stop-btn:hover:not(:disabled) {
  background: #c82333;
}

.refresh-btn {
  background: #6c757d;
  color: white;
}

.refresh-btn:hover:not(:disabled) {
  background: #5a6268;
}

.error-message {
  margin-top: 16px;
  padding: 12px;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  font-size: 14px;
}

.match-notification {
  text-align: center;
  padding: 16px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 6px;
  margin: 16px 0;
}

.match-notification p {
  margin: 0;
  color: #856404;
  font-size: 14px;
}

/* Responsive design */
@media (max-width: 1200px) {
  /* .singelcsgo-bracket-container {
    gap: 60px;
  } */

  /* .singelcsgo-connector-horizontal {
    width: 30px;
    right: -30px;
  } */
}

@media (max-width: 768px) {
  .singelcsgo-bracket-wrapper {
    padding: 20px;
  }

  /* .singelcsgo-bracket-container {
    gap: 40px;
  } */

  .singelcsgo-match {
    min-width: 120px;
  }

  .singelcsgo-team {
    padding: 8px 12px;
  }

  .team-info .team-name {
    font-size: 12px;
  }

  .team-info .team-tag {
    font-size: 9px;
  }
}
</style>