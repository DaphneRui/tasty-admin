import * as types from '@/store/mutation-type';

const mutations = {
   [types.SET_MENU] (state,data){
      state.menuList.list = data.list;
      state.menuList.count = data.count;
   },
};

export default mutations;