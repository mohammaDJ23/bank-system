<script setup>
import { onBeforeMount } from 'vue';
import { router } from '../main';

onBeforeMount(() => {
  router.push('/');
});
</script>
