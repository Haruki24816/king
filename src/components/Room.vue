<template>
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
            <th>切断</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(userData, userId) in system.roomData.users">
            <th>{{ userId }}</th>
            <th>{{ userData.userName }}</th>
            <th>{{ userData.sid }}</th>
            <th>{{ userData.left }}</th>
          </tr>
        </tbody>
      </v-table>
    </v-sheet>
    <v-sheet elevation=1 class="mb-4 pa-4">
      <v-btn @click="system.disconnectForDebug()" class="me-4">切断（デバック用）</v-btn>
      <v-btn @click="system.connectForDebug()">接続（デバック用）</v-btn>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { system } from "../system"
</script>
