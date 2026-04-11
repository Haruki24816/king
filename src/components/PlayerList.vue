<template>
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
                v-if="isNotLastPlayer(userId)" @click="system.operateStore('room', 'downUserOrder', userId)"></v-btn>
            </template>
          </v-list-item>
          <v-divider v-if="isNotLastPlayer(userId)"></v-divider>
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { system } from "../system"

const room = system.stores.room

function isNotLastPlayer(userId) {
  return room.data.users[userId].order + 1 != room.getUserCount()
}
</script>

<style scoped>
.swap-button {
  top: 30px;
  z-index: 1;
}
</style>
