// import './public-path'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import routes from './router'
import App from './App.vue'


// -------------------分割线-默认模式------------------ //
// const app = createApp(App)
// const router = createRouter({
//   history: createWebHistory(window.__MICRO_APP_BASE_ROUTE__ || '/micro-app/vue3/'),
//   routes,
// })
// app.use(ElementPlus)
// app.use(Antd)
// app.use(router)
// app.mount('#app')

// console.log('微应用vue3渲染了 -- 默认模式')

// // 监听卸载
// window.unmount = () => {
//   console.log('微应用vue3卸载了 -- 默认模式')
//   // 卸载应用
//   app.unmount()
// }


// -------------------分割线-umd模式------------------ //

let app = null
let router = null
let history = null
// 👇 将渲染操作放入 mount 函数，子应用初始化时会自动执行
window.mount = () => {
  history = createWebHistory(window.__MICRO_APP_BASE_ROUTE__ || '/micro-app/vue3/')
  router = createRouter({
    history,
    routes,
  })

  app = createApp(App)
  // app.use(ElementPlus)
  app.use(Antd)
  app.use(router)
  app.mount('#app')

  console.log('微应用child-vue3渲染了 -- UMD模式')
}

// 👇 将卸载操作放入 unmount 函数
window.unmount = () => {
  app?.unmount()
  history?.destroy()
  app = null
  router = null
  history = null
  console.log('微应用child-vue3卸载了 -- UMD模式')
}

// 如果不在微前端环境，则直接执行mount渲染
if (!window.__MICRO_APP_ENVIRONMENT__) {
  window.mount()
}

// -------------------分割线------------------ //


/* ---------------------- 全局事件 --------------------- */
document.addEventListener('click', function () {
  console.log(`子应用${window.__MICRO_APP_NAME__}内部的document.addEventListener(click)绑定`)
}, false)

document.onclick = () => {
  console.log(`子应用${window.__MICRO_APP_NAME__}内部的document.onclick绑定`)
}

window.addEventListener('mousedown', () => {
  console.log(`子应用${window.__MICRO_APP_NAME__}内部的window.addEventListener(mousedown)绑定`)
}, false)

setInterval(() => {
  console.log(`子应用${window.__MICRO_APP_NAME__}的setInterval`)
}, 5000)

setTimeout(() => {
  console.log(`子应用${window.__MICRO_APP_NAME__}的setTimeout`)
}, 5000);
