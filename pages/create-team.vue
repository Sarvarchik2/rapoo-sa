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
      <div class="game-categories"
        :style="{ '--indicator-left': indicatorLeft + 'px', '--indicator-width': indicatorWidth + 'px' }">
        <button v-for="(g, i) in games" :key="g.id || g.title || i" class="game-category"
          :class="[{ active: activeIndex === i }, teamId ? 'disabled' : '']"
          :ref="el => { buttonRefs[i] = el as HTMLButtonElement | null }" :disabled="!!teamId"
          :title="teamId ? 'Игру нельзя менять после создания команды' : ''" @click="setActiveIndex(i)">
          {{ g.title }}
        </button>
      </div>
      <p v-if="teamId" class="muted" style="margin-top:6px;">
        Игру нельзя изменить после создания команды.
      </p>
    </div>

    <!-- Main Content -->
    <div class="create-team-content">
      <!-- Players Section -->
      <div class="players-section">
        <h2 class="section-title">Игроки</h2>

        <div class="players-grid">
          <!-- Тиммейты -->
          <div v-for="(p, i) in teammates" :key="p.id || i" class="player-card">
            <!-- меню показывает только КАПИТАН и только на карточках не-себя -->
            <div class="player-menu" v-if="isCaptain && !isSelf(p)" @click.stop="togglePlayerMenu(i)">
              <img src="@/assets/icons/more.svg" alt="player more">
              <div class="player-dropdown" v-if="activePlayerMenu === i">
                <button class="dropdown-item delete" :disabled="!canKick(p)"
                  :title="!canKick(p) ? 'Нет данных для удаления' : 'Удалить из команды'"
                  @click="canKick(p) && openKickConfirm(p)">
                  Удалить
                </button>
                <button class="dropdown-item" v-if="!p.is_captain" :disabled="promoteLoading"
                  @click="openPromoteConfirm(p)">
                  Назначить капитаном
                </button>
              </div>
            </div>

            <div class="player-avatar">
              <img :src="p.avatar || '/assets/icons/navbar/user.svg'" :alt="p.username || 'player'" />
            </div>

            <div class="player-info">
              <span class="player-username">{{ p.username || '—' }}</span>
              <div class="player-badges">
                <div class="badge verified" v-if="p.is_captain">
                  <img src="@/assets/icons/status.svg" alt="captain">
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
                </div>
                <span class="stat-value">{{ formatNumber(p.rating ?? 1440) }}</span>
              </div>
            </div>
          </div>

          <!-- Плюсы для добавления -->
          <!-- Плюсы для добавления -->
          <div v-if="teamId && isCaptain" class="player-card add-player" @click="isAddPopupOpen = true"
            title="Пригласить игрока">
            <div class="add-player-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 8V24M8 16H24" stroke="#4285F4" stroke-width="3" stroke-linecap="round" />
              </svg>
            </div>
          </div>

        </div>

        <p v-if="teamId && teammates.length === 0" class="muted">В команде пока нет игроков — пригласите первым.</p>
        <p v-if="!teamId" class="muted">Сначала создайте команду и выберите игру выше, затем сможете приглашать игроков.
        </p>
      </div>

      <div class="team-name-section-wrapper">
        <!-- Название/описание -->
        <div class="team-name-section">
          <h2 class="section-title">Название команды</h2>
          <input type="text" class="team-name-input" placeholder="Введите название здесь" v-model.trim="form.name"
            :disabled="saving || (teamId && !editMode)" />
          <input type="text" class="team-name-input" placeholder="TAG (2–5 символов)" v-model.trim="form.tag"
            :disabled="saving || (teamId && !editMode)" />
          <textarea class="team-name-input" placeholder="Описание (необязательно)" v-model.trim="form.description"
            :disabled="saving || (teamId && !editMode)" style="margin-top:10px; min-height:80px;"></textarea>
        </div>

        <!-- Логотип -->
        <div class="team-logo-section">
          <h2 class="section-title">Логотип команды</h2>
          <div class="logo-upload-area">
            <div class="logo-upload-box"
              :title="teamId && !editMode ? 'Нажмите «Изменить», чтобы редактировать' : (logoPreview ? 'Нажмите, чтобы заменить' : 'Загрузить логотип')"
              @click="(teamId && !editMode) ? null : logoInput?.click()"
              style="display:grid;place-items:center;overflow:hidden;">
              <img v-if="logoPreview" :src="logoPreview" alt="logo preview"
                style="max-width:100%;max-height:100%;object-fit:contain" />
              <svg v-else width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 8V24M8 16H24" stroke="#4285F4" stroke-width="3" stroke-linecap="round" />
              </svg>
            </div>
            <input ref="logoInput" class="hidden" type="file" accept="image/*" @change="onLogoChoose"
              :disabled="saving || (teamId && !editMode)" />
          </div>
          <div v-if="logoError" class="err" style="margin-top:8px;">{{ logoError }}</div>
        </div>
      </div>

      <!-- Управление -->
      <div class="create-team-button-section" style="display:flex; gap:10px; flex-wrap:wrap;">
        <button v-if="!teamId" class="create-team-button" :disabled="saving || !selectedGameId" @click="createTeam"
          :title="selectedGameId ? '' : 'Сначала выберите игру сверху'">
          {{ saving ? 'Создаем…' : 'Создать команду' }}
        </button>

        <template v-else>
          <button class="create-team-button" @click="toggleEdit" :disabled="saving"
            style="background:#eef2f7; color:#0f172a;">
            {{ editMode ? 'Отменить' : 'Изменить' }}
          </button>
          <button class="create-team-button" :disabled="saving || !editMode" @click="saveChanges">
            {{ saving ? 'Сохраняем…' : 'Сохранить изменения' }}
          </button>
          <span v-if="editHint" class="muted" style="align-self:center;">{{ editHint }}</span>
        </template>
      </div>

      <p v-if="pageToast" :class="['state', pageToast.type === 'err' ? 'error' : '']" style="margin-top:10px;">
        {{ pageToast.text }}
      </p>
    </div>

    <!-- Add player popup -->
    <div class="create-team-popup" v-if="isAddPopupOpen">
      <div class="create-team-popup-wrapper" @click.stop>
        <h2>Добавление участника</h2>
        <img class="create-team-popup-img" src="@/assets/icons/exit.svg" alt="exit" @click="closeAddPopup">

        <!-- Поиск -->
        <label class="create-team-popup-wrapper-label">
          <svg width="26" height="27" viewBox="0 0 26 27" fill="none">
            <ellipse cx="13.001" cy="7.000" rx="4.333" ry="4.333" stroke="#80C5FD" stroke-width="1.5" />
            <ellipse cx="13.001" cy="18.916" rx="7.583" ry="4.333" stroke="#80C5FD" stroke-width="1.5" />
          </svg>
          <input type="text" placeholder="username" v-model.trim="searchQuery" @input="onSearchInput"
            @keydown.enter.prevent="tryInvite" />
        </label>

        <!-- Результат -->
        <div class="create-team-popup-result result-box">
          <div v-if="searchState === 'loading'" class="result-loading">
            <div class="spinner"></div><span>Идёт поиск…</span>
          </div>

          <div v-else-if="searchState === 'found'" class="result-card">
            <div class="result-card-left">
              <img class="result-avatar" :src="foundUser?.avatarUrl || defaultAvatar" alt="avatar" />
              <div class="result-card-right">
                <div class="result-username">
                  {{ foundUser?.username }}
                  <img v-if="foundUser?.verified" src="@/assets/icons/status.svg" alt="verified" />
                </div>
              </div>
            </div>
            <div class="result-card-center">
              <div class="result-name">
                {{ foundUser?.fullName || nameFromFound(foundUser) }}
              </div>
              <span v-if="foundUser?.age" style="opacity:.7;">{{ foundUser?.age }} лет</span>

              <div class="result-team">
                {{ foundUser?.inTeam ? 'В команде' : 'Не в команде' }}
              </div>
            </div>
          </div>

          <div v-else-if="searchState === 'notFound'" class="result-empty">
            <h2>Такого пользователя не нашлось</h2>
          </div>

          <div v-else class="result-idle">
            <h2>Введите username игрока</h2>
          </div>
        </div>

        <!-- Invite CTA -->
        <button class="invite-btn" :disabled="!canInvite" :title="cannotInviteReason" @click="tryInvite">
          {{ inviting ? 'Отправляем…' : 'Отправить приглашение' }}
        </button>

        <!-- статус-индикатор -->
        <p v-if="inviteToast" :class="['state', inviteToast.type === 'err' ? 'error' : '']" style="margin-top:8px;">
          {{ inviteToast.text }}
        </p>
      </div>
    </div>
    <!-- /Add player popup -->

    <!-- Confirm modal: kick -->
    <div v-if="confirmOpen" class="modal-backdrop" @click="!confirmLoading && closeConfirm()">
      <div class="modal" @click.stop>
        <h3 class="modal-title">Удалить игрока</h3>
        <p class="modal-text">
          Вы уверены, что хотите удалить
          <b>@{{ pendingKick?.username || 'user' }}</b> из команды?
        </p>
        <div class="modal-actions">
          <button class="btn btn-secondary" :disabled="confirmLoading" @click="closeConfirm">Отмена</button>
          <button class="btn btn-danger" :disabled="confirmLoading" @click="confirmKick">
            {{ confirmLoading ? 'Удаляем…' : 'Удалить' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm modal: promote -->
    <div v-if="promoteOpen" class="modal-backdrop" @click="!promoteLoading && closePromote()">
      <div class="modal" @click.stop>
        <h3 class="modal-title">Назначить капитаном</h3>
        <p class="modal-text">
          Назначить <b>@{{ pendingPromote?.username || 'user' }}</b> капитаном команды?
        </p>
        <div class="modal-actions">
          <button class="btn btn-secondary" :disabled="promoteLoading" @click="closePromote">Отмена</button>
          <button class="btn btn-danger" :disabled="promoteLoading" @click="confirmPromote">
            {{ promoteLoading ? 'Назначаем…' : 'Назначить' }}
          </button>
        </div>
      </div>
    </div>
    <!-- /Confirm modal -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
const { $api, $tapi, $auth } = useNuxtApp()
const router = useRouter()

/** ========= Типы ========= */
type Game = { id: number; title: string }
type FoundUser = {
  id?: string
  username?: string
  first_name?: string
  last_name?: string
  avatar?: string | null
  avatarUrl?: string | null
  age?: string | number | null
  bio?: string | null
  is_active?: boolean
  is_in_team?: string | boolean
  inTeam?: boolean
  verified?: boolean
}

/* ======== Профиль ======== */
const { data: profileRaw } = await useAsyncData('profile-create-team', () => $auth('/profile/'), { server: false })
const profile = computed<any>(() => profileRaw.value || null)
const profileType = computed<string>(() => profile.value?.profile_type || '')
const baseData = computed<any>(() => profile.value?.data || {})
const isCaptain = computed<boolean>(() => profileType.value === 'team_captain' || baseData.value?.is_team_captain === true)

/* ======== Форма/состояния — ОБЪЯВЛЕНО ДО watch ======== */
const form = ref<{ name: string; tag: string; description: string; logoId: number | null }>({
  name: '', tag: '', description: '', logoId: null
})
const saving = ref(false)
const editMode = ref(false)
const editHint = ref('')

/* ======== Команда ======== */
const teamId = ref<number | null>(null)
const teammates = ref<any[]>([])

/* ======== Логотип (объявлено ДО watch) ======== */
const FILES_UPLOAD_URL = '/files/upload/'
const logoInput = ref<HTMLInputElement | null>(null)
const logoFile = ref<File | null>(null)
const logoPreview = ref<string | null>(null)
const logoError = ref('')

/* ======== Игры ======== */
const games = ref<Game[]>([])
const activeIndex = ref<number>(-1)
const buttonRefs = ref<(HTMLButtonElement | null)[]>([])
const indicatorLeft = ref(0)
const indicatorWidth = ref(0)

async function loadGames() {
  try {
    const client = ($tapi as any) || $api
    const res: any = await client('/tournaments/games/', { query: { ordering: 'title' } })
    games.value = Array.isArray(res?.results) ? res.results : (Array.isArray(res) ? res : [])
    const existingGameId = existingTeamGameId.value
    if (existingGameId && games.value.length) {
      const idx = Math.max(0, games.value.findIndex(g => g.id === existingGameId))
      activeIndex.value = idx >= 0 ? idx : 0
    } else {
      activeIndex.value = games.value.length ? 0 : -1
    }
    await nextTick(); recalcIndicator()
  } catch {
    games.value = []; activeIndex.value = -1; recalcIndicator()
  }
}
function setActiveIndex(i: number) { if (!teamId.value) { activeIndex.value = i; recalcIndicator() } }
function recalcIndicator() {
  nextTick(() => {
    const idx = activeIndex.value
    const btn = idx >= 0 ? buttonRefs.value[idx] : null
    if (!btn) { indicatorLeft.value = 0; indicatorWidth.value = 0; return }
    const rect = btn.getBoundingClientRect()
    const parentRect = btn.parentElement?.getBoundingClientRect() || { left: 0, width: 0 } as DOMRect
    indicatorLeft.value = Math.max(0, rect.left - parentRect.left - 8)
    indicatorWidth.value = rect.width
  })
}
function onResize() { recalcIndicator() }
onMounted(() => { loadGames(); window.addEventListener('resize', onResize) })
onUnmounted(() => { window.removeEventListener('resize', onResize) })
const selectedGameId = computed<number | null>(() => activeIndex.value >= 0 ? (games.value[activeIndex.value]?.id ?? null) : null)

/* ======== Команда из профиля ======== */
const existingTeam = computed<any>(() => {
  if (!isCaptain.value) return null
  return (profile.value?.captained_teams || [])[0] || null
})
const existingTeamGameId = computed<number | null>(() => {
  const gt = existingTeam.value?.game_type
  if (!gt) return null
  if (typeof gt === 'number') return gt
  if (typeof gt?.id === 'number') return gt.id
  return null
})

watch(existingTeam, (t) => {
  if (!t) return
  teamId.value = t.team_id || t.id || null

  // название (несколько возможных полей)
  const nameCandidate =
    t.team_name ?? t.name ?? t.team?.name ?? t.profile?.team_name ?? null
  if (nameCandidate) form.value.name = nameCandidate

  if (t.tag) form.value.tag = t.tag
  if (t.description) form.value.description = t.description

  const logoFileUrl = t.logo?.file || t.logo_file || t.logo || null
  if (logoFileUrl) logoPreview.value = logoFileUrl
  const logoId = t.logo?.id ?? null
  if (logoId) form.value.logoId = logoId

  const members = Array.isArray(t.members) ? t.members : (Array.isArray(t.memberships) ? t.memberships : [])
  teammates.value = members.map((m: any) => ({
    raw: m,
    id: m.id ?? m.user_id ?? m.user_uuid ?? m.player_id,
    username: m.username ?? m.display_name ?? m?.user?.username ?? '—',
    avatar: m.avatar ?? m?.user?.avatar ?? null,
    rating: typeof m.rating === 'number' ? m.rating : 1440,
    is_captain: !!(m.is_captain || m.role === 'MAIN_CAPTAIN' || m.role === 'CAPTAIN')
  }))
}, { immediate: true })

/* ======== Логотип загрузка ======== */
function onLogoChoose(e: Event) {
  logoError.value = ''
  const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return
  if (!/^image\//.test(f.type)) { logoError.value = 'Только изображения'; return }
  if (f.size > 5 * 1024 * 1024) { logoError.value = 'Максимум 5 МБ'; return }
  logoFile.value = f
  const r = new FileReader(); r.onload = () => logoPreview.value = String(r.result); r.readAsDataURL(f)
}
async function uploadLogoIfNeeded(): Promise<number | null> {
  if (!logoFile.value) return form.value.logoId || null
  const fd = new FormData()
  fd.append('file', logoFile.value, logoFile.value.name)
  if (form.value.name) fd.append('description', `team logo: ${form.value.name}`)
  const res: any = await $api(FILES_UPLOAD_URL, { method: 'POST', body: fd })
  const uploadedId = res?.id ?? res?.data?.id ?? null
  if (!uploadedId) throw new Error('Не удалось получить ID загруженного файла')
  return uploadedId
}

/* ======== Создание / Обновление ======== */
function validateCommon(): string {
  if (!form.value.name || form.value.name.length < 2) return 'Укажите название (мин. 2 символа)'
  if (!/^[A-Za-z0-9]{2,5}$/.test(form.value.tag || '')) return 'TAG: 2–5 символов (латиница/цифры)'
  return ''
}
function validateCreate(): string {
  const base = validateCommon(); if (base) return base
  if (!selectedGameId.value) return 'Выберите игру во вкладках выше'
  return ''
}
async function createTeam() {
  const err = validateCreate(); if (err) { pageErr(err); return }
  saving.value = true
  try {
    const mediaId = await uploadLogoIfNeeded(); if (mediaId) form.value.logoId = mediaId
    const body: any = { name: form.value.name, description: form.value.description || '', tag: form.value.tag, game_type: selectedGameId.value }
    if (form.value.logoId) body.logo = form.value.logoId
    const created: any = await $api('/teams/create/', { method: 'POST', body })
    teamId.value = created?.id ?? null
    editMode.value = false
    pageOk('Команда создана')
    // 🔄 по просьбе — один раз перезагрузить страницу после создания
    if (process.client) setTimeout(() => window.location.reload(), 350)
  } catch (e: any) {
    pageErr(e?.data?.detail || e?.message || 'Не удалось создать команду')
  } finally { saving.value = false }
}
async function saveChanges() {
  const err = validateCommon(); if (err) { pageErr(err); return }
  saving.value = true
  try {
    const mediaId = await uploadLogoIfNeeded(); if (mediaId) form.value.logoId = mediaId
    const body: any = { name: form.value.name, description: form.value.description || '', tag: form.value.tag }
    if (form.value.logoId) body.logo = form.value.logoId
    const updated: any = await $api('/teams/update/', { method: 'PATCH', body })
    pageOk('Изменения сохранены')
    if (updated?.name) form.value.name = updated.name
    if (updated?.tag) form.value.tag = updated.tag
    if (updated?.description !== undefined) form.value.description = updated.description
    editMode.value = false
  } catch (e: any) {
    pageErr(e?.data?.detail || e?.message || 'Не удалось сохранить изменения')
  } finally { saving.value = false }
}
function toggleEdit() { editMode.value = !editMode.value; editHint.value = editMode.value ? 'Редактирование включено' : '' }

/* ======== Helpers ======== */
const UUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
function memberUUID(m: any): string | null {
  const candidates = [m?.id, m?.user_id, m?.user?.id, m?.profile?.id].filter(Boolean)
  for (const c of candidates) { const s = String(c); if (UUID_RX.test(s)) return s }
  return null
}
const currentUserId = computed<string | null>(() =>
  baseData.value?.user?.id ||
  profile.value?.data?.user?.id ||
  profile.value?.user?.id ||
  null
)
function isSelf(member: any) {
  const id = memberUUID(member)
  return !!(id && currentUserId.value && id === currentUserId.value)
}
async function resolvePlayerUUID(member: any): Promise<string | null> {
  const direct = memberUUID(member); if (direct) return direct
  const uname = member?.username || member?.user?.username || member?.display_name || member?.user?.display_name || null
  if (!uname) return null
  try {
    const res: any = await $auth(`/profile/${encodeURIComponent(uname)}/search/`)
    const id = res?.id ? String(res.id) : ''
    return UUID_RX.test(id) ? id : null
  } catch { return null }
}

/* ======== Kick player ======== */
function canKick(member: any) { if (isSelf(member)) return false; return !!(memberUUID(member) || member?.username) }
const confirmOpen = ref(false)
const confirmLoading = ref(false)
const pendingKick = ref<any>(null)
function openKickConfirm(member: any) { pendingKick.value = member; confirmOpen.value = true; activePlayerMenu.value = null }
function closeConfirm() { if (!confirmLoading.value) { confirmOpen.value = false; pendingKick.value = null } }

async function confirmKick() {
  const member = pendingKick.value
  if (!member) return
  confirmLoading.value = true
  try {
    const pid = await resolvePlayerUUID(member)
    if (!pid) throw new Error('Не удалось определить UUID игрока')
    try {
      await $api(`/teams/${encodeURIComponent(pid)}/kick_player/`, { method: 'POST' })
    } catch (e1: any) {
      const status = e1?.status || e1?.response?.status
      if ([404, 405, 301, 308].includes(status)) {
        await $api(`/teams/kick_player/${encodeURIComponent(pid)}/`, { method: 'POST' })
      } else { throw e1 }
    }
    pageOk('Игрок удалён из команды')
    teammates.value = teammates.value.filter(m => (memberUUID(m) ?? '') !== pid)
    closeConfirm()
    if (process.client) setTimeout(() => window.location.reload(), 350)
  } catch (e: any) {
    pageErr(e?.data?.detail || e?.message || 'Не удалось удалить игрока')
  } finally {
    confirmLoading.value = false
  }
}

/* ======== Promote to captain ======== */
const promoteOpen = ref(false)
const promoteLoading = ref(false)
const pendingPromote = ref<any>(null)
function openPromoteConfirm(member: any) { pendingPromote.value = member; promoteOpen.value = true; activePlayerMenu.value = null }
function closePromote() { if (!promoteLoading.value) { promoteOpen.value = false; pendingPromote.value = null } }

async function confirmPromote() {
  const member = pendingPromote.value
  if (!member) return
  promoteLoading.value = true
  try {
    const pid = await resolvePlayerUUID(member)
    if (!pid) throw new Error('Не удалось определить UUID игрока')
    await $api(`/teams/capitain/${encodeURIComponent(pid)}/change/`, { method: 'PATCH', body: {} })
    pageOk('Капитан назначен')
    closePromote()
    // перезагрузка, чтобы роли обновились (старый капитан станет игроком)
    if (process.client) setTimeout(() => window.location.reload(), 350)
  } catch (e: any) {
    pageErr(e?.data?.detail || e?.message || 'Не удалось назначить капитана')
  } finally {
    promoteLoading.value = false
  }
}

/* ======== Релоад деталей команды ======== */
async function refreshTeam(id: number) {
  try {
    const t: any = await $api(`/teams/${id}/`)
    if (t?.name) form.value.name = t.name
    if (t?.tag) form.value.tag = t.tag
    if (t?.description !== undefined) form.value.description = t.description
    if (t?.logo?.file) logoPreview.value = t.logo.file
  } catch { }
}

/* ======== Поиск + приглашение ======== */
const isAddPopupOpen = ref(false)
const searchQuery = ref('')
const searchState = ref<'idle' | 'loading' | 'found' | 'notFound'>('idle')
const foundUser = ref<FoundUser | null>(null)
const inviting = ref(false)
const inviteRole = ref<'MAIN_PLAYER' | 'SUBSTITUTE' | 'COACH'>('MAIN_PLAYER')
const inviteMessage = ref('')
const defaultAvatar = '/assets/logo.svg'

function closeAddPopup() {
  isAddPopupOpen.value = false
  searchQuery.value = ''
  foundUser.value = null
  searchState.value = 'idle'
  inviteMessage.value = ''
}

let debounceTimer: any = null
const onSearchInput = () => {
  clearTimeout(debounceTimer)
  if (!searchQuery.value) { searchState.value = 'idle'; foundUser.value = null; return }
  debounceTimer = setTimeout(() => runSearch(searchQuery.value), 350)
}
async function runSearch(usernameRaw: string) {
  const username = (usernameRaw || '').trim()
  if (!username) { searchState.value = 'idle'; foundUser.value = null; return }
  searchState.value = 'loading'
  try {
    const res: any = await $auth(`/profile/${encodeURIComponent(username)}/search/`)
    const isInTeamRaw = (res?.is_in_team ?? '') as string | boolean
    const inTeam = typeof isInTeamRaw === 'boolean'
      ? isInTeamRaw
      : (String(isInTeamRaw).toLowerCase() === 'true' || (String(isInTeamRaw).length > 0 && String(isInTeamRaw).toLowerCase() !== 'false'))
    foundUser.value = {
      id: res?.id, username: res?.username, first_name: res?.first_name, last_name: res?.last_name,
      avatarUrl: res?.avatar || null, age: res?.age ?? null, bio: res?.bio ?? null,
      is_active: !!res?.is_active, inTeam, verified: !!res?.is_verified
    }
    searchState.value = foundUser.value?.username ? 'found' : 'notFound'
  } catch { foundUser.value = null; searchState.value = 'notFound' }
}
const canInvite = computed(() => {
  if (!teamId.value) return false
  if (searchState.value !== 'found' || !foundUser.value?.id) return false
  if (foundUser.value.inTeam) return false
  if (foundUser.value.is_active === false) return false
  return !inviting.value
})
const cannotInviteReason = computed(() => {
  if (!teamId.value) return 'Сначала создайте команду'
  if (searchState.value !== 'found' || !foundUser.value?.id) return 'Выберите пользователя'
  if (foundUser.value.inTeam) return 'Игрок уже состоит в команде'
  if (foundUser.value.is_active === false) return 'Пользователь деактивирован'
  return ''
})
async function tryInvite() {
  // защита
  if (!teamId.value) { toastErr('Сначала создайте команду'); return }
  if (!isCaptain.value) { toastErr('Только капитан может приглашать'); return }
  if (searchState.value !== 'found' || !foundUser.value) { toastErr('Выберите пользователя'); return }
  if (foundUser.value.inTeam) { toastErr('Этот игрок уже в команде'); return }
  if (inviting.value) return;

  inviting.value = true
  try {
    // гарантируем UUID: если foundUser.id не UUID — резолвим
    let pid = String(foundUser.value.id || '')
    const UUID_RX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!UUID_RX.test(pid) && foundUser.value.username) {
      const res: any = await $auth(`/profile/${encodeURIComponent(foundUser.value.username)}/search/`)
      pid = String(res?.id || '')
    }
    if (!UUID_RX.test(pid)) { throw new Error('Не удалось определить ID игрока') }

    // бэк нередко требует team/team_id, поэтому шлём оба
    const body: any = {
      player: pid,
      role: inviteRole.value,
      message: inviteMessage.value || '',
      team: teamId.value,
      team_id: teamId.value
    }

    // используй клиент с авторизацией; $api обычно с токеном, при 401 попробуем $auth
    try {
      await $api('/teams/invite_player/', { method: 'POST', body })
    } catch (e: any) {
      if (e?.status === 401) {
        await $auth('/teams/invite_player/', { method: 'POST', body })
      } else {
        throw e
      }
    }

    toastOk(`Приглашение отправлено игроку @${foundUser.value.username}`)
    // закрыть попап и очистить состояние
    isAddPopupOpen.value = false
    searchQuery.value = ''
    foundUser.value = null
    searchState.value = 'idle'
    inviteMessage.value = ''
  } catch (e: any) {
    const msg = e?.data?.detail || e?.message || 'Не удалось отправить приглашение'
    toastErr(msg)
  } finally {
    inviting.value = false
  }
}

/* ======== Тосты ======== */
const inviteToast = ref<{ type: 'ok' | 'err'; text: string } | null>(null)
function toastOk(t: string) { inviteToast.value = { type: 'ok', text: t }; setTimeout(() => inviteToast.value = null, 4000) }
function toastErr(t: string) { inviteToast.value = { type: 'err', text: t }; setTimeout(() => inviteToast.value = null, 6000) }

const pageToast = ref<{ type: 'ok' | 'err'; text: string } | null>(null)
function pageOk(t: string) { pageToast.value = { type: 'ok', text: t }; setTimeout(() => pageToast.value = null, 4000) }
function pageErr(t: string) { pageToast.value = { type: 'err', text: t }; setTimeout(() => pageToast.value = null, 6000) }

/* ======== UI utils ======== */
const activePlayerMenu = ref<number | null>(null)
function togglePlayerMenu(i: number) { activePlayerMenu.value = activePlayerMenu.value === i ? null : i }
function nameFromFound(u: any) { const f = u?.first_name || ''; const l = u?.last_name || ''; return `${f} ${l}`.trim() || '—' }
function formatNumber(n: number) { try { return new Intl.NumberFormat('ru-RU').format(n ?? 0) } catch { return String(n ?? 0) } }
</script>

<style>
@import './create-team.css';

.player-card.add-player.is-disabled {
  cursor: not-allowed;
  opacity: .6;
}

.err {
  color: #e11d48;
}

.hidden {
  display: none;
}

.muted {
  opacity: .8;
}

.game-category.disabled {
  pointer-events: none;
  opacity: .5;
}

/* ====== confirm modal ====== */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, .55);
  display: grid;
  place-items: center;
  z-index: 9990;

}

.modal {
  width: min(520px, 92vw);
  background: var(--bg-white);
  color: var(--text-blue);
  border-radius: 16px;
  padding: 20px;
}

.modal-title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 800;
}

.modal-text {
  margin: 0 0 16px;
  opacity: .9;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 700;
}

.btn-secondary {
  background: #e2e8f0;
  color: #0f172a;
}

.btn-danger {
  background: #ef4444;
  color: #fff;
}

.btn[disabled] {
  opacity: .6;
  cursor: not-allowed;
}
</style>
