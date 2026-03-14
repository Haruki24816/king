<template>
  <Logo>
    <v-dialog max-width="400">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn class="mb-4" v-bind="activatorProps" block>始める</v-btn>
      </template>
      <template v-slot:default>
        <v-card title="始める">
          <v-card-text>
            <v-text-field maxlength=16 @keydown.enter="makeRoom" label="あなたの名前" v-model="myName"></v-text-field>
            <v-text-field maxlength=16 @keydown.enter="makeRoom" label="部屋の名前" v-model="roomName"></v-text-field>
            <v-btn :disabled="validate" @click="makeRoom" block>部屋を開く</v-btn>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
    <About />
  </Logo>
</template>

<script setup>
import { ref, computed } from "vue"
import { system } from "../system"

const myName = ref("")
const roomName = ref("")

const validate = computed(() => {
  const myNameLength = myName.value.trim().length
  const roomNameLength = roomName.value.trim().length
  return !(1 <= myNameLength && myNameLength <= 16 && 1 <= roomNameLength && roomNameLength <= 16)
})

function makeRoom() {
  if (validate.value) {
    return
  }
  system.makeRoom(myName.value, roomName.value)
}
</script>
