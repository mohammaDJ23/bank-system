<template>
  <Card title="Forgot password" :is-loading="isFormProcessing">
    <v-form ref="formRef" v-model="valid" lazy-validation @submit="validate">
      <v-text-field
        clearable
        :disabled="isFormProcessing"
        label="Email"
        variant="underlined"
        v-model="form.email"
        :rules="form.getInputRules('email')"
        type="email"
        name="email"
        required
        @update:model-value="value => form.cacheInput('email', value)"
      ></v-text-field>
      <div class="d-flex align-center gap-2 flex-wrap mt-3">
        <v-btn color="primary" class="text-capitalize" size="small" type="submit" :disabled="isFormProcessing">
          Send
        </v-btn>
        <v-btn
          color="primary"
          variant="outlined"
          size="small"
          class="text-capitalize"
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
import { onMounted, reactive, ref } from 'vue';
import Card from './Card.vue';
import { ForgotPassword, pathes } from '../lib';
import { useFocus, useRedirect, useRequest } from '../hooks';
import { ForgotPasswordApi } from '../apis';
import { useNotification } from '@kyvg/vue3-notification';

const formRef = ref();
const form = reactive(new ForgotPassword());
const valid = reactive(true);
const { isApiProcessing, request } = useRequest();
const { redirect } = useRedirect();
const { focus } = useFocus();
const { notify } = useNotification();
const isFormProcessing = isApiProcessing(ForgotPasswordApi);

onMounted(() => {
  focus('email');
});

async function validate(event) {
  event.preventDefault();
  const { valid } = await formRef.value.validate();
  if (valid) {
    request(new ForgotPasswordApi(form)).then(response => {
      form.clearCachedForm();
      formRef.value.reset();
      notify({ text: response.data.message, title: 'Success', type: 'success' });
    });
  }
}
</script>
