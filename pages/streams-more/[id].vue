<template>
    <div class="streams-more">
        <NuxtLink to="/streams" class="back-nav">
            <button class="back-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 10H5M5 10L10 15M5 10L10 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Назад
            </button>
        </NuxtLink>

        <div class="main-content">
           
            <div class="video-player">
                <div class="video-container">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        :src="embedSrc" 
                        title="Stream player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy="strict-origin-when-cross-origin" 
                        allowfullscreen
                    ></iframe>
                </div>
            </div>
            <!-- <div class="main-title-wrap"> -->
                <h2 class="streams-more-title">{{ stream?.title || 'Стрим' }}</h2>
            <!-- </div> -->
            <div class="stream-description">
                <p class="stream-text">
                    Jorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
                </p>
            </div>

            <div class="stream-tags">
                <span class="team-tag">NAVI, SPIRIT, FNATIC</span>
                <span class="game-tag">CS 2</span>
                <span class="language-tag">Русский</span>
            </div>

            <div class="streamer-info">
                <div class="streamer-avatar">
                    <img src="/assets/news/news1.svg" alt="Streamer Avatar" />
                </div>
                <div class="streamer-details">
                    <div class="streamer-name">
                        Deko
                        <div class="verified-badge">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 1L7.5 4.5L11 5L8 7.5L9 11L6 9L3 11L4 7.5L1 5L4.5 4.5L6 1Z" fill="white"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'

const route = useRoute()
const config = useRuntimeConfig()
const API_BASE = (config.public?.apiBase || '').toString()

const stream = ref(null)
const embedSrc = ref('')
const pending = ref(true)
const error = ref(null)

function extractYoutubeId(url) {
  try {
    const u = new URL(String(url))
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.split('/')[1] || null
    }
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.includes('/embed/')) return u.pathname.split('/embed/')[1] || null
      const v = u.searchParams.get('v')
      return v || null
    }
  } catch {}
  return null
}

function extractTwitchChannel(url) {
  try {
    const u = new URL(String(url))
    if (u.hostname.includes('twitch.tv')) {
      if (u.searchParams.get('channel')) return u.searchParams.get('channel')
      const parts = u.pathname.split('/').filter(Boolean)
      return parts[0] || null
    }
    if (u.hostname.includes('player.twitch.tv')) {
      const ch = u.searchParams.get('channel')
      return ch || null
    }
  } catch {}
  return null
}

function buildEmbedUrl(rawUrl) {
  const url = String(rawUrl || '')
  const yid = extractYoutubeId(url)
  if (yid) return `https://www.youtube.com/embed/${yid}?autoplay=1`
  const tch = extractTwitchChannel(url)
  if (tch) {
    const parent = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
    return `https://player.twitch.tv/?channel=${encodeURIComponent(tch)}&parent=${encodeURIComponent(parent)}&autoplay=true`
  }
  // fallback to provided embed url directly
  return url
}

async function fetchStream() {
  pending.value = true; error.value = null
  try {
    const idParam = route.params.id
    const id = Number(idParam)
    const url = `${API_BASE}/streaming/main/`
    const res = await $fetch(url)
    const categories = Array.isArray(res?.results) ? res.results : []
    const allStreams = categories.flatMap(c => Array.isArray(c?.category_streams) ? c.category_streams : [])
    const found = allStreams.find(s => Number(s?.id) === id) || null
    stream.value = found
    const playable = found?.hls_url || found?.rtmp_url || found?.embed_url || found?.url || ''
    embedSrc.value = buildEmbedUrl(playable)
  } catch (e) {
    error.value = e
  } finally {
    pending.value = false
  }
}

onMounted(() => { fetchStream() })
</script>

<style>

@import './streams-more.css';


</style>