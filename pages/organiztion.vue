<template>
    <div class="org-page">
        <div class="org-card">
            <!-- Лого -->
            <div class="org-logo">
                <img src="@/assets/logo.svg" alt="Cyber Olam Logo" />
            </div>

            <h1 class="org-title">Регистрация</h1>

            <!-- Индикатор (2 шага) -->
            <div class="org-steps" role="progressbar" :aria-valuenow="step" aria-valuemin="1" aria-valuemax="2">
                <span v-for="n in 2" :key="n" class="dot" :class="{ active: step >= n }"></span>
            </div>

            <transition name="fade-slide" mode="out-in">
                <form :key="step" class="org-form" @submit.prevent>
                    <!-- ===== Шаг 1: Ник + тип + аватар ===== -->
                    <template v-if="step === 1">
                        <!-- Ник -->
                        <label class="pill-input">
                            <span class="icon"><img src="@/assets/login/user.svg" alt="user" /></span>
                            <input type="text" v-model.trim="common.role" placeholder="Название организации"
                                autocomplete="nickname" />
                        </label>

                        <!-- Выбор типа организации (кастомный селект) -->
                        <div class="select-pill" :class="{ open: selectOpen }">
                            <button type="button" class="select-display" @click="selectOpen = !selectOpen"
                                :aria-expanded="selectOpen ? 'true' : 'false'">
                                <span class="icon"><img src="@/assets/login/crown.svg" alt="org" /></span>
                                <span class="select-value">
                                    {{ orgType ? labels[orgType] : 'Тип организации' }}
                                </span>
                                <span class="chev" aria-hidden="true"></span>
                            </button>

                            <ul class="select-menu" v-show="selectOpen">
                                <li>
                                    <button type="button" class="option" @click="chooseType('person')">Физическое
                                        лицо</button>
                                </li>
                                <li>
                                    <button type="button" class="option" @click="chooseType('company')">Юридическое
                                        лицо</button>
                                </li>
                            </ul>
                        </div>

                        <!-- Аватар / логотип -->
                        <div class="avatar-upload" @click="triggerAvatar">
                            <input ref="avatarInput" class="hidden-file" type="file" accept="image/*"
                                @change="onAvatarChange" />
                            <div class="avatar-circle"
                                :style="{ backgroundImage: avatarPreview ? `url(${avatarPreview})` : '' }">
                                <span v-if="!avatarPreview" class="avatar-plus">+</span>
                            </div>
                            <div class="avatar-texts">
                                <div class="avatar-title">Аватар (логотип)</div>
                                <div class="avatar-sub">PNG/JPG/SVG, до 5 МБ</div>
                            </div>
                            <button v-if="files.avatar" type="button" class="ghost small"
                                @click.stop="clearAvatar">Удалить</button>
                        </div>

                        <button class="primary" :disabled="!canNextStep1" @click.prevent="nextStep">Продолжить</button>
                    </template>

                    <!-- ===== Шаг 2: формы по типу ===== -->
                    <template v-else>
                        <!-- Физическое лицо -->
                        <template v-if="orgType === 'person'">
                            <div class="grid-2">
                                <label class="pill-input">
                                    <span class="icon"><img src="@/assets/login/user.svg" alt="user" /></span>
                                    <input type="text" v-model.trim="person.firstName" placeholder="Имя"
                                        autocomplete="given-name" />
                                </label>
                                <label class="pill-input">
                                    <span class="icon"><img src="@/assets/login/user.svg" alt="user" /></span>
                                    <input type="text" v-model.trim="person.lastName" placeholder="Фамилия"
                                        autocomplete="family-name" />
                                </label>
                            </div>

                            <!-- Паспорт: перед/зад -->
                            <label class="pill-upload">
                                <span class="icon"><img src="@/assets/login/document.svg" alt="doc" /></span>
                                <input type="file" accept="image/*,.pdf" @change="onFile($event, 'passportFront')" />
                                <span class="text">{{ files.passportFront?.name || 'Фото паспорта спереди' }}</span>
                            </label>

                            <label class="pill-upload">
                                <span class="icon"><img src="@/assets/login/document.svg" alt="doc" /></span>
                                <input type="file" accept="image/*,.pdf" @change="onFile($event, 'passportBack')" />
                                <span class="text">{{ files.passportBack?.name || 'Фото паспорта сзади' }}</span>
                            </label>

                            <div class="grid-2">
                                <label class="pill-input">
                                    <span class="icon"><img src="@/assets/login/map.svg" alt="map" /></span>
                                    <input type="text" v-model.trim="person.country" placeholder="Страна"
                                        autocomplete="country-name" />
                                </label>
                                <label class="pill-input">
                                    <span class="icon"><img src="@/assets/login/map.svg" alt="map" /></span>
                                    <input type="text" v-model.trim="person.city" placeholder="Город"
                                        autocomplete="address-level2" />
                                </label>
                            </div>

                            <div class="actions">
                                <button class="ghost" @click.prevent="prevStep">Назад</button>
                                <button class="primary" :disabled="!canSubmitPerson" @click.prevent="submitPerson">
                                    Отправить заявку
                                </button>
                            </div>
                        </template>

                        <!-- Юридическое лицо -->
                        <template v-else>
                            <label class="pill-input">
                                <span class="icon"><img src="@/assets/login/mail.svg" alt="mail" /></span>
                                <!-- безопасная обёртка -->
                                <input type="email" v-model.trim="companyEmail" placeholder="Email"
                                    autocomplete="email" />
                            </label>

                            <label class="pill-input">
                                <span class="icon"><img src="@/assets/login/phone.svg" alt="phone" /></span>
                                <!-- безопасная обёртка -->
                                <input type="tel" v-model.trim="companyPhone" placeholder="Номер телефона"
                                    autocomplete="tel" />
                            </label>

                            <!-- ИНН (файл) -->
                            <label class="pill-upload">
                                <span class="icon"><img src="@/assets/login/document.svg" alt="doc" /></span>
                                <input type="file" accept=".pdf,image/*" @change="onFile($event, 'innDoc')" />
                                <span class="text">{{ files.innDoc?.name || 'Документ ИНН' }}</span>
                            </label>

                            <!-- Соцсети -->
                            <div class="socials">
                                <div v-for="(link, i) in company.socials" :key="i" class="social-row">
                                    <label class="pill-input flex-1">
                                        <span class="icon"><img src="@/assets/login/link.svg" alt="link" /></span>
                                        <input type="url" :placeholder="`Ссылка на сайт, соц. сети ${i + 1}`"
                                            v-model.trim="company.socials[i]" />
                                    </label>
                                    <button v-if="company.socials.length > 1" type="button" class="ghost small danger"
                                        @click="removeSocialCompany(i)" aria-label="Удалить ссылку">×</button>
                                </div>
                                <button type="button" class="ghost small" @click="addSocialCompany">+ Добавить
                                    ссылку</button>
                            </div>

                            <div class="actions">
                                <button class="ghost" @click.prevent="prevStep">Назад</button>
                                <button class="primary" :disabled="!canSubmitCompany" @click.prevent="submitCompany">
                                    Отправить заявку
                                </button>
                            </div>
                        </template>
                    </template>
                </form>
            </transition>

            <NuxtLink class="org-link-tomain" to="/">Вернуться на главную</NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useNuxtApp, useCookie } from '#imports'
import { useAuth } from '@/composables/useAuth'

definePageMeta({ requiresAuth: true })

/* ---------- $api + токен ---------- */
const { $api } = useNuxtApp()
const accessRef = useCookie<string | null>('access_token')

/* ---------- email авторизованного пользователя ---------- */
const { user } = useAuth()
const authedEmail = ref<string | null>(user.value?.email ?? null)

onMounted(async () => {
    // если в useAuth нет email, заберём из профиля
    if (!authedEmail.value) {
        try {
            const me: any = await $api('/profile/', {
                headers: { Authorization: `Bearer ${accessRef.value}` }
            })
            authedEmail.value =
                me?.email || me?.user?.email || me?.data?.email || me?.data?.user?.email || null
        } catch {
            authedEmail.value = null
        }
    }
})

/* ---------- state ---------- */
const step = ref(1)
const orgType = ref<'person' | 'company' | null>(null)
const labels = { person: 'Физическое лицо', company: 'Юридическое лицо' }
const selectOpen = ref(false)

const common = ref({ role: '' })

const person = ref({
    firstName: '',
    lastName: '',
    country: '',
    city: ''
})

const company = ref<{ email: string; phone: string; socials: string[] }>({
    email: '',
    phone: '',
    socials: ['']
})

const files = ref<{
    avatar: File | null
    passportFront: File | null
    passportBack: File | null
    innDoc: File | null
}>({
    avatar: null,
    passportFront: null,
    passportBack: null,
    innDoc: null
})

const isSubmitting = ref(false)

/* ---------- selects / uploads ---------- */
function chooseType(t: 'person' | 'company') { orgType.value = t; selectOpen.value = false }

const avatarInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref('')
function triggerAvatar() { avatarInput.value?.click() }
function onAvatarChange(e: Event) {
    const input = e.target as HTMLInputElement
    const f = input.files?.[0]
    if (!f) return
    if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value)
    files.value.avatar = f
    avatarPreview.value = URL.createObjectURL(f)
}
function clearAvatar() {
    if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value)
    files.value.avatar = null
    avatarPreview.value = ''
    if (avatarInput.value) avatarInput.value.value = ''
}

function onFile(e: Event, key: 'passportFront' | 'passportBack' | 'innDoc') {
    const input = e.target as HTMLInputElement
    const f = input.files?.[0]
    if (f) files.value[key] = f
}

/* socials (company) */
function addSocialCompany() { company.value.socials.push('') }
function removeSocialCompany(i: number) {
    company.value.socials.splice(i, 1)
    if (!company.value.socials.length) company.value.socials.push('')
}

/* ---------- nav ---------- */
function nextStep() { if (step.value < 2) step.value++ }
function prevStep() { if (step.value > 1) step.value-- }

/* close dropdown on click-out */
function onDocClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    const sel = target.closest?.('.select-pill')
    if (!sel) selectOpen.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

/* ---------- validation ---------- */
const canNextStep1 = computed(() =>
    common.value.role.trim().length > 1 && !!orgType.value
)

const canSubmitPerson = computed(() =>
    person.value.firstName.trim().length > 1 &&
    person.value.lastName.trim().length > 1 &&
    person.value.country.trim().length > 1 &&
    person.value.city.trim().length > 1 &&
    !!files.value.passportFront &&
    !!files.value.passportBack
)

const hasAnyCompanySocial = computed(() =>
    company.value.socials.some(s => s.trim().length > 3)
)

const canSubmitCompany = computed(() =>
    /.+@.+\..+/.test(company.value.email) &&
    company.value.phone.trim().length >= 6 &&
    !!files.value.innDoc &&
    hasAnyCompanySocial.value
)

/* ---------- безопасные обёртки для v-model ---------- */
const companyEmail = computed({
    get: () => company.value?.email ?? '',
    set: v => { if (!company.value) company.value = { email: '', phone: '', socials: [''] }; company.value.email = v }
})
const companyPhone = computed({
    get: () => company.value?.phone ?? '',
    set: v => { if (!company.value) company.value = { email: '', phone: '', socials: [''] }; company.value.phone = v }
})

/* ---------- helpers ---------- */
async function uploadFileReturnId(file: File, token: string): Promise<number> {
    const form = new FormData()
    form.append('file', file)
    // можно добавить form.append('description', 'org: logo') если нужно
    const res: any = await $api('/files/upload/', {
        method: 'POST',
        body: form,
        headers: { Authorization: `Bearer ${token}` }
    })
    const id = res?.id ?? res?.data?.id
    if (!id) throw new Error('Не удалось получить ID загруженного файла')
    return id
}

async function buildCommonFilesIds() {
    const ids: { organization_logo?: number } = {}
    if (files.value.avatar && accessRef.value) {
        ids.organization_logo = await uploadFileReturnId(files.value.avatar, accessRef.value)
    }
    return ids
}

/* ---------- submit ---------- */
const router = useRouter()

async function submitPerson() {
    if (!accessRef.value) return alert('Требуется вход.')
    if (!authedEmail.value) return alert('Не удалось определить email авторизованного пользователя')
    if (!canSubmitPerson.value) return

    try {
        isSubmitting.value = true
        const ids = await buildCommonFilesIds()
        const passportFrontId = await uploadFileReturnId(files.value.passportFront!, accessRef.value)
        const passportBackId = await uploadFileReturnId(files.value.passportBack!, accessRef.value)

        const payload = {
            organization_type: 'INDIVIDUAL',
            organization_name: common.value.role,
            organization_logo: ids.organization_logo ?? null,
            email: authedEmail.value,     // email авторизованного пользователя
            description: null,            // строго null
            expected_members_count: null,
            review_notes: null,
            legal_entity: null,
            individual: {
                first_name: person.value.firstName,
                last_name: person.value.lastName,
                country: person.value.country,
                city: person.value.city,
                job: null,
                passport_photo_front: passportFrontId,
                passport_photo_back: passportBackId
            }
        }

        await $api('/auth/applications/organizations/apply/', {
            method: 'POST',
            body: payload,
            headers: { Authorization: `Bearer ${accessRef.value}` }
        })

        alert('Заявка отправлена!')
        router.replace('/')
    } catch (e: any) {
        console.error(e)
        alert(e?.data?.detail || e?.message || 'Не удалось отправить заявку')
    } finally {
        isSubmitting.value = false
    }
}

async function submitCompany() {
    if (!accessRef.value) return alert('Требуется вход.')
    if (!authedEmail.value) return alert('Не удалось определить email авторизованного пользователя')
    if (!canSubmitCompany.value) return

    try {
        isSubmitting.value = true
        const ids = await buildCommonFilesIds()
        const innDocId = await uploadFileReturnId(files.value.innDoc!, accessRef.value)

        const payload = {
            organization_type: 'LEGAL_ENTITY',
            organization_name: common.value.role,
            organization_logo: ids.organization_logo ?? null,
            email: authedEmail.value,     // email авторизованного пользователя
            description: null,            // строго null
            expected_members_count: null,
            review_notes: null,
            legal_entity: {
                contact_email: company.value.email,
                contact_phone: company.value.phone,
                tax_id: innDocId            // tax_id = id файла (как вы просили)
            },
            individual: null
        }

        await $api('/auth/applications/organizations/apply/', {
            method: 'POST',
            body: payload,
            headers: { Authorization: `Bearer ${accessRef.value}` }
        })

        alert('Заявка отправлена!')
        router.replace('/')
    } catch (e: any) {
        console.error(e)
        alert(e?.data?.detail || e?.message || 'Не удалось отправить заявку')
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style>
@import './organiztion.css';

/* ==== Кастомный селект (тип организации) ==== */
.select-pill {
    position: relative;
}

.select-display {
    width: 100%;
    display: grid;
    grid-template-columns: 28px 1fr 28px;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 999px;
    border: 1px solid var(--border-light);
    background: var(--bg-white);
    box-shadow: var(--shadow-sm);
    cursor: pointer;
}

.select-value {
    color: var(--text-grey);
}

.select-pill.open .select-value {
    color: var(--text-primary);
}

.chev {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    background: color-mix(in oklab, var(--bg-blue) 12%, var(--bg-white));
    position: relative;
}

.chev::before,
.chev::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 10px;
    height: 2px;
    background: var(--text-blue);
    transform: translate(-50%, -50%) rotate(45deg);
    transition: transform .18s ease;
}

.chev::after {
    transform: translate(-50%, -50%) rotate(-45deg);
    left: 20%;
}

.select-pill.open .chev::before {
    transform: translate(-50%, -50%) rotate(-45deg);
}

.select-pill.open .chev::after {
    transform: translate(-50%, -50%) rotate(45deg);
}

.select-menu {
    position: absolute;
    inset: auto 0 0 0;
    transform: translateY(calc(100% + 8px));
    background: var(--bg-white);
    border: 1px solid var(--border-light);
    border-radius: 14px;
    box-shadow: var(--shadow);
    overflow: hidden;
    z-index: 10;
}

.option {
    width: 100%;
    text-align: left;
    padding: 10px 14px;
    background: transparent;
    border: 0;
    cursor: pointer;
    color: var(--text-primary);
}

.option:hover {
    background: color-mix(in oklab, var(--bg-blue) 10%, var(--bg-white));
}
</style>