<template>
  <Form :form-schema="formSchema" :rules="rules" forgot-password-button="Forgot your password?">
    <el-form-item class="w-100" label="Email" prop="email">
      <el-input
        :disabled="!!isFormProcessing"
        v-model="formSchema.email"
        type="email"
        autocomplete="off"
        name="email"
        @input="cacheInput('email', $event)"
      />
    </el-form-item>

    <el-form-item class="w-100" label="Password" prop="password">
      <el-input
        :disabled="!!isFormProcessing"
        v-model="formSchema.password"
        type="password"
        autocomplete="off"
        name="password"
      />
    </el-form-item>
  </Form>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import Form from './Form.vue';
import { isEmail, isPassword, LocalStorage, Login } from '../lib';
import { useFocus, useForm } from '../hooks';

const login = new Login();
const formSchema = reactive(login);
const { isFormProcessing, cacheInput } = useForm(formSchema);
const { focus } = useFocus();

const rules = reactive({
  email: [{ validator: isEmail, trigger: 'change' }],
  password: [{ validator: isPassword, trigger: 'change' }],
});

onMounted(() => {
  focus('email');
});
</script>
