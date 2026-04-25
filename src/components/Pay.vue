<template>
  <v-card class="mb-4">
    <v-card-text>
      <div class="text-center my-4">
        {{ room.getUserDataByPlayerId(king.data.turn).userName }}が{{ faces[need] }}を引きました
      </div>
      <v-table>
        <tbody>
          <tr v-for="face in [1, 2, 3, 0, 4, 9]">
            <td>
              {{ faces[face] }}
            </td>
            <td class="d-flex justify-end align-center">
              <v-btn density="compact" icon="mdi-minus" :disabled="!canMinus(face)" @click="minus(face)"></v-btn>
              <div class="mx-1">
                {{ selectedCardsNum(face) }}<template v-if="face != 9">/{{ cardsNum(face) }}</template>枚
              </div>
              <v-btn density="compact" icon="mdi-plus" :disabled="!canPlus(face)" @click="plus(face)"></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue"
import { system } from "../system"

const king = system.stores.king
const room = system.stores.room

const selectedCards = defineModel()
const myPlayerId = computed(() => room.getPlayerId(system.myId))

function cardsNum(face) {
  if (face == 9) {
    return 1000
  }
  return king.filterCards(null, face, myPlayerId.value).length
}

function selectedCardsNum(face) {
  if (face == 9) {
    return selectedCards.value.filter((cardId) => {
      return cardId == -1
    }).length
  }
  let count = 0
  const cards = king.filterCards(null, face, myPlayerId.value)
  for (const cardId of selectedCards.value) {
    if (cards.includes(cardId)) {
      count += 1
    }
  }
  return count
}

function canPlus(face) {
  if (cardsNum(face) == selectedCardsNum(face)) {
    return false
  }
  if (face == 3) {
    face = 2
  }
  const balance1 = cardsNum(1) - selectedCardsNum(1)
  const selectedAmount = king.countAmount(selectedCards.value)
  switch (need.value) {
    case 1:
      switch (face) {
        case 1: // 100円必要 100円選択
          if (selectedCards.value.length == 0) {
            return true
          }
          return false
        case 2: // 100円必要 500円選択
          return false
        case 0: // 100円必要 1,000円選択
          return false
        case 4: // 100円必要 2,000円選択
          return false
        case 9: // 100円必要 借金500円選択
          return false
      }
    case 2:
      switch (face) {
        case 1: // 500円必要 100円選択
          if (5 <= balance1 && selectedCards.value.length == 0) {
            return true
          }
          return false
        case 2: // 500円必要 500円選択
          if (selectedCards.value.length == 0) {
            return true
          }
          return false
        case 0: // 500円必要 1,000円選択
          return false
        case 4: // 500円必要 2,000円選択
          return false
        case 9: // 500円必要 借金500円選択
          if (selectedCards.value.length == 0) {
            return true
          }
          return false
      }
    case 0:
      switch (face) {
        case 1: // 1,000円必要 100円選択
          if (5 <= balance1 && selectedAmount <= 500) {
            return true
          }
          return false
        case 2: // 1,000円必要 500円選択
          if (selectedAmount <= 500) {
            return true
          }
          return false
        case 0: // 1,000円必要 1,000円選択
          if (selectedCards.value.length == 0) {
            return true
          }
          return false
        case 4: // 1,000円必要 2,000円選択
          return false
        case 9: // 1,000円必要 借金500円選択
          if (selectedAmount <= 500) {
            return true
          }
          return false
      }
    case 4:
      switch (face) {
        case 1: // 2,000円必要 100円選択
          if (5 <= balance1 && selectedAmount <= 1500) {
            return true
          }
          return false
        case 2: // 2,000円必要 500円選択
          if (selectedAmount <= 1500) {
            return true
          }
          return false
        case 0: // 2,000円必要 1,000円選択
          if (selectedAmount <= 1000) {
            return true
          }
          return false
        case 4: // 2,000円必要 2,000円選択
          if (selectedCards.value.length == 0) {
            return true
          }
          return false
        case 9: // 2,000円必要 借金500円選択
          if (selectedAmount <= 1500) {
            return true
          }
          return false
      }
  }
}

function canMinus(face) {
  return 0 < selectedCardsNum(face)
}

function plus(face) {
  if (face == 9) {
    selectedCards.value.push(-1)
    return
  }
  const cards = king.filterCards(null, face, myPlayerId.value)
  const cardsToPlus = cards.filter((cardId) => {
    return !selectedCards.value.includes(cardId)
  })
  if (face == 1 && need.value != 1) {
    for (let num = 0; num < 5; num += 1) {
      selectedCards.value.push(cardsToPlus[num])
    }
  } else {
    selectedCards.value.push(cardsToPlus[0])
  }
}

function minus(face) {
  if (face == 9) {
    const deleteIndex = selectedCards.value.indexOf(-1)
    if (deleteIndex !== -1) {
      selectedCards.value.splice(deleteIndex, 1)
    }
    return
  }
  const cards = king.filterCards(null, face, myPlayerId.value)
  const cardsToMinus = selectedCards.value.filter((cardId) => {
    return cards.includes(cardId)
  })
  if (face == 1 && need.value != 1) {
    selectedCards.value = selectedCards.value.filter((cardId) => {
      return !cardsToMinus.slice(0, 5).includes(cardId)
    })
  } else {
    selectedCards.value = selectedCards.value.filter((cardId) => {
      return cardId != cardsToMinus[0]
    })
  }
}

const need = computed(() => {
  const turn = king.data.turn
  const cardId = king.data.players[turn].hand[0]
  const face = king.data.cards[cardId].face
  if (face == 3) {
    return 2
  } else {
    return face
  }
})

const faces = {
  1: "100円",
  2: "500円",
  3: "500円（キング）",
  0: "1,000円",
  4: "2,000円",
  9: "借金500円",
}
</script>
