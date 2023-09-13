import './public-path' // qiankun
import {createApp} from 'vue'
import website from './config/website'
import {renderWithQiankun, qiankunWindow} from 'vite-plugin-qiankun/dist/helper'
import App from './App.vue'
import axios from './router/axios'

// 引入路由

import store from './store'
import i18n from './lang/'
import {language, messages} from './lang/'
// import 'element-plus/dist/index.css'
import router from './router/router'

import './permission' // 权限
import './error' // 日志
import {setupCache} from '@/cache'
import {setupError} from '@/error'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import Avue from '@smallwei/avue'
import '@smallwei/avue/lib/index.css'
import './styles/common.scss'

import basicBlock from './components/basic-block/main'
import basicContainer from './components/basic-container/main'
import thirdRegister from './components/third-register/main'

import {timeReplaceMark} from './util/valid'

import * as urls from '@/config/env'
import {loadStyle} from './util/util'
import {iconfontUrl, iconfontVersion} from '@/config/env'

// 引入路由
let instance: any = null
instance = createApp(App)
instance.component('basic-container', basicContainer)
instance.component('basic-block', basicBlock)
instance.component('third-register', thirdRegister)

// instance.use(i18n)
instance
  .use(ElementPlus, {
    locale: messages[language]
  })
  .use(Avue, {
    axios,
    calcHeight: -165,
    locale: messages[language]
  })
  .use(router)
  .use(i18n)
  .use(store)
instance.config.globalProperties.website = website

setupCache(instance)
setupError(instance)

// 加载相关url地址
Object.keys(urls).forEach((key) => {
  instance.config.globalProperties[key] = urls[key]
})

// 动态加载阿里云字体库
iconfontVersion.forEach((ele) => {
  loadStyle(iconfontUrl.replace('$key', ele))
})

function render(props: any = {}) {
  const {container} = props
  instance.mount(container ? container.querySelector('#app') : '#app')
}
renderWithQiankun({
  mount(props: any) {
    render(props)
  },
  bootstrap() {
    console.log('%c', 'color:green;', ' ChildOne bootstrap')
  },
  update() {
    console.log('%c', 'color:green;', ' ChildOne update')
  },
  unmount(props: any) {
    console.log('unmount', props)
    instance.unmount()
    instance._container.innerHTML = ''
    // history.destroy() // 不卸载  router 会导致其他应用路由失败
    instance = null
  }
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  // 监听输入字符限制
  document.addEventListener('input', function (ev) {
    if (ev.target.type === 'text' || ev.target.type === 'textarea') {
      timeReplaceMark(ev.target)
    }
  })
  // 引用地图
  store.dispatch('LoadBaiduMapScript').then(() => render())
}
