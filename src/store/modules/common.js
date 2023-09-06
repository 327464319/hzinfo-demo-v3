import {defineStore} from 'pinia'
import {setStore, getStore, removeStore} from '@/util/store'
import website from '@/config/website'
export const useCommonStore = defineStore('common', {
  // 所有数据持久化
  // persist: true,
  // 持久化存储插件其他配置
  // persist: {
  //   // 修改存储中使用的键名称，默认为当前 Store的 id
  //   key: 'storekey',
  //   // 修改为 sessionStorage，默认为 localStorage
  //   storage: window.sessionStorage
  // },
  state: () => {
    return {
      language: getStore({name: 'language'}) || 'zh',
      isCollapse: false,
      isFullScren: false,
      isMenu: true,
      isShade: false,
      screen: -1,
      isLock: getStore({name: 'isLock'}) || false,
      showTag: true,
      showDebug: false,
      showCollapse: true,
      showSearch: true,
      showLock: false,
      showFullScren: true,
      showTheme: true,
      showMenu: true,
      showColor: true,
      colorName: getStore({name: 'colorName'}) || '#409EFF',
      themeName: getStore({name: 'themeName'}) || 'theme-default',
      fontSize: getStore({name: 'fontSize'}) || 'font-default',
      lockPasswd: getStore({name: 'lockPasswd'}) || '',
      website
    }
  },
  actions: {
    LoadBaiduMapScript () {
      console.log('初始化百度地图脚本...')
      const AK = 'kD85mraCGVXolFT1qcBxz8WtQb7NwxLs&qq-pf-to=pcqq.c2c'
      const BMap_URL =
        'https://api.map.baidu.com/api?v=2.0&ak=' + AK + '&s=1&callback=onBMapCallback'
      // const BMap_URL = `http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&output=json&pois=1&ak=${AK}`;
      //  + "&location=" + address[1] + "," + address[0]
      return new Promise((resolve, reject) => {
        // 如果已加载直接返回
        if (typeof BMap !== 'undefined') {
          // eslint-disable-next-line no-undef
          resolve(BMap)
          return true
        }
        // 百度地图异步加载回调处理
        window.onBMapCallback = function () {
          console.log('百度地图脚本初始化成功...')
          // eslint-disable-next-line no-undef
          resolve(BMap)
        }
        // 插入script脚本
        let scriptNode = document.createElement('script')
        scriptNode.setAttribute('type', 'text/javascript')
        scriptNode.setAttribute('src', BMap_URL)
        document.body.appendChild(scriptNode)
      })
    },
    getAddressByLnglat () {
      // eslint-disable-next-line no-undef,no-unused-vars
      const BMap_URL = `https://api.map.baidu.com/geocoder/v2/?callback=renderReverse&output=json&pois=1&s=1&ak=${AK}`
      // eslint-disable-next-line no-undef,no-unused-expressions
      ;+'&location=' + address[1] + ',' + address[0]
    },
    SET_LANGUAGE: (language) => {
      this.language = language
      setStore({
        name: 'language',
        content: this.language
      })
    },
    SET_SHADE: (active) => {
      this.isShade = active
    },
    SET_COLLAPSE: () => {
      this.isCollapse = !this.isCollapse
    },
    SET_FULLSCREN: () => {
      this.isFullScren = !this.isFullScren
    },
    SET_IS_MENU: (menu) => {
      this.isMenu = menu
    },
    SET_LOCK: () => {
      this.isLock = true
      setStore({
        name: 'isLock',
        content: this.isLock,
        type: 'session'
      })
    },
    SET_SCREEN: (screen) => {
      this.screen = screen
    },
    SET_COLOR_NAME: (colorName) => {
      this.colorName = colorName
      setStore({
        name: 'colorName',
        content: this.colorName
      })
    },
    SET_THEME_NAME: (themeName) => {
      this.themeName = themeName
      setStore({
        name: 'themeName',
        content: this.themeName
      })
    },
    SET_FONT_SIZE: (fontSize) => {
      this.fontSize = fontSize
      setStore({
        name: 'fontSize',
        content: this.fontSize
      })
    },
    SET_LOCK_PASSWD: (lockPasswd) => {
      this.lockPasswd = lockPasswd
      setStore({
        name: 'lockPasswd',
        content: this.lockPasswd,
        type: 'session'
      })
    },
    CLEAR_LOCK: () => {
      this.isLock = false
      this.lockPasswd = ''
      removeStore({
        name: 'lockPasswd',
        type: 'session'
      })
      removeStore({
        name: 'isLock',
        type: 'session'
      })
    }
  }
})
