import axios from 'axios'
import Storage from './storage'
import { ElMessage } from 'element-plus'
const createService = (baseURL:string) => {
  // 基础配置，时间
  const _axios = axios.create({
    timeout: 5 * 60 * 1000, // 超时时间
    baseURL
  })
  let token = Storage.localGet('project-token')
  // 在发送请求之前
  _axios.interceptors.request.use(config => {
    if (token) {
      (config.headers as any)['project-token'] = token
    }
    return config
  }, err => {
    return Promise.reject(err)
  })

  /**
   * @desc http response 拦截器
   * @response data.code 接口返回的状态码（具体视接口返回而定），
   * 若为0则请求成功则返回数据，若为10001则代表token过期需退出登录
   * 否则则代表请求失败
   */
  _axios.interceptors.response.use(response => {
      if (response.data.code === 0) {
        return response.data
      } else if (response.data.code === 10001) {
        ElMessage({
          type: 'error',
          message: response.data.errorMsg
        })
        return Promise.reject(response.data)
      } else {
        ElMessage({
          type: 'error',
          message: response.data.errorMsg
        })
        return Promise.reject(response.data)
      }
    },
    error => {
      console.log(error)
      return Promise.reject(error.response.data)
  })
  return _axios
}
export const authServer = createService(import.meta.env.VITE_BASE_API || '')
