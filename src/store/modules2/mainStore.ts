import { defineStore } from 'pinia'
export const useMainStore = defineStore('main', {
  // 所有数据持久化
  // persist: true,
  // 持久化存储插件其他配置
  persist: {
    // 修改存储中使用的键名称，默认为当前 Store的 id
    key: 'storekey',
    // 修改为 sessionStorage，默认为 localStorage
    storage: window.sessionStorage
  },
  state: () => {
    return {
      someState: <string>'hello pinia',
      loading: <boolean>false
    }
  },
  actions: {
    loadingChange (loading:boolean) {
      this.loading = loading
    }
  }
})
