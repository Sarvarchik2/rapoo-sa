<template>
    <div class="notifications">
      <!-- ССЫЛКУ НЕ ВЕРСТАЮ — оставляю как есть -->
      <NuxtLink to="/rate" class="back-nav">
        <button class="back-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 10H5M5 10L10 15M5 10L10 5" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Назад
        </button>
      </NuxtLink>
  
      <h1 class="ntf-title">Уведомления</h1>
  
      <div class="notifications-wrapper">
        <!-- ---- Игроки ---- -->
        <h2 class="ntf-section">Игроки</h2>
  
        <div class="notif-card">
          <div class="notif-left">
            <img class="notif-avatar" src="@/assets/icons/navbar/user.svg" alt="Evelon_09" />
            <div class="notif-id">
              <div class="notif-name">
                Evelon_09
                <svg class="badge-check" viewBox="0 0 24 24" aria-label="verified">
                  <path d="M12 2l2.2 2.1 3-.4 1.1 2.8 2.8 1.1-.4 3L22 12l-1.3 2.4.4 3-2.8 1.1-1.1 2.8-3-.4L12 22l-2.2-2.1-3 .4-1.1-2.8-2.8-1.1.4-3L2 12l1.3-2.4-.4-3 2.8-1.1 1.1-2.8 3 .4L12 2zM10.2 14.6l5.2-5.2-1.4-1.4-3.8 3.8-1.4-1.4-1.4 1.4 2.8 2.8z"/>
                </svg>
                <span class="badge-flag" title="Uzbekistan">🇺🇿</span>
              </div>
            </div>
          </div>
  
          <div class="notif-msg">
            Приглашение в команду <b>NATUS VIRENCE</b>
          </div>
  
          <div class="notif-right">
            <div class="notif-actions">
              <button class="btn btn-accept">Принять</button>
              <button class="btn btn-decline">Отклонить</button>
            </div>
            <time class="notif-time">11:30</time>
          </div>
        </div>
  
        <!-- ---- Организации ---- -->
        <h2 class="ntf-section">Организации</h2>
  
        <div class="notif-card">
          <div class="notif-left">
            <img class="notif-avatar" src="@/assets/icons/navbar/user.svg" alt="Evelon_09" />
            <div class="notif-id">
              <div class="notif-name">
                Evelon_09
                <svg class="badge-check" viewBox="0 0 24 24" aria-label="verified">
                  <path d="M12 2l2.2 2.1 3-.4 1.1 2.8 2.8 1.1-.4 3L22 12l-1.3 2.4.4 3-2.8 1.1-1.1 2.8-3-.4L12 22l-2.2-2.1-3 .4-1.1-2.8-2.8-1.1.4-3L2 12l1.3-2.4-.4-3 2.8-1.1 1.1-2.8 3 .4L12 2zM10.2 14.6l5.2-5.2-1.4-1.4-3.8 3.8-1.4-1.4-1.4 1.4 2.8 2.8z"/>
                </svg>
                <span class="badge-flag" title="Uzbekistan">🇺🇿</span>
              </div>
            </div>
          </div>
  
          <div class="notif-msg">
            Приглашение в турнир <b>BALi Major 2025 Ganglou</b>
          </div>
  
          <div class="notif-right">
            <div class="notif-actions">
              <button class="btn btn-accept">Принять</button>
              <button class="btn btn-decline">Отклонить</button>
            </div>
            <time class="notif-time">11:30</time>
          </div>
        </div>
  
        <div class="notif-card">
          <div class="notif-left">
            <img class="notif-avatar" src="@/assets/icons/navbar/user.svg" alt="Evelon_09" />
            <div class="notif-id">
              <div class="notif-name">
                Evelon_09
                <svg class="badge-check" viewBox="0 0 24 24" aria-label="verified">
                  <path d="M12 2l2.2 2.1 3-.4 1.1 2.8 2.8 1.1-.4 3L22 12l-1.3 2.4.4 3-2.8 1.1-1.1 2.8-3-.4L12 22l-2.2-2.1-3 .4-1.1-2.8-2.8-1.1.4-3L2 12l1.3-2.4-.4-3 2.8-1.1 1.1-2.8 3 .4L12 2zM10.2 14.6l5.2-5.2-1.4-1.4-3.8 3.8-1.4-1.4-1.4 1.4 2.8 2.8z"/>
                </svg>
                <span class="badge-flag" title="Uzbekistan">🇺🇿</span>
              </div>
            </div>
          </div>
  
          <div class="notif-msg">
            Вы исключены с турнира по причине <b>«Подозрение в читах»</b>
          </div>
  
          <div class="notif-right">
            
            <time class="notif-time">11:30</time>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style>
  @import './notifications.css';
  @import './rate-team.css';
  
  /* ======= Палитра/база ======= */

  </style>
  