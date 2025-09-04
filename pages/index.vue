<template>
  <div class="cyber-olam-main">
    <!-- ===== Верхняя зона (без изменений) ===== -->
    <section class="cyber-olam-main-top">
      <div class="cyber-olam-main-top-left">
        <Swiper />
      </div>

      <div class="cyber-olam-main-top-right">
        <div class="right-content-tur">
          <h2>Текущие турниры</h2>
          <div class="right-content-tur-link-wrap">
            <NuxtLink to="/">RAVE Valorant</NuxtLink>
            <NuxtLink to="/">EMAE Qualification</NuxtLink>
            <NuxtLink to="/">cis</NuxtLink>
          </div>
          <NuxtLink to="/" class="turnament-link">
            <img src="@/assets/main/fire.svg" alt="arrow-right" />
            Перейти
            <img src="@/assets/main/fire.svg" alt="arrow-right" />
          </NuxtLink>
          <img class="right-content-tur-img" src="@/assets/main/turnamenttoday.svg" alt="turnamenttoday" />
        </div>

        <div class="right-content-live">
          <h2>В ПРЯМОМ ЭФИРЕ</h2>
          <NuxtLink to="/">
            Все
            <img src="@/assets/main/arrow-right.svg" alt="live" />
          </NuxtLink>
          <iframe class="right-content-live-iframe" src="https://www.youtube.com/embed/Wal8amej3rA?si=FIAhunGoebbOGZX8"
            title="YouTube video player" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen />
        </div>

      </div>
    </section>

    <!-- ===== Ближайшие турниры (без изменений) ===== -->
    <section class="cyber-olam-main-top cyber-olam-main-top-next">
      <div class="cyber-olam-main-top-left cyber-olam-main-top-left-next">
        <div class="cyber-olam-main-top-left-top">
          <h2>БЛИЖАЙШИЕ ТУРНИРЫ</h2>
          <NuxtLink to="/">
            Все
            <img src="@/assets/main/arrow-right.svg" alt="live" />
          </NuxtLink>
        </div>
        <div class="cyber-olam-main-top-left-bottom">
          <div class="cyber-olam-main-top-left-bottom-item">
            <img src="@/assets/main/arcreed.svg" alt="turnamenttoday" />
            <div class="cyber-olam-main-top-left-bottom-item-text">
              <h3>Arcreed</h3>
            </div>
          </div>
          <h4 class="cyber-olam-main-top-left-bottom-item-line">
            <img src="@/assets/main/cslogo.svg" alt="clock" />
            12:44:67
          </h4>
          <div class="cyber-olam-main-top-left-bottom-item">
            <img src="@/assets/main/virtus.svg" alt="turnamenttoday" />
            <div class="cyber-olam-main-top-left-bottom-item-text">
              <h3>Virtus</h3>
            </div>
          </div>
        </div>
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" width="66" height="38" viewBox="0 0 66 38" fill="none">
            <g clip-path="url(#clip0_247_1034)">
              <path opacity="0.5"
                d="M-0.5625 -0.249902C-0.5625 -1.11301 0.170355 -1.88484 1.27421 -2.18429C2.37807 -2.48374 3.61945 -2.24748 4.38541 -1.59216L26.8854 17.6578C27.7882 18.4302 27.7882 19.57 26.8854 20.3424L4.38541 39.5924C3.61945 40.2477 2.37807 40.4839 1.27421 40.1845C0.170355 39.885 -0.5625 39.1132 -0.5625 38.2501L-0.5625 -0.249902Z"
                fill="#008DFF" />
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M15.4196 -1.81593C14.2403 -1.07462 14.1037 0.227435 15.1146 1.09229L36.0457 19L15.1146 36.9078C14.1037 37.7726 14.2403 39.0747 15.4196 39.816C16.599 40.5573 18.3745 40.4572 19.3854 39.5923L41.8854 20.3423C42.7882 19.5699 42.7882 18.4302 41.8854 17.6578L19.3854 -1.59222C18.3745 -2.45708 16.599 -2.55724 15.4196 -1.81593Z"
                fill="#008DFF" />
            </g>
            <defs>
              <clipPath id="clip0_247_1034">
                <rect width="66" height="90" fill="white" transform="matrix(0 1 -1 0 66 -14)" />
              </clipPath>
            </defs>
          </svg>
          ПОДРОБНЕЕ
          <svg xmlns="http://www.w3.org/2000/svg" width="66" height="38" viewBox="0 0 66 38" fill="none">
            <g clip-path="url(#clip0_247_1035)">
              <path opacity="0.5"
                d="M66.5625 -0.249902C66.5625 -1.11301 65.8296 -1.88484 64.7258 -2.18429C63.6219 -2.48374 62.3805 -2.24748 61.6146 -1.59216L39.1146 17.6578C38.2118 18.4302 38.2118 19.57 39.1146 20.3424L61.6146 39.5924C62.3805 40.2477 63.6219 40.4839 64.7258 40.1845C65.8296 39.885 66.5625 39.1132 66.5625 38.2501V-0.249902Z"
                fill="#008DFF" />
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M50.5804 -1.81593C51.7597 -1.07462 51.8963 0.227435 50.8854 1.09229L29.9543 19L50.8854 36.9078C51.8963 37.7726 51.7597 39.0747 50.5804 39.816C49.401 40.5573 47.6255 40.4572 46.6146 39.5923L24.1146 20.3423C23.2118 19.5699 23.2118 18.4302 24.1146 17.6578L46.6146 -1.59222C47.6255 -2.45708 49.401 -2.55724 50.5804 -1.81593Z"
                fill="#008DFF" />
            </g>
            <defs>
              <clipPath id="clip0_247_1035">
                <rect width="66" height="90" fill="white" transform="matrix(0 1 1 0 0 -14)" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      <div class="cyber-olam-main-top-right cyber-olam-main-top-right-next">
        <h2>БЛИЖАЙШЕЕ СОБЫТИЕ</h2>
        <h4 class="cyber-olam-main-top-right-line">
          Время до начала:<br />
          12:44:67
        </h4>
        <NuxtLink to="/" class="next-turnament-link">
          <img src="@/assets/main/btn-right.svg" alt="arrow-right" />
          Перейти
          <img src="@/assets/main/btn-left.svg" alt="arrow-right" />
        </NuxtLink>
        <img class="right-content-tur-img-next" src="@/assets/main/nextbg.svg" alt="turnamenttoday" />
      </div>
    </section>

    <!-- ===== Интересные матчи (без изменений) ===== -->
    <section class="main-interest">
      <h2>Интересные матчи</h2>
      <NuxtLink to="/" class="main-interest-link">
        Все
        <img src="@/assets/main/arrow-right.svg" alt="live" />
      </NuxtLink>
      <div class="main-interest-wrapper">
        <div class="main-interest-item">
          <img class="main-interest-item-img" src="@/assets/main/cslogo.svg" alt="interest" />
          <div class="main-interest-item-info">
            <div class="main-interest-item-info-text">
              <img src="@/assets/main/arcreed.svg" alt="clock" />
              <h3>Arcreed</h3>
            </div>
            <h4 class="main-interest-item-info-line">12/4</h4>
            <div class="main-interest-item-info-text">
              <img src="@/assets/main/virtus.svg" alt="clock" />
              <h3>Virtus</h3>
            </div>
          </div>
          <NuxtLink to="/" class="main-interest-item-link">Перейти</NuxtLink>
        </div>

        <div class="main-interest-item">
          <img class="main-interest-item-img" src="@/assets/main/cslogo.svg" alt="interest" />
          <div class="main-interest-item-info">
            <div class="main-interest-item-info-text">
              <img src="@/assets/main/arcreed.svg" alt="clock" />
              <h3>Arcreed</h3>
            </div>
            <h4 class="main-interest-item-info-line">12/4</h4>
            <div class="main-interest-item-info-text">
              <img src="@/assets/main/virtus.svg" alt="clock" />
              <h3>Virtus</h3>
            </div>
          </div>
          <NuxtLink to="/" class="main-interest-item-link">Перейти</NuxtLink>
        </div>

        <div class="main-interest-item">
          <img class="main-interest-item-img" src="@/assets/main/cslogo.svg" alt="interest" />
          <div class="main-interest-item-info">
            <div class="main-interest-item-info-text">
              <img src="@/assets/main/arcreed.svg" alt="clock" />
              <h3>Arcreed</h3>
            </div>
            <h4 class="main-interest-item-info-line">12/4</h4>
            <div class="main-interest-item-info-text">
              <img src="@/assets/main/virtus.svg" alt="clock" />
              <h3>Virtus</h3>
            </div>
          </div>
          <NuxtLink to="/" class="main-interest-item-link">Перейти</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ===== Турниры (без изменений) ===== -->
    <div class="main-title-wrap">
      <h2>Турниры</h2>
      <NuxtLink to="/">
        Все
        <img src="@/assets/main/arrow-right.svg" alt="live" />
      </NuxtLink>
    </div>
    <Turnirsnew />

    <!-- ===== Новости: самая свежая + реакции с проверкой авторизации ===== -->
    <div class="main-title-wrap">
      <h2>Новости</h2>
      <NuxtLink to="/news">
        Все
        <img src="@/assets/main/arrow-right.svg" alt="live" />
      </NuxtLink>
    </div>

    <section class="main-news" v-if="latest">
      <div class="main-news-top">
        <span>
          <img src="@/assets/news/view.svg" alt="views" />
          {{ latest?.view_count ?? 0 }}
        </span>
        <span>{{ formatDate(latest?.publish_date) }}</span>
      </div>

      <!-- СТАЛО -->
      <NuxtLink v-if="latestId" :to="`/news-more/${latestId}`" class="news-center">
        {{ latestTitle }}
      </NuxtLink>

      <img class="main-news-img" :src="latestImage || '/assets/news/news3.svg'" alt="news" />

      <div class="news-bottom">
        <h3>{{ latestGame }}</h3>

        <!-- Реакции (как на странице новостей) -->
        <div class="news-bottom-right reactions">
          <button v-for="r in latestReactions" :key="r.label" type="button" class="reaction-pill"
            :class="{ active: selectedLabel === r.label, loading: reacting }" :disabled="reacting"
            :title="selectedLabel === r.label ? `Убрать реакцию ${r.label}` : `Поставить реакцию ${r.label}`"
            @click="onReactClick(r.label)">
            {{ Math.max(0, (countsBump[r.label] ?? 0) + r.count) }}
            <img :src="r.image || fallbackIcons[r.label]" :alt="r.label" />
          </button>
        </div>
      </div>
    </section>

    <!-- стейты -->
    <section v-else class="main-news">
      <div class="state">Загрузка…</div>
    </section>

    <!-- ===== Топ трансляций (без изменений) ===== -->
    <div class="main-title-wrap">
      <h2>Топ трансляций</h2>
      <NuxtLink to="/">
        Все
        <img src="@/assets/main/arrow-right.svg" alt="live" />
      </NuxtLink>
    </div>

    <section class="main-live">
      <div class="main-live-item" v-for="i in 3" :key="i">
        <div class="main-live-item-top">
          <img src="@/assets/live/cs.png" alt="live" />
          <span>
            <img src="@/assets/live/play.svg" alt="live" />
            ПРЯОМЙ ЭФИР
          </span>
          <span>2,5 тыс. зрителей</span>
        </div>
        <div class="main-live-item-bottom">
          <img src="@/assets/live/comand.svg" alt="live" />
          <div class="main-live-item-bottom-text">
            <h3>Gorem ipsum dolor sit amet, consectetur adip odio mattis.</h3>
            <h4>Deko <img src="@/assets/live/verif.svg" alt="live" /></h4>
            <h4>CS 2</h4>
            <span>Английский</span>
          </div>
          <button class="main-live-item-bottom-option">
            <img src="@/assets/live/option.svg" alt="live" />
          </button>
        </div>
      </div>
    </section>

    <!-- ===== Тост «войдите в аккаунт» ===== -->
    <div v-if="showLoginHint" class="login-hint">
      Чтобы поставить реакцию — <NuxtLink to="/login">войдите в аккаунт</NuxtLink>.
      <button class="close" @click="closeLoginHint" aria-label="Закрыть">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Turnirsnew from '@/components/turnirsnew/turnirsnew.vue'

/* API & Auth */
const { $api } = useNuxtApp()
const { isAuthenticated, user } = useAuth()

/* ===== 1) Берём самую свежую новость ===== */
const { data: listRes } = await useAsyncData('news-latest-list', () =>
  $api('/news/articles/', { query: { ordering: '-publish_date', page: 1 } })
)
const latestId = computed<number | null>(() => {
  const arr = Array.isArray(listRes.value?.results) ? listRes.value?.results : []
  return arr?.[0]?.id ?? null
})

/* ===== 2) Детали (реакции и т.д.) ===== */
const { data: details } = await useAsyncData(
  'news-latest-details',
  () => (latestId.value ? $api(`/news/articles/${latestId.value}/`) : null),
  { watch: [latestId] }
)

const latest = computed<any>(() => details.value || null)
const latestTitle = computed<string>(() => latest.value?.meta_title || latest.value?.title || '—')
const latestImage = computed<string | null>(() => latest.value?.banner ?? null)
const latestGame = computed<string>(() => latest.value?.game?.title || '—')
const formatDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('ru-RU') : '')

console.log(latest)

/* ===== 3) Типы реакций и отображение ===== */
const { data: typesRes } = await useAsyncData(
  'news-reaction-types',
  () => $api('/news/articles/react/types/', { query: { ordering: 'id' } })
)
type ReactionType = { id: number; label: string; emoji?: string; image?: string }
const reactionTypes = computed<ReactionType[]>(() =>
  Array.isArray(typesRes.value?.results) ? typesRes.value.results : []
)
const preferred = ['Like', 'Good', 'Fire', 'Dislike']
const orderedTypes = computed<ReactionType[]>(() => {
  const labels = new Set(reactionTypes.value.map(t => t.label))
  return [
    ...preferred.filter(l => labels.has(l)),
    ...reactionTypes.value.map(t => t.label).filter(l => !preferred.includes(l))
  ]
    .map(label => reactionTypes.value.find(t => t.label === label)!)
    .filter(Boolean)
})

/* реакция пользователя (label), bump-счётчики для оптимистичного обновления */
const selectedLabel = ref<string | null>(null)
const countsBump = reactive<Record<string, number>>({}) // {'Fire': +1, 'Like': -1, ...}
const reacting = ref(false)

/* локальная иконка-резерв */
const fallbackIcons: Record<string, string> = {
  Fire: '/assets/news/fire.svg',
  Like: '/assets/news/heart.svg',
  Good: '/assets/news/like.svg',
  Dislike: '/assets/news/dislike.svg'
}

/* подготовить массив реакций для отображения */
const latestReactions = computed(() => {
  const rc = latest.value?.reaction_counts || {}
  return orderedTypes.value.map(t => ({
    id: t.id,
    label: t.label,
    emoji: t.emoji || rc?.[t.label]?.emoji || '',
    image: t.image || rc?.[t.label]?.image || null,
    count: rc?.[t.label]?.count ?? 0
  }))
})

/* ===== 4) Гидратация my_reaction / localStorage ===== */
const userKey = computed(() => (isAuthenticated.value ? (user.value?.id || 'auth') : 'guest'))
const LS_KEY = computed(() => `news_react:main:${userKey.value}`)
function loadSel(): string | null {
  try { return localStorage.getItem(LS_KEY.value) } catch { return null }
}
function saveSel(label: string | null) {
  try {
    if (label) localStorage.setItem(LS_KEY.value, label)
    else localStorage.removeItem(LS_KEY.value)
  } catch { }
}

/* при загрузке деталей попытаемся взять my_reaction, иначе из LS */
watch(
  () => latest.value,
  v => {
    // сервер может вернуть id или строку
    const mr = v?.my_reaction ?? null
    if (typeof mr === 'string') selectedLabel.value = mr
    else if (typeof mr === 'number') {
      const t = reactionTypes.value.find(rt => rt.id === mr)
      selectedLabel.value = t?.label ?? null
    } else {
      selectedLabel.value = loadSel()
    }
    // сбросить локальные дельты
    Object.keys(countsBump).forEach(k => delete countsBump[k])
  },
  { immediate: true }
)

/* ===== 5) Тост «войдите» ===== */
const showLoginHint = ref(false)
let loginHintTimer: any = null
function openLoginHint() {
  showLoginHint.value = true
  if (loginHintTimer) clearTimeout(loginHintTimer)
  loginHintTimer = setTimeout(() => (showLoginHint.value = false), 5000)
}
function closeLoginHint() { showLoginHint.value = false; if (loginHintTimer) clearTimeout(loginHintTimer) }
onUnmounted(() => { if (loginHintTimer) clearTimeout(loginHintTimer) })

/* ===== 6) Отправка реакций (как на странице новостей) ===== */
async function postReaction(newsId: number, typeId: number) {
  return $api('/news/articles/react/', { method: 'POST', body: { news: newsId, type: typeId } })
}

function applyDelta(label: string, d: number) {
  countsBump[label] = (countsBump[label] ?? 0) + d
}

/* клик по реакции (toggle/switch) с проверкой авторизации */
async function onReactClick(label: string) {
  if (!latestId.value) return
  if (!isAuthenticated.value) { openLoginHint(); return }
  if (reacting.value) return
  reacting.value = true

  const prev = selectedLabel.value
  const typeId = reactionTypes.value.find(t => t.label === label)?.id

  // оптимистично
  if (prev === label) {
    // снимаем
    applyDelta(label, -1)
    selectedLabel.value = null
  } else {
    if (prev) applyDelta(prev, -1)
    applyDelta(label, +1)
    selectedLabel.value = label
  }

  try {
    await postReaction(latestId.value, typeId!)
    saveSel(selectedLabel.value)
  } catch (e) {
    // откат
    if (prev === label) {
      applyDelta(label, +1)
      selectedLabel.value = label
    } else {
      applyDelta(label, -1)
      if (prev) applyDelta(prev, +1)
      selectedLabel.value = prev
    }
    console.error('[reaction] error', e)
  } finally {
    reacting.value = false
  }
}
</script>

<style scoped>
@import "./index.css";

/* ----- реакции ----- */
.reactions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.reaction-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: #ffffff5e;
  color: #fff;
  cursor: pointer;
  font: inherit;
  line-height: 1;
  transition: background .15s ease, border-color .15s ease, opacity .15s;
}

.reaction-pill img {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.reaction-pill.active {
  background: var(--bg-blue, #2e90fa);
}

.reaction-pill.loading,
.reaction-pill:disabled {
  opacity: .6;
  cursor: not-allowed;
}

/* ----- тост «войдите в аккаунт» ----- */
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

@media (max-width:520px) {
  .login-hint {
    width: 92%;
    flex-direction: column;
  }
}

/* простые стейты */
.state {
  text-align: center;
  margin: 20px 0;
  opacity: .8;
}
</style>
