<template>
    <div class="tournament-bracket">
      <div class="bracket-container">
        <!-- Полуфиналы -->
        <div class="bracket-round bracket-round-2 s-4">
          <div
            class="bracket-match"
            v-for="(m, idx) in semi"
            :key="'sf'+idx"
            :class="{ clickable: canStart(m), starting: startingId === m.id }"
            @click="handleStart(m)"
            :title="canStart(m) ? 'Нажмите, чтобы запустить матч' : ''"
          >
            <div class="team-box">
              <img :src="m.t1.logo || defaultLogo" :alt="m.t1.name || '—'">
              <span>{{ m.t1.name || '—' }}</span>
            </div>
            <div class="team-box">
              <img :src="m.t2.logo || defaultLogo" :alt="m.t2.name || '—'">
              <span>{{ m.t2.name || '—' }}</span>
            </div>
            <div class="match-status" v-if="m.status">{{ statusLabel(m.status) }}</div>
          </div>
        </div>
  
        <!-- Финал -->
        <div
          class="bracket-round bracket-round-3 bracket-round-3-s4"
          :class="{ clickable: canStart(finalMatch), starting: startingId === finalMatch.id }"
          @click="handleStart(finalMatch)"
          :title="canStart(finalMatch) ? 'Нажмите, чтобы запустить матч' : ''"
        >
          <div class="bracket-match">
            <div class="team-box">
              <img :src="finalMatch.t1.logo || defaultLogo" :alt="finalMatch.t1.name || '—'">
              <span>{{ finalMatch.t1.name || '—' }}</span>
            </div>
            <div class="team-box">
              <img :src="finalMatch.t2.logo || defaultLogo" :alt="finalMatch.t2.name || '—'">
              <span>{{ finalMatch.t2.name || '—' }}</span>
            </div>
            <div class="match-status" v-if="finalMatch.status">{{ statusLabel(finalMatch.status) }}</div>
          </div>
        </div>
  
        <!-- Победитель -->
        <div class="bracket-winner">
          <div class="team-box winner">
            <img :src="winner.logo || defaultLogo" :alt="winner.name || '—'">
            <span>{{ winner.name || '—' }}</span>
          </div>
        </div>
      </div>
  
      <img class="setka-img" src="@/assets/setka1/s-4.svg" alt="setka">
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref } from 'vue'
  
  type TeamUI = { name?: string | null; logo?: string | null }
  type MatchUI = { id?: number | null; status?: string | null; canStart?: boolean | null; isReady?: boolean | null; t1: TeamUI; t2: TeamUI }
  
  const props = defineProps<{
    semi: MatchUI[]
    finalMatch: MatchUI
    winner: TeamUI
    onStartMatch?: (id:number) => Promise<void> | void
  }>()
  
  const defaultLogo = '/assets/icons/navbar/map.svg'
  
  const semi = computed<MatchUI[]>(() =>
    Array.isArray(props.semi) && props.semi.length === 2 ? props.semi : [{ t1: {}, t2: {} }, { t1: {}, t2: {} }]
  )
  const finalMatch = computed<MatchUI>(() => props.finalMatch || { t1: {}, t2: {} })
  const winner = computed<TeamUI>(() => props.winner || {})
  
  function statusLabel(s?:string|null){
    const v = String(s||'').toUpperCase()
    if (v === 'LIVE') return 'LIVE'
    if (v === 'SCHEDULED') return 'SCHEDULED'
    if (v === 'COMPLETED' || v === 'FINISHED') return 'FINISHED'
    return v
  }
  function canStart(m: MatchUI){
    const v = String(m?.status||'').toUpperCase()
    if (v === 'LIVE' || v === 'COMPLETED' || v === 'FINISHED') return false
    return !!m?.id && (m?.canStart === true || m?.isReady === true || v === 'SCHEDULED')
  }
  
  const startingId = ref<number|null>(null)
  async function handleStart(m: MatchUI){
    if (!canStart(m) || !m.id || startingId.value) return
    startingId.value = m.id
    try {
      if (typeof props.onStartMatch === 'function') await props.onStartMatch(m.id)
    } finally {
      startingId.value = null
    }
  }
  </script>
  
  <style>
  @import './setka.css';
  .bracket-match.clickable { cursor: pointer;  }
  .bracket-match.starting { opacity: .6; pointer-events: none }
  .match-status { margin-top: 6px; font-size: 12px; opacity: .7 }
  </style>
  