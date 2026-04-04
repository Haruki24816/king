<template>
  <v-card class="mb-4">
    <v-card-text>
      <div class="text-center my-4">
        プレイヤーを招待してください
      </div>
      <v-text-field label="招待URL" hint="コピーしました" :model-value="url" readonly @click="share"></v-text-field>
    </v-card-text>
  </v-card>
  <template v-if="1 < room.getUserCount()">
    <v-card class="mb-4">
      <v-card-text>
        <div class="text-center mt-4">
          順番を決めてください
        </div>
        <v-list>
          <template v-for="userId in room.getUserIds()">
            <v-list-item>
              {{ room.data.users[userId].order + 1 }}. {{ room.data.users[userId].userName }}
              <template v-slot:append>
                <v-btn class="position-absolute swap-button" icon="mdi-swap-vertical" density="comfortable"
                  v-if="room.data.users[userId].order + 1 != room.getUserCount()"
                  @click="system.operateStore('room', 'downUserOrder', userId)"></v-btn>
              </template>
            </v-list-item>
            <v-divider v-if="room.data.users[userId].order + 1 != room.getUserCount()"></v-divider>
          </template>
        </v-list>
      </v-card-text>
    </v-card>
    <v-btn class="mb-4" block @click="system.operateStore('room', 'updateUserOrder', room.getShuffledUserIds())">
      順番シャッフル
    </v-btn>
    <v-btn block @click="start">
      ゲーム開始
    </v-btn>
  </template>
</template>

<script setup>
import { computed } from "vue"
import { system } from "../system"

const room = system.stores.room
const king = system.stores.king

const url = computed(() => window.location.href)

function share() {
  navigator.clipboard.writeText(url.value)
  navigator.share({ url: url.value })
}

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

<style scoped>
.swap-button {
  top: 30px;
  z-index: 1;
}
</style>
