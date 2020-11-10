import actions from './actions';
import mutations from './mutations';

const restaurant = {
   state:{
      menuList: {
         list: [],
         count: 0
      },
   },
   actions,
   mutations
};

export default restaurant;