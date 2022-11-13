<template>
  <Form :form-schema="formSchema" :rules="rules">
    <el-form-item class="w-100" label="Email" prop="email">
      <el-input v-model="formSchema.email" type="email" autocomplete="off" />
    </el-form-item>
  </Form>
</template>

<script setup>
import { reactive } from 'vue';
import Form from './Form.vue';
import { isEmail, ForgotPassword } from '../lib';

const forgotPassword = new ForgotPassword();
const formSchema = reactive(forgotPassword);

const rules = reactive({
  email: [{ validator: isEmail, trigger: 'change' }],
});
</script>
