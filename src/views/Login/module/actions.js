import * as types from '@/store/mutation-type';
import  { login }  from '@/request/login';
import { setStorage } from '@/common/utils';
import router from '@/router';

const actions = {

   /* 登录 */
   async login ({ commit },{ username,password }){
      const user = await login({ username,password });
      commit(types.SET_USER_INFO,user );
      setStorage('userInfo',user);
      router.push('/admin');
   },

   /* 登出 */
   async logout ({ commit }){
      setStorage('userInfo',null);
      commit (types.CLEAR_USER_INFO);
      setStorage('restaurantId',null);
      router.push('/login');
   }
};

export default actions;