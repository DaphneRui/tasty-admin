import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// import _ from 'lodash';
Vue.config.productionTip = false;
import { getStorage } from '@/common/utils';

/* element-ui */
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

/* vue-echarts */
import echarts from 'echarts';
Vue.prototype.$echarts = echarts;

Vue.prototype.$permission = function (){
   const role = getStorage('userInfo').role;
   if(role !== 'admin'){
      return true;
   }
};

/* 按钮权限 */
// Vue.directive('permission', {
//    inserted (el, binding) {
//       const { value } = binding;
//       if (value && _.isArray(value) && value.length > 0) {
//          const permissionRoles = value;
//          const role = getStorage('userInfo').role;
//          if(!_.includes(permissionRoles,role)){
//             if(el.disabled !== undefined){
//                el.disabled = true;
//                el.childNodes[0].disabled = true;

//             }else{
//                el.setAttribute('aria-disabled',true);
//                el.childNodes[0].disabled = true;
//                console.log(el);
//             }
//             el.className = el.className + ' ' + 'is-disabled';

//          }
//       }
//    },

// });

new Vue({
   router,
   store,
   render: h => h(App)
}).$mount('#app');
