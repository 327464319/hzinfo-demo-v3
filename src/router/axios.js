/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios'
import store from '@/store/'
// import router from '@/router/router'
import {serialize} from '@/util/util'
import {getStorageToken} from '@/util/auth'
// import {ElMessage} from 'element-plus'
import website from '@/config/website'
import {Base64} from 'js-base64'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import {getStore} from '@/util/store'

// 默认超时时间
axios.defaults.timeout = 10000
// 返回其他状态码
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500
}
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
// NProgress 配置
NProgress.configure({
  showSpinner: false
})
// http request拦截
axios.interceptors.request.use(
  (config) => {
    // 开启 progress bar
    NProgress.start()
    const meta = config.meta || {}
    const isToken = meta.isToken === false
    config.headers.Authorization = `Basic ${Base64.encode(
      `${website.clientId}:${website.clientSecret}`
    )}`
    // 让每个请求携带token
    if (getStorageToken() && !isToken) {
      config.headers[website.tokenHeader] = 'bearer ' + getStorageToken()

      config.headers['data-auth-key'] = getStore({name: 'dataAuthKey'})
    }
    let subStation = store.getters.subStation
    if (subStation && JSON.stringify(subStation) != '{}') {
      config.headers['tenant-id'] = subStation.tenantId
      config.headers['dept-id'] = subStation.deptId
    }
    // headers中配置text请求
    if (config.text === true) {
      config.headers['Content-Type'] = 'text/plain'
    }
    // headers中配置serialize为true开启序列化
    if (config.method === 'post' && meta.isSerialize === true) {
      config.data = serialize(config.data)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// http response 拦截
axios.interceptors.response.use(
  (res) => {
    // 关闭 progress bar
    NProgress.done()
    // 获取状态码
    const status = res.data.code || res.status
    const statusWhiteList = website.statusWhiteList || []
    const message = res.data.msg || res.data.error_description || '未知错误'
    // 如果在白名单里则自行catch逻辑处理
    if (statusWhiteList.includes(status)) return Promise.reject(res)
    // 如果是401则跳转到登录页面
    if (status === 401) {
      store.dispatch('FedLogOut').then(() => {
        // router.push({path: '/login'})
        let path = '/login'
        let href = window.location.port
          ? `//${window.location.hostname}:${window.location.port}${path}`
          : `//${window.location.hostname}${path}`
        window.location.href = href
      })
    }
    // 如果请求为非200否者默认统一处理
    if (status !== 200) {
      ElMessage({
        message,
        type: 'error'
      })
      return Promise.reject(new Error(message))
    }
    return res
  },
  (error) => {
    NProgress.done()
    return Promise.reject(new Error(error))
  }
)

export default axios
