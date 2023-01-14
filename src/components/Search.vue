<template>
  <div style="position: relative; display: flex">
    <input
      type="text"
      name="search"
      id="search"
      v-model="search"
      :placeholder="trans('Search', locale)"
      class="input"
    />
    <div style="position: absolute; margin: 5px">
      <SearchIcon />
    </div>
  </div>
</template>

<script>
import {ref} from "vue";
import SearchIcon from "../Icons/SearchIcon.vue";

export default {
  components: {
    SearchIcon,
  },
  props: {
    modelValue: {
      default: null,
    },
    locale: String,
  },
  setup(props) {
    let search = ref(props.modelValue);
    return {
      search,
    };
  },
  watch: {
    search: function (newVal) {
      this.$emit("update:modelValue", newVal);
    },
  },
};
</script>

<style scoped>
input[type="text"] {
  box-sizing: border-box;
  padding-left: 35px;
  padding-right: 35px;
  height: 40px;
  border-radius: 10px;
}
</style>
