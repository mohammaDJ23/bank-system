<template>
  <v-card :loading="isLoading">
    <v-card-item v-if="title">
      <v-card-title
        class="text-xs-h6 text-sm-h5 text-md-h5 text-lg-h5 text-xl-h5 font-weight-medium text-center"
        >{{ title }}</v-card-title
      >
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
  isLoading: { type: Boolean, default: false },
});
</script>
