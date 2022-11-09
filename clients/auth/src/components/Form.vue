<template>
  <Card :title="formTitle">
    <form @keyup.enter="onSubmit">
      <div class="d-flex flex-column gap-3 justify-content-center align-items-center">
        <slot />

        <div class="w-50">
          <el-button class="w-100" type="primary" @click="onSubmit">{{ buttonTitle }}</el-button>
        </div>
      </div>
    </form>
  </Card>
</template>

<script>
import Card from './Card.vue';

export default {
  components: { Card },
  props: { formTitle: String, buttonTitle: { type: String, default: 'Send' } },

  methods: {
    onSubmit(event) {
      console.log(event);
    },
  },
};
</script>
