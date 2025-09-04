<template>
    <div class="settings">
        <!-- Top bar -->
        <button class="settings-back" type="button" @click="goBack">
            <svg width="18" height="18" viewBox="0 0 20 20">
                <path d="M15 10H5M5 10L10 5M5 10L10 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
            Назад
        </button>

        <h1 class="settings-title">Настройки</h1>

        <div class="settings-grid">
            <!-- Avatar + actions -->
            <div class="settings-avatar-col">
                <div class="settings-avatar">
                    <img :src="avatarPreview || form.avatarUrl || defaultAvatar" alt="avatar">
                </div>

                <input ref="fileInput" class="hidden" type="file" accept="image/*" @change="onAvatarChoose"
                    :disabled="!editMode || !editable.avatar" />

                <button class="settings-link" type="button" @click="editMode && editable.avatar && fileInput?.click()"
                    :disabled="!editMode || !editable.avatar">
                    Изменить аватарку
                </button>


                <!-- В API нет удаления аватара, поэтому отключено -->
                <button class="settings-link settings-link-danger" type="button" disabled
                    title="Удаление аватара не поддерживается этим API">
                    Удалить аватарку
                </button>

                <button class="settings-logout" type="button" @click="onLogout" :disabled="saving">
                    Выйти
                </button>

                <p v-if="avatarError" class="err">{{ avatarError }}</p>
            </div>

            <!-- Form -->
            <form class="settings-form" @submit.prevent="onSubmit">
                <div class="settings-col">
                    <label class="settings-lbl">Имя
                        <div class="settings-inp">
                            <IconUser />
                            <input v-model.trim="form.firstName" placeholder="Имя" @blur="touch('firstName')"
                                :disabled="!editMode || !editable.firstName" />
                        </div>
                        <span class="settings-err" v-if="errors.firstName">{{ errors.firstName }}</span>
                    </label>

                    <label class="settings-lbl">Фамилия
                        <div class="settings-inp">
                            <IconUser />
                            <input v-model.trim="form.lastName" placeholder="Фамилия" @blur="touch('lastName')"
                                :disabled="!editMode || !editable.lastName" />
                        </div>
                        <span class="settings-err" v-if="errors.lastName">{{ errors.lastName }}</span>
                    </label>

                    <!-- Отчество — нет в API, лочим -->
                    <label class="settings-lbl">День рождения
                        <div class="settings-inp">
                            <IconCalendar />
                            <input type="date" v-model="form.birthday" :disabled="!editMode || !editable.birthday" />
                        </div>
                    </label>

                    <label class="settings-lbl">О себе
                        <textarea class="settings-ta" v-model.trim="form.about" placeholder="О себе"
                            :disabled="!editMode || !editable.about"></textarea>
                    </label>
                </div>
                <div class="settings-col">
                    <label class="settings-lbl">Игровой ник
                        <div class="settings-inp">
                            <IconUser />
                            <input v-model.trim="form.gameNick" placeholder="Ник"
                                @input="editMode && editable.gameNick && debouncedCheckNick('gameNick')"
                                @blur="touch('gameNick')" :disabled="!editMode || !editable.gameNick" />
                        </div>
                        <span class="settings-err" v-if="errors.gameNick">{{ errors.gameNick }}</span>
                        <span class="settings-hint" v-if="nickBusy.gameNick">Ник занят</span>
                    </label>

                    <!-- Steam ник — нет в API -->
                    <label class="settings-lbl">Пол
                        <div class="settings-inp">
                            <IconUser />
                            <select v-model="form.gender" :disabled="!editMode || !editable.gender">
                                <option :value="true">Мужской</option>
                                <option :value="false">Женский</option>
                                <option :value="null">Не указано</option>
                            </select>
                        </div>
                    </label>

                    <!-- Email — нет в API PATCH -->
                    <label class="settings-lbl">Email
                        <div class="settings-inp">
                            <IconMail />
                            <input v-model.trim="form.email" placeholder="Email" :disabled="true" />
                        </div>
                    </label>

                    <!-- Телефон — нет в API PATCH -->
                    <label class="settings-lbl">Номер телефона
                        <div class="settings-inp">
                            <IconPhone />
                            <input v-model="form.phone" placeholder="+998 90 123 45 67" inputmode="tel"
                                :disabled="true" />
                        </div>
                    </label>

                    <!-- Пароль — меняется отдельной ручкой, лочим -->
                    <label class="settings-lbl">Ваш пароль
                        <div class="settings-inp">
                            <IconLock />
                            <input :type="showPass ? 'text' : 'password'" v-model="form.password" placeholder="********"
                                :disabled="true" />
                            <button type="button" class="settings-eye" disabled>
                                {{ showPass ? 'Скрыть' : 'Показать' }}
                            </button>
                        </div>
                        <span class="settings-hint" v-if="false">Надёжность: —</span>
                    </label>

                    <div class="settings-actions settings-actions--split">
                        <button class="settings-save settings-save--secondary" type="button" @click="toggleEdit"
                            :disabled="saving">
                            {{ editMode ? 'Отменить' : 'Изменить' }}
                        </button>

                        <button class="settings-save" type="submit" :disabled="!editMode || saving">
                            {{ saving ? 'Сохраняем…' : 'Сохранить изменения' }}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
    // отключаем анимации переходов, которые триггерят parentNode(null)
    pageTransition: false,
    layoutTransition: false,
    // если у вас Nuxt >= 3.8 — это тоже работает:
    viewTransition: false
})




/** ───────── Иконки (inline SVG) ───────── */
import { ref, reactive, h, computed, watch, defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import { useEventBus } from '@vueuse/core'
const profileBus = useEventBus<'profile:updated', { updated_at?: string|number, avatar?: string }>('profile:updated')


const IconUser = defineComponent({
    name: 'IconUser',
    setup() {
        return () => h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' }, [
            h('circle', { cx: 12, cy: 8, r: 4, stroke: '#80C5FD', 'stroke-width': 1.5 }),
            h('path', { d: 'M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6', stroke: '#80C5FD', 'stroke-width': 1.5, fill: 'none' })
        ])
    }
})

const IconMail = defineComponent({
    name: 'IconMail',
    setup() {
        return () => h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' }, [
            h('rect', { x: 3, y: 5, width: 18, height: 14, rx: 3, stroke: '#80C5FD', 'stroke-width': 1.5 }),
            h('path', { d: 'M4 7l8 6 8-6', stroke: '#80C5FD', 'stroke-width': 1.5 })
        ])
    }
})

const IconPhone = defineComponent({
    name: 'IconPhone',
    setup() {
        return () => h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' }, [
            h('path', { d: 'M16 2h-8a2 2 0 0 0-2 2v16l6-3 6 3V4a2 2 0 0 0-2-2z', stroke: '#80C5FD', 'stroke-width': 1.5, fill: 'none' })
        ])
    }
})

const IconLock = defineComponent({
    name: 'IconLock',
    setup() {
        return () => h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' }, [
            h('rect', { x: 4, y: 10, width: 16, height: 10, rx: 2, stroke: '#80C5FD', 'stroke-width': 1.5 }),
            h('path', { d: 'M8 10V8a4 4 0 1 1 8 0v2', stroke: '#80C5FD', 'stroke-width': 1.5 })
        ])
    }
})

const IconCalendar = defineComponent({
    name: 'IconCalendar',
    setup() {
        return () => h('svg', { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none' }, [
            h('rect', { x: 3, y: 4, width: 18, height: 17, rx: 2, stroke: '#80C5FD', 'stroke-width': 1.5 }),
            h('path', { d: 'M3 9h18', stroke: '#80C5FD', 'stroke-width': 1.5 })
        ])
    }
})


/** ───────── базовые хуки ───────── */
const router = useRouter()
const { $auth } = useNuxtApp()
const { user: authUser, logout } = useAuth()

function onLogout() {
    logout()
    router.replace('/login')
}

const defaultAvatar = '/user.png'

/** ───────── Режим/состояния ───────── */
const editMode = ref(false)
const saving = ref(false)
const showPass = ref(false)

/** ───────── Профиль с бэка (GET /api/v1/auth/profile/) ───────── */
const { data: raw, pending, error, refresh } = await useAsyncData(
    'settings-profile',
    () => $auth('/profile/')
)
if (process.client) {
    watch(raw, v => { if (v) console.log('[settings] profile', v) }, { immediate: true })
    watch(error, e => { if (e) console.error('[settings] error', e) }, { immediate: true })
}

const apiProfile = computed<any>(() => raw.value || null)
// под разные формы ответа:
const apiData = computed<any>(() => apiProfile.value?.data ?? apiProfile.value ?? null)
const apiUser = computed<any>(() => apiData.value?.user ?? apiData.value ?? null)

/** ───────── Форма ───────── */
const form = reactive({
    avatarUrl: '',

    firstName: '',
    lastName: '',
    middleName: '', // disabled

    about: '',
    aboutVisible: true, // disabled

    birthday: '' as string | '',
    gender: null as boolean | null,

    gameNick: '',
    steamNick: '',      

    email: '',
    phone: '',
    password: ''        
})

const editable = {
    avatar: true,
    firstName: true,
    lastName: true,
    about: true,   // = bio
    birthday: true,
    gender: true,
    gameNick: true,

    middleName: false,
    aboutVisible: false,
    steamNick: false,
    email: false,
    phone: false,
    password: false
}

/** заполнение формы из ответа API */
function fillFormFromApi() {
    const u = apiUser.value || {}
    form.firstName = u.first_name || ''
    form.lastName = u.last_name || ''
    form.email = u.email || ''
    form.phone = u.phone || ''
    form.gameNick = u.username || ''

    form.about = apiData.value?.bio || u.bio || ''
    form.birthday = (apiData.value?.birthday || u.birthday || '') || ''
    // ожидаем boolean; если пришло что-то иное — приводим
    const g = apiData.value?.gender ?? u.gender
    form.gender = (g === true || g === false) ? g : null

    // путь к аватарке ищем во всех возможных местах
    form.avatarUrl = apiData.value?.avatar || u.avatar || ''
}
watch(apiProfile, fillFormFromApi, { immediate: true })

let snapshot: any = null
function makeSnapshot() { snapshot = JSON.parse(JSON.stringify(form)) }
function restoreFromSnapshot() { snapshot && Object.assign(form, snapshot) }

const fileInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<string | null>(null)
const avatarFile = ref<File | null>(null)
const avatarError = ref('')

function onAvatarChoose(e: Event) {
    avatarError.value = ''
    const f = (e.target as HTMLInputElement).files?.[0]
    if (!f) return
    if (!/^image\//.test(f.type)) { avatarError.value = 'Только изображения'; return }
    if (f.size > 5 * 1024 * 1024) { avatarError.value = 'Максимум 5 МБ'; return }
    avatarFile.value = f
    const r = new FileReader()
    r.onload = () => avatarPreview.value = String(r.result)
    r.readAsDataURL(f)
}
function removeAvatar() {
    avatarFile.value = null
    avatarPreview.value = null
}
function onPickAvatar() {
    if (!editMode.value || !editable.avatar) return
    const el = fileInput.value
    if (el) el.click()
}

/** ───────── Валидация ───────── */
const errors = reactive<Record<string, string>>({})
function touch(field: string) { validate(field) }
function validate(field: string) {
    switch (field) {
        case 'firstName':
        case 'lastName':
            errors[field] = (form as any)[field] ? '' : 'Обязательное поле'; break
        case 'gameNick':
            errors.gameNick = /^[a-zA-Z0-9_.]{3,20}$/.test(form.gameNick) ? '' : '3–20 символов: латиница, цифры, _ .'; break
    }
}
function validateAll() {
    ;['firstName', 'lastName', 'gameNick'].forEach(validate)
    return Object.values(errors).every(e => !e)
}

const nickBusy = reactive({ gameNick: false })
let nickTimer: ReturnType<typeof setTimeout> | null = null
function debouncedCheckNick(field: 'gameNick') {
    validate(field)
    if (nickTimer) clearTimeout(nickTimer)
    nickTimer = setTimeout(async () => {
        if (errors[field] || !form[field]) { nickBusy[field] = false; return }
        const r = { busy: form[field].toLowerCase() === 'taken' } // demo
        nickBusy[field] = r.busy
        if (r.busy) errors[field] = 'Ник уже занят'
    }, 400)
}

function buildFormData(): FormData {
    const fd = new FormData()

    fd.append('first_name', form.firstName)
    fd.append('last_name', form.lastName)
    fd.append('username', form.gameNick)
    fd.append('bio', form.about || '')

    if (form.birthday) fd.append('birthday', form.birthday) 
    if (form.gender === true || form.gender === false) {
        fd.append('gender', String(!!form.gender))
    }

    // аватар
    if (avatarFile.value) fd.append('avatar', avatarFile.value)

    return fd
}

async function onSubmit() {
    if (!editMode.value) return
    if (!validateAll() || nickBusy.gameNick) return
    saving.value = true
    try {
        const body = buildFormData()

        const saved = await $auth('/profile/update/', { method: 'PATCH', body })

        

        await refresh()

        const payload = (saved && (saved.data || saved)) || {}
        if (payload.avatar) {
            form.avatarUrl = `${payload.avatar}?t=${Date.now()}`
        } else if (avatarFile.value) {
            form.avatarUrl = avatarPreview || form.avatarUrl
        }

        if (authUser.value) {
            authUser.value.first_name = form.firstName
            authUser.value.last_name = form.lastName
            authUser.value.username = form.gameNick
            if (payload.avatar) authUser.value.avatar = payload.avatar
        }

        avatarFile.value = null
        avatarPreview.value = null
        showPass.value = false
        editMode.value = false
        makeSnapshot()
    } finally {
        saving.value = false
    }
}

function goBack() { router.back() }

function toggleEdit() {
    if (!editMode.value) {
        makeSnapshot()
        editMode.value = true
    } else {
        restoreFromSnapshot()
        avatarFile.value = null
        avatarPreview.value = null
        showPass.value = false
        editMode.value = false
    }
}

watch(apiProfile, () => { makeSnapshot() }, { immediate: true })
</script>

<style>
@import './settings.css';

/* disabled/кнопки */
.settings-inp input:disabled,
.settings-inp select:disabled,
.settings-ta:disabled {
    color: #98a2b3;
    cursor: not-allowed;
}

.settings-link[disabled],
.settings-eye[disabled] {
    opacity: .5;
    pointer-events: none;
}

.settings-actions {
    margin-top: 16px;
    display: flex;
    gap: 12px;
}

.settings-actions--split {
    justify-content: space-between;
}

.settings-logout {
    margin: 8px 0 16px;
    padding: 10px 16px;
    border: none;
    border-radius: 10px;
    background: #ef4444;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
}

.settings-logout:disabled {
    opacity: .6;
    cursor: not-allowed;
}

.settings-save {
    padding: 10px 16px;
    border-radius: 10px;
    border: none;
    font-weight: 600;
    background: #2e90fa;
    color: #fff;
    transition: transform .06s ease, opacity .2s ease;
}

.settings-save:disabled {
    opacity: .6;
    cursor: not-allowed;
}

.settings-save--secondary {
    background: #eef2f7;
    color: #0f172a;
}

.err,
.settings-err {
    color: #e11d48;
}

.hidden {
    display: none;
}
</style>