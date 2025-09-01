<script setup>
const activeTab = ref('active')
const activeMatchTab = ref('past')
</script>

<template>
    <div class="tournaments-more">
        <NuxtLink class="tournaments-more-back" to="/tournaments">
            <img src="@/assets/footer/right.svg" alt="arrow-left">
            Назад
        </NuxtLink>

        <!-- Главная карточка турнира -->
        <div class="tournament-main-card">
            <div class="tournament-main-image">
                <img src="@/assets/news/news1.svg" alt="BALI MAJOR">
                <div class="tournament-main-overlay">
                    <div class="tournament-main-text">
                        <h1>BALI MAJOR</h1>
                        <h2>SHANGAI LAU ТУРНИР</h2>
                    </div>
                </div>
            </div>
        </div>

        <!-- Информационные блоки -->
        <div class="tournament-info-blocks">
            <div class="info-block">
                <div class="info-content">
                    <div class="info-text">
                        <h3>Дата проведения:</h3>
                        <p>05.07.2025 - 07.07.2025</p>
                    </div>
                    <div class="info-icon">
                        <img src="@/assets/icons/navbar/calendar.svg" alt="calendar">
                    </div>
                </div>
            </div>

            <div class="info-block">
                <div class="info-content">
                    <div class="info-text">
                        <h3>Призовой фонд:</h3>
                        <p>150.000$</p>
                    </div>
                    <div class="info-icon">
                        <img src="@/assets/icons/navbar/kubok.svg" alt="trophy">
                    </div>
                </div>
            </div>

            <div class="info-block">
                <div class="info-content">
                    <div class="info-text">
                        <h3>Место проведения:</h3>
                        <p>Узбекистан, Ташкент</p>
                    </div>
                    <div class="info-icon">
                        <img src="@/assets/icons/navbar/map.svg" alt="location">
                    </div>
                </div>
            </div>
        </div>

        <!-- Турнирная сетка -->
        <div class="main-title-wrap">
            <h2>Турнирная сетка</h2>
        </div>
        <Setka />
        <div class="main-title-wrap">
            <h2>Расписание</h2>
        </div>

        <!-- Расписание матчей -->
        <div class="matches-schedule">
            <!-- Табы -->
            <div class="matches-tabs" :data-active="activeMatchTab">
                <button class="tab-item active" @click="activeMatchTab = 'past'"
                    :class="{ active: activeMatchTab === 'past' }">
                    Прошедшие
                </button>
                <button class="tab-item" @click="activeMatchTab = 'current'"
                    :class="{ active: activeMatchTab === 'current' }">
                    Текущие
                </button>
                <button class="tab-item" @click="activeMatchTab = 'future'"
                    :class="{ active: activeMatchTab === 'future' }">
                    Будущие
                </button>
            </div>

            <!-- Список матчей -->
            <div class="matches-list">
                <NuxtLink to="/tournament" class="match-item">
                    <div class="match-date">24.04.25 в 22:00</div>
                    <div class="match-teams">
                        <div class="team">
                            <img src="@/assets/icons/navbar/map.svg" alt="Spirit">
                            <span>Spirit</span>
                        </div>
                        <div class="match-score">1:0</div>
                        <div class="team">
                            <img src="@/assets/icons/navbar/map.svg" alt="NAVI">
                            <span>NAVI</span>
                        </div>
                    </div>
                    <div class="match-type">Плей-офф</div>
                    <div class="match-arrow">
                        <img src="@/assets/footer/right.svg" alt="arrow">
                    </div>
                </NuxtLink>

                <div class="match-item">
                    <div class="match-date">24.04.25 в 22:00</div>
                    <div class="match-teams">
                        <div class="team">
                            <img src="@/assets/icons/navbar/map.svg" alt="Spirit">
                            <span>Spirit</span>
                        </div>
                        <div class="match-score">1:0</div>
                        <div class="team">
                            <img src="@/assets/icons/navbar/map.svg" alt="NAVI">
                            <span>NAVI</span>
                        </div>
                    </div>
                    <div class="match-type">Плей-офф</div>
                    <div class="match-arrow">
                        <img src="@/assets/footer/right.svg" alt="arrow">
                    </div>
                </div>

                <div class="match-item">
                    <div class="match-date">24.04.25 в 22:00</div>
                    <div class="match-teams">
                        <div class="team">
                            <img src="@/assets/icons/navbar/map.svg" alt="Spirit">
                            <span>Spirit</span>
                        </div>
                        <div class="match-score">1:0</div>
                        <div class="team">
                            <img src="@/assets/icons/navbar/map.svg" alt="NAVI">
                            <span>NAVI</span>
                        </div>
                    </div>
                    <div class="match-type">Плей-офф</div>
                    <div class="match-arrow">
                        <img src="@/assets/footer/right.svg" alt="arrow">
                    </div>
                </div>
            </div>
        </div>
        <div class="main-title-wrap">
            <h2>Участники</h2>
        </div>
        <div class="tournaments-teams">
            <div class="tournaments-teams-item">
                <img src="@/assets/main/arcreed.svg" alt="arcreed">
                <h2>Arcreed</h2>
            </div>
            <div class="tournaments-teams-item">
                <img src="@/assets/main/arcreed.svg" alt="arcreed">
                <h2>Arcreed</h2>
            </div>
            <div class="tournaments-teams-item">
                <img src="@/assets/main/arcreed.svg" alt="arcreed">
                <h2>Arcreed</h2>
            </div>
            <div class="tournaments-teams-item">
                <img src="@/assets/main/arcreed.svg" alt="arcreed">
                <h2>Arcreed</h2>
            </div>

            <div class="tournaments-teams-item">
                <img src="@/assets/main/arcreed.svg" alt="arcreed">
                <h2>Arcreed</h2>
            </div>
            <div class="tournaments-teams-item">
                <img src="@/assets/main/arcreed.svg" alt="arcreed">
                <h2>Arcreed</h2>
            </div>
            <div class="tournaments-teams-item">
                <img src="@/assets/main/arcreed.svg" alt="arcreed">
                <h2>Arcreed</h2>
            </div>
            <div class="tournaments-teams-item">
                <img src="@/assets/main/arcreed.svg" alt="arcreed">
                <h2>Arcreed</h2>
            </div>
            <div class="tournaments-teams-item">
                <img src="@/assets/main/arcreed.svg" alt="arcreed">
                <h2>Arcreed</h2>
            </div>

            <div class="tournaments-teams-item">
                <img src="@/assets/main/arcreed.svg" alt="arcreed">
                <h2>Arcreed</h2>
            </div>
        </div>
        <!-- Блок трансляции -->
        <div class="main-title-wrap">
            <h2>Трансляция</h2>
        </div>
        <div class="broadcast-block">
            <div class="broadcast-banner">
                <img class="broadcast-banner-img" src="/assets/news/news1.svg" alt="Трансляция" />
                <div class="broadcast-banner-overlay"></div>
                <button class="broadcast-main-btn">Перейти к трансляции</button>
            </div>
            <div class="broadcast-actions">
                <button class="broadcast-register-btn">Зарегистрироваться</button>
                <button class="broadcast-watch-btn">Смотреть трансляцию</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import './tournaments-more.css';
</style>