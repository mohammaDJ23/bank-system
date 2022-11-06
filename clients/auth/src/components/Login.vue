<template>
  <Form formTitle="User login" buttonTitle="Login">
    <div class="w-100">
      <el-input
        name="email"
        size="large"
        placeholder="Email"
        type="email"
        clearable
        v-model="email"
      />
    </div>

    <div class="w-100">
      <el-input
        size="large"
        placeholder="Password"
        type="password"
        name="password"
        clearable
        show-password
        maxlength="45"
        v-model="password"
      />
    </div>
  </Form>
</template>

<script>
import Form from './Form.vue';

export default {
  components: { Form },

  data: function () {
    return {
      email: '',
      password: '',
    };
  },
};
</script>
