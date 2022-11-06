<template>
  <Form :formTitle="formTitle" :buttonTitle="buttonTitle">
    <div class="w-100">
      <el-input
        name="email"
        size="large"
        placeholder="Email"
        type="email"
        clearable
        :value="getForm.email"
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
        :value="getForm.password"
      />
    </div>
  </Form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Form from './Form.vue';
import { Login } from '../lib';

export default {
  components: { Form },
  props: { formTitle: String, buttonTitle: String },

  beforeMount: function () {
    this.setForms([Login]);
  },

  methods: mapActions(['setForms']),
  computed: mapGetters(['getForm']),
};
</script>
