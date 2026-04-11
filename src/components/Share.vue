<template>
  <v-card class="mb-4">
    <v-card-text>
      <div class="text-center my-4">
        プレイヤーを招待してください
      </div>
      <v-text-field label="招待URL" hint="コピーしました" :model-value="url" readonly @click="share"></v-text-field>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue"

const url = computed(() => window.location.href)

function share() {
  navigator.clipboard.writeText(url.value)
  navigator.share({ url: url.value })
}
</script>
