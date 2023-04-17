<template><slot /></template>

<script setup>
import { watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRedirect } from '../hooks';

const route = useRoute();
const { redirect } = useRedirect();

function parentRedirectionProcess(event) {
  redirect(event.detail.path);
}

onMounted(() => {
  window.addEventListener('parent-redirection', parentRedirectionProcess);
});

onUnmounted(() => {
  window.removeEventListener('parent-redirection', parentRedirectionProcess);
});

watch(route, to => {
  const childRedirection = new CustomEvent('child-redirection', {
    bubbles: true,
    cancelable: true,
    detail: { path: to.path },
  });
  window.dispatchEvent(childRedirection);
});
</script>
