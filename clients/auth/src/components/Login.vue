<template>
  <!-- <Form :form-schema="formSchema" :rules="rules" forgot-password-button="Forgot your password?">
    <el-form-item class="w-100" label="Email" prop="email">
      <el-input
        :disabled="!!isFormProcessing"
        v-model="formSchema.email"
        type="email"
        autocomplete="off"
        name="email"
        @input="cacheInput('email', $event)"
      />
    </el-form-item>

    <el-form-item class="w-100" label="Password" prop="password">
      <el-input
        :disabled="!!isFormProcessing"
        v-model="formSchema.password"
        type="password"
        autocomplete="off"
        name="password"
      />
    </el-form-item>
  </Form> -->
  <Card title="User login">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        clearable
        label="Email"
        variant="underlined"
        v-model="email"
        type="email"
        name="email"
        required
        @input="() => {}"
      ></v-text-field>
      <v-text-field
        clearable
        label="Password"
        variant="underlined"
        v-model="password"
        type="password"
        name="password"
        required
        @input="() => {}"
      ></v-text-field>
      <div class="d-flex align-center gap-2 flex-wrap">
        <v-btn color="primary" class="text-lowercase" size="small" type="submit" @click="validate">
          Login
        </v-btn>
        <v-btn
          color="primary"
          variant="outlined"
          size="small"
          class="text-lowercase"
          @click="reset"
        >
          Forgot your password?
        </v-btn>
      </div>
    </v-form>
  </Card>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import Card from './Card.vue';
import { isEmail, isPassword, Login } from '../lib';
import { useFocus, useForm } from '../hooks';

const login = new Login();
const formSchema = reactive(login);
const { isFormProcessing, cacheInput } = useForm(formSchema);
const { focus } = useFocus();

const rules = reactive({
  email: [{ validator: isEmail, trigger: 'change' }],
  password: [{ validator: isPassword, trigger: 'change' }],
});

onMounted(() => {
  focus('email');
});
</script>
