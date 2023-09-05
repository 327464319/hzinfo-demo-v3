/**
 * 全局配置文件
 */
export default {
  title: `${systemInfo.title}`,
  logo: `${systemInfo.indexLogo}`,
  key: 'saber',//配置主键,目前用于存储
  indexTitle: `${systemInfo.indexTitle}`,
  clientId: 'saber', // 客户端id
  clientSecret: 'saber_secret', // 客户端密钥
  tenantMode: systemInfo.tenantMode, // 是否开启租户模式
  tenantId:  `${systemInfo.tenantId}`, // 管理组租户编号
  captchaMode:  systemInfo.captchaMode, // 是否开启验证码模式
  lockPage: '/lock',
  tokenTime: 3000,
  tokenHeader: 'Blade-Auth',
  //http的status默认放行列表
  statusWhiteList: [],
  //配置首页不可关闭
  isFirstPage: false,
  fistPage: {
      label: "首页",
      value: "/home/index",
      params: {},
      query: {},
      meta: {
        i18n: 'dashboard'
      },
      group: [],
      close: false
  },
  //配置菜单的属性
  menu: {
    iconDefault: 'iconfont icon-caidan',
    props: {
      label: 'name',
      path: 'path',
      icon: process.env.NODE_ENV == 'development' ? 'icon' : 'source',
      children: 'children'
    }
  },
  // 第三方系统授权地址
  authUrl:  `${systemInfo.authUrl}`,
  // 流程设计器地址
  flowDesignUrl:  `${systemInfo.flowDesignUrl}`,
  isDev: process.env.NODE_ENV == 'development' ? true : false
}
