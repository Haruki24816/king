<template>
  <v-container class="fill-height d-flex flex-column" max-width="600">
    <v-toolbar class="mb-4" density="compact" rounded>
      <v-toolbar-title :text="system.stores.room.data.roomName"></v-toolbar-title>
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
    <King />
  </v-container>
</template>

<script setup>
import { system } from "../system"
</script>
