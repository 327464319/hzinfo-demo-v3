import { createPinia } from 'pinia'
// 持久化处理
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// 引入根据模块创建好的状态管理
import { useMainStore } from './modules/mainStore'
// 创建pinia状态管理对象
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
// 暴露
export { useMainStore }
export default pinia
