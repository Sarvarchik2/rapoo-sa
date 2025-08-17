<template>
    <div class="news-more">
        <!-- Back Navigation -->
        <NuxtLink to="/news" class="back-nav">
            <button class="back-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 10H5M5 10L10 15M5 10L10 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Назад
            </button>
        </NuxtLink>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Featured Image/Video -->
            <div class="featured-media">
                <img src="/assets/news/news1.svg" alt="Featured News" />
                <div class="view-count">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 4C6.5 4 3.5 6.5 2 10C3.5 13.5 6.5 16 10 16C13.5 16 16.5 13.5 18 10C16.5 6.5 13.5 4 10 4Z" stroke="white" stroke-width="1.5"/>
                        <path d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z" stroke="white" stroke-width="1.5"/>
                    </svg>
                    <span>1.087.345</span>
                </div>
            </div>

            <!-- Article Header -->
            <div class="article-header">
                <h1 class="article-title">
                    ТУРНИР МЕЖДУ ЛУЧШИМИ КОМАНДАМИ МИРА ПО КС 2, СМОТРИ И СЛЕДИ BALI MAJOR 2025 ГОДА SHANGAI
                </h1>
                <div class="article-date">12.04.2025</div>
            </div>

            <!-- Article Content -->
            <div class="article-content">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
                <p>
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
// Component logic can be added here
</script>

<style>
@import './news-more.css'
</style>