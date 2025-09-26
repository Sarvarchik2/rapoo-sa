<template>
    <div class="turnirs-preview">
        <NuxtLink class="tournaments-more-back" to="/tournaments">
            <img src="@/assets/footer/right.svg" alt="arrow-left">
            Назад
        </NuxtLink>
        <div v-if="loading" class="loading">Загрузка...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="!matchData" class="error">Матч не найден</div>
        <template v-else>
            <div class="match-container">
                <h1 class="match-title">{{ teamName(matchData.team1) }} VS {{ teamName(matchData.team2) }}</h1>
                
                <div class="match-info">
                    <h2>{{ tournamentName }}</h2>
                </div>

                <div class="team-wrapper">
                     <div class="team team-left">
                    <div class="team-logo navi-logo">
                        <img :src="teamLogo(matchData.team1)" :alt="teamName(matchData.team1)">
                    </div>
                    <h5>{{ teamName(matchData.team1) }}</h5>
                </div>
                <h3>{{ matchData.team1_score || 0 }} : {{ matchData.team2_score || 0 }}</h3>
                
                <div class="team team-right">
                    <div class="team-logo faze-logo">
                        <img :src="teamLogo(matchData.team2)" :alt="teamName(matchData.team2)">
                    </div>
                    <h5>{{ teamName(matchData.team2) }}</h5>
                </div> 
                </div>

                <div class="match-info-bottom">
                    <h3 class="stage">{{ matchData.round_name || 'Раунд' }}</h3>
                    <h4 class="date-time">{{ formatDate(matchData.scheduled_time) }}</h4>
                </div>
              
            </div>
        <section class="main-interest">
      <h2>Статистика матча</h2>
    
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

    <section class="turnisrview-team">
        <h2>Ироки</h2>
        <div class="turnisrview-team-wrapper">
            <h3><img src="@/assets/main/arcreed.svg" alt="arcreed"> TEAM NATUS VINCERE</h3>
            <div class="turnisrview-team-content">
                <div class="turnisrview-team-item">
                    <img src="@/assets/main/member.svg" alt="member">
                    <div class="turnisrview-team-item-text">
                        <span><img src="@/assets/main/flag.svg" alt="flag">b1t</span>
                        <h4>Valeriy Vakovskiy</h4>
                        <h5>22 years</h5>
                    </div>
                </div>
                <div class="turnisrview-team-item">
                    <img src="@/assets/main/member.svg" alt="member">
                    <div class="turnisrview-team-item-text">
                        <span><img src="@/assets/main/flag.svg" alt="flag">b1t</span>
                        <h4>Valeriy Vakovskiy</h4>
                        <h5>22 years</h5>
                    </div>
                </div>
                <div class="turnisrview-team-item">
                    <img src="@/assets/main/member.svg" alt="member">
                    <div class="turnisrview-team-item-text">
                        <span><img src="@/assets/main/flag.svg" alt="flag">b1t</span>
                        <h4>Valeriy Vakovskiy</h4>
                        <h5>22 years</h5>
                    </div>
                </div>
                <div class="turnisrview-team-item">
                    <img src="@/assets/main/member.svg" alt="member">
                    <div class="turnisrview-team-item-text">
                        <span><img src="@/assets/main/flag.svg" alt="flag">b1t</span>
                        <h4>Valeriy Vakovskiy</h4>
                        <h5>22 years</h5>
                    </div>
                </div>
                <div class="turnisrview-team-item">
                    <img src="@/assets/main/member.svg" alt="member">
                    <div class="turnisrview-team-item-text">
                        <span><img src="@/assets/main/flag.svg" alt="flag">b1t</span>
                        <h4>Valeriy Vakovskiy</h4>
                        <h5>22 years</h5>
                    </div>
                </div>
            </div>
        </div>
        <div class="turnisrview-team-wrapper">
            <h3><img src="@/assets/main/arcreed.svg" alt="arcreed"> TEAM NATUS VINCERE</h3>
            <div class="turnisrview-team-content">
                <div class="turnisrview-team-item">
                    <img src="@/assets/main/member.svg" alt="member">
                    <div class="turnisrview-team-item-text">
                        <span><img src="@/assets/main/flag.svg" alt="flag">b1t</span>
                        <h4>Valeriy Vakovskiy</h4>
                        <h5>22 years</h5>
                    </div>
                </div>
                <div class="turnisrview-team-item">
                    <img src="@/assets/main/member.svg" alt="member">
                    <div class="turnisrview-team-item-text">
                        <span><img src="@/assets/main/flag.svg" alt="flag">b1t</span>
                        <h4>Valeriy Vakovskiy</h4>
                        <h5>22 years</h5>
                    </div>
                </div>
                <div class="turnisrview-team-item">
                    <img src="@/assets/main/member.svg" alt="member">
                    <div class="turnisrview-team-item-text">
                        <span><img src="@/assets/main/flag.svg" alt="flag">b1t</span>
                        <h4>Valeriy Vakovskiy</h4>
                        <h5>22 years</h5>
                    </div>
                </div>
                <div class="turnisrview-team-item">
                    <img src="@/assets/main/member.svg" alt="member">
                    <div class="turnisrview-team-item-text">
                        <span><img src="@/assets/main/flag.svg" alt="flag">b1t</span>
                        <h4>Valeriy Vakovskiy</h4>
                        <h5>22 years</h5>
                    </div>
                </div>
                <div class="turnisrview-team-item">
                    <img src="@/assets/main/member.svg" alt="member">
                    <div class="turnisrview-team-item-text">
                        <span><img src="@/assets/main/flag.svg" alt="flag">b1t</span>
                        <h4>Valeriy Vakovskiy</h4>
                        <h5>22 years</h5>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="turnisrview-viedo">
        <h2>Видеозапись матча</h2>
        <iframe v-if="matchData.stream_url" :src="matchData.stream_url" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        <div v-else class="no-video">Видеозапись недоступна</div>
    </section>
        </template>
    </div>
</template>

<style>
@import './match.css';
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from '#imports'

const route = useRoute()
const { $api } = useNuxtApp()

const matchData = ref(null)
const tournamentName = ref('')
const loading = ref(true)
const error = ref('')

const fetchMatchData = async () => {
  try {
    loading.value = true
    const matchId = route.params.id
    // Use the correct API endpoint for match details
    const response = await $api(`/tournaments/page/${matchId}/match/`)
    matchData.value = response
    tournamentName.value = response.tournament?.name || 'Турнир'
  } catch (err) {
    error.value = 'Не удалось загрузить данные матча'
    console.error('Error fetching match data:', err)
  } finally {
    loading.value = false
  }
}

const teamName = (team) => {
  return team?.name || 'Команда'
}

const teamLogo = (team) => {
  if (!team) return '/assets/main/cslogo.svg'
  if (team.logo_url) return team.logo_url
  return '/assets/main/cslogo.svg'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Дата не указана'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchMatchData()
})
</script>