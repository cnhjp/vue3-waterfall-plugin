import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // assetsDir: './',
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'VueWaterfallPluginNext',
      fileName: format => `vue-waterfall-plugin-next.${format}.js`
    },
    rollupOptions: {
      // 不想被打包进来的依赖
      external: [
        'vue'
      ],
      // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
