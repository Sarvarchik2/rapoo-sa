<template>
  <div class="create-tournament">
    <NuxtLink to="/profile" class="back-button">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M15 10H5M5 10L10 5M5 10L10 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Назад
    </NuxtLink>

    <!-- Переключатель игр -->
    <div class="switcher">
      <div class="switcher-container">
        <button
          v-for="(title, index) in categories2"
          :key="index"
          :class="['switcher-btn', { active: activeCategory2 === index }]"
          @click="setActiveCategory2(index)"
          :ref="el => setButtonRef(el, index)"
        >
          {{ title }}
        </button>

        <div
          class="switcher-slider"
          :style="{
            transform: `translateX(${getSliderPosition2()}px)`,
            width: `${getSliderWidth2()}px`
          }"
        ></div>
      </div>
    </div>

    <!-- Формат -->
    <div class="create-tournament-format">
      <h2>Формат турнира</h2>

      <div class="create-tournament-format-wrapper" role="radiogroup" aria-label="Формат турнира">
        <div
          v-for="f in formats"
          :key="f.value"
          class="create-tournament-format-item"
          :class="{ 'is-selected': selectedFormat === f.value }"
          role="radio"
          :aria-checked="selectedFormat === f.value ? 'true' : 'false'"
          tabindex="0"
          @click="selectFormat(f.value)"
          @keydown.enter.prevent="selectFormat(f.value)"
          @keydown.space.prevent="selectFormat(f.value)"
        >
          <div class="format-check"><span class="format-check__dot"></span></div>
          <h3>{{ f.title }}</h3>
          <img :src="f.img" :alt="f.title" />
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </div>

    <!-- Double Elim настройка (необязательная настройка UI) -->
    <!-- <section class="de-settings">
      <h2 class="de-title">Настройки Double Elimination</h2>
      <label class="de-toggle" :class="{ 'is-on': splitEnabled }" role="switch" :aria-checked="splitEnabled ? 'true' : 'false'">
        <input class="de-toggle-input" type="checkbox" v-model="splitEnabled" />
        <span class="de-toggle-track"><span class="de-toggle-thumb"></span></span>
        <span class="de-toggle-texts">
          <span class="de-toggle-label">Включить разделение участников</span>
          <span class="de-toggle-sub">Начните с половины участников, попавших в сетку проигравших</span>
        </span>
      </label>
    </section> -->

    <!-- Основные данные -->
    <section class="tournament-basic">
      <h3 class="tb-title">Количество участников</h3>
      <div class="tb-counter" :class="{ 'at-min': participants <= minPlayers, 'at-max': participants >= maxPlayers }">
        <button type="button" class="tb-btn minus" @click="decPlayers" :disabled="participants <= minPlayers" aria-label="Уменьшить">−</button>
        <div class="tb-value" aria-live="polite">{{ participants }}</div>
        <button type="button" class="tb-btn plus" @click="incPlayers" :disabled="participants >= maxPlayers" aria-label="Увеличить">+</button>
      </div>

      <div class="tb-grid">
        <div class="tb-field">
          <label class="tb-label">Название турнира</label>
          <input v-model.trim="form.title" type="text" class="tb-input" placeholder="Введите название здесь" />
        </div>

        <div class="tb-field">
          <label class="tb-label">Ссылка на турнир</label>
          <input v-model.trim="form.link" type="url" class="tb-input" placeholder="Введите здесь" />
        </div>

        <div class="tb-field tb-field--full">
          <label class="tb-label">Описание</label>
          <textarea v-model.trim="form.description" class="tb-textarea" rows="6" placeholder="Описание турнира"></textarea>
        </div>

        <!-- Опционально: логотип и баннер -->
        <div class="tb-field">
          <label class="tb-label">Логотип (необязательно)</label>
          <input type="file" accept="image/*" @change="onLogoChoose" />
        </div>
        <div class="tb-field">
          <label class="tb-label">Баннер (необязательно)</label>
          <input type="file" accept="image/*" @change="onBannerChoose" />
        </div>
      </div>

      <h3 class="tb-title">Время начала турнира</h3>
      <div class="tb-grid tb-grid--compact">
        <div class="tb-field">
          <input v-model="form.date" type="date" class="tb-input" placeholder="Дата" />
        </div>
        <div class="tb-field">
          <input v-model="form.time" type="time" class="tb-input" placeholder="Время" />
        </div>
      </div>
    </section>

    <!-- Участники -->
    <section class="participants">
      <!-- <h2 class="part-title">Участники</h2>

      <label class="circle-check" :class="{ 'is-on': teamsRequired }">
        <input type="checkbox" v-model="teamsRequired" class="circle-check__input" />
        <span class="circle-check__ring"><span class="circle-check__dot"></span></span>
        <span class="circle-check__text">Требуется регистрация участников в виде команд</span>
      </label> -->

      <div class="part-actions">
        <button type="button" class="primary-pill" :disabled="creating" @click="createTournament">
          {{ creating ? 'Создаем…' : 'Создать турнир' }}
        </button>
      </div>

      <p v-if="pageToast" :class="['state', pageToast.type === 'err' ? 'error' : '']" style="margin-top:10px;">
        {{ pageToast.text }}
      </p>
    </section>
    
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount, watch, computed } from 'vue'
import { useNuxtApp, useCookie, useRouter } from '#imports'
import f1 from '@/assets/format/1.svg?url'
import f2 from '@/assets/format/2.svg?url'
import f3 from '@/assets/format/3.svg?url'

definePageMeta({ middleware: ['auth'] })

/* ---- deps ---- */
const { $api } = useNuxtApp()
const accessRef = useCookie('access_token')
const router = useRouter()

/* ---- формат ---- */
const formats = [
  { value: 'single', title: 'Одиночное выбывание', img: f1, desc: 'Проигравший в каждом матче немедленно выбывает из турнира.' },
  { value: 'double', title: 'Двойное выбывание', img: f2, desc: 'Участник выбывает, если проиграет две игры.' },
  { value: 'round_robin', title: 'Круговой Робин', img: f3, desc: 'Каждый участник играет с каждым.' }
]
const selectedFormat = ref('single')
function selectFormat(v){ selectedFormat.value = v }

/* ---- игры для переключателя ---- */
const games = ref([])                       // [{id, title}]
const categories2 = ref([])                 // только заголовки для твоего UI
const activeCategory2 = ref(0)
const DEFAULT_BTN_WIDTH = 120
const buttonRefs2 = ref([])
const buttonWidths2 = ref([])

function setButtonRef(el, index){ if (el) buttonRefs2.value[index] = el }
async function loadGames(){
  try{
    const res = await $api('/tournaments/games/')
    const list = Array.isArray(res?.results) ? res.results : (Array.isArray(res) ? res : [])
    games.value = list.map(g => ({ id: g.id, title: g.title }))
    categories2.value = games.value.map(g => g.title)
    await nextTick(); await calculateButtonWidths(buttonRefs2, buttonWidths2)
  }catch{
    // fallback — если нет API, показываем заглушки, но создавать турнир без id игры не дадим
    games.value = []
    categories2.value = []
  }
}
const selectedGameId = computed(() => games.value[activeCategory2.value]?.id ?? null)

function setActiveCategory2(index){
  activeCategory2.value = index
  calculateButtonWidths(buttonRefs2, buttonWidths2)
}
async function calculateButtonWidths(refs, widths){
  await nextTick()
  widths.value = refs.value.map(btn => (btn?.offsetWidth ?? DEFAULT_BTN_WIDTH))
}
function getGapPx(){ return window.innerWidth <= 768 ? 6 : 8 }
function getSliderPosition2(){
  if (!buttonWidths2.value.length) return 0
  const gap = getGapPx()
  let pos = 0
  for (let i = 0; i < activeCategory2.value; i++){
    pos += (buttonWidths2.value[i] ?? DEFAULT_BTN_WIDTH) + gap
  }
  return pos
}
function getSliderWidth2(){ return buttonWidths2.value[activeCategory2.value] ?? DEFAULT_BTN_WIDTH }
let resizeTimer = null
function onResize(){
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => calculateButtonWidths(buttonRefs2, buttonWidths2), 100)
}
onMounted(async () => {
  await loadGames()
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => { window.removeEventListener('resize', onResize); if (resizeTimer) clearTimeout(resizeTimer) })
watch([categories2, buttonRefs2], () => {
  if (activeCategory2.value >= categories2.value.length){
    activeCategory2.value = Math.max(0, categories2.value.length - 1)
  }
  calculateButtonWidths(buttonRefs2, buttonWidths2)
})

/* ---- счетчики/формы ---- */
const minPlayers = 2
const maxPlayers = 512
const participants = ref(2)
function incPlayers(){ if (participants.value < maxPlayers) participants.value++ }
function decPlayers(){ if (participants.value > minPlayers) participants.value-- }

const splitEnabled = ref(true)     // опция UI (на бэк сейчас не шлём, при необходимости добавишь)
const teamsRequired = ref(false)   // влияет на auto_approve_registrations? сейчас просто поле UI

const form = ref({
  title: '',
  link: '',
  description: '',
  date: '',
  time: ''
})

/* ---- медиа ---- */
const logoFile = ref(null)
const bannerFile = ref(null)
function onLogoChoose(e){ const f = e.target.files?.[0]; if (f) logoFile.value = f }
function onBannerChoose(e){ const f = e.target.files?.[0]; if (f) bannerFile.value = f }

async function uploadFileReturnId(file, token){
  const fd = new FormData()
  fd.append('file', file)
  const res = await $api('/files/upload/', { method:'POST', body: fd, headers:{ Authorization:`Bearer ${token}` } })
  return res?.id ?? res?.data?.id ?? null
}

/* ---- утилы времени ---- */
function toISO(dateStr, timeStr){
  if (!dateStr || !timeStr) return null
  // добавим :00 если секунды не заданы
  const t = timeStr.length === 5 ? `${timeStr}:00` : timeStr
  const dt = new Date(`${dateStr}T${t}`)
  if (isNaN(dt.getTime())) return null
  return dt.toISOString()
}

/* ---- submit ---- */
const creating = ref(false)
const pageToast = ref(null)
function toastOk(t){ pageToast.value = { type:'ok', text:t }; setTimeout(()=>pageToast.value=null, 4000) }
function toastErr(t){ pageToast.value = { type:'err', text:t }; setTimeout(()=>pageToast.value=null, 6000) }

const FORMAT_MAP = {
  single: 'SINGLE_ELIMINATION',
  double: 'DOUBLE_ELIMINATION',
  round_robin: 'ROUND_ROBIN'
}

function validate(){
  if (!accessRef.value) return 'Требуется вход'
  if (!form.value.title || form.value.title.trim().length < 2) return 'Укажите название'
  if (!selectedGameId.value) return 'Выберите игру сверху'
  if (!form.value.date || !form.value.time) return 'Укажите дату и время начала'
  return ''
}

async function createTournament(){
  const err = validate()
  if (err){ toastErr(err); return }

  creating.value = true
  try{
    // Время
    const tournament_start = toISO(form.value.date, form.value.time)
    if (!tournament_start) throw new Error('Некорректная дата/время старта')
    const startMs = new Date(tournament_start).getTime()
    const registration_start = new Date().toISOString()
    const registration_end = new Date(startMs - 60*60*1000).toISOString() // за час до старта
    const tournament_end = new Date(startMs + 2*60*60*1000).toISOString() // по умолчанию +2 часа

    // Опциональные медиа
    let logoId = null, bannerId = null
    if (logoFile.value)  logoId = await uploadFileReturnId(logoFile.value, accessRef.value)
    if (bannerFile.value) bannerId = await uploadFileReturnId(bannerFile.value, accessRef.value)

    // Пэйлоад под твою схему
    const payload = {
      name: form.value.title,
      description: form.value.description || '',
      short_description: (form.value.description || '').slice(0, 140),
      format: FORMAT_MAP[selectedFormat.value] || 'SINGLE_ELIMINATION',
      max_teams: participants.value,
      min_teams: participants.value, // минимум 2
      registration_start,
      registration_end,
      tournament_start,
      tournament_end,
      min_player_level: 1,
      rules: '',
      additional_info: '',
      is_public: true,
      auto_approve_registrations: true,
      total_prize_pool: '0.00',
      game: selectedGameId.value,
      ...(logoId ? { logo: logoId } : {}),
      ...(bannerId ? { banner: bannerId } : {})
    }

    await $api('/tournaments/create/', {
      method: 'POST',
      body: payload,
      headers: { Authorization: `Bearer ${accessRef.value}` }
    })

    toastOk('Турнир создан')
    // перенаправление, если нужно
    // router.replace('/tournaments')
  } catch (e){
    const msg = e?.data?.detail || e?.message || 'Не удалось создать турнир'
    toastErr(msg)
  } finally {
    creating.value = false
  }
}
</script>

<style>
@import './create-tournament.css';

/* Базовые стили для свитчера — под твой CSS */
.switcher { width: 100%; }
.switcher-container {
  position: relative; display: inline-flex; align-items: center;
  gap: 8px; padding: 6px; border-radius: 999px; background: var(--bg-muted, #0f172a0d); overflow: hidden;
}
.switcher-btn { position: relative; z-index: 2; padding: 10px 14px; border: 0; background: transparent; border-radius: 999px; font: inherit; white-space: nowrap; cursor: pointer; transition: color .2s; }
.switcher-btn.active { color: var(--accent-fg, #0f172a); }
.switcher-slider {
  position: absolute; z-index: 1; height: 36px; left: 6px; top: 50%; transform: translateY(-50%);
  border-radius: 999px; background: var(--accent-bg, #fff); box-shadow: 0 4px 18px rgba(0,0,0,.08);
  transition: transform .25s ease, width .25s ease;
}
@media (max-width: 768px){
  .switcher-container { gap: 6px; padding: 6px; }
  .switcher-btn { padding: 8px 12px; }
  .switcher-slider { height: 32px; left: 6px; }
}
</style>
