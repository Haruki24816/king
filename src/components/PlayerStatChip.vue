<template>
  <v-menu :close-on-content-click="false" location="bottom end">
    <template v-slot:activator="{ props }">
      <v-chip class="ms-1" size="x-small" v-bind="props">
        {{ myProps.value }}
      </v-chip>
    </template>
    <v-card>
      <v-card-text>
        <slot></slot>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script setup>
const myProps = defineProps(["value"])
</script>
