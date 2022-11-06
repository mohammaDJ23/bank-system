<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header text-center">
        <span
          ><b>{{ formTitle }}</b></span
        >
      </div>
    </template>

    <form @keyup.enter="onSubmit">
      <div class="d-flex flex-column gap-3 justify-content-center align-items-center">
        <slot />

        <div class="w-50">
          <el-button class="w-100" type="primary" @click="onSubmit">{{ buttonTitle }}</el-button>
        </div>
      </div>
    </form>
  </el-card>
</template>

<script>
export default {
  props: { formTitle: String, buttonTitle: { type: String, value: 'Send' } },

  methods: {
    onSubmit: function (event) {
      console.log(event);
    },
  },
};
</script>
