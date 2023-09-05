import { createApp } from 'vue'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import App from './App.vue'
// 引入路由
import {name} from '../package.json'
import routes from './router'
import {createRouter, createWebHistory} from 'vue-router'
// pinia
import pinia from './store'
// 引入路由
let instance: any = null
let history:any = null
let router:any = null

function render (props: any = {}) {
  const { container } = props
  history = createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? `/${name}` : '/')
  router = createRouter({
    history,
    routes
  })
  instance = createApp(App)
  instance.use(router)
  instance.use(pinia)
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
    history.destroy() // 不卸载  router 会导致其他应用路由失败
    router = null
    instance = null
  }
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
}
