<template>
    <div class="rate">
        <div class="switcher">
            <div class="switcher-container">
                <button v-for="(category, index) in categories1" :key="index"
                    :class="['switcher-btn', { active: activeCategory1 === index }]" @click="setActiveCategory1(index)"
                    :ref="el => { if (el) buttonRefs1[index] = el }">
                    {{ category }}
                </button>
                <div class="switcher-slider" :style="{
                    transform: `translateX(${getSliderPosition1()}px)`,
                    width: `${getSliderWidth1()}px`
                }"></div>
            </div>
        </div>

        <div class="switcher">
            <div class="switcher-container">
                <button v-for="(category, index) in categories2" :key="index"
                    :class="['switcher-btn', { active: activeCategory2 === index }]" @click="setActiveCategory2(index)"
                    :ref="el => { if (el) buttonRefs2[index] = el }">
                    {{ category }}
                </button>
                <div class="switcher-slider" :style="{
                    transform: `translateX(${getSliderPosition2()}px)`,
                    width: `${getSliderWidth2()}px`
                }"></div>
            </div>
        </div>

        <div class="main-content main-content-rate">
            <div class="table-header">
                <div class="header-place">Место</div>
                <div class="header-team">Команда</div>
                <div class="header-points">Очки</div>
            </div>
            <div class="team-list">
                <NuxtLink to="/rate-team"  v-for="(team, index) in teams" :key="index" class="team-row">
                    <div class="team-rank">
                        <span class="rank-number">{{ index + 1 }}</span>
                    </div>
                    <div class="team-info">
                        <img :src="team.logo" :alt="team.name" class="team-logo">
                        <span class="team-name">{{ team.name }}</span>
                    </div>
                    <div class="team-points">{{ team.points }}</div>
                    <div class="team-arrow">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 4L10 8L6 12" stroke="#6c757d" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                </NuxtLink>
            </div>
        </div>

        <div class="main-content main-content-rate">
            <div class="table-header">
                <div class="players-place">Достижения игроков</div>
            </div>
            <div class="team-list">
                <NuxtLink to="/rate-player" v-for="(team, index) in teams" :key="index" class="players-row">
                    <div class="players-info">
                        <img src="@/assets/main/member.svg" :alt="team.name" class="team-logo players-logo">
                        <span class="players-name">Danil Kryshkovents </span>
                    </div>


                    <div class="players-nick">donk</div>
                    <div class="players-game">Counter-Strike 2</div>
                    <div class="players-arrow">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 4L10 8L6 12" stroke="#6c757d" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>

                </NuxtLink>
            </div>
        </div>
        <div class="rate-bottom">
            <div class="rate-bottom-item">
                <img class="rate-bottom-item-img" src="@/assets/rate/rateitem.svg" alt="rate">
                <div class="rate-bottom-item-top">
                    <img src="@/assets/main/arcreed.svg" alt="arcreed">
                    <h2>TEAM NATUS VINCERE</h2>
                </div>
                <h3><< Borem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent >></h3>
                <h4>№1 Major Stockholm 2021</h4>
                <NuxtLink>
                    Узнать больше
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'

// Switcher 1 (верхний)
const activeCategory1 = ref(0)
const categories1 = ['Команда', 'Игроки', 'Турниры']
const buttonRefs1 = ref([])
const buttonWidths1 = ref([])

const setActiveCategory1 = (index) => {
    activeCategory1.value = index
    calculateButtonWidths(buttonRefs1, buttonWidths1)
}

const getSliderPosition1 = () => {
    if (buttonWidths1.value.length === 0) return 0
    let position = 0
    const gap = window.innerWidth <= 768 ? 6 : 8
    for (let i = 0; i < activeCategory1.value; i++) {
        position += (buttonWidths1.value[i] || 120) + gap
    }
    return position
}

const getSliderWidth1 = () => {
    return buttonWidths1.value[activeCategory1.value] || 120
}

// Switcher 2 (нижний)
const activeCategory2 = ref(0)
const categories2 = ['BCE', 'CS 2', 'DOTA 2', 'VALARANT', 'MOBIEL LEGENDS']
const buttonRefs2 = ref([])
const buttonWidths2 = ref([])

const setActiveCategory2 = (index) => {
    activeCategory2.value = index
    calculateButtonWidths(buttonRefs2, buttonWidths2)
}

const getSliderPosition2 = () => {
    if (buttonWidths2.value.length === 0) return 0
    let position = 0
    const gap = window.innerWidth <= 768 ? 6 : 8
    for (let i = 0; i < activeCategory2.value; i++) {
        position += (buttonWidths2.value[i] || 120) + gap
    }
    return position
}

const getSliderWidth2 = () => {
    return buttonWidths2.value[activeCategory2.value] || 120
}

// Функция для пересчёта ширины кнопок
const calculateButtonWidths = async (refs, widths) => {
    await nextTick()
    widths.value = refs.value.map(button => button?.offsetWidth || 120)
}

onMounted(() => {
    calculateButtonWidths(buttonRefs1, buttonWidths1)
    calculateButtonWidths(buttonRefs2, buttonWidths2)
})
import Logo from '@/assets/main/arcreed.svg'
// Данные команд
const teams = [
    { name: 'Spirit', logo: Logo, points: '2180' },
    { name: 'NATUS VINCERE', logo: Logo, points: '2180' },
    { name: 'FNATIC', logo: Logo, points: '2180' },
    { name: 'HEROIC', logo: Logo, points: '2180' },
    { name: 'G2 ESPORT', logo: Logo, points: '2180' }
]
</script>



<style>
@import './rate.css'
</style>