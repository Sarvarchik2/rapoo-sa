<template>
    <div class="news-more">
      <NuxtLink to="/news" class="back-nav">
        <button class="back-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 10H5M5 10L10 15M5 10L10 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Назад
        </button>
      </NuxtLink>
  
      <div v-if="pending" class="state">Загрузка…</div>
      <div v-else-if="error" class="state error">Ошибка: {{ errorText }}</div>
  
      <div v-else-if="article" class="main-content">
        <div class="featured-media">
          <img :src="article.banner || '/assets/news/news1.svg'" :alt="title" />
          <div class="view-count" v-if="article.view_count != null">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4C6.5 4 3.5 6.5 2 10C3.5 13.5 6.5 16 10 16C13.5 16 16.5 13.5 18 10C16.5 6.5 13.5 4 10 4Z" stroke="white" stroke-width="1.5"/>
              <path d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z" stroke="white" stroke-width="1.5"/>
            </svg>
            <span>{{ formatNumber(article.view_count) }}</span>
          </div>
        </div>
  
        <div class="article-header">
          <h1 class="article-title">{{ title }}</h1>
          <div class="article-meta">
            <span class="article-date">{{ formattedDate }}</span>
            <span v-if="article.game?.title" class="article-game">• {{ article.game.title }}</span>
            <span v-if="article.author_name" class="article-author">• {{ article.author_name }}</span>
          </div>
        </div>
  
        <div class="tags" v-if="tags.length">
          <span v-for="t in tags" :key="t" class="tag">#{{ t }}</span>
        </div>
  
        <div class="article-content" v-html="renderBody"></div>
  
        <div class="source" v-if="article.source_name || article.source_url">
          <span>Источник:</span>
          <a v-if="article.source_url" :href="article.source_url" target="_blank" rel="noopener">
            {{ article.source_name || article.source_url }}
          </a>
          <span v-else>{{ article.source_name }}</span>
        </div>
      </div>
  
      <div v-else class="state">Не найдено</div>
    </div>
  </template>
  
  <script setup>
  import { computed, watch } from 'vue'
  
  const route = useRoute()
  const { $api } = useNuxtApp()
  
  // грузим статью
  const { data, pending, error } = await useAsyncData(
    () => `news-article-${route.params.id}`,
    () => $api(`/articles/${route.params.id}/`)
  )
  
  // логи
  if (process.client) {
    watch(data, v => { if (v) console.log('[article] response', v) }, { immediate: true })
    watch(error, e => { if (e) console.error('[article] error', e) }, { immediate: true })
  }
  
  const article = computed(() => data.value || null)
  const title = computed(() => article.value?.meta_title || article.value?.title || 'Без заголовка')
  const formattedDate = computed(() => {
    const iso = article.value?.publish_date
    return iso ? new Date(iso).toLocaleDateString('ru-RU') : ''
  })
  const tags = computed(() => (Array.isArray(article.value?.tags) ? article.value.tags : []))
  
  function decodeEntities (s) {
    if (!s || typeof s !== 'string') return ''
    return s
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
  }
  const renderBody = computed(() => decodeEntities(article.value?.body || ''))
  
  function formatNumber(n) {
    try { return new Intl.NumberFormat('ru-RU').format(n ?? 0) } catch { return String(n ?? 0) }
  }
  
  const errorText = computed(() => (error.value?.statusMessage || error.value?.message || 'Не удалось загрузить'))
  
  useHead(() => ({
    title: title.value,
    meta: [
      { name: 'description', content: article.value?.meta_description || '' },
      { name: 'keywords', content: article.value?.meta_keywords || '' }
    ]
  }))
  </script>
  
  <style>
  @import './news-more.css';
  .state { text-align: center; margin: 20px 0; opacity: 0.8; }
  .state.error { color: #e11d48; }
  .tags { display:flex; flex-wrap:wrap; gap:8px; margin:12px 0; }
  .tag { background:#f3f4f6; border-radius:999px; padding:4px 10px; font-size:12px; }
  .article-meta { color:#6b7280; margin-top:6px; display:flex; gap:8px; flex-wrap:wrap; }
  .source { margin-top:16px; color:#6b7280; }
  .source a { color:#2563eb; }
  </style>
  