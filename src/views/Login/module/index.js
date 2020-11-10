import actions from './actions';
import mutations from './mutations';
import { getStorage } from '@/common/utils';

const login = {
   state:{
      user:getStorage('userInfo') || {}
   },
   actions,
   mutations
};

export default login;