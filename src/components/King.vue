<template>
  <div class="flex-grow-1 w-100">
    <template v-if="system.stores.king.data.stat == 0">
      <div>プレイヤー一覧（リンクを共有して招待してください）</div>
      <div v-for="userId in system.stores.room.getUserIds()">
        {{ system.stores.room.getUsers()[userId].userName }}
        {{ system.stores.room.getUsers()[userId].order }}
        <v-btn @click="system.operateStore('room', 'upUserOrder', userId)">↑</v-btn>
        <v-btn @click="system.operateStore('room', 'downUserOrder', userId)">↓</v-btn>
      </div>
      <v-btn @click="system.operateStore('room', 'updateUserOrder', system.stores.room.getShuffledUserIds())">
        順番シャッフル
      </v-btn>
      <v-btn @click="start">
        ゲーム開始
      </v-btn>
    </template>
    <template v-if="system.stores.king.data.stat == 1">
      <div>カードを15枚引いてください</div>
      <div>
        <v-btn v-for="cardId in deckCards" :color="getColor(cardId)" @click="draw(cardId)">{{ cardId }}</v-btn>
      </div>
      <div>持ってるカード</div>
      <div>
        エース
        赤{{ king.filterCards(0, 0, room.data.users[system.myId].order).length }}
        緑{{ king.filterCards(1, 0, room.data.users[system.myId].order).length }}
        青{{ king.filterCards(2, 0, room.data.users[system.myId].order).length }}
      </div>
      <div>
        百円
        赤{{ king.filterCards(0, 1, room.data.users[system.myId].order).length }}
        緑{{ king.filterCards(1, 1, room.data.users[system.myId].order).length }}
        青{{ king.filterCards(2, 1, room.data.users[system.myId].order).length }}
      </div>
      <div>
        ジャック・クイーン
        赤{{ king.filterCards(0, 2, room.data.users[system.myId].order).length }}
        緑{{ king.filterCards(1, 2, room.data.users[system.myId].order).length }}
        青{{ king.filterCards(2, 2, room.data.users[system.myId].order).length }}
      </div>
      <div>
        キング
        赤{{ king.filterCards(0, 3, room.data.users[system.myId].order).length }}
        緑{{ king.filterCards(1, 3, room.data.users[system.myId].order).length }}
        青{{ king.filterCards(2, 3, room.data.users[system.myId].order).length }}
      </div>
      <div>
        ジョーカー
        赤{{ king.filterCards(0, 4, room.data.users[system.myId].order).length }}
        緑{{ king.filterCards(1, 4, room.data.users[system.myId].order).length }}
        青{{ king.filterCards(2, 4, room.data.users[system.myId].order).length }}
      </div>
    </template>
    <template v-if="system.stores.king.data.stat == 2">
      続きは制作中
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { system } from "../system"

const king = system.stores.king
const room = system.stores.room

function draw(cardId) {
  system.operateStore(
    "king",
    "drawCard",
    system.stores.room.data.users[system.myId].order,
    cardId,
  )
}

function getColor(cardId) {
  const back = king.data.cards[cardId].back
  if (back == 0) {
    return "red"
  }
  if (back == 1) {
    return "green"
  }
  if (back == 2) {
    return "blue"
  }
}

const deckCards = computed(() => {
  const shuffledDeckCards = []
  const deckCards = system.stores.king.filterCards(null, null, -1)
  for (const cardId of system.stores.king.data.firstShuffle) {
    if (deckCards.includes(cardId)) {
      shuffledDeckCards.push(cardId)
    }
  }
  return shuffledDeckCards
})

function start() {
  system.operateStore(
    "king",
    "start",
    system.stores.room.getUserCount(),
    system.stores.king.generateShuffle(),
    system.stores.king.generateShuffle(),
  )
}
</script>
