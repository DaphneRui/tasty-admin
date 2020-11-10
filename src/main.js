import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

/* element-ui */
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

/* vue-echarts */
import echarts from 'echarts';
Vue.prototype.$echarts = echarts;
// import ECharts from 'vue-echarts';
// import 'echarts/lib/chart/bar';
// import 'echarts/lib/component/tooltip';
// Vue.component('v-chart', ECharts);

new Vue({
   router,
   store,
   render: h => h(App)
}).$mount('#app');
