<template>
  <div>カードを引いてください 残り{{ 15 - king.filterCards(null, null, room.getPlayerId(system.myId)).length }}枚</div>
  <KingDeck :func="collect" />
</template>

<script setup>
import { system } from "../system"

const king = system.stores.king
const room = system.stores.room

function collect(cardId) {
  if (king.filterCards(null, null, room.getPlayerId(system.myId)).length < 15) {
    system.operateStore(
      "king",
      "collectCard",
      room.getPlayerId(system.myId),
      cardId,
    )
  }
}
</script>
