import Home from './pages/home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/element-plus',
    name: 'element-plus',
    component: () => import('./pages/element-plus.vue')
  },
  {
    path: '/ant-design-vue',
    name: 'ant-design-vue',
    component: () => import('./pages/ant-design-vue.vue')
  }
]

export default routes
