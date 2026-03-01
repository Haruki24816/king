<template>
  <v-app>
    <v-main>
      <v-container max-width="600">
        <v-sheet elevation=1 class="mb-4 pa-4">
          <v-table density="compact">
            <thead>
              <tr>
                <th>項目</th>
                <th>内容</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>状態</td>
                <td>{{ system.stat }}</td>
              </tr>
              <tr>
                <td>ユーザーID</td>
                <td>{{ system.myId }}</td>
              </tr>
              <tr>
                <td>ルームID</td>
                <td>{{ system.roomId }}</td>
              </tr>
              <tr>
                <td>ルーム名</td>
                <td>{{ system.roomData.roomName }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-sheet>
        <v-sheet elevation=1 class="mb-4 pa-4">
          <v-table density="compact">
            <thead>
              <tr>
                <th>ユーザーID</th>
                <th>ユーザー名</th>
                <th>セッションID</th>
                <th>状態</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(userData, userId) in system.roomData.users">
                <th>{{ userId }}</th>
                <th>{{ userData.userName }}</th>
                <th>{{ userData.sid }}</th>
                <th>{{ userData.stat }}</th>
              </tr>
            </tbody>
          </v-table>
        </v-sheet>
        <v-sheet elevation=1 class="mb-4 pa-4">
          <v-btn @click="system.disconnectForDebug()" class="me-4">切断（デバック用）</v-btn>
          <v-btn @click="system.connectForDebug()">接続（デバック用）</v-btn>
        </v-sheet>
        <v-sheet elevation=1 class="mb-4 pa-4" v-if="system.stat == 1">
          <v-text-field label="ハンドルネーム" v-model="myName"></v-text-field>
          <v-text-field label="部屋の名前" v-model="roomName"></v-text-field>
          <v-btn @click="system.makeRoom(myName, roomName)" :disabled="myName == '' || roomName == ''">部屋を作成</v-btn>
        </v-sheet>
        <v-sheet elevation=1 class="mb-4 pa-4" v-if="system.stat == 2">
          <v-text-field label="ハンドルネーム" v-model="myName"></v-text-field>
          <v-btn @click="system.enterRoom(myName)" :disabled="myName == ''">入室</v-btn>
        </v-sheet>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue"
import { system } from "./system"

const myName = ref("")
const roomName = ref("")
</script>
