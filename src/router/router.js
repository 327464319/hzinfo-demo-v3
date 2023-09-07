/**
 * 全站路由配置
 *
 * meta参数说明
 * keepAlive是否缓冲页面
 * isTab是否加入到tag导航
 * isAuth是否需要授权R
 */
import {createRouter as createRou, createWebHistory} from 'vue-router'
import apps from '../mock/menu-apps'
// import {qiankunWindow} from 'vite-plugin-qiankun/dist/helper'
import PageRouter from './page/' // 页面路由
import ViewsRouter from './views/' // 页面路由
 import ViewsSubRouter from './sub-page/' // 封装的路由控制方法
import AvueRouter from './avue-router' // 封装的路由控制方法
import i18n from '@/lang' // Internationalization 国际化 多语言

import Store from '../store/' // vuex
import {name} from '../../package.json'
console.log(20)

Store.commit('setPoweredByQiankun', window.__POWERED_BY_QIANKUN__)
console.log( window.__POWERED_BY_QIANKUN__)
 // 创建路由
let Router
// let history = null
// 创建路由
// if (!Store.state.microApps.__POWERED_BY_QIANKUN__) {
//   AvueRouter.install({
//     store: Store,
//     router: Router,
//     i18n
//   })
//
//   Router.$avueRouter.formatRoutes(Store.getters.menuAll, true)
// } else {
//   history = createWebHistory('/')
//   Router = createRou({
//     base: '/',
//     history,
//     routes: [...ViewsRouter, ...PageRouter, ...ViewsSubRouter]
//   })
// }
//
// // 创建路由
export const createRouter = () =>
{
  console.log([...PageRouter, ...ViewsRouter])
  console.log(createRou)
  console.log(import.meta.env)
  console.log(window.__POWERED_BY_QIANKUN__ )
  console.log(createWebHistory(import.meta.env.MODE == 'development' || window.__POWERED_BY_QIANKUN__ ? '/' : `/${name}`))
  return createRou({
    // https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html#%E5%BC%82%E6%AD%A5%E6%BB%9A%E5%8A%A8
    // 这个方法 是控制滚动条
    // 如果 retuen falsy || {} ,则不发生滚动
    // mode: "hash",
    history: createWebHistory(import.meta.env.MODE == 'development' || window.__POWERED_BY_QIANKUN__ ? '/' : `/${name}`),
    scrollBehavior (to, from, savedPosition) {
      // savedPosition 这个参数当且仅当导航 (通过浏览器的 前进/后退 按钮触发) 时才可用  效果和 router.go() 或 router.back()
      if (savedPosition) {
        // 返回savedPosition 其实就是 当用户点击 返回的话，保持之前游览的高度
        return savedPosition
      } else {
        if (from.meta.keepAlive) {
          from.meta.savedPosition = document.body.scrollTop
        }
        return {
          x: 0,
          y: to.meta.savedPosition || 0
        }
      }
    },
    routes: [...PageRouter, ...ViewsRouter]
  })
}

console.log(71)
// let Router
if (!Store.state.microApps.__POWERED_BY_QIANKUN__) {
  console.log(74)
  Router = createRouter() // 获得 route 实例
  console.log(76)
  AvueRouter.install({
    store: Store,
    router: Router,
    i18n
  }) // 初始化和注册 AvueRouter
  let menuAll = Store.state.user.menuAll
  menuAll = menuAll.concat(apps)
  Store.commit('SET_MENU_ALL', menuAll)
  // Store.commit('SET_MENU', menuAll);
  Router.$avueRouter.formatRoutes(menuAll, true) // 动态路由核心方法

  PageRouter.forEach((ele) => Router.addRoute(ele))
  ViewsRouter.forEach((ele) => Router.addRoute(ele))
  console.log(86)
} else {
  Router =   createRou({
    // https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html#%E5%BC%82%E6%AD%A5%E6%BB%9A%E5%8A%A8
    // 这个方法 是控制滚动条
    // 如果 retuen falsy || {} ,则不发生滚动
    // mode: "hash",
    base: import.meta.env.MODE == 'development' || window.__POWERED_BY_QIANKUN__ ? '/' : `/${name}`,
    history: createWebHistory(),
    routes: [...ViewsRouter, ...PageRouter, ...ViewsSubRouter]
  })
    //
  console.log(97)

}

export function resetRouter () {
  // 重置路由 比如用于身份验证失败，需要重新登录时 先清空当前的路有权限
  const newRouter = createRouter()
  Router.matcher = newRouter.matcher // reset router
  AvueRouter.install({
    store: Store,
    router: newRouter,
    i18n
  })
}

console.log(Router.getRoutes())

console.log('router.js end')

export default Router
