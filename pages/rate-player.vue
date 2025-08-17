<template>
    <div class="rate-player">
        <!-- Top Navigation -->
        <div class="top-nav">
            <NuxtLink to="/rate" class="back-nav">
                <button class="back-btn">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 10H5M5 10L10 15M5 10L10 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Назад
                </button>
            </NuxtLink>
        </div>
        <div class="rate-player-wrapper">
              <!-- Player Information Section -->
        <div class="player-info">
            <div class="player-photo">
                <img src="@/assets/main/member.svg" alt="Player Photo" class="profile-img" />
            </div>
            <div class="player-details">
                <div class="player-header">
                    <div class="name-flag">
                        <h1 class="player-name">jL</h1>
                        <img src="@/assets/main/flag.svg" alt="Lithuania" class="flag" />
                    </div>
                    <div class="social-links">
                        <a href="#" class="social-icon discord">
                            <img src="@/assets/icons/sidebar/discrod.svg" alt="Discord" />
                        </a>
                        <a href="#" class="social-icon twitch">
                            <img src="@/assets/icons/sidebar/telegram.svg" alt="Twitch" />
                        </a>
                        <a href="#" class="social-icon instagram">
                            <img src="@/assets/icons/sidebar/instagram.svg" alt="Instagram" />
                        </a>
                    </div>
                </div>
                <div class="player-stats">
                    <div class="stat-item">
                        <span class="label">Возраст:</span>
                        <span class="value">25 лет</span>
                    </div>
                    <div class="stat-item">
                        <span class="label">Команда:</span>
                        <span class="value">NATUS VIRIENCE</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Achievements Section -->
        <div class="achievements-section">
            <h2 class="section-title">Достижения</h2>
            <div class="switcher">
                <div class="switcher-container">
                    <button 
                        v-for="(category, index) in categories" 
                        :key="index"
                        :class="['switcher-btn', { active: activeCategory === index }]"
                        @click="setActiveCategory(index)"
                        :ref="el => { if (el) buttonRefs[index] = el }"
                    >
                        {{ category }}
                    </button>
                    <div 
                        class="switcher-slider" 
                        :style="{ 
                            transform: `translateX(${getSliderPosition()}px)`,
                            width: `${getSliderWidth()}px`
                        }"
                    ></div>
                </div>
            </div>
            <div class="summary-stats">
                <div class="stat-box">
                    <span class="stat-number">9</span>
                    <span class="stat-label">турниров</span>
                </div>
                <div class="stat-box">
                    <span class="stat-number">2</span>
                    <span class="stat-label">выйгрыша</span>
                </div>
            </div>
            <div class="achievements-list">
                <div class="achievement-item">
                    <div class="place-badge first">
                        <img src="@/assets/main/kubokwhite.svg" alt="Trophy" />
                        <span>1st</span>
                    </div>
                    <div class="team-info">
                        <img src="@/assets/main/cslogo.svg" alt="Vitality" class="team-logo" />
                        <span class="team-name">Vitality</span>
                    </div>
                    <div class="tournament-name">BLAST.tv Austin Major 2025</div>
                </div>
                <div class="achievement-item">
                    <div class="place-badge quarter">1/4 final</div>
                    <div class="team-info">
                        <img src="@/assets/main/cslogo.svg" alt="Vitality" class="team-logo" />
                        <span class="team-name">Vitality</span>
                    </div>
                    <div class="tournament-name">Perfect Shanghai Major 2024</div>
                </div>
                <div class="achievement-item">
                    <div class="place-badge third">
                        <img src="@/assets/main/kubokwhite.svg" alt="Trophy" />
                        <span>3rd</span>
                    </div>
                    <div class="team-info">
                        <img src="@/assets/main/cslogo.svg" alt="Vitality" class="team-logo" />
                        <span class="team-name">Vitality</span>
                    </div>
                    <div class="tournament-name">PGL Major Copenhagen 2024</div>
                </div>
                <div class="achievement-item">
                    <div class="place-badge first">
                        <img src="@/assets/main/kubokwhite.svg" alt="Trophy" />
                        <span>1st</span>
                    </div>
                    <div class="team-info">
                        <img src="@/assets/main/cslogo.svg" alt="Vitality" class="team-logo" />
                        <span class="team-name">Vitality</span>
                    </div>
                    <div class="tournament-name">BLAST.tv Paris Major 2023</div>
                </div>
                <div class="achievement-item">
                    <div class="place-badge quarter">1/4 final</div>
                    <div class="team-info">
                        <img src="@/assets/main/cslogo.svg" alt="Vitality" class="team-logo" />
                        <span class="team-name">Vitality</span>
                    </div>
                    <div class="tournament-name">IEM Bin Major 2022</div>
                </div>
            </div>
        </div>

        <section class="main-interest">
                <h2>Недавние матчи</h2>

                <div class="main-interest-wrapper">
                    <div class="main-interest-item rate-main-interest-item">
                        <img class="main-interest-item-img" src="@/assets/main/cslogo.svg" alt="interest">
                        <div class="main-interest-item-info">
                            <div class="main-interest-item-info-text">
                                <img src="@/assets/main/arcreed.svg" alt="clock">
                                <h3>Arcreed</h3>
                            </div>
                            <h4 class="main-interest-item-info-line">12/4</h4>

                            <div class="main-interest-item-info-text">
                                <img src="@/assets/main/virtus.svg" alt="clock">
                                <h3>Virtus</h3>
                            </div>
                        </div>
                        <NuxtLink to="/" class="main-interest-item-link">
                            Перейти
                        </NuxtLink>
                    </div>
                    <div class="main-interest-item rate-main-interest-item">
                        <img class="main-interest-item-img" src="@/assets/main/cslogo.svg" alt="interest">
                        <div class="main-interest-item-info">
                            <div class="main-interest-item-info-text">
                                <img src="@/assets/main/arcreed.svg" alt="clock">
                                <h3>Arcreed</h3>
                            </div>
                            <h4 class="main-interest-item-info-line">12/4</h4>

                            <div class="main-interest-item-info-text">
                                <img src="@/assets/main/virtus.svg" alt="clock">
                                <h3>Virtus</h3>
                            </div>
                        </div>
                        <NuxtLink to="/" class="main-interest-item-link">
                            Перейти
                        </NuxtLink>
                    </div>
                    <div class="main-interest-item rate-main-interest-item">
                        <img class="main-interest-item-img" src="@/assets/main/cslogo.svg" alt="interest">
                        <div class="main-interest-item-info">
                            <div class="main-interest-item-info-text">
                                <img src="@/assets/main/arcreed.svg" alt="clock">
                                <h3>Arcreed</h3>
                            </div>
                            <h4 class="main-interest-item-info-line">12/4</h4>

                            <div class="main-interest-item-info-text">
                                <img src="@/assets/main/virtus.svg" alt="clock">
                                <h3>Virtus</h3>
                            </div>
                        </div>
                        <NuxtLink to="/" class="main-interest-item-link">
                            Перейти
                        </NuxtLink>
                    </div>
                </div>
            </section>
                </div>
      
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

// Switcher logic
const activeCategory = ref(0)
const buttonRefs = ref([])
const categories = ['Major', 'Lan']

const setActiveCategory = (index) => {
    activeCategory.value = index
}

const getSliderPosition = () => {
    if (buttonRefs.value[activeCategory.value]) {
        return buttonRefs.value[activeCategory.value].offsetLeft
    }
    return 0
}

const getSliderWidth = () => {
    if (buttonRefs.value[activeCategory.value]) {
        return buttonRefs.value[activeCategory.value].offsetWidth
    }
    return 0
}
</script>

<style>
@import './rate-player.css';
@import './rate.css';

</style>