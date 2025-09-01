<template>
  <div class="news">
    <!-- Switcher -->
    <div class="switcher">
      <div class="switcher-container" v-if="categoryNames.length">
        <button
          v-for="(category, index) in categoryNames"
          :key="index"
          :class="['switcher-btn', { active: activeCategory === index }]"
          @click="setActiveCategory(index)"
          :ref="el => { if (el) buttonRefs[index] = el }"
        >
          {{ category }}
        </button>
        <div
          class="switcher-slider"
          :style="{ transform: `translateX(${getSliderPosition()}px)`, width: `${getSliderWidth()}px` }"
        />
      </div>
    </div>

    <!-- Верхний блок -->
    <div class="news-content" v-if="topArticle">
      <NuxtLink :to="linkTo(topArticle)" class="news-card large">
        <div class="card-image">
          <img :src="img(topArticle) || '/assets/news/news1.svg'" :alt="title(topArticle)" />
          <div class="card-date">{{ formatDate(topArticle?.publish_date) }}</div>
        </div>
        <div class="card-content">
          <h3 class="card-title">{{ title(topArticle) }}</h3>
          <div class="card-content-text">
            <p class="card-description">{{ desc(topArticle) }}</p>
            <div class="card-metrics">
              <div class="reactions">
                <button
                  v-for="r in reactionsFor(topArticle)"
                  :key="r.label"
                  type="button"
                  :class="['reaction-btn', { active: selected[topArticle?.id] === r.label }]"
                  :disabled="reacting[topArticle?.id]"
                  @click.stop.prevent="onReactClick(topArticle, r.label)"
                  :title="r.label"
                >
                  <img v-if="r.image" :src="r.image" :alt="r.label" />
                  <span v-else>{{ r.emoji }}</span>
                  <b>{{ r.count }}</b>
                </button>
              </div>

              <span class="metric views">
                {{ topArticle?.view_count ?? 0 }}
                <img src="/assets/news/view.svg" alt="views" />
              </span>
            </div>
          </div>
        </div>
      </NuxtLink>

      <div class="right-cards">
        <NuxtLink
          v-for="a in rightTwo"
          :key="title(a) + a.publish_date"
          :to="linkTo(a)"
          class="news-card small"
        >
          <div class="card-image">
            <img :src="img(a) || '/assets/news/news2.svg'" :alt="title(a)" />
            <div class="card-date">{{ formatDate(a?.publish_date) }}</div>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ title(a) }}</h3>
            <div class="card-content-text">
              <p class="card-description">{{ desc(a) }}</p>
              <div class="card-metrics">
                <div class="reactions">
                  <button
                    v-for="r in reactionsFor(a)"
                    :key="r.label"
                    type="button"
                    :class="['reaction-btn', { active: selected[a?.id] === r.label }]"
                    :disabled="reacting[a?.id]"
                    @click.stop.prevent="onReactClick(a, r.label)"
                    :title="r.label"
                  >
                    <img v-if="r.image" :src="r.image" :alt="r.label" />
                    <span v-else>{{ r.emoji }}</span>
                    <b>{{ r.count }}</b>
                  </button>
                </div>

                <span class="metric views">
                  {{ a?.view_count ?? 0 }}
                  <img src="/assets/news/view.svg" alt="views" />
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Нижний список -->
    <div class="bottom-news">
      <div class="bottom-news-card" v-for="a in bottomList" :key="title(a) + a.publish_date">
        <div class="card-header">
          <h4 class="card-header-title">{{ title(a) }}</h4>
          <span class="card-timestamp">{{ timeAgo(a?.publish_date) }}</span>
        </div>
        <div class="card-main">
          <div class="card-image">
            <img :src="img(a) || '/assets/news/news3.svg'" :alt="title(a)" />
            <div class="card-overlay">
          
              <NuxtLink :to="linkTo(a)" class="learn-more-btn">Узнать больше</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Тост для гостя -->
    <div v-if="showLoginHint" class="login-hint">
      Чтобы поставить реакцию — <NuxtLink to="/login">войдите в аккаунт</NuxtLink>.
      <button class="close" @click="closeLoginHint" aria-label="Закрыть">×</button>
    </div>

    <!-- Стейты -->
    <div v-if="pending" class="state">Загрузка…</div>
    <div v-else-if="error" class="state error">Введутся серверные работы {{ errorText }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

/* ---------- Switcher ---------- */
const buttonRefs = ref([])
const buttonWidths = ref([])
const activeCategory = ref(0)
const setActiveCategory = (index) => { activeCategory.value = index; calculateButtonWidths() }
const getSliderPosition = () => {
  if (!buttonWidths.value.length) return 0
  const gap = (typeof window !== 'undefined' && window.innerWidth <= 768) ? 6 : 8
  let position = 0
  for (let i = 0; i < activeCategory.value; i++) position += (buttonWidths.value[i] || 120) + gap
  return position
}
const getSliderWidth = () => buttonWidths.value[activeCategory.value] || 120
const calculateButtonWidths = async () => { await nextTick(); buttonWidths.value = buttonRefs.value.map(btn => btn?.offsetWidth || 120) }
onMounted(() => calculateButtonWidths())
watch(activeCategory, () => nextTick(() => calculateButtonWidths()))

/* ---------- API ---------- */
const { $api, $tapi } = useNuxtApp()

/* ---------- Auth ---------- */
const { isAuthenticated, user } = useAuth()
const userKey = computed(() => isAuthenticated.value ? (user.value?.id || 'auth') : 'guest')

/* ---------- Reactions state ---------- */
const selected = reactive({}) // { [newsId]: label|null }
const reacting = reactive({}) // { [newsId]: true }
const bump = reactive({})     // { [newsId]: { [label]: +N/-N } }

/* ---------- Toast (guest) ---------- */
const showLoginHint = ref(false)
let loginHintTimer = null
function openLoginHint () {
  showLoginHint.value = true
  if (loginHintTimer) clearTimeout(loginHintTimer)
  loginHintTimer = setTimeout(() => (showLoginHint.value = false), 5000)
}
function closeLoginHint () { showLoginHint.value = false; if (loginHintTimer) clearTimeout(loginHintTimer) }
onUnmounted(() => { if (loginHintTimer) clearTimeout(loginHintTimer) })

/* ---------- Fetch reaction types ---------- */
const { data: typesRes } = await useAsyncData(
  'news-reaction-types',
  () => $api('/news/articles/react/types/', { query: { ordering: 'id' } })
)
const reactionTypes = computed(() => Array.isArray(typesRes.value?.results) ? typesRes.value.results : [])
const labelsFromApi = computed(() => reactionTypes.value.map(t => t.label))
const preferredOrder = ['Like', 'Good', 'Fire', 'Dislike']
const orderLabels = computed(() => [
  ...preferredOrder.filter(l => labelsFromApi.value.includes(l)),
  ...labelsFromApi.value.filter(l => !preferredOrder.includes(l))
])
const typeByLabel = computed(() => {
  const map = {}
  for (const t of reactionTypes.value) map[t.label] = t
  return map
})

/* ---------- Helpers for reaction counts UI ---------- */
function applyDelta (newsId, label, delta) {
  bump[newsId] = bump[newsId] || {}
  const cur = bump[newsId][label] ?? 0
  bump[newsId][label] = cur + delta
}

function reactionsFor (a) {
  const rc = a?.reaction_counts || {}
  return orderLabels.value.map(label => {
    const fromApi = typeByLabel.value[label] || {}
    const base = rc[label]?.count ?? 0
    const plus = bump[a?.id]?.[label] ?? 0
    return {
      label,
      id: fromApi.id,
      emoji: fromApi.emoji || rc[label]?.emoji || '',
      image: fromApi.image || rc[label]?.image || null,
      count: Math.max(0, base + plus)
    }
  })
}

/* ---------- Persist user selection locally ---------- */
const LS_KEY = computed(() => `news_react:${userKey.value}`)
function loadSelections () {
  try {
    const raw = localStorage.getItem(LS_KEY.value)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}
function saveSelections (obj) {
  try { localStorage.setItem(LS_KEY.value, JSON.stringify(obj)) } catch {}
}
function hydrateSelectedFromStorage () {
  const map = loadSelections()
  for (const k of Object.keys(map)) selected[k] = map[k]
}
watch(userKey, () => { // смена пользователя — перезагружаем локальные селекты
  Object.keys(selected).forEach(k => delete selected[k])
  hydrateSelectedFromStorage()
})

/* Если бэк начнет отдавать my_reaction — можно подхватывать тут. */
function hydrateSelectedFromServer(/* articles */) {
  // пример:
  // for (const a of articles) if (a.my_reaction_label) selected[a.id] = a.my_reaction_label
}

/* ---------- POST /news/articles/react/ ---------- */
async function postReaction (newsId, typeId) {
  return $api('/news/articles/react/', { method: 'POST', body: { news: newsId, type: typeId } })
}

/* ---------- Click handler (toggle/switch) ---------- */
function onReactClick (a, label) {
  if (!a?.id) return
  if (!isAuthenticated.value) { openLoginHint(); return }
  const id = a.id
  if (reacting[id]) return
  reacting[id] = true

  const prev = selected[id] || null
  const newTypeId = typeByLabel.value[label]?.id

  // локально: одно нажатие = либо снять, либо переключить
  if (prev === label) {
    // снять
    applyDelta(id, label, -1)
    selected[id] = null
  } else {
    // переключить
    if (prev) applyDelta(id, prev, -1)
    applyDelta(id, label, +1)
    selected[id] = label
  }

  // сервер: одна и та же ручка — сервер сам трактует (создать/сменить/снять)
  postReaction(id, newTypeId)
    .then(() => {
      // сохраняем локально
      const map = loadSelections()
      if (selected[id]) map[id] = selected[id]
      else delete map[id]
      saveSelections(map)
    })
    .catch(err => {
      console.error('reaction error', err)
      // ОТКАТ
      if (prev === label) {
        // мы сняли — вернём
        applyDelta(id, label, +1)
        selected[id] = label
      } else {
        // мы переключили — вернуть всё как было
        applyDelta(id, label, -1)
        if (prev) applyDelta(id, prev, +1)
        selected[id] = prev
      }
    })
    .finally(() => { reacting[id] = false })
}

/* ---------- Games for switcher ---------- */
/* ---------- Games for switcher (fixed) ---------- */

// используем $tapi если он есть, иначе $api
const fetchGames = () =>
  ($tapi || $api)('/tournaments/games/', {
    query: {
      ordering: 'title',
      page: 1,
      // search: ''  // если нужно — подставишь
    }
  })

const {
  data: gamesRes,
  pending: gamesPending,
  error: gamesError,
  refresh: refreshGames
} = await useAsyncData('games', fetchGames)

if (process.client) {
  watch(gamesRes, v => { if (v) console.log('[games] response', v) }, { immediate: true })
  watch(gamesError, e => { if (e) console.error('[games] error', e) }, { immediate: true })
}

// аккуратно достаём массив игр
const games = computed(() => {
  const v = gamesRes.value
  // API: { count, results: [...] }
  return Array.isArray(v?.results) ? v.results : []
})

// имена категорий в свитчере
const categoryNames = computed(() => ['Все', ...games.value.map(g => g.title)])

// текущий параметр для /news/main/?game=...
// у API нет slug — используем id
const currentGameParam = computed(() => {
  if (activeCategory.value === 0) return null
  const g = games.value[activeCategory.value - 1]
  return g?.id ?? null
})

// если игр стало меньше — не даём activeCategory вылезти за пределы
watch([games, categoryNames], () => {
  if (activeCategory.value > categoryNames.value.length - 1) {
    activeCategory.value = 0
  }
  // после обновления списка обязательно пересчитать размеры кнопок
  nextTick(() => calculateButtonWidths())
}, { immediate: true })


/* ---------- News main ---------- */
function safeLog(label, v) { try { console.log(label, JSON.parse(JSON.stringify(v))) } catch { console.log(label, v) } }
const { data, pending, error } = await useAsyncData(
  'news-main',
  () => $api('/news/main/', { query: currentGameParam.value ? { game: currentGameParam.value } : {} }),
  { watch: [currentGameParam] }
)
if (process.client) {
  watch(data,  v => { if (v) safeLog('[news-main] response', v) }, { immediate: true })
  watch(error, e => { if (e) console.error('[news-main] error', e) }, { immediate: true })
}
const errorText = computed(() => (error.value && (error.value.statusMessage || error.value.message)) || 'Не удалось загрузить')

const hero = computed(() => data.value?.hero_articles || [])
const side = computed(() => data.value?.side_articles || [])

// При каждом приходе новых данных — сбрасываем локальные дельты для видимых новостей
watch([hero, side], () => {
  const ids = new Set([...hero.value.map(a => a.id), ...side.value.map(a => a.id)])
  for (const id of Object.keys(bump)) if (!ids.has(Number(id))) delete bump[id]
  // гидратация активной реакции из localStorage
  hydrateSelectedFromStorage()
  // если будет серверная "my_reaction" — можно позвать hydrateSelectedFromServer([...hero.value,...side.value])
}, { immediate: true })

const topArticle = computed(() => hero.value[0] || side.value[0] || null)
const rightTwo = computed(() => hero.value.slice(1, 3))

const bottomList = computed(() => [...side.value.slice(1), ...side.value.slice(2)])

/* ---------- Misc helpers ---------- */
const title = a => a?.meta_title || a?.title || 'Без заголовка'
const desc  = a => a?.meta_description || ''
const img   = a => a?.banner || null
const formatDate = iso => !iso ? '' : new Date(iso).toLocaleDateString('ru-RU')
const timeAgo = iso => {
  if (!iso) return ''
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return 'только что'
  if (diff < 3600) return `${Math.floor(diff/60)} мин назад`
  if (diff < 86400) return `${Math.floor(diff/3600)} ч назад`
  return formatDate(iso)
}
const linkTo = a => (a?.id ? `/news-more/${a.id}` : (a?.source_url || '/news-more'))
</script>

<style>
@import './news.css';

.state { text-align: center; margin: 20px 0; opacity: .8; }
.state.error { color: #e11d48; }

/* Панель реакций */
.reactions { display: flex; gap: 10px; align-items: center; }
.reactions--inline { margin-top: 8px; }

.reaction-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: none;
  background: #ffffff5e;
  cursor: pointer;
  font: inherit;
  line-height: 1;
  color: #fff;
  transition: background .15s ease, border-color .15s ease, opacity .15s;
}
.reaction-btn img { width: 18px; height: 18px; object-fit: contain; }
.reaction-btn b { font-weight: 600; }
.reaction-btn:disabled { opacity: .6; cursor: not-allowed; }
.reaction-btn.active { background: var(--bg-blue, #2e90fa); }

/* Тост «войдите» */
.login-hint {
  position: fixed; left: 16px; right: 16px; bottom: 16px;
  margin: 0 auto; width: max-content;
  background: #111827; color: #fff;
  border: 1px solid #334155; border-radius: 12px;
  padding: 12px 16px; display: flex; gap: 8px; align-items: center;
  z-index: 60;
}
.login-hint a { color: #60a5fa; text-decoration: underline; }
.login-hint .close {
  margin-left: auto; background: none; border: none;
  color: #9ca3af; font-size: 18px; line-height: 1; cursor: pointer;
}
@media (max-width:520px) { .login-hint{ width: 92%; flex-direction: column; } }
</style>
