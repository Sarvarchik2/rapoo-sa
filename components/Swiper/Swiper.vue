<template>
    <div class="swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide">
                <div class="slide-content">
                    <img src="@/assets/main/main-banner.png" alt="Slide 1" />
                </div>
            </div>
            <div class="swiper-slide">
                <div class="slide-content">
                    <img src="@/assets/main/main-banner.png" alt="Slide 1" />
                </div>
            </div>
            <div class="swiper-slide">
                <div class="slide-content">
                    <img src="@/assets/main/main-banner.png" alt="Slide 1" />
                </div>
            </div>
            <div class="swiper-slide">
                <div class="slide-content">
                    <img src="@/assets/main/main-banner.png" alt="Slide 1" />
                </div>
            </div>
        </div>
        
        <!-- Кнопки навигации -->
        <div class="swiper-button-next">
            <img src="@/assets/main/right.svg" alt="Slide 1" />

        </div>
        <div class="swiper-button-prev">
            <img src="@/assets/main/left.svg" alt="Slide 1" />

        </div>
        
        <!-- Пагинация -->
        <div class="swiper-pagination"></div>
    </div>
</template>

<script setup>
import Swiper from 'swiper'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

onMounted(() => {
    new Swiper('.swiper-container', {
        modules: [Navigation, Pagination],
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 1,
            },
            1024: {
                slidesPerView: 1,
            },
        }
    })
})
</script>

<style scoped>
.swiper-container {
    width: 100%;
    height: 100%;
    position: relative;
}

.swiper-slide {
    text-align: center;
    background: #fff;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}



.slide-content img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;


}

.slide-content h3 {
    color: #333;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
}

.slide-content p {
    color: #666;
    font-size: 14px;
    line-height: 1.4;
}

/* Кастомные стили для кнопок навигации */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
    background-color: #fff;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: all 0.3s ease;
}

:deep(.swiper-button-next::after),
:deep(.swiper-button-prev::after) {
    font-size: 16px;
    font-weight: bold;
    display: none;
}

:deep(.swiper-button-next img),
:deep(.swiper-button-prev img) {
    width: 70%;
    height: 70%;
    object-fit: cover;
}
/* Кастомные стили для пагинации */
:deep(.swiper-pagination-bullet) {
    background-color: #fff;
    opacity: 0.5;
    transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
    background-color: #008CFF;
    opacity: 1;
    transform: scale(1.2);
}

/* Адаптивность */

</style> 