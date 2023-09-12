
import './public-path'; // qiankun
import {createApp} from 'vue'
import website from './config/website'
import {renderWithQiankun, qiankunWindow} from 'vite-plugin-qiankun/dist/helper'
import App from './App.vue'
import axios from './router/axios'
import VueAxios from 'vue-axios';
// 引入路由

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

import {timeReplaceMark} from './util/valid'

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
instance.use(VueAxios)
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
  // 监听输入字符限制
  document.addEventListener('input', function (ev) {
    if(ev.target.type === 'text' || ev.target.type === 'textarea'){
      timeReplaceMark(ev.target);
    }
  })
  // 引用地图
  store.dispatch("LoadBaiduMapScript");

  setTimeout(() => {
    // 引用地图加载
    render();
  }, 200)
}
