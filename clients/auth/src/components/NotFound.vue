<template></template>

<script setup>
import { onBeforeMount } from 'vue';
import { useRedirect } from '../hooks';
import { pathes } from '../lib';

const { redirect } = useRedirect();

onBeforeMount(() => {
  redirect(pathes.login);
});
</script>
