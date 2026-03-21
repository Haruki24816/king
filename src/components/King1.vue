<template>
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

<script setup>
import { computed } from "vue"
import { system } from "../system"

const king = system.stores.king
const room = system.stores.room

function draw(cardId) {
  system.operateStore(
    "king",
    "drawCard",
    room.data.users[system.myId].order,
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
  const deckCards = king.filterCards(null, null, -1)
  for (const cardId of king.data.firstShuffle) {
    if (deckCards.includes(cardId)) {
      shuffledDeckCards.push(cardId)
    }
  }
  return shuffledDeckCards
})
</script>
