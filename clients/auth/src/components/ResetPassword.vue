<template>
  <Form :formTitle="formTitle">
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

    <div class="w-100">
      <el-input
        size="large"
        placeholder="Confirmed password"
        type="password"
        name="confirmedPassword"
        clearable
        show-password
        maxlength="45"
        v-model="confirmedPassword"
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
      password: '',
      confirmedPassword: '',
      token: '',
    };
  },
};
</script>
