/**
 * @dec globalProperties包含以下方法还有其他方法未列出有需要自己打印查看有哪些方法
 * @method $router 路由对象
 * @method $route 路由参数
 * @method $pinia 状态管理对象
 * @method $loading loading状态
 * @method $message 参考element ui
 * **********************
 * @dec proxy包含以下方法还有其他方法为列出有需要自己打印查看有哪些方法
 * @method $attrs 接受除prop接收以外的属性
 * @method $el 当前组件
 * @method $emit 自定义事件
 * @method $forceUpdate 刷新页面
 * @method $nextTick 页面渲染完成后调用的钩子
 * @method $parent 获取父组件实例
 * @method $props prop参数
 * @method $refs ref对象
 * @method $watch 监听对象
 * @method $root 所有的父节点
 * @method $slots 作用域插槽
 */
import { ComponentInternalInstance, getCurrentInstance } from 'vue'
export default function useCurrentInstance () {
  const { appContext, proxy } = getCurrentInstance() as ComponentInternalInstance
  const globalProperties = appContext.config.globalProperties
  return {
    globalProperties,
    proxy
  }
}
