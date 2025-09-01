<!-- pages/registry.vue (или любой ваш путь) -->
<template>
  <div class="registry-page">
    <div class="registry-header">
      <h1>Реестр</h1>

    </div>

    <div class="registry-content">
      <div v-if="pending && clubs.length === 0" class="state">Загрузка…</div>
      <div v-else-if="error && clubs.length === 0" class="state error">Не удалось загрузить реестр</div>

      <div class="registry-cards">
        <article v-for="club in clubs" :key="club.id" class="registry-card" :style="bgStyle(club)">
          <!-- Основной слой -->
          <div class="registry-card-inner">
            <div class="registry-card-logo">
              <img :src="club.logoUrl || defaultLogo" :alt="club.name" />
            </div>

            <div class="registry-card-content">
              <h2 class="registry-card-title">{{ club.name }}</h2>
              <p v-if="club.description" class="registry-card-sub">{{ club.description }}</p>
            </div>

            <div class="registry-card-action">
              <button class="registry-learn-more-btn" @click="toggleOpen(club.id)">
                <span v-if="openId !== club.id">Узнать больше</span>
                <span v-else>Закрыть</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                  :style="{ transform: openId === club.id ? 'rotate(180deg)' : 'none' }">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Разворачиваемая часть -->
          <transition name="details">
            <div v-if="openId === club.id" class="registry-details">
              <div class="registry-details-left">
                <h3 class="details-title">{{ club.name }}</h3>
                <p v-if="club.description" class="details-quote">
                  «{{ club.description }}»
                </p>

                <ul class="details-info">
                  <li v-if="club.location">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <path opacity="0.5"
                        d="M14 2.3335C8.8453 2.3335 4.66663 7.00318 4.66663 12.2502C4.66663 17.456 7.6455 23.1146 12.2932 25.287C13.3767 25.7934 14.6233 25.7934 15.7067 25.287C20.3544 23.1146 23.3333 17.456 23.3333 12.2502C23.3333 7.00318 19.1546 2.3335 14 2.3335Z"
                        fill="white" />
                      <path
                        d="M14 14.5833C15.6109 14.5833 16.9167 13.2775 16.9167 11.6667C16.9167 10.0558 15.6109 8.75 14 8.75C12.3892 8.75 11.0834 10.0558 11.0834 11.6667C11.0834 13.2775 12.3892 14.5833 14 14.5833Z"
                        fill="white" />
                    </svg>
                    <span>{{ club.location }}</span>
                  </li>
                  <li v-if="club.phone_number">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <path opacity="0.5"
                        d="M11.7105 6.20204L12.4677 7.55879C13.151 8.78319 12.8767 10.3894 11.8005 11.4656C11.8005 11.4656 10.495 12.771 12.8619 15.1379C15.2287 17.5047 16.5342 16.1993 16.5342 16.1993C17.6104 15.1231 19.2166 14.8488 20.441 15.5321L21.7978 16.2893C23.6466 17.3211 23.865 19.914 22.2399 21.5391C21.2634 22.5156 20.0671 23.2754 18.7447 23.3255C16.5185 23.4099 12.738 22.8465 8.94561 19.0542C5.15327 15.2618 4.58988 11.4813 4.67427 9.25511C4.7244 7.9327 5.48423 6.73644 6.46073 5.75994C8.08584 4.13483 10.6787 4.35318 11.7105 6.20204Z"
                        fill="white" />
                      <path
                        d="M15.4694 2.1933C15.5467 1.71626 15.9976 1.39266 16.4747 1.46989C16.5042 1.47554 16.5992 1.4933 16.649 1.50438C16.7485 1.52655 16.8874 1.56069 17.0605 1.61112C17.4068 1.71197 17.8905 1.87811 18.471 2.14427C19.6334 2.67715 21.1801 3.60932 22.7852 5.21442C24.3903 6.81952 25.3225 8.3663 25.8554 9.52863C26.1216 10.1092 26.2877 10.5929 26.3885 10.9391C26.439 11.1123 26.4731 11.2511 26.4953 11.3507C26.5064 11.4005 26.5145 11.4404 26.5201 11.47L26.5268 11.5064C26.6041 11.9834 26.2834 12.453 25.8064 12.5302C25.3307 12.6072 24.8826 12.2852 24.8034 11.8104C24.801 11.7977 24.7943 11.7634 24.7871 11.7311C24.7727 11.6665 24.7478 11.564 24.7084 11.4285C24.6294 11.1574 24.4923 10.7546 24.2646 10.2579C23.8098 9.26591 22.992 7.89603 21.5478 6.45186C20.1036 5.00768 18.7338 4.18986 17.7417 3.73505C17.2451 3.50737 16.8422 3.37025 16.5712 3.2913C16.4356 3.25183 16.2653 3.21273 16.2007 3.19834C15.7259 3.11922 15.3924 2.66897 15.4694 2.1933Z"
                        fill="white" />
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M15.7334 6.21768C15.8662 5.75302 16.3505 5.48396 16.8151 5.61672L16.5747 6.45806C16.8151 5.61672 16.8151 5.61672 16.8151 5.61672L16.8168 5.6172L16.8186 5.61772L16.8225 5.61886L16.8315 5.62156L16.8546 5.62875C16.8722 5.63437 16.8942 5.6417 16.9204 5.65099C16.9727 5.66959 17.042 5.69603 17.1269 5.73243C17.2969 5.80527 17.5291 5.91777 17.8144 6.08659C18.3855 6.42456 19.165 6.98593 20.0808 7.90173C20.9966 8.81753 21.558 9.59708 21.8959 10.1681C22.0648 10.4534 22.1773 10.6856 22.2501 10.8556C22.2865 10.9405 22.313 11.0098 22.3315 11.0622C22.3408 11.0884 22.3482 11.1103 22.3538 11.1279L22.361 11.151L22.3637 11.1601L22.3648 11.164L22.3653 11.1657C22.3653 11.1657 22.3658 11.1674 21.5245 11.4078L22.3658 11.1674C22.4986 11.6321 22.2295 12.1164 21.7649 12.2491C21.3042 12.3808 20.8241 12.1174 20.6866 11.66L20.6823 11.6474C20.6761 11.6299 20.6632 11.5954 20.6416 11.545C20.5984 11.4442 20.5202 11.2795 20.3899 11.0594C20.1298 10.6199 19.66 9.95578 18.8434 9.13917C18.0268 8.32256 17.3626 7.85274 16.9231 7.5926C16.7031 7.46239 16.5383 7.3841 16.4376 7.34094C16.3872 7.31934 16.3527 7.30646 16.3351 7.30024L16.3226 7.29593C15.8652 7.15841 15.6018 6.67839 15.7334 6.21768Z"
                        fill="white" />
                    </svg>
                    <span>{{ club.phone_number }}</span>
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <path opacity="0.5"
                        d="M14 25.6668C20.4434 25.6668 25.6667 20.4435 25.6667 14.0002C25.6667 7.55684 20.4434 2.3335 14 2.3335C7.55672 2.3335 2.33337 7.55684 2.33337 14.0002C2.33337 20.4435 7.55672 25.6668 14 25.6668Z"
                        fill="white" />
                      <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M14 8.4585C14.4832 8.4585 14.875 8.85025 14.875 9.3335V13.6377L17.5354 16.2981C17.8771 16.6398 17.8771 17.1938 17.5354 17.5355C17.1937 17.8773 16.6397 17.8773 16.2979 17.5355L13.3813 14.6189C13.2172 14.4548 13.125 14.2322 13.125 14.0002V9.3335C13.125 8.85025 13.5168 8.4585 14 8.4585Z"
                        fill="white" />
                    </svg>
                    <span>
                      <template v-if="club.is_24_hours">Круглосуточно</template>
                      <template v-else>
                        {{ humanTime(club.opening_time) }} — {{ humanTime(club.closing_time) }}
                      </template>
                    </span>
                  </li>
                </ul>

                <div class="details-links">
                  <a v-if="club.website" :href="safeLink(club.website)" target="_blank" rel="noopener">Сайт</a>
                  <a v-if="club.instagram" :href="safeLink(club.instagram)" target="_blank" rel="noopener">Instagram</a>
                  <a v-if="club.telegram" :href="safeLink(club.telegram)" target="_blank" rel="noopener">Telegram</a>
                  <a v-if="club.whatsapp" :href="safeLink(club.whatsapp)" target="_blank" rel="noopener">WhatsApp</a>
                </div>
              </div>

              <div class="registry-details-right" v-if="club.specs.length">
                <div class="specs">
                  <div class="specs-title">Конфигурация</div>
                  <ul>
                    <li v-for="(s, i) in club.specs" :key="i">{{ s }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </transition>
        </article>
      </div>

      <div class="footer-controls" v-if="nextPage">
        <button class="load-more" :disabled="pending" @click="loadMore">
          {{ pending ? 'Загрузка…' : 'Загрузить ещё' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const { $api } = useNuxtApp()

/* === UI state === */
const openId = ref<number | null>(null)
const search = ref('')
const ordering = ref<string>('')

function toggleOpen(id: number) {
  openId.value = openId.value === id ? null : id
}

function humanTime(iso?: string | null) {
  if (!iso) return '—'
  try {
    // сервер отдаёт время в ISO (HH:mm:ssZ) — берём только часы:минуты
    const t = new Date(iso)
    const hh = String(t.getHours()).padStart(2, '0')
    const mm = String(t.getMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
  } catch { return '—' }
}
function safeLink(u: string) { return /^https?:\/\//i.test(u) ? u : `https://${u}` }

/* === data === */
type RawComputer = {
  id: number
  cpu_brand?: string
  cpu_model?: string
  cpu_cores?: number
  cpu_threads?: number
  cpu_base_clock?: string | number
  gpu_brand?: string
  gpu_model?: string
  gpu_memory?: number
  ram_size?: number
  ram_type?: string
  ram_speed?: number
  storage_type?: string
  storage_capacity?: number
  monitor_size?: number
  monitor_resolution?: string
  monitor_refresh_rate?: number
}
type RawClub = {
  id: number
  computers?: RawComputer[]
  name: string
  description?: string
  location?: string
  city?: string
  region?: string
  country?: string
  phone_number?: string
  email?: string
  website?: string
  telegram?: string
  instagram?: string
  whatsapp?: string
  opening_time?: string
  closing_time?: string
  is_24_hours?: boolean
  logo?: any // id | object
}

type Club = RawClub & {
  logoUrl: string | null
  specs: string[]
  bg: string | null
}

const defaultLogo = '/assets/reestr/cyber.svg'
const defaultBg = '/assets/reestr/arena-bg.jpg' // положите любую картинку, либо замените путём

/* === fetch & normalize === */
const clubs = ref<Club[]>([])
const pending = ref(false)
const error = ref<unknown>(null)
const nextPage = ref<number | null>(1) // 1 — первая страница

async function fetchPage(page = 1) {
  pending.value = true
  error.value = null
  try {
    const query: any = { page }
    if (search.value) query.search = search.value
    if (ordering.value) query.ordering = ordering.value

    const res: any = await $api('/registry/list/', { query })
    const results: RawClub[] = Array.isArray(res?.results) ? res.results : (Array.isArray(res) ? res : [])
    const mapped: Club[] = results.map(normalizeClub)
    if (page === 1) clubs.value = mapped
    else clubs.value = [...clubs.value, ...mapped]

    // пагинация
    if (res?.next) {
      // простая эвристика: вытащим номер страницы
      const m = String(res.next).match(/[?&]page=(\d+)/)
      nextPage.value = m ? Number(m[1]) : null
    } else {
      nextPage.value = null
    }
  } catch (e) {
    error.value = e
  } finally {
    pending.value = false
  }
}

function normalizeClub(raw: RawClub): Club {
  const logoUrl =
    typeof (raw as any).logo === 'object' && (raw as any).logo?.file
      ? (raw as any).logo.file
      : (typeof (raw as any).logo === 'number'
        ? `/files/${(raw as any).logo}/` // если у вас другой путь к файлу — поправьте
        : null)

  // соберём «спеки» из первого компьютера (или сведём по ключевым полям)
  const pc = (raw.computers && raw.computers[0]) || null
  const specs: string[] = []
  if (pc) {
    const cpu = [pc.cpu_brand, pc.cpu_model].filter(Boolean).join(' ')
    if (cpu) specs.push(cpu)
    if (pc.ram_size || pc.ram_type || pc.ram_speed) {
      const ramParts = []
      if (pc.ram_type) ramParts.push(pc.ram_type.toUpperCase())
      if (pc.ram_size) ramParts.push(`${pc.ram_size} GB`)
      if (pc.ram_speed) ramParts.push(`${pc.ram_speed} MHz`)
      specs.push(ramParts.join(' '))
    }
    const gpu = [pc.gpu_brand, pc.gpu_model, pc.gpu_memory ? `${pc.gpu_memory} GB` : ''].filter(Boolean).join(' ')
    if (gpu) specs.push(gpu)
    if (pc.storage_type || pc.storage_capacity) {
      const stor = [pc.storage_type?.toUpperCase(), pc.storage_capacity ? `${pc.storage_capacity} GB` : ''].filter(Boolean).join(' ')
      if (stor) specs.push(stor)
    }
    if (pc.monitor_size || pc.monitor_resolution || pc.monitor_refresh_rate) {
      const mon = [
        pc.monitor_size ? `${pc.monitor_size}"` : '',
        pc.monitor_resolution || '',
        pc.monitor_refresh_rate ? `${pc.monitor_refresh_rate}Hz` : '',
      ].filter(Boolean).join(' ')
      if (mon) specs.push(mon)
    }
  }

  return {
    ...raw,
    logoUrl: logoUrl || null,
    specs,
    bg: defaultBg, // можете подставить своё поле из API, если появится
  }
}

/* === controls === */
async function reload() {
  nextPage.value = 1
  await fetchPage(1)
}
async function loadMore() {
  if (!nextPage.value) return
  await fetchPage(nextPage.value)
}

let t: any = null
const debouncedReload = () => {
  clearTimeout(t)
  t = setTimeout(reload, 350)
}

/* === bg style === */
function bgStyle(club: Club) {
  // фон — картинка справа + левый градиент (как на макете)
  const img = club.bg ? `url('${club.bg}')` : 'none'
  return {
    backgroundImage: `${img}`,
  } as any
}

/* init */
onMounted(() => reload())
</script>

<style scoped>
@import './registry.css'
</style>
