import {setStore, getStore, removeStore} from '@/util/store'
import website from '@/config/website'

const common = {
  state: {
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
          resolve(BMap)
          return true
        }
        // 百度地图异步加载回调处理
        window.onBMapCallback = function () {
          console.log('百度地图脚本初始化成功...')
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
      const BMap_URL = `https://api.map.baidu.com/geocoder/v2/?callback=renderReverse&output=json&pois=1&s=1&ak=${AK}`
      ;+'&location=' + address[1] + ',' + address[0]
    }
  },
  mutations: {
    SET_LANGUAGE: (state, language) => {
      state.language = language
      setStore({
        name: 'language',
        content: state.language
      })
    },
    SET_SHADE: (state, active) => {
      state.isShade = active
    },
    SET_COLLAPSE: (state) => {
      state.isCollapse = !state.isCollapse
    },
    SET_FULLSCREN: (state) => {
      state.isFullScren = !state.isFullScren
    },
    SET_IS_MENU: (state, menu) => {
      state.isMenu = menu
    },
    SET_LOCK: (state) => {
      state.isLock = true
      setStore({
        name: 'isLock',
        content: state.isLock,
        type: 'session'
      })
    },
    SET_SCREEN: (state, screen) => {
      state.screen = screen
    },
    SET_COLOR_NAME: (state, colorName) => {
      state.colorName = colorName
      setStore({
        name: 'colorName',
        content: state.colorName
      })
    },
    SET_THEME_NAME: (state, themeName) => {
      state.themeName = themeName
      setStore({
        name: 'themeName',
        content: state.themeName
      })
    },
    SET_FONT_SIZE: (state, fontSize) => {
      state.fontSize = fontSize
      setStore({
        name: 'fontSize',
        content: state.fontSize
      })
    },
    SET_LOCK_PASSWD: (state, lockPasswd) => {
      state.lockPasswd = lockPasswd
      setStore({
        name: 'lockPasswd',
        content: state.lockPasswd,
        type: 'session'
      })
    },
    CLEAR_LOCK: (state) => {
      state.isLock = false
      state.lockPasswd = ''
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
}
export default common
