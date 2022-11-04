<template>
  <Container>
    <router-view></router-view>
  </Container>
</template>

<script>
import Container from './layouts/container.vue';

export default { components: { Container } };
</script>

<style src="./assets/styles/index.scss"></style>
