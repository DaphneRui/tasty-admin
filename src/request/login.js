import request from '../common/request';
import { host } from '../common/config';

export async function login (data) {
   const result = await request({
      url:`${host}admin/login`,
      method:'post',
      data
   });
   console.log('login ===>',result);
   return result;
}
