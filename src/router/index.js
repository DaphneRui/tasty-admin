import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
   {
      path: '/',
      name: '/',
      redirect: '/admin'
   },
   {
      path: '/admin',
      name: 'Admin',
      redirect: '/admin/restaurant',
      component: () => import('../views/Admin/Admin.vue'),
   },
   {
      path: '/admin/restaurant',
      name: 'Restaurant',
      component: () => import('../views/Restauranrt/Restaurant.vue')
   },
   {
      path: '/admin/menu',
      name: 'Menu',
      component: () => import('../views/Menu/Menu.vue')
   },
   {
      path: '/admin/order',
      name: 'Order',
      component: () => import('../views/Order/Order.vue')
   }
];

const router = new VueRouter({
   mode: 'history',
   base: process.env.BASE_URL,
   routes
});

export default router;
