<template>
  <div class="card card-p-0 card-flush">
    <div class="card-header align-items-center py-5 gap-2 gap-md-5">
      <div class="card-title">
        <div class="d-flex align-items-center position-relative my-1">
          <span class="svg-icon svg-icon-1 position-absolute ms-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <rect
                opacity="0.5"
                x="17.0365"
                y="15.1223"
                width="8.15546"
                height="2"
                rx="1"
                transform="rotate(45 17.0365 15.1223)"
                fill="black"
              ></rect>
              <path
                d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                fill="black"
              ></path>
            </svg>
          </span>
          <!--end::Svg Icon-->
          <input
            type="text"
            :id="id + 'searchBox'"
            class="form-control form-control-solid w-250px ps-14"
            :placeholder="__('Search her')"
          />
        </div>
        <slot name="actions" />
      </div>
      <div class="card-toolbar flex-row-fluid justify-content-end gap-5">
        {{ __("Export") }}
        <div class="dt-buttons btn-group flex-wrap">
          <button
            class="btn btn-secondary buttons-copy buttons-html5"
            @click="exportAs('0')"
            type="button"
          >
            <span>{{ __("Copy") }}</span>
          </button>
          <button
            class="btn btn-secondary buttons-excel buttons-html5"
            @click="exportAs('1')"
            type="button"
          >
            <span>{{ __("Excel") }}</span>
          </button>
          <button
            class="btn btn-secondary buttons-csv buttons-html5"
            @click="exportAs('2')"
            type="button"
          >
            <span>{{ __("CSV") }}</span>
          </button>
          <button
            class="btn btn-secondary buttons-pdf buttons-html5"
            @click="exportAs('3')"
            type="button"
          >
            <span>{{ __("PDF") }}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="card-body">
      <table
        class="table table-hover table-bordered rounded fs-6 g-5 mt-5"
        :id="id"
      >
        <thead>
          <tr class="text-start text-gray-400 fw-bolder text-uppercase">
            <th v-for="column in columns" :key="column.id">
              {{ __(column.label) }}
            </th>
          </tr>
        </thead>
        <tbody class="fw-bold text-gray-600"></tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import arLocale from "../Translations/Ar.json";
import enLocale from "../Translations/En.json";
export default {
  props: {
    columns: Array,
    ajaxUrl: String,
    params: Object,
    action: {
      default: "get",
    },
    locale: {
      default: "ar",
    },
    id: {
      default: "kt_datatable_example_1",
    },
  },
  setup(props) {
    let dataTable = ref(null);
    let exportButtons = ref([]);
    let passedParams = ref(props.params);
    return {
      dataTable,
      exportButtons,
      passedParams,
    };
  },
  methods: {
    exportAs(index) {
      this.dataTable.button(index).trigger();
    },
    setColsVisibilty(columns, visible) {
      this.dataTable.columns(columns).visible(visible);
    },
    getExportableColumns() {
      let columns = [];
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].hasOwnProperty("exportable")) {
          if (this.columns[i].exportable) {
            columns.push({
              name: this.columns[i].name,
              index: i,
            });
          }
        } else {
          columns.push({
            name: this.columns[i].name,
            index: i,
          });
        }
      }
      return columns;
    },
    initDataTable() {
      let vm = this;
      this.dataTable = $("#" + this.id).DataTable({
        searching: true,
        searchDelay: 500,
        processing: true,
        serverSide: true,
        //order: [[0, "asc"]],
        stateSave: true,
        // select: {
        //   style: "multi",
        //   selector: 'td:first-child input[type="checkbox"]',
        //   className: "row-selected",
        // },
        ajax: {
          type: this.action,
          url: this.ajaxUrl,
          dataType: "json",
          cache: false,
          data: function (d) {
            $.extend(d, vm.passedParams);
          },
        },
        columns: this.columns.map((col) => {
          col.data = col.name;
          return col;
        }),
        pagingType: "full_numbers",
        language: this.locale == "ar" ? arLocale : enLocale,
        scrollY: true,
        buttons: [
          "copy",
          "csv",
          "excel",
          {
            extend: "print",
            exportOptions: {
              columns: this.getExportableColumns().map(
                (column) => column.index
              ),
            },
            customize: function (win) {
              win.document.body.setAttribute("dir", "rtl");
            },
          },
        ],
      });
      /**
       * Handle search box
       */
      //const filterSearch = document.querySelector('[data-kt-filter="search"]');
      //filterSearch.addEventListener("keyup", function (e) {
      //  vm.dataTable.search(e.target.value).draw();
      //});
      // $(this.id + "searchBox").keyup(function () {
      //   vm.dataTable.search(e.target.value).draw();
      // });
      $("#" + this.id + "searchBox").on("keyup", function (e) {
        vm.dataTable.search(e.target.value).draw();
      });
      // // Hook dropdown menu click event to datatable export buttons
      // const exportButtons = document.querySelectorAll(
      //   "#kt_datatable_example_1_export_menu [data-kt-export]"
      // );
      // exportButtons.forEach((exportButton) => {
      //   exportButton.addEventListener("click", (e) => {
      //     e.preventDefault();
      //     // Get clicked export value
      //     const exportValue = e.target.getAttribute("data-kt-export");
      //     const target = document.querySelector(
      //       ".dt-buttons .buttons-" + exportValue
      //     );
      //     // Trigger click event on hidden datatable export buttons
      //     target.click();
      //   });
      // });
      /**
       * Handle actions
       */
      $("#" + this.id + " tbody").on("click", "a", function (e) {
        let action = $(this).data("action");
        let route = $(this).data("route");
        let clicked = {
          action: action,
          route: route,
          data: vm.dataTable.row($(this).parents("tr")).data(),
        };
        vm.$emit("setAction", clicked);
      });
    },
    reloadData() {
      this.dataTable?.ajax.reload();
    },
    reRenderTable() {
      $("#" + this.id)
        .DataTable()
        .destroy();
      this.initDataTable();
    },
  },
  created() {
    //this.$loadScript("/demo1/plugins/custom/datatables/datatables.bundle.js")
    //.then(() => {
    // Script is loaded, do something
    // this.initDataTable();
    //})
    //.catch(() => {
    //  // Failed to fetch script
    //});
  },
  mounted() {
    //this.$loadScript("/demo1/plugins/custom/datatables/datatables.bundle.js")
    //.then(() => {
    // Script is loaded, do something
    this.initDataTable();
    //})
    //.catch(() => {
    //  // Failed to fetch script
    //});
    $.ajaxSetup({
      headers: {
        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
      },
    });
  },
  watch: {
    params: function (newVal, oldVal) {
      this.passedParams = newVal;
      this.reloadData();
    },
  },
};
</script>
<style>
.dataTables_filter {
  display: none;
}
</style>