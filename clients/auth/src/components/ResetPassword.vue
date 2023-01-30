<template>
  <!-- <Form :form-schema="formSchema" :rules="rules" forgot-password-button="Back to forgot password">
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
  </Form> -->

  <Card title="Reset password">
    <v-form ref="form" v-model="valid" lazy-validation>
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
      <v-text-field
        clearable
        label="Confirmed password"
        variant="underlined"
        v-model="confirmedPassword"
        type="confirmedPassword"
        name="confirmedPassword"
        required
        @input="() => {}"
      ></v-text-field>
      <div class="d-flex align-center gap-2 flex-wrap">
        <v-btn color="primary" class="text-lowercase" size="small" type="submit" @click="validate">
          reset
        </v-btn>
      </div>
    </v-form>
  </Card>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import Card from './Card.vue';
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
