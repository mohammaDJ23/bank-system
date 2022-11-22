<template>
  <Form :form-schema="formSchema" :rules="rules" show-forgot-password-button>
    <el-form-item class="w-100" label="Password" prop="password">
      <el-input
        :disabled="!!isFormProcessing"
        v-model="formSchema.password"
        type="password"
        autocomplete="off"
        name="password"
      />
    </el-form-item>

    <el-form-item class="w-100" label="Confirmed password" prop="confirmedPassword">
      <el-input
        :disabled="!!isFormProcessing"
        v-model="formSchema.confirmedPassword"
        type="password"
        autocomplete="off"
        name="confirmedPassword"
      />
    </el-form-item>
  </Form>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import Form from './Form.vue';
import { isPassword, isSamePassword, ResetPassword } from '../lib';
import { useForm, useFocus } from '../hooks';

const resetPassword = new ResetPassword();
const formSchema = reactive(resetPassword);
const { isFormProcessing } = useForm(formSchema);
const { focus } = useFocus();

const rules = reactive({
  password: [{ validator: isPassword, trigger: 'change' }],
  confirmedPassword: [
    { validator: isSamePassword(formSchema), trigger: 'change' },
    { validator: isSamePassword(formSchema), trigger: 'blur' },
  ],
});

onMounted(() => {
  focus('password');
});
</script>
