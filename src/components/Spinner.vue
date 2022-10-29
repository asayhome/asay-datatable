<template>
  <div
    v-if="show"
    class="absolute flex justify-center justify-center w-full h-full"
  >
    <div class="spin"></div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      default: false,
    },
  },
};
</script>

<style scoped>
.spin {
  margin-top: 30px;
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid red;
  border-radius: 50%;
  border-top-color: blue;
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
}
@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
.absolute {
  position: absolute;
}
.flex {
  display: flex;
}
.justify-center {
  justify-content: center;
}
.justify-center {
  align-items: center;
}
.w-full {
  width: 100%;
}
.h-full {
  height: 100%;
}
</style>