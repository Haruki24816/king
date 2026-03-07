<template>
  <Logo>
    <div class="text-center mb-8">接続エラー</div>
    <v-btn @click="system.reload()" block>戻る</v-btn>
  </Logo>
</template>

<script setup>
import { system } from "../system"
</script>
