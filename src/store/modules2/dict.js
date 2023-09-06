import {getStore, setStore} from '@/util/store'
import {defineStore} from 'pinia'
import {getDictionary} from '@/api/system/dict'

export const useDictStore = defineStore('dict', {
  state: () => {
    return {
      flowRoutes: getStore({name: 'flowRoutes'}) || {}
    }
  },
  actions: {
    // 发送错误日志
    FlowRoutes () {
      return new Promise((resolve, reject) => {
        getDictionary({code: 'flow'})
          .then((res) => {
            this.SET_FLOW_ROUTES(res.data.data)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    SET_FLOW_ROUTES: (data) => {
      this.flowRoutes = data.map((item) => {
        return {
          routeKey: `${item.code}_${item.dictKey}`,
          routeValue: item.remark
        }
      })
      setStore({name: 'flowRoutes', content: this.flowRoutes})
    }
  }
})
