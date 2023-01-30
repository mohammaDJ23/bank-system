<template>
  <!-- <Form :form-schema="formSchema" :rules="rules" show-login-button>
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
  </Form> -->
  <Card title="Forgot password">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        clearable
        label="Email"
        variant="underlined"
        v-model="email"
        type="email"
        name="email"
        isRequired
        @input="() => {}"
      ></v-text-field>
      <div class="d-flex align-center gap-2 flex-wrap">
        <v-btn color="primary" class="text-lowercase" size="small" type="submit" @click="validate">
          Send
        </v-btn>
        <v-btn
          color="primary"
          variant="outlined"
          size="small"
          class="text-lowercase"
          @click="reset"
        >
          Back to login
        </v-btn>
      </div>
    </v-form>
  </Card>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import Card from './Card.vue';
import { isEmail, ForgotPassword } from '../lib';
import { useForm, useFocus } from '../hooks';

const forgotPassword = new ForgotPassword();
const formSchema = reactive(forgotPassword);
const { isFormProcessing, cacheInput } = useForm(formSchema);
const { focus } = useFocus();

const rules = reactive({
  email: [{ validator: isEmail, trigger: 'change' }],
});

onMounted(() => {
  focus('email');
});
</script>
