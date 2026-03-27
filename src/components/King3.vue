<template>
  <template v-if="king.data.turn == room.getPlayerId(system.myId)">
    <div>待機</div>
  </template>
  <template v-else>
    <div>{{ room.getUserDataByPlayerId(king.data.turn).userName }}が{{ turnAmount }}を引きました</div>
    <div v-for="cardId in king.filterCards(null, null, room.getPlayerId(system.myId))" class="d-inline-block">
      <v-checkbox :label="amount(cardId)" :value="cardId" v-model="selected" density="compact"></v-checkbox>
    </div>
    <div>{{ king.countAmount(selected) }}</div>
    <v-btn :disabled="validate" @click="pay">支払う</v-btn>
  </template>
</template>

<script setup>
import { ref, computed } from "vue"
import { system } from "../system"

const king = system.stores.king
const room = system.stores.room

function pay() {
  for (const cardId of selected.value) {
    system.operateStore(
      "king",
      "pay",
      room.getPlayerId(system.myId),
      cardId,
    )
  }
}

const selected = ref([])

const validate = computed(() => {
  const turnPlayerData = king.data.players[king.data.turn]
  return king.countAmount(selected.value) != king.countAmount(turnPlayerData.hand)
})

const faces = {
  0: "千円",
  1: "百円",
  2: "五百円",
  3: "五百円（キング）",
  4: "二千円",
}

function amount(cardId) {
  const face = king.data.cards[cardId].face
  return faces[face]
}

const turnAmount = computed(() => {
  const turn = king.data.turn
  const cardId = king.data.players[turn].hand[0]
  const face = king.data.cards[cardId].face
  return faces[face]
})
</script>
