import Vue from 'vue';
import VueRouter from 'vue-router';
import React16 from './pages/react16.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/react16/'
  },
  {
    path: '/react16/*',
    name: 'react16',
    component: React16,
  },
  {
    path: '/react17/*',
    name: 'react17',
    component: () => import(/* webpackChunkName: "react17" */ './pages/react17.vue'),
  },
  {
    path: '/vue2/*',
    name: 'vue2',
    component: () => import(/* webpackChunkName: "vue2" */ './pages/vue2.vue'),
  },
  {
    path: '/vue3/*',
    name: 'vue3',
    component: () => import(/* webpackChunkName: "vue3" */ './pages/vue3.vue'),
  },
  {
    path: '/vite2/*',
    name: 'vite2',
    component: () => import(/* webpackChunkName: "vite2" */ './pages/vite2.vue'),
  },
  {
    path: '/vite4/*',
    name: 'vite4',
    component: () => import(/* webpackChunkName: "vite4" */ './pages/vite4.vue'),
  },
  {
    path: '/angular11/*',
    name: 'angular11',
    component: () => import(/* webpackChunkName: "angular11" */ './pages/angular11.vue'),
  },
  {
    path: '/angular14/*',
    name: 'angular14',
    component: () => import(/* webpackChunkName: "angular14" */ './pages/angular14.vue'),
  },
  {
    path: '/multiple/*',
    name: 'multiple',
    component: () => import(/* webpackChunkName: "multiple" */ './pages/multiple.vue'),
  },
  {
    path: '/self/*',
    name: 'self',
    component: () => import(/* webpackChunkName: "self" */ './pages/self.vue'),
  },
];

export default routes;
