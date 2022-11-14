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
          <el-button type="primary" @click="onSubmit(formRef)" :disabled="!!isFormProcessing">{{
            buttonTitle
          }}</el-button>
        </el-form-item>
      </div>
    </el-form>
  </Card>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import Card from './Card.vue';
import { useClientFetch } from '../hooks';

const formRef = ref();
const store = useStore();
const { request } = useClientFetch();

const props = defineProps({
  formTitle: String,
  rules: Object,
  formSchema: Object,
  buttonTitle: { type: String, default: 'Send' },
});

const isFormProcessing = computed(
  () => store.state.requestProcessModule.loadings[props.formSchema.constructor.name],
);

function onSubmit(formEl) {
  if (!formEl) return;

  formEl.validate(valid => {
    if (valid && props.formSchema) request(props.formSchema);
    else console.log('error submit!');
  });
}
</script>
