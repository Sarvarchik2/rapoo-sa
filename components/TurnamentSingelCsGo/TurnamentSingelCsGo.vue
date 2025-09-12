<!-- <template>
  <div class="singelcsgo-bracket-wrapper">
    <div class="singelcsgo-bracket-scroll">
      <div class="singelcsgo-bracket-container" ref="bracketContainer">
      <div v-for="(round, roundIndex) in tournamentData.rounds" :key="`round-${roundIndex}`" class="singelcsgo-round"
        :class="`singelcsgo-round-${roundIndex + 1}`" :style="getRoundStyle(roundIndex)">
        <div v-for="(match, matchIndex) in round" :key="`match-${roundIndex}-${matchIndex}`"
          class="singelcsgo-match-wrapper">
          <div class="singelcsgo-match">
            <div class="singelcsgo-team" :class="{ winner: isFinalWinner(roundIndex, matchIndex, 0) }">
              <div v-if="hasTeam(match.team1)" :class="`singelcsgo-team-logo ${match.team1.logo || ''}`">
                {{ (match.team1.logo || '') === 'navi' ? '🏆' : '🦅' }}
              </div>
              <span>{{ teamName(match.team1) }}</span>
            </div>
            <div class="singelcsgo-team" :class="{ winner: isFinalWinner(roundIndex, matchIndex, 1) }">
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

// Props
const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})

// Reactive references
const bracketContainer = ref(null)
const winnerBlock = ref(null)
const connectorData = ref({ vertical: [], horizontal: [] })
const winnerConnector = ref(null)

// Tournament data
const tournamentData = ref(props.data || { rounds: [], teams: [] })

// Generate single-elimination bracket with byes for any number of teams
function highestPowerOfTwoLE(n) { let p = 1; while ((p <<= 1) <= n) { }; return p >> 1 }
function generateSingleEliminationWithPrelims(teams) {
  const n = Array.isArray(teams) ? teams.length : 0
  if (n === 0) return { rounds: [], teams: [] }
  const base = highestPowerOfTwoLE(n) // например, для 10 → 8
  const prelimMatches = n - base       // сколько пар играет предварительный раунд (для 10 → 2)
  const prelimTeamsCount = prelimMatches * 2
  const byesCount = n - prelimTeamsCount // сколько команд ждёт (для 10 → 6)

  const prelimTeams = teams.slice(0, prelimTeamsCount)
  const byesTeams = teams.slice(prelimTeamsCount)

  const rounds = []
  // Предварительный раунд (если нужен)
  if (prelimMatches > 0) {
    const r0 = []
    for (let i = 0; i < prelimTeamsCount; i += 2) {
      const a = prelimTeams[i] ? { name: prelimTeams[i].name, logo: prelimTeams[i].logo } : null
      const b = prelimTeams[i + 1] ? { name: prelimTeams[i + 1].name, logo: prelimTeams[i + 1].logo } : null
      r0.push({ team1: a, team2: b })
    }
    rounds.push(r0)
  }

  // Основная сетка на base команд: byes + победители предварительных матчей
  const entrants = []
  // равномерно перемешаем байи и плейсхолдеры победителей
  const placeholders = Array(prelimMatches).fill({})
  const totalNeeded = base
  let iByes = 0, iPH = 0
  while (entrants.length < totalNeeded) {
    if (iByes < byesCount) { entrants.push(byesTeams[iByes++] || {}) }
    if (entrants.length < totalNeeded && iPH < placeholders.length) { entrants.push(placeholders[iPH++]) }
  }
  // если плейсхолдеров осталось — добавим в конец
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

  // Далее раунды-плейсхолдеры до финала
  let matches = r1.length
  while (matches > 1) {
    const round = []
    for (let i = 0; i < matches; i += 2) { round.push({ team1: {}, team2: {} }) }
    rounds.push(round)
    matches = Math.floor(matches / 2)
  }
  // Если остался один последний матч и нужен отдельный блок победителя — выдерживаем структуру
  // Последний раунд остаётся с одним матчем (финал). Победитель выводится в UI из этого матча.

  return { rounds, teams }
}

// Example initialization (8 teams; adjust as needed or pass via props)
if (!tournamentData.value.rounds.length) {
  const sampleTeams = [
    { name: 'NAVI', logo: 'navi' }, { name: 'SPIRIT', logo: 'spirit' },
    { name: 'FNATIC', logo: 'fnatic' }, { name: 'VIRTUS', logo: 'virtus' },
    { name: 'FAZE', logo: 'faze' }, { name: 'G2', logo: 'g2' },
    { name: 'ENCE', logo: 'ence' }, { name: 'HEROIC', logo: 'heroic' },
    { name: 'ASTRALIS', logo: 'astralis' }, { name: 'LIQUID', logo: 'liquid' },
    { name: 'vvvv', logo: 'vvvv' }, { name: 'asad', logo: 'asad' },
    { name: 'ddd', logo: 'ddd' }, { name: 'sss', logo: 'sss' },
    { name: 'dds', logo: 'dds' }, { name: 'as', logo: 'as' },
    { name: 'NAVI', logo: 'navi' }, { name: 'SPIRIT', logo: 'spirit' },
    { name: 'FNATIC', logo: 'fnatic' }, { name: 'VIRTUS', logo: 'virtus' },
    { name: 'FAZE', logo: 'faze' }, { name: 'G2', logo: 'g2' },
    { name: 'ENCE', logo: 'ence' }, { name: 'HEROIC', logo: 'heroic' },
    { name: 'ASTRALIS', logo: 'astralis' }, { name: 'LIQUID', logo: 'liquid' },
    { name: 'vvvv', logo: 'vvvv' }, { name: 'asad', logo: 'asad' },
    { name: 'ddd', logo: 'ddd' }, { name: 'sss', logo: 'sss' },
    { name: 'dds', logo: 'dds' }, { name: 'as', logo: 'as' },
    { name: 'CLOUD9', logo: 'cloud9' },
{ name: 'NIP', logo: 'nip' },
{ name: 'MOUZ', logo: 'mouz' },
{ name: 'OG', logo: 'og' },
{ name: 'EVIL GENIUSES', logo: 'eg' },
{ name: 'GAMBIT', logo: 'gambit' },
{ name: 'VITALITY', logo: 'vitality' },
{ name: 'COMPLEXITY', logo: 'complexity' },
{ name: 'BIG', logo: 'big' },
{ name: 'FORZE', logo: 'forze' },
{ name: 'GAMERS2', logo: 'gamers2' },
{ name: 'MONTE', logo: 'monte' },
{ name: 'NEXUS', logo: 'nexus' },
{ name: 'AURORA', logo: 'aurora' },
{ name: 'APEX', logo: 'apex' },
{ name: 'BAD NEWS EAGLES', logo: 'bne' },
{ name: 'HAVU', logo: 'havu' },
{ name: 'SAW', logo: 'saw' },
{ name: 'MIBR', logo: 'mibr' },
{ name: 'FURIA', logo: 'furia' },
{ name: 'PAIN', logo: 'pain' },
{ name: 'IMPERIAL', logo: 'imperial' },
{ name: '9INE', logo: '9ine' },
{ name: 'HEET', logo: 'heet' },
{ name: 'ENCE ACADEMY', logo: 'enceacademy' },
{ name: 'K23', logo: 'k23' },
{ name: 'COPENHAGEN FLAMES', logo: 'cphflames' },
{ name: 'TITANS', logo: 'titans' },
{ name: 'ANONYMO', logo: 'anonymo' },
{ name: 'ECSTATIC', logo: 'ecstatic' },
{ name: 'ENCE JUNIORS', logo: 'encejuniors' },
{ name: 'NAVI JUNIOR', logo: 'navijunior' }

  ] // 10 команд для теста
  tournamentData.value = generateSingleEliminationWithPrelims(sampleTeams)
}

// Computed property for all connectors
const allConnectors = computed(() => connectorData.value)

// Helper functions
const isFinalRound = (roundIndex) => {
  return roundIndex === tournamentData.value.rounds.length - 1
}

const isFinalWinner = () => false // подсветка только у итогового блока победителя

// utils for placeholder/byes
const hasTeam = (t) => !!(t && (t.name || t.logo))
const teamName = (t) => hasTeam(t) ? (t.name || '—') : 'Ожидание'

// winner helpers
const finalMatchRef = computed(() => {
  const rounds = tournamentData.value?.rounds || []
  const last = rounds[rounds.length - 1] || []
  return Array.isArray(last) && last.length ? last[0] : null
})
const winnerTeam = computed(() => {
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
  // Базовый вертикальный зазор внутри колонки матчей
  if (roundIndex === 0) {
    return { gap: '20px' }
  }
  // Для обычных раундов увеличиваем зазор плавно
  const isWinnerRound = roundIndex === tournamentData.value.rounds.length
  const baseGap = isWinnerRound ? 40 : (55 * (roundIndex ** 2) + 50 * roundIndex + 20)
  // Для колонки Победителя добавим чуть больше отступ слева, чтобы линия не прилипала
  if (isWinnerRound) {
    return { gap: `${baseGap}px`, marginLeft: '80px' }
  }
  return { gap: `${baseGap}px` }
}

// Calculate connectors with better positioning
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

    // Process matches in pairs for vertical connectors
    for (let i = 0; i < matches.length; i += 2) {
      const match1 = matches[i]
      const match2 = matches[i + 1]

      if (!match1 || !match2) continue

      const rect1 = match1.querySelector('.singelcsgo-match').getBoundingClientRect()
      const rect2 = match2.querySelector('.singelcsgo-match').getBoundingClientRect()

      // Calculate positions
      const x = rect1.right - containerRect.left + 50
      const y1 = rect1.top + rect1.height / 2 - containerRect.top
      const y2 = rect2.top + rect2.height / 2 - containerRect.top
      const midY = (y1 + y2) / 2

      // Vertical connector
      verticalConnectors.push({
        id: `v-${roundIndex}-${i}`,
        left: x,
        top: y1,
        height: y2 - y1
      })

      // Horizontal bridge to next match
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

  // Winner connector from final match to winner block
  try {
    // последний раунд — winner-round; финал — предыдущий
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

// Lifecycle hooks
onMounted(() => {
  setTimeout(calculateConnectors, 100)
  window.addEventListener('resize', calculateConnectors)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateConnectors)
})

// Watch for data changes
watch(() => tournamentData.value, () => {
  nextTick(() => {
    setTimeout(calculateConnectors, 50)
  })
}, { deep: true })

// Expose methods
defineExpose({
  updateBracket: (newData) => {
    if (newData?.rounds) {
      tournamentData.value = newData
    } else if (Array.isArray(newData?.teams)) {
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
.singelcsgo-bracket-wrapper {
  height: 100vh;
  width: 100%;
  background: #0f1116;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  overflow: hidden;
}

.singelcsgo-bracket-container {
  display: inline-flex;
  align-items: center;
  gap: 100px;
  position: relative;
  min-width: 100%;
  min-height: 100%;
}

/* Внешний скролл-обёртка, чтобы сетка прокручивалась, не ломая масштаб */
.singelcsgo-bracket-scroll {
  width: 100%;
  height: 100%;
  overflow: auto;
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
  background: #ffd700;
  color: #000;
}

.singelcsgo-team:hover {
  background: #2a2d36;
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
  color: #ffd700;
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

.singelcsgo-winner-block {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

/* Responsive design */
@media (max-width: 1200px) {
  .singelcsgo-bracket-container {
    gap: 60px;
  }

  .singelcsgo-connector-horizontal {
    width: 30px;
    right: -30px;
  }
}

@media (max-width: 768px) {
  .singelcsgo-bracket-wrapper {
    padding: 20px;
  }

  .singelcsgo-bracket-container {
    gap: 40px;
  }

  .singelcsgo-match {
    min-width: 120px;
  }

  .singelcsgo-team {
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style> -->


<template>
  <div class="singelcsgo-bracket-wrapper">
    <div class="zoom-controls">
      <button @click="zoomIn" class="zoom-btn zoom-plus">+</button>
      <button @click="zoomOut" class="zoom-btn zoom-minus">-</button>
      <span>Scale: {{ currentScale.toFixed(1) }}</span>
    </div>
    <div class="singelcsgo-bracket-scroll " :style="scaleStyle">
      <div class="singelcsgo-bracket-container" ref="bracketContainer" :style="{ minHeight: `${slotSize * tournamentData.target}px` }">
        <div v-for="(round, roundIndex) in tournamentData.rounds" :key="`round-${roundIndex}`" class="singelcsgo-round"
          :class="`singelcsgo-round-${roundIndex + 1}`" :style="getRoundStyle(roundIndex)">
          <div v-for="(match, matchIndex) in round" :key="`match-${roundIndex}-${matchIndex}`"
            class="singelcsgo-match-wrapper" :style="getMatchStyle(roundIndex, matchIndex)">
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

            <!-- Horizontal connector from match -->
            <div v-if="roundIndex < tournamentData.rounds.length - 1" class="singelcsgo-connector-horizontal"></div>
          </div>
        </div>

        <!-- Dynamic vertical connectors -->
        <div v-for="connector in allConnectors.vertical" :key="connector.id" class="singelcsgo-connector-vertical"
          :style="{
            left: `${connector.left}px`,
            top: `${connector.top}px`,
            height: `${connector.height}px`
          }"></div>

        <!-- Dynamic horizontal bridge connectors -->
        <div v-for="connector in allConnectors.horizontal" :key="connector.id"
          class="singelcsgo-connector-horizontal-bridge" :style="{
            left: `${connector.left}px`,
            top: `${connector.top}px`,
            width: `${connector.width}px`
          }"></div>

        <!-- Winner as a dedicated round INSIDE the container -->
        <div class="singelcsgo-round singelcsgo-winner-round" :style="getRoundStyle(tournamentData.rounds.length)">
          <div class="singelcsgo-match-wrapper" ref="winnerBlock" :style="getMatchStyle(tournamentData.rounds.length, 0)">
            <div class="singelcsgo-match singelcsgo-match-winner">
              <div class="singelcsgo-team winner">
                <div v-if="winnerTeam" class="singelcsgo-team-logo">🏆</div>
                <span>{{ winnerName }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Connector from final match to the winner round -->
        <div v-if="winnerConnector" class="singelcsgo-connector-horizontal-bridge"
          :style="{ left: `${winnerConnector.left}px`, top: `${winnerConnector.top}px`, width: `${winnerConnector.width}px` }">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

// Props
const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})

// Constants for positioning
const slotSize = 120
const matchHeight = 60

// Reactive references
const bracketContainer = ref(null)
const winnerBlock = ref(null)
const connectorData = ref({ vertical: [], horizontal: [] })
const winnerConnector = ref(null)

// Tournament data
const tournamentData = ref(props.data || { rounds: [], teams: [], target: 0 })

// Generate single-elimination bracket with byes for any number of teams
function nextPowerOfTwo(n) {
  let p = 1
  while (p < n) p *= 2
  return p
}

function generateSingleEliminationWithByes(teams) {
  const n = Array.isArray(teams) ? teams.length : 0
  if (n === 0) return { rounds: [], teams: [], target: 0 }
  const target = nextPowerOfTwo(n)
  const byes = target - n

  // Standard seeding to avoid bye vs bye
  const r0 = []
  for (let s = 1; s <= target / 2; s++) {
    const opponent = target + 1 - s
    const teamA = s <= n ? { name: teams[s - 1].name, logo: teams[s - 1].logo } : null
    const teamB = opponent <= n ? { name: teams[opponent - 1].name, logo: teams[opponent - 1].logo } : null
    r0.push({ team1: teamA, team2: teamB })
  }

  const rounds = [r0]

  let current = r0
  while (current.length > 1) {
    const next = []
    for (let i = 0; i < current.length; i += 2) {
      next.push({ team1: {}, team2: {} })
    }
    rounds.push(next)
    current = next
  }

  // Assign min_seed and max_seed for positioning
  for (let i = 0; i < rounds[0].length; i++) {
    rounds[0][i].min_seed = i * 2
    rounds[0][i].max_seed = i * 2 + 1
  }
  for (let r = 1; r < rounds.length; r++) {
    for (let i = 0; i < rounds[r].length; i++) {
      rounds[r][i].min_seed = rounds[r - 1][i * 2].min_seed
      rounds[r][i].max_seed = rounds[r - 1][i * 2 + 1].max_seed
    }
  }

  return { rounds, teams, target }
}

// Example initialization
if (!tournamentData.value.rounds.length) {
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
  { name: 'Team11', logo: 'team11' },
  { name: 'Team21', logo: 'team21' },
  { name: 'Team31', logo: 'team31' },
  { name: 'Team41', logo: 'team41' },
  { name: 'Team51', logo: 'team51' },
  { name: 'Team61', logo: 'team61' },
  { name: 'Team71', logo: 'team71' },
  { name: 'Team81', logo: 'team81' },
  { name: 'Team91', logo: 'team91' },
  { name: 'Team101', logo: 'team101' }
    // { name: 'CLOUD9', logo: 'cloud9' },
    // ... (the rest of the teams as in the original)
  ]
  tournamentData.value = generateSingleEliminationWithByes(sampleTeams)
}

// Computed property for all connectors
const allConnectors = computed(() => connectorData.value)

// Helper functions
const hasTeam = (t) => !!t && (t.name || t.logo)

const teamName = (t) => t ? (t.name || 'Bye') : 'Bye'

const isWinner = (roundIndex, matchIndex, teamIndex) => {
  const match = tournamentData.value.rounds[roundIndex][matchIndex]
  return teamIndex === 0 ? !hasTeam(match.team2) : !hasTeam(match.team1)
}

const finalMatchRef = computed(() => {
  const rounds = tournamentData.value.rounds || []
  const last = rounds[rounds.length - 1] || []
  return last.length ? last[0] : null
})

const winnerTeam = computed(() => {
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
  return wt ? (wt.name || 'Bye') : 'Ожидание'
})

const getRoundStyle = (roundIndex) => {
  return { position: 'relative' }
}

const getMatchStyle = (roundIndex, matchIndex) => {
  let minSeed, maxSeed
  if (roundIndex === tournamentData.value.rounds.length) {
    minSeed = 0
    maxSeed = tournamentData.value.target - 1
  } else {
    const match = tournamentData.value.rounds[roundIndex][matchIndex]
    minSeed = match.min_seed
    maxSeed = match.max_seed
  }
  const center = (minSeed + maxSeed) / 2 * slotSize
  const top = center - matchHeight / 2
  return {
    position: 'absolute',
    left: '0',
    width: '100%',
    top: `${top}px`
  }
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
// Реактивная переменная для текущего scale
const currentScale = ref(1.0);

// Функция зума в плюс (максимум 1)
const zoomIn = () => {
  if (currentScale.value < 1) {
    currentScale.value = Math.min(1, currentScale.value + 0.1);
  }
};

// Функция зума в минус (минимум 0.5, чтобы не было слишком маленьким)
const zoomOut = () => {
  currentScale.value = Math.max(0.5, currentScale.value - 0.1);
};
const scaleStyle = computed(() => ({
  '--scale': currentScale.value
}));
// Lifecycle hooks
onMounted(() => {
  setTimeout(calculateConnectors, 100)
  window.addEventListener('resize', calculateConnectors)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateConnectors)
})

// Watch for data changes
watch(() => tournamentData.value, () => {
  nextTick(() => {
    setTimeout(calculateConnectors, 50)
  })
}, { deep: true })

// Expose methods
defineExpose({
  updateBracket: (newData) => {
    if (newData?.rounds) {
      tournamentData.value = newData
    } else if (Array.isArray(newData?.teams)) {
      tournamentData.value = generateSingleEliminationWithByes(newData.teams)
    } else {
      tournamentData.value = generateSingleEliminationWithByes(newData || [])
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
  height: 81vh;
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  border-radius: 20px;
  overflow: hidden;
}

.singelcsgo-bracket-scroll {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.singelcsgo-bracket-container {
  display: inline-flex;
  align-items: flex-start;
  gap: 100px;
  position: relative;
  min-width: 100%;
  transform: scale(var(--scale, 1)); /* Здесь "подключение" CSS-переменной к transform */
  transition: transform 0.3s ease; /* Плавность */

}

.singelcsgo-round {
  display: block;
  width: 160px; /* Adjust as needed */
}

.singelcsgo-match-wrapper {
  position: absolute;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
}

.singelcsgo-match {
  display: flex;
  flex-direction: column;
  background: #6bb6ff;
  border: 2px solid #6bb6ff;
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
  background: #ffd700;
  color: #000;
}

.singelcsgo-team:hover {
  background: #2a2d36;
  color: #fff;
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
  color: #ffd700;
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
  position: relative;
}

/* Responsive design */
@media (max-width: 1200px) {
  .singelcsgo-bracket-container {
    gap: 60px;
  }

  .singelcsgo-connector-horizontal {
    width: 30px;
    right: -30px;
  }
}

@media (max-width: 768px) {
  .singelcsgo-bracket-wrapper {
    padding: 20px;
  }

  .singelcsgo-bracket-container {
    gap: 40px;
  }

  .singelcsgo-match {
    min-width: 120px;
  }

  .singelcsgo-team {
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style>