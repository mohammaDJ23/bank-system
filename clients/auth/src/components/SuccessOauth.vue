<template></template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { LocalStorage, pathes } from '../lib';
import { decodeToken } from 'react-jwt';

const route = useRoute();
const router = useRouter();

onMounted(() => {
  const jwtAccessToken = route.query.accessToken;
  const oauthAccessTokenInfo = route.query.oauthAccessTokenInfo;
  const parsedOauthAccessTokenInfo = JSON.parse(oauthAccessTokenInfo);

  const decodedJwtToken = decodeToken(jwtAccessToken);

  if (decodedJwtToken) {
    const storableData = [
      ['access_token', jwtAccessToken],
      ['access_token_expiration', new Date().getTime() + decodedJwtToken.expiration],
      ['oauth_access_token', oauthAccessTokenInfo.accessToken],
      ['oauth_access_token_expiration', new Date().getTime() + oauthAccessTokenInfo.expiration],
      ['oauth_access_token_info', parsedOauthAccessTokenInfo],
    ];
    for (let [key, value] of storableData) LocalStorage.setItem(key, value);

    router.push(pathes.dashboard);
  } else router.push(pathes.login);
});
</script>
