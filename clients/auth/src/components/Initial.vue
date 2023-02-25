<template>
  <div v-if="isUserLoggedIn" class="text-center p-5">
    <p class="font-weight-regular">You are logged in.</p>
  </div>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import { isUserAuthenticated, pathes } from '../lib';
import { useRedirect } from '../hooks';

const { redirect } = useRedirect();
const isUserLoggedIn = isUserAuthenticated();

onBeforeMount(() => {
  if (!isUserLoggedIn) {
    redirect(pathes.login);
  }
});
</script>
