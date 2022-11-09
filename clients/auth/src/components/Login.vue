<template>
  <Form :formTitle="formTitle" :buttonTitle="buttonTitle">
    <div class="w-100">
      <el-input
        name="email"
        size="large"
        placeholder="Email"
        type="email"
        clearable
        v-model.lazy="getForm(Login).email"
        @input="
          changeInput({
            instance: Login,
            inputName: 'email',
            value: $event,
          })
        "
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
        v-model.lazy="getForm(Login).password"
        @input="
          changeInput({
            instance: Login,
            inputName: 'password',
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
import { Login } from '../lib';

export default {
  components: { Form },
  props: {
    formTitle: String,
    buttonTitle: String,
    Login: { type: Login, default: () => Login },
  },

  beforeMount() {
    this.setForms([Login]);
  },

  methods: mapActions(['setForms', 'changeInput']),
  computed: mapGetters(['getForm']),
};
</script>
