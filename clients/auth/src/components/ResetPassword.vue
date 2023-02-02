<template>
  <Card title="Reset password" :is-loading="isFormProcessing">
    <v-form ref="formRef" v-model="valid" lazy-validation @submit="validate">
      <v-text-field
        clearable
        :disabled="isFormProcessing"
        label="Password"
        variant="underlined"
        v-model="form.password"
        :rules="form.getInputRules('password')"
        type="password"
        name="password"
        required
      ></v-text-field>
      <v-text-field
        clearable
        :disabled="isFormProcessing"
        label="Confirmed password"
        variant="underlined"
        v-model="form.confirmedPassword"
        :rules="form.getInputRules('confirmedPassword')"
        type="password"
        name="confirmedPassword"
        required
      ></v-text-field>
      <div class="d-flex align-center gap-2 flex-wrap mt-3">
        <v-btn
          color="primary"
          class="text-capitalize"
          size="small"
          type="submit"
          :disabled="isFormProcessing"
        >
          Send
        </v-btn>
        <v-btn
          color="primary"
          variant="outlined"
          size="small"
          class="text-capitalize"
          type="button"
          @click="redirect(pathes.login)"
          :disabled="isFormProcessing"
        >
          Back to login
        </v-btn>
      </div>
    </v-form>
  </Card>
</template>

<script setup>
import { reactive, onMounted, ref, watch } from 'vue';
import Card from './Card.vue';
import { ResetPassword, pathes } from '../lib';
import { useFocus, useRequest, useRedirect } from '../hooks';
import { ResetPasswordApi } from '../apis';
import { notification } from 'ant-design-vue';

const formRef = ref();
const form = reactive(new ResetPassword());
const valid = ref(true);
const { isApiProcessing, request } = useRequest();
const { redirect } = useRedirect();
const { focus } = useFocus();
const isFormProcessing = isApiProcessing(ResetPasswordApi);

onMounted(() => {
  focus('password');
});

async function validate(event) {
  event.preventDefault();
  const { valid } = await formRef.value.validate();
  if (valid) {
    request(new ResetPasswordApi(form)).then(response => {
      form.clearCachedForm();
      formRef.value.reset();
      notification.success({
        message: 'Success',
        description: 'Your password was changed.',
      });
      redirect(pathes.login);
    });
  }
}

watch(
  () => form,
  form => {
    form.bindInputsRules();
  },
  { deep: true }
);
</script>
