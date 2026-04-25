<template>
  <PlayerStat />
  <Message v-if="king.data.turn == myPlayerId">
    支払いを待ってください
  </Message>
  <template v-else>
    <template v-if="!ok">
      <Pay v-model="selectedCards" />
      <v-btn :disabled="validate" @click="pay">支払い</v-btn>
    </template>
    <Message v-else>
      他プレイヤーの支払い待ち
    </Message>
  </template>
</template>

<script setup>
import { ref, computed } from "vue"
import { system } from "../system"

const room = system.stores.room
const king = system.stores.king

const myPlayerId = computed(() => room.getPlayerId(system.myId))
const selectedCards = ref([])
const ok = ref(false)

const validate = computed(() => {
  const turnPlayerData = king.data.players[king.data.turn]
  return king.countAmount(selectedCards.value) != king.countAmount(turnPlayerData.hand)
})

function pay() {
  for (const cardId of selectedCards.value) {
    system.operateStore(
      "king",
      "pay",
      myPlayerId.value,
      cardId,
    )
  }
  ok.value = true
}
</script>
