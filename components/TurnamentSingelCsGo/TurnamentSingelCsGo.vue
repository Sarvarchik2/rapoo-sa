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
            <div class="singelcsgo-match">
              <div class="singelcsgo-team" :class="{ winner: isWinner(roundIndex, matchIndex, 0) }">
                <div v-if="hasTeam(match.team1)" :class="`singelcsgo-team-logo ${match.team1.logo || ''}`">
                  {{ (match.team1.logo || '') === 'navi' ? '🏆' : '🦅' }}
                </div>
                <span>{{ teamName(match.team1) }}</span>
              </div>
              <div class="singelcsgo-team" :class="{ winner: isWinner(roundIndex, matchIndex, 1) }">
                <div v-if="hasTeam(match.team2)" :class="`singelcsgo-team-logo ${match.team2?.logo || ''}`">
                  {{ (match.team2?.logo || '') === 'navi' ? '🏆' : '🦅' }}
                </div>
                <span>{{ teamName(match.team2) }}</span>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
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
  }
})

// Reactive references
const bracketContainer = ref(null)
const winnerBlock = ref(null)
const connectorData = ref({ vertical: [], horizontal: [] })
const winnerConnector = ref(null)
const currentScale = ref(1.0)

// Tournament data
const tournamentData = ref(props.data || { rounds: [], teams: [] })
// Meta from API (e.g., declared winner)
const bracketMeta = ref({ winner: null })

// Runtime config for API base
const config = useRuntimeConfig()
const API_BASE = (config.public?.apiBase || '').toString()

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
      name: val.name || val.title || val.team_name || '',
      logo: val.logo || val.logo_url || ''
    }
  }
  return {}
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
  // Unwrap common nesting
  const bracketNode = (res && (res.data?.bracket || res.bracket)) || null
  const tournamentNode = (res && (res.data?.tournament || res.tournament)) || null
  if (tournamentNode?.winner) {
    bracketMeta.value.winner = normalizeTeam(tournamentNode.winner)
  }

  // data.bracket.rounds may be an object keyed by round names
  if (bracketNode && bracketNode.rounds) {
    const r = bracketNode.rounds
    if (Array.isArray(r)) {
      const rounds = r.map(arr => (Array.isArray(arr) ? arr : (arr?.matches || []))).map(marr =>
        marr.map(m => ({ team1: normalizeTeam(m.team1), team2: normalizeTeam(m.team2) }))
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
      const rounds = entries.map(e => e.arr.map(m => ({
        team1: normalizeTeam(m.team1),
        team2: normalizeTeam(m.team2),
      })))
      return { rounds, teams: res.teams || [] }
    }
  }

  // 1) Уже готовые раунды [{ team1, team2 }, ...]
  if (Array.isArray(res?.rounds)) {
    const rounds = res.rounds.map(r => r.map(m => ({
      team1: normalizeTeam(m.team1),
      team2: normalizeTeam(m.team2),
    })))
    return { rounds, teams: res.teams || [] }
  }
  // 2) Описание матчей + round (+ teams)
  if (Array.isArray(res?.matches)) {
    const tmap = buildTeamMap(res)
    const grouped = groupByRound(res.matches)
    const rounds = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b)
      .map(k => grouped[k].map(m => ({
        team1: normalizeTeam(tmap[m.team1_id] || m.team1),
        team2: normalizeTeam(tmap[m.team2_id] || m.team2),
      })))
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
    await nextTick(); setTimeout(calculateConnectors, 50)
    return
  }
  // Если нет источника — ничего не делаем
  if (!props.endpoint && !props.tournamentId) return

  pending.value = true; error.value = null
  try {
    const url = props.endpoint || `${API_BASE}/tournaments/${props.tournamentId}/bracket/`
    const res = await $fetch(url, { credentials: 'include' })
    tournamentData.value = normalizeBracket(res)
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
  const match = tournamentData.value.rounds[roundIndex][matchIndex]
  return teamIndex === 0 ? !hasTeam(match.team2) : !hasTeam(match.team1)
}
const finalMatchRef = computed(() => {
  const rounds = tournamentData.value?.rounds || []
  const last = rounds[rounds.length - 1] || []
  return Array.isArray(last) && last.length ? last[0] : null
})
const winnerTeam = computed(() => {
  if (bracketMeta.value?.winner && (bracketMeta.value.winner.name || bracketMeta.value.winner.logo)) {
    return bracketMeta.value.winner
  }
  const fm = finalMatchRef.value
  if (!fm) return null
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

  if (!bracketContainer.value) return

  const verticalConnectors = []
  const horizontalConnectors = []
  const rounds = bracketContainer.value.querySelectorAll('.singelcsgo-round')
  const containerRect = bracketContainer.value.getBoundingClientRect()

  rounds.forEach((round, roundIndex) => {
    if (roundIndex === rounds.length - 1) return

    const matches = round.querySelectorAll('.singelcsgo-match-wrapper')
    const nextRound = rounds[roundIndex + 1]
    const nextMatches = nextRound ? nextRound.querySelectorAll('.singelcsgo-match-wrapper') : []

    for (let i = 0; i < matches.length; i += 2) {
      const match1 = matches[i]
      const match2 = matches[i + 1]

      if (!match1 || !match2) continue

      const rect1 = match1.querySelector('.singelcsgo-match').getBoundingClientRect()
      const rect2 = match2.querySelector('.singelcsgo-match').getBoundingClientRect()

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
        const nextRect = nextMatches[nextMatchIndex].querySelector('.singelcsgo-match').getBoundingClientRect()

        horizontalConnectors.push({
          id: `h-${roundIndex}-${i}`,
          left: x,
          top: midY - 1,
          width: nextRect.left - containerRect.left - x
        })
      }
    }
  })

  connectorData.value = {
    vertical: verticalConnectors,
    horizontal: horizontalConnectors
  }

  try {
    const lastRound = rounds.length > 1 ? rounds[rounds.length - 2] : rounds[rounds.length - 1]
    const finalMatch = lastRound?.querySelector('.singelcsgo-match')
    const wb = winnerBlock.value
    if (finalMatch && wb) {
      const fmRect = finalMatch.getBoundingClientRect()
      const wbRect = wb.getBoundingClientRect()
      const x = fmRect.right - containerRect.left + 50
      const y = fmRect.top + fmRect.height / 2 - containerRect.top
      const width = wbRect.left - containerRect.left - x
      winnerConnector.value = { left: x, top: y - 1, width: Math.max(0, width) }
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
  } else {
    tournamentData.value = { rounds: [], teams: [] }
  }
  nextTick(() => { setTimeout(calculateConnectors, 50) })
}, { deep: true })

watch(() => [props.tournamentId, props.endpoint], () => {
  fetchBracket()
})

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
  min-width: 160px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 10;
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

.singelcsgo-connector-horizontal::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  width: 0;
  height: 0;
  border-left: 6px solid #6bb6ff;
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;
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

.singelcsgo-connector-horizontal-bridge::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  width: 0;
  height: 0;
  border-left: 6px solid #6bb6ff;
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;
  transform: translateY(-50%);
}

.singelcsgo-winner-round {
  margin-left: 80px;
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
    font-size: 12px;
  }
}
</style>