<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header text-center">
        <span
          ><b>{{ title }}</b></span
        >
      </div>
    </template>

    <slot />
  </el-card>
</template>

<script>
export default {
  props: { title: String },
};
</script>
