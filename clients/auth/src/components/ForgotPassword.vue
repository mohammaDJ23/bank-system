<template>
  <Form :formTitle="formTitle">
    <div class="w-100">
      <el-input
        size="large"
        placeholder="Email"
        type="email"
        name="email"
        clearable
        maxlength="45"
        v-model="email"
      />
    </div>
  </Form>
</template>

<script>
import Form from './Form.vue';

export default {
  components: { Form },
  props: { formTitle: String },

  data: function () {
    return {
      email: '',
    };
  },
};
</script>
