<template>
  <Card :title="formTitle">
    <el-form
      @keyup.enter="onSubmit(formRef)"
      ref="formRef"
      :model="formSchema"
      :rules="rules"
      class="demo-ruleForm"
      label-position="top"
      status-icon
    >
      <div class="d-flex flex-column gap-1 justify-content-center align-items-start">
        <slot />

        <el-form-item class="mt-3">
          <el-button type="primary" @click="onSubmit(formRef)">{{ buttonTitle }}</el-button>
        </el-form-item>
      </div>
    </el-form>
  </Card>
</template>

<script setup>
import { ref } from 'vue';
import Card from './Card.vue';

const formRef = ref();

const props = defineProps({
  formTitle: String,
  rules: Object,
  formSchema: Object,
  buttonTitle: { type: String, default: 'Send' },
});

function onSubmit(formEl) {
  if (!formEl) return;

  formEl.validate(valid => {
    if (valid) console.log('submit!');
    else console.log('error submit!');
  });
}
</script>
