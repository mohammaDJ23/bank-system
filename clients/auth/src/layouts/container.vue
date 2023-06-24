<template>
  <div :class="`${styles['auth-container']} overflow-hidden`">
    <div class="w-100 h-100">
      <div class="p-3 w-100 h-100 overflow-auto d-flex justify-content-center align-items-center">
        <div class="col-12 col-sm-10 col-md-9 col-lg-7 col-xl-6">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module="styles">
.auth-container {
  width: 100vw;
  height: 100vh;
  background: #e5e9f2;
  word-break: break-all;
}
</style>
