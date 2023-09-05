import {createRouter, createWebHistory} from 'vue-router'
import {name} from '../../package.json'

// 引入路由
import routes from './moudles'

const router = createRouter({
  history: createWebHistory(`/${name}`),
  routes
})
export default router
