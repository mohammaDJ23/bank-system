<template>
  <Form :form-schema="formSchema" :rules="rules">
    <el-form-item class="w-100" label="Email" prop="email">
      <el-input
        :disabled="!!isFormProcessing"
        v-model="formSchema.email"
        type="email"
        autocomplete="off"
      />
    </el-form-item>
  </Form>
</template>

<script setup>
import { reactive } from 'vue';
import Form from './Form.vue';
import { isEmail, ForgotPassword } from '../lib';
import { useForm } from '../hooks';

const forgotPassword = new ForgotPassword();
const formSchema = reactive(forgotPassword);
const { isFormProcessing } = useForm(formSchema);

const rules = reactive({
  email: [{ validator: isEmail, trigger: 'change' }],
});
</script>
