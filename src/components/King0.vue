<template>
  <div>プレイヤー一覧（リンクを共有して招待してください）</div>
  <div v-for="userId in room.getUserIds()">
    {{ room.getUsers()[userId].userName }}
    {{ room.getUsers()[userId].order }}
    <v-btn @click="system.operateStore('room', 'upUserOrder', userId)">↑</v-btn>
    <v-btn @click="system.operateStore('room', 'downUserOrder', userId)">↓</v-btn>
  </div>
  <v-btn @click="system.operateStore('room', 'updateUserOrder', room.getShuffledUserIds())">
    順番シャッフル
  </v-btn>
  <v-btn @click="start">
    ゲーム開始
  </v-btn>
</template>

<script setup>
import { system } from "../system"

const king = system.stores.king
const room = system.stores.room

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
