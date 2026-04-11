<template>
  <v-container class="fill-height d-flex flex-column align-stretch" max-width="400">
    <RoomMenu />
    <template v-if="king.data.stat == 0">
      <Share />
      <template v-if="1 < room.getUserCount()">
        <PlayerList />
        <v-btn class="mb-4" @click="system.operateStore('room', 'updateUserOrder', room.getShuffledUserIds())">
          順番シャッフル
        </v-btn>
        <v-btn @click="start">
          ゲーム開始
        </v-btn>
      </template>
    </template>
    <template v-if="king.data.stat == 1">
      <Deck :cardIds="king.data.firstShuffle" @clickCard="collect">
        <template v-if="count15 == 0">カードを15枚引いてください</template>
        <template v-else>残り{{ 15 - count15 }}枚</template>
      </Deck>
    </template>
  </v-container>
</template>

<script setup>
import { computed } from "vue"
import { system } from "../system"

const room = system.stores.room
const king = system.stores.king

function start() {
  system.operateStore(
    "room",
    "setPlayerIdByOrder",
  )
  system.operateStore(
    "king",
    "start",
    room.getUserCount(),
    king.generateShuffle(),
    king.generateShuffle(),
  )
}

const count15 = computed(() => {
  return king.filterCards(null, null, room.getPlayerId(system.myId)).length
})

function collect(cardId) {
  system.operateStore(
    "king",
    "collectCard",
    room.getPlayerId(system.myId),
    cardId,
  )
}
</script>
