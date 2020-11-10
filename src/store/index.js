import Vue from 'vue';
import Vuex from 'vuex';

import restaurant from '@/views/Restauranrt/module';
import menu from '@/views/Menu/module/index';
import login from '@/views/Login/module/index';
Vue.use(Vuex);

export default new Vuex.Store({
   state: {
   },
   mutations: {
   },
   actions: {
   },
   modules: {
      restaurant,
      menu,
      login
   }
});

