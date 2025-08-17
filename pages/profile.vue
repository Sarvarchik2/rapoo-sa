<template>
  <div class="profile-page">
    <!-- User Profile Card -->
    <div class="profile-user-card">
      <div class="profile-user-avatar">
        <img src="@/assets/icons/navbar/user.svg" alt="User Avatar" />
      </div>
      <div class="profile-user-info">
        <h2 class="profile-user-name">Asad Jorabaev</h2>
        <p class="profile-user-username">@jordan_24</p>
        <p class="profile-user-date">Дата регистрации: 03.09.2025</p>
      </div>
      <button class="profile-user-edit">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M11.7167 7.51667L12.4833 8.28333L4.93333 15.8333H4.16667V15.0667L11.7167 7.51667ZM14.7167 2.5C14.5083 2.5 14.2917 2.58333 14.1333 2.74167L12.6083 4.26667L15.7333 7.39167L17.2583 5.86667C17.5833 5.54167 17.5833 5.01667 17.2583 4.69167L15.3083 2.74167C15.1417 2.575 14.9333 2.5 14.7167 2.5ZM11.7167 5.15833L2.5 14.375V17.5H5.625L14.8417 8.28333L11.7167 5.15833Z" fill="white"/>
        </svg>
        Изменить
      </button>
    </div>

    <!-- Content Sections -->
    <div class="profile-sections">
      <!-- Personal Data Section -->
      <div class="profile-section profile-personal-data">
        <h3 class="profile-section-title">Личные данные</h3>
      </div>

      <!-- Team Section -->
      <div class="profile-section profile-team">
        <h3 class="profile-section-title">Команда</h3>
        <NuxtLink to="/create-team" class="profile-team-create">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="#4285F4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Создать команду</span>
        </NuxtLink>
      </div>

      <!-- Achievements Section -->
      <div class="profile-section profile-achievements">
        <h3 class="profile-section-title">Достижения</h3>
        <div class="profile-achievements-list">
          <div class="profile-achievement-item">
            <div class="place-badge first">
                        <img src="@/assets/main/kubokwhite.svg" alt="Trophy" />
                        <span>1st</span>
                    </div>
            <div class="profile-achievement-logo">
                <img class="profile-achievement-logo-bg" src="@/assets/logo-team.svg" alt="Trophy" />

            </div>
            <div class="profile-achievement-text">
              <span class="profile-achievement-team">Vitality</span>
              <span class="profile-achievement-tournament">BLAST.tv Austin Major 2025</span>
            </div>
          </div>

          <div class="profile-achievement-item">
            <div class="place-badge first">
                        <img src="@/assets/main/kubokwhite.svg" alt="Trophy" />
                        <span>1st</span>
                    </div>
            <div class="profile-achievement-logo">
              <img class="profile-achievement-logo-bg" src="@/assets/logo-team.svg" alt="Trophy" />
            </div>
            <div class="profile-achievement-text">
              <span class="profile-achievement-team">Vitality</span>
              <span class="profile-achievement-tournament">BLAST.tv Austin Major 2025</span>
            </div>
          </div>
        </div>
      </div>

   
    </div>
       <!-- players card -->
       <div class="players-section">
        <h2 class="section-title">Моя команда</h2>
        <div class="players-grid">
          <!-- Player Card 1 -->
          <div class="player-card">
            <div class="player-menu" @click.stop="togglePlayerMenu(1)">
              <img src="@/assets/icons/more.svg" alt="player more">

              <!-- Dropdown Menu -->
              <div class="player-dropdown" v-if="activePlayerMenu === 1">
                <div class="dropdown-item delete">Удалить</div>
              </div>
            </div>
            <div class="player-avatar">
              <img src="@/assets/icons/navbar/user.svg" alt="Player Avatar" />
            </div>
            <div class="player-info">
              <span class="player-username">Evelon_09</span>
              <div class="player-badges">
                <div class="badge verified">
                  <img src="@/assets/icons/status.svg" alt="status">

                </div>
                <div class="badge status">
                  <img src="@/assets/main/flag.svg" alt="status">
                </div>
              </div>
            </div>
            <div class="player-stats">
              <div class="stat-pill">
                <div class="stat-circle">
                  <svg class="stat-progress" width="24" height="24" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="#e0e0e0" stroke-width="2" fill="none" />
                    <circle cx="12" cy="12" r="10" stroke="#FF9800" stroke-width="2" fill="none" stroke-dasharray="47.1"
                      stroke-dashoffset="11.8" transform="rotate(-90 12 12)" />
                  </svg>
                  <span class="stat-number">7</span>
                </div>
                <span class="stat-value">1,440</span>
              </div>
            </div>
          </div>

          <!-- Player Card 2 -->
          <div class="player-card">
            <div class="player-menu" @click.stop="togglePlayerMenu(2)">
              <img src="@/assets/icons/more.svg" alt="player more">
              <!-- Dropdown Menu -->
              <div class="player-dropdown" v-if="activePlayerMenu === 2">
                <div class="dropdown-item delete">Удалить</div>
              </div>
            </div>
            <div class="player-avatar">
              <img src="@/assets/icons/navbar/user.svg" alt="Player Avatar" />
            </div>
            <div class="player-info">
              <span class="player-username">Evelon_09</span>
              <div class="player-badges">
                <div class="badge verified">
                  <img src="@/assets/icons/status.svg" alt="status">

                </div>
                <div class="badge status">
                  <img src="@/assets/main/flag.svg" alt="status">

                </div>
              </div>
            </div>
            <div class="player-stats">
              <div class="stat-pill">
                <div class="stat-circle">
                  <svg class="stat-progress" width="24" height="24" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="#e0e0e0" stroke-width="2" fill="none" />
                    <circle cx="12" cy="12" r="10" stroke="#FF9800" stroke-width="2" fill="none" stroke-dasharray="47.1"
                      stroke-dashoffset="11.8" transform="rotate(-90 12 12)" />
                  </svg>
                  <span class="stat-number">7</span>
                </div>
                <span class="stat-value">1,440</span>
              </div>
            </div>
          </div>

          <!-- Player Card 3 -->
          <div class="player-card">
            <div class="player-menu" @click.stop="togglePlayerMenu(3)">
              <img src="@/assets/icons/more.svg" alt="player more">

              <!-- Dropdown Menu -->
              <div class="player-dropdown" v-if="activePlayerMenu === 3">
                <div class="dropdown-item delete">Удалить</div>
              </div>
            </div>
            <div class="player-avatar">
              <img src="@/assets/icons/navbar/user.svg" alt="Player Avatar" />
            </div>
            <div class="player-info">
              <span class="player-username">Evelon_09</span>
              <div class="player-badges">
                <div class="badge verified">
                  <img src="@/assets/icons/status.svg" alt="status">

                </div>
                <div class="badge status">
                  <img src="@/assets/main/flag.svg" alt="status">

                </div>
              </div>
            </div>
            <div class="player-stats">
              <div class="stat-pill">
                <div class="stat-circle">
                  <svg class="stat-progress" width="24" height="24" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="#e0e0e0" stroke-width="2" fill="none" />
                    <circle cx="12" cy="12" r="10" stroke="#FF9800" stroke-width="2" fill="none" stroke-dasharray="47.1"
                      stroke-dashoffset="11.8" transform="rotate(-90 12 12)" />
                  </svg>
                  <span class="stat-number">7</span>
                </div>
                <span class="stat-value">1,440</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      <section class="main-interest">
      <h2>Интересные матчи</h2>
      <div class="main-interest-wrapper">
        <div class="main-interest-item">
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
        <div class="main-interest-item">
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
        <div class="main-interest-item">
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
    <section class="main-interest">
      <h2>Текущий матч</h2>
    </section>
    <div class="match-container profile-match">
            <h1 class="match-title">NAVI VS FAZE</h1>
            
            <div class="match-info">
                <h2 >SHANGAI LAU 2025</h2>
            </div>

            <div class="team-wrapper">
                 <div class="team team-left">
                <div class="team-logo navi-logo">
                    <img src="@/assets/main/arcreed.svg" alt="arcreed">
                </div>
                <h5>ARCREED</h5>
            </div>
            <h3 >2 : 1</h3>
            
            <div class="team team-right">
                <div class="team-logo faze-logo">
                    <img src="@/assets/main/virtus.svg" alt="virtus">
                </div>
                <h5>VIRTUS</h5>
            </div> 
            </div>

            <div class="match-info-bottom">
                <h3 class="stage">Плей-офф</h3>
                <h4 class="date-time">24.04.25 в 22:00</h4>
            </div>
          
        </div>
  </div>
</template>

<script>
import { ref } from 'vue'

const activePlayerMenu = ref(null)
const togglePlayerMenu = (playerId) => {
  if (activePlayerMenu.value === playerId) {
    activePlayerMenu.value = null
  } else {
    activePlayerMenu.value = playerId
  }
}
</script>

<style>
@import './profile.css';
@import './tournament.css';

</style>