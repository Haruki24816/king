<template>
  <template v-if="king.data.turn == room.getPlayerId(system.myId)">
    <div>あなたの番です</div>
    <KingDeck :func="draw" />
  </template>
  <template v-else>
    <div>待機</div>
  </template>
</template>

<script setup>
import { system } from "../system"

const king = system.stores.king
const room = system.stores.room

function draw(cardId) {
  system.operateStore(
    "king",
    "drawCard",
    cardId,
  )
}
</script>
