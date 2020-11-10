import * as types from '@/store/mutation-type';
import  { menu,food }  from '@/request/menu';
const actions = {

   async getMenu ({ commit },{ id,page,limit,keyword }){
      const data = await menu({ id,page,limit,keyword });
      commit(types.SET_MENU,data );
   },

   /* 修改available */
   async setAvailable ({ dispatch },{ id,msg,foodMsg }){
      const data = {
         id: id,
         data: msg
      };
      await food(data);

      dispatch('getMenu',{
         id: foodMsg.id,
         page: foodMsg.page,
         limit: foodMsg.limit,
         keyword: foodMsg.keyword
      });
   },

};

export default actions;