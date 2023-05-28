<template></template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { LocalStorage, pathes } from '../lib';
import { decodeToken } from 'react-jwt';

const route = useRoute();
const router = useRouter();

onMounted(() => {
  const jwtToken = route.query.accessToken;
  const oauthToken = route.query.oauthAccessToken;
  const decodedJwtToken = decodeToken(jwtToken);

  const storableData = [
    ['access_token', jwtToken],
    ['oauth_access_token', oauthToken],
    ['access_token_expiration', new Date().getTime() + decodedJwtToken.expiration],
  ];
  for (let [key, value] of storableData) LocalStorage.setItem(key, value);

  router.push(pathes.dashboard);
});
</script>
