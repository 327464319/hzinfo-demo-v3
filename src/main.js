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

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

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

import {name} from "../package.json";

// 引入路由
let instance = null


// 动态加载阿里云字体库
iconfontVersion.forEach((ele) => {
  loadStyle(iconfontUrl.replace('$key', ele))
})

function storeTest(props) {
  props.onGlobalStateChange &&
  props.onGlobalStateChange(
    (value, prev) => {
      console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev);
      if (value.themeName) store.commit('SET_THEME_NAME', value.themeName);
      if (value.fontSize) store.commit('SET_FONT_SIZE', value.fontSize);
      if (value.colorName) store.commit('SET_COLOR_NAME', value.colorName);
    },
    true,
  );
  props.setGlobalState &&
  props.setGlobalState({
    ignore: props.name,
    user: {
      name: props.name,
    },
  });
}

function render(props) {
  const {container,emitFnc} = props

  instance = createApp(App)


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
    .use(i18n)
    .use(store)
    .use(router)
  instance.config.globalProperties.website = website

  instance.component('basic-container', basicContainer)
  instance.component('basic-block', basicBlock)
  instance.component('third-register', thirdRegister)

  // 注册所有图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    instance.component(key, component)
  }

  setupCache(instance)
  setupError(instance)

// 加载相关url地址
  Object.keys(urls).forEach((key) => {
    instance.config.globalProperties[key] = urls[key]
  })

  // 设置appCode
  store.commit('SET_APP_CODE', name);
  store.commit('setPoweredByQiankun', qiankunWindow.__POWERED_BY_QIANKUN__);
   if(instance?.config){
     Object.keys(emitFnc || {}).forEach(i => {
       instance.config.globalProperties[`$${i}`] = emitFnc[i]
     });
   }

  instance.mount(container ? container.querySelector('#app') : '#app')
}
renderWithQiankun({
  mount(props) {
    console.log('[vue] props from main framework', props);
    storeTest(props);
    render(props)
  },
  bootstrap() {
    console.log('%c', 'color:green;', ' ChildOne bootstrap')
  },
  update() {
    console.log('%c', 'color:green;', ' ChildOne update')
  },
  unmount(props) {
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
  store.dispatch('LoadBaiduMapScript').then(() => render({}))
}
