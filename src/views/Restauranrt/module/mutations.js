import * as types from '@/store/mutation-type';
const mutations = {
   [types.SET_REST_LIST] (state, data) {
      state.restList = data.restList;
   },
   [types.GET_REST_NAME] (state, data) {
      state.restName = data.restName;
   },
   /* tags */
   [types.GET_TAGS] (state,data){
      state.tags = data.list;
   }
};

export default mutations;