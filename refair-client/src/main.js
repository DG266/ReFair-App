import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap.css";
import VueApexCharts from "vue3-apexcharts";
import "../src/assets/style.css";

const app = createApp(App);

app.use(router);
app.use(VueApexCharts);

app.mount("#app");
