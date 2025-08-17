<template>
    <div class="tournaments">
        <div class="tournaments-switcher">
            <div class="switcher-container" :data-active="activeTab">
                <button 
                    class="switcher-item" 
                    @click="activeTab = 'active'"
                    :class="{ active: activeTab === 'active' }"
                >
                    Активные
                </button>
                <button 
                    class="switcher-item" 
                    @click="activeTab = 'past'"
                    :class="{ active: activeTab === 'past' }"
                >
                    Прошедшие
                </button>
                <button 
                    class="switcher-item" 
                    @click="activeTab = 'upcoming'"
                    :class="{ active: activeTab === 'upcoming' }"
                >
                    Ближайшие
                </button>
            </div>
        </div>
        
        <Turnirsnew />
        <div class="tournaments-wrapper">
            <div class="tournaments-wrapper-item">
                <div class="tournaments-wrapper-item-img">
                    <img src="@/assets/turnirs/tur1.png" alt="BALI MAJOR">
                </div>
                <div class="tournaments-wrapper-item-text">
                        <h2>BALI MAJOR</h2>
                        <p>CYBER OLAM</p>
                    <NuxtLink to="/tournaments-more">
                        Подробнее
                    </NuxtLink>
                </div>
            </div>
            <div class="tournaments-wrapper-item">
                <div class="tournaments-wrapper-item-img">
                    <img src="@/assets/turnirs/tur2.png" alt="BALI MAJOR">
                </div>
                <div class="tournaments-wrapper-item-text">
                        <h2>BALI MAJOR</h2>
                        <p>CYBER OLAM</p>
                    <NuxtLink to="/tournaments-more">
                        Подробнее
                    </NuxtLink>
                </div>
            </div>
            <div class="tournaments-wrapper-item">
                <div class="tournaments-wrapper-item-img">
                    <img src="@/assets/turnirs/tur3.png" alt="BALI MAJOR">
                </div>
                <div class="tournaments-wrapper-item-text">
                        <h2>BALI MAJOR</h2>
                        <p>CYBER OLAM</p>
                    <NuxtLink to="/tournaments-more">
                        Подробнее
                    </NuxtLink>
                </div>
            </div>
            <div class="tournaments-wrapper-item">
                <div class="tournaments-wrapper-item-img">
                    <img src="@/assets/turnirs/tur4.png" alt="BALI MAJOR">
                </div>
                <div class="tournaments-wrapper-item-text">
                        <h2>BALI MAJOR</h2>
                        <p>CYBER OLAM</p>
                    <NuxtLink to="/tournaments-more">
                        Подробнее
                    </NuxtLink>
                </div>
            </div>
            <div class="tournaments-wrapper-item">
                <div class="tournaments-wrapper-item-img">
                    <img src="@/assets/turnirs/tur1.png" alt="BALI MAJOR">
                </div>
                <div class="tournaments-wrapper-item-text">
                        <h2>BALI MAJOR</h2>
                        <p>CYBER OLAM</p>
                    <NuxtLink to="/tournaments-more">
                        Подробнее
                    </NuxtLink>
                </div>
            </div>
            <div class="tournaments-wrapper-item">
                <div class="tournaments-wrapper-item-img">
                    <img src="@/assets/turnirs/tur2.png" alt="BALI MAJOR">
                </div>
                <div class="tournaments-wrapper-item-text">
                        <h2>BALI MAJOR</h2>
                        <p>CYBER OLAM</p>
                    <NuxtLink to="/tournaments-more">
                        Подробнее
                    </NuxtLink>
                </div>
            </div>
            <div class="tournaments-wrapper-item">
                <div class="tournaments-wrapper-item-img">
                    <img src="@/assets/turnirs/tur4.png" alt="BALI MAJOR">
                </div>
                <div class="tournaments-wrapper-item-text">
                        <h2>BALI MAJOR</h2>
                        <p>CYBER OLAM</p>
                    <NuxtLink to="/tournaments-more">
                        Подробнее
                    </NuxtLink>
                </div>
            </div>
            <div class="tournaments-wrapper-item">
                <div class="tournaments-wrapper-item-img">
                    <img src="@/assets/turnirs/tur3.png" alt="BALI MAJOR">
                </div>
                <div class="tournaments-wrapper-item-text">
                        <h2>BALI MAJOR</h2>
                        <p>CYBER OLAM</p>
                    <NuxtLink to="/tournaments-more">
                        Подробнее
                    </NuxtLink>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script setup>
const activeTab = ref('active')
</script>

<style scoped>
@import './tournaments.css';
</style>