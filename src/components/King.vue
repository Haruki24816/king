<template>
  <div class="flex-grow-1 w-100">
    <King0 v-if="system.stores.king.data.stat == 0" />
    <King1 v-if="system.stores.king.data.stat == 1" />
    <King2 v-if="system.stores.king.data.stat == 2" />
    <King3 v-if="system.stores.king.data.stat == 3" />
  </div>
</template>

<script setup>
import { system } from "../system"
</script>
