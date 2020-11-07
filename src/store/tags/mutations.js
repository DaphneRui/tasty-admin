import * as types from '@/store/mutation-type';
const mutations = {
   [types.GET_TAGS] (state,data){
      state.tags = data.list;
   }
};

export default mutations;