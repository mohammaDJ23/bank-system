<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    class="demo-ruleForm"
    label-position="top"
    status-icon
  >
    <el-form-item label="Email" prop="email">
      <el-input v-model="form.email" type="email" autocomplete="off" />
    </el-form-item>

    <el-form-item label="Password" prop="password">
      <el-input v-model="form.password" type="password" autocomplete="off" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(formRef)">Send</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { isEmail, isPassword, Login } from '../lib';

const formRef = ref();
const login = new Login();
const form = reactive(login);

const rules = reactive({
  email: [{ validator: isEmail, trigger: 'change' }],
  password: [{ validator: isPassword, trigger: 'change' }],
});

function submitForm(formEl) {
  if (!formEl) return;

  formEl.validate(function (valid) {
    if (valid) console.log('submit!');
    else console.log('error submit!');
  });
}
</script>
