<template>
    <div class="settings">
      <!-- Top bar -->
      <button class="settings-back" type="button" @click="goBack">
        <svg width="18" height="18" viewBox="0 0 20 20">
          <path d="M15 10H5M5 10L10 5M5 10L10 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
  
          <input
            ref="fileInput"
            class="hidden"
            type="file"
            accept="image/*"
            @change="onAvatarChoose"
            :disabled="!editMode"
          />
  
          <button
            class="settings-link"
            type="button"
            @click="editMode && fileInput?.click()"
            :disabled="!editMode"
          >
            Изменить аватарку
          </button>
  
          <button
            class="settings-link settings-link-danger"
            type="button"
            @click="removeAvatar"
            :disabled="(!form.avatarUrl && !avatarPreview) || !editMode"
          >
            Удалить аватарку
          </button>
  
          <p v-if="avatarError" class="err">{{ avatarError }}</p>
        </div>
  
        <!-- Form -->
        <form class="settings-form" @submit.prevent="onSubmit">
          <div class="settings-col">
            <label class="settings-lbl">Имя
              <div class="settings-inp">
                <IconUser />
                <input
                  v-model.trim="form.firstName"
                  placeholder="Имя"
                  @blur="touch('firstName')"
                  :disabled="!editMode"
                />
              </div>
              <span class="settings-err" v-if="errors.firstName">{{ errors.firstName }}</span>
            </label>
  
            <label class="settings-lbl">Фамилия
              <div class="settings-inp">
                <IconUser />
                <input
                  v-model.trim="form.lastName"
                  placeholder="Фамилия"
                  @blur="touch('lastName')"
                  :disabled="!editMode"
                />
              </div>
              <span class="settings-err" v-if="errors.lastName">{{ errors.lastName }}</span>
            </label>
  
            <label class="settings-lbl">Отчество
              <div class="settings-inp">
                <IconUser />
                <input
                  v-model.trim="form.middleName"
                  placeholder="Отчество"
                  :disabled="!editMode"
                />
              </div>
            </label>
  
            <label class="settings-lbl">О себе
              <textarea
                class="settings-ta"
                v-model.trim="form.about"
                placeholder="О себе"
                :disabled="!editMode"
              ></textarea>
            </label>
  
            <div class="settings-toggle-row">
              <span class="settings-toggle-title">Видимость “О себе”</span>
              <label class="settings-switch">
                <input type="checkbox" v-model="form.aboutVisible" :disabled="!editMode">
                <span class="settings-slider"></span>
              </label>
              <span class="settings-toggle-state">{{ form.aboutVisible ? 'Включено' : 'Выключено' }}</span>
            </div>
          </div>
  
          <div class="settings-col">
            <label class="settings-lbl">Игровой ник
              <div class="settings-inp">
                <IconUser />
                <input
                  v-model.trim="form.gameNick"
                  placeholder="Ник"
                  @input="editMode && debouncedCheckNick('gameNick')"
                  @blur="touch('gameNick')"
                  :disabled="!editMode"
                />
              </div>
              <span class="settings-err" v-if="errors.gameNick">{{ errors.gameNick }}</span>
              <span class="settings-hint" v-if="nickBusy.gameNick">Ник занят</span>
            </label>
  
            <label class="settings-lbl">Steam ник
              <div class="settings-inp">
                <IconUser />
                <input
                  v-model.trim="form.steamNick"
                  placeholder="Steam ник"
                  :disabled="!editMode"
                />
              </div>
            </label>
  
            <label class="settings-lbl">Email
              <div class="settings-inp">
                <IconMail />
                <input
                  v-model.trim="form.email"
                  placeholder="Email"
                  @blur="touch('email')"
                  :disabled="!editMode"
                />
              </div>
              <span class="settings-err" v-if="errors.email">{{ errors.email }}</span>
            </label>
  
            <label class="settings-lbl">Номер телефона
              <div class="settings-inp">
                <IconPhone />
                <input
                  v-model="form.phone"
                  placeholder="+998 90 123 45 67"
                  inputmode="tel"
                  @input="editMode && maskPhone($event)"
                  @blur="touch('phone')"
                  :disabled="!editMode"
                />
              </div>
              <span class="settings-err" v-if="errors.phone">{{ errors.phone }}</span>
            </label>
  
            <label class="settings-lbl">Ваш пароль
              <div class="settings-inp">
                <IconLock />
                <input
                  :type="showPass ? 'text' : 'password'"
                  v-model="form.password"
                  placeholder="********"
                  @blur="touch('password')"
                  :disabled="!editMode"
                />
                <button
                  type="button"
                  class="settings-eye"
                  @click="editMode && (showPass = !showPass)"
                  :disabled="!editMode"
                >
                  {{ showPass ? 'Скрыть' : 'Показать' }}
                </button>
              </div>
              <span class="settings-err" v-if="errors.password">{{ errors.password }}</span>
              <span class="settings-hint" v-if="form.password">Надёжность: {{ passwordStrength(form.password) }}</span>
            </label>
  
            <div class="settings-actions settings-actions--split">
              <!-- Левая: Изменить -->
              <button
                class="settings-save settings-save--secondary"
                type="button"
                @click="toggleEdit"
                :disabled="saving"
              >
                {{ editMode ? 'Отменить' : 'Изменить' }}
              </button>
  
              <!-- Правая: Сохранить изменения -->
              <button
                class="settings-save"
                type="submit"
                :disabled="!editMode || saving"
              >
                {{ saving ? 'Сохраняем…' : 'Сохранить изменения' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, h } from 'vue'
  import { useRouter } from 'vue-router'
  
  /** ───────── Иконки-мини (inline SVG) ───────── */
  const IconUser = () => h('svg', {width:20,height:20,viewBox:'0 0 24 24',fill:'none'}, [
    h('circle',{cx:12,cy:8,r:4,stroke:'#80C5FD','stroke-width':1.5}),
    h('path',{d:'M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6',stroke:'#80C5FD','stroke-width':1.5,fill:'none'})
  ])
  const IconMail = () => h('svg',{width:20,height:20,viewBox:'0 0 24 24',fill:'none'},[
    h('rect',{x:3,y:5,width:18,height:14,rx:3,stroke:'#80C5FD','stroke-width':1.5}),
    h('path',{d:'M4 7l8 6 8-6',stroke:'#80C5FD','stroke-width':1.5})
  ])
  const IconPhone = () => h('svg',{width:20,height:20,viewBox:'0 0 24 24',fill:'none'},[
    h('path',{d:'M16 2h-8a2 2 0 0 0-2 2v16l6-3 6 3V4a2 2 0 0 0-2-2z',stroke:'#80C5FD','stroke-width':1.5,fill:'none'})
  ])
  const IconLock = () => h('svg',{width:20,height:20,viewBox:'0 0 24 24',fill:'none'},[
    h('rect',{x:4,y:10,width:16,height:10,rx:2,stroke:'#80C5FD','stroke-width':1.5}),
    h('path',{d:'M8 10V8a4 4 0 1 1 8 0v2',stroke:'#80C5FD','stroke-width':1.5})
  ])
  
  const router = useRouter()
  const defaultAvatar = '/avatar-default.png'
  
  /** ───────── Режим редактирования ───────── */
  const editMode = ref(false)
  const saving = ref(false)
  const showPass = ref(false)
  
  /** ───────── Данные формы (дефолты для демо) ───────── */
  const form = reactive({
    avatarUrl: '/avatars/evelon_09.png',
    firstName: 'Асадбек',
    lastName: 'Жорабаев',
    middleName: '',
    about: '',
    aboutVisible: true,
    gameNick: 'Evelon_09',
    steamNick: 'Evelon_09',
    email: 'user@example.com',
    phone: '+998 90 123 45 67',
    password: ''
  })
  
  /** Снапшот для отмены */
  let snapshot: any = null
  function makeSnapshot() {
    snapshot = JSON.parse(JSON.stringify(form))
  }
  function restoreFromSnapshot() {
    if (!snapshot) return
    Object.assign(form, snapshot)
  }
  
  /** ───────── Аватарка ───────── */
  const fileInput = ref<HTMLInputElement|null>(null)
  const avatarPreview = ref<string|null>(null)
  const avatarFile = ref<File|null>(null)
  const avatarError = ref('')
  
  function onAvatarChoose(e: Event) {
    avatarError.value = ''
    const f = (e.target as HTMLInputElement).files?.[0]
    if (!f) return
    if (!/^image\//.test(f.type)) { avatarError.value = 'Только изображения'; return }
    if (f.size > 5*1024*1024) { avatarError.value = 'Максимум 5 МБ'; return }
    avatarFile.value = f
    const r = new FileReader()
    r.onload = () => avatarPreview.value = String(r.result)
    r.readAsDataURL(f)
  }
  function removeAvatar() {
    avatarFile.value = null
    avatarPreview.value = null
    form.avatarUrl = ''
  }
  
  /** ───────── Валидация ───────── */
  const errors = reactive<Record<string,string>>({})
  function touch(field: string){ validate(field) }
  function validate(field: string){
    switch(field){
      case 'firstName':
      case 'lastName':
        errors[field] = (form as any)[field] ? '' : 'Обязательное поле'; break
      case 'gameNick':
        errors.gameNick = /^[a-zA-Z0-9_.]{3,20}$/.test(form.gameNick) ? '' : '3–20 символов: латиница, цифры, _ .'; break
      case 'email':
        errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Некорректный email'; break
      case 'phone':
        errors.phone = form.phone.replace(/\D/g,'').length >= 11 ? '' : 'Некорректный номер'; break
      case 'password':
        if(!form.password){ errors.password=''; break }
        errors.password = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(form.password) ? '' : 'Мин. 8 символов, буквы и цифры'; break
    }
  }
  function validateAll(){
    ['firstName','lastName','gameNick','email','phone','password'].forEach(validate)
    return Object.values(errors).every(e=>!e)
  }
  
  /** ───────── Маска телефона (UZ) ───────── */
  function maskPhone(e: Event){
    const t = e.target as HTMLInputElement
    const d = t.value.replace(/\D/g,'')
    let res = '+'
    for(let i=0;i<d.length;i++){
      res += d[i]
      if(i===2||i===4) res+=' '
      if(i===6||i===8||i===10) res+=' '
    }
    form.phone = res
  }
  
  /** ───────── Проверка занятости ника (дебаунс DEMO) ───────── */
  const nickBusy = reactive({ gameNick:false })
  let timer: ReturnType<typeof setTimeout>|null = null
  function debouncedCheckNick(field: 'gameNick'){
    validate(field)
    if(timer) clearTimeout(timer)
    timer = setTimeout(async ()=>{
      if(errors[field] || !form[field]) { nickBusy[field]=false; return }
      // TODO: заменить на реальный бек
      const r = { busy: form[field].toLowerCase()==='taken' }
      nickBusy[field] = r.busy
      if(r.busy) errors[field] = 'Ник уже занят'
    },400)
  }
  
  /** ───────── Сохранение ───────── */
  function passwordStrength(p: string){
    let s=0; if(p.length>=8) s++; if(/[A-Z]/.test(p)&&/[a-z]/.test(p)) s++; if(/\d/.test(p)) s++; if(/[^A-Za-z0-9]/.test(p)) s++
    return ['слабый','средний','хороший','сильный'][Math.max(0,s-1)]
  }
  
  async function onSubmit(){
    if(!validateAll() || nickBusy.gameNick) return
    saving.value = true
    try{
      let avatarUrl = form.avatarUrl
      if(avatarFile.value){
        // const fd = new FormData(); fd.append('file', avatarFile.value)
        // const up = await $fetch<{url:string}>('/api/upload',{method:'POST',body:fd})
        // avatarUrl = up.url
        avatarUrl = '/uploads/new-avatar-demo.png' // DEMO
      }
      const payload = { ...form, avatarUrl }
      // await $fetch('/api/me',{method:'PATCH',body:payload})
      await new Promise(r=>setTimeout(r,700))
  
      // Применяем изменения
      form.avatarUrl = avatarUrl
      avatarFile.value = null
      avatarPreview.value = null
      showPass.value = false
  
      // Выходим из режима и снимаем снапшот
      editMode.value = false
      makeSnapshot()
    } finally {
      saving.value = false
    }
  }
  
  /** ───────── Навигация + переключение режима ───────── */
  function goBack(){ router.back() }
  
  function toggleEdit(){
    if(!editMode.value){
      // Входим в режим редактирования: фиксируем снапшот
      makeSnapshot()
      editMode.value = true
    } else {
      // Отмена: откатываемся к снапшоту
      restoreFromSnapshot()
      avatarFile.value = null
      avatarPreview.value = null
      showPass.value = false
      editMode.value = false
    }
  }
  
  // Инициализация начального снапшота
  makeSnapshot()
  </script>
  
  <style>
  @import './settings.css';
  
  /* Доп. стили состояния disabled/кнопок */
  .settings-inp input:disabled,
  .settings-ta:disabled {
    color: #98a2b3;
    cursor: not-allowed;
  }
  
  .settings-link[disabled],
  .settings-eye[disabled] {
    opacity: 0.5;
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
  
  .err, .settings-err { color: #e11d48; }
  .hidden { display: none; }
  </style>
  