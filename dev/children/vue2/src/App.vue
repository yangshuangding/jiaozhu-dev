<template>
  <div id="app">
    <div>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        router
      >
        <el-menu-item index="/">home</el-menu-item>
        <el-menu-item index="/page2">page2</el-menu-item>
        <el-menu-item index="/table">table</el-menu-item>
      </el-menu>
    </div>
    <div @click="reload">点击刷新</div>
    <!-- <keep-alive> -->
      <router-view v-if="showView"></router-view>
    <!-- </keep-alive> -->
    <div id="test-innerHTML"></div>
  </div>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      activeIndex: '',
      showView: true,
    }
  },
  created () {
    this.$router.onReady(() => {
      this.activeIndex = this.$route.path
    })
  },
  mounted () {
    document.getElementById('test-innerHTML').innerHTML = '<span>3333333333</span>'
  },
  components: {

  },
  methods: {
    handleClick(tab) {
      this.$router.push(tab.name)
    },
    reload () {
      this.showView = false
      this.$nextTick(() => {
        this.showView = true
      })
    }
  },
  watch: {
    $route () {
      this.activeIndex = this.$route.path
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #fff;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  display: block;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.el-menu-demo {
  display: block;
}
</style>
