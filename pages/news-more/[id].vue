<template>
  <div class="news-more">
    <NuxtLink to="/news" class="back-nav">
      <button class="back-btn">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M15 10H5M5 10L10 15M5 10L10 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
        Назад
      </button>
    </NuxtLink>

    <div v-if="pending" class="state">Загрузка…</div>
    <div v-else-if="error" class="state error">Ошибка: {{ errorText }}</div>

    <div v-else-if="article" class="main-content">
      <div class="featured-media">
        <img :src="article.banner || '/assets/news/news1.svg'" :alt="title" />
        <div class="view-count" v-if="article.view_count != null">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4C6.5 4 3.5 6.5 2 10C3.5 13.5 6.5 16 10 16C13.5 16 16.5 13.5 18 10C16.5 6.5 13.5 4 10 4Z"
              stroke="white" stroke-width="1.5" />
            <path
              d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z"
              stroke="white" stroke-width="1.5" />
          </svg>
          <span>{{ formatNumber(article.view_count) }}</span>
        </div>
        <div class="article-reactions reactions reactions-more" v-if="reactionList.length">
          <button v-for="r in reactionList" :key="r.label" type="button" class="reaction-btn"
            :class="{ active: selectedLabel === r.label, loading: reacting }" :disabled="reacting || !typesReady"
            :title="selectedLabel === r.label ? `Убрать реакцию ${r.label}` : `Поставить реакцию ${r.label}`"
            @click.stop.prevent="onReactClick(r.label)">
            <img :src="r.image || fallbackIcons[r.label]" :alt="r.label" />
            <b>{{ Math.max(0, r.count + (countsBump[r.label] ?? 0)) }}</b>
          </button>
        </div>
      </div>

      <div class="article-header">
        <h1 class="article-title">{{ title }}</h1>
        <div class="article-meta">
          <span class="article-date">{{ formattedDate }}</span>
          <span v-if="article.game?.title" class="article-game">• {{ article.game.title }}</span>
        </div>

        <!-- === Реакции === -->

      </div>

      <div class="article-content" v-html="renderBody"></div>

      <div class="source" v-if="article.source_name || article.source_url">
        <span>Источник:</span>
        <a v-if="article.source_url" :href="article.source_url" target="_blank" rel="noopener">
          {{ article.source_name || article.source_url }}
        </a>
        <span v-else>{{ article.source_name }}</span>
      </div>
    </div>

    <div v-else class="state">Не найдено</div>

    <!-- Тост «войдите в аккаунт» -->
    <div v-if="showLoginHint" class="login-hint">
      Чтобы поставить реакцию — <NuxtLink to="/login">войдите в аккаунт</NuxtLink>.
      <button class="close" @click="closeLoginHint" aria-label="Закрыть">×</button>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, reactive, ref, onUnmounted } from 'vue'

const route = useRoute()
const { $api } = useNuxtApp()
const { isAuthenticated, user } = useAuth()

/* ===== загрузка статьи ===== */
const { data, pending, error } = await useAsyncData(
  () => `news-article-${route.params.id}`,
  () => $api(`/news/articles/${route.params.id}/`)
)

if (process.client) {
  watch(data, v => { if (v) console.log('[article] response', v) }, { immediate: true })
  watch(error, e => { if (e) console.error('[article] error', e) }, { immediate: true })
}

const article = computed(() => data.value || null)
const articleId = computed(() => Number(route.params.id))
const title = computed(() => {
  const t = article.value
  const meta = (t?.meta_title ?? '').trim()
  if (meta) return meta
  const src = (t?.source_name ?? '').trim()
  if (src) return src
  if (t?.game?.title) return t.game.title
  return 'Без заголовка'
})
const formattedDate = computed(() => {
  const iso = article.value?.publish_date
  return iso ? new Date(iso).toLocaleDateString('ru-RU') : ''
})
function decodeEntities(s) {
  if (!s || typeof s !== 'string') return ''
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
}
const renderBody = computed(() => decodeEntities(article.value?.body || ''))
function formatNumber(n) {
  try { return new Intl.NumberFormat('ru-RU').format(n ?? 0) } catch { return String(n ?? 0) }
}
const errorText = computed(() => (error.value?.statusMessage || error.value?.message || 'Не удалось загрузить'))

useHead(() => ({
  title: title.value,
  meta: [
    { name: 'description', content: article.value?.meta_description || '' },
    { name: 'keywords', content: article.value?.meta_keywords || '' }
  ]
}))

/* ===== типы реакций ===== */
const { data: typesRes } = await useAsyncData(
  'news-reaction-types',
  () => $api('/news/articles/react/types/', { query: { ordering: 'id' } })
)
const reactionTypes = computed(() =>
  Array.isArray(typesRes.value?.results) ? typesRes.value.results : []
)
const typesReady = computed(() => reactionTypes.value.length > 0)
const preferred = ['Like', 'Good', 'Fire', 'Dislike']
const orderedTypes = computed(() => {
  const labels = new Set(reactionTypes.value.map(t => t.label))
  return [
    ...preferred.filter(l => labels.has(l)),
    ...reactionTypes.value.map(t => t.label).filter(l => !preferred.includes(l))
  ]
    .map(label => reactionTypes.value.find(t => t.label === label))
    .filter(Boolean)
})

/* ===== состояние реакций ===== */
const selectedLabel = ref(null)                        // текущая реакция пользователя (label)
const countsBump = reactive({})                        // локальные дельты по label
const reacting = ref(false)                            // спин/дизейбл на время POST
const fallbackIcons = { Fire: '/assets/news/fire.svg', Like: '/assets/news/heart.svg', Good: '/assets/news/like.svg', Dislike: '/assets/news/dislike.svg' }

/* список реакций для UI (счётчики из API + локальные дельты) */
const reactionList = computed(() => {
  const rc = article.value?.reaction_counts || {}
  return orderedTypes.value.map(t => ({
    id: t.id,
    label: t.label,
    image: t.image || rc?.[t.label]?.image || null,
    emoji: t.emoji || rc?.[t.label]?.emoji || '',
    count: rc?.[t.label]?.count ?? 0
  }))
})

/* ===== локальное хранение выбора (на случай, если сервер не вернёт my_reaction) ===== */
const userKey = computed(() => (isAuthenticated.value ? (user.value?.id || 'auth') : 'guest'))
const LS_KEY = computed(() => `news_react:article:${articleId.value}:${userKey.value}`)
const loadSel = () => { try { return localStorage.getItem(LS_KEY.value) } catch { return null } }
const saveSel = (label) => {
  try {
    if (label) localStorage.setItem(LS_KEY.value, label)
    else localStorage.removeItem(LS_KEY.value)
  } catch { }
}

/* при получении статьи — гидратируем selectedLabel и сбрасываем дельты */
watch(article, v => {
  // сброс bump'ов
  Object.keys(countsBump).forEach(k => delete countsBump[k])
  // пробуем my_reaction: может быть строкой (label) или id типа
  const mr = v?.my_reaction ?? null
  if (typeof mr === 'string') {
    selectedLabel.value = mr
  } else if (typeof mr === 'number') {
    const t = reactionTypes.value.find(rt => rt.id === mr)
    selectedLabel.value = t?.label || null
  } else {
    selectedLabel.value = loadSel()
  }
}, { immediate: true })

/* тост «войдите» */
const showLoginHint = ref(false)
let loginHintTimer = null
function openLoginHint() {
  showLoginHint.value = true
  if (loginHintTimer) clearTimeout(loginHintTimer)
  loginHintTimer = setTimeout(() => (showLoginHint.value = false), 5000)
}
function closeLoginHint() { showLoginHint.value = false; if (loginHintTimer) clearTimeout(loginHintTimer) }
onUnmounted(() => { if (loginHintTimer) clearTimeout(loginHintTimer) })

/* POST /news/articles/react/ */
function postReaction(newsId, typeId) {
  return $api('/news/articles/react/', { method: 'POST', body: { news: newsId, type: typeId } })
}
function bump(label, d) { countsBump[label] = (countsBump[label] ?? 0) + d }

/* клик по реакции с валидацией авторизации и оптимистичным обновлением */
async function onReactClick(label) {
  if (!articleId.value) return
  if (!isAuthenticated.value) { openLoginHint(); return }
  if (reacting.value || !typesReady.value) return
  reacting.value = true

  const prev = selectedLabel.value
  const typeId = reactionTypes.value.find(t => t.label === label)?.id

  // оптимистично обновляем локально
  if (prev === label) {
    bump(label, -1); selectedLabel.value = null
  } else {
    if (prev) bump(prev, -1)
    bump(label, +1); selectedLabel.value = label
  }

  try {
    await postReaction(articleId.value, typeId)
    saveSel(selectedLabel.value)
  } catch (e) {
    // откат
    if (prev === label) {
      bump(label, +1); selectedLabel.value = label
    } else {
      bump(label, -1); if (prev) bump(prev, +1); selectedLabel.value = prev
    }
    console.error('[reaction] error', e)
  } finally {
    reacting.value = false
  }
}
</script>

<style>
@import '../news-more.css';

.state {
  text-align: center;
  margin: 20px 0;
  opacity: 0.8;
}

.state.error {
  color: #e11d48;
}

/* реакции */
.reactions-more {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 10px;
  position: absolute;
  bottom: 20px;
  right: 100px;
}

.reaction-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: #ffffff5e;
  backdrop-filter: blur(4px);
  color: #fff;
  cursor: pointer;
  font: inherit;
  line-height: 1;
  transition: background .15s ease, border-color .15s ease, opacity .15s;
}

.reaction-btn img {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.reaction-btn b {
  font-weight: 600;
}

.reaction-btn.active {
  background: var(--bg-blue, #2e90fa);
}

.reaction-btn.loading,
.reaction-btn:disabled {
  opacity: .6;
  cursor: not-allowed;
}

/* тост «войдите» */
.login-hint {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: 16px;
  margin: 0 auto;
  width: max-content;
  background: #111827;
  color: #fff;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  gap: 8px;
  align-items: center;
  z-index: 60;
}

.login-hint a {
  color: #60a5fa;
  text-decoration: underline;
}

.login-hint .close {
  margin-left: auto;
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

/* остальное из вашего файла */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}

.tag {
  background: #f3f4f6;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
}

.article-meta {
  color: #6b7280;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.source {
  margin-top: 16px;
  color: #6b7280;
}

.source a {
  color: #2563eb;
}
@media (max-width:769px) {
  .reactions-more{
    bottom: 13px!important;
    right: 80px;
  }
  .reactions-more .reaction-btn{
    padding: 2px 10px;
  }
}
@media (max-width:490px) {
  .reactions-more{
    right: 70px!important;
  }
}
</style>
