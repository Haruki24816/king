<template>
  <v-toolbar class="mb-4" density="compact" color="white" elevation=1 rounded>
    <v-toolbar-title :text="room.data.roomName"></v-toolbar-title>
    <v-menu location="bottom end">
      <template v-slot:activator="{ props }">
        <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
      </template>
      <v-list>
        <v-list-item value="">
          <v-list-item-title>仮</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script setup>
import { system } from "../system"
const room = system.stores.room
</script>
