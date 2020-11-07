import Vue from 'vue';
import Vuex from 'vuex';

// import menu from '@/views/Menu/module/index';
import restaurant from '@/views/Restauranrt/module';
import tags from './tags/index';

Vue.use(Vuex);

export default new Vuex.Store({
   state: {
   },
   mutations: {
   },
   actions: {
   },
   modules: {
      // menu,
      restaurant,
      tags,

   }
});

