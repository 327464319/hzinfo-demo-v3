import {createPinia} from 'pinia'
// 持久化处理
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// 引入根据模块创建好的状态管理
import {useMainStore} from './modules/mainStore'
import {useCommonStore} from './modules/common'
import {useDictStore} from './modules/dict'
import {useMicroAppsStore} from './modules/microApps'
import {useNavsStore} from './modules/tags'
import {useUserStore} from './modules/user'

// 创建pinia状态管理对象
const pinia = createPinia()
// pinia.use(piniaPluginPersistedstate)
// 暴露
export {useMainStore, useCommonStore, useDictStore, useMicroAppsStore, useNavsStore, useUserStore}
export default pinia
