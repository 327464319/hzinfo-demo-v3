import {createApp} from 'vue'
import website from './config/website'
import {renderWithQiankun, qiankunWindow} from 'vite-plugin-qiankun/dist/helper'
import App from './App.vue'
import axios from './router/axios'
// 引入路由

// pinia
// import pinia from './store'
import store from './store'
import i18n from './lang/'
import { language, messages } from './lang/';
// import 'element-plus/dist/index.css'
import router from './router/router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';
import './styles/common.scss';

import basicContainer from './components/basic-container/main'

// 引入路由
let instance: any = null
instance = createApp(App)
instance.component('basic-container', basicContainer);
// instance.use(i18n)
instance.use(ElementPlus,{
  locale: messages[language]
})
instance.use(Avue, {
  axios,
  calcHeight: -165,
  locale: messages[language]
})
instance.use(router)
instance.use(i18n)
instance.use(store)
instance.config.globalProperties.website = website




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
  render()
}
