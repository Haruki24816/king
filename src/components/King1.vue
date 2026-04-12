<template>
  <Deck :cardIds="king.data.firstShuffle" @clickCard="collect">
    <template v-if="count == 0">カードを15枚引いてください</template>
    <template v-else>残り{{ 15 - count }}枚</template>
  </Deck>
</template>

<script setup>
import { computed } from "vue"
import { system } from "../system"

const room = system.stores.room
const king = system.stores.king

const myPlayerId = computed(() => room.getPlayerId(system.myId))

const count = computed(() => {
  return king.filterCards(null, null, myPlayerId.value).length
})

function collect(cardId) {
  system.operateStore(
    "king",
    "collectCard",
    myPlayerId.value,
    cardId,
  )
}
</script>
