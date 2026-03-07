<template>
  <Logo>
    <div class="text-center mb-8">「{{ system.roomData.roomName }}」に招待されています</div>
    <v-dialog max-width="500">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn class="mb-4" v-bind="activatorProps" block>参加</v-btn>
      </template>
      <template v-slot:default>
        <v-card title="参加">
          <v-card-text>
            <v-text-field maxlength=16 @keydown.enter="enterRoom" label="あなたの名前" v-model="myName"></v-text-field>
            <v-text-field label="部屋の名前" readonly :model-value="system.roomData.roomName"></v-text-field>
            <v-btn :disabled="validate" @click="enterRoom" block>部屋に入る</v-btn>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
    <v-btn class="mb-4" @click="system.reload()" block>辞退</v-btn>
    <About />
  </Logo>
</template>

<script setup>
import { ref, computed } from "vue"
import { system } from "../system"

const myName = ref("")

const validate = computed(() => {
  const myNameLength = myName.value.trim().length
  return !(1 <= myNameLength && myNameLength <= 16)
})

function enterRoom() {
  if (validate.value) {
    return
  }
  system.enterRoom(myName.value)
}
</script>
