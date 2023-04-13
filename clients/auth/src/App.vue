<template>
  <Container>
    <router-view></router-view>
  </Container>
</template>

<script setup>
import { watch, onMounted } from 'vue';
import Container from './layouts/container.vue';
import { useRoute } from 'vue-router';
import { useRedirect } from './hooks';

const route = useRoute();
const { redirect } = useRedirect();

onMounted(() => {
  window.addEventListener('parent-redirection', event => {
    redirect(event.detail.path);
  });
});

watch(route, to => {
  const childRedirectionEvent = new CustomEvent('child-redirection', {
    bubbles: true,
    cancelable: true,
    detail: { path: to.fullPath },
  });
  window.dispatchEvent(childRedirectionEvent);
});
</script>
