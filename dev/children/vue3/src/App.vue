<template>
  <div>
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      msg: `Welcome to Vue@3.0.7`,
    }
  },
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: block;
}

/* !scopecss-disable */
.el-popup-parent--hidden {
  overflow: hidden;
}
/* !scopecss-enable */
</style>
