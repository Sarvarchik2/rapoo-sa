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



    <!-- Основные данные -->
    <section class="tournament-basic">
      <h3 class="tb-title">Количество команд</h3>
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
          <label class="tb-label">Ссылка на трансляцию</label>
          <input v-model.trim="form.link" type="text" class="tb-input" placeholder="Вставьте iframe код или ссылку YouTube/Twitch" @input="extractStreamUrl" />
          <div v-if="extractedUrl" class="url-preview">
            <span class="url-label">Извлечённая ссылка:</span>
            <span class="url-value">{{ extractedUrl }}</span>
          </div>
        </div>

        <div class="tb-field tb-field--full">
          <label class="tb-label">Описание</label>
          <textarea v-model.trim="form.description" class="tb-textarea" rows="6" placeholder="Описание турнира"></textarea>
        </div>

        <!-- Опционально: логотип и баннер -->
        <div class="tb-field">
          <label class="tb-label">Логотип</label>
          <label class="file-uploader">
            <input type="file" accept="image/*" @change="onLogoChoose" />
            <span class="file-btn">Выбрать файл</span>
            <span class="file-name">{{ logoName || 'Файл не выбран' }}</span>
          </label>
          <div v-if="logoPreview" class="file-preview thumb"><img :src="logoPreview" alt="logo preview" /></div>
        </div>
        <div class="tb-field">
          <label class="tb-label">Баннер</label>
          <label class="file-uploader">
            <input type="file" accept="image/*" @change="onBannerChoose" />
            <span class="file-btn">Выбрать файл</span>
            <span class="file-name">{{ bannerName || 'Файл не выбран' }}</span>
          </label>
          <div v-if="bannerPreview" class="file-preview banner"><img :src="bannerPreview" alt="banner preview" /></div>
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
    if (document && document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; await calculateButtonWidths(buttonRefs2, buttonWidths2) } catch {}
    }
    await new Promise(r => requestAnimationFrame(() => { calculateButtonWidths(buttonRefs2, buttonWidths2).then(r) }))
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
  window.addEventListener('load', onResize)
})
onBeforeUnmount(() => { window.removeEventListener('resize', onResize); window.removeEventListener('load', onResize); if (resizeTimer) clearTimeout(resizeTimer); revoke(logoPreview.value); revoke(bannerPreview.value) })
watch([categories2, buttonRefs2], () => {
  if (activeCategory2.value >= categories2.value.length){
    activeCategory2.value = Math.max(0, categories2.value.length - 1)
  }
  calculateButtonWidths(buttonRefs2, buttonWidths2)
})

/* ---- счетчики/формы ---- */
const allowedParticipants = [4, 5, 8, 16, 32,]
const minPlayers = allowedParticipants[0]
const maxPlayers = allowedParticipants[allowedParticipants.length - 1]
const participants = ref(minPlayers)
const pIndex = computed(() => Math.max(0, allowedParticipants.indexOf(participants.value)))
const canDec = computed(() => pIndex.value > 0)
const canInc = computed(() => pIndex.value < allowedParticipants.length - 1)
function incPlayers(){ if (canInc.value) participants.value = allowedParticipants[pIndex.value + 1] }
function decPlayers(){ if (canDec.value) participants.value = allowedParticipants[pIndex.value - 1] }

const splitEnabled = ref(true)     // опция UI (на бэк сейчас не шлём, при необходимости добавишь)
const teamsRequired = ref(false)   // влияет на auto_approve_registrations? сейчас просто поле UI

const form = ref({
  title: '',
  link: '',
  description: '',
  date: '',
  time: ''
})

const extractedUrl = ref('')

// Извлечение чистой ссылки из iframe или прямой ссылки
function extractStreamUrl() {
  const input = form.value.link
  if (!input) {
    extractedUrl.value = ''
    return
  }

  // YouTube iframe: <iframe src="https://www.youtube.com/embed/VIDEO_ID">
  const youtubeIframeMatch = input.match(/src="https?:\/\/(?:www\.)?youtube\.com\/embed\/([^"]+)"/)
  if (youtubeIframeMatch) {
    extractedUrl.value = `https://www.youtube.com/watch?v=${youtubeIframeMatch[1]}`
    return
  }

  // Twitch iframe: <iframe src="https://player.twitch.tv/?channel=CHANNEL">
  const twitchIframeMatch = input.match(/src="https?:\/\/player\.twitch\.tv\/\?channel=([^"&]+)/)
  if (twitchIframeMatch) {
    extractedUrl.value = `https://www.twitch.tv/${twitchIframeMatch[1]}`
    return
  }

  // Twitch iframe с video: <iframe src="https://player.twitch.tv/?video=VIDEO_ID">
  const twitchVideoMatch = input.match(/src="https?:\/\/player\.twitch\.tv\/\?video=([^"&]+)/)
  if (twitchVideoMatch) {
    extractedUrl.value = `https://www.twitch.tv/videos/${twitchVideoMatch[1]}`
    return
  }

  // Прямые ссылки YouTube
  if (input.includes('youtube.com/watch') || input.includes('youtu.be/')) {
    extractedUrl.value = input
    return
  }

  // Прямые ссылки Twitch
  if (input.includes('twitch.tv/')) {
    extractedUrl.value = input
    return
  }

  // Если не удалось извлечь - показываем как есть
  extractedUrl.value = input
}

/* ---- медиа ---- */
const logoFile = ref(null)
const bannerFile = ref(null)
const logoPreview = ref('')
const bannerPreview = ref('')
const logoName = computed(() => (logoFile.value && logoFile.value.name) || '')
const bannerName = computed(() => (bannerFile.value && bannerFile.value.name) || '')
function revoke(url){ if (url) { try { URL.revokeObjectURL(url) } catch (e) {} } }
function onLogoChoose(e){ const f = e && e.target && e.target.files && e.target.files[0]; if (!f) return; logoFile.value = f; revoke(logoPreview.value); logoPreview.value = URL.createObjectURL(f) }
function onBannerChoose(e){ const f = e && e.target && e.target.files && e.target.files[0]; if (!f) return; bannerFile.value = f; revoke(bannerPreview.value); bannerPreview.value = URL.createObjectURL(f) }

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
      stream_url: extractedUrl.value || form.value.link, // отправляем извлечённую ссылку
      ...(logoId ? { logo: logoId } : {}),
      ...(bannerId ? { banner: bannerId } : {})
    }

    const res = await $api('/tournaments/create/', {
      method: 'POST',
      body: payload,
      headers: { Authorization: `Bearer ${accessRef.value}` }
    })

    const createdId = Number(res?.id ?? res?.data?.id)
    toastOk('Турнир создан')
    if (Number.isFinite(createdId)) {
      router.replace(`/mytournament/${createdId}`)
    } else {
      // на крайний случай вернёмся в профиль
      router.replace('/profile')
    }
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

/* Стили для свитчера */

/* Стили для загрузки файлов */
.file-uploader {
  display: flex; align-items: center; gap: 12px; 
  padding: 12px 16px; border: 2px dashed #cbd5e1; 
  border-radius: 12px; background: #f8fafc; cursor: pointer;
  transition: all 0.3s ease; position: relative; overflow: hidden;
}
.file-uploader:hover { 
  border-color: #3b82f6; background: #eff6ff; 
  transform: translateY(-1px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}
.file-uploader input[type="file"] { 
  position: absolute; opacity: 0; width: 100%; height: 100%; 
  cursor: pointer; top: 0; left: 0;
}
.file-btn {
  padding: 8px 16px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white; border-radius: 8px; font-weight: 500; font-size: 14px;
  transition: all 0.3s ease; white-space: nowrap;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}
.file-btn:hover { 
  transform: translateY(-1px); 
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}
.file-name {
  color: #64748b; font-size: 14px; flex: 1; 
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.file-preview {
  margin-top: 12px; border-radius: 12px; overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.file-preview.thumb { width: 80px; height: 80px; }
.file-preview.banner { width: 100%; height: 120px; }
.file-preview img { 
  width: 100%; height: 100%; object-fit: cover; 
  transition: transform 0.3s ease;
}
.file-preview:hover img { transform: scale(1.05); }

/* Стили для предпросмотра URL */
.url-preview {
  margin-top: 8px; padding: 8px 12px; background: #f1f5f9; 
  border-radius: 8px; border-left: 3px solid #3b82f6;
}
.url-label {
  font-size: 12px; color: #64748b; font-weight: 500; display: block; margin-bottom: 4px;
}
.url-value {
  font-size: 13px; color: #1e293b; font-family: monospace; 
  word-break: break-all; background: white; padding: 4px 8px; 
  border-radius: 4px; border: 1px solid #e2e8f0;
}
</style>
