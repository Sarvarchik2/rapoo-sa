<template>
    <div class="news">
        <!-- Switcher -->
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

        <div class="news-content">
            <NuxtLink to="/news-more" class="news-card large">
                <div class="card-image">
                    <img src="/assets/news/news1.svg" alt="News 1" />
                    <div class="card-date">12.04.2025</div>
                </div>
                <div class="card-content">
                    <h3 class="card-title"><< Borem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent >></h3>
                    <div class="card-content-text">
                              <p class="card-description">Qorem ipsum dolor sit</p>
                        <div class="card-metrics">
                            <span class="metric positive">+108</span>
                            <span class="metric views">213 <img src="/assets/news/fire.svg" alt="fire" /></span>
                        </div> 
                    </div>
                </div>
            </NuxtLink>

            <div class="right-cards">
                <NuxtLink to="/news-more" class="news-card small">
                    <div class="card-image">
                        <img src="/assets/news/news2.svg" alt="News 2" />
                        <div class="card-date">12.04.2025</div>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title"><< Et velit interdum, ac aliquet odio mattis. Class aptent >></h3>
                        <div class="card-content-text">
                              <p class="card-description">Qorem ipsum dolor sit</p>
                        <div class="card-metrics">
                            <span class="metric positive">+108</span>
                            <span class="metric views">213 <img src="/assets/news/fire.svg" alt="fire" /></span>
                        </div> 
                        </div>
                    </div>
                </NuxtLink>

                <!-- Bottom Right Card -->
                <NuxtLink to="/news-more" class="news-card small">
                    <div class="card-image">
                        <img src="/assets/news/news3.svg" alt="News 3" />
                        <div class="card-date">12.04.2025</div>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title"><< Et velit interdum, ac aliquet odio mattis. Class aptent >></h3>
                        <div class="card-content-text">
                              <p class="card-description">Qorem ipsum dolor sit</p>
                        <div class="card-metrics">
                            <span class="metric positive">+108</span>
                            <span class="metric views">213 <img src="/assets/news/fire.svg" alt="fire" /></span>
                        </div> 
                        </div>
                     
                    </div>
                </NuxtLink>
            </div>
        </div>

        <!-- Bottom News Cards -->
        <div class="bottom-news">
            <!-- First Bottom Card -->
            <div class="bottom-news-card">
                <div class="card-header">
                    <h4 class="card-header-title">Новый аркадный футсим в топе по онлайну. Там матчи 5 на 5 и вратари-гонялы</h4>
                    <span class="card-timestamp">15 минут назад</span>
                </div>
                <div class="card-main">
                    <div class="card-image">
                        <img src="/assets/news/news1.svg" alt="News 1" />
                        <div class="card-overlay">
                            <div class="card-text">
                                <p>Corem ipsum dolor sit amet, consectetur velit interdum adipiscing elit. Nunc vulpte libero et velit inedum, consectetur adipiscing ac consectetur velit interdum</p>
                            </div>
                            <NuxtLink to="/news-more" class="learn-more-btn">Узнать больше</NuxtLink>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Second Bottom Card -->
            <div class="bottom-news-card">
                <div class="card-header">
                    <h4 class="card-header-title">Новый аркадный футсим в топе по онлайну. Там матчи 5 на 5 и вратари-гонялы</h4>
                    <span class="card-timestamp">15 минут назад</span>
                </div>
                <div class="card-main">
                    <div class="card-image">
                        <img src="/assets/news/news2.svg" alt="News 2" />
                        <div class="card-overlay">
                            <div class="card-text">
                                <p>Corem ipsum dolor sit amet, consectetur velit interdum adipiscing elit. Nunc vulpte libero et velit consectetur adipiscing ac consectetur velit interdum</p>
                            </div>
                            <NuxtLink to="/news-more" class="learn-more-btn">Узнать больше</NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const activeCategory = ref(0)
const categories = ['BCE', 'CS 2', 'DOTA 2', 'VALARANT', 'MOBIEL LEGENDS']
const buttonRefs = ref([])
const buttonWidths = ref([])

const setActiveCategory = (index) => {
    activeCategory.value = index
    calculateButtonWidths()
}

const getSliderPosition = () => {
    if (buttonWidths.value.length === 0) return 0
    
    let position = 0
    const gap = window.innerWidth <= 768 ? 6 : 8 // отступ между кнопками (меньше на мобильных)
    
    for (let i = 0; i < activeCategory.value; i++) {
        position += (buttonWidths.value[i] || 120) + gap
    }
    return position
}

const getSliderWidth = () => {
    return buttonWidths.value[activeCategory.value] || 120
}

const calculateButtonWidths = async () => {
    await nextTick()
    buttonWidths.value = buttonRefs.value.map(button => button?.offsetWidth || 120)
}

onMounted(() => {
    calculateButtonWidths()
})
</script>

<style>
@import './news.css'
</style>