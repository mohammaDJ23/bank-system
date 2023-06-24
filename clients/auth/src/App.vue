<template>
  <RedirectionProvider>
    <Container>
      <notifications position="top right" />
      <router-view></router-view>
    </Container>
  </RedirectionProvider>
</template>

<script setup>
import Container from './layouts/container.vue';
import RedirectionProvider from './lib/Providers/RedirectionProvider.vue';
</script>
