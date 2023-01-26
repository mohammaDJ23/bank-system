<template>
  <v-card>
    <v-card-item v-if="title">
      <v-card-title>{{ title }}</v-card-title>
    </v-card-item>

    <v-card-item>
      <slot />
    </v-card-item>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: String,
});
</script>
