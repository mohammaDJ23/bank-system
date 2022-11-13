<template>
  <Form :form-schema="formSchema" :rules="rules">
    <el-form-item class="w-100" label="Password" prop="password">
      <el-input v-model="formSchema.password" type="password" autocomplete="off" />
    </el-form-item>

    <el-form-item class="w-100" label="Confirmed password" prop="confirmedPassword">
      <el-input v-model="formSchema.confirmedPassword" type="password" autocomplete="off" />
    </el-form-item>
  </Form>
</template>

<script setup>
import { reactive } from 'vue';
import Form from './Form.vue';
import { isPassword, isSamePassword, ResetPassword } from '../lib';

const resetPassword = new ResetPassword();
const formSchema = reactive(resetPassword);

const rules = reactive({
  password: [{ validator: isPassword, trigger: 'change' }],
  confirmedPassword: [
    { validator: isPassword, trigger: 'change' },
    { validator: isSamePassword(formSchema.password), trigger: 'blur' },
  ],
});
</script>
