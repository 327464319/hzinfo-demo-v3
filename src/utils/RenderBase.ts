import { useMainStore } from '@/store/index'
// 定义loader方法，loading改变时，将变量赋值给App.vue的data中的isLoading
function loader (loading:boolean) {
  const $store = useMainStore()
  $store.loadingChange(loading)
}

export default loader
