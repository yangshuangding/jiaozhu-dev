<template>
  <el-config-provider namespace="ep">
    <div>
      <el-menu
        :default-active="activePath"
        class="el-menu-demo"
        mode="horizontal"
        router
      >
        <el-menu-item index="/">home</el-menu-item>
        <el-menu-item index="/element-plus">element-plus</el-menu-item>
        <el-menu-item index="/ant-design-vue">ant-design-vue</el-menu-item>
      </el-menu>
      <router-view></router-view>
      <!-- <div id="test-innerHTML"></div> -->
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const activePath = ref(null)
const route = useRoute()
const router = useRouter()

router.isReady().then(() => {
  activePath.value = route.path
  watch(route, () => {
    activePath.value = route.path
  })
})

onMounted(() => {
  // document.getElementById('test-innerHTML').innerHTML = '<span>3333333333</span>'
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-bottom: 30px;
  display: block;
}
body {
  background-color: #fff;
}
</style>
