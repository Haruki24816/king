<template>
  <v-card class="mb-4">
    <v-card-text class="py-0">
      <v-list density="compact">
        <template v-for="(playerData, playerId) in king.data.players">
          <v-list-item>
            <span :class="{ 'font-weight-bold': playerId == king.data.turn }">
              {{ room.getUserDataByPlayerId(playerId).userName }}
            </span>
            <template v-slot:append>
              <PlayerStatChip :value="`所持金${getAmountLocaleString(playerId)}円`">
                仮
              </PlayerStatChip>
              <PlayerStatChip :value="`借金${getDebts(playerId)}円`">
                仮
              </PlayerStatChip>
            </template>
          </v-list-item>
          <v-divider v-if="playerId + 1 != king.data.players.length"></v-divider>
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue"
import { system } from "../system"

const room = system.stores.room
const king = system.stores.king
const myPlayerId = computed(() => room.getPlayerId(system.myId))

function getAmountLocaleString(playerId) {
  return king.countAmount(king.filterCards(null, null, playerId)).toLocaleString()
}

function getDebts(opponentId) {
  const debts = king.data.players[myPlayerId.value].debts
  if (debts[opponentId] === undefined) {
    return 0
  } else {
    return debts[opponentId].toLocaleString()
  }
}
</script>
