import * as types from '@/store/mutation-type';
import { restaurant,changeRestaurant } from '@/request/restaurant';
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
   async changeClosed ({ commit },{ id,closed }){
      const data = {
         closed: closed
      };
      await changeRestaurant({ id,data });
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
   /* 修改数据 */
   async changeRestList ({ commit },{ id,msg }){
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
      }

   }
};

export default actions;