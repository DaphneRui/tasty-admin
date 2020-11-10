import Vue from 'vue';
import VueRouter from 'vue-router';
import { getStorage } from '@/common/utils';
import _ from 'lodash';
Vue.use(VueRouter);

const routes = [
   {
      path: '/',
      name: 'Root',
      redirect: '/login',
   },
   {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login/Login.vue'),
      /* 在进入login页面之前判断localstorage里面是否存有用户信息，如果有，则直接跳转到restaurant页面，如果没有，则正常跳转 */
      beforeEnter: (to, from, next) => {
         if(_.get(getStorage('userInfo'),'role')) {
            next({
               path:'/admin/restaurant'
            });
         }else{
            next();
         }
      }
   },
   {
      path: '/admin',
      name: 'Admin',
      redirect: '/admin/restaurant',
      component: () => import('@/views/Admin/Admin.vue'),
      children:[
         {
            path: 'restaurant',
            name: 'Restaurant',
            component: () => import('@/views/Restauranrt/Restaurant.vue')
         },
         {
            path: 'menu',
            name: 'Menu',
            component: () => import('@/views/Menu/Menu.vue')
         },
         {
            path: 'order',
            name: 'Order',
            component: () => import('@/views/Order/Order.vue'),
            /* 在进入Order页面之前判断登录身份是否为游客，如果是，则直接跳转到restaurant页面，如果没有，则正常跳转 */
            beforeEnter: (to, from, next) => {
               if((_.get(getStorage('userInfo'),'role')) === 'visitor') {
                  next({
                     path:'/admin/restaurant'
                  });
               }else{
                  next();
               }
            }
         }
      ]
   },

];

const router = new VueRouter({
   mode: 'history',
   base: process.env.BASE_URL,
   routes
});

export default router;

/* 路由守卫，进行登录态检测 */
router.beforeEach((to, from, next) => {
   if((to.name !== 'Login') ){
      /* 需要检测是否登录 */
      if(!_.get(getStorage('userInfo'),'role')){
         next({
            name: 'Login'
         });
      }else{
         next();
      }
   }
   else{
      next();
   }
});

