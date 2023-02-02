<script setup>
import { onBeforeMount } from 'vue';
import { useRedirect } from '../hooks';

const { redirect } = useRedirect();

onBeforeMount(() => {
  redirect('/');
});
</script>
