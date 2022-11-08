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
        v-model="getForm.email"
      />
    </div>
  </Form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Form from './Form.vue';
import { ForgotPassword } from '../lib';

export default {
  components: { Form },
  props: { formTitle: String },

  beforeMount() {
    this.setForms([ForgotPassword]);
  },

  methods: mapActions(['setForms']),
  computed: mapGetters(['getForm']),
};
</script>
