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
              <v-menu :close-on-content-click="false" location="bottom end">
                <template v-slot:activator="{ props }">
                  <v-chip size="x-small" v-bind="props">所持金{{ getAmountLocaleString(playerId) }}円</v-chip>
                </template>
                <v-card>
                  <v-card-text>
                    仮（内訳を表示）
                  </v-card-text>
                </v-card>
              </v-menu>
            </template>
          </v-list-item>
          <v-divider v-if="playerId + 1 != king.data.players.length"></v-divider>
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { system } from "../system"

const room = system.stores.room
const king = system.stores.king

function getAmountLocaleString(playerId) {
  return king.countAmount(king.filterCards(null, null, playerId)).toLocaleString()
}
</script>
