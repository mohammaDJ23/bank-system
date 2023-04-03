<template>
  <Container>
    <router-view></router-view>
  </Container>
</template>

<script setup>
import { watch } from 'vue';
import Container from './layouts/container.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

watch(route, to => {
  const childRedirectionEvent = new CustomEvent('child-redirection', {
    bubbles: true,
    cancelable: true,
    detail: { path: to.path },
  });
  window.dispatchEvent(childRedirectionEvent);
});
</script>
