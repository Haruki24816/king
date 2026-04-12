<template>
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

<script setup>
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
</script>
