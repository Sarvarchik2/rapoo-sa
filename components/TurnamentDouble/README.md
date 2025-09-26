# TurnamentDouble Component

Double Elimination Tournament Bracket Component для Nuxt 3

## Использование

### Базовое использование
```vue
<template>
  <TurnamentDouble />
</template>
```

### С API endpoint
```vue
<template>
  <TurnamentDouble :endpoint="`/api/v1/tournaments/${tournamentId}/bracket/`" />
</template>
```

### С ID турнира
```vue
<template>
  <TurnamentDouble :tournament-id="14" />
</template>
```

### С готовыми данными
```vue
<template>
  <TurnamentDouble :data="bracketData" />
</template>

<script setup>
const bracketData = {
  winnersRounds: [
    [
      { team1: { name: 'Team A' }, team2: { name: 'Team B' }, team1_score: 2, team2_score: 0 }
    ]
  ],
  losersRounds: [
    [
      { team1: { name: 'Team C' }, team2: { name: 'Team B' }, team1_score: 2, team2_score: 1 }
    ]
  ],
  grandFinal: { team1: { name: 'Team A' }, team2: { name: 'Team C' }, team1_score: 2, team2_score: 1 }
}
</script>
```

## Props

- `data` (Object) - Готовые данные турнира
- `tournamentId` (String|Number) - ID турнира для автоматической загрузки
- `endpoint` (String) - Кастомный API endpoint

## Поддерживаемые форматы API

### Формат 1: Объект с раундами по именам
```json
{
  "data": {
    "bracket": {
      "rounds": {
        "WB Semi Final": [
          {
            "team1": { "name": "Team A" },
            "team2": { "name": "Team B" },
            "team1_score": 2,
            "team2_score": 0,
            "winner": "Team A"
          }
        ],
        "LB Semi Final": [
          {
            "team1": { "name": "Team C" },
            "team2": { "name": "Team D" }
          }
        ],
        "Grand Final": [
          {
            "team1": { "name": "Team A" },
            "team2": { "name": "Team C" }
          }
        ]
      }
    },
    "tournament": {
      "winner": { "name": "Team A" }
    }
  }
}
```

## Особенности

- **Zoom контролы**: Масштабирование от 0.3x до 1.5x
- **Responsive design**: Адаптируется под мобильные устройства
- **Winner highlighting**: Подсветка победителей в каждом матче
- **Score display**: Отображение счета матчей
- **API integration**: Автоматическая загрузка с API
- **Две жизни чемпиона WB (reset)**: Поддержка Grand Final Reset. Если победитель верхней сетки проигрывает первый Grand Final — автоматически отображается второй матч (Reset) и именно он определяет чемпиона.

## Стилизация

Компонент использует scoped стили с поддержкой темной темы. Основные цвета:
- Основной: #6bb6ff
- Winners Bracket: #4ade80 
- Losers Bracket: #f87171
- Grand Final: #fbbf24
- Winner: #10b981

## Методы (через ref)

```vue
<template>
  <TurnamentDouble ref="bracketRef" />
</template>

<script setup>
const bracketRef = ref()

// Обновить данные турнира
bracketRef.value?.updateBracket(newData)

// Получить список команд
const teams = bracketRef.value?.getTeams()
</script>
```

## Форматы для Grand Final с reset

- Через rounds с именованными ключами:
```json
{
  "data": {
    "bracket": {
      "rounds": {
        "Grand Final": [{ "team1": {"name":"WB Winner"}, "team2": {"name":"LB Winner"}, "wbIsTeam1": true }],
        "Grand Final Reset": [{ "team1": {"name":"WB Winner"}, "team2": {"name":"LB Winner"} }]
      }
    }
  }
}
```

- Или напрямую в проп `data`:
```js
{
  winnersRounds: [...],
  losersRounds: [...],
  grandFinal: { team1: {name:'WB'}, team2:{name:'LB'}, wbIsTeam1: true, team1_score: 0, team2_score: 2 },
  // Если WB проиграл GF1 — покажите reset (второй финал)
  grandFinalReset: { team1: {name:'WB'}, team2:{name:'LB'}, team1_score: 2, team2_score: 1 }
}
```
