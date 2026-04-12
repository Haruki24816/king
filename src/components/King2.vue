<template>
  <PlayerStat />
  <Deck v-if="king.data.turn == myPlayerId" :cardIds="king.data.firstShuffle" @clickCard="draw">
    カードを1枚引いてください
  </Deck>
  <Message v-else>
    カードが引かれるのを待ってください
  </Message>
</template>

<script setup>
import { computed } from "vue"
import { system } from "../system"

const room = system.stores.room
const king = system.stores.king

const myPlayerId = computed(() => room.getPlayerId(system.myId))

function draw(cardId) {
  system.operateStore(
    "king",
    "drawCard",
    cardId,
  )
}
</script>
