import * as types from '@/store/mutation-type';
import { tags } from '@/request/tags';

const actions =  {
   async getTags ({ commit }){
      const data = await tags();
      commit(types.GET_TAGS,data);
   },
};

export default actions;