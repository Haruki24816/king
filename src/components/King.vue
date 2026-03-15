<template>
  <div class="flex-grow-1 w-100">
    <template v-if="system.stores.king.data.stat == 0">
      <div>プレイヤー一覧（リンクを共有して招待してください）</div>
      <div v-for="userId in system.stores.room.getUserIds()">
        {{ system.stores.room.getUsers()[userId].userName }}
        {{ system.stores.room.getUsers()[userId].order }}
        <v-btn @click="system.operateStore('room', 'upUserOrder', userId)">↑</v-btn>
        <v-btn @click="system.operateStore('room', 'downUserOrder', userId)">↓</v-btn>
      </div>
      <v-btn
        @click="system.operateStore('room', 'updateUserOrder', system.stores.room.getShuffledUserIds())">順番シャッフル</v-btn>
    </template>
  </div>
</template>

<script setup>
import { system } from "../system"
</script>
