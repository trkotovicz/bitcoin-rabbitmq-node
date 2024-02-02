import { createApp } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import ApexCharts from 'apexcharts';
import App from './App.vue';
import store from './store';

const app = createApp(App);

app.use(store);
app.component('apexchart', VueApexCharts);
app.component('apexchart', VueApexCharts);
app.component('apexchart', ApexCharts);

app.mount('#app');