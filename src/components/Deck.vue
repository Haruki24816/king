<template>
  <v-card class="flex-grow-1 d-flex flex-column" height="0">
    <v-card-text>
      <div class="text-center mt-4">
        <slot></slot>
      </div>
    </v-card-text>
    <div class="flex-grow-1 overflow-auto px-4 pb-4 no-scrollbar cards-wrapper">
      <template v-for="cardId in props.cardIds">
        <v-btn v-if="isDeckCard(cardId)" width="30px" height="40px" block :color="getColor(cardId)"
          @click="$emit('clickCard', cardId)"></v-btn>
        <v-btn v-else width="30px" height="40px" block disabled></v-btn>
      </template>
    </div>
  </v-card>
</template>

<script setup>
import { system } from "../system"

const props = defineProps(["cardIds"])
const king = system.stores.king

function isDeckCard(cardId) {
  return king.data.cards[cardId].location == -1
}

function getColor(cardId) {
  const back = king.data.cards[cardId].back
  return ["red", "green", "blue"][back]
}
</script>

<style scoped>
.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, 30px);
  justify-content: center;
  gap: 8px;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
