<template><slot /></template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const currentPathRef = ref(route.fullPath);

onMounted(() => {
  window.addEventListener('parent-redirection', event => {
    if (event.detail.path !== currentPathRef.value) {
      router.push(event.detail.path);
    }
  });
});

watch(route, to => {
  currentPathRef.value = to.fullPath;
  const event = new CustomEvent('child-redirection', {
    bubbles: true,
    cancelable: true,
    detail: { path: to.fullPath },
  });
  window.dispatchEvent(event);
});
</script>
