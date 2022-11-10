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
        v-model.lazy="getForm(ResetPassword).password"
        @input="
          changeInput({
            instance: ResetPassword,
            inputName: 'password',
            value: $event,
          })
        "
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
        v-model.lazy="getForm(ResetPassword).confirmedPassword"
        @input="
          changeInput({
            instance: ResetPassword,
            inputName: 'confirmedPassword',
            value: $event,
          })
        "
      />
    </div>
  </Form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Form from './Form.vue';
import { ResetPassword } from '../lib';

export default {
  components: { Form },
  props: {
    formTitle: String,
    ResetPassword: { type: Object, default: () => ResetPassword },
  },

  beforeMount() {
    this.setForms([ResetPassword]);
  },

  methods: mapActions(['setForms', 'changeInput']),
  computed: mapGetters(['getForm']),
};
</script>
