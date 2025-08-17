<template>
    <div class="live">
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

        <div class="main-title-wrap">
          <h2>Турниры</h2>
        </div>

    <section class="main-live">
      <NuxtLink to="/streams-more" class="main-live-item">
        <div class="main-live-item-top">
          <img src="@/assets/live/cs.png" alt="live">
          <span>
            <img src="@/assets/live/play.svg" alt="live">
            ПРЯОМЙ ЭФИР
          </span>
          <span>
            2,5 тыс. зрителей
          </span>
        </div>
        <div class="main-live-item-bottom">
          <img src="@/assets/live/comand.svg" alt="live">
          <div class="main-live-item-bottom-text">
            <h3>Gorem ipsum dolor sit amet, consectetur adip odio mattis.</h3>
            <h4>Deko <img src="@/assets/live/verif.svg" alt="live"></h4>
            <h4>CS 2</h4>
            <span >
              Английский
            </span>
          </div>
          <button class="main-live-item-bottom-option">
            <img src="@/assets/live/option.svg" alt="live">
          </button>
        </div>
      </NuxtLink>
      <div class="main-live-item">
        <div class="main-live-item-top">
          <img src="@/assets/live/cs.png" alt="live">
          <span>
            <img src="@/assets/live/play.svg" alt="live">
            ПРЯОМЙ ЭФИР
          </span>
          <span>
            2,5 тыс. зрителей
          </span>
        </div>
        <div class="main-live-item-bottom">
          <img src="@/assets/live/comand.svg" alt="live">
          <div class="main-live-item-bottom-text">
            <h3>Gorem ipsum dolor sit amet, consectetur adip odio mattis.</h3>
            <h4>Deko <img src="@/assets/live/verif.svg" alt="live"></h4>
            <h4>CS 2</h4>
            <span >
              Английский
            </span>
          </div>
          <button class="main-live-item-bottom-option">
            <img src="@/assets/live/option.svg" alt="live">
          </button>
        </div>
      </div>
      <div class="main-live-item">
        <div class="main-live-item-top">
          <img src="@/assets/live/cs.png" alt="live">
          <span>
            <img src="@/assets/live/play.svg" alt="live">
            ПРЯОМЙ ЭФИР
          </span>
          <span>
            2,5 тыс. зрителей
          </span>
        </div>
        <div class="main-live-item-bottom">
          <img src="@/assets/live/comand.svg" alt="live">
          <div class="main-live-item-bottom-text">
            <h3>Gorem ipsum dolor sit amet, consectetur adip odio mattis.</h3>
            <h4>Deko <img src="@/assets/live/verif.svg" alt="live"></h4>
            <h4>CS 2</h4>
            <span >
              Английский
            </span>
          </div>
          <button class="main-live-item-bottom-option">
            <img src="@/assets/live/option.svg" alt="live">
          </button>
        </div>
      </div>
    </section>

    <div class="main-title-wrap">
      <h2>Активные каналы</h2>
    </div>

    <section class="main-live">
      <div class="main-live-item">
        <div class="main-live-item-top">
          <img src="@/assets/live/cs.png" alt="live">
          <span>
            <img src="@/assets/live/play.svg" alt="live">
            ПРЯОМЙ ЭФИР
          </span>
          <span>
            2,5 тыс. зрителей
          </span>
        </div>
        <div class="main-live-item-bottom">
          <img src="@/assets/live/comand.svg" alt="live">
          <div class="main-live-item-bottom-text">
            <h3>Gorem ipsum dolor sit amet, consectetur adip odio mattis.</h3>
            <h4>Deko <img src="@/assets/live/verif.svg" alt="live"></h4>
            <h4>CS 2</h4>
            <span >
              Английский
            </span>
          </div>
          <button class="main-live-item-bottom-option">
            <img src="@/assets/live/option.svg" alt="live">
          </button>
        </div>
      </div>
      <div class="main-live-item">
        <div class="main-live-item-top">
          <img src="@/assets/live/cs.png" alt="live">
          <span>
            <img src="@/assets/live/play.svg" alt="live">
            ПРЯОМЙ ЭФИР
          </span>
          <span>
            2,5 тыс. зрителей
          </span>
        </div>
        <div class="main-live-item-bottom">
          <img src="@/assets/live/comand.svg" alt="live">
          <div class="main-live-item-bottom-text">
            <h3>Gorem ipsum dolor sit amet, consectetur adip odio mattis.</h3>
            <h4>Deko <img src="@/assets/live/verif.svg" alt="live"></h4>
            <h4>CS 2</h4>
            <span >
              Английский
            </span>
          </div>
          <button class="main-live-item-bottom-option">
            <img src="@/assets/live/option.svg" alt="live">
          </button>
        </div>
      </div>
      <div class="main-live-item">
        <div class="main-live-item-top">
          <img src="@/assets/live/cs.png" alt="live">
          <span>
            <img src="@/assets/live/play.svg" alt="live">
            ПРЯОМЙ ЭФИР
          </span>
          <span>
            2,5 тыс. зрителей
          </span>
        </div>
        <div class="main-live-item-bottom">
          <img src="@/assets/live/comand.svg" alt="live">
          <div class="main-live-item-bottom-text">
            <h3>Gorem ipsum dolor sit amet, consectetur adip odio mattis.</h3>
            <h4>Deko <img src="@/assets/live/verif.svg" alt="live"></h4>
            <h4>CS 2</h4>
            <span >
              Английский
            </span>
          </div>
          <button class="main-live-item-bottom-option">
            <img src="@/assets/live/option.svg" alt="live">
          </button>
        </div>
      </div>
    </section>

    <div class="main-title-wrap">
      <h2>Сетевые шутеры</h2>
    </div>

    <section class="main-live">
      <div class="main-live-item">
        <div class="main-live-item-top">
          <img src="@/assets/live/cs.png" alt="live">
          <span>
            <img src="@/assets/live/play.svg" alt="live">
            ПРЯОМЙ ЭФИР
          </span>
          <span>
            2,5 тыс. зрителей
          </span>
        </div>
        <div class="main-live-item-bottom">
          <img src="@/assets/live/comand.svg" alt="live">
          <div class="main-live-item-bottom-text">
            <h3>Gorem ipsum dolor sit amet, consectetur adip odio mattis.</h3>
            <h4>Deko <img src="@/assets/live/verif.svg" alt="live"></h4>
            <h4>CS 2</h4>
            <span >
              Английский
            </span>
          </div>
          <button class="main-live-item-bottom-option">
            <img src="@/assets/live/option.svg" alt="live">
          </button>
        </div>
      </div>
      <div class="main-live-item">
        <div class="main-live-item-top">
          <img src="@/assets/live/cs.png" alt="live">
          <span>
            <img src="@/assets/live/play.svg" alt="live">
            ПРЯОМЙ ЭФИР
          </span>
          <span>
            2,5 тыс. зрителей
          </span>
        </div>
        <div class="main-live-item-bottom">
          <img src="@/assets/live/comand.svg" alt="live">
          <div class="main-live-item-bottom-text">
            <h3>Gorem ipsum dolor sit amet, consectetur adip odio mattis.</h3>
            <h4>Deko <img src="@/assets/live/verif.svg" alt="live"></h4>
            <h4>CS 2</h4>
            <span >
              Английский
            </span>
          </div>
          <button class="main-live-item-bottom-option">
            <img src="@/assets/live/option.svg" alt="live">
          </button>
        </div>
      </div>
      <div class="main-live-item">
        <div class="main-live-item-top">
          <img src="@/assets/live/cs.png" alt="live">
          <span>
            <img src="@/assets/live/play.svg" alt="live">
            ПРЯОМЙ ЭФИР
          </span>
          <span>
            2,5 тыс. зрителей
          </span>
        </div>
        <div class="main-live-item-bottom">
          <img src="@/assets/live/comand.svg" alt="live">
          <div class="main-live-item-bottom-text">
            <h3>Gorem ipsum dolor sit amet, consectetur adip odio mattis.</h3>
            <h4>Deko <img src="@/assets/live/verif.svg" alt="live"></h4>
            <h4>CS 2</h4>
            <span >
              Английский
            </span>
          </div>
          <button class="main-live-item-bottom-option">
            <img src="@/assets/live/option.svg" alt="live">
          </button>
        </div>
      </div>
    </section>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const activeCategory = ref(0)
const categories = ['CS 2', 'DOTA 2', 'VALARANT', 'MOBIEL LEGENDS']
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
@import './index.css';
@import './streams.css';
</style>