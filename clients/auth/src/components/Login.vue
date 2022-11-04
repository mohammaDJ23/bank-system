<template>
  <form @keyup.enter="onSubmit">
    <div class="d-flex flex-column gap-3 justify-content-center align-items-center">
      <div class="w-100">
        <el-input
          name="email"
          size="large"
          placeholder="Email"
          type="email"
          clearable
          v-model="email"
        />
      </div>

      <div class="w-100">
        <el-input
          size="large"
          placeholder="Password"
          type="password"
          name="password"
          clearable
          show-password
          maxlength="45"
          v-model="password"
        />
      </div>

      <div class="w-50">
        <el-button class="w-100" type="primary" @click="onSubmit">Send</el-button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  methods: {
    onSubmit: function (event) {
      console.log(this.email, this.password);
    },
  },
  data: function () {
    return {
      email: '',
      password: '',
    };
  },
};
</script>
