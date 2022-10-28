<script>
const AuthApp = require('auth/AuthApp');

export default {
  mounted() {
    AuthApp.mount(this.$refs._auth);
  },
};
</script>

<template>
  <div ref="_auth"></div>
</template>
