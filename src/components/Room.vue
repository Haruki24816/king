<template>
  <v-container class="fill-height d-flex flex-column align-stretch" max-width="400">
    <RoomMenu />
    <King0 v-if="king.data.stat == 0" />
    <King1 v-if="king.data.stat == 1" />
    <King2 v-if="king.data.stat == 2" />
    <King3 v-if="king.data.stat == 3" />
  </v-container>
</template>

<script setup>
import { system } from "../system"
const king = system.stores.king
</script>
