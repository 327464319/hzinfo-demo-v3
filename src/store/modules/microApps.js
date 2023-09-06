export default {
  state: {
    microAppHtml: '',
    loading: false,
    __POWERED_BY_QIANKUN__: null
  },
  mutations: {
    setMicroAppHtml (state, microAppHtml) {
      state.microAppHtml = microAppHtml
    },
    setLoading (state, loading) {
      state.loading = loading
    },
    setPoweredByQiankun (state, poweredByQiankun) {
      state.__POWERED_BY_QIANKUN__ = poweredByQiankun
    }
  },
  getters: {},
  actions: {}
}
