<template>
  <Form :form-schema="formSchema" :rules="rules">
    <el-form-item class="w-100" label="Email" prop="email">
      <el-input v-model="formSchema.email" type="email" autocomplete="off" />
    </el-form-item>

    <el-form-item class="w-100" label="Password" prop="password">
      <el-input v-model="formSchema.password" type="password" autocomplete="off" />
    </el-form-item>
  </Form>
</template>

<script setup>
import { reactive } from 'vue';
import Form from './Form.vue';
import { isEmail, isPassword, Login } from '../lib';

const login = new Login();
const formSchema = reactive(login);

const rules = reactive({
  email: [{ validator: isEmail, trigger: 'change' }],
  password: [{ validator: isPassword, trigger: 'change' }],
});
</script>
