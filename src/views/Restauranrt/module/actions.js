import * as types from '@/store/mutation-type';
import { restaurant,changeRestaurant,tags } from '@/request/restaurant';
import { _ } from 'core-js';
import { Message } from 'element-ui';
const actions =  {
   /* 获取数据 */
   async setRestList ({ commit }){
      const { list } = await restaurant();
      /* 判断是否关闭 */
      const restList = _.map(list,(v)=>{
         if(v.closed === undefined || v.closed === null){
            v.isClosed = false;
         }else{
            v.isClosed = true;
         }
         return v;
      });

      commit(types.SET_REST_LIST,{ restList });
   },
   /* 改变开关门 */
   async changeClosed ({ dispatch },{ id,closed }){
      try {
         const data = {
            closed: closed
         };
         await changeRestaurant({ id,data });

      } catch (error) {
         Message.error('Something wrong with update restaurant.');
      }finally{
         dispatch('setRestList');
      }

   },
   /* 修改数据 */
   async changeRestList ({ dispatch },{ id,msg }){
      try {
         const data = {
            name: msg.name,
            tags: msg.tags,
            hours: msg.hours
         };
         await changeRestaurant({ id,data });
      } catch (error) {
         Message.error('Something wrong with update restaurant.');
      }finally{
         dispatch('setRestList');
      }

   },

   /* 获取店名 */
   async getRestName ({ commit }){
      const { list } = await restaurant();
      let restName = [];
      _.forEach(list,(item)=>{
         restName.push({
            id: item._id,
            name: item.name[`${'zh-CN'}`]
         });
      });
      commit(types.GET_REST_NAME,{ restName });
   },

   /* tags */
   async getTags ({ commit }){
      const data = await tags();
      commit(types.GET_TAGS,data);
   },
};

export default actions;