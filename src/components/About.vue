<template>
  <v-dialog max-width="400">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" block>このゲームについて</v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card title="このゲームについて">
        <v-card-text>
          仮
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="isActive.value = false">閉じる</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
