import { RouteRecordRaw } from 'vue-router'
let indexConfig:RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/base/child/one'
  },
  {
    path: '/base/child/one',
    component: () => import('@/views/Home/Home.vue'),
    meta: {
      active: 'childOne'
    }
  }
]
// 暴露出去一个route希望得到的路由结构
export default indexConfig
