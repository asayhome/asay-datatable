<template>
  <div class="pagination">
    <button @click="goPrevious">{{ trans("Previous", locale) }}</button>
    <div v-if="activePage > parseInt(length)">
      <button
        @click="activePage = parseInt(num)"
        v-for="(num, linkIndex) in lastThreeFactorialPages"
        :key="linkIndex"
        :class="{ active: parseInt(num) == parseInt(page) }"
        v-html="parseInt(num)"
      ></button>
    </div>
    <button
      @click="activePage = parseInt(num)"
      v-for="(num, linkIndex) in pages"
      :key="linkIndex"
      :class="{ active: parseInt(num) == parseInt(page) }"
      v-html="parseInt(num)"
    ></button>
    <button @click="goNext">{{ trans("Next", locale) }}</button>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    paginate: Number,
    start: Number,
    page: Number,
    total: Number,
    locale: String,
  },
  setup(props) {
    let activePage = ref(props.page);
    let passedTotal = ref(props.total);
    return {
      activePage,
      passedTotal,
    };
  },
  methods: {
    goPrevious() {
      if (this.activePage > 1) {
        this.activePage--;
      }
    },
    goNext() {
      if (this.activePage < this.noOfpages) {
        this.activePage++;
      }
    },
    getStartWith(activePage) {
      if (parseInt(activePage) < this.paginate) {
        return 1;
      }
      return parseInt(activePage);
    },
    getEndWith(startWith) {
      if (startWith * this.paginate < this.passedTotal) {
        return startWith * this.paginate;
      }
      return startWith * this.paginate - this.passedTotal;
    },
  },
  computed: {
    noOfpages: function () {
      return Math.ceil(parseInt(this.passedTotal) / parseInt(this.paginate));
    },
    startWith: function () {
      return this.getStartWith(this.activePage);
    },
    endWith: function () {
      return this.getEndWith(this.startWith);
    },
    pages: function () {
      let array = [];
      let ctr = parseInt(this.startWith);
      let totalPages = parseInt(this.passedTotal);
      while (totalPages > 0) {
        array.push(ctr);
        ctr++;
        totalPages -= this.startWith + this.paginate;
      }
      return array;
    },
    pagesFactorials: function () {
      let pages = [];
      let ctr = parseInt(this.activePage);
      while (ctr > 0) {
        ctr -= parseInt(this.paginate);
        if (ctr > 0 && !pages.includes(ctr)) {
          pages.push(ctr);
        }
      }
      return pages;
    },
    lastThreeFactorialPages() {
      let lastThree = this.pagesFactorials;
      if (this.pagesFactorials.length >= 3) {
        lastThree = this.pagesFactorials.slice(-3);
      }
      if (lastThree.length > 0 && lastThree[0] == this.startWith) {
        return lastThree.slice(1);
      }
      return lastThree;
    },
  },
  watch: {
    page: function (newVal) {
      this.activePage = newVal;
    },
    activePage: function (newVal) {
      let details = {
        page: newVal,
        startWith: (newVal - 1) * this.paginate,
        endWith: this.getEndWith((newVal - 1) * this.paginate) + this.paginate,
      };
      this.$emit("setPaginateData", details);
    },
    total: function (newVal) {
      this.passedTotal = newVal;
    },
  },
  mounted() {},
};
</script>

<style scoped>
.pagination {
  display: flex;
  gap: 2px;
  flex-flow: wrap;
  width: 100%;
  justify-content: flex-start;
}

.pagination button {
  color: black;
  float: left;
  padding: 5px 10px;
  text-decoration: none;
  border-radius: 10px;
  background-color: white;
  box-shadow: 10px;
  cursor: pointer;
  box-sizing: border-box;
}

.pagination button.active {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
}

.pagination button:hover:not(.active) {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
}
</style>