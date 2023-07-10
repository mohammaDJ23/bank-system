<template>
  <Card v-if="!isUserLoggedIn" title="User login" :is-loading="isFormProcessing">
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
        autocomplete="off"
      ></v-text-field>
      <div class="d-flex align-center gap-2 flex-wrap mt-3">
        <v-btn color="primary" class="text-capitalize" size="small" type="submit" :disabled="isFormProcessing">
          Login
        </v-btn>
        <v-btn
          color="primary"
          class="text-capitalize"
          variant="outlined"
          size="small"
          type="button"
          @click="loginWithGoogle"
          :disabled="isFormProcessing"
        >
          Login with google
        </v-btn>
        <v-btn
          color="primary"
          variant="outlined"
          size="small"
          class="text-capitalize"
          type="button"
          @click="redirect(pathes.forgotPassword)"
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
import { LocalStorage, Login, pathes } from '../lib';
import { useFocus, useRequest, useRedirect } from '../hooks';
import { LoginApi, LoginWithGoogleApi } from '../apis';
import { decodeToken } from 'react-jwt';
import { isUserAuthenticated } from '../lib';

const formRef = ref();
const form = reactive(new Login());
const valid = reactive(true);
const { isApiProcessing, request } = useRequest();
const { redirect } = useRedirect();
const { focus } = useFocus();
const isLoginApiProcessing = isApiProcessing(LoginApi);
const isFormProcessing = isLoginApiProcessing;
const isUserLoggedIn = isUserAuthenticated();

onMounted(() => {
  focus('email');
});

async function validate(event) {
  event.preventDefault();
  const { valid } = await formRef.value.validate();
  if (valid) {
    request(new LoginApi(form)).then(response => {
      form.clearCachedForm();
      formRef.value.reset();

      const token = response.data.accessToken;
      const decodedToken = decodeToken(token);
      const storableData = [
        ['access_token', token],
        ['access_token_expiration', new Date().getTime() + decodedToken.expiration],
      ];

      for (let [key, value] of storableData) LocalStorage.setItem(key, value);

      redirect(pathes.dashboard);
    });
  }
}

function loginWithGoogle() {
  const loginWithGoogleApi = new LoginWithGoogleApi();
  window.open(process.env.AUTH_SERVICE + loginWithGoogleApi.api.url, '_self');
}
</script>
