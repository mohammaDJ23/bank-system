<template>
  <div v-if="isUserLoggedIn" class="text-center p-5">
    <p class="font-weight-regular">You are logged in.</p>
  </div>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import { isUserAuthenticated } from '../lib';
import { useRedirect } from '../hooks';

const { redirect } = useRedirect();
const isUserLoggedIn = isUserAuthenticated();

onBeforeMount(() => {
  if (!isUserLoggedIn) {
    redirect('/auth/login');
  }
});
</script>
