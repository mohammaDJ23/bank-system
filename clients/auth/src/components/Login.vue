<template>
  <Card title="User login">
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
      <div class="d-flex align-center gap-2 flex-wrap mt-3">
        <v-btn
          color="primary"
          class="text-lowercase"
          size="small"
          type="submit"
          :disabled="isFormProcessing"
        >
          Login
        </v-btn>
        <v-btn
          color="primary"
          variant="outlined"
          size="small"
          class="text-lowercase"
          type="button"
          @click="reset"
          :disabled="isFormProcessing"
        >
          Forgot your password?
        </v-btn>
      </div>
    </v-form>
  </Card>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue';
import Card from './Card.vue';
import { Login } from '../lib';
import { useFocus, useForm } from '../hooks';

const formRef = ref();
const form = reactive(new Login());
const valid = reactive(true);
const { isFormProcessing } = useForm(form);
const { focus } = useFocus();

onMounted(() => {
  focus('email');
});

async function validate(event) {
  event.preventDefault();
  const { valid } = await formRef.value.validate();
  if (valid) {
  }
}
</script>
