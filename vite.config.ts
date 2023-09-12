import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
// import eslintPlugin from 'vite-plugin-eslint'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import qiankun from 'vite-plugin-qiankun'
const packName = require('./package').name
// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    base: mode === 'development' ? '/' : loadEnv(mode, process.cwd()).VITE_CHILDONE_URL + '/',
    plugins: [
      vue(),
      // 配置qiankun
      qiankun(`${packName}`, {
        useDevMode: true
      }),
      // 配置 Eslint 可检测的文件
      // eslintPlugin({
      //   // include: ['src/**/*.js', 'src/**/*.ts', 'src/**/*.vue', 'src/*.js', 'src/*.ts', 'src/*.vue']
      //   include: ['src/**/*.vue', 'src/*.vue']
      // }),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],
    // 配置别名，vite默认是没有别名配置的
    resolve: {
      alias: {
        '@': resolve('src')
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.vue'] // 添加需要自动识别的文件后缀
    },
    server: {
      open: '/index.html',
      port: +loadEnv(mode, process.cwd()).VITE_CHILDONE_URL.split(':')[1],
      origin: loadEnv(mode, process.cwd()).VITE_CHILDONE_URL,
      proxy: {
        '/api': {
          //本地服务接口地址
          target: 'http://192.168.65.86',
          //远程演示服务地址,可用于直接启动项目
          //target: 'https://saber.bladex.vip/api',
          ws: true,
          // pathRewrite: {
          //   '^/api': '/'
          // }
        }
      }
    },
    // 设置全局样式
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/css/variables.scss";'
        }
      }
    },
    build: {
      sourcemap: false, // 关闭映射文件，减小打包体积
      minify: 'terser', // 混淆器，terser构建后文件体积更小
      // chunkSizeWarningLimit: 1500, // 打包单个文件体积大小 默认为500kb
      terserOptions: {
        compress: {
          drop_console: true, // 生产环境移除 console
          drop_debugger: true // 生产环境移除 debugger
        }
      },
      // rollupOptions 将打包文件按照node_modules里边的包名进行分割
      rollupOptions: {
        output: {
          manualChunks (id) {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString()
            }
          },
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/')
              : []
            const fileName =
              facadeModuleId[facadeModuleId.length - 2] || '[name]'
            return `js/${fileName}/[name].[hash].js`
          }
        }
      }
    }
  })
}
