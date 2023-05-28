<template>
  <div>
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Hello Vue 3 + Vite2" />
    <div>
      <router-link to="/element-plus">Go to element-plus</router-link>
    </div>
    <div>
      <router-link to="/ant-design-vue">Go to ant-design-vue</router-link>
    </div>
    <div>
      <el-button @click="testHref" type="primary">测试location跳转</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import HelloWorld from '../components/HelloWorld.vue'

const testHref = () => {
  // 通过原生跳转会导致报错
  // location.href = 'http://localhost:7001/micro-app/vite2/#/page2' // 报错
  // location.href = '/micro-app/vite2/#/page2' // 报错
  // location.href = 'https://www.baidu.com/' // 报错
  // location.href = 'http://localhost:3000/micro-app/vite2/#/page2' // -- 不报错

  // vite环境下，通过window.microApp.location进行跳转
  // window.microApp.location.href = 'https://www.baidu.com/' // origin不同，直接跳转页面
  window.microApp.location.href = '/micro-app/vite2/page2'
}

// parent.console.timeEnd('vite')

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>
<style>
</style>
