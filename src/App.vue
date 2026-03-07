<template>
  <v-app>
    <v-main>
      <Loading v-if="system.stat == 0 || system.stat == 4" />
      <Entrance v-if="system.stat == 1" />
      <Invitation v-if="system.stat == 2" />
      <Room v-if="system.stat == 3" />
      <Error v-if="system.stat == 5" />
    </v-main>
  </v-app>
</template>

<script setup>
import { system } from "./system"
</script>
