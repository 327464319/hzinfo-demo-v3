import { removeToken, removeRefreshToken} from '@/util/auth'
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

const user = {
  state: {
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
  },
  actions: {
    // 根据用户名登录
    LoginByUsername ({commit}, userInfo) {
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
              commit('SET_TOKEN', data.access_token)
              commit('SET_REFRESH_TOKEN', data.refresh_token)
              commit('SET_TENANT_ID', data.tenant_id)
              commit('SET_USER_INFO', data)
              commit('DEL_ALL_TAG')
              commit('CLEAR_LOCK')
            }
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 根据手机号登录
    LoginByPhone ({commit}, userInfo) {
      return new Promise((resolve) => {
        loginByPhone(userInfo.tenantId, userInfo.phone, userInfo.code, userInfo.key).then((res) => {
          const data = res.data
          if (data.error_description) {
            ElMessage({
              ElMessage: data.error_description,
              type: 'error'
            })
          } else {
            commit('SET_TOKEN', data.access_token)
            commit('SET_REFRESH_TOKEN', data.refresh_token)
            commit('SET_USER_INFO', data)
            commit('DEL_ALL_TAG')
            commit('CLEAR_LOCK')
          }
          resolve()
        })
      })
    },
    // 根据第三方信息登录
    LoginBySocial ({commit}, userInfo) {
      return new Promise((resolve) => {
        loginBySocial(userInfo.tenantId, userInfo.source, userInfo.code, userInfo.state).then(
          (res) => {
            const data = res.data
            if (data.error_description) {
              ElMessage({
                message: data.error_description,
                type: 'error'
              })
            } else {
              commit('SET_TOKEN', data.access_token)
              commit('SET_REFRESH_TOKEN', data.refresh_token)
              commit('SET_USER_INFO', data)
              commit('DEL_ALL_TAG')
              commit('CLEAR_LOCK')
            }
            resolve()
          }
        )
      })
    },
    // 获取用户信息
    GetUserInfo ({commit}) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res) => {
            const data = res.data.data
            commit('SET_ROLES', data.roles)
            resolve(data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 刷新token
    refreshToken ({state, commit}) {
      window.console.log('handle refresh token')
      return new Promise((resolve, reject) => {
        refreshToken(state.refreshToken, state.tenantId)
          .then((res) => {
            const data = res.data
            commit('SET_TOKEN', data.access_token)
            commit('SET_REFRESH_TOKEN', data.refresh_token)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 登出
    LogOut ({commit}) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_MENU', [])
            commit('SET_MENU_ID', {})
            commit('SET_MENU_ALL', [])
            commit('SET_ROLES', [])
            commit('SET_TAG_LIST', [])
            commit('SET_DATA_AUTH_KEY', '')
            commit('DEL_ALL_TAG')
            commit('CLEAR_LOCK')
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
    FedLogOut ({commit}) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_MENU_ID', {})
        commit('SET_MENU_ALL', [])
        commit('SET_MENU', [])
        commit('SET_ROLES', [])
        commit('SET_TAG_LIST', [])
        commit('SET_DATA_AUTH_KEY', '')
        commit('DEL_ALL_TAG')
        commit('CLEAR_LOCK')
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
    GetMenu ({commit, dispatch}, topMenuId) {
      return new Promise((resolve) => {
        getRoutes(topMenuId).then((res) => {
          // console.log('导航', res)
          const data = res.data.data
          let menu = deepClone(data)
          menu.forEach((ele) => {
            addPath(ele, true)
          })
          commit('SET_MENU_ALL', menu)
          commit('SET_MENU', menu)
          dispatch('GetButtons')
          resolve(menu)
        })
      })
    },
    GetJsonRoutes ({commit, dispatch}, appCode) {
      return new Promise((resolve) => {
        getJsonRoutes().then((res) => {
          commit('SET_APP_CODE', res.data.appCode)
          const menu = res.data.menu
          menu.forEach((ele) => {
            addPath(ele, true)
          })
          commit('SET_MENU_ALL', menu)
          commit('SET_MENU', menu)
          resolve(menu)
        })
      })
    },
    // 获取系统菜单
    GetAppMenu ({commit, dispatch}, appCode) {
      return new Promise((resolve) => {
        let client = 0 // 0: pc端  1: 手机端
        getAppRoutes(appCode, client).then((res) => {
          // console.log('导航', res)
          const data = res.data.data
          let menu = deepClone(data)
          menu.forEach((ele) => {
            addPath(ele, true)
          })
          commit('SET_MENU_ALL', menu)
          commit('SET_MENU', menu)
          dispatch('GetAppButtons')
          resolve(menu)
        })
      })
    },
    // 获取系统菜单
    GetAppButtons ({commit, state}) {
      return new Promise((resolve) => {
        let client = 0 // 0: pc端   1: 手机端
        getAppButtons(state.appCode, client).then((res) => {
          const data = res.data.data
          commit('SET_PERMISSION', data)
          resolve()
        })
      })
    },
    // 获取系统按钮
    GetButtons ({commit}) {
      return new Promise((resolve) => {
        getButtons().then((res) => {
          const data = res.data.data
          commit('SET_PERMISSION', data)
          resolve()
        })
      })
    }
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      // setToken(token);
      state.token = token
      setStore({name: 'token', content: state.token})
    },
    SET_MENU_ID (state, menuId) {
      state.menuId = menuId
      setStore({name: 'menuId', content: state.menuId})
    },
    SET_MENU_ALL: (state, menuAll) => {
      state.menuAll = menuAll
      setStore({name: 'menuAll', content: state.menuAll})
    },
    // SET_MENU_APPS: (state, menuApps) => {
    //   state.menuApps = menuApps
    //   console.log('menuApps',  state.menuApps)
    //   setStore({name: 'menuApps', content: state.menuApps})
    // },
    SET_MENU: (state, menu) => {
      state.menu = menu
      setStore({name: 'menu', content: state.menu})
      if (validatenull(menu)) return
      // 合并动态路由去重
      let menuAll = state.menuAll
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
      state.menuAll = newMenu
      setStore({name: 'menuAll', content: state.menuAll})
    },
    SET_APP_CODE: (state, appCode) => {
      state.appCode = appCode
      setStore({name: 'appCode', content: state.appCode})
    },
    SET_REFRESH_TOKEN: (state, refreshToken) => {
      // setRefreshToken(refreshToken)
      state.refreshToken = refreshToken
      setStore({name: 'refreshToken', content: state.refreshToken})
    },
    SET_TENANT_ID: (state, tenantId) => {
      state.tenantId = tenantId
      setStore({name: 'tenantId', content: state.tenantId})
    },
    SET_USER_INFO: (state, userInfo) => {
      if (validatenull(userInfo.avatar)) {
        userInfo.avatar = '/img/bg/img-logo.png'
      }
      state.userInfo = userInfo
      setStore({name: 'userInfo', content: state.userInfo})
    },
    SET_DATA_AUTH_KEY: (state, dataAuthKey) => {
      state.dataAuthKey = dataAuthKey
      setStore({name: 'dataAuthKey', content: state.dataAuthKey})
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSION: (state, permission) => {
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
      state.permission = {}
      result.forEach((ele) => {
        state.permission[ele] = true
      })
      setStore({name: 'permission', content: state.permission})
    }
  }
}
export default user
