<template>
    <div class="faq-page">
      <h1 class="faq-title">Часто задаваемые вопросы ?</h1>
  
      <ul class="faq-list">
        <li
          v-for="(item, i) in faqs"
          :key="i"
          class="faq-item"
          :class="{ open: openIndex === i }"
        >
          <button
            class="faq-head"
            type="button"
            :aria-expanded="openIndex === i ? 'true' : 'false'"
            @click="toggle(i)"
            @keydown.enter.prevent="toggle(i)"
            @keydown.space.prevent="toggle(i)"
          >
            <span class="faq-q">{{ item.q }}</span>
            <span class="faq-sign" aria-hidden="true"></span>
          </button>
  
          <div class="faq-body" v-show="openIndex === i">
            <p v-html="item.a"></p>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const faqs = ref([
    {
      q: 'Как зарегистрировать на вашем сайте?',
      a: 'В правом верхнем углу нажимаете на кнопку «Войти» и регистрируетесь, заполняя все указанные данные.'
    },
    { q: 'Как смотреть трансляции турниров ?', a: 'Раздел «Трансляции» в меню — выбирайте турнир и нажимайте «Смотреть».' },
    { q: 'Как пополнить свой Steam аккаунт ?', a: 'Откройте кошелёк Steam и следуйте инструкции пополнения через доступные способы оплаты.' },
    { q: 'Как стать организатором ?', a: 'Подайте заявку на странице «Организатор» и дождитесь подтверждения.' },
    { q: 'Как создать команду ?', a: 'Перейдите в «Команды» → «Создать», заполните данные и пригласите участников.' },
    { q: 'Как вступить в турниры ?', a: 'Откройте «Турниры», выберите событие и нажмите «Участвовать», затем следуйте форме регистрации.' }
  ])
  
  const openIndex = ref(0)
  function toggle(i) {
    openIndex.value = openIndex.value === i ? -1 : i
  }
  </script>
  
  <style>
  @import './faq.css';
  </style>
  