<template>
  <div class="tournament-double-bracket-wrapper">
    <div class="tournament-double-zoom-controls">
      <button @click="zoomIn" class="tournament-double-zoom-btn tournament-double-zoom-plus">+</button>
      <button @click="zoomOut" class="tournament-double-zoom-btn tournament-double-zoom-minus">-</button>
      <span>Scale: {{ currentScale.toFixed(1) }}</span>
    </div>
    
    <div class="tournament-double-bracket-scroll" :style="scaleStyle">
      <!-- Панель тестирования для локальных данных -->
      <div v-if="useLocalTeams" class="tournament-double-test-panel">
        <div class="test-buttons">
          <span>Количество команд:</span>
          <button @click="setTeamCount(4)" class="test-btn">4</button>
          <button @click="setTeamCount(6)" class="test-btn">6</button>
          <button @click="setTeamCount(8)" class="test-btn">8</button>
          <button @click="setTeamCount(10)" class="test-btn">10</button>
          <button @click="setTeamCount(12)" class="test-btn">12</button>
          <button @click="toggleDataSource" class="test-btn toggle">Переключить на API</button>
        </div>
      </div>
      
      <div class="tournament-double-bracket-container" ref="bracketContainer">
        
        <div class="tournament-double-bracket-section tournament-double-winners-bracket">
          <div class="tournament-double-bracket-rounds">
            <div 
              v-for="(round, roundIndex) in winnersRounds" 
              :key="`wb-${roundIndex}`" 
              class="tournament-double-round"
              :class="`tournament-double-round-${roundIndex + 1}`"
              :style="getRoundStyle(roundIndex, true)"
            >
              <div 
                v-for="(match, matchIndex) in round" 
                :key="`wb-match-${roundIndex}-${matchIndex}`"
                class="tournament-double-match-wrapper"
              >
                <div class="tournament-double-match" @click="openMatch(match)">
                  <div class="tournament-double-team" :class="{ winner: isWinner(match, 0) }">
                    <div v-if="hasTeam(match.team1)" class="tournament-double-team-logo">
                      {{ getTeamEmoji(match.team1) }}
                    </div>
                    <span>{{ teamName(match.team1) }}</span>
                    <span v-if="match.team1_score !== undefined" class="tournament-double-score">{{ match.team1_score }}</span>
                  </div>
                  <div class="tournament-double-team" :class="{ winner: isWinner(match, 1) }">
                    <div v-if="hasTeam(match.team2)" class="tournament-double-team-logo">
                      {{ getTeamEmoji(match.team2) }}
                    </div>
                    <span>{{ teamName(match.team2) }}</span>
                    <span v-if="match.team2_score !== undefined" class="tournament-double-score">{{ match.team2_score }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Winners right rail: semifinal and final on the right side -->
      

        <!-- Loser's Bracket -->
        <div class="tournament-double-bracket-section tournament-double-losers-bracket">
          <div class="tournament-double-bracket-rounds">
            <div 
              v-for="(round, roundIndex) in losersRounds" 
              :key="`lb-${roundIndex}`" 
              class="tournament-double-round"
              :class="`tournament-double-round-${roundIndex + 1}`"
              :style="getRoundStyle(roundIndex, false)"
            >
              <div 
                v-for="(match, matchIndex) in round" 
                :key="`lb-match-${roundIndex}-${matchIndex}`"
                class="tournament-double-match-wrapper"
              >
                <div class="tournament-double-match" @click="openMatch(match)">
                  <div class="tournament-double-team" :class="{ winner: isWinner(match, 0) }">
                    <div v-if="hasTeam(match.team1)" class="tournament-double-team-logo">
                      {{ getTeamEmoji(match.team1) }}
                    </div>
                    <span>{{ teamName(match.team1) }}</span>
                    <span v-if="match.team1_score !== undefined" class="tournament-double-score">{{ match.team1_score }}</span>
                  </div>
                  <div class="tournament-double-team" :class="{ winner: isWinner(match, 1) }">
                    <div v-if="hasTeam(match.team2)" class="tournament-double-team-logo">
                      {{ getTeamEmoji(match.team2) }}
                    </div>
                    <span>{{ teamName(match.team2) }}</span>
                    <span v-if="match.team2_score !== undefined" class="tournament-double-score">{{ match.team2_score }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Grand Final (supports reset for WB champion two lives) -->
        <div class="tournament-double-bracket-section tournament-double-grand-final-section">
          <div class="tournament-double-grand-final-wrapper" ref="grandFinalBlock" :style="grandFinalWrapperStyle">
            <!-- Grand Final 1 -->
            <div v-if="grandFinal1" class="tournament-double-match tournament-double-grand-final-match" @click="openMatch(grandFinal1)">
              <div class="tournament-double-team" :class="{ winner: isWinner(grandFinal1, 0) }">
                <div v-if="hasTeam(grandFinal1.team1)" class="tournament-double-team-logo">
                  {{ getTeamEmoji(grandFinal1.team1) }}
                </div>
                <span>{{ teamName(grandFinal1.team1) }}</span>
                <span v-if="grandFinal1.team1_score !== undefined" class="tournament-double-score">{{ grandFinal1.team1_score }}</span>
              </div>
              <div class="tournament-double-team" :class="{ winner: isWinner(grandFinal1, 1) }">
                <div v-if="hasTeam(grandFinal1.team2)" class="tournament-double-team-logo">
                  {{ getTeamEmoji(grandFinal1.team2) }}
                </div>
                <span>{{ teamName(grandFinal1.team2) }}</span>
                <span v-if="grandFinal1.team2_score !== undefined" class="tournament-double-score">{{ grandFinal1.team2_score }}</span>
              </div>
            </div>

            <!-- Grand Final Reset -->
            <div v-if="shouldShowGrandFinalReset" class="tournament-double-match tournament-double-grand-final-match" ref="grandFinalResetBlock" @click="openMatch(grandFinalReset)">
              <div class="tournament-double-team" :class="{ winner: isWinner(grandFinalReset, 0) }">
                <div v-if="hasTeam(grandFinalReset.team1)" class="tournament-double-team-logo">
                  {{ getTeamEmoji(grandFinalReset.team1) }}
                </div>
                <span>{{ teamName(grandFinalReset.team1) }}</span>
                <span v-if="grandFinalReset.team1_score !== undefined" class="tournament-double-score">{{ grandFinalReset.team1_score }}</span>
              </div>
              <div class="tournament-double-team" :class="{ winner: isWinner(grandFinalReset, 1) }">
                <div v-if="hasTeam(grandFinalReset.team2)" class="tournament-double-team-logo">
                  {{ getTeamEmoji(grandFinalReset.team2) }}
                </div>
                <span>{{ teamName(grandFinalReset.team2) }}</span>
                <span v-if="grandFinalReset.team2_score !== undefined" class="tournament-double-score">{{ grandFinalReset.team2_score }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Winner Display -->
        <div class="tournament-double-bracket-section tournament-double-winner-section">
          <div class="tournament-double-winner-wrapper" ref="winnerBlock" :style="winnerWrapperStyle">
            <div class="tournament-double-match tournament-double-winner-match">
              <div class="tournament-double-team winner">
                <div v-if="winnerTeam" class="tournament-double-team-logo">🏆</div>
                <span>{{ winnerName }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Connectors for Winner's Bracket -->
        <div v-for="connector in winnersConnectors.vertical" :key="connector.id" 
             class="tournament-double-connector-vertical tournament-double-winners" 
             :style="{
               left: `${connector.left}px`,
               top: `${connector.top}px`,
               height: `${connector.height}px`
             }">
        </div>

        <div v-for="connector in winnersConnectors.horizontal" :key="connector.id"
             class="tournament-double-connector-horizontal-bridge tournament-double-winners" 
             :style="{
               left: `${connector.left}px`,
               top: `${connector.top}px`,
               width: `${connector.width}px`
             }">
        </div>

        <!-- Connectors for Loser's Bracket -->
        <!-- <div v-for="connector in losersConnectors.vertical" :key="connector.id" 
             class="tournament-double-connector-vertical tournament-double-losers" 
             :style="{
               left: `${connector.left}px`,
               top: `${connector.top}px`,
               height: `${connector.height}px`
             }">
        </div> -->

        <div v-for="connector in losersConnectors.horizontal" :key="connector.id"
             class="tournament-double-connector-horizontal-bridge tournament-double-losers" 
             :style="{
               left: `${connector.left}px`,
               top: `${connector.top}px`,
               width: `${connector.width}px`
             }">
        </div>

  

        <!-- Grand Final connectors -->
        <div v-if="grandFinalConnector" 
             class="tournament-double-connector-horizontal-bridge"
             :style="{ 
               left: `${grandFinalConnector.left}px`, 
               top: `${grandFinalConnector.top}px`, 
               width: `${grandFinalConnector.width}px` 
             }">
        </div>

        <!-- Losers Final -> Grand Final connectors (L-shape) -->
        <div v-if="losersFinalStubConnector" 
             class="tournament-double-connector-horizontal-bridge"
             :style="{ 
               left: `${losersFinalStubConnector.left}px`, 
               top: `${losersFinalStubConnector.top}px`, 
               width: `${losersFinalStubConnector.width}px` 
             }">
        </div>
        <div v-if="losersFinalVerticalConnector" 
             class="tournament-double-connector-vertical"
             :style="{ 
               left: `${losersFinalVerticalConnector.left}px`, 
               top: `${losersFinalVerticalConnector.top}px`, 
               height: `${losersFinalVerticalConnector.height}px` 
             }">
        </div>
        <div v-if="losersFinalConnector" 
             class="tournament-double-connector-horizontal-bridge"
             :style="{ 
               left: `${losersFinalConnector.left}px`, 
               top: `${losersFinalConnector.top}px`, 
               width: `${losersFinalConnector.width}px` 
             }">
        </div>

     <!-- Grand Final 1 -> Reset connector -->
     <div v-if="grandFinalResetConnector" 
       class="tournament-double-connector-horizontal-bridge"
       :style="{ 
      left: `${grandFinalResetConnector.left}px`, 
      top: `${grandFinalResetConnector.top}px`, 
      width: `${grandFinalResetConnector.width}px` 
       }">
     </div>

        <!-- Winner connector -->
        <div v-if="winnerConnector" 
             class="tournament-double-connector-horizontal-bridge"
             :style="{ 
               left: `${winnerConnector.left}px`, 
               top: `${winnerConnector.top}px`, 
               width: `${winnerConnector.width}px` 
             }">
        </div>

     <!-- Inter-bracket vertical connectors (WB -> LB) -->
     <div v-for="connector in interBracketConnectors" :key="connector.id" 
       class="tournament-double-connector-vertical tournament-double-winners"
       :style="{ left: `${connector.left}px`, top: `${connector.top}px`, height: `${connector.height}px` }">
     </div>
      </div>
    </div>
  </div>

  <div v-if="showMatchPopup" class="match-popup-overlay" @click="showMatchPopup=false">
    <div class="match-popup" @click.stop>
      <div class="match-popup-header">
        <h3>{{ isMatchStarted ? 'Управление матчем' : 'Матч еще не начался' }}</h3>
        <button @click="showMatchPopup=false" class="close-btn">×</button>
      </div>
      <div class="match-popup-content">
        <div class="match-info">
          <div class="match-teams">
            <div class="team"><span class="team-name">{{ selectedMatch?.team1?.name || 'Команда 1' }}</span></div>
            <div class="vs">VS</div>
            <div class="team"><span class="team-name">{{ selectedMatch?.team2?.name || 'Команда 2' }}</span></div>
          </div>
          <div v-if="isMatchStarted" class="match-status">
            <span class="status-label">Статус:</span>
            <span class="status-value" :class="getStatusClass(selectedMatch?.status)">{{ getStatusText(selectedMatch?.status) }}</span>
          </div>
          <div v-else class="match-notification">
            <p>Матч еще не начался. Вы сможете просмотреть подробную информацию после начала матча.</p>
          </div>
        </div>
        <div v-if="isMatchStarted || adminControls" class="match-controls">
          <button v-if="canStartMatch" @click="startMatch" :disabled="isLoading" class="control-btn start-btn">{{ isLoading ? 'Запуск...' : 'Запустить матч' }}</button>
          <button v-if="canStopMatch" @click="stopMatch" :disabled="isLoading" class="control-btn stop-btn">{{ isLoading ? 'Остановка...' : 'Остановить матч' }}</button>
          <button @click="refreshMatchStatus" :disabled="isLoading" class="control-btn refresh-btn">{{ isLoading ? 'Обновление...' : 'Обновить статус' }}</button>
        </div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
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
  tournamentId: {
    type: [String, Number],
    default: null
  },
  endpoint: {
    type: String,
    default: null
  },
  // Поведение клика по матчу: 'auto' | 'navigate' | 'popup'
  clickAction: {
    type: String,
    default: 'auto'
  },
  // Показывать админ-контролы (Старт/Стоп) даже до старта матча
  adminControls: {
    type: Boolean,
    default: false
  }
})

// Reactive references
const bracketContainer = ref(null)
const winnerBlock = ref(null)
const grandFinalBlock = ref(null)
const grandFinalResetBlock = ref(null)
const currentScale = ref(1.0)
// dynamic right-rail positioning
const winnerWrapperStyle = ref({})
const grandFinalWrapperStyle = ref({})

// Popup / match control state
const showMatchPopup = ref(false)
const selectedMatch = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
const canStartPermission = ref(true)
const canStopPermission = ref(true)

// Tournament data - используем структуру как в single elimination
const tournamentData = ref(props.data || { winnersRounds: [], losersRounds: [], grandFinal: null, grandFinalReset: null, teams: [] })
const bracketMeta = ref({ winner: null })
const tournamentStatus = ref(null)

// Локальные команды для тестирования (потом заменим на API)
const localTeams = ref([
  { id: 1, name: 'NAVI', logo: '🔶' },
  { id: 2, name: 'SPIRIT', logo: '🏠' },
  { id: 3, name: 'Virtus.pro', logo: '🐺' },
  { id: 4, name: 'G2 Esports', logo: '⚡' },
  { id: 5, name: 'FaZe Clan', logo: '🔥' },
  { id: 6, name: 'Cloud9', logo: '☁️' },
  { id: 7, name: 'Team Liquid', logo: '💧' },
  { id: 8, name: 'Astralis', logo: '⭐' },
  { id: 9, name: 'Fnatic', logo: '🧡' },
  { id: 10, name: 'NiP', logo: '👑' },
  { id: 11, name: 'mousesports', logo: '🖱️' },
  { id: 12, name: 'ENCE', logo: '🇫🇮' }
])

// Флаг для переключения между локальными данными и API
const useLocalTeams = ref(true)

// Функция получения команд
function getTeams() {
  if (useLocalTeams.value) {
    return localTeams.value
  }
  // TODO: Здесь будет API запрос за командами
  return []
}

// Функция для тестирования с разным количеством команд
function setTeamCount(count) {
  if (count > localTeams.value.length) {
    console.warn(`Requested ${count} teams, but only ${localTeams.value.length} available`)
    count = localTeams.value.length
  }
  const selectedTeams = localTeams.value.slice(0, count)
  tournamentData.value = generateDoubleEliminationWithPrelims(selectedTeams)
  nextTick(() => {
    setTimeout(calculateConnectors, 50)
  })
}

// Функция переключения между локальными данными и API
function toggleDataSource() {
  useLocalTeams.value = !useLocalTeams.value
  fetchBracket()
}

// Коннекторы объединены как в single elimination
const allConnectors = ref({ vertical: [], horizontal: [] })
const winnersConnectors = ref({ vertical: [], horizontal: [] })
const losersConnectors = ref({ vertical: [], horizontal: [] })
const interBracketConnectors = ref([])
const grandFinalConnector = ref(null)
// Losers Final -> GF: L-shaped connectors
const losersFinalStubConnector = ref(null)
const losersFinalVerticalConnector = ref(null)
const losersFinalConnector = ref(null)
const winnerConnector = ref(null)
const grandFinalResetConnector = ref(null)

// Runtime config for API base
const config = useRuntimeConfig()
const API_BASE = (config.public?.apiBase || '').toString()
const { $api } = useNuxtApp()

// API fetch state
const pending = ref(false)
const error = ref(null)

// Helper functions
function normalizeTeam(val) {
  if (!val) return {}
  if (typeof val === 'string') return { name: val }
  if (typeof val === 'object') {
    return {
      name: val.name || val.title || val.team_name || '',
      logo: val.logo || val.logo_url || '',
      id: val.id
    }
  }
  return {}
}

function normalizeDoubleElimBracket(res) {
  // Handle nested data structure
  const bracketNode = (res && (res.data?.bracket || res.bracket)) || null
  const tournamentNode = (res && (res.data?.tournament || res.tournament)) || null
  
  if (tournamentNode?.winner) {
    bracketMeta.value.winner = normalizeTeam(tournamentNode.winner)
  }
  if (tournamentNode?.status) {
    tournamentStatus.value = String(tournamentNode.status)
  }

  if (bracketNode && bracketNode.rounds) {
    const rounds = bracketNode.rounds
    
    // Handle object format with round names
    if (rounds && typeof rounds === 'object') {
  const winnersRounds = []
  const losersRounds = []
  let grandFinal = null
  let grandFinalReset = null

      // Sort rounds by typical double elimination order
      const entries = Object.entries(rounds)
      
      for (const [roundName, matches] of entries) {
        const normalizedMatches = (Array.isArray(matches) ? matches : []).map(m => ({
          ...m,
          team1: normalizeTeam(m.team1),
          team2: normalizeTeam(m.team2)
        }))

        const lname = roundName.toLowerCase()
        if (lname.includes('grand final reset') || lname.includes('final reset') || lname.includes('bracket reset')) {
          grandFinalReset = normalizedMatches[0] || null
        } else if (lname.includes('grand final')) {
          grandFinal = normalizedMatches[0] || null
        } else if (roundName.toLowerCase().includes('wb') || roundName.toLowerCase().includes('winner')) {
          winnersRounds.push(normalizedMatches)
        } else if (roundName.toLowerCase().includes('lb') || roundName.toLowerCase().includes('loser')) {
          losersRounds.push(normalizedMatches)
        } else {
          // Default to winners bracket for unknown rounds
          winnersRounds.push(normalizedMatches)
        }
      }

      return { 
        winnersRounds, 
        losersRounds, 
        grandFinal, 
        grandFinalReset,
        teams: res.teams || [] 
      }
    }
  }

  // Fallback: generate sample double elimination bracket
  return generateSampleDoubleElimination()
}

// Generate double-elimination bracket with adaptive team count (like single elimination)
function highestPowerOfTwoLE(n) { 
  let p = 1
  while (p * 2 <= n) { p *= 2 }
  return p
}

// Simple fallback sample when API normalization fails
function generateSampleDoubleElimination() {
  const teams = getTeams()
  const n = Math.max(4, Math.min(8, teams.length || 8))
  return generateDoubleEliminationWithPrelims(teams.slice(0, n))
}

function generateDoubleEliminationWithPrelims(teams) {
  const n = Array.isArray(teams) ? teams.length : 0
  if (n === 0) return { winnersRounds: [], losersRounds: [], grandFinal: null, grandFinalReset: null, teams: [] }
  
  const base = highestPowerOfTwoLE(n)
  const prelimMatches = n - base
  const prelimTeamsCount = prelimMatches * 2
  const byesCount = n - prelimTeamsCount

  // Fix: Best teams get byes, worst play prelim
  const byesTeams = teams.slice(0, byesCount)
  const prelimTeams = teams.slice(byesCount)

  const winnersRounds = []
  
  // Preliminary round for Winner's bracket (if needed)
  if (prelimMatches > 0) {
    const r0 = []
    for (let i = 0; i < prelimTeamsCount; i += 2) {
      const a = prelimTeams[i] ? { name: prelimTeams[i].name, logo: prelimTeams[i].logo } : null
      const b = prelimTeams[i + 1] ? { name: prelimTeams[i + 1].name, logo: prelimTeams[i + 1].logo } : null
      r0.push({ team1: a, team2: b })
    }
    winnersRounds.push(r0)
  }

  // Winner's bracket main rounds
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
  winnersRounds.push(r1)

  // Subsequent rounds for Winner's bracket
  let matches = r1.length
  while (matches > 1) {
    const round = []
    for (let i = 0; i < matches; i += 2) { 
      round.push({ team1: {}, team2: {} }) 
    }
    winnersRounds.push(round)
    matches = Math.floor(matches / 2)
  }

  // Generate Loser's bracket (simpler structure)
  const losersRounds = []
  let losersMatches = Math.floor(base / 2) // Start with half the teams
  
  while (losersMatches > 0) {
    const round = []
    for (let i = 0; i < losersMatches; i++) {
      round.push({ team1: {}, team2: {} })
    }
    losersRounds.push(round)
    losersMatches = Math.floor(losersMatches / 2)
  }

  // Grand final
  const grandFinal = { team1: {}, team2: {}, wbIsTeam1: true }
  const grandFinalReset = null

  return { winnersRounds, losersRounds, grandFinal, grandFinalReset, teams }
}

// Initialize adaptive bracket if no props provided
if (!tournamentData.value.winnersRounds.length && !props.data && !props.endpoint && !props.tournamentId) {
  // Используем локальные команды для генерации сетки
  const teams = getTeams()
  if (teams.length > 0) {
    const gen = generateDoubleEliminationWithPrelims(teams)
    // Demo: pre-fill GF teams and make GF1 loser be WB to trigger reset
    gen.grandFinal = {
      team1: { name: teams[0].name, logo: teams[0].logo }, // WB Winner
      team2: { name: teams[1].name, logo: teams[1].logo }, // LB Winner
      team1_score: 0,
      team2_score: 2,
      wbIsTeam1: true
    }
    gen.grandFinalReset = {
      team1: { name: teams[0].name, logo: teams[0].logo },
      team2: { name: teams[1].name, logo: teams[1].logo },
      team1_score: 2,
      team2_score: 1
    }
    tournamentData.value = gen
  }
}

// API fetch
async function fetchBracket() {
  if (props.data) {
    // If we have raw data, generate adaptive bracket structure
    const normalizedData = normalizeDoubleElimBracket(props.data)
    if (normalizedData.teams && normalizedData.teams.length > 0) {
      tournamentData.value = generateDoubleEliminationWithPrelims(normalizedData.teams)
    } else {
      tournamentData.value = normalizedData
    }
    await nextTick()
    setTimeout(calculateConnectors, 50)
    return
  }
  
  // Если используем локальные команды, генерируем сетку из них
  if (useLocalTeams.value) {
    const teams = getTeams()
    if (teams.length > 0) {
      tournamentData.value = generateDoubleEliminationWithPrelims(teams)
      await nextTick()
      setTimeout(calculateConnectors, 50)
    }
    return
  }
  
  if (!props.endpoint && !props.tournamentId) return

  pending.value = true
  error.value = null
  try {
    const url = props.endpoint || `${API_BASE}/tournaments/${props.tournamentId}/bracket/`
    const res = await $fetch(url, { credentials: 'include' })
    
    // Generate adaptive bracket from API response
    const normalizedData = normalizeDoubleElimBracket(res)
    if (normalizedData.teams && normalizedData.teams.length > 0) {
      tournamentData.value = generateDoubleEliminationWithPrelims(normalizedData.teams)
    } else {
      tournamentData.value = normalizedData
    }
    
    await nextTick()
    setTimeout(calculateConnectors, 50)
  } catch (e) {
    error.value = e?.message || 'Ошибка загрузки'
  } finally {
    pending.value = false
  }
}

// Computed properties
const winnersRounds = computed(() => tournamentData.value.winnersRounds || [])
const losersRounds = computed(() => tournamentData.value.losersRounds || [])
const grandFinal = computed(() => tournamentData.value.grandFinal)
const grandFinalReset = computed(() => tournamentData.value.grandFinalReset)

// First GF and should we show reset
const grandFinal1 = computed(() => grandFinal.value || null)
const shouldShowGrandFinalReset = computed(() => {
  const gf1 = grandFinal1.value
  if (!gf1) return false
  if (grandFinalReset.value && (hasTeam(grandFinalReset.value.team1) || hasTeam(grandFinalReset.value.team2))) return true
  const wbIsTeam1 = gf1.wbIsTeam1 !== false
  const w0 = isWinner(gf1, 0)
  const w1 = isWinner(gf1, 1)
  const winnerIdx = w0 ? 0 : (w1 ? 1 : null)
  if (winnerIdx === null) return false
  return (wbIsTeam1 && winnerIdx === 1) || (!wbIsTeam1 && winnerIdx === 0)
})

const winnerTeam = computed(() => {
  if (bracketMeta.value?.winner && (bracketMeta.value.winner.name || bracketMeta.value.winner.logo)) {
    return bracketMeta.value.winner
  }
  
  // If reset played, its winner is champion
  const gfReset = grandFinalReset.value
  if (shouldShowGrandFinalReset.value && gfReset) {
    if (gfReset.winner) {
      if (gfReset.winner === gfReset.team1?.name) return gfReset.team1
      if (gfReset.winner === gfReset.team2?.name) return gfReset.team2
    }
    if (gfReset.team1_score !== undefined && gfReset.team2_score !== undefined) {
      return gfReset.team1_score > gfReset.team2_score ? gfReset.team1 : gfReset.team2
    }
  }

  const gf = grandFinal.value
  if (!gf) return null
  
  if (gf.winner) {
    if (gf.winner === gf.team1?.name) return gf.team1
    if (gf.winner === gf.team2?.name) return gf.team2
  }
  
  if (gf.team1_score !== undefined && gf.team2_score !== undefined) {
    return gf.team1_score > gf.team2_score ? gf.team1 : gf.team2
  }
  
  return null
})

// Right-rail rounds (winners semifinal and final)
const winnersFinalRound = computed(() => {
  const rounds = winnersRounds.value
  return rounds && rounds.length ? rounds[rounds.length - 1] : null
})
const winnersSemifinalRound = computed(() => {
  const rounds = winnersRounds.value
  return rounds && rounds.length > 1 ? rounds[rounds.length - 2] : null
})

const winnerName = computed(() => {
  const wt = winnerTeam.value
  return wt ? (wt.name || '—') : 'Ожидание'
})

// Helper functions
const hasTeam = (t) => !!(t && (t.name || t.logo))
const teamName = (t) => hasTeam(t) ? (t.name || '—') : 'ожидание'

const isWinner = (match, teamIndex) => {
  if (!match) return false
  
  if (match.winner) {
    const teamName = teamIndex === 0 ? match.team1?.name : match.team2?.name
    return match.winner === teamName
  }
  
  if (match.team1_score !== undefined && match.team2_score !== undefined) {
    if (teamIndex === 0) return match.team1_score > match.team2_score
    else return match.team2_score > match.team1_score
  }
  
  return false
}

const getTeamEmoji = (team) => {
  if (!team || !team.logo) return '🦅'
  if (team.logo.includes('navi')) return '🏆'
  return '🦅'
}

const getRoundStyle = (roundIndex, isWinners) => {
  const baseGap = 40 + (roundIndex * 30)
  return { gap: `${baseGap}px` }
}

// Zoom functions
const zoomIn = () => {
  currentScale.value = Math.min(1.5, currentScale.value + 0.1)
}

const zoomOut = () => {
  currentScale.value = Math.max(0.3, currentScale.value - 0.1)
}

const scaleStyle = computed(() => ({
  transform: `scale(${currentScale.value})`,
  transition: 'transform 0.3s ease'
}))

// --- Match status helpers & controls ---
const getStatusText = (status) => {
  const map = { SCHEDULED:'Запланирован', READY:'Готов к запуску', IN_PROGRESS:'В процессе', LIVE:'В процессе', COMPLETED:'Завершен', FINISHED:'Завершен', CANCELLED:'Отменен', pending:'Ожидание', running:'Идет', finished:'Завершен' }
  return (status && map[status]) || status || 'Неизвестно'
}
const getStatusClass = (status) => {
  if (['SCHEDULED','pending'].includes(status)) return 'status-scheduled'
  if (['READY'].includes(status)) return 'status-ready'
  if (['IN_PROGRESS','LIVE','running'].includes(status)) return 'status-running'
  if (['COMPLETED','finished','FINISHED'].includes(status)) return 'status-completed'
  if (['CANCELLED'].includes(status)) return 'status-cancelled'
  return 'status-unknown'
}
function extractError(e){ const s=e?.status||e?.statusCode||e?.response?.status||e?.response?.statusCode||null; const d=e?.data||e?.response?._data||{}; const m=d?.detail||d?.message||d?.error||e?.message||'Ошибка запроса'; return {status:s,message:m} }
const isMatchStarted = computed(()=>{ const s=selectedMatch.value?.status; return !!(s && ['IN_PROGRESS','LIVE','running','COMPLETED','finished','FINISHED'].includes(s)) })
const canStartMatch = computed(()=>{ const s=selectedMatch.value?.status; if(props.adminControls && canStartPermission.value) return !!(s && ['SCHEDULED','READY','pending'].includes(s)); if(selectedMatch.value?.can_start!==undefined) return canStartPermission.value && !!selectedMatch.value.can_start; if(String(tournamentStatus.value).toUpperCase()==='ONGOING') return !!(s && ['SCHEDULED','READY','pending'].includes(s)); return canStartPermission.value && !!(s && ['SCHEDULED','READY','pending'].includes(s)) })
const canStopMatch = computed(()=>{ const s=selectedMatch.value?.status; return canStopPermission.value && !!(s && ['IN_PROGRESS','LIVE','running'].includes(s)) })

const refreshMatchStatus = async ()=>{ if(props.tournamentId) await fetchBracket() }
const startMatch = async ()=>{ if(!selectedMatch.value?.id) return; isLoading.value=true; errorMessage.value=''; try{ await $api(`/game/servers/matches/${selectedMatch.value.id}/start/`, {method:'POST', body:{force_start:false}}); if(selectedMatch.value) selectedMatch.value.status='IN_PROGRESS'; await refreshMatchStatus(); if(typeof window!=='undefined') setTimeout(()=>{ try{ window.location.reload() }catch{} },500) }catch(e){ const err=extractError(e); errorMessage.value=`Ошибка запуска матча: ${err.message}`; if(err.status===403) canStartPermission.value=false } finally{ isLoading.value=false } }
const stopMatch = async ()=>{ if(!selectedMatch.value?.id) return; isLoading.value=true; errorMessage.value=''; try{ await $api(`/game/servers/matches/${selectedMatch.value.id}/stop/`, {method:'POST', body:{reason:'Stopped by admin'}}); await refreshMatchStatus() }catch(e){ const err=extractError(e); errorMessage.value=`Ошибка остановки матча: ${err.message}`; if(err.status===403) canStopPermission.value=false } finally{ isLoading.value=false } }
const openMatch = async (match)=>{ if(!match || (!hasTeam(match.team1)&&!hasTeam(match.team2))) return; const started = match.status && ['IN_PROGRESS','LIVE','running','COMPLETED','finished','FINISHED'].includes(match.status); if(props.clickAction==='navigate' && match.id){ await navigateTo(`/match/${props.tournamentId}/${match.id}`); return } if(props.clickAction==='auto' && started && match.id){ await navigateTo(`/match/${props.tournamentId}/${match.id}`); return } selectedMatch.value=match; showMatchPopup.value=true; errorMessage.value='' }

// Connector calculation
const calculateConnectors = async () => {
  await nextTick()

  if (!bracketContainer.value || !bracketContainer.value.parentNode) return

  const containerRect = safeGetBoundingClientRect(bracketContainer.value)
  if (!containerRect) return

  // Очищаем коннекторы
  winnersConnectors.value = { vertical: [], horizontal: [] }
  losersConnectors.value = { vertical: [], horizontal: [] }
  interBracketConnectors.value = []

  // Рассчитываем коннекторы для Winner's Bracket
  calculateBracketConnectors('winners', winnersConnectors.value, containerRect)
  
  // Рассчитываем коннекторы для Loser's Bracket
  calculateBracketConnectors('losers', losersConnectors.value, containerRect)
  
  // Рассчитываем межбраккетные коннекторы
  calculateInterBracketConnectors(containerRect)
  
  // Сначала позиционируем правые блоки по центру верхней сетки
  positionRightRailBlocks(containerRect)
  await nextTick()
  // Затем считаем коннекторы к финалу — с учётом новой позиции
  calculateGrandFinalConnectors(containerRect)
}

// Функция для расчета коннекторов для отдельного bracket (winners или losers)
function calculateBracketConnectors(bracketType, connectors, containerRect) {
  const bracketSection = safeQuerySelector(bracketContainer.value, `.tournament-double-${bracketType}-bracket`)
  if (!bracketSection) return

  const rounds = safeQuerySelectorAll(bracketSection, '.tournament-double-round')
  
  rounds.forEach((round, roundIndex) => {
    if (roundIndex === rounds.length - 1) return // Последний раунд не имеет исходящих коннекторов

    const matches = safeQuerySelectorAll(round, '.tournament-double-match-wrapper')
    const nextRound = rounds[roundIndex + 1]
    const nextMatches = nextRound ? safeQuerySelectorAll(nextRound, '.tournament-double-match-wrapper') : []

    // Соединяем каждые два матча текущего раунда с одним матчем следующего
    for (let i = 0; i < matches.length; i += 2) {
      const match1 = matches[i]
      const match2 = matches[i + 1]
      const nextMatchIndex = Math.floor(i / 2)
      const nextMatch = nextMatches[nextMatchIndex]

      if (match1 && match2 && nextMatch) {
        createMatchPairConnectors(match1, match2, nextMatch, connectors, containerRect)
      } else if (match1 && nextMatch && !match2) {
        // Если только один матч, создаем прямое соединение
        createDirectConnector(match1, nextMatch, connectors, containerRect)
      }
    }
  })
}

// Создаем коннекторы для пары матчей
function createMatchPairConnectors(match1, match2, nextMatch, connectors, containerRect) {
  const rect1 = safeGetBoundingClientRect(safeQuerySelector(match1, '.tournament-double-match'))
  const rect2 = safeGetBoundingClientRect(safeQuerySelector(match2, '.tournament-double-match'))
  const nextRect = safeGetBoundingClientRect(safeQuerySelector(nextMatch, '.tournament-double-match'))

  if (!rect1 || !rect2 || !nextRect) return

  // Вертикальный коннектор между match1 и match2
  const stubStart1 = rect1.right - containerRect.left
  const stubStart2 = rect2.right - containerRect.left
  const stubLen = 50
  const x = rect1.right - containerRect.left + stubLen
  const y1 = rect1.top + rect1.height / 2 - containerRect.top
  const y2 = rect2.top + rect2.height / 2 - containerRect.top
  const midY = (y1 + y2) / 2

  // Короткие горизонтальные линии из каждого матча к вертикали
  connectors.horizontal.push({
    id: `h-stub-${Date.now()}-${Math.random()}`,
    left: stubStart1,
    top: y1 - 1,
    width: Math.max(0, x - stubStart1)
  })
  connectors.horizontal.push({
    id: `h-stub-${Date.now()}-${Math.random()}`,
    left: stubStart2,
    top: y2 - 1,
    width: Math.max(0, x - stubStart2)
  })

  connectors.vertical.push({
    id: `v-${Date.now()}-${Math.random()}`,
    left: x,
    top: Math.min(y1, y2),
    height: Math.abs(y2 - y1)
  })

  // Горизонтальный коннектор к следующему матчу
  const nextMatchY = nextRect.top + nextRect.height / 2 - containerRect.top
  const horizontalWidth = nextRect.left - containerRect.left - x

  connectors.horizontal.push({
    id: `h-${Date.now()}-${Math.random()}`,
    left: x,
    top: midY - 1,
    width: horizontalWidth
  })

  // Вертикальный коннектор от горизонтальной линии к следующему матчу
  if (Math.abs(midY - nextMatchY) > 2) {
    connectors.vertical.push({
      id: `v-bridge-${Date.now()}-${Math.random()}`,
      left: nextRect.left - containerRect.left - 2,
      top: Math.min(midY, nextMatchY),
      height: Math.abs(midY - nextMatchY)
    })
  }
}

// Создаем прямой коннектор для одного матча
function createDirectConnector(match, nextMatch, connectors, containerRect) {
  const rect = match.querySelector('.tournament-double-match').getBoundingClientRect()
  const nextRect = nextMatch.querySelector('.tournament-double-match').getBoundingClientRect()

  const stubStart = rect.right - containerRect.left
  const stubLen = 50
  const x = rect.right - containerRect.left + stubLen
  const y = rect.top + rect.height / 2 - containerRect.top
  const width = nextRect.left - containerRect.left - x

  // Короткая горизонтальная линия от матча к вертикали
  connectors.horizontal.push({
    id: `direct-stub-${Date.now()}-${Math.random()}`,
    left: stubStart,
    top: y - 1,
    width: Math.max(0, x - stubStart)
  })

  connectors.horizontal.push({
    id: `direct-${Date.now()}-${Math.random()}`,
    left: x,
    top: y - 1,
    width: width
  })
}

// Рассчитываем межбраккетные коннекторы (Winner's -> Loser's) - упрощенная логика
function calculateInterBracketConnectors(containerRect) {
  const winnersSection = bracketContainer.value.querySelector('.tournament-double-winners-bracket')
  const losersSection = bracketContainer.value.querySelector('.tournament-double-losers-bracket')
  
  if (!winnersSection || !losersSection) return

  // Простая логика: соединяем только финалиста Winner's bracket с началом Loser's bracket
  const winnersRounds = winnersSection.querySelectorAll('.tournament-double-round')
  const losersRounds = losersSection.querySelectorAll('.tournament-double-round')
  
  if (winnersRounds.length > 0 && losersRounds.length > 0) {
    // Берем последний раунд Winner's (финалиста)
    const lastWinnersRound = winnersRounds[winnersRounds.length - 1]
    const winnerMatch = lastWinnersRound.querySelector('.tournament-double-match')
    
    // Берем первый раунд Loser's (куда попадает проигравший финалист)
    const firstLosersRound = losersRounds[0]
    const firstLosersMatch = firstLosersRound.querySelector('.tournament-double-match')
    
    if (winnerMatch && firstLosersMatch) {
      const winnersRect = winnerMatch.getBoundingClientRect()
      const losersRect = firstLosersMatch.getBoundingClientRect()
      
      // Создаем вертикальную линию от Winner's к Loser's
      const x = winnersRect.left + winnersRect.width / 2 - containerRect.left - 2
      const y1 = winnersRect.bottom - containerRect.top + 15
      const y2 = losersRect.top - containerRect.top - 15
      
      if (y2 > y1) {
        interBracketConnectors.value.push({
          id: `winner-to-loser`,
          left: x,
          top: y1,
          height: y2 - y1
        })
      }
    }
  }
}

// Рассчитываем коннекторы к Grand Final
function calculateGrandFinalConnectors(containerRect) {
  try {
    const winnersSection = bracketContainer.value.querySelector('.tournament-double-winners-bracket')
    const losersSection = bracketContainer.value.querySelector('.tournament-double-losers-bracket')
    const gfBlock = grandFinalBlock.value
    
    if (!gfBlock) return
    // clear previous right-rail connectors
    grandFinalConnector.value = null
    losersFinalConnector.value = null
    losersFinalStubConnector.value = null
    losersFinalVerticalConnector.value = null
    winnerConnector.value = null
    grandFinalResetConnector.value = null

    // Use actual target GF card rect (Reset if visible else GF1)
    const gf1El = gfBlock.querySelector('.tournament-double-grand-final-match')
    const targetRect = (grandFinalResetBlock.value && shouldShowGrandFinalReset.value)
      ? grandFinalResetBlock.value.getBoundingClientRect()
      : (gf1El ? gf1El.getBoundingClientRect() : gfBlock.getBoundingClientRect())
    const gfRect = targetRect

  // Коннектор от Winner's bracket
    if (winnersSection) {
      const winnersRounds = winnersSection.querySelectorAll('.tournament-double-round')
      const lastWinnersRound = winnersRounds[winnersRounds.length - 1]
      const lastWinnersMatch = lastWinnersRound?.querySelector('.tournament-double-match')
      
      if (lastWinnersMatch) {
        const wmRect = lastWinnersMatch.getBoundingClientRect()
        const x = wmRect.right - containerRect.left + 50
        const y = wmRect.top + wmRect.height / 2 - containerRect.top
        const width = gfRect.left - containerRect.left - x
        
        if (width > 0) {
          grandFinalConnector.value = { left: x, top: y - 1, width: width }
        }
      }
    }

  // Коннектор от Loser's bracket (финал нижней сетки -> Grand Final) — L-образный подъем
  if (losersSection) {
      const losersRounds = losersSection.querySelectorAll('.tournament-double-round')
      const lastLosersRound = losersRounds[losersRounds.length - 1]
      const lastLosersMatch = lastLosersRound?.querySelector('.tournament-double-match')
      if (lastLosersMatch) {
        const lmRect = lastLosersMatch.getBoundingClientRect()
    const yLB = lmRect.top + lmRect.height / 2 - containerRect.top
    const yGF = gfRect.top + gfRect.height / 2 - containerRect.top
    const stubStart = lmRect.right - containerRect.left
  const stubLen = 36
    const x = stubStart + stubLen
    losersFinalStubConnector.value = { left: stubStart, top: yLB - 1, width: stubLen }
    losersFinalVerticalConnector.value = { left: x, top: Math.min(yLB, yGF), height: Math.abs(yGF - yLB) }
    const width = gfRect.left - containerRect.left - x
    losersFinalConnector.value = width > 0 ? { left: x, top: yGF - 1, width } : null
      }
    }
    
    // Коннектор к Winner (prefer GF reset if shown)
    const wBlock = winnerBlock.value
    if (wBlock) {
      const wRect = wBlock.getBoundingClientRect()
      const x = gfRect.right - containerRect.left + 50
      const y = gfRect.top + gfRect.height / 2 - containerRect.top
      const width = wRect.left - containerRect.left - x
      
      if (width > 0) {
        winnerConnector.value = { left: x, top: y - 1, width: width }
      }
    }

    // Connector from GF1 to Reset, if visible
    if (grandFinalResetBlock.value && shouldShowGrandFinalReset.value) {
      const gf2Rect = grandFinalResetBlock.value.getBoundingClientRect()
      const x = gfRect.right - containerRect.left + 50
      const y = gfRect.top + gfRect.height / 2 - containerRect.top
      const width = gf2Rect.left - containerRect.left - x
      if (width > 0) {
        grandFinalResetConnector.value = { left: x, top: y - 1, width }
      }
    } else {
      grandFinalResetConnector.value = null
    }
  } catch (error) {
    console.warn('Error calculating grand final connectors:', error)
    grandFinalConnector.value = null
    losersFinalConnector.value = null
  losersFinalStubConnector.value = null
  losersFinalVerticalConnector.value = null
    winnerConnector.value = null
    grandFinalResetConnector.value = null
  }
}

// Центруем Winner и Grand Final по вертикальному центру верхней сетки
function positionRightRailBlocks(containerRect) {
  try {
    const winnersSection = bracketContainer.value?.querySelector('.tournament-double-winners-bracket')
    if (!winnersSection) return
    const wRect = winnersSection.getBoundingClientRect()
    const centerY = wRect.top + wRect.height / 2 - containerRect.top
    const topPx = `${centerY}px`
    winnerWrapperStyle.value = { top: topPx, transform: 'translateY(-50%)' }
    grandFinalWrapperStyle.value = { top: topPx, transform: 'translateY(-50%)' }
  } catch {}
}

// Lifecycle hooks
onMounted(() => {
  fetchBracket()
  setTimeout(calculateConnectors, 100)
  window.addEventListener('resize', calculateConnectors)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateConnectors)
})

// Watchers
watch(() => props.data, () => {
  if (props.data) {
    tournamentData.value = normalizeDoubleElimBracket(props.data)
  } else {
  tournamentData.value = { winnersRounds: [], losersRounds: [], grandFinal: null, grandFinalReset: null, teams: [] }
  }
  nextTick(() => { setTimeout(calculateConnectors, 50) })
}, { deep: true })

watch(() => [props.tournamentId, props.endpoint], () => {
  fetchBracket()
})

// Expose methods
defineExpose({
  updateBracket: (newData) => {
    tournamentData.value = normalizeDoubleElimBracket(newData || {})
    nextTick(() => {
      setTimeout(calculateConnectors, 50)
    })
  },
  getTeams: () => (tournamentData.value?.teams || []),
  // Методы для тестирования с локальными данными
  setTeamCount,
  toggleDataSource,
  useLocalTeams: () => useLocalTeams.value,
  localTeams: () => localTeams.value
})
</script>

<style scoped>
@import './double-elimination.css';
/* Popup styles */
.match-popup-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; z-index:1000 }
.match-popup { background:#fff; border-radius:12px; width:90%; max-width:500px; max-height:80vh; overflow:auto; box-shadow:0 10px 30px rgba(0,0,0,.3) }
.match-popup-header { display:flex; justify-content:space-between; align-items:center; padding:20px; border-bottom:1px solid #e5e5e5; background:#f8f9fa; border-radius:12px 12px 0 0 }
.match-popup-header h3 { margin:0; color:#333; font-size:18px; font-weight:600 }
.close-btn { background:none; border:none; font-size:24px; cursor:pointer; color:#666; padding:0; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center }
.close-btn:hover { background:#e5e5e5; color:#333 }
.match-popup-content { padding:20px }
.match-teams { display:flex; align-items:center; justify-content:center; gap:20px; margin-bottom:20px; padding:16px; background:#f8f9fa; border-radius:8px }
.team { flex:1; text-align:center }
.team .team-name { font-weight:600; font-size:16px; color:#333; display:block }
.vs { font-weight:bold; color:#6bb6ff; font-size:18px }
.match-status { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #f0f0f0 }
.status-label, .info-label { font-weight:600; color:#666 }
.status-value, .info-value { font-weight:500 }
.status-scheduled { color:#ffa500 }
.status-ready { color:#28a745 }
.status-running { color:#17a2b8 }
.status-completed { color:#6c757d }
.status-cancelled { color:#dc3545 }
.status-unknown { color:#6c757d }
.match-controls { display:flex; flex-direction:column; gap:12px; margin-top:20px }
.control-btn { padding:12px 20px; border:none; border-radius:6px; font-weight:600; cursor:pointer; transition:all .2s; font-size:14px }
.control-btn:disabled { opacity:.6; cursor:not-allowed }
.start-btn { background:#28a745; color:#fff }
.start-btn:hover:not(:disabled){ background:#218838 }
.stop-btn { background:#dc3545; color:#fff }
.stop-btn:hover:not(:disabled){ background:#c82333 }
.refresh-btn { background:#6c757d; color:#fff }
.refresh-btn:hover:not(:disabled){ background:#5a6268 }
.error-message { margin-top:16px; padding:12px; background:#f8d7da; color:#721c24; border:1px solid #f5c6cb; border-radius:6px; font-size:14px }
.match-notification { text-align:center; padding:16px; background:#fff3cd; border:1px solid #ffeaa7; border-radius:6px; margin:16px 0 }
.match-notification p { margin:0; color:#856404; font-size:14px }
</style>