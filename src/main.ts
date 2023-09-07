import { createApp } from 'vue'
import website from './config/website'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import App from './App.vue'
// 引入路由

// pinia
// import pinia from './store'
import store from './store'
import i18n from './lang/';
// import 'element-plus/dist/index.css'
import router from './router/router'

console.log(router)
// 引入路由
let instance: any = null
instance = createApp(App)
instance.use(router)
instance.use(i18n)
instance.use(store)
instance.config.globalProperties.website = website

function render (props: any = {}) {
  const { container } = props
  instance.mount(container ? container.querySelector('#app') : '#app')
}
renderWithQiankun({
  mount (props: any) {
    render(props)
  },
  bootstrap () {
    console.log('%c', 'color:green;', ' ChildOne bootstrap')
  },
  update () {
    console.log('%c', 'color:green;', ' ChildOne update')
  },
  unmount (props: any) {
    console.log('unmount', props)
    instance.unmount()
    instance._container.innerHTML = ''
    // history.destroy() // 不卸载  router 会导致其他应用路由失败
    instance = null
  }
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
}
