import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import legacy from '@vitejs/plugin-legacy'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver, AntDesignVueResolver, NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

const pathSrc = path.resolve(__dirname, 'src')
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${pathSrc}/`,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/styles/element/index.scss" as *;`,
      },
    },
  },
  plugins: [
    // legacy({
    //   targets: ['Chrome >= 59']
    // }),
    vue(),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        // AntDesignVueResolver(), // need it?
      ],
      imports: [
        'vue',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar'
          ]
        }
      ]
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
        AntDesignVueResolver(),
        NaiveUiResolver(),
      ],
    }),
    ElementPlus()
  ],
  server: {
    port: 7001,
    host: true,
    proxy: {
      '/sugrec': {
        target: 'https://www.baidu.com',
        secure: false,
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'vite2',
  },
  clearScreen: false,
  base: `/micro-app/vite2/`,
})
