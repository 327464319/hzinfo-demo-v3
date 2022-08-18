import { createRouter, createWebHashHistory } from 'vue-router'

// 引入路由
import routes from './moudles'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
