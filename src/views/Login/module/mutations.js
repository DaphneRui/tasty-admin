import * as types from '@/store/mutation-type';

const mutations = {
   [types.SET_USER_INFO] (state,data){
      state.user = data;
   },
   [types.CLEAR_USER_INFO] (state){
      state.user = [];
   },
};

export default mutations;