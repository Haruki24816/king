<template>
  <PlayerStat />
  <Message v-if="king.data.turn == myPlayerId">
    支払いを待ってください
  </Message>
  <Pay v-model="selectedCards" v-else />
</template>

<script setup>
import { ref, computed } from "vue"
import { system } from "../system"

const room = system.stores.room
const king = system.stores.king

const myPlayerId = computed(() => room.getPlayerId(system.myId))
const selectedCards = ref([])
</script>
