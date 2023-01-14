<template>
  <div class="bg-white shadow rounded-[10px] p-[10px]" style="width: 100%">
    <div
      style="
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 100%;
        position: relative;
      "
    >
      <div
        style="
          display: flex;
          width: 100%;
          justify-content: space-between;
          gap: 5px;
          flex-flow: wrap;
        "
      >
        <Search v-model="search" :locale="locale" />
        <slot name="datatable-actions" />
        <Export :locale="locale" @exportTo="exportTo" />
      </div>
      <div style="overflow-x: auto; width: 100%">
        <table :id="id">
          <thead>
            <th
              v-for="column in columns"
              :key="column.name"
              style="padding: 10px; font-weight: bold"
            >
              {{ __(column.label) }}
            </th>
          </thead>
          <tbody>
            <tr
              v-for="(row, rowIndex) in tableRows"
              :key="rowIndex"
              :data-index="rowIndex"
            >
              <td
                v-for="column in columns"
                :key="column.name"
                style="padding: 10px"
              >
                <slot :name="column.name" :item="row" :index="column.name">
                  <div style="" v-html="row[column.name]"></div>
                </slot>
              </td>
            </tr>
            <tr v-if="!tableRows.length">
              <td :colspan="columns.length" style="padding: 10px">
                <span>{{ trans("No records added yet", locale) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top: 10px; width: 100%" v-if="recordsTotal > 0">
          <Paginate
            :page="page"
            :start="start"
            :paginate="paginate"
            :total="recordsFiltered"
            @setPaginateData="setPaginateData"
            :locale="locale"
          />
        </div>
      </div>
      <Spinner :show="isLoading" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {ref} from "vue";
import Paginate from "./Paginate.vue";
import _ from "lodash";
import qs from "qs";
import Export from "./Export.vue";
import Search from "./Search.vue";
import Spinner from "./Spinner.vue";

export default {
  props: {
    id: {
      default: "AsayDataTable",
    },
    columns: Array,
    ajaxUrl: String,
    params: Object,
    data: Array,
    paginate: {
      type: Number,
      default: 10,
    },
    locale: {
      default: "ar",
    },
    showWaitLoader: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    let tableRows = ref([]);
    let links = ref([]);
    let recordsFiltered = ref(0);
    let recordsTotal = ref(0);
    let startWith = ref(0);
    let page = ref(1);
    let search = ref(null);
    let isLoading = ref(false);
    return {
      tableRows,
      links,
      recordsFiltered,
      recordsTotal,
      page,
      startWith,
      search,
      isLoading,
    };
  },
  computed: {
    passedParams: function () {
      let cols = this.columns.map((col) => {
        return {
          name: col.name,
          data: col.name,
          searchable: col?.searchable ? col.searchable : true,
          orderable: col?.searchable ? col.orderable : true,
          search: {
            value: null,
            regex: false,
          },
        };
      });

      let params = {
        draw: parseInt(this.page),
        start: this.startWith,
        length: parseInt(this.paginate),
        columns: cols,
        search: {
          value: this.search,
          regex: false,
        },
        _: "" + Date.now(), // current timestamp
      };

      if (this.params) {
        Object.entries(this.params).forEach(([key, value]) => {
          params[key] = value;
        });
      }

      return params;
    },
  },
  watch: {
    params: function (newVal) {
      // console.log(newVal);
      // this.reloadData();
    },
    page: function (newVal) {
      this.reloadData();
    },
    search: _.debounce(function () {
      this.reloadData();
    }, 1000),
  },
  methods: {
    exportTo(type) {
      if (type == "pdf") {
        console.log(type);
      }
    },
    setPaginateData(data) {
      this.page = data.page;
      this.startWith = data.startWith;
    },
    addActionsListener() {
      let vm = this;
      document.querySelectorAll("#" + this.id + " tbody tr").forEach((row) => {
        row.querySelectorAll("a").forEach((action) => {
          action.addEventListener("click", function (actionEvent) {
            actionEvent.preventDefault();
            /**
             * Extracting data
             */
            let index = row.getAttribute("data-index");
            let action = this.getAttribute("data-action");
            let route = this.getAttribute("data-route");
            let rowData = vm.tableRows?.[index];
            let clicked = {
              action: action,
              route: route,
              data: rowData,
            };
            vm.$emit("setAction", clicked);
          });
        });
      });
    },
    reloadData() {
      if (this.ajaxUrl) {
        if (this.showWaitLoader) {
          this.isLoading = true;
        }
        axios
          .get(this.ajaxUrl, {
            params: this.passedParams,
            paramsSerializer: (params) => {
              return qs.stringify(params, {
                charset: "utf-8",
                interpretNumericEntities: true,
              });
            },
          })
          .then((res) => {
            if (res.status == 200) {
              setTimeout(() => {
                this.isLoading = false;
              }, 500);
              this.recordsFiltered = parseInt(res.data.recordsFiltered);
              this.recordsTotal = parseInt(res.data.recordsTotal);
              this.start = parseInt(res.data.input?.start);
              this.page = parseInt(res.data.draw);
              this.tableRows = res.data.data;
              this.$emit("renderingComplete");
              setTimeout(() => {
                this.addActionsListener();
              }, 1000);
              console.log(res);
            }
          })
          .catch((error) => {
            setTimeout(() => {
              this.isLoading = false;
            }, 500);
          });
      } else {
        this.tableRows = this.data;
      }
    },
    setColumnVisible(col_no, visible) {
      let table = document.getElementById(this.id);
      var rows = table.rows;
      for (var row = 0; row < rows.length; row++) {
        var cols = rows[row].cells;
        if (col_no >= 0 && col_no < cols.length) {
          cols[col_no].style.display = visible ? "" : "none";
        }
      }
      document.getElementsByTagName("th")[col_no].style.display = visible
        ? ""
        : "none";
    },
  },
  mounted() {
    this.reloadData();
  },
  components: { Paginate, Export, Search, Spinner },
};
</script>

<style scoped>
.bg-white {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}
.shadow {
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color),
    0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
    var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.rounded-\[10px\] {
  border-radius: 10px;
}
.p-\[10px\] {
  padding: 10px;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  border: 1px solid gray;
}
th,
td {
  padding: 8px;
  border: 1px solid gray;
}
tr:nth-child(even) {
  background-color: #f2f2f2;
}
tr:hover {
  background-color: #fffdf3;
}
</style>
