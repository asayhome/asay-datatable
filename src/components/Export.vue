<template>
  <div class="btnGroup">
    <span>{{ trans("Export", locale) }}</span>
    <button class="exportBtn" @click="$emit('exportTo', 'pdf')">
      <PdfIcon />
    </button>
    <button class="exportBtn" @click="$emit('exportTo', 'excel')">
      <ExcelIcon />
    </button>
  </div>
</template>

<script>
import ExcelIcon from "../Icons/ExcelIcon.vue";
import PdfIcon from "../Icons/PdfIcon.vue";
export default {
  props: {
    locale: String,
  },
  components: { PdfIcon, ExcelIcon },
};
</script>

<style scoped>
.btnGroup {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  border-radius: 10px;
  gap: 5px;
}
.exportBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 10px;
  transition: width 0.3s;
  width: 32px;
  height: 32px;
}

.exportBtn:hover {
  width: 35px;
  height: 35px;
  background-color: #4caf50;
}
</style>