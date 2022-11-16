<template>
  <Form :form-schema="formSchema" :rules="rules" show-login-button>
    <el-form-item class="w-100" label="Email" prop="email">
      <el-input
        :disabled="!!isFormProcessing"
        v-model="formSchema.email"
        type="email"
        autocomplete="off"
        name="email"
      />
    </el-form-item>
  </Form>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import Form from './Form.vue';
import { isEmail, ForgotPassword } from '../lib';
import { useForm, useFocus } from '../hooks';

const forgotPassword = new ForgotPassword();
const formSchema = reactive(forgotPassword);
const { isFormProcessing } = useForm(formSchema);
const { focus } = useFocus();

const rules = reactive({
  email: [{ validator: isEmail, trigger: 'change' }],
});

onMounted(() => {
  focus('email');
});
</script>
