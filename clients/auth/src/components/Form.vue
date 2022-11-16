<template>
  <Card :title="formTitle">
    <el-form
      @keyup.enter="onSubmit(formRef)"
      @submit.prevent=""
      ref="formRef"
      :model="formSchema"
      :rules="rules"
      class="demo-ruleForm"
      label-position="top"
      status-icon
    >
      <div class="d-flex flex-column gap-1 justify-content-center align-items-start">
        <slot />

        <div class="d-flex gap-2 align-items-center">
          <el-form-item class="mt-3">
            <el-button type="primary" @click="onSubmit(formRef)" :disabled="!!isFormProcessing">{{
              buttonTitle
            }}</el-button>
          </el-form-item>

          <el-form-item v-if="showForgotPasswordButton" class="mt-3">
            <el-button
              type="primary"
              link
              @click="redirect('/auth/forgot-password')"
              :disabled="!!isFormProcessing"
              >Forgot your password?</el-button
            >
          </el-form-item>

          <el-form-item v-if="showLoginButton" class="mt-3">
            <el-button
              type="primary"
              link
              @click="redirect('/auth/login')"
              :disabled="!!isFormProcessing"
              >Back to login</el-button
            >
          </el-form-item>
        </div>
      </div>
    </el-form>
  </Card>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Card from './Card.vue';
import { useClientFetch, useForm } from '../hooks';

const formRef = ref();
const store = useStore();
const router = useRouter();
const { request } = useClientFetch();

const props = defineProps({
  formTitle: String,
  rules: Object,
  formSchema: Object,
  buttonTitle: { type: String, default: 'Send' },
  showForgotPasswordButton: { type: Boolean, default: false },
  showLoginButton: { type: Boolean, default: false },
});

const { isFormProcessing } = useForm(props.formSchema);

function onSubmit(formEl) {
  if (!formEl) return;

  formEl.validate(valid => {
    if (valid && props.formSchema) request(props.formSchema);
    else console.log('error submit!');
  });
}

function redirect(path) {
  router.push(path);
}
</script>
