<template>
  <RedirectionProvider>
    <Container>
      <router-view></router-view>
    </Container>
  </RedirectionProvider>
</template>

<script setup>
import Container from './layouts/container.vue';
import RedirectionProvider from './lib/Providers/RedirectionProvider.vue';
</script>
