import {removeToken, removeRefreshToken} from '@/util/auth'
import {ElMessage} from 'element-plus'
import {setStore, getStore} from '@/util/store'
import {isURL, validatenull} from '@/util/validate'
import {deepClone} from '@/util/util'
import website from '@/config/website'
import {
  loginByUsername,
  loginByPhone,
  loginBySocial,
  getUserInfo,
  logout,
  refreshToken,
  getButtons,
  getAppButtons
} from '@/api/user'
import {getTopMenu, getRoutes, getAppRoutes, getJsonRoutes} from '@/api/system/menu'
import md5 from 'js-md5'
import {defineStore} from 'pinia'

function addPath (ele, first) {
  const menu = website.menu
  const propsConfig = menu.props
  const propsDefault = {
    label: propsConfig.label || 'name',
    path: propsConfig.path || 'path',
    icon: propsConfig.icon || 'icon',
    children: propsConfig.children || 'children'
  }
  const icon = ele[propsDefault.icon]
  ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon
  const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0
  if (!isChild) ele[propsDefault.children] = []
  if (!isChild && first && !isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path] + '/index'
  } else {
    ele[propsDefault.children].forEach((child) => {
      addPath(child)
    })
  }
}

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      tenantId: getStore({name: 'tenantId'}) || '',
      subStation: getStore({name: 'subStation'}) || {},
      userInfo: getStore({name: 'userInfo'}) || [],
      permission: getStore({name: 'permission'}) || {},
      roles: [],
      menu: getStore({name: 'menu'}) || [],
      menuId: getStore({name: 'menuId'}) || [],
      menuAll: getStore({name: 'menuAll'}) || [],
      token: getStore({name: 'token'}) || '',
      refreshToken: getStore({name: 'refreshToken'}) || '',
      appCode: getStore({name: 'appCode'}) || '', // 当前项目code
      dataAuthKey: getStore({name: 'dataAuthKey'}) || '' // 唯一路由key
    }
  },
  actions: {
    // 根据用户名登录
    LoginByUsername (userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(
          userInfo.tenantId,
          userInfo.username,
          md5(userInfo.password),
          userInfo.type,
          userInfo.key,
          userInfo.code
        )
          .then((res) => {
            const data = res.data
            if (data.error_description) {
              ElMessage({
                ElMessage: data.error_description,
                type: 'error'
              })
            } else {
              this._setData(data)
              this.SET_TENANT_ID(data.tenant_id)
            }
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 根据手机号登录
    LoginByPhone (userInfo) {
      return new Promise((resolve) => {
        loginByPhone(userInfo.tenantId, userInfo.phone, userInfo.code, userInfo.key).then((res) => {
          const data = res.data
          if (data.error_description) {
            ElMessage({
              ElMessage: data.error_description,
              type: 'error'
            })
          } else {
            this._setData(data)
          }
          resolve()
        })
      })
    },
    _setData (data) {
      this.SET_TOKEN(data.access_token)
      this.SET_REFRESH_TOKEN(data.refresh_token)
      this.SET_USER_INFO(data)
      this.DEL_ALL_TAG()
      this.CLEAR_LOCK()
    },
    // 根据第三方信息登录
    LoginBySocial (userInfo) {
      return new Promise((resolve) => {
        loginBySocial(userInfo.tenantId, userInfo.source, userInfo.code, userInfo.state).then(
          (res) => {
            const data = res.data
            if (data.error_description) {
              ElMessage({
                ElMessage: data.error_description,
                type: 'error'
              })
            } else {
              this._setData(data)
            }
            resolve()
          }
        )
      })
    },
    // 获取用户信息
    GetUserInfo () {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res) => {
            const data = res.data.data
            this.SET_ROLES(data.roles)
            resolve(data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 刷新token
    refreshToken () {
      window.console.log('handle refresh token')
      return new Promise((resolve, reject) => {
        refreshToken(this.refreshToken, this.tenantId)
          .then((res) => {
            const data = res.data
            this.SET_TOKEN(data.access_token)
            this.SET_REFRESH_TOKEN(data.refresh_token)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 登出
    LogOut () {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            this.SET_TOKEN('')
            this.SET_MENU([])
            this.SET_MENU_ID({})
            this.SET_MENU_ALL([])
            this.SET_ROLES([])
            this.SET_TAG_LIST([])
            this.SET_DATA_AUTH_KEY('')
            this.DEL_ALL_TAG()
            this.CLEAR_LOCK()
            removeToken()
            removeRefreshToken()
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 注销session
    FedLogOut () {
      return new Promise((resolve) => {
        this.SET_TOKEN('')
        this.SET_MENU_ID({})
        this.SET_MENU_ALL([])
        this.SET_MENU([])
        this.SET_ROLES([])
        this.SET_TAG_LIST([])
        this.SET_DATA_AUTH_KEY('')
        this.DEL_ALL_TAG()
        this.CLEAR_LOCK()
        removeToken()
        removeRefreshToken()
        resolve()
      })
    },
    // 获取顶部菜单
    GetTopMenu () {
      return new Promise((resolve) => {
        getTopMenu().then((res) => {
          const data = res.data.data || []
          resolve(data)
        })
      })
    },
    // 获取系统菜单
    GetMenu (topMenuId) {
      return new Promise((resolve) => {
        getRoutes(topMenuId).then((res) => {
          // console.log('导航', res)
          const data = res.data.data
          let menu = deepClone(data)
          menu.forEach((ele) => {
            addPath(ele, true)
          })
          this.SET_MENU_ALL(menu)
          this.SET_MENU(menu)
          this.GetButtons()
          resolve(menu)
        })
      })
    },
    GetJsonRoutes (appCode) {
      return new Promise((resolve) => {
        getJsonRoutes().then((res) => {
          this.SET_APP_CODE(res.data.appCode)
          const menu = res.data.menu
          console.log('GetAppMenu ---------------------', menu)
          menu.forEach((ele) => {
            addPath(ele, true)
          })
          this.SET_MENU_ALL(menu)
          this.SET_MENU(menu)
          resolve(menu)
        })
      })
    },
    // 获取系统菜单
    GetAppMenu (appCode) {
      return new Promise((resolve) => {
        let client = 0 // 0: pc端  1: 手机端
        getAppRoutes(appCode, client).then((res) => {
          // console.log('导航', res)
          const data = res.data.data
          let menu = deepClone(data)
          menu.forEach((ele) => {
            addPath(ele, true)
          })
          this.SET_MENU_ALL(menu)
          this.SET_MENU(menu)
          this.GetAppButtons()
          resolve(menu)
        })
      })
    },
    // 获取系统菜单
    GetAppButtons () {
      return new Promise((resolve) => {
        let client = 0 // 0: pc端   1: 手机端
        getAppButtons(this.appCode, client).then((res) => {
          const data = res.data.data
          this.SET_PERMISSION(data)
          resolve()
        })
      })
    },
    // 获取系统按钮
    GetButtons () {
      return new Promise((resolve) => {
        getButtons().then((res) => {
          const data = res.data.data
          this.SET_PERMISSION(data)
          resolve()
        })
      })
    },
    //

    SET_TOKEN: (token) => {
      // setToken(token);
      this.token = token
      setStore({name: 'token', content: this.token})
    },
    SET_MENU_ID (menuId) {
      this.menuId = menuId
      setStore({name: 'menuId', content: this.menuId})
    },
    SET_MENU_ALL: (menuAll) => {
      this.menuAll = menuAll
      setStore({name: 'menuAll', content: this.menuAll})
    },
    // SET_MENU_APPS: ( menuApps) => {
    //   this.menuApps = menuApps
    //   console.log('menuApps',  this.menuApps)
    //   setStore({name: 'menuApps', content: this.menuApps})
    // },
    SET_MENU: (menu) => {
      this.menu = menu
      setStore({name: 'menu', content: this.menu})
      if (validatenull(menu)) return
      // 合并动态路由去重
      let menuAll = this.menuAll
      menuAll = menuAll.concat(menu).reverse()
      let newMenu = []
      for (let item1 of menuAll) {
        let flag = true
        for (let item2 of newMenu) {
          if (item1.name === item2.name || item1.path === item2.path) {
            flag = false
          }
        }
        if (flag) {
          newMenu.push(item1)
        }
      }
      this.menuAll = newMenu
      setStore({name: 'menuAll', content: this.menuAll})
    },
    SET_APP_CODE: (appCode) => {
      this.appCode = appCode
      setStore({name: 'appCode', content: this.appCode})
    },
    SET_REFRESH_TOKEN: (refreshToken) => {
      // setRefreshToken(refreshToken)
      this.refreshToken = refreshToken
      setStore({name: 'refreshToken', content: this.refreshToken})
    },
    SET_TENANT_ID: (tenantId) => {
      this.tenantId = tenantId
      setStore({name: 'tenantId', content: this.tenantId})
    },
    SET_USER_INFO: (userInfo) => {
      if (validatenull(userInfo.avatar)) {
        userInfo.avatar = '/img/bg/img-logo.png'
      }
      this.userInfo = userInfo
      setStore({name: 'userInfo', content: this.userInfo})
    },
    SET_DATA_AUTH_KEY: (dataAuthKey) => {
      this.dataAuthKey = dataAuthKey
      setStore({name: 'dataAuthKey', content: this.dataAuthKey})
    },
    SET_ROLES: (roles) => {
      this.roles = roles
    },
    SET_PERMISSION: (permission) => {
      let result = []

      function getCode (list) {
        list.forEach((ele) => {
          if (typeof ele === 'object') {
            const chiildren = ele.children
            const code = ele.code
            if (chiildren) {
              getCode(chiildren)
            } else {
              result.push(code)
            }
          }
        })
      }

      getCode(permission)
      this.permission = {}
      result.forEach((ele) => {
        this.permission[ele] = true
      })
      setStore({name: 'permission', content: this.permission})
    }
  }
})
