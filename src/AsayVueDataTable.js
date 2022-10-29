import DataTable from "./components/DataTable.vue";
import { mixins } from "./Mixin";
export default {
    install: (app, options) => {

        app
            .mixin(mixins)
            .component("DataTable", DataTable);
        /*  our code for the plugin goes here
                app is the result of createApp()
                options is user options passed in
            */
    },
};
