const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = {
  publicPath: '/micro-app/vue3/',
  outputDir: 'vue3',
  productionSourceMap: false,
  devServer: {
    hot: true,
    disableHostCheck: true,
    port: 4002,
    overlay: {
      warnings: false,
      errors: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  lintOnSave: false,
  // 自定义webpack配置
  configureWebpack: {
    output: {
      jsonpFunction: `webpackJsonp-chile-vue3`,
    },
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto"
        }
      ]
    },
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver({
          importStyle: false,
        })],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
}
