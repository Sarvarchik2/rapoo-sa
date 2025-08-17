<template>
  <div class="create-team-page">
    <!-- Top Navigation -->
    <div class="create-team-nav">
      <NuxtLink to="/profile" class="back-button">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M15 10H5M5 10L10 5M5 10L10 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
        Назад
      </NuxtLink>

      <!-- Game Categories -->
      <div class="game-categories" :data-active="activeCategory" :style="indicatorStyle">
        <button ref="cs2Btn" class="game-category" :class="{ active: activeCategory === 'cs2' }"
          @click="setActiveCategory('cs2')">
          CS 2
        </button>
        <button ref="dota2Btn" class="game-category" :class="{ active: activeCategory === 'dota2' }"
          @click="setActiveCategory('dota2')">
          DOTA 2
        </button>
        <button ref="valorantBtn" class="game-category" :class="{ active: activeCategory === 'valorant' }"
          @click="setActiveCategory('valorant')">
          VALORANT
        </button>
        <button ref="mobileBtn" class="game-category" :class="{ active: activeCategory === 'mobile' }"
          @click="setActiveCategory('mobile')">
          MOBILE LEGENDS
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="create-team-content">
      <!-- Players Section -->
      <div class="players-section">
        <h2 class="section-title">Игроки</h2>
        <div class="players-grid">
          <!-- Player Card 1 -->
          <div class="player-card">
            <div class="player-menu" @click.stop="togglePlayerMenu(1)">
              <img src="@/assets/icons/more.svg" alt="player more">

              <!-- Dropdown Menu -->
              <div class="player-dropdown" v-if="activePlayerMenu === 1">
                <div class="dropdown-item delete">Удалить</div>
              </div>
            </div>
            <div class="player-avatar">
              <img src="@/assets/icons/navbar/user.svg" alt="Player Avatar" />
            </div>
            <div class="player-info">
              <span class="player-username">Evelon_09</span>
              <div class="player-badges">
                <div class="badge verified">
                  <img src="@/assets/icons/status.svg" alt="status">

                </div>
                <div class="badge status">
                  <img src="@/assets/main/flag.svg" alt="status">
                </div>
              </div>
            </div>
            <div class="player-stats">
              <div class="stat-pill">
                <div class="stat-circle">
                  <svg class="stat-progress" width="24" height="24" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="#e0e0e0" stroke-width="2" fill="none" />
                    <circle cx="12" cy="12" r="10" stroke="#FF9800" stroke-width="2" fill="none" stroke-dasharray="47.1"
                      stroke-dashoffset="11.8" transform="rotate(-90 12 12)" />
                  </svg>
                  <span class="stat-number">7</span>
                </div>
                <span class="stat-value">1,440</span>
              </div>
            </div>
          </div>

          <!-- Player Card 2 -->
          <div class="player-card">
            <div class="player-menu" @click.stop="togglePlayerMenu(2)">
              <img src="@/assets/icons/more.svg" alt="player more">
              <!-- Dropdown Menu -->
              <div class="player-dropdown" v-if="activePlayerMenu === 2">
                <div class="dropdown-item delete">Удалить</div>
              </div>
            </div>
            <div class="player-avatar">
              <img src="@/assets/icons/navbar/user.svg" alt="Player Avatar" />
            </div>
            <div class="player-info">
              <span class="player-username">Evelon_09</span>
              <div class="player-badges">
                <div class="badge verified">
                  <img src="@/assets/icons/status.svg" alt="status">

                </div>
                <div class="badge status">
                  <img src="@/assets/main/flag.svg" alt="status">

                </div>
              </div>
            </div>
            <div class="player-stats">
              <div class="stat-pill">
                <div class="stat-circle">
                  <svg class="stat-progress" width="24" height="24" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="#e0e0e0" stroke-width="2" fill="none" />
                    <circle cx="12" cy="12" r="10" stroke="#FF9800" stroke-width="2" fill="none" stroke-dasharray="47.1"
                      stroke-dashoffset="11.8" transform="rotate(-90 12 12)" />
                  </svg>
                  <span class="stat-number">7</span>
                </div>
                <span class="stat-value">1,440</span>
              </div>
            </div>
          </div>

          <!-- Player Card 3 -->
          <div class="player-card">
            <div class="player-menu" @click.stop="togglePlayerMenu(3)">
              <img src="@/assets/icons/more.svg" alt="player more">

              <!-- Dropdown Menu -->
              <div class="player-dropdown" v-if="activePlayerMenu === 3">
                <div class="dropdown-item delete">Удалить</div>
              </div>
            </div>
            <div class="player-avatar">
              <img src="@/assets/icons/navbar/user.svg" alt="Player Avatar" />
            </div>
            <div class="player-info">
              <span class="player-username">Evelon_09</span>
              <div class="player-badges">
                <div class="badge verified">
                  <img src="@/assets/icons/status.svg" alt="status">

                </div>
                <div class="badge status">
                  <img src="@/assets/main/flag.svg" alt="status">

                </div>
              </div>
            </div>
            <div class="player-stats">
              <div class="stat-pill">
                <div class="stat-circle">
                  <svg class="stat-progress" width="24" height="24" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="#e0e0e0" stroke-width="2" fill="none" />
                    <circle cx="12" cy="12" r="10" stroke="#FF9800" stroke-width="2" fill="none" stroke-dasharray="47.1"
                      stroke-dashoffset="11.8" transform="rotate(-90 12 12)" />
                  </svg>
                  <span class="stat-number">7</span>
                </div>
                <span class="stat-value">1,440</span>
              </div>
            </div>
          </div>

          <!-- Add Player Card 1 -->
          <div class="player-card add-player"  @click="isAddPopupOpen = true">
            <div class="add-player-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 8V24M8 16H24" stroke="#4285F4" stroke-width="3" stroke-linecap="round" />
              </svg>
            </div>
          </div>

          <!-- Add Player Card 2 -->
          <div class="player-card add-player"  @click="isAddPopupOpen = true">
            <div class="add-player-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 8V24M8 16H24" stroke="#4285F4" stroke-width="3" stroke-linecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div class="team-name-section-wrapper">
        <div class="team-name-section">
          <h2 class="section-title">Название команды</h2>
          <input type="text" class="team-name-input" placeholder="Введите название здесь" />
        </div>

        <!-- Team Logo Section -->
        <div class="team-logo-section">
          <h2 class="section-title">Логотип команды</h2>
          <div class="logo-upload-area">
            <div class="logo-upload-box">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 8V24M8 16H24" stroke="#4285F4" stroke-width="3" stroke-linecap="round" />
              </svg>
            </div>
            <!-- <span>Загрузить логотип</span> -->
          </div>
        </div>
      </div>

   <!-- Add player popup-->
   <div class="create-team-popup" v-if="isAddPopupOpen">
        <div class="create-team-popup-wrapper" @click.stop>
          <h2>Добавление участника</h2>
          <img class="create-team-popup-img" src="@/assets/icons/exit.svg" alt="exit" @click="closeAddPopup">

          <!-- Search -->
          <label class="create-team-popup-wrapper-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="27" viewBox="0 0 26 27" fill="none">
              <ellipse cx="13.001" cy="7.000" rx="4.333" ry="4.333" stroke="#80C5FD" stroke-width="1.5" />
              <ellipse cx="13.001" cy="18.916" rx="7.583" ry="4.333" stroke="#80C5FD" stroke-width="1.5" />
            </svg>
            <input
              type="text"
              placeholder="username"
              v-model.trim="searchQuery"
              @input="onSearchInput"
              @keydown.enter.prevent="tryInvite"
            />
          </label>

          <!-- Result area -->
          <div class="create-team-popup-result result-box">
            <!-- loading -->
            <div v-if="searchState==='loading'" class="result-loading">
              <div class="spinner"></div>
              <span>Идёт поиск…</span>
            </div>

            <!-- found -->
            <div v-else-if="searchState==='found'" class="result-card" @click="selectUser(foundUser)">
              <div class="result-card-left">
                <img class="result-avatar" src="@/assets/main/flag.svg" alt="avatar" />
                <div class="result-card-right">
                <div class="result-username">
                  {{ foundUser.username }}
                  <img v-if="foundUser.verified" src="@/assets/icons/status.svg" alt="verified" />
                  <img class="result-flag" src="@/assets/main/flag.svg" alt="flag" />
                </div>
              </div>
              </div>
              <div class="result-card-center">
                <div class="result-name">{{ foundUser.fullName }}</div>
                <div class="result-meta">
                  <span>{{ foundUser.age }} года</span>
                </div>
                <NuxtLink class="result-game" :to="foundUser.gameLink || '#'">{{ foundUser.mainGame }}</NuxtLink>
                <div class="result-team">{{ foundUser.teamName ? foundUser.teamName : 'Не в команде' }}</div>
              </div>
              
            </div>

            <!-- not found -->
            <div v-else-if="searchState==='notFound'" class="result-empty">
              <svg xmlns="http://www.w3.org/2000/svg" width="67" height="67" viewBox="0 0 67 67" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M20.2383 16.7497C20.2383 9.42615 26.1752 3.48926 33.4987 3.48926C40.8222 3.48926 46.7591 9.42615 46.7591 16.7497C46.7591 24.0732 40.8222 30.0101 33.4987 30.0101C26.1752 30.0101 20.2383 24.0732 20.2383 16.7497Z"
                  fill="#80C5FD" />
                <path d="M51.7292 47.3733C50.9115 46.5557 49.5858 46.5557 48.7682 47.3733C47.9505 48.191 47.9505 49.5167 48.7682 50.3344L50.0793 51.6455L48.7682 52.9567C47.9505 53.7743 47.9505 55.1 48.7682 55.9177C49.5859 56.7353 50.9115 56.7353 51.7292 55.9177L53.0404 54.6065L54.3515 55.9177C55.1691 56.7353 56.4948 56.7353 57.3125 55.9177C58.1302 55.1 58.1302 53.7743 57.3125 52.9566L56.0014 51.6455L57.3125 50.3344C58.1302 49.5167 58.1302 48.191 57.3125 47.3734Z"
                  fill="#80C5FD" />
              </svg>
              <h2>Такого пользователя не нашлось</h2>
            </div>

            <!-- idle (ничего не введено) -->
            <div v-else class="result-idle">
              <h2>Введите username игрока</h2>
            </div>
          </div>

          <button
            class="invite-btn"
            :disabled="searchState!=='found' || inviting"
            @click="tryInvite"
          >
            {{ inviting ? 'Отправляем…' : 'Отправить приглашение' }}
          </button>
        </div>
      </div>
      <!-- /Add player popup-->


      <!-- Create Team Button -->
      <div class="create-team-button-section">
        <button class="create-team-button">
          Создать команду
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'

const activeCategory = ref('cs2')
const activePlayerMenu = ref(null)

// Refs для кнопок категорий
const cs2Btn = ref(null)
const dota2Btn = ref(null)
const valorantBtn = ref(null)
const mobileBtn = ref(null)

// Вычисляем стили для индикатора
const indicatorStyle = computed(() => {
  if (!activeCategory.value) return {}

  let buttonRef = null
  switch (activeCategory.value) {
    case 'cs2':
      buttonRef = cs2Btn.value
      break
    case 'dota2':
      buttonRef = dota2Btn.value
      break
    case 'valorant':
      buttonRef = valorantBtn.value
      break
    case 'mobile':
      buttonRef = mobileBtn.value
      break
  }

  if (!buttonRef) return {}

  const rect = buttonRef.getBoundingClientRect()
  const containerRect = buttonRef.parentElement.getBoundingClientRect()

  return {
    '--indicator-left': `${rect.left - containerRect.left - 8}px`,
    '--indicator-width': `${rect.width}px`
  }
})

const setActiveCategory = (category) => {
  activeCategory.value = category
}

const togglePlayerMenu = (playerId) => {
  if (activePlayerMenu.value === playerId) {
    activePlayerMenu.value = null
  } else {
    activePlayerMenu.value = playerId
  }
}

const closeMenus = (event) => {
  if (!event.target.closest('.player-menu')) {
    activePlayerMenu.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', closeMenus)
  nextTick(() => {
    activeCategory.value = activeCategory.value
  })
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenus)
})



/* ---------- добавлено: логика попапа поиска ---------- */
const isAddPopupOpen = ref(false)
const searchQuery = ref('')
const searchState = ref('idle') // 'idle' | 'loading' | 'found' | 'notFound'
const foundUser = ref(null)
const inviting = ref(false)
const defaultAvatar = '@/assets/logo.svg' // поставь свой путь

let debounceTimer = null
const onSearchInput = () => {
  clearTimeout(debounceTimer)
  if (!searchQuery.value) {
    searchState.value = 'idle'
    foundUser.value = null
    return
  }
  debounceTimer = setTimeout(() => runSearch(searchQuery.value), 400)
}

async function runSearch(username) {
  try {
    searchState.value = 'loading'
    const data = await apiFindUserByUsername(username)
    if (data) {
      foundUser.value = data
      searchState.value = 'found'
    } else {
      foundUser.value = null
      searchState.value = 'notFound'
    }
  } catch (e) {
    foundUser.value = null
    searchState.value = 'notFound'
  }
}

function selectUser(u) {
  // при клике по карточке можно, например, фиксировать выбор
  foundUser.value = u
}

async function tryInvite() {
  if (searchState.value !== 'found' || !foundUser.value) return
  inviting.value = true
  try {
    // TODO: замените на ваш POST /teams/:id/invite
    await new Promise(r => setTimeout(r, 900))
    // Успех — закроем попап и очистим состояние
    isAddPopupOpen.value = false
    searchQuery.value = ''
    foundUser.value = null
    searchState.value = 'idle'
  } finally {
    inviting.value = false
  }
}

function closeAddPopup() {
  isAddPopupOpen.value = false
  searchQuery.value = ''
  searchState.value = 'idle'
  foundUser.value = null
}

/* ---- заглушка API. Замените на реальный запрос ---- */
async function apiFindUserByUsername(username) {
  // имитация сети
  await new Promise(r => setTimeout(r, 500))
  // пример «нашёлся» только для Evelon_09
  if (username.toLowerCase() === 'evelon_09') {
    return {
      username: 'Evelon_09',
      verified: true,
      flag: 'uz',          // если понадобится
      fullName: 'Asadbek Jorabaev',
      age: 24,
      mainGame: 'Counter Strike 2',
      gameLink: '/games/cs2',
      teamName: '',        // пусто = не в команде
      avatarUrl: defaultAvatar
    }
  }
  // иначе — не найден
  return null
}

/* ---------- lifecycle ---------- */

onUnmounted(() => {
  document.removeEventListener('click', closeMenus)
})
</script>

<style>
@import './create-team.css';
</style>