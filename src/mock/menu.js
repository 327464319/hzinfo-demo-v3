import Mock from 'mockjs'

const top = [
  {
    label: '首页',
    path: '/home/index',
    icon: 'el-icon-menu',
    meta: {
      i18n: 'home'
    },
    parentId: 0
  }
]
export default ({mock}) => {
  if (!mock) return
  Mock.mock('/user/getTopMenu', 'get', () => {
    return {
      data: top
    }
  })
}
