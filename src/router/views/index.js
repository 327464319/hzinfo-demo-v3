import Layout from '@/page/index/'

export default [{
  path: '/home',
  component: Layout,
  redirect: '/home/index',
  children: [{
    path: 'index',
    name: '首页',
    meta: {
      i18n: 'dashboard'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/home/index')
  }]
}]
