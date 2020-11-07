import request from '../common/request';
import { host } from '../common/config';

export async function restaurant () {
   const result = await request({
      url:`${host}restaurant/location/-74.0059413,40.7127837`,
      method:'get'
   });
   console.log('restaurant==>',result);
   return result;
}

export async function changeRestaurant (data) {
   const result = await request({
      url:`${host}restaurant`,
      method:'post',
      data
   });
   return result;
}
