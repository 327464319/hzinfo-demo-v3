import {defineStore} from 'pinia'

export const useMicroAppsStore = defineStore('microApps', {
  state: () => {
    return {
      microAppHtml: '',
      loading: false,
      __POWERED_BY_QIANKUN__: null
    }
  },
  actions: {
    setMicroAppHtml (microAppHtml) {
      this.microAppHtml = microAppHtml
    },
    setLoading (loading) {
      this.loading = loading
    },
    setPoweredByQiankun (poweredByQiankun) {
      this.__POWERED_BY_QIANKUN__ = poweredByQiankun
    }
  }
})
