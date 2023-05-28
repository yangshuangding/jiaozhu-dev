import Home from './pages/home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/element-plus',
    name: 'element-plus',
    component: () => import(/* webpackChunkName: "element-plus" */ './pages/element-plus.vue'),
  },
  {
    path: '/ant-design-vue',
    name: 'ant-design-vue',
    component: () => import(/* webpackChunkName: "ant-design-vue" */ './pages/ant-design-vue.vue'),
  },
]

export default routes
