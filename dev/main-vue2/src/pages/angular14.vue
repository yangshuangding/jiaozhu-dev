<template>
  <div class="angular14">
    <micro-app
        name='angular14'
        url='http://localhost:6002/micro-app/angular14'
        baseRoute='/angular14'
        :data='data'
        inline
      >
      <!-- destroy inline scopecss='false' -->
      </micro-app>
  </div>
</template>

<script>
import 'zone.js'

export default {
  name: 'angular14',
   data () {
    return {
      data: {from: '来自基座的初始化数据'}
    }
  },
  methods: {}
}
</script>

<style>

</style>
